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

/*------------------------------------------------------------------------------------------------------------------------------
	REDIS CLIENT
----------------------------------------------------------------------------------------------------------------------------------*/

var client_redis = redis.createClient();

/*------------------------------------------------------------------------------------------------------------------------------
	APP SERVER CREATE
----------------------------------------------------------------------------------------------------------------------------------*/

var app = module.exports = express.createServer(
  express.logger('\x1b[1m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'),
  express.cookieDecoder(),
  express.session({ store: new RedisStore() })
);

/*------------------------------------------------------------------------------------------------------------------------------
	CONFIGURE
----------------------------------------------------------------------------------------------------------------------------------*/

app.set('views', __dirname + '/views');

app.configure(function(){
		app.use(express.bodyDecoder());
		app.use(express.favicon());
		//app.use(app.router);
 		app.use(express.methodOverride());
		app.use(express.logger('\x1b[1m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
		app.use(express.staticProvider(__dirname + '/static'));		
		app.use(auth( [
    	auth.Facebook({appId : fbId, appSecret: fbSecret, scope: "email", callback: fbCallbackAddress})
  		]) );	
});


/*------------------------------------------------------------------------------------------------------------------------------
	HOME PAGE
----------------------------------------------------------------------------------------------------------------------------------*/
	
app.get('/',function(req,res){
		if(typeof req.session.student == "undefined"){
			//if(!req.isAuthenticated()){
				res.render('index.ejs',{
					layout:false,
					locals:{
					 site : "stendev",
					 style : "/styles/index.css",
					 }}); 
		}
		else{					 			
					res.render('stenpad.ejs',{
							layout:false,
							locals:{
							site : "stendev",
							student : req.session.student,
							}});
		}
});

app.get('/auth/facebook', function(req,res) {
  req.authenticate(['facebook'], function(error, authenticated) { 
     if(authenticated) {
        //res.send("<html><h1>Hello Facebook user:" + JSON.stringify( req.getAuthDetails().user ) + ".</h1></html>");
		
		j=0;
		isUniversity = false;
		console.log(req.getAuthDetails().user.education);
		
		while(j<req.getAuthDetails().user.education.length && isUniversity == false){
				if(req.getAuthDetails().user.education[j].type == 'College'){
					//console.log(req.getAuthDetails().user.education[j]);
					var nameUniversity = req.getAuthDetails().user.education[j].school.name;
					var careerUniversity = req.getAuthDetails().user.education[j].concentration[0].name;
					isUniversity = true;	
				}
			j++;
		}
		
		var student = {
		name : req.getAuthDetails().user.name,
		firstname : req.getAuthDetails().user.first_name,
		lastname : req.getAuthDetails().user.last_name,
		facebook : req.getAuthDetails().user.link,
		fbID : req.getAuthDetails().user.id,
		email : req.getAuthDetails().user.email,
		university : nameUniversity,
		career : careerUniversity,
		posts : 0,
		courses : 0,
		avatar : 'http://graph.facebook.com/' + req.getAuthDetails().user.id + '/picture',
		}
		
		
		
		client_redis.sismember('fbIDS',req.getAuthDetails().user.id,function(err,reply){
			if(reply == 1){
				
				client_redis.get("id",function(err,reply){
					i = 1;
					while(i<=reply){
						client_redis.hgetall("student:" + i,function(err,reply2){
							if(reply2.fbID == req.getAuthDetails().user.id){
								req.session.student = reply2;
								res.redirect('/');
							}
						});
					i++;
					}
				});
			}
			else {
				// Save into set of fbIDS
				client_redis.sadd('fbIDS',req.getAuthDetails().user.id);
				
				// Save into DB
				client_redis.incr("id");
				client_redis.get("id",function(err,reply){
				id = reply;
				student_id = "student:" + id;
				client_redis.hset(student_id, "name",student.name);
				client_redis.hset(student_id, "firstname",student.firstname);
				client_redis.hset(student_id, "lastname",student.lastname);
				client_redis.hset(student_id, "facebook",student.facebook);
				client_redis.hset(student_id, "email",student.email);
				client_redis.hset(student_id, "id", id);
				client_redis.hset(student_id, "fbID", student.fbID);
				client_redis.hset(student_id, "university",student.university);
				client_redis.hset(student_id, "career",student.career);
				client_redis.hset(student_id, "posts","0");
				client_redis.hset(student_id, "courses","0");
				client_redis.hset(student_id, "avatar", student.avatar);
				
				student.id = id;
				req.session.student = student;
				res.redirect('/');
				});
			}
		});
      }
      else {
        res.send("<html><h3>Inicia sesión en Facebook ¬¬</h3></html>")
      }
   });
});


app.post('/login',function(req,res){
	client_redis.get("id",function(err,reply){
			var login = false;
			var i=1;
			while (i<=reply && login == false){	
			
				client_redis.hgetall("student:" + i, function(err,reply2){
					//Comprobar si se logueó correctamente
					if(reply2.email == req.body.email && reply2.pass == req.body.pass){
						login = true;
						//Redireccionar y guardar datos
						student = reply2;
						req.session.student = reply2;
						
						txt = '<li id="name"><img style="float:left;margin-top:-3px;" width="30px" height="30px" src="' + student.avatar + '">' 
						+ '<div style="float:left;height:30px;font:12px \'Myriad Web Pro\';line-height:1;margin-left:10px;" class="username">'
						+ student.firstname + ' ' + student.lastname + '<br/>' + student.university + '</div>';
							  
						res.writeHead(200,{'Content-Type' : 'text/html'});
						res.end(txt);
					}						
					});
				i++
				}
			});
});

app.post('/',function(req,res){
	/*if(req.session.student){
		req.session.student.studying = req.body.search;
		client_redis.hset("student:" + req.session.student.id, "studying", req.session.student.studying);
		res.redirect(req.body.search);
	}
	else
	{
		res.redirect("/");
	}*/
	
	if(typeof req.body.search != "undefined"){
			if(req.session.student){ 
				req.session.student.studying = req.body.search;
				client_redis.hset("student:" + req.session.student.id, "studying", req.session.student.studying);
				res.redirect(req.body.search);
			}
			else { 
				res.redirect("/");
			}
	}
	// THE USER DONT SEARCH ANYTHING IN THE INDEX -----------------------------------------------------------------------
	// THE USER HAS BEEN REGISTERED
	if(req.body.firstname){
		student = {			
			name : req.body.firstname + req.body.lastname,
			firstname : req.body.firstname,
			lastname : req.body.lastname,
			pass : req.body.pass,
			facebook : null,
			fbID : null,
			email : req.body.email,
			university : req.body.university,
			career : req.body.career,
			posts : 0,
			courses : 0,
			avatar : "/img/logos/userAvatar.png",
		}	
		client_redis.incr("id");
		console.log(req.session.student);
		client_redis.get("id",function(err,reply){
			id = reply;
			student_id = "student:" + id;
			client_redis.hset(student_id, "name",student.name);
				client_redis.hset(student_id, "firstname",student.firstname);
				client_redis.hset(student_id, "lastname",student.lastname);
				client_redis.hset(student_id, "pass",req.body.pass);
				client_redis.hset(student_id, "facebook",student.facebook);
				client_redis.hset(student_id, "email",student.email);
				client_redis.hset(student_id, "id", id);
				client_redis.hset(student_id, "fbID", student.fbID);
				client_redis.hset(student_id, "university",student.university);
				client_redis.hset(student_id, "career",student.career);
				client_redis.hset(student_id, "posts","0");
				client_redis.hset(student_id, "courses","0");
				client_redis.hset(student_id, "avatar", student.avatar);
				
				student.id = id;
				req.session.student = student;
				res.redirect('/');
		});
	}
	// LOGIN OF THE USER -----------------------------------------------------------------------
	else if(req.body.login_email && req.body.login_pass){
		client_redis.get("id",function(err,reply){
			var login = false;
			var i=1;
			while (i<=reply && login == false){	
				client_redis.hgetall("student:" + i, function(err,reply2){
					//Comprobar si se logueó correctamente
					if(reply2.email == req.body.login_email && reply2.pass == req.body.login_pass){
						login = true;
						//Redireccionar y guardar datos
						student = reply2;
						req.session.student = student;
						res.redirect("/");
						
					}						
				});
				i++
			}
		});
	}
	else{
		console.log("No se buscó nada");
	}	
});

app.get('/news',function(req,res){
	
	salonID = req.session.student.studying;

			client_redis.hset("student:" + req.session.student.id, "studying", req.session.student.studying);	
			
			var posts = {dataQuestions : null, action : null};
			
			client_redis.hget(salonID,'posts',function(err,reply){
				multi = client_redis.multi();
				i = 1;
				for(i=1;i<=reply;i++){
					multi.hgetall(salonID + ":post:" + i);
				}
				multi.exec(function(err,replies){
					//console.log(replies);					
					res.render('news.ejs',{
							layout:false,
							locals:{
							site : "stendev",
							student : req.session.student,
							salon : salonID,
							posts : replies
							}});
				});
			});
});

app.get('/school',function(req,res){
	
	translate.text(req.session.student.university,function(err,text){
		//console.log(text);
		
	client_redis.get('id',function(err,reply){
					
		multi = client_redis.multi();
					
		i=1;
		for(i=1;i<=reply;i++){
			multi.hgetall("student:" + i);
		}
					
		data = [];
					
		multi.exec(function(err,replies){
			console.log(replies.length);
			for(x in replies){
				if(replies[x].university == req.session.student.university || replies[x].university  == text){						
					data.push(replies[x]);
				}
			}
		 	console.log(data);
			
			res.render('school.ejs',{
							layout:false,
							locals:{
							site : "stendev",
							student : req.session.student,
							colleges : data
			}});
			 
		});
	});		
	});	
				
});


app.get('*',function(req,res){
	
	//console.log(req.url);
	
	var salonURL = req.url; // /ID
    var salonID = salonURL.substring(1); // I
	
	// is an ID ?
	var userID = salonID;
	
	if(salonID == 'logout'){
		req.session.destroy();
		req.logout();
		res.redirect('/');
	}
	else {
	
	client_redis.hgetall("student:" + userID,function(err,reply){
		
		if(!reply.id){
			req.session.student.studying = salonID;
			
			client_redis.hset("student:" + req.session.student.id, "studying", req.session.student.studying);	
			
			var posts = {dataQuestions : null, action : null};
			
			client_redis.hget(salonID,'posts',function(err,reply){
				multi = client_redis.multi();
				i = 1;
				for(i=1;i<=reply;i++){
					multi.hgetall(salonID + ":post:" + i);
				}
				multi.exec(function(err,replies){
					//console.log(replies);					
					res.render('stenpad.ejs',{
							layout:false,
							locals:{
							site : "stendev",
							student : req.session.student,
							salon : salonID,
							posts : replies
							}});
				});
			});
		}
		else if(reply.id){
					/*res.render('index_student.ejs',{
						layout:false,
							locals:{
							site : "stendev",
							student : reply,
							}
					});*/
					res.render('news.ejs',{
						layout:false,
							locals:{
							site : "stendev",
							student : reply,
							}
					});
		}
		
	});
	}
			
});


var socket = io.listen(app);

clients = []; // Array de sessionId, todos los que entran.

socket.on('connection', function(client){
	
	// Student is the message	
  	client.on('message', function(student){
		
		/*---------------------------------------------------
			ENTER
		-----------------------------------------------------*/
		if(student.action == "enter"){
			
			studentClient = {
				channel : student.studying,
				sessionId : client.sessionId,
				id : student.id,
				avatar : student.avatar,
				studying : student.studying,
				name : student.name
			}
  		
			clients.push(studentClient); 
			
			// getStudents;
			var total = 0;
			for(var j in clients){
				if(clients[j].channel == student.studying){
					//listOfStudents.push(clients[j].sessionId);
					clients[j].action = 'show';
					total++;
					clients[j].total = total;
					client.send(clients[j]);
				}
			}
			
			// Questions 
			var questions = { dataQuestions : null, action : null };
			
			client_redis.hget(student.studying,'questions',function(err,reply){
				
				multi = client_redis.multi();
				i = 1;
				for(i=1;i<=reply;i++){
					multi.hgetall(student.studying + ":question:" + i);
				}
				
				multi.exec(function(err,replies){
					//console.log(replies.length);
					questions.dataQuestions = replies;
					questions.action = 'getQuestions';
					client.send(questions);
				});
			});
			// POSTS
			var posts = { dataQuestions : null, action : null };
			
			client_redis.hget(student.studying,'posts',function(err,reply){
				
				multi = client_redis.multi();
				i = 1;
				for(i=1;i<=reply;i++){
					multi.hgetall(student.studying + ":post:" + i);
				}
				
				multi.exec(function(err,replies){
					//console.log(replies.length);
					//console.log(replies);
					posts.dataPosts = replies;
					//console.log(posts.dataPosts);
					posts.action = 'getPosts';
					client.send(posts);
				});
			});
			
			//New Student
			
			var stchannel = [];
			
			//console.log(clients);
			var total = clients.length;
			for(var j in clients){
				if(clients[j].channel !== student.studying){
					stchannel.push(clients[j].sessionId);
					total--;
				}
			}
			
			student.total = total;
			stchannel.push(client.sessionId); // El propio usuario				
			//console.log(stchannel);	
			socket.broadcast(student,stchannel);
		}
		/*---------------------------------------------------
			DISCONNECT
		-----------------------------------------------------*/
		else if(student.action == "disconnect"){
			
			var stchannel = [];
			
			var total = clients.length;
			for(var j in clients){
				if(clients[j].channel !== student.studying){
					stchannel.push(clients[j].sessionId);
					total--;
				}
				if(clients[j].sessionId == client.sessionId){
					// Se va este
					clients[j].channel = "";
				}
			}
			
			student.total = total;
			// Refrest database
			//client_redis = redis.createClient();
			//client_redis.hset("student:" + student.id, "studying", "");
			
			// Response
			student.total = total - 1;
			socket.broadcast(student,stchannel);
		}
		/*---------------------------------------------------
			getStudent
		-----------------------------------------------------*/
		else if(student.action == "getStudent"){
			//console.log("QUIEREN INFO DE USUARIO " + student.getData);
			client_redis.hgetall("student:" + student.getData,function(err,reply){
				//console.log(reply);
				student.getData = reply;
				client.send(student);
			});
		}
		/*---------------------------------------------------
			msgChat
		-----------------------------------------------------*/
		else if(student.action == "msgChat"){
			// message = student.data
			//console.log(student.msg);
			var stchannel = [];
			
			for(var j in clients){
				//&& clients[j].id !== student.id
				if(clients[j].id !== student.toId && clients[j].id !== student.id){
					stchannel.push(clients[j].sessionId);
				}
			}
			
			//console.log(student.data + " a usuario " + student.toId , de student.id);
			socket.broadcast(student,stchannel);
		}
		/*---------------------------------------------------
			publishQuestion
		-----------------------------------------------------*/
		else if(student.action == "newQuestion"){
			
			//console.log("NUEVA PREGUNTA");
			
			client_redis.hincrby(student.studying, 'questions', 1,function(err,reply){
				
			client_redis.hmset(student.studying + ':question:' + reply,'id',student.id,'qid',reply,'avatar',student.avatar,'name',student.name,'title',student.question.title,'cont',student.question.cont)
			
				
			var stchannel = [];
			
			for(var j in clients){
				//&& clients[j].id !== student.id
				if(clients[j].channel !== student.studying){
					stchannel.push(clients[j].sessionId);
				}
			}
			
			//console.log(student.data + " a usuario " + student.toId , de student.id);
			
			student.question.qid = reply;
			
			socket.broadcast(student,stchannel);
			
			});
		}
		
		/*---------------------------------------------------
			VIEW ANSWER
		-----------------------------------------------------*/
		
		else if(student.action == "toAnswer"){
			
				client_redis.hgetall(student.studying + ':question:' + student.qid,function(err,reply){
					//console.log(reply);
					student.question = reply;
					client.send(student);
			});
			
		}
		
		/*---------------------------------------------------
			REPLY ( in ANSWERS )
		-----------------------------------------------------*/
		
		else if(student.action == "reply"){
			
				client_redis.hincrby(student.studying + ':question:' + student.qid, 'replies', 1,function(err,reply){
				
				var replyJSON = student;
				
				client_redis.hset(student.studying + ':question:' + student.qid, 'reply' + reply, JSON.stringify(replyJSON)); 
				
				client_redis.hget(student.studying + ':question:' + student.qid, 'reply' + reply,function(err,reply2){
				//console.log('---------------------------');
				var response = eval("(" + reply2 + ')');
				
				student = response;
				
				var stchannel = [];
			
				for(var j in clients){
					//&& clients[j].id !== student.id
					if(clients[j].channel !== student.studying){
						stchannel.push(clients[j].sessionId);
					}
				}
			
			//console.log(student.data + " a usuario " + student.toId , de student.id);
			
			socket.broadcast(student,stchannel);
			})
			});
		}
		
		/*---------------------------------------------------
			new POST
		-----------------------------------------------------*/
		
		else if(student.action == "newPost"){
			
			if(student.post.type == "text"){
				client_redis.hincrby(student.studying, 'posts', 1,function(err,reply){
					
				client_redis.hmset(student.studying + ':post:' + reply,'id_post',reply,'type',student.post.type,'background',student.post.background,'id',student.id,'avatar',student.avatar,'name',student.name,'value',student.post.value);
				
				student.post.id_post = reply;
				
				var stchannel = [];
				
					for(var j in clients){
						//&& clients[j].id !== student.id
						if(clients[j].channel !== student.studying){
							stchannel.push(clients[j].sessionId);
						}
					}
							
				socket.broadcast(student,stchannel);
				});
			}
			else if(student.post.type == "media"){
				client_redis.hincrby(student.studying, 'posts', 1,function(err,reply){
					
				client_redis.hmset(student.studying + ':post:' + reply,'type',student.post.type,'background',student.post.background,'id',student.id,'avatar',student.avatar,'name',student.name,'value',student.post.value);
				
				var stchannel = [];
				
					for(var j in clients){
						//&& clients[j].id !== student.id
						if(clients[j].channel !== student.studying){
							stchannel.push(clients[j].sessionId);
						}
					}
							
				socket.broadcast(student,stchannel);
				});
			}
			else if(student.post.type == "question"){
				client_redis.hincrby(student.studying, 'posts',1,function(err,reply){
					client_redis.hmset(student.studying + ':post:' + reply,'type',student.post.type,'id',student.id,'avatar',student.avatar,'name',student.name,'title', student.post.value.title, 'details',student.post.value.info);
					
					var stchannel = [];
					
					for(var j in clients){
						if(clients[j].channel !== student.studying){
							stchannel.push(clients[j].sessionId);
						}
					}
					
				socket.broadcast(student,stchannel);
				
				});
				
			}
				
		}
		/*---------------------------------------------------
			COMMENT
		-----------------------------------------------------*/
		else if(student.action == "comment"){
					
				
			client_redis.hincrby(student.studying + ':post:' + student.postID,'comments',1,function(err,reply){
				
				student.commentID = reply;
				
				client_redis.hset(student.studying + ':post:' + student.postID, student.studying + ':comment:' + reply,JSON.stringify(student));
				
				client_redis.hget(student.studying + ':post:' + student.postID, student.studying + ':comment:' + reply,function(err,reply2){
					
				var comment = eval("(" + reply2 + ')');
				
				console.log(student);
				
				student = comment;
				
				var stchannel = [];
			
				for(var j in clients){
					//&& clients[j].id !== student.id
					if(clients[j].channel !== student.studying){
						stchannel.push(clients[j].sessionId);
					}
				}
			
				socket.broadcast(student,stchannel);
				
				});
				
			});
		}
		/*---------------------------------------------------
			GET COMMENTS
		-----------------------------------------------------*/
		else if(student.action == "getComments"){
			
			client_redis.hget(student.studying + ':post:' + student.postID, 'comments',function(err,reply){
			
			multi = client_redis.multi();
				i = 1;
				for(i=1;i<=reply;i++){
					multi.hget(student.studying + ":post:" + student.postID,student.studying + ":comment:" + i);
				}
				
				var data = { comments : null, action : null };
				
				multi.exec(function(err,replies){
					data.comments = replies;
					data.action = "getComments";
					client.send(data);
				});			
			});
			
		}
		/*---------------------------------------------------
			SEARCH
		-----------------------------------------------------*/
		else if(student.action == "search"){
		
		}
		
				
	})
});

/*------------------------------------------------------------------------------------------------------------------------------
	START LISTEN PORT 1111
----------------------------------------------------------------------------------------------------------------------------------*/
console.log("Stendev starts at port 1111")
app.listen(1111);



 // Primera forma 
	  
	/*
	//msg is an array of ids
	//msg no es array, pasa como string
	users = msg.split(",");
	client_redis = redis.createClient();
	multi = client_redis.multi();
	//console.log(typeof msg);
	//console.log(typeof users);
	//console.log(users.shift());
	while(users.length > 0){
			multi.hgetall("student:" + users.shift());
	}
	
	// Ejecuta un loop.
	multi.exec(function (err, replies) {
		//console.log(replies);
		client.send(replies);
	});*/



// msg = channel -> req.session.student.studying
  		
  		
		// Recorrer ids de base de datos, buscando quienes están estudiando lo mismo que tú.
		/*client_redis = redis.createClient();
		client_redis.get("id",function(err,reply){
			multi = client_redis.multi();
			while(reply>0){
				multi.hgetall("student:" + reply);
				reply--
			}
			multi.exec(function(err,replies){
				i = 0;
				for(i=0;i<replies.length;i++){
					if(replies[i].studying == msg){
						// Objeto con datos del usuario
						//client.send(replies[i]);					
						//console.log(replies[i]);
						//console.log(clients[0].sessionId);
						
					}
				}
			});
		});*/
		
		//Enviar a los demás usuarios, EVITAR LOS QUE NO ESTÁN



// Dentro de app.get("*",...)
// Guardado en Listas. Método 1
	
	/*
	
	// tengo req.session.student.id
	client.llen(salonID,function(err,reply){
		//console.log(reply);
		if(reply == "[]" || reply == 0){
			client.rpush(salonID,req.session.student.id)
		}
		else {
			var i = 0;
			//console.log("Reply : " + reply);
			multi = client.multi();
			for(i=0;i<reply;i++){
				multi.lindex(salonID,i)
			}
			
			multi.exec(function (err, replies) {
				//console.log(replies);
				var j = 0;
				//console.log(replies.length);
				isUser = false;
				while(j<replies.length && isUser == false){
					if(replies[j] == req.session.student.id){
						isUser = true;						
					}
				j++;
				}
				
				if(isUser == false){
					client.rpush(salonID,req.session.student.id);
				}
			});
		}
		
		
	});	*/









