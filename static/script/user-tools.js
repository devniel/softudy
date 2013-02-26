function userTools(socket,student){
	
	var textarea = $("#publish-textarea");
	var cont =  $('<div/>').text(textarea.val()).html();	
	var cont = textarea.val();

	textarea.keydown(function(event){
		if(event.keyCode == '32'){
			if(typeof student.url == "undefined"){		
				var val =  $('<div/>').text($(this).val()).html();
				
				student.action = "writting";
				student.textarea = val;
				socket.send(student);
			}
		}
	});
	
	textarea.keyup(function(event){
		if(event.keyCode == '17'){		
			if(typeof student.url == "undefined"){
				var val =  $('<div/>').text($(this).val()).html();
				student.action = "writting";
				student.textarea = val;
				socket.send(student); 
			}
		}
	});
	
	
	
	/* IF exists the box #url-info the POST is an URL recognizer by _url.js */
		$("#publish-send").click(function(){
			
			// ACTION FOR SOCKET
			student.action = "newPost";
			
			//alert(student.url.title);		
			// TEXTAREA
			var textarea = $("#publish-textarea");
			var cont =  $('<div/>').text(textarea.val()).html();	
			var cont = textarea.val();
			
			// REPLACES BREAK LINES
			var formatext = cont.replace(/\n\r?/g, '<br />');		
	
			// SEND BY SOCKET
			student.post = {
					type : "text",
					value : formatext,
					background : textarea.css('background-color'),
			}
			
			/*if($("#url-info").length > 0){
				student.post.type = "url";
				// We HAVE NOW student.url IN _url.js			
			}*/
			
			if(typeof student.url != "undefined"){
				student.post.type = "url";
			}
			
			if(typeof student.youtube != "undefined"){
				student.post.type = "youtube";
			}
			
			socket.send(student);
			
			// ERASE TEXTAREA
			textarea.val("");
			
			textarea.css({
				height:'13px'
			});
			
			delete student.url;
			delete student.youtube;
			
			$("#url-info").remove();
								
		});
}