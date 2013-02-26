function hide_comments(element){
	element.nextSibling.nextSibling.style.display = "none";
	element.setAttribute("onclick","show_comments(this)");
}