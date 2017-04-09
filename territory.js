var x,y,c,width,height,blocksx,blocksy
function start() {
	document.getElementById("mediaplay").innerHTML = "<h1>Loading game...</h1><p>Be patient!</p>";
	x = httpGet("game.php?ACT=getX");
	y = httpGet("game.php?ACT=getY");
	c = httpGet("game.php?ACT=getC");
	document.getElementById("overlay").innerHTML = "<b>Location: </b> (" + x + "," + y + ")<br><b>Score: </b>" + httpGet("game.php?ACT=getO");
	width = document.getElementById("main").clientWidth;
	height = document.getElementById("main").clientHeight;
	console.log(width);
	console.log(height);
	document.getElementById("game").innerHTML = "";
	blocksx = Math.round(width / 50 - 1);
	blocksy = Math.round(height / 50);

	for (var i = 0; i < blocksy; i++) {
		for (var b = 0; b < blocksx; b++) {
			document.getElementById("game").innerHTML += "<div class='block' id='" + b + ";" + i + "'> </div>";
		}
	console.log("newline");
	document.getElementById("game").innerHTML += "<br>"; 
	}

	
	document.getElementById(Math.round(blocksx / 2 - 1) + ";" + Math.round(blocksy / 2 - 1)).className = "block-you";
	console.log(c);
	document.getElementById(Math.round(blocksx / 2 - 1) + ";" + Math.round(blocksy / 2 - 1)).style.border = "5px solid #" + c;
	console.log();
	update();

}
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
function update() {
	document.getElementById("overlay").innerHTML = "<b>Location: </b> (" + x + "," + y + ")<br><b>Score: </b>" + httpGet("game.php?ACT=getO");
		var res = httpGet("game.php?ACT=move&x=" + x + "&y=" + y);
		if (res == "ERR_TOO_FAST") {
			console.log("FAST");
		}
		var map = httpGet("game.php?ACT=getM&w=" + blocksx + "&h=" + blocksy + "&x=" + x + "&y=" + y);
		map = map.split("|");
		var curr = 0;
	for (var i = 0; i < blocksy; i++) {
		for (var b = 0; b < blocksx; b++) {
			var space = map[curr];
			if (space.charAt(0) == "U") {
			space = space.substr(1);
			document.getElementById(b + ";" + i).style.backgroundColor = space;
			document.getElementById(b + ";" + i).style.border = "5px solid #" + space;
			} else {
			document.getElementById(b + ";" + i).style.backgroundColor = space;
			document.getElementById(b + ";" + i).style.border = "5px solid #1e1e1e";
	document.getElementById(Math.round(blocksx / 2 - 1) + ";" + Math.round(blocksy / 2)).style.border = "5px solid #" + c;
			}
			curr++;
		}
	}


}
function move(d) {
	if (d == 1) {
		y++;
		update();
	}
	if (d == 2) {
		y--;
		update();
	}
	if (d == 3) {
		x--;
		update();
	}
	if (d == 4) {
		x++;
		update();
	}
}


	function checkKey(e) {
	e = e || window.event;
	var code = e.keyCode;
	if (code == 38) {
		move(1); // up
	}
	if (code == 40) {
		move(2); // down
	}
	if (code == 37) {
		move(3); // left
	}
	if (code == 39) {
		move(4); // right
	}
	}
	document.onkeydown = checkKey;
	
