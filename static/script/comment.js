function comentar(element,url_img) {
	
	var comments_div = element.parentNode.parentNode;
	//alert(comments_div);
	
	// .comment
	var comment = document.createElement("div");
	comment.className = "comment";
	
	// <div class="comment_avatar">
	var comment_avatar = document.createElement("div");
	comment_avatar.className = "comment_avatar";
	
	// <img>
	var img = document.createElement("img");
	img.src = "LOL";
	img.setAttribute("width","30px");
	img.setAttribute("height","30px");
	img.src = url_img; 
	
	// <div class="cut2">
	var cut = document.createElement("div");
	cut.className = "cut2";
	cut.style.clear = "both";
	
	// form
	var form = document.forms.comment;
	
	//alert(element.previousSibling.previousSibling.elements["comment_text"].value);
	//alert(form.elements["comment_text"].value);
	

	// del elemento al momento, recordemos que si usamos document.forms.comment obtenemos varios formularios
	var comment_text = element.previousSibling.previousSibling.elements["comment_text"].value;
	
	// ID_POST
	var id_post = element.previousSibling.previousSibling.elements["id_post"].value;
	//comment_text = $(".comment_textarea").val();
	
	var txtMessage = document.createTextNode(comment_text);
	
	// <p>
	var paragraph = document.createElement("p");
	paragraph.appendChild(txtMessage);

	comment_avatar.appendChild(img);
		
	comment.appendChild(comment_avatar);
	
	comment.appendChild(paragraph);
	comment.appendChild(cut);

	comments_div.appendChild(comment);
	
	comments_div.insertBefore(comment,element.parentNode);
	
	/*** probando el ajax ***/
	/*** LOL funcionón a las 1:44 a.m. :D WIN@LIFE !! ***/
	
	peticion = new XMLHttpRequest();
	peticion.open("POST","/stendev/ajax/comment.php",true);
	peticion.onreadystatechange = function(){
		if(peticion.readyState == 4 && peticion.status== 200){
		}
		
	}
	peticion.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var parametros = "comment_text=" + comment_text + "&id_post=" + id_post; // + "&title=" + title;
	peticion.send(parametros);
	
	element.previousSibling.previousSibling.elements["comment_text"].value = "";
	element.previousSibling.previousSibling.elements["comment_text"].rows = 1;
	

}
	