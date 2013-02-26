// JavaScript Document
function _getStudent(data,socket,student){
	var dataText = "<span>Nombre : " + data.getData.name + "</span><br/>" +
					   "<span>Estudiando : " + data.getData.studying + "</span><br/>" +
					   "<span>Cuaderno : " +  "<a style='color:#FFF' href='http://www.google.com.pe/'>Google</a>";
					   
	$("#tooltip").html(dataText);
}