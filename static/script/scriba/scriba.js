function scriba() {
	
	$(".newPublish").click(function(){
		
		
		var container_pub = $("<div/>").css({
			position:'absolute',
			width:'100%',
			height:'100%',
			top : '0',
			left : '0',
			background:'#000',
			'z-index':'300',
			'opacity':0.4
		});
		
		var new_pub = $("<div/>").css({
			position:'absolute',
			top:'50%',
			left:'50%',
			width:'300px',
			height:'300px',
			'margin-top':'-150px',
			'margin-left':'-150px',
			background:'#FFF',
			'border-radius':'2px',
			'z-index':'400'
		});

		$('body').append(container_pub);
		$('body').append(new_pub);
		
			
		
		
	
	});
	
}