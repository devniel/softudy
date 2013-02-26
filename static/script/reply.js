function reply(qid){

	var replier = $('<div class="replier">'
                    	+'<div class="typeReplier">'	
                        +'<textarea class="typeText"></textarea>'
                        +'</div>'
                        
                        +'<div class="typeSelect">'
                        	+'<button class="btn" onclick="replyThis(' + qid + ')" style="float:left;">Enviar</button>'
                            +'<select id="typeReply">'
                            +'<option>Texto</option>'
                            +'<option>Papel</option>'
                            +'<option>Código</option>'
                            +'</select>'
                        +'</div>'
                    +'</div>');
					
	$('.questionFoot').html(replier);
	
	$("#typeReply").change(function(){
	var type = $(this).val();
	
	if(type == "Papel"){
		
		var canvasApp = $('<canvas id="notebook" style="position:relative"/>').css({
			background:'#FFF',
			float:'left',
		})
		
		$('.typeReplier').html(canvasApp);
		
		var cuaderno = new notebook();
		cuaderno.show(cuaderno.rec);
		
		var rec = $('<input id="rec" type="hidden"/>');
		
		$('.typeReplier').append(rec);

		
	}
	
	if(type == "Texto"){
		var typeText = $('<textarea class="typeText"/>');
		$('.typeReplier').html(typeText);
	}
	
	if(type == "Código"){
		var typeCode = $('<textarea class="typeText" style="background:#000;color:#FFF;font:12px \'Consolas\'"/>');
		$('.typeReplier').html(typeCode);
		
	}
});	
}
