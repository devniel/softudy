function replyThis(qid,student){
	//alert(qid);
	
	student.action = 'reply';
	
	if($('.typeText').length > 0){
		var cont = $('<div/>').text($('.typeText').val()).html();
		var type = 'text';
	}
	else if ($('#notebook').length > 0){
		
		var cont = $('<div/>').text($('#rec').val()).html();
		var type = 'handwriting';
				
	}
	else if ($('.typeText').length > 0){
		
	}
	
	var buttonResponse = $('<span class="replyButton" onclick="reply(' + qid + ')">Responder</span>');
	
	$('.replier').remove();
	$('.questionFoot').html(buttonResponse);
	
	student.response = cont;
	student.type = type;
	student.qid = qid;
	
	socket.send(student);
}