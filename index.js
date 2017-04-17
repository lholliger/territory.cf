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
  } catch (err) {}
  var x = parseInt(claim[0]);
  var y = parseInt(claim[1]);
  if (x > 999 || x < -999 || y > 999 || y < -999) {
    console.log("SERVER: player " + claim[2] + " tried to pass " + x + ", " + y);
  } else {
    console.log("SERVER: claimed land: " + claim[0] + "," + claim[1] + " by " + claim[2]);
    fs.writeFile(tdir + "x", x);
    fs.writeFile(tdir + "y", y);
    io.emit('new-claim', x + "," + y + ', "' + color + '"');
    map_data = map_data.filter(function(item) {
  return (item[0] !== x + "x" + y) // Only keep arrays that don't begin with 5x3
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
  socket.on('new-join', function(message) {
	console.log("SERVER: user join: " + message);

	var tdir = __dirname + "/data/" + message + "/";
	var x,y,c;
  	try {
  		x= fs.readFileSync(tdir + "x", "utf8");
  		y= fs.readFileSync(tdir + "y", "utf8");
  		c= fs.readFileSync(tdir + "color", "utf8");
  	} catch (err) {}
  	console.log("SERVER: sending info to user " + message + ": " +  x + "," + y + "," + c);
    this.emit("info", x + "," + y + "," + c);
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

function file_get_cont(name) {
  var chunk, data;
  var readStream = fs.createReadStream(name, 'utf8');

readStream.on('data', function(chunk) {
    data += chunk;
}).on('end', function() {
    return data;
});
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
	fs.writeFile(tdir + "color", genc);
	fs.writeFile(tdir + "x", "0");
	fs.writeFile(tdir + "y", "0");
	this.emit("new-info", ms);
	console.log("SERVER: new user: " + ms);
	});
});


setInterval(function() {
fs.writeFile(__dirname + "/data/map", JSON.stringify(map_data));
console.log("SERVER: map backed up");
}, 30000);



http.listen(port, function(){
  console.log('SERVER: initialized. listening on port ' + port);
});



io.on('connection', function(socket){
  socket.on('req-map', function(message) {
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
