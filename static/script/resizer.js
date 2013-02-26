function resizer(type){
	
	if(type == "onload"){
		
		document.getElementById("board").style.width = $("#page").width() - $("#tools").width() - $("#sidebar").width() - 30 + "px";
		
		$(".publish").css({
			width : $('#scriba').width() - 55, // 10 + 45
		});
		
		
	}
	/*else if(type == "onresize"){
		
		document.getElementById("board").style.width = $("#page").width() - $("#tools").width() - $("#sidebar").width() -20+ "px";
	
		if($("#page").width() <= 1024){
			$('#sidebar').css({
				width : '50px'
			});
			
			$('#students').css({
				width : '50px',
			});
			
			var ctfive = $(".five").html();
			$(".five").html("");
			$(".one").append(ctfive);
		}
		else {
			$('#sidebar').css({
				width : '200px'
			});
			
			$('#students').css({
				width : '200px',
			});
		}
		
		$(".publisher").css({
			width : $('#scriba').width() - 55, // 10 + 45
			padding : '10px',
			height : '20px',
		});
	}
			*/
		
		
	
}