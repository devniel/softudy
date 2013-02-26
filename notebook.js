var http = require('http');
var express = require('express');
var qs = require('querystring');
var io = require('socket.io');
var redis = require("redis");
var RedisStore = require('connect-redis');
const fbId = "158363927547131";
const fbSecret = "4131eae5478721e4c508bf736e249745";
const fbCallbackAddress= "http://www.stendev.com/auth/facebook";
var auth= require('connect-auth');

client_redis = redis.createClient();

exports.start = function(req,res) {
			
			
	client_redis.hgetall("student:" + sd.query.id,function(err,reply){
				
	// REPLY IS STUDENT INFO
			
	client_redis.hgetall("student:" + sd.query.id + ":slate",function(err,reply2){
	
	res.render('notebook.ejs',{
		layout:false,
		locals:{
			site : "stendev",
			student : req.session.student,
			nb_student : reply,
			nb_pages : reply2,
			route : 'notebook',
		}
	});
	
	});
	
	});
	
}

exports.saved = function(req,res){

	
	client_redis.hget("student:" + req.session.student.id,'pages',function(err,reply){
		
		var multi = client_redis.multi();
		
		for(var i=1;i<=reply;i++){
			multi.hgetall("student:" + req.session.student.id + ":page:" + i);
		}
		
		multi.exec(function(err,replies){			
		
							console.log(replies);
							
							res.writeHead(200,{'Content-Type':'text/html'});
							//res.end(replies);
							
							var table = "<table>";
							
							table += '<thead>'+
										'<td>Nombre</td>'+
										'<td>Fecha</td>'+
									 '</thead>'+
									 '<tbody>';
									 
								for(x in replies){
									table += '<tr class="pageSaved" data-id="' + replies[x].id + '">'+
												'<td class="name"><span class="typefile"></span>' + replies[x].name +
												'<span class="buttons">'+
												'<ul>'+
												'<li class="delete"></li>'+
												'<li class="share"></li>'+
												'<li class="view"</li>'+
												'</ul>'+   
												'</span>'+
												'</td>'+
												'<td class="date">' + replies[x].date + '</td>'+
											  '</tr>';
								}
								
								table += '</tbody>'+
										 '</table>';
										 								
							res.end(table);
				});
				
	});
}
	
