var http = require('http');
var express = require('express');
var qs = require('querystring');
var io = require('socket.io');
var redis = require("redis");
var RedisStore = require('connect-redis');
var url = require('url');
const fbId = "194545070569456";
const fbSecret = "ef7cb79bdbbbd1e62f4ca84f89c331b8";
const fbCallbackAddress= "http://www.stendev.com/auth/facebook";
var auth= require('connect-auth');

var translate = require('translate');
var sock = require('./socket');
var routes = require('./routes');
var index = require('./index');
var facebook = require('./facebook');
var notebook = require('./notebook');
var user = require('./user');

var client_redis = redis.createClient();

var app = module.exports = express.createServer(
  express.logger('\x1b[1m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'),
  express.cookieDecoder(),
  express.session({ store: new RedisStore() })
);


app.set('views', __dirname + '/views');

app.configure(function(){
		app.use(express.bodyDecoder());
		app.use(express.favicon());
		//app.use(app.router);
 		app.use(express.methodOverride());
		//app.use(express.logger('\x1b[1m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
		app.use(express.staticProvider(__dirname + '/static'));		
		app.use(auth( [
    	auth.Facebook({appId : fbId, appSecret: fbSecret, scope: "email", callback: fbCallbackAddress})
  		]) );	
});


app.get('/',index.page);


app.get('/auth/facebook', function(req,res) {
	
  	 req.authenticate(['facebook'], function(error, authenticated) {
		   	
     if(authenticated) {

		var student = {
		name : req.getAuthDetails().user.name,
		firstname : req.getAuthDetails().user.first_name,
		lastname : req.getAuthDetails().user.last_name,
		facebook : req.getAuthDetails().user.link,
		fbID : req.getAuthDetails().user.id,
		email : req.getAuthDetails().user.email,
		university : facebook.university(req,res,student),
		career : facebook.career(req,res,student),
		posts : 0,
		courses : 0,
		avatar : 'http://graph.facebook.com/' + req.getAuthDetails().user.id + '/picture',
		}

		client_redis.sismember('fbIDS',req.getAuthDetails().user.id,function(err,reply){
			
			if(reply == 1){
				
				client_redis.scard("students",function(err,reply){
					i = 0;
					while(i < reply){
						client_redis.hgetall("student:" + (i+1),function(err,reply2){
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
				facebook.save(req,res,student);
			}
		});
      }
      else {
        res.end("<html><h1>Facebook authentication failed :( </h1></html>");
      }
   });
});

app.post('/login',function(req,res){
	client_redis.scard("students",function(err,reply){
			var login = false;
			if(reply == 0){
				i = 0
			}
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
	

app.post("/",function(req,res){
	//console.log(req.body);
	if(typeof req.body.studying != "undefined"){
			if(req.session.student){ 
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

//app.post('/',routes.studying);

app.get('*',function(req,res){
		
	sd = url.parse(req.url,true);
	
	console.log(sd);
	
	if(sd.pathname == '/slate'){
		routes.slate(req,res,sd);
	}
	else if(sd.pathname == '/nb'){
		routes.nb(req,res,sd);
	}
	
});

app.get('/id=:id',user.search);

app.get('/me',routes.me);

app.get('/slate',routes.slate);
 
app.get('/school',routes.school);

app.get('/stenpad',notebook.start);



app.get('/logout',function(req,res){
	req.session.destroy();
	req.logout();
	res.redirect('/');
});

app.post('/getPage',function(req,res){
	
	client_redis.hgetall("student:" + req.session.student.id + ":page:" + req.body.id,function(err,reply){
		
		res.writeHead(200, {"Content-Type": "application/json"});
		
		var page = {
			all : reply.all,
			record : reply.record,
			name : reply.name,
			id : reply.id
		}
		
		res.end(JSON.stringify(page));
		
	});
	
});


var socket = io.listen(app);

clients = []; // Array de sessionId, todos los que entran.

socket.on('connection', function(client){
	
	/*const client_student = redis.createClient();
	
	client_student.subscribe("me");
	
	client_student.on("subscribe",function(channel,count){
			client_redis.publish("me","Bienvenido a Stendev");
	});
	
	// On message in the channel
	client_student.on("message",function(channel,message){
		console.log(channel + " : " + message);
		client.send(message);
	});*/
	redis.createClient().publish("me","Bienvenido a Stendev");
		
  	client.on('message', function(student){	
		console.log("############################################");
			
		
		if (student.action == "enter"){
			sock.enter(socket,clients,client,student);
		}
		else if(student.action == "disconnect"){
			sock.disconnect(socket,clients,client,student);
		}
		else if(student.action == "getStudent"){
			sock.getStudent(socket,clients,client,student);
		}
		else if(student.action == "msgChat"){
			sock.msgChat(socket,clients,client,student);
		}
		else if(student.action == "newQuestion"){
			sock.newQuestion(socket,clients,client,student);
		}		
		else if(student.action == "toAnswer"){
			sock.toAnswer(socket,clients,client,student);
		}		
		else if(student.action == "reply"){
			sock.reply(socket,clients,client,student);	
		}
		else if(student.action == "newPost"){				
			sock.newPost(socket,clients,client,student);						
		}
		else if(student.action == "comment"){	
			sock.comment(socket,clients,client,student);
		}
		else if(student.action == "getComments"){
			sock.getComments(socket,clients,client,student);
		}
		else if(student.action == "saveNotebook"){
			sock.saveNotebook(socket,clients,client,student);
		}
		else if(student.action == "writting"){
			sock.writting(socket,clients,client,student);
		}
		else if(student.action == "search"){
			sock.search(socket,clients,client,student);
		}
		else if(student.action == "addcourse"){
			sock.addcourse(socket,clients,client,student);
		}
		else if(student.route == "notebook"){
			
			if(student.action == "mouseup"){
				sock.mouseup(socket,clients,client,student);
			}
			if(student.action == "mousedown"){
				sock.mousedown(socket,clients,client,student);
			}
			if(student.action == "mousemove"){
				sock.mousemove(socket,clients,client,student);
			}
		}
	})
});

/*------------------------------------------------------------------------------------------------------------------------------
	START LISTEN PORT 1111
----------------------------------------------------------------------------------------------------------------------------------*/
console.log("Stendev starts at port 1111")
app.listen(80);










