function viewPage(id){
	
	$("#board").html("");
	
	$.ajax({
			type : "POST",
			url: '/getPage',
			data : "id=" + id,
			success: function(pg){
				//alert(pg.all)
		
		
	
	$(".active").removeClass("active");
		$(".btnNotebook").addClass("active");
		
		 var page = $('<div id="notepad">'
           			+'<canvas id="canvas">'
                		+'Tu navegador no soporta la etiqueta canvas.'
            		+'</canvas>'
                	+'<div id="more">Más hoja</div>'
                +'</div>');
				
			$("#board").append(page);
		
			var cuaderno = new notebook($('#canvas'));
			cuaderno.startupNotebook();
			
			$('#canvas').mousedown(function(event){
				cuaderno.mousedown(event);
			});
			
			$('#canvas').mouseup(function(event){
				cuaderno.mouseup(event);
			});

			$('#canvas').mousemove(function(event){
				cuaderno.mousemove(event);
			});
			
			//cuaderno.background();
			startTools(cuaderno);
			
			cuaderno.putAll(pg.all);
			cuaderno.setRecord(pg.record);
			
			}
		});
}

function paget(obj){
	
	if(obj.page == "pageSaved"){
		
		var page = $('<div id="notebook-saved"/>');
		
		
		$.ajax({
			type : "GET",
			url: '/sd',
			success: function(data){
				page.append(data);
								
				$(".pageSaved").dblclick(function(){
					viewPage($(this).attr("data-id"));
				});
				
				$(".view").click(function(){
					viewPage($(this).parent().parent().parent().parent().attr("data-id"));
				});
				
				
				$(".delete").click(function(){
					alert("Hola");
				});
			
			}
		});
		
		$("#board").append(page);
		
		$(".active").removeClass("active");
		
		$(".btnSaved").addClass("active");
		
		
		
	}
	else if (obj.page == "notebook"){
		
		$(".active").removeClass("active");
		$(".btnNotebook").addClass("active");
		
		 var page = $('</div>'
                +'<div id="notepad">'
           			+'<canvas id="canvas">'
                		+'Tu navegador no soporta la etiqueta canvas.'
            		+'</canvas>'
                	+'<div id="more">Más hoja</div>'
                +'</div>');
				
			$("#board").append(page);
		
			var cuaderno = new notebook($('#canvas'));
			cuaderno.startupNotebook();
	
			$('#canvas').mousedown(function(event){
				cuaderno.mousedown(event);
			});
			
			$('#canvas').mouseup(function(event){
				cuaderno.mouseup(event);
			});

			$('#canvas').mousemove(function(event){
				cuaderno.mousemove(event);
			});
			
			//cuaderno.background();
			startTools(cuaderno);
	}
}