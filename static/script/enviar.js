// JavaScript Document

function enviar(msg,id) {
	
	message_box = $(".publish");
	
	
	//message_box.innerHTML = "";
	/*'<div class="post"><div class="message_post"><div class="post_avatar"><img src="' . $_SESSION["avatar"] . ' width="30px" height="30px"; /></div><p>' . $post_array["message"] . ' </p></div>
            <div class="cut2" style="clear:both"></div></div>';
	
			*/
	
	// form
	var form = document.forms.publish;

	var message = form.elements["publish_text"].value;
	
	var posts = document.getElementById("posts");
	
	// .post
	var post = document.createElement("div");
	post.className = "post";
	
	//posts.appendChild(post);
	
	
	var antes = posts.firstChild;
	
	posts.insertBefore(post,antes);
	
	/*** probando el ajax ***/
	/*** LOL funcionón a las 1:44 a.m. :D WIN@LIFE !! ***/
	
	peticion = new XMLHttpRequest();
		peticion.open("POST","/post",true);
		peticion.onreadystatechange = function(){
			if(peticion.readyState == 4 && peticion.status == 200){					
				post.innerHTML = peticion.responseText;	
			}
		}
		peticion.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		parametros = "msg=" + msg + "&id=" + id;
		peticion.send(parametros);
	
	message_box.value = "";
	message_box.rows = 1;
	

}
	