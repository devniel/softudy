function _valid(){
	if($("#url-info").length == 0){
		var url_info = $("<section id='url-info'/>").appendTo($(".publish").find('section'));
	}
}

function _url(data,socket,student){
		
		$("#url-info").css({
			background:'#FFF',
			padding:'5px'
		});
		
		img = new Image();
		img.src = data.url.images[0];
		
		var short_title = data.url.title.substring(0, 47);
						short_title += "...";
						
		var short_description = data.url.description.substring(0, 130);
						short_description += "...";
		
		$("#url-info").html('<div class="data-title">' + short_title + '</div>'+
							'<img id="data-img" data-image-id="0" src="' + data.url.images[0] + '"/>' +
								'<div class="data-description">' + short_description + '</div>'+
								'<section id="button_img">'+
								'<button id="left_img">&lt;</button><button id="right_img">&gt;</button>'+
								'</section>'+
								'<div style="clear:both"></div>'
							);
		
		var max_id_img = data.url.images.length;
		
		$("#button_img").css({
			width:'100%',
			float:'left',
			'margin-top':'5px'
		});
		
		$("#left_img").css({
			float:'left',
			position:'relative',
			width:'20px',
			height:'20px',
			'margin-right':'5px',
			'text-align':'center'
		});
		
		$("#right_img").css({
			float:'left',
			position:'relative',
			width:'20px',
			height:'20px',
			'text-align':'center'
		});
		
		var id_img = 0;
		var url = {};
		url.title = short_title;
		url.description = short_description;
		url.image = $("#url-info").find("img").attr("src");
		
		student.url = {};
		
		student.url = {
						title : url.title,
						image : url.image,
						description : url.description,
		}

		
		$("#left_img").click(function(){
			if(id_img > 0){
				id_img+=1;
				$("#url-info").find("img").attr("data-image-id", data.url.images[id_img]);
				$("#url-info").find("img").attr("src", data.url.images[id_img]);
				student.url.image = $("#url-info").find("img").attr("src");
			}
		});
		
		$("#right_img").click(function(){
			if(id_img <= data.url.images.length){
				id_img+=1;
				$("#url-info").find("img").attr("data-image-id", data.url.images[id_img]);
				$("#url-info").find("img").attr("src", data.url.images[id_img]);
				student.url.image = $("#url-info").find("img").attr("src");
			}
		});
		
		// ADD URL PROPIETY TO STUDENT
		
		 

}

function _url_notfound(data,socket,student){
		$("#url-info").css({
			background:'#FFF',
			padding:'5px'
		});
		
		$("#url-info").html('<div class="data-title">' + data.url.title + '</div>'+
							'<div style="clear:both"></div>'
		);
}

/*
	YOUTUBE
*/

function _youtube(data,socket,student){
	
		if($("#url-info").length == 0){
			var url_info = $("<section id='url-info'/>").appendTo($(".publish").find('section'));
		}
}

function _youtube_info(data,socket,student){
		
		$("#url-info").css({
			background:'#FFF',
			padding:'5px'
		});
		
		img = new Image();
		img.src = data.youtube.thumbnail[0].url;
		
		var short_title = data.youtube.title;
		if(data.youtube.description.length > 200){			
			var short_description = data.youtube.description.substring(0,200);
			short_description += " ...";
		}
		else {
			var short_description = data.youtube.description;
		}
		
		$("#url-info").html('<div class="data-title">' + short_title + '</div>'+
							'<img id="data-img" data-image-id="0" src="' + data.youtube.thumbnail[0].url + '"/>' +
								'<div class="data-description">' + short_description + '</div>'+
								'<section id="button_img">'+
								'<button id="left_img">&lt;</button><button id="right_img">&gt;</button>'+
								'</section>'+
								'<div style="clear:both"></div>'
							);
		
		$("#button_img").css({
			width:'100%',
			float:'left',
			'margin-top':'5px'
		});
		
		$("#left_img").css({
			float:'left',
			position:'relative',
			width:'20px',
			height:'20px',
			'margin-right':'5px',
			'text-align':'center'
		});
		
		$("#right_img").css({
			float:'left',
			position:'relative',
			width:'20px',
			height:'20px',
			'text-align':'center'
		});
		
		var id_img = 0;
		
		var youtube = {};		
		youtube.title = short_title;
		youtube.description = short_description;
		youtube.thumbnail = $("#url-info").find("img").attr("src");
		
		student.youtube = {};
		
		student.youtube = {
						title : youtube.title,
						thumbnail : youtube.thumbnail,
						description : youtube.description,
						id : data.youtube.id
		}

		
		$("#left_img").click(function(){
			if(id_img > 0){
				id_img+=1;
				$("#url-info").find("img").attr("data-image-id", data.youtube.thumbnail[id_img].url);
				$("#url-info").find("img").attr("src", data.youtube.thumbnail[id_img].url);
				student.youtube.thumbnail = $("#url-info").find("img").attr("src");
			}
		});
		
		$("#right_img").click(function(){
			if(id_img <= data.youtube.thumbnail.length){
				id_img+=1;
				$("#url-info").find("img").attr("data-image-id", data.youtube.thumbnail[id_img].url);
				$("#url-info").find("img").attr("src", data.youtube.thumbnail[id_img].url);
				student.youtube.thumbnail = $("#url-info").find("img").attr("src");
			}
		});

}

