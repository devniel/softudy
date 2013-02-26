// JavaScript Document
function newQuestion(data,socket,student){
              var question = $('<div class="question ' + data.question.qid + '">'
                            +'<div class="theQuestion">'
                            + data.question.title
                            + '</div>'
                            + '<div class="pictureStudent">'
                            +  '<img id="' + data.id + '" src="' + data.avatar + '" width="16px" height="16px" style="cursor: pointer; margin-left: 2px; ">'
                            +  '</div>'
                            + '<div style="clear:both"></div>'
                        	+ '</div>');
							
				if($('.question').length == 0){
					$('.listQuestions').html(question);
				}
				else {
					question.insertBefore($('.question').first());
				}
				
				question.click(function(){
						qid = this.className.split(" ");
						//alert(qid[1]);
						student.qid = qid[1];
						student.action = "toAnswer";
						socket.send(student);
					});
					
			// Public in board
			
			var question_to_board = $('<div class="note">'
									+ '<h1>' + data.question.title + '</h1>'
									+'</div>');
									
			question_to_board.insertBefore($('.note').first());
}