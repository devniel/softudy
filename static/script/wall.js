function redraw_saved(record){
		
		var canvas = document.createElement("canvas");
		canvas.width = 200;
		canvas.height = 100;
		canvas.style.background = "transparent";
		
		// Random position
		width = $("body").width();
		height = $("body").height();
		
		function random_dimension(min,max){
			return Math.round(Math.random() * (max-min) + min);
			}		
			
		pos_left = random_dimension(0,width - canvas.width);
		pos_top = random_dimension(0,height - canvas.height);
		//alert("availWidth: " + width + "\navailHeight: " + height + "\nTop: " + pos_top + "\nLeft : " + pos_left);
		
		canvas.style.position = "absolute";
		canvas.style.top = pos_top + "px";
		canvas.style.left = pos_left + "px";
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "#56676B";
		 
		document.body.appendChild(canvas);
		
		coordenates = record.split(",");
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
		
		canvas.width = canvas.width;
		var i = 0;
		ctx.strokeStyle = "#788B8E";
		animation = setInterval(function(){
					var m = other[i][0];
					var n = other[i][1];
					//alert(m + " , " + n)
					
					ctx.lineTo(m,n);
					
					ctx.stroke();
					
					if((other[i+1][0] == "space") && ((i+2)<(other.length-1))){
						ctx.moveTo(other[i+2][0],other[i+2][1]);
						i+=2;
					}
					else {
						i++;
					}
					
					if(i==(other.length-1))clearTimeout(animation);
		},20);
		
		// Hiding and destroy
		setTimeout(function(){
			var op = 1;
			var hiding = setInterval(function(){
				op-= 0.1;
				canvas.style.opacity = 	op;
				if(op == 0)clearTimeout(hiding);
			},200);
			},10000);
		
		
		
}