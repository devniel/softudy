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


// News Page
exports.studying = function(req,res){
	
	var studying = req.body.studying;
	
	req.session.student.studying = studying;
	
	client_redis.hget(studying,"posts",function(err,reply){
		
		multi = client_redis.multi();
				
				i = 1;
				
				for(i=1;i<=reply;i++){
					multi.hgetall(studying + ":post:" + i);
				}
				
				multi.exec(function(err,replies){
					console.log(replies.length);		
					res.render('news.ejs',{
							layout:false,
							locals:{
							site : "stendev",
							student : req.session.student,
							route : 'news',
							salon : "Your dashboard",
							posts : replies
							}});
				}); 
		
	});	
}
exports.slate = function(req,res,sd){
	
			if(typeof sd.query.id != "undefined"){
			
			var posts = {dataQuestions : null, action : null};
			
			client_redis.hgetall("student:" + sd.query.id,function(err,reply){
				
				// REPLY IS STUDENT INFO
			
				client_redis.hgetall("student:" + sd.query.id + ":slate",function(err,reply2){
					
					multi = client_redis.multi();
					
					i = 1;
					
					for(i=1;i<=reply2.posts;i++){
						multi.hgetall("student:" + sd.query.id + ":slate:post:" + i);
					}
					
					multi.exec(function(err,replies){			
						res.render('news.ejs',{
								layout:false,
								locals:{
								site : "stendev",
								student : req.session.student,
								course : reply,
								route : 'news',
								posts : replies
								}});
					});
				});
			});
			}
			else if(typeof sd.query.course != "undefined"){
			
			client_redis.hgetall("course:" + sd.query.course,function(err,reply){
				
				// REPLY IS THE COURSE INFO
			
				client_redis.hgetall("course:" + sd.query.course + ":slate",function(err,reply2){
					
					multi = client_redis.multi();
					
					i = 1;
					
					for(i=1;i<=reply2.posts;i++){
						multi.hgetall("course:" + sd.query.id + ":slate:post:" + i);
					}
					
					multi.exec(function(err,replies){			
						res.render('news.ejs',{
								layout:false,
								locals:{
								site : "stendev",
								student : req.session.student,
								course : reply,
								route : 'news',
								posts : replies
								}});
					});
				});
			});
				
			}
};


// School Page

exports.school = function(req,res){
	
	// List of students
	client_redis.get('id',function(err,reply){
					
			multi = client_redis.multi(); // For students
			i=1;
			
			for(i=1;i<=reply;i++){
				multi.hgetall("student:" + i);
			}
									
			colleges = [];
					
			multi.exec(function(err,replies){
				
				console.log(replies);
				
				for(x in replies){
					if(replies[x].university == req.session.student.university){						
						colleges.push(replies[x]);
					}
				}
			
				// Ready "colleges", now Posts
				
				client_redis.hget(req.session.student.university,"posts",function(err,reply2){
					
					multi2 = client_redis.multi();
					
					j=1;
					
					for(j=1;j<=reply2;j++){
						multi2.hgetall(req.session.student.university + ":post:" + j);
					}
					
					posts = [];
					
					multi2.exec(function(err,replies2){
						
						posts = replies2;
						
						res.render('school.ejs',{
							layout:false,
							locals:{
							site : "stendev",
							student : req.session.student,
							colleges : colleges, // Students
							posts : posts // posts
						}});
						
					});
				});
			});
		});	
}


exports.me = function(req,res){
						
						res.render('me.ejs',{
							layout:false,
							locals:{
							site : "stendev",
							student : req.session.student,
							}});
	
}

/*
	NOTEBOOK
*/

exports.nb = function(req,res) {
			
	
	console.log(sd);
	
	if(typeof sd.query.pg != "undefined"){
		
		client_redis.hgetall("student:" + sd.query.id,function(err,reply){
			
			console.log(reply);
					
			// REPLY IS STUDENT INFO
					
			client_redis.hgetall("student:" + sd.query.id + ":notebook",function(err,reply2){
				
				multi = client_redis.multi();
					
				i=1;
					
				for(i=1;i<=reply2.pages;i++){
					multi.hgetall("student:" + sd.query.id + ":notebook:page:" + i);
				}
					
				multi.exec(function(err,replies){
			
					res.render('notebook-fl.ejs',{
						layout:false,
						locals:{
							site : "stendev",
							student : req.session.student,
							nb_student : reply,
							nb_pages : replies,
							route : 'notebook',
							pg : 'fl',
						}
					});
				});			
			});
		
		});
		
	}
	else {
		client_redis.hgetall("student:" + sd.query.id,function(err,reply){
			
			console.log("################################################################");
					
			// REPLY IS STUDENT INFO
					
			client_redis.hgetall("student:" + sd.query.id + ":notebook",function(err,reply2){
			
				res.render('notebook.ejs',{
					layout:false,
					locals:{
						site : "stendev",
						student : req.session.student,
						nb_student : reply,
						route : 'notebook',
						pg : 'nb',
					}
				});
			
			});
		
		});
	}
	
}
