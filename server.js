/**
 * New node file
 */

var app = require('express')(),
	express = require('express'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	eibd = require('eibd');

var port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log('Listening on ' + port + ' for browsers');
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/browser/index.html');
});
app.use('/js', express.static(__dirname + '/browser/js'));

io.set('log level', 2);
io.sockets.on('connection', function (socket) {
	socket.on('articleStatus', function (addr, callback) {
		callback({"article":addr,"status":1});
	});
});