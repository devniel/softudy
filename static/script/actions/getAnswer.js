// JavaScript Document
function getAnswer(data,socket,student){
	
	if($('.answers').length > 0){
				$('.answers').remove();
			}
			var answers = $('<div class="answers"/>');
					
                    var questionBody = $('<div class="questionHeader qid' + data.question.qid + '">'
										+'<div class="questionStudent">'
											+'<img id="' + data.question.id + '" src="' + data.question.avatar + '" width="50px" height="50px">'
											+'<!--<div class="nameStudent" style="float:left;font:10px \'Myriad Web Pro\';text-align:center">' + data.question.name +'</div>-->'
										+'</div>'
										+'<div class="questionText">'
											+'<div class="questionTitle">' + data.question.title + '</div>'
											+'<div class="questionCont">' + data.question.cont +'</div>'
                            			+'</div>'
										+'<div class="questionFoot"><span class="replyButton" onclick="reply(' + data.question.qid + ')">Responder</span></div>'
										+'</div>');
					
					//answers.html(questionBody);
					answers.append(questionBody);
					//$("#apps").append(answers);
					
					$("#apps").html(answers);
					
					for(var i=1;i<=data.question.replies;i++){
						var reply = eval("data.question.reply" + i);
						var response = JSON.parse(reply);
						//alert(response.response);
						
						var answer = $('<div class="answer">'
                        	+'<div class="answerCont">' + response.response + '</div>'
                            +'<div class="answerStudent"><img id="' + response.id + '" src="' + response.avatar + '" width="30px" height="30px"></div>'
                    		+'</div>'                       
                   			+'</div>');
					
					$(".answers").append(answer);
					}
}