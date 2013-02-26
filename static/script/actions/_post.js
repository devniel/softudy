function _post(data,socket,student){
				
				// POST TEXT
				if(data.post.type == "text"){							 
					var post = $('<article class="post text" data-post-id="' + data.post.id_post + '">'+
											'<!--<div class="info-post"><img src="'+data.post.avatar+'"><span class="nameStudent">'+data.post.name+'</span></div>-->'+
											'<div class="contein-post" style="background:' + 
											data.post.background + '">' + data.post.value + '</div>'+
											'<footer>'+
											'<img src="'+data.avatar+'"><span class="nameStudent">'+data.name+'</span>'+				
											'<a title="Ocultar comentarios" class="btnHideComments">Ocultar</a>'+
											'<a title="Comenta este aporte" class="btnComment"><span class="nComments">0</span> Comentarios</a>'+
											'</footer>'+
											'</article>');
				}
				// POST URL
				else if(data.post.type == "url"){	
									
					// There aren't images
					if(data.url.image == false){
												
						var post = $('<article class="post text" data-post-id="' + data.post.id_post + '">'+
									'<div class="contein-post" style="background:' + data.post.background + '">' +
										'<span class="data-title">' + data.url.title + '</span>'+
										'<span class="data-description">' + data.url.description + '</span>'+
									'</div>'+
									'<footer>'+
												'<img src="'+data.avatar+'"><span class="nameStudent">'+data.name+'</span>'+				
												'<a title="Ocultar comentarios" class="btnHideComments">Ocultar</a>'+
												'<a title="Comenta este aporte" class="btnComment"><span class="nComments">0</span> Comentarios</a>'+
									'</footer>'+
									'</article>');
					}
					else {
						var post = $('<article class="post text" data-post-id="' + data.post.id_post + '">'+
									'<div class="contein-post" style="background:' + data.post.background + '">' +
										'<span class="data-title">' + data.url.title + '</span>'+
										'<img src="' + data.url.image + '"/>' +
										'<span class="data-description">' + data.url.description + '</span>'+
									'</div>'+
									'<footer>'+
												'<img src="'+data.avatar+'"><span class="nameStudent">'+data.name+'</span>'+				
												'<a title="Ocultar comentarios" class="btnHideComments">Ocultar</a>'+
												'<a title="Comenta este aporte" class="btnComment"><span class="nComments">0</span> Comentarios</a>'+
									'</footer>'+
									'</article>');
					}
				}
				// POST YOUTUBE
				else if(data.post.type == "youtube"){	
									
						var post = $('<article class="post video" data-video-id="' + data.youtube.id + '" data-post-id="' + data.post.id_post + '">'+
									'<div class="contein-post" style="background:' + data.post.background + '">' +
										'<div class="data-title">' + data.youtube.title + '</div>'+
										'<img src="' + data.youtube.thumbnail + '"/>' +
										'<div class="data-description">' + data.youtube.description + '</div>'+
									'</div>'+
									'<footer>'+
												'<img src="'+data.avatar+'"><span class="nameStudent">'+data.name+'</span>'+				
												'<a title="Ocultar comentarios" class="btnHideComments">Ocultar</a>'+
												'<a title="Comenta este aporte" class="btnComment"><span class="nComments">0</span> Comentarios</a>'+
									'</footer>'+
									'</article>');
				}
							 
				
				
				//post.css({'float':'left'});								
				//$("#collage .one").append(post);
				
				//alert($(".col").size()); // 5 elementos
				
				ncols = $(".col").size();
				
				ncols = ncols - 1; // 0 1 2 3 4
				
				scol = null;
				less = $(".0 article").size();
			
				for(var i = 0; i<=ncols;i++){
					//alert($("." + i + " article").size());
					if($("." + i + " article").size() <= less){
						scol = "." + i;
						less = $("." + i + " article").size();
					}
				}
				
				if($(scol + " article:first-child").length > 0){
					//post.insertBefore($(scol + " article:first-child"));
					$(scol).prepend(post);
				}
				else {
					post.appendTo($(scol));
				}		
					
}

