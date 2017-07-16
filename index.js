var fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require("express");
var mkdirp = require('mkdirp');
var map_data = JSON.parse(fs.readFileSync(__dirname + "/data/map", "utf8"));
var port = 25500; // port for server to run on
app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/index.html');
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

app.use('/external/', express.static(__dirname + "/static/"));
io.on('connection', function(socket){

});

function print(msg, error) {
  var date = new Date;
  var stamp = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
  if (error == 0) {
    console.log("[INFO " + stamp + "] " + msg);
  }
  if (error == 1) {
        console.log("[FAIL " + stamp + "] " + msg);
  }
  if (error == 2) {
        console.log("[FATAL " + stamp + "] " + msg);
  }

}

io.on('connection', function(socket){
  socket.on('disconnect', function(){
  });
});

function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}

io.on('connection', function(socket){
  socket.on('move', function(msg){
    var claim = msg.split(",");
    var tdir = __dirname + "/data/" + claim[2] + "/";
    var color;
    try {
    var tx = fs.readFileSync(tdir + "x", "utf8");
    var ty = fs.readFileSync(tdir + "y", "utf8");
    color = fs.readFileSync(tdir + "color", "utf8");
    } catch (err) {
    print(err, 1);
  }
  var x = parseInt(claim[0]);
  var y = parseInt(claim[1]);
  if (x > 999 || x < -999 || y > 999 || y < -999) {
    print("player " + claim[2] + " tried to pass " + x + ", " + y, 0);
  } else {
    //print("claimed land: " + claim[0] + "," + claim[1] + " by " + claim[2], 0); removed for speed testing
    fs.writeFile(tdir + "x", x);
    fs.writeFile(tdir + "y", y);
    io.emit('new-claim', x + "," + y + ', "' + color + '"');
    map_data = map_data.filter(function(item) {
  return (item[0] !== x + "x" + y)
})
claim = [  parseInt(x) + "x" + parseInt(y) , color]
map_data = map_data.concat([[claim[0],claim[1]]]);

  }


  });
});

function loc(element) {
  return element[0] == removal;
}
var removal;
io.on('connection', function(socket){
  socket.on('add-alliance', function(message) {
    var claim = message.split(",");
    alliances = JSON.parse(fs.readFileSync(__dirname + "/data/"+ claim[0] + "/alliances", "utf8"));
    alliances = alliances.concat(claim[1]);
    fs.writeFileSync(__dirname + "/data/"+ claim[0] + "/alliances", JSON.stringify(alliances));
    this.emit("alliance-made", claim[1]);

  });
});
io.on('connection', function(socket){
  socket.on('new-join', function(message) {
	print("user join: " + message, 0);

	var tdir = __dirname + "/data/" + message + "/";
	var x,y,c, alliances;
  	try {
  		x= fs.readFileSync(tdir + "x", "utf8");
  		y= fs.readFileSync(tdir + "y", "utf8");
  		c= fs.readFileSync(tdir + "color", "utf8");
      alliances = fs.readFileSync(__dirname + "/data/"+ message+ "/alliances", "utf8");
  	} catch (err) {
          print(err, 1);
    }
  	print("sending info to user " + message + ": " +  x + "," + y + "," + c, 0);
    this.emit("info", x + "|" + y + "|" + c + "|" + alliances);
    this.emit("gmap", map_data);
    this.emit("leader", gLeader());


	});
});

function remove(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);

    }
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max-min + 1)) + min;
}


io.on('connection', function(socket){
  socket.on('new-user', function(message) {
	var c = new Date();
	var ms = c.getTime();
	mkdirp(__dirname + "/data/" + ms, function(err) {
	});
	var tdir = __dirname + "/data/" + ms + "/";
  var genc = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
	fs.writeFileSync(tdir + "color", genc);
	fs.writeFileSync(tdir + "x", "0");
	fs.writeFileSync(tdir + "y", "0");
  fs.writeFileSync(tdir + "alliances", JSON.stringify([genc]));
	this.emit("new-info", ms);
	print("new user: " + ms, 0);
	});
});


setInterval(function() {
fs.writeFile(__dirname + "/data/map", JSON.stringify(map_data));
}, 60000);




io.on('connection', function(socket){
  socket.on('check-account', function(message) {
    var err = false;
    try {
      fs.readFileSync(__dirname + "/data/" + message + "/x", "utf8");
    } catch(err) {
      err = true;
      this.emit("verified", "0");
    }
if (err == false) {
        this.emit("verified", "1");
}
	});
});

io.on('connection', function(socket){
  socket.on('req-map', function(message) {
var md = message.split("x");
md = [parseInt(md[0]), parseInt(md[1])];
var map = map_data;
var maparea = [];
map.forEach(function(element) {
	var part = element[0].split("x");
    if (part[0] <= md[0] + 50 && part[0]  >= md[0] - 50 && part[1] <= md[1] + 50 && part[1] >= md[1] - 50) {
maparea = maparea.concat([element]);
}
});
    this.emit("gmap", maparea);

	});
});

io.on('connection', function(socket){
  socket.on('req-map-a', function(message) {

    this.emit("gmap", map_data);

	});
});

function sortNumber(a,b) {
    return a[0] - b[0];
}

function inArray(arr) { // from http://jsfiddle.net/simevidas/bnACW/ i changed the name of the func though
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}

function gLeader() {
  var cc = map_data.toString();
  cc = cc.split(",");
  for (var i = 0; i <= cc.length; i += 1)
      cc.splice(i, 1);

  var res = inArray(cc);
  var occur = res[1];
  var found = res[0];

  var c1 = [];
  for (i = 0; i <= occur.length - 1; i++) {
      c1 = c1.concat([[occur[i], found[i]]]);
  }

  c2 = c1.sort(sortNumber);
  c2 = c2.reverse();
  c2 = c2.slice(0,10);
  return c2;
}

setInterval(function() {
 io.emit("leader", gLeader());
}, 5000);


http.listen(port, function(){
  print('Server started. listening on port ' + port, 0);
});
