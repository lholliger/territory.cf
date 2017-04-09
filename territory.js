function unlock() {
open = true;
document.getElementById('pop').innerHTML = '';
}

var open = false;

var c = document.getElementById('game'),
canvas = c.getContext('2d');
c.width = window.innerWidth;
c.height = window.innerHeight;
canvas.beginPath();
canvas.rect(0, 0, window.innerWidth, window.innerHeight);
canvas.fillStyle = "#1e1e1e";
canvas.fill();

var x,y,c,width,height,blocksx,blocksy

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


function game() {
	x = httpGet("game.php?ACT=getX");
	y = httpGet("game.php?ACT=getY");
	c = httpGet("game.php?ACT=getC");

	document.getElementById("game-pos").innerHTML = "<b>Location</b><br>" + x + ", " + y;

	document.getElementById("game-score").innerHTML = "<b>Current Score</b><br>" + httpGet("game.php?ACT=getO") + " blocks";

	document.getElementById("game-button").style.backgroundColor = "#" + c;
	width = window.innerWidth;
	height = window.innerHeight;
	console.log(width);
	console.log(height);
	document.getElementById("game").innerHTML = "";
	blocksx = Math.round(width / 50 - 1);
	blocksy = Math.round(height / 50);

	var tw = 0;
	var th = 0;

			canvas.beginPath();
			canvas.rect(0, 0, 50, 50);
			canvas.fillStyle = "purple";
			canvas.fill();

	for (var i = 0; i < blocksy; i++) {
		for (var b = 0; b <= blocksx; b++) {
			canvas.beginPath();
			canvas.rect(tw, th, tw + 50, th + 50);
			canvas.fillStyle = "#1e1e1e";
			canvas.fill();
			tw = tw + 50;
		}
	console.log("newline");
	tw = 0;
	th = th + 50;
	}
}

function update() {
		var res = httpGet("game.php?ACT=move&x=" + x + "&y=" + y);
		if (res == "ERR_TOO_FAST") {
			console.log("FAST");
		}
		var map = httpGet("game.php?ACT=getM&w=" + blocksx + "&h=" + blocksy + "&x=" + x + "&y=" + y);
		map = map.split("|");
		var curr = 0;
			var tw = 0;
			var th = 0;
	for (var i = 0; i < blocksy; i++) {
		for (var b = 0; b < blocksx; b++) {
			var space = map[curr];
			canvas.beginPath();
			canvas.rect(tw, th, tw + 50, th + 50);
			canvas.fillStyle = "#" + space;
			canvas.fill();

			tw = tw + 50;
			curr++;
		}
	tw = 0;
	th = th + 50;

			canvas.fillStyle = "white";
			canvas.font = "12px Roboto";
			canvas.fillText(x + ", " + y, 20, 20);
	}


}

function move(d) {
	if (open == true) {
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
	

