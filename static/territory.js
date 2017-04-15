var open = false;
var redo = 10;
var cdraw = 0;
function unlock() {
	open = true;
  document.getElementById('pop').style.display = "none";
	document.getElementById('overlay').innerHTML = "<center><button onclick='move(1)'>&uarr;</button><br><button onclick='move(3)'>&larr;</button><button> </button><button onclick='move(4)'>&rarr;</button><br><button onclick='move(2)'>&darr;</button></center><b>Position: </b>" + x + "," + y;

}
var c = document.getElementById('game'),
canvas = c.getContext('2d');
c.width = window.innerWidth;
c.height = window.innerHeight;
canvas.beginPath();
canvas.rect(0, 0, window.innerWidth, window.innerHeight);
canvas.fillStyle = "#1e1e1e";
canvas.fill();

	width = window.innerWidth;
	height = window.innerHeight;
	document.getElementById("game").innerHTML = "";
	blocksx = Math.round(width / 40);
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
	}




function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


  var socket = io();
var id = "";
if (getCookie("id") == "") {
socket.emit("new-user", "help");
} else {
socket.emit("new-join", getCookie("id"));
id = getCookie("id");
}
var x, y, color;
    socket.on('info', function(msg){
	var inf = msg.split(",");
	document.getElementById("game-pos").innerHTML = "<b>Position: </b>" + inf[0] + ", " + inf[1];
	document.getElementById("game-button").style.backgroundColor = inf[2];
	document.getElementById("game-button").disabled = false;
	x = inf[0];
	y = inf[1];
	y = parseInt(y);
	x = parseInt(x);
	color = inf[2];
    });

socket.on('new-info', function(msg){
	setCookie("id", msg, 365 * 5);
	socket.emit("new-join", getCookie("id"));
	id = getCookie("id");
    });

function draw(x2, y2, scol) {
	var corner_x = Math.round(x - (blocksx / 2));
	var corner_y = Math.round(parseInt(y) + (blocksy / 2));
	var corner_x_r = Math.round(parseInt(x) + (blocksx / 2));
	var corner_y_r = Math.round(y - (blocksy / 2));
	if (x2 >= corner_x && x2 <= corner_x_r) {
		if (y2 <= corner_y && y2 >= corner_y_r) {
			var gx = corner_x - x2;
			var gy = corner_y - y2;
			if (gx < 0) {
	  		gx = -gx;
			}
			if (gy < 0) {
			  gy = -gy;
			}
			gx = gx * 40;
			gy = gy * 40;
			canvas.beginPath();
			canvas.rect(gx, gy, 40, 40);
			canvas.fillStyle = scol;
			canvas.fill();
		}
	}


}

socket.on('new-claim', function(msg){
msg = JSON.parse("[" + msg + "]");
var m2 = msg[0] + "x" + msg[1];
map_data = map_data.filter(function(item) {
return (item[0] !== m2)
})
map_data = map_data.concat([[m2,msg[3]]]);

draw(msg[0], msg[1], msg[3]);
});


var map_data, backup;
socket.on('gmap', function(msg){
map_data = msg;
backup = msg;
redraw();

});

function redraw() {
	cdraw++;
	if (cdraw > redo) {
		socket.emit("req-map", "");
		cdraw = 0;
	}
	var map = map_data;
	canvas.beginPath();
	canvas.rect(0, 0, window.innerWidth, window.innerHeight);
	canvas.fillStyle = "#1e1e1e";
	canvas.fill();

	map.forEach(function(element) {
		piece = element[0].split("x");
	    draw(piece[0], piece[1], element[1]);
	});
draw(x, y, "#757575");
}
function update() {
	var t1 = new Date();
	t1 = t1.getTime();


	socket.emit("move", x + "," + y + "," + id);
  redraw();

	var t2 = new Date();
	t2 = t2.getTime();
	var t3 = t2 - t1;
	  document.getElementById('overlay').innerHTML = "<center><button onclick='move(1)'>&uarr;</button><br><button onclick='move(3)'>&larr;</button><button> </button><button onclick='move(4)'>&rarr;</button><br><button onclick='move(2)'>&darr;</button></center><b>Position: </b>" + x + "," + y;
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
