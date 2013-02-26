/* StenPad | Student's Pad
   Author : Daniel Flores */
   
function notebook() {
		
		// Socket
		// Connect SOCKET
		//var socket = new io.Socket(null, {rememberTransport: false, port:1111});
		//socket.connect();
		this.show = function() {
			var canvas = document.getElementById("notebook");
			var ctx = canvas.getContext("2d");
			//canvas.width = 880;
			canvas.width = $('.replier').width();
			canvas.height = 300;
			ctx.fillStyle = "black";
			canvas.style.background = "#FFF";
		}
		
		this.x = x;
		this.y = y;
		this.rec = new Array();
		
		// OnMouseDown      
	    	canvas.onmousedown = function(e) {
			x = e.layerX; // 10px por el cursor
			y = e.layerY;
			
			ctx.beginPath(); // Recognize the coordinates an move to x,y.
			ctx.moveTo(x, y);
			// websockets socket.io
			//websocket.send(nick + "|" + "(s" + x + ",s" + y + ")");
			//socket.send("|" + "(s" + x + ",s" + y + ")");			
        			}
		
		//OnMouseUp	 
        	 	 canvas.onmouseup = function(e) {
			x = "space";
			y = "space";
			n = rec.length;		
			rec[n] = new Array(x,y);
			$('#rec').val(rec);
			//alert(rec[n]);
			x = null;
			y = null;
			ctx.closePath();
       			 }

		//OnMouseMove
       		canvas.onmousemove = function(e) {
			if (x == null || y == null) {
			  return false;
			}
			x = e.layerX; // 10px por el cursor
			y = e.layerY;
			//savePoints(rec,x,y);
			n = rec.length;		
			rec[n] = new Array(x,y);
			$('#rec').val(rec);	
			ctx.lineTo(x, y); // Dibujar a la posición x,y
			ctx.moveTo(x, y); // Mover a x,y
			ctx.stroke(); // Aplicar tinta
				 // websocket
				 /*if(websocket){
				 websocket.send(nick + "|" + "(" + x + "," + y + ")");
				 }*/
				 //socket.send("|" + "(" + x + "," + y + ")");
     		}
			
			
	  

	// RECORD
	
	/*if(ss == "redraw"){
		alert(rec.length);
	}*/
}