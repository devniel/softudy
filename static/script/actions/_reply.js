// JavaScript Document
function _reply(data,socket,student){
	if($('.qid' + data.qid).length > 0){
				
				//alert(data.type);
				if(data.type == 'text'){
				
					var answer = $('<div class="answer">'
								+'<div class="answerCont">' + data.response + '</div>'
								+'<div class="answerStudent"><img id="' + data.id + '" src="' + data.avatar + '" width="30px" height="30px"></div>'
								+'</div>'                       
								+'</div>');
								
					$(".answers").append(answer);
					
				}
				
				if(data.type == 'handwriting'){
		
					var handwriting = $('<canvas class="handwriting" style="position:relative" width="840" height="300"/>').css({
													background:'#FFF',
													float:'left',
										})
						
					$(".answers").append(handwriting);
					
					redraw_saved(data.response);
				}				
			}
}