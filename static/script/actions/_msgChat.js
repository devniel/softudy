function _msgChat(data,socket,student){
	
	var message = $('<div class="chat-msg">'
                                +'<div class="chat-user"><img src="' + data.avatar + '"/></div>'
								+ data.msg
								+'</div>');
	$("#chat-log").append(message);

}