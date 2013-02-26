// NEW STUDENT !
function show_new_student(data,socket,student){
	
	if(student.route == "course"){
		
	var student = $('<div class="data-student" data-student-id="' + data.id +'">'+
						'<div class="data-student-picture"><img src="' + data.avatar +'"/></div>'+
						'<div class="data-student-name">' + data.name +'</div>'+
						'</div>');
						
		$(".students").append(student);
						
		student.css({cursor:'pointer','margin-left':'2px'});
						
		student.mouseover(function(){
				getStudent(this.id);
		});
						
		student.click(function(){
				openChat(this.id);
				//getStudent(this.id);
		});
		
		$('.opt-students').html(data.total);
	}
	
	if(student.route == "me"){
	
	var nstudents = $(".suggest-courses").find("[data-course-id='" + data.studying + "']").find(".nstudents").html();
	$(".suggest-courses").find("[data-course-id='" + data.studying + "']").find(".nstudents").html(parseInt(nstudents) + 1);
		
	}
	
	if(student.route == "notebook"){
		
		var student = $('<div class="data-student" data-student-id="' + data.id +'">'+
						'<div class="data-student-picture"><img src="' + data.avatar +'"/></div>'+
						'<div class="data-student-name">' + data.name +'</div>'+
						'</div>');
						
		if($(".viewers").find($("[data-student-id='" + data.id +"']")).length == 0){
				$(".viewers").append(student);	
		}
		
		//alert($(".viewers").find($("[data-student-id='" + data.id +"']")).length)
				
						
		student.css({cursor:'pointer','margin-left':'2px'});
						
		student.mouseover(function(){
				getStudent(this.id);
		});
						
		student.click(function(){
				openChat(this.id);
				//getStudent(this.id);
		});
		
		$('.opt-viewers').html(data.total);
		
	}
}

// LIST OF STUDENTS
function show_student(data,socket,student) {
	
	// DATA STUDENTS COURSE
	if(student.route == "me"){
		for(var i=0;i<data.list.length;i++){
			$(".suggest-courses").find("[data-course-id='" + data.list[i].id + "']").find(".nstudents").html(data.list[i].students);
		}
	}
	
	if(student.route == "course"){
		for(var i=0;i<data.list.length;i++){
			
			var student = $('<div class="data-student" data-student-id="' + data.list[i].id +'">'+
							'<div class="data-student-picture"><img src="' + data.list[i].avatar +'"/></div>'+
							'<div class="data-student-name">' + data.list[i].name +'</div>'+
							'</div>');
							
			$(".students").append(student);
							
			student.css({cursor:'pointer','margin-left':'2px'});
							
			student.mouseover(function(){
					getStudent(this.id);
			});
							
			student.click(function(){
					openChat(this.id);
					//getStudent(this.id);
			});
		}
		
		$('.opt-students').html(data.list.length);
	}
	
	if(student.route == "notebook"){
		
		$(".viewers").html("");
		
		for(var i=0;i<data.list.length;i++){
			
			var student = $('<div class="data-student" data-student-id="' + data.list[i].id +'">'+
							'<div class="data-student-picture"><img src="' + data.list[i].avatar +'"/></div>'+
							'<div class="data-student-name">' + data.list[i].name +'</div>'+
							'</div>');
			
			if($(".viewers").find($("[data-student-id='" + data.list[i].id +"']")).length == 0){
				$(".viewers").append(student);	
			}
							
			
							
			student.css({cursor:'pointer','margin-left':'2px'});
							
			student.mouseover(function(){
					getStudent(this.id);
			});
							
			student.click(function(){
					openChat(this.id);
					//getStudent(this.id);
			});
		}
		
		$('.opt-viewers').html(data.list.length);
	}
}

// POSTS
function show_post(data,socket,student){
	
	var ncols = ($("#collage").width()/340).toFixed();
										
	var col = [];
					
	// CREATE COLUMNS ACCORD TO THE SCREEN SIZE
					
	for(var i=0;i<ncols;i++){
		col[i] = $('<section class="col ' + i + '"/>');
		col[i].appendTo($("#collage"));
	}
					
	j = 0;
	i = 0;

	while(j<data.list.length){
		while(i<ncols && j<data.list.length){

			if(!(data.list[j].comments >= 0)){
				var ncoments = 0
			}
			else {
				var ncoments = data.list[j].comments;
			}
								
			// POST TEXT						
			if(data.list[j].type == "text"){							 
				var post = $('<article class="post text" data-post-id="' + data.list[j].id_post + '">'+
				'<!--<div class="info-post"><img src="'+data.list[j].avatar+'"><span class="nameStudent">'+data.list[j].name+'</span></div>-->'+
				'<!--<div class="contein-post" style="background:' + 
				data.list[j].background + '">' + data.list[j].value + '</div>-->'+
				'<div class="contein-post">' + data.list[j].value + '</div>'+
				'<!--<section class="buttons">'+
				'<ul>'+
				'<li><button class="btn-post-close"></button></li>'+
				'</ul>'+
				'</section>-->'+
				'<footer>'+
				'<img src="'+data.list[j].avatar+'"><span class="nameStudent">'+data.list[j].name+'</span>'+				
				'<a title="Ocultar comentarios" class="btnHideComments">Ocultar</a>'+
				'<a title="Comenta este aporte" class="btnComment"><span class="nComments">' + ncoments + '</span> Comentarios</a>'+
				'</footer>'+
				'</article>');
			}
			// POST URL
			else if(data.list[j].type == "url"){										
				// There aren't images
				if(data.list[j].image == false){												
					var post = $('<article class="post text" data-post-id="' + data.list[j].id_post + '">'+
					'<!--<div class="contein-post" style="background:' + data.list[j].background + '">-->' +
					'<div class="contein-post">' +
					'<span class="data-title">' + data.list[j].title + '</span>'+
					'<span class="data-description">' + data.list[j].description + '</span>'+
					'</div>'+
					'<footer>'+
					'<img src="'+data.list[j].avatar+'"><span class="nameStudent">'+data.list[j].name+'</span>'+				
					'<a title="Ocultar comentarios" class="btnHideComments">Ocultar</a>'+
					'<a title="Comenta este aporte" class="btnComment"><span class="nComments">' + ncoments + '</span> Comentarios</a>'+
					'</footer>'+
					'</article>');
				}
				else {
					var post = $('<article class="post text" data-post-id="' + data.list[j].id_post + '">'+
					'<!--<div class="contein-post" style="background:' + data.list[j].background + '">-->' +
					'<div class="contein-post">' +
					'<span class="data-title">' + data.list[j].title + '</span>'+
					'<img src="' + data.list[j].image + '"/>' +
					'<span class="data-description">' + data.list[j].description + '</span>'+
					'</div>'+
					'<footer>'+
					'<img src="'+data.list[j].avatar+'"><span class="nameStudent">'+data.list[j].name+'</span>'+				
					'<a title="Ocultar comentarios" class="btnHideComments">Ocultar</a>'+
					'<a title="Comenta este aporte" class="btnComment"><span class="nComments">' + ncoments + '</span> Comentarios</a>'+
					'</footer>'+
					'</article>');
				}
			}
			// POST VIDEO
			else if(data.list[j].type == "youtube"){						
					var post = $('<article class="post video" data-video-id="' + data.list[j].youtube_id + '" data-post-id="' + data.list[j].id_post + '">'+
					'<!--<div class="contein-post" style="background:' + data.list[j].background + '">-->' +
					'<div class="contein-post">' +
					'<div class="data-title">' + data.list[j].youtube_title + '</div>'+
					'<img src="' + data.list[j].youtube_thumbnail + '"/>' +
					'<div class="data-description">' + data.list[j].youtube_description + '</div>'+
					'</div>'+
					'<footer>'+
					'<img src="'+data.list[j].avatar+'"><span class="nameStudent">'+data.list[j].name+'</span>'+				
					'<a title="Ocultar comentarios" class="btnHideComments">Ocultar</a>'+
					'<a title="Comenta este aporte" class="btnComment"><span class="nComments">' + ncoments + '</span> Comentarios</a>'+
					'</footer>'+
					'</article>');
			}
											
			$(col[i]).prepend(post);
			i++;
			j++;		
		}
		i=0;
	}
}