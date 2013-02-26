/** StenPad | Student's Pad
   Company : Stendev
   Author : Daniel Flores 
*/
   
function notebook(element) {
		
		this.rec = new Array();
		
		this.width = element.width();
		
		this.height = element.height();
		
		this.canvas = element[0]; // An object of Jquery
		
		this.ctx = this.canvas.getContext("2d");
		
		this.record = null;
		
		x=null;
		
		y=null;
		
		/**
			Background
		*/
		
		this.background = function(){
			
			var backCanvas = document.createElement("canvas");
			
			var backCtx = backCanvas.getContext("2d");
			
			backCanvas.width = this.width;
			
			backCanvas.height = this.height;
			
			document.getElementById("notepad").appendChild(backCanvas); // Append to parent element
			
			// Draw the 'cuadricula'
			
			for(var x=0.5;x<this.width;x+=15){
				backCtx.moveTo(x,0);
				backCtx.lineTo(x,this.height);
			}
			
			for(var y=0.5;y<this.height;y+=15){
				backCtx.moveTo(0,y);
				backCtx.lineTo(this.width,y);
			}
			
			backCtx.strokeStyle = "#EEE";
			backCtx.stroke();		
		}
		
		/**
			Start Notebook
		*/
		
		this.startupNotebook = function() {
			
			var x;
			var y;
			
			//canvas.width = 880;
			this.canvas.width = element.width();
			this.canvas.height = element.height();
			
			
			this.ctx.lineWidth = 1;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
			
			this.ctx.strokeStyle = "#333";
			
			//this.canvas.style.background = "#FFF";
			
		}
		
		/**
        On mouse down.
        @param e Event
    	*/
		
		this.mousedown = function(e) {
				x = e.layerX;
				y = e.layerY + document.getElementById("notepad-show").scrollTop ;
				
				this.ctx.beginPath();
				this.ctx.moveTo(x, y);
				
				cord = {
					x : x,
					y : y
				}
				
				student.action = "mousedown";
				student.cord = cord;
				socket.send(student);
				
				
								
				
        }
		
		/**
        On mouse up.
        @param e Event
    	*/
		
		this.mouseup = function(e) {
				x = "space";
				y = "space";
				
				n = this.rec.length;		
				this.rec[n] = new Array(x,y);
				
				//$('#rec').val(this.rec);
				// Save to session storage
				//window.sessionStorage.setItem("record",rec);
				var imageData = this.ctx.getImageData(0,0,element.width(),element.height());
				
				this.record = imageData;
				
				x = null;
				y = null;
				this.ctx.closePath();
				
				
				cord = {
					x : "space",
					y : "space"
				}
				
				student.action = "mouseup";
				student.cord = cord;
				socket.send(student);

				
				
       	}
		
		/**
        On mouse move.
        @param e Event
    	*/
		
		this.mousemove = function(e) {
				
				// Deselect
				document.getElementById("canvas").onselectstart = function(){ return false; }
				
				if (x == null || y == null) {
				  return false;
				}
				
				x = e.layerX ;
				y = e.layerY + document.getElementById("notepad-show").scrollTop;
				
				//  + document.getElementById("notepad-show").scrollTop
				
				//alert(x);
				
				n = this.rec.length;	
					
				this.rec[n] = new Array(x,y);
				
				$('#rec').val(this.rec);
				
				cord = {
					x : x,
					y : y
				}
				
				student.action = "mousemove";
				student.cord = cord;
				socket.send(student);
				
				// Save to session storage
				//window.sessionStorage.setItem("record",rec);
				//window.sessionStorage.setItem("record",canvas.toDataURL("image/png"));
				
				this.ctx.lineTo(x, y);
				this.ctx.moveTo(x, y);
				this.ctx.stroke(); 					
		}
		
		
		this.animate = function(recorded){
			//record
			if(recorded){
				var rec = new String();
				rec = recorded.toString();
			}
			else {
				var rec = new String();
				rec = this.rec.toString();
			}
			
			coordenates = rec.split(",");
			
						ancho = coordenates.length;
						//alert(coordenates.length);
						i=0
						other = new Array();
						while(i<=(ancho/2)){
							j=0;
							other[i] = new Array();
							while(j<=1){
								other[i][j] = coordenates.shift();
								j++;
							}
							//alert(other[i][0] + "," + other[i][1]);
							i++;
						}
						
						this.canvas.width = this.canvas.width;
						this.ctx.lineWidth = 2;
						this.ctx.lineCap = 'round';
						this.ctx.lineJoin = 'round';
						this.ctx.strokeStyle = "#333";
						
						var i = 0;						
						
						var context = this.ctx;
						
							animation = setInterval(function(){
										var m = other[i][0];
										var n = other[i][1];
										//alert(m + " , " + n)
										
										context.lineTo(m,n);
										
										context.stroke();
										
										if((other[i+1][0] == "space") && ((i+2)<(other.length-1))){
											context.moveTo(other[i+2][0],other[i+2][1]);
											i+=2;
										}
										else {
											i++;
										}
										
										if(i==(other.length-1))clearTimeout(animation);
							},30);
		}
		
		this.more = function(){
			
			var imageData = this.ctx.getImageData(0,0,element.width(),element.height());
			
			this.canvas.height = this.canvas.height + 500;
			
			element.height(element.height() + 500);
			
			this.ctx.putImageData(imageData,0,0);
			this.ctx.lineWidth = 2;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
			
			//this.background();
			
		}
		
		this.redraw = function(width,height){
			var imageData = this.ctx.getImageData(0,0,element.width(),element.height());
			this.canvas.width = width;
			this.canvas.height = height;
			this.ctx.putImageData(imageData,0,0);
			this.ctx.lineWidth = 2;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
		}
		
		this.putAll = function(dataURL){
			
			//alert(dataURL);
			
    //Your code here
			var page = new Image();
			
			page.src = dataURL;
			
			context = this.ctx;
			
			page.onload =function(){ 
				//alert(context);
				context.drawImage(page, 0, 0); 
			} 
		}
		
		this.redraw2 = function(width,height){
			// claro, element busca al $("#notepad");
			alert(element.width());
			var imageData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
			alert(imageData.width);
			alert(canvas.width);
			this.canvas.width = imageData.width;
			this.canvas.height = height;
			this.ctx.putImageData(imageData,0,0);
			this.ctx.lineWidth = 2;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
			element.width(this.canvas.width);
		}
		
		this.eraser = function(){
			this.ctx.globalAlpha = 0;
			this.ctx.strokeStyle = "rgba(255,255,255,1)";
			this.ctx.lineWidth = 40;
			this.ctx.globalCompositeOperation = "copy";
		}
		
		this.pencil = function(){
			this.ctx.globalAlpha = 1;
			this.ctx.strokeStyle = "#000";
			this.ctx.lineWidth = 2;
		}
		
		this.blank = function(){
			this.canvas.width = this.canvas.width;
			this.ctx.lineWidth = 2;
		}
		
		this.save = function(){
			
			// For animation
			//alert(this.rec);
			
			// For image
			
			var name = prompt("Nombre de la página",null);
			
			var date = new Date();
			
			day = date.getDate();
			
			month = 1 + date.getMonth();
			
			year = date.getFullYear();
			
			hour = date.getHours();
			
			ap = "a.m.";
			
			if (hour > 11) { ap = "p.m.";        }
			if (hour > 12) { hour = hour - 12; }
			if (hour == 0) { hour = 12;        }
			
			minutes = date.getMinutes();
			
			dateTotal = day + "/" + month + "/" + year + " " + hour + ":" + minutes + " " + ap;
						
			if(name !== null && name !== ""){
				page = {
					name : name,
					all : this.canvas.toDataURL("image/png"),
					record : this.rec,
					date : dateTotal
				}
				
				student.action = "saveNotebook";
				student.data = page;
				
				socket.send(student);
			}
		}
		
		
		this.setRecord = function(record){
			this.rec = record;
		}
		
		
		
		/*---------------------------------------------------------------------------------------------------------------------------------------------
			SOCKET RESPONSE
			---------------------------------------------------------------------------------------------------------------------------------*/
			
		this.skdown = function(x,y) {
				this.ctx.beginPath();
				this.ctx.moveTo(x, y);
        }
		
		/**
        On mouse up.
        @param e Event
    	*/
		
		this.skup = function(x,y) {
				n = this.rec.length;		
				this.rec[n] = new Array(x,y);
				
				//$('#rec').val(this.rec);
				// Save to session storage
				//window.sessionStorage.setItem("record",rec);
				var imageData = this.ctx.getImageData(0,0,element.width(),element.height());
				this.record = imageData;

				x = null;
				y = null;
				this.ctx.closePath();
       	}
		
		/**
        On mouse move.
        @param e Event
    	*/
		
		this.skmove = function(x,y) {
				
				// Deselect
				document.getElementById("canvas").onselectstart = function(){ return false; }
				
				if (x == null || y == null) {
				  return false;
				}
				
				
				//  + document.getElementById("notepad-show").scrollTop
				
				//alert(x);	
				
				n = this.rec.length;	
					
				this.rec[n] = new Array(x,y);
				
				$('#rec').val(this.rec);
				
				// Save to session storage
				//window.sessionStorage.setItem("record",rec);
				//window.sessionStorage.setItem("record",canvas.toDataURL("image/png"));
				
				this.ctx.lineTo(x, y);
				this.ctx.moveTo(x, y);
				this.ctx.stroke(); 					
		}
			
		
		
}