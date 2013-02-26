function startTools(notepad){
	//notepad is an object
	// Style of the bars.
	
		
	/*$("#more").css({
			width : $("#board").width()
	});*/
	
	function refreshWidth(element,toElement){
		element.css({
			width: toElement.width(),
		});
	}
	
	/* ------------------------------------------------------
		More
	--------------------------------------------------------*/
	$("#more").click(function(){
		notepad.more();
	});
	
	/* ------------------------------------------------------
		Erase
	--------------------------------------------------------*/
	$(".eraser").click(function(){
		notepad.eraser();
		$("#canvas").css({
			cursor:'url(../img/tango/draw-eraser.png), auto'
		});
	});
	
	/* ------------------------------------------------------
		PENCIL
	--------------------------------------------------------*/
	$(".pencil").click(function(){
		notepad.pencil();
		$("#canvas").css({
			cursor:'url(../img/cursors/pencil.png), auto'
		});
	});

	/* ------------------------------------------------------
		BLANK
	--------------------------------------------------------*/
	$(".blank").click(function(){
		notepad.blank();
	});
	
	/* ------------------------------------------------------
		Save
	--------------------------------------------------------*/
	$(".save").click(function(){
		notepad.save();
	});
	
	/* ------------------------------------------------------
		Animate
	--------------------------------------------------------*/
	$(".animate").click(function(){
		notepad.animate();
	});
	
	
	/* ------------------------------------------------------
		Maximize
	--------------------------------------------------------*/
	/*$(".maximize").click(function(){
				
		$("#board").css({
			position : 'absolute',
			'padding-left' : 0,
			top : '50px',
			left : '5px',
			'z-index': '3',
        	width: '99%',
			margin: '0 auto'
		});
		
		$("#notepad").css({
			height:'600px'
		});
		
		refreshWidth($("#more"),$("#board"));
		
		//cuaderno.redraw(window.sessionStorage.getItem("record"),false);
		notepad.redraw($("#board").width(),$("#notepad").height());
	});*/
	
	/* ------------------------------------------------------
		Minimize
	--------------------------------------------------------*/
	/*$(".minimize").click(function(){
		$("#board").css({
			width:'800px',
			'z-index':0,
			'top':0,
			'left':0,
			float:'left',
			background:'transparent',
			'padding-left':'13px', 
			position:'relative',
		});
		
		resizer("onload");
		
		$("#notepad").css({
			height:'550px'
		});
	
		refreshWidth($("#more"),$("#board"));
		
		notepad.redraw2($("#board").width(),$("#notepad").height());
		
	});*/
	
}