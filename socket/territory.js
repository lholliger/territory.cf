function unlock() {
open = true;
document.getElementById('pop').style.display = "none";
}
function error(num) {

	document.getElementById("game-pos").innerHTML = "";

	document.getElementById("game-score").innerHTML = "";
if (error == 1) {
	document.getElementById("infob").innerHTML = "You moved too fast! reload the page";
}
if (error == 2) {
document.getElementById("game-pos").innerHTML = "You moved out of bounds. Go within 1000 and -1000";
}

document.getElementById('pop').style.display = "block";
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
	blocksx = Math.round(width / 40 - 1);
	blocksy = Math.round(height / 40);

	var tw = 0;
	var th = 0;

			canvas.beginPath();
			canvas.rect(0, 0, 40, 40);
			canvas.fillStyle = "purple";
			canvas.fill();

	for (var i = 0; i < blocksy; i++) {
		for (var b = 0; b <= blocksx; b++) {
			canvas.beginPath();
			canvas.rect(tw, th, tw + 40, th + 40);
			canvas.fillStyle = "#1e1e1e";
			canvas.fill();
			tw = tw + 40;
		}
	console.log("newline");
	tw = 0;
	th = th + 40;
	}
}

function update() {
		var d = new Date();
		var n = d.getTime();
		var res = httpGet("game.php?ACT=move&x=" + x + "&y=" + y);
		if (res == "ERR_TOO_FAST") {
			console.log("FAST");
		}
		if (res == "ERR_OUT_BOUND") {
			console.log("OUT");
		}
		var map = httpGet("game.php?ACT=getM&w=" + blocksx + "&h=" + blocksy + "&x=" + x + "&y=" + y);
		var d2 = new Date();
		var n2 = d2.getTime();
		calc = n2 - n;
		map = map.split("|");
		var curr = 0;
			var tw = 0;
			var th = 0;
	for (var i = 0; i < blocksy; i++) {
		for (var b = 0; b < blocksx; b++) {
			var space = map[curr];
			canvas.beginPath();
			canvas.rect(tw, th, tw + 40, th + 40);
			canvas.fillStyle = "#" + space;
			canvas.fill();

			tw = tw + 40;
			curr++;
		}
	tw = 0;
	th = th + 40;


	}
document.getElementById("fps").innerHTML = "<center><button onclick='move(1)'>&uarr;</button><br><button onclick='move(3)'>&larr;</button><button> </button><button onclick='move(4)'>&rarr;</button><br><button onclick='move(2)'>&darr;</button></center><b>Position: </b>" + x + ", " + y;

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
	

