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


exports.search = function(req,res){
	
	client_redis.get("id",function(err,reply){
		multi = client_redis.multi();
		
		i = 1;
		for(i=1;i<=reply;i++){
			multi.hgetall("student:" + i);
		}
		
		multi.exec(function(err,replies){
			console.log(replies);
			
			for(x in replies){
				if(replies[x].id == req.params.id){
				res.render('profile.ejs',{
								layout:false,
								locals:{
								site : "stendev",
								student : replies[x],
								}});
				}
			}
		});
		
	});
	
	
}