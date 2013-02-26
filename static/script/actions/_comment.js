// JavaScript Document
function _comment(data,socket,student){
	
	// data = Commnet
	comment = data;
	
		var box = $('#collage').find('article[data-post-id="' + comment.postID + '"]');
		
		var n = box.find("footer").first().find(".nComments").html();
		
		var plus = parseInt(n) + 1;
		
		box.find("footer").first().find(".nComments").html(plus);
		
		$(box).find(".contein-post").effect("highlight", {color:"#DAE4E8"}, 3000);
		
		//$(box).effect("highlight", {color:"#DAE4E8"}, 3000);
		
		var isbox = box.find('footer').find('textarea');
		
		if(isbox.length == 0){
			
		}
		else {
		var comment_box = $('<article data-comment-id="' + comment.commentID + '" class="comment"/>').css({
				width : '310px',
				height : 'auto',
				background : '#DAE4E8',
				float : 'left',
				'margin-left':'5px',
				'border-radius': '2px',
				font:'11px Myriad Web Pro',
				'margin-bottom':'5px'
		});
			
		comment_box.html('<span style="float:left;padding:5px;">' + comment.comment + '</span>');
				
		var comment_footer = $('<img style="float:right;margin-top:2px;" src="' + comment.avatar + '">');			
			
		comment_footer.appendTo(comment_box);
				
		box.find("section").append(comment_box);
		
		}

}