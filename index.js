var http = require('http');
var express = require('express');
var qs = require('querystring');
var io = require('socket.io');
var redis = require("redis");
var RedisStore = require('connect-redis');
const fbId = "158363927547131";
const fbSecret = "4131eae5478721e4c508bf736e249745";
const fbCallbackAddress= "http://localhost:1111/auth/facebook";
var auth= require('connect-auth');
var translate = require('translate');
var client_redis = redis.createClient();

exports.page = function(req,res){
	
	if(typeof req.session.student == "undefined"){
		
		client_redis.get("id",function(err,reply){
			rid = Math.round((Math.random() * (reply - 1)) + 1);
			client_redis.hget("student:" + rid,"pages",function(err,reply2){
				rpage =  Math.round((Math.random() * (reply2 - 1)) + 1);
				client_redis.hget("student:" + rid + ":page:" + rpage , "record",function(err,reply){
							res.render('index.ejs',{
								layout:false,
								locals:{
								 site : "stendev",
								 style : "/styles/index.css",
								 draw : reply
								 }});
				});
			});
		});
	}
	else
	{	 	
		client_redis.send_command("sort",["courses","BY","course:*->students","DESC"],function(err,reply){
			
			console.log(reply);
			
			var sorted = reply;
			
			multi = client_redis.multi();
			
			for(i=0;i<=4;i++){
							multi.hgetall("course:" + sorted[i]);
			}
			
			multi.exec(function(err,replies){
				
				client_redis.hget("student:" + req.session.student.id,"courses",function(err,reply2){
					
					multi2 = client_redis.multi();
					
					for(i=1;i<=reply2;i++){
						multi.hgetall("student:" + req.session.student.id + ":course:" + i);
					}
					
					multi2.exec(function(err,replies2){

						// PAGE
						res.render('me.ejs',{
									layout:false,
									locals:{
									site : "stendev",
									style : "/styles/index.css",
									student : req.session.student,
									suggest_courses : replies,
									courses : replies2
									}
							});	// END PAGE	
					});
				});
			});
			
			
		});								
	}
}