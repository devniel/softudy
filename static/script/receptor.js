/*
* Receptor
* Author : Daniel Flores
* A bag of actions.
*/

function receptor(socket,student){
	
	socket.on("message",function(data){
		
		if(data.action == "enter"){
			if(data.show == "new_student"){
				show_new_student(data,socket,student);
			}
			if(data.show == "student"){
				show_student(data,socket,student);
			}
			if(data.show == "post"){
				show_post(data,socket,student);
			}
		}
		else if(data.action == "disconnect"){
			disconnect(data,socket,student);
		}
		else if(data.action == "getStudent"){
			_getStudent(data,socket,student);
		}
		else if(data.action == "newQuestion"){
			newQuestion(data,socket,student);
		}
		else if(data.action == "toAnswer"){
			getAnswer(data,socket,student);
		}
		else if(data.action == "reply"){
			_reply(data,socket,student);
		}
		else if(data.action == "newPost"){
			_post(data,socket,student);		
		}
		else if(data.action == "comment"){
			_comment(data,socket,student);
		}
		else if(data.action == "getComments"){
			_getComments(data,socket,student);
		}
		else if(data.action == "msgChat"){
			_msgChat(data,socket,student);
		}
		else if(data.action == "writting"){
			
			// EVENT OF LINK
			if(data.event == "valid_link"){
				_valid(data,socket,student);
			}
			if(data.event == "link"){
				_url(data,socket,student);
			}
			if(data.event == "link_notfound"){
				_url_notfound(data,socket,student);
			}
			
			// EVENT OF YOUTUBE
			if(data.event == "youtube"){
				_youtube(data,socket,student);
			}
			if(data.event == "youtube_info"){
				_youtube_info(data,socket,student);
			}
		}
		else if(data.action == "finded"){
			_search(data,socket,student);
		}
		else if(data.route == "notebook"){
			
			if(data.action == "mousedown"){
				cuaderno.skdown(data.cord.x,data.cord.y);
			}
			if(data.action == "mousemove"){
				cuaderno.skmove(data.cord.x,data.cord.y);
			}
			if(data.action == "mouseup"){
				cuaderno.skup(data.cord.x,data.cord.y);
			}
			
		}
		
	});	
}