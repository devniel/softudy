// JavaScript Document
function _getComments(data,socket,student){	
	
	var box = $('article[data-post-id="' + data.postID + '"]');
	
	var comments = $('<section/>');
	
	for(var i=0;i<data.comments.length;i++){
		
		var comment = eval("(" + data.comments[i] + ")" );

		if( !(box.find('footer').find($('article[data-comment-id="' + comment.commentID + '"]')).length > 0)){

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
			
			comment_box.html('<span style="width:100%;float:left;padding:5px;"><img style="float:right;margin-top:2px;margin-right:10px" src="' + comment.avatar + '">' + comment.comment + '</span>');
				
			comments.append(comment_box);
		}
	}
		
	box.find("footer").first().append(comments);
	
}