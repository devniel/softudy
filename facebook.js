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


exports.save = function(req,res,student){
	
				client_redis.sadd('fbIDS',req.getAuthDetails().user.id);
				
				client_redis.scard("students",function(err,reply){
					id = reply + 1;
					student_id = "student:" + id;
					client_redis.hset(student_id, "name",student.name);
					client_redis.hset(student_id, "firstname",student.firstname);
					client_redis.hset(student_id, "lastname",student.lastname);
					client_redis.hset(student_id, "facebook",student.facebook);
					client_redis.hset(student_id, "email",student.email);
					client_redis.hset(student_id, "id", id);
					client_redis.hset(student_id, "fbID", student.fbID);
					
					client_redis.sadd("students",id);
					
					var input = 'English', output = "Spanish";
					translate.text({input:input,output:output}, student.university, function(err, text){
						client_redis.hset(student_id, "university",text);
					});
					
					client_redis.hset(student_id, "career",student.career);
					client_redis.hset(student_id, "posts","0");
					client_redis.hset(student_id, "courses","0");
					client_redis.hset(student_id, "avatar", student.avatar);
					
					// SLATE
					client_redis.hmset(student_id + ":slate",
						"posts",0
					);
					
					client_redis.hmset(student_id + ":notebook",
						"pages",0
					);
					
					
					student.id = id;
					req.session.student = student;
					res.redirect('/');
				});
}


exports.university = function(req,res,student){
	
		j=0;
		
		isSchool = false;
		
		console.log(req.getAuthDetails().user.education);
		
		while(j<req.getAuthDetails().user.education.length && isSchool == false){
			
				if(req.getAuthDetails().user.education[j].type == 'College'){
					
					var nameSchool = req.getAuthDetails().user.education[j].school.name;
					var careerUniversity = req.getAuthDetails().user.education[j].concentration[0].name;
					isUniversity = true;	
				}
			j++;
		}
		
		return nameSchool;
}

exports.career = function(req,res,student){
	
		j=0;
		
		isSchool = false;
		
		console.log(req.getAuthDetails().user.education);
		
		while(j<req.getAuthDetails().user.education.length && isSchool == false){
			
				if(req.getAuthDetails().user.education[j].type == 'College'){
					
					var nameSchool = req.getAuthDetails().user.education[j].school.name;
					var nameCareer = req.getAuthDetails().user.education[j].concentration[0].name;
					isUniversity = true;	
				}
			j++;
		}
		
		return nameCareer;
}
