function scribaSend(socket,student){
	$("#panelScriba").css({'display':'none'});
		
		student.action = "newPost";
		//alert($("#selectedType").val());
		if($("#selectedType").val() == 'text'){
			
			var cont =  $('<div/>').text($(".publish *:first-child").val()).html();
			
			var cont = $(".publish *:first-child").val();
			
			var text = cont;
			var formatext = text.replace(/\n\r?/g, '<br />');		

function convertUrls(texto){
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
		else if(url.match(/^(www)/i))
        	return '<a href="http://'+url+'">'+url+'</a>';
		return '<a href="'+url+'">'+url+'</a>';
    });
	
	return pass;
}

			formatext2 = convertUrls(formatext);

			student.post = {
				type : 'text',
				value : formatext2,
				background : $(".publish *:first-child").css('background-color'),
			}
			
			$(".publish *:first-child").val("");
			$(".publish *:first-child").css({background:"#FFF",height:"20px"});
			
			$(".publish *:first-child").focus(function(){
			$("#panelScriba").css({'display':'block'});
			
			
		});
		
		}
		else if($("#selectedType").val() == 'media'){
			$(".mediaInfo").remove();
			var videoID = youtube($(".publish *:first-child").val());
			student.post = {
				type : 'media',
				value : videoID,
				background : $(".publish *:first-child").css('background-color')
			}
			$(".publish *:first-child").val("");
			$(".publish *:first-child").css({background:"#FFF"});
			
			$(".publish *:first-child").focus(function(){
				$("#panelScriba").css({'display':'block'});
			});
		}
		
		else if($("#selectedType").val() == 'question'){
			
			var question = $(".questionTitle").val();
			var details = $(".questionInfo").val();
			
			student.post = {
				type : 'question',
				value : {
					title : question,
					info : details,
					},
				background : 'none',
			}
		}
		
		socket.send(student);
}