
function redraw_saved(record){
								
						var canvas = $('.handwriting')[0];
						
						var ctx = canvas.getContext("2d");
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
						ctx.strokeStyle = "black";
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
						},50);
}