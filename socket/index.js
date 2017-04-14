var fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require("express");
var mkdirp = require('mkdirp');



app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/index.html');
});

app.use('/external/', express.static(__dirname + "/static/"));
io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
    

io.on('connection', function(socket){
  socket.on('move', function(msg){
    var coords;
    console.log(msg);
    var ret = msg.split(",");
    io.emit('new-player', msg);
  });
});

io.on('connection', function(socket){
  socket.on('new-join', function(message) {
	this.emit("info", "0,0,0e0e0e");
	});
});
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
	fs.writeFile(tdir + "color",'#'+(Math.random()*0xFFFFFF<<0).toString(16));
	fs.writeFile(tdir + "x", Math.round(getRandomInt(-1000,1000)));
	fs.writeFile(tdir + "y", Math.round(getRandomInt(-1000,1000)));
	fs.writeFile(tdir + "claimed", "0");
	this.emit("new-info", ms);
	});
});

