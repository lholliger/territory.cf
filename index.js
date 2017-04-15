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


io.on('connection', function(socket){
  socket.on('move', function(msg){
    var claim = msg.split(",");
    console.log("CLAIM:" + claim[0] + "," + claim[1] + " by " + claim[2]);
    var tdir = __dirname + "/data/" + claim[2] + "/";
    try {
    var tx = fs.readFileSync(tdir + "x", "utf8");
    var ty = fs.readFileSync(tdir + "y", "utf8");
  } catch (err) {}
    fs.writeFile(tdir + "x", claim[0]);
    fs.writeFile(tdir + "y", claim[1]);
    io.emit('new-claim', claim[0] + "," + claim[1] + ', "' + fs.readFileSync(tdir + "color", "utf8") + '"');
    map_data = map_data.filter(function(item) {
  return (item[0] !== claim[0] + "x" + claim[1]) // Only keep arrays that don't begin with 5x3
})
    claim = [  parseInt(claim[0]) + "x" + parseInt(claim[1]) , fs.readFileSync(tdir + "color", "utf8")]
    map_data = map_data.concat([[claim[0],claim[1]]]);
  });
});

io.on('connection', function(socket){
  socket.on('new-join', function(message) {
	console.log("user join: " + message);

	var tdir = __dirname + "/data/" + message + "/";
	var x,y,c;
  try {
  x= fs.readFileSync(tdir + "x", "utf8");
  y= fs.readFileSync(tdir + "y", "utf8");
  c= fs.readFileSync(tdir + "color", "utf8");
  } catch (err) {}
  	console.log("telling user " + message + ": " +  x + "," + y + "," + c);
  	this.emit("info", x + "," + y + "," + c);
    this.emit("gmap", map_data);

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
	fs.writeFile(tdir + "color", '#'+(Math.random()*0xFFFFFF<<0).toString(16));
	fs.writeFile(tdir + "x", Math.round(getRandomInt(-1000,1000)));
	fs.writeFile(tdir + "y", Math.round(getRandomInt(-1000,1000)));
	fs.writeFile(tdir + "claimed", "0");
	this.emit("new-info", ms);
	console.log("user join (NEW): " + ms);
	});
});


setInterval(function() {
fs.writeFile(__dirname + "/data/map", JSON.stringify(map_data));
console.log("SERVER: map backed up");
}, 10000);



http.listen(port, function(){
  console.log('server initialized. listening on port ' + port);
});



io.on('connection', function(socket){
  socket.on('req-map', function(message) {
    this.emit("gmap", map_data);

	});
});
