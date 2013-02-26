// JavaScript Document
function show_comments(element,id_post){
	
	if(element.nextSibling.nextSibling){
		element.nextSibling.nextSibling.style.display = "block";
	}
	else {
	
	var comment = document.createElement("div");
	comment.className = "comment";
	element.parentNode.appendChild(comment);
	
	peticion = new XMLHttpRequest();
	peticion.open("POST","/stendev/ajax/show_comments.php",true);
	
	peticion.onreadystatechange = function(){
			if(peticion.readyState == 4 && peticion.status== 200){
				comment.innerHTML = peticion.responseText;
				
			}
	}
	
	peticion.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var parametros = "id_post=" + id_post; // + "&title=" + title;
	peticion.send(parametros);
	
	//alert(element.parentNode.firstChild);

}
element.setAttribute("onclick","hide_comments(this)");
}