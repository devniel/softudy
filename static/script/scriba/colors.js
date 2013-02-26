function scribaColors(){
	// Choose the color of the post
	$(".color").click(function(){
	$(".publish *:first-child").css({
		background:$(this).css('background-color')
		});
	});
}