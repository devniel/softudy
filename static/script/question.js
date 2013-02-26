function question(student) {
	
	var titleQuestion = $('<input type="text" class="titleQuestion" name="titleQuestion" placeholder="Título de pregunta"/>');
	titleQuestion.insertBefore($('.publish'));
	
	$('#btn_publish').click(function(){
		
		//var title =  $("input[name=titleQuestion]").val();
		
		// htmlentities
		var title = $('<div/>').text($("input[name=titleQuestion]").val()).html();
		var cont = $('<div/>').text($("textarea[name=message]").val()).html();
		
		
		student.action = "newQuestion";
		student.question = {
			'title' : title,
			'cont' : cont,
		}
		
		socket.send(student);
});
}