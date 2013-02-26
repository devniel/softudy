function _search(data,socket,student){
	
	$("#search-results").html("");
	
	for(i in data.list){
		
		//var is = $("#right_container").find("[data-course-id='" + data.list[i].id + "']");
		
		//if(is.length == 0){						   
			var course = $('<div class="course-container" data-course-id="' + data.list[i].id + '">'+
                            '<div class="course-data title">'+data.list[i].name+'</div>'+
                            '<div class="course-data students"><img width="13" style="margin-right:10px" src="/img/icons/user.png">'+data.list[i].students+'</div>' +   
                            '<div class="course-data university">'+data.list[i].university+'</div>'+
                            '<div class="course-data career">'+data.list[i].career+'</div>'+
                            '</div>');
			course.appendTo($("#search-results"));
		//}
	}
}