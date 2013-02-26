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

var jsdom = require('jsdom');

// TRADUCE [ for LOGIN ]
function traduce(text) {
	if(text == "University of Lima") {
		return "Universidad de Lima";
	}
}

// EXTRACTOR [ newPost, writting ]
function extractor(texto){
		
	var urlRegex = /((\b(https?|ftp|file):\/\/|www)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	var pass = texto.replace(urlRegex,function(url){
					if (url.match(/\.(jpg|png|gif|bmp)$/i))
						return '<img width="100%" src="'+url+'" alt="'+url+'" />';
					else if(url.match(/^(http:\/\/www\.youtube\.com\/watch\?v=)/)){
						var id = "";
						for(var i= (url.length -11);i<url.length;i++){
							id+=url[i];
						}
						return '<iframe title="YouTube video player" width="100%" height="300" src="http://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>';
					}
					else if(url.match(/^(www)/i)){
						return '<a href="http://'+url+'">'+url+'</a>';
					}
					else {
						return '<a href="'+url+'">'+url+'</a>';
					}
				});
				return pass;
} // END OF EXTRACTOR

client_redis = redis.createClient();

/*------------------------------------------------------------------------------------------------------------------
 * ENTER
 ------------------------------------------------------------------------------------------------------------------*/

exports.enter = function(socket,clients,client,student) {

	studentClient = {
		channel : student.studying,
		sessionId : client.sessionId,
		id : student.id,
		avatar : student.avatar,
		studying : student.studying,
		name : student.name,
		route : student.route,
		nb : student.nb,
	}

	clients.push(studentClient);
	
	var stchannel = [];
	
	for(var j in clients) {
		if(clients[j].channel !== student.studying) {
			stchannel.push(clients[j].sessionId);
		}
	}
	
	var stindex = [];
	
	for(var j in clients) {
		if(clients[j].route !== "me") {
			stindex.push(clients[j].sessionId);
		}
	}
	
	if(student.route == "me"){
		
		console.log(student.suggest_courses);
		multi = client_redis.multi();
				
		for(var i=0;i<student.suggest_courses.length;i++){
			multi.hgetall("course:" + student.suggest_courses[i]);
		}
		
		multi.exec(function(err,nstudents){
							
							var nstudents_data = {
								action : "enter",
								show : "student",
								list : nstudents
							}
							
							client.send(nstudents_data);
		});
		
	}
	
	
	stchannel.push(client.sessionId); // El propio usuario
	
	if(student.route == "course"){
			
		client_redis.sadd("course:" + student.studying + ":students",student.id);
		client_redis.hincrby("course:" + student.studying, "students",1);
		
		client_redis.smembers("course:" + student.studying + ":students",function(err,ids){
			
				console.log(ids);
				multi0 = client_redis.multi();
				
				for(var i=0;i<ids.length;i++){
						multi0.hgetall("student:" + ids[i]);
				}
					
				multi0.exec(function(err,list_students){
							console.log(list_students);
							
							var list_students_data = {
								action : "enter",
								show : "student",
								list : list_students
							}
							
							client.send(list_students_data);
							
							student.show = "new_student";
							student.total = list_students_data.list.length;
							socket.broadcast(student,stchannel);
							socket.broadcast(student,stindex);
							
				});
		});
			
		// EVENT - SHOW POSTS
		client_redis.hgetall("course:" + student.studying + ":slate",function(error,reply){
				
				npost = reply;

				multi = client_redis.multi();
				i = 1;
				
				for(i=1;i<=reply.posts;i++){
						multi.hgetall("course:" + student.studying + ":slate:post:" + i);
				}
					
				multi.exec(function(err,replies){
							var data = {
								action : "enter",
								show : "post",
								list : replies
							}
							client.send(data);
				});
			});
		
	}
	
	if(student.route == "notebook"){
			
		client_redis.sadd("student:" + student.nb + ":notebook:viewers",student.id);
		client_redis.hincrby("student:" + student.nb + ":notebook","viewers",1);
		
		client_redis.smembers("student:" + student.nb + ":notebook:viewers",function(err,ids){
			
				console.log(ids);
				
				multi0 = client_redis.multi();
				
				for(var i=0;i<ids.length;i++){
						multi0.hgetall("student:" + ids[i]);
				}
					
				multi0.exec(function(err,list_students){
					
							console.log(list_students);
							
							var list_students_data = {
								action : "enter",
								show : "student",
								list : list_students
							}
							
							//client.send(list_students_data);
							
							//student.show = "new_student";
							
							client_redis.scard("student:" + student.nb + ":notebook:viewers",function(err,total){
							
								student.total = total;
								
								console.log("TOTAL : " + student.total);
								
								var stnb = [];
	
								for(var j in clients) {
									if(clients[j].nb !== student.nb) {
										stnb.push(clients[j].sessionId);
									}
								}
							
								socket.broadcast(list_students_data,stnb);
								
							});
							
							

							
				});
		});
	}
	
}
/*------------------------------------------------------------------------------------------------------------------
 * DISCONNECT
 ------------------------------------------------------------------------------------------------------------------*/

exports.disconnect = function(socket,clients,client,student) {
	
	var stchannel = [];

	for(var j in clients) {
		if(clients[j].channel !== student.studying) {
			stchannel.push(clients[j].sessionId);
		}
		if(clients[j].sessionId == client.sessionId) {
			// Se va este
			clients[j].channel = "";
		}
	}
	
	var stindex = [];
	
	for(var j in clients) {
		if(clients[j].route !== "me") {
			stindex.push(clients[j].sessionId);
		}
	}
	
	if(student.route == "course"){
		client_redis.srem("course:" + student.studying + ":students",student.id);
		client_redis.hincrby("course:" + student.studying, "students",-1);
		
		client_redis.scard("course:" + student.studying + ":students",function(err,reply){
			
			student.total = reply
			socket.broadcast(student,stchannel);
			socket.broadcast(student,stindex);
			
		});
	}
	if(student.route == "notebook"){
		client_redis.srem("student:" + student.nb + ":notebook:viewers",student.id);
		client_redis.hincrby("student:" + student.nb + ":notebook", "viewers",-1);
		
		client_redis.scard("student:" + student.nb + ":notebook:viewers",function(err,reply){
			
			student.total = reply
			socket.broadcast(student,stchannel);
			socket.broadcast(student,stindex);
			
		});
	}
}
/*------------------------------------------------------------------------------------------------------------------
 * GET STUDENT
 ------------------------------------------------------------------------------------------------------------------*/

exports.getStudent = function(socket,clients,client,student) {
	client_redis.hgetall("student:" + student.getData, function(err,reply) {
		student.getData = reply;
		client.send(student);
	});
}
/*------------------------------------------------------------------------------------------------------------------
 * MSG CHAT
 ------------------------------------------------------------------------------------------------------------------*/

exports.msgChat = function(socket,clients,client,student) {
	
	var stchannel = [];
	/* estudiante a estudiante
	for(var j in clients) {
		if(clients[j].id !== student.toId && clients[j].id !== student.id) {
			stchannel.push(clients[j].sessionId);
		}
	}*/
	for(var j in clients) {
		if(clients[j].channel !== student.studying) {
				stchannel.push(clients[j].sessionId);
		}
	}
	socket.broadcast(student,stchannel);
}

/*------------------------------------------------------------------------------------------------------------------
 * NEW QUESTION ?
 ------------------------------------------------------------------------------------------------------------------*/

exports.newQuestion = function(socket,clients,client,student) {

	client_redis.hincrby(student.studying, 'questions', 1, function(err,reply) {

		client_redis.hmset(student.studying + ':question:' + reply,'id',student.id,'qid',reply,'avatar',student.avatar,'name',student.name,'title',student.question.title,'cont',student.question.cont)

		var stchannel = [];

		for(var j in clients) {
			//&& clients[j].id !== student.id
			if(clients[j].channel !== student.studying) {
				stchannel.push(clients[j].sessionId);
			}
		}

		student.question.qid = reply;

		socket.broadcast(student,stchannel);

	});
}
/*------------------------------------------------------------------------------------------------------------------
 * TO ANSWER
 ------------------------------------------------------------------------------------------------------------------*/

exports.toAnswer = function(socket,clients,client,student) {
	client_redis.hgetall(student.studying + ':question:' + student.qid, function(err,reply) {
		student.question = reply;
		client.send(student);
	});
}
/*------------------------------------------------------------------------------------------------------------------
 * REPLY ( IN ANSWERS )
 ------------------------------------------------------------------------------------------------------------------*/

exports.reply = function(socket,clients,client,student) {
	client_redis.hincrby(student.studying + ':question:' + student.qid, 'replies', 1, function(err,reply) {

		var replyJSON = student;

		client_redis.hset(student.studying + ':question:' + student.qid, 'reply' + reply, JSON.stringify(replyJSON));

		client_redis.hget(student.studying + ':question:' + student.qid, 'reply' + reply, function(err,reply2) {
			//console.log('---------------------------');
			var response = eval("(" + reply2 + ')');

			student = response;

			var stchannel = [];

			for(var j in clients) {
				if(clients[j].channel !== student.studying) {
					stchannel.push(clients[j].sessionId);
				}
			}

			socket.broadcast(student,stchannel);
		})
	});
}

/*------------------------------------------------------------------------------------------------------------------
 * NEW POST
 ------------------------------------------------------------------------------------------------------------------*/

exports.newPost = function(socket,clients,client,student) {
	
			client_redis.hincrby("student:" + student.id, "posts",1,function(err,reply){
				
				// ID POST FOR STUDENT
				//student.post.id_post = reply;
				
			client_redis.hincrby("course:" + student.studying + ":slate", "posts",1,function(err,id_post){
				
				// EXTRACT  [links, ... ]
				student.post.value = extractor(student.post.value);
				
				// ID OF POST FOR COURSE
				student.post.id_post = id_post;
				
					// SAVE [ WITH TITLE AND DESCRIPTION ]
					
					if(student.post.type == "url"){
						client_redis.hmset("student:" + student.id + ':post:' + reply,
								  'id_post',reply,
								  'type',student.post.type,
								  'background',student.post.background,
								  'id',student.id,
								  'avatar',student.avatar,
								  'name',student.name,
								  'value',student.post.value,
								  'title',student.url.title,
								  'description',student.url.description,
								  'image',student.url.image,
								  'course',student.studying
						);
						client_redis.hmset("course:" + student.studying + ":slate:post:" + id_post,
									  'id_post',id_post,
									  'type',student.post.type,
									  'background',student.post.background,
									  'id',student.id,
									  'avatar',student.avatar,
									  'name',student.name,
									  'value',student.post.value,
									  'title',student.url.title,
									  'description',student.url.description,
									  'image',student.url.image
						);
					}
					else if(student.post.type == "text"){
						client_redis.hmset("student:" + student.id + ':post:' + reply,
								  'id_post',reply,
								  'type',student.post.type,
								  'background',student.post.background,
								  'id',student.id,
								  'avatar',student.avatar,
								  'name',student.name,
								  'value',student.post.value,
								  'course',student.studying
						);
						client_redis.hmset("course:" + student.studying + ":slate:post:" + id_post,
								  'id_post',id_post,
								  'type',student.post.type,
								  'background',student.post.background,
								  'id',student.id,
								  'avatar',student.avatar,
								  'name',student.name,
								  'value',student.post.value,
								  'course',student.studying
						);
					}
					else if(student.post.type == "youtube"){
						client_redis.hmset("student:" + student.id + ':post:' + reply,
								  'id_post',reply,
								  'type',student.post.type,
								  'background',student.post.background,
								  'id',student.id,
								  'avatar',student.avatar,
								  'name',student.name,
								  'value',student.post.value,
								  'youtube_id',student.youtube.id,
								  'youtube_title',student.youtube.title,
								  'youtube_thumbnail',student.youtube.thumbnail,
								  'youtube_description',student.youtube.description,
								  'course',student.studying
						);
						client_redis.hmset("course:" + student.studying + ":slate:post:" + id_post,
								'id_post',id_post,
								  'type',student.post.type,
								  'background',student.post.background,
								  'id',student.id,
								  'avatar',student.avatar,
								  'name',student.name,
								  'value',student.post.value,
								  'youtube_id',student.youtube.id,
								  'youtube_title',student.youtube.title,
								  'youtube_thumbnail',student.youtube.thumbnail,
								  'youtube_description',student.youtube.description
						);
					}
					
					client_redis.sadd("student:" + student.id + ":posts", reply);
					client_redis.sadd("course:" + student.studying + ":slate:posts", id_post);
					
					// RESTRICTIONS
					var stchannel = [];
					
					for(var j in clients) {
						if(clients[j].channel !== student.studying) {
							stchannel.push(clients[j].sessionId);
						}
					}
					
					socket.broadcast(student,stchannel);
			});
			});
}
/*------------------------------------------------------------------------------------------------------------------
 * COMMENT
 ------------------------------------------------------------------------------------------------------------------*/

exports.comment = function(socket,clients,client,student) {
	
	client_redis.hincrby("course:" + student.studying + ':slate:post:' + student.postID,'comments',1, function(err,reply) {

		student.commentID = reply;

		client_redis.hset("course:" + student.studying + ':slate:post:' + student.postID, "comment:" + reply,JSON.stringify(student));

		client_redis.hget("course:" + student.studying + ':slate:post:' + student.postID, 'comment:' + reply, function(err,reply2) {

			var comment = eval("(" + reply2 + ')');

			console.log(student);

			student = comment;

			var stchannel = [];

			for(var j in clients) {
				//&& clients[j].id !== student.id
				if(clients[j].channel !== student.studying) {
					stchannel.push(clients[j].sessionId);
				}
			}

			socket.broadcast(student,stchannel);

		});
	});
}
/*------------------------------------------------------------------------------------------------------------------
 * GET COMMENTS
 ------------------------------------------------------------------------------------------------------------------*/

exports.getComments = function(socket,clients,client,student) {

	client_redis.hget("course:" + student.studying + ':slate:post:' + student.postID, 'comments', function(err,reply) {
		
		multi = client_redis.multi();
		i = 1;
		for(i=1;i<=reply;i++) {
			multi.hget("course:" + student.studying + ":slate:post:" + student.postID,  "comment:" + i);
		}

		var data = { comments : null, action : null };

		multi.exec( function(err,replies) {
			data.comments = replies;
			data.action = "getComments";
			data.postID = student.postID;
			console.log(data);
			client.send(data);
		});
	});
}

/*------------------------------------------------------------------------------------------------------------------
 * SAVE NOTEBOOK
 ------------------------------------------------------------------------------------------------------------------*/
 
 exports.saveNotebook = function(socket,clients,client,student){
	 
	 client_redis.hincrby("student:" + student.id + ":notebook","pages",1,function(err,reply){
		 
		 client_redis.sadd("student:" + student.id + ":notebook:pages",reply);
		 
		 client_redis.hmset("student:" + student.id + ":notebook:page:" + reply,
		 	"id",reply,
			"name",student.data.name,
		 	"all",student.data.all,
			"record",student.data.record,
			"date",student.data.date
		 );
		 
	 });
	 
 }
 
 /*------------------------------------------------------------------------------------------------------------------
 * WRITTING
 ------------------------------------------------------------------------------------------------------------------*/
 
 exports.writting = function(socket,clients,client,student){
	 
	console.log(student.textarea);
	// TITLE AND DESCRIPTION OF THE FIRST LINK WITH JSDOM
	
	var urlRegex = /((\b(https?|ftp|file):\/\/|www)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;	
	var youtubeRegex = /^(http:\/\/www\.youtube\.com\/watch\?v=)(.{11})/;
				
	//console.log(urlRegex.test(student.textarea));
					
	var firstURL =  urlRegex.exec(student.textarea);
	var video = youtubeRegex.exec(student.textarea);
	var working = false;
	
	if(video != null){
		working = true;
		student.event = "youtube";
		student.youtube = {};
		student.youtube.link = video[0];
		
		youtube_id = video[0].replace(/^[^v]+v.(.{11}).*/,"$1");
		
		student.youtube.id = youtube_id;
							
		client.send(student)
				
		var options = {
		  host: 'gdata.youtube.com',
		  port: 80,
		  path: '/feeds/api/videos/' + youtube_id + '?v=2&alt=json',
		  method: 'GET'
		};
				
		var request = http.get(options, function(res){
		  res.setEncoding('utf8')
		  var video_info = '';
		  res.on('data', function (chunk) {
			video_info += chunk; 
		  })
		  res.on('end', function(){
			yvideo = eval("(" + video_info + ")");
			student.youtube.title = yvideo.entry.title.$t;
			student.youtube.description = yvideo.entry.media$group.media$description.$t;
			student.youtube.thumbnail = yvideo.entry.media$group.media$thumbnail;
			student.event = "youtube_info";
			client.send(student);
		  })
		})	
	
	}
				
	if(firstURL != null && working == false){
		
		student.event = "valid_link";
		client.send(student);	
		
		jsdom.env(firstURL[0], ['http://code.jquery.com/jquery-1.5.min.js'], function(errors, window) {
		
		console.log(errors);
		
		if(errors){
			if(errors.code == "ENOTFOUND"){
				student.event = "link_notfound";
				student.url = {};
				student.url.title = firstURL[0];
				client.send(student);
			}
		}
		
		if(typeof window != "undefined"){
	
			var $ = window.$;	
			title_url = $('title').html();			
			description_url = $('meta[name=description]').attr("content");			
			
			if(typeof description_url != "undefined"){
				description_url = description_url.toString();
			}else{
				description_url = $('p').text();
				description_url = description_url.substring(0, 140);
			}
						
			images_url = [];
							
			$('img').each(function(){
				
				/*if(urlRegex.exec($(this).attr('src')) == null){
					images_url.push(firstURL[0] + "/" + $(this).attr('src'));
				}
				else {*/
					images_url.push($(this).attr('src'));
				//}
			});
										
			firstImg = $('img').first();
			console.log(title_url);
			console.log(description_url);
			
			student.event = "link";
			student.url = {};
			student.url.title = title_url;
			student.url.description = description_url;
			student.url.images = images_url;
			client.send(student);
		}
		});
		
	}	 
 }

/*------------------------------------------------------------------------------------------------------------------
 * SEARCH
 ------------------------------------------------------------------------------------------------------------------*/
 
 exports.search = function(socket,clients,client,student){
	 
	 client_redis.scard("courses",function(err,reply){
		 
		multi = client_redis.multi();
		i = 1;
		for(i=1;i<=reply;i++){
			multi.hgetall("course:" + i);
		}
	
	var reg = eval("/^" + student.search + "/i");
	var reg = new RegExp(reg);
		
		var finded = [];
		multi.exec(function(err,replies){
			
			
			
			for(i in replies){
				//console.log(reg.exec(replies[i].name));
				tst = reg.exec(replies[i].name);
				if(tst != null && tst[0] != ''){
						// FILTER -->
						if(student.filter == "university"){
								if(replies[i].university == student.university){
									finded.push(replies[i]);
								}
						}
						else {
							finded.push(replies[i]);
						}
				}
			}
			
			var data = {
						action : "finded",
						list : finded
						}	
			client.send(data);
			}); 
		 
	 });
	 
 }
 
 /*------------------------------------------------------------------------------------------------------------------
 * ADD COURSE
 ------------------------------------------------------------------------------------------------------------------*/
 
exports.addcourse = function(socket,clients,client,student){
	 
	 client_redis.scard("courses",function(err,reply){
		 id = reply + 1;
		 
		 client_redis.hmset("course:" + id,
		 "name",student.course.name,
		 "university",student.university,
		 "students",0,
		 "career",student.career,
		 "id",id
		 );
		 
		client_redis.hmset("course:" + id + ":slate",
		 	"posts",0
	 	);

		 client_redis.sadd("courses",id);
	 });
	 
 }
 
 
/*------------------------------------------------------------------------------------------------------------------
 * MOSEUP
 ------------------------------------------------------------------------------------------------------------------*/

exports.mouseup = function(socket,clients,client,student) {
	
	console.log(student.cord);
	
	var stnb = [];
	
	for(var j in clients) {
		if(clients[j].nb !== student.nb) {
			stnb.push(clients[j].sessionId);
		}
	}
	
	stnb.push(client.sessionId);
	
	student.action = "mouseup";					
	socket.broadcast(student,stnb);
	
}

/*------------------------------------------------------------------------------------------------------------------
 * MOSEUP
 ------------------------------------------------------------------------------------------------------------------*/

exports.mousedown = function(socket,clients,client,student) {
	
	console.log(student.cord);
	
	var stnb = [];
	
	for(var j in clients) {
		if(clients[j].nb !== student.nb) {
			stnb.push(clients[j].sessionId);
		}
	}
	
	stnb.push(client.sessionId);
		
	student.action = "mousedown";					
	socket.broadcast(student,stnb);	
	
}

/*------------------------------------------------------------------------------------------------------------------
 * MOSEMOVE
 ------------------------------------------------------------------------------------------------------------------*/

exports.mousemove = function(socket,clients,client,student) {
	
	console.log(student.cord);
	
	var stnb = [];
	
	for(var j in clients) {
		if(clients[j].nb !== student.nb) {
			stnb.push(clients[j].sessionId);
		}
	}
		
	stnb.push(client.sessionId);
	
	student.action = "mousemove";					
	socket.broadcast(student,stnb);
	
}