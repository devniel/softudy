// JavaScript Document

function disconnect(data,socket,student){
	
	if(student.route == "course"){
			$("[data-student-id='" + data.id +"']").remove();
			$('.opt-students').html(data.total);	
			
			var message = $('<div class="chat-msg">'
                                +'<b>' + data.name + '</b>' + ' se fue.'
								+'</div>');	
		
			$("#chat-log").append(message);
	}
	
	if(student.route == "notebook"){
			$("[data-student-id='" + data.id +"']").remove();
			$('.opt-viewers').html(data.total);	
	}
	
	if(student.route == "me"){
		var nstudents = $(".suggest-courses").find("[data-course-id='" + data.studying + "']").find(".nstudents").html();
		$(".suggest-courses").find("[data-course-id='" + data.studying + "']").find(".nstudents").html(parseInt(nstudents) - 1);
	}
}