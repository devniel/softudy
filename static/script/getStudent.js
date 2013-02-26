// Function getStudent

function getStudent(id_user,student) {
	
	student.action = "getStudent";
	student.getData = id_user;
	
	socket.send(student);

	$('#tooltip').css({
		top : 	$('#' + id_user).offset().top + 18,
		display : 'block',
		left : 	$('#' + id_user).offset().left + 18,
		zIndex : 3
	});
	
	$('#tooltip').mouseover(function(){
		$('#tooltip').css({
			display: 'block'
			});
			});
			
	$('#tooltip').mouseout(function(){
		$('#tooltip').css({
			display: 'none'
			});
			});
	
	$('#' + id_user).mouseout(function(){
		$('#tooltip').css({
			display: 'none'
			});
			});
}