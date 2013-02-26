function scribaOptions(){
	
		$(".publish *:first-child").focus(function(){
			$("#panelScriba").css({'display':'block'});
		});
	
	
	// BTN HandWriting
		$(".btnHandwriting").click(function(){
				
				$("#selectedIcon").html('<img src="img/buttons/draw-freehand.png">');
				$("#selectedType").val('handwriting');
				
				var scribaHandwriting = $('<canvas id="notebook"/>');
				scribaHandwriting.css({
					width : $('#scriba').width(), // 10 + 45
					padding : '0px',
					height : '300px',
					'padding-right' : '0px',
					background : '#FFF',
					'-webkit-box-shadow':'1px 1px 5px #EEE',
					'box-shadow':'0 0 3px #CCC',
					border:'1px solid #D8D8D8',
					'border-radius':'2px'
				});
			$(".publish").html("");
			$(".publish").append(scribaHandwriting);
			
			var cuaderno = new notebook($('#scriba').width(),300);
			cuaderno.show(cuaderno.rec);				
		});
		
		// BTN MEDIA	
		$(".btnMedia").click(function(){
			$("#selectedIcon").html('<img src="img/buttons/video-x-generic.png">');
			$("#selectedType").val('media');
			
			var scribaMedia = $('<input class="media" name="media" placeholder="Pega el link del video"/>');
				scribaMedia.css({
					width : $('#scriba').width() - 55, // 10 + 45
					padding : '10px',
					height : '15px',
					'padding-right' : '45px',
					'-webkit-box-shadow':'1px 1px 5px #EEE',
					'box-shadow':'0 0 3px #CCC',
					border:'1px solid #D8D8D8',
					'border-radius':'2px',
					font:"12px 'Myriad Web Pro'",
					color:'#666',
					float:'left',
				});
				$(".publish").html("");
				$(".publish").append(scribaMedia),
				
				//** Youtube Extractor
				
				
				$('.media').keyup(function(){
					
					if($('.mediaInfo').length == 0){
					$('<div class="mediaInfo"/>').css({
					width : $('#scriba').width() -55,
					padding : '10px',
					height : 'auto',
					background : '#FFF',
					'padding-right' : '45px',
					}).appendTo(".publish");
					}
					
					//alert(youtube($(this).val()));
					if($('.publish iframe').length == 0){
					var iframeYoutube = $('<iframe title="YouTube video player" style="margin-top:15px" width="400" height="300" src="http://www.youtube.com/embed/' + youtube($(this).val()) + '?rel=0" frameborder="0" allowfullscreen></iframe>');
					iframeYoutube.appendTo($('.mediaInfo'));
					
					
					}
				});	
			});
			
		// BTN TEXT
		$(".btnText").click(function(){
			
			$("#selectedIcon").html('<img src="img/buttons/text-x-generic.png">');
			$("#selectedType").val('text');
			
			var scribaText = $('<textarea class="publisher" name="publish_text" onfocus="autoTextArea(this)" placeholder="¿Qué estás estudiando?" name="message"></textarea>');
				scribaText.css({
					width : $('.publish').width(), // 10 + 45
					padding : '10px',
					height : '15px',
					'padding-right' : '45px'
				});
				$(".publish").html("");
				$(".publish").append(scribaText);
		});
		
		// BTN QUESTION
		$(".btnQuestion").click(function(){
			$("#selectedIcon").html('<img src="img/buttons/help.png">');
			$("#selectedType").val('question');
			
			var questionTitle = $('<input type="text" class="questionTitle" name="questionTitle" placeholder="Pregunta"/>');
			questionTitle.css({
					width : $('#scriba').width() - 55, // 10 + 45
					padding : '10px',
					height : '15px',
					'padding-right' : '45px',
					'-webkit-box-shadow':'1px 1px 5px #EEE',
					'box-shadow':'0 0 3px #CCC',
					border:'1px solid #D8D8D8',
					'border-radius':'2px',
					font:"12px 'Myriad Web Pro'",
					color:'#666',
					float:'left',
					});
					
			var scribaQuestion = $('<textarea class="questionInfo" name="questionInfo" onfocus="autoTextArea(this)" placeholder="Información adicional"></textarea>');
			scribaQuestion.css({
					width : $('.publish').width(), // 10 + 45
					padding : '10px',
					height : '15px',
					'padding-right' : '45px',
					'-webkit-box-shadow':'1px 1px 5px #EEE',
					'box-shadow':'0 0 3px #CCC',
					border:'1px solid #D8D8D8',
					'border-radius':'2px',
					resize: 'none',
					'margin-top': '5px',
					font:"12px 'Myriad Web Pro'",
					color:'#666',
					float:'left',
					'padding-top':'10px',
					'padding-left':'10px',
					'margin-bottom':'5px'
				});
			$(".publish").html("");
			$(".publish").append(questionTitle);
			$(".publish").append(scribaQuestion);
		});
		
		
}