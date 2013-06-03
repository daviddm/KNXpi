/**
 * New node file
 */

var config = require('./config.js'),
	app = require('express')(),
	express = require('express'),
//	auth = require('http-auth'),
//	basic = auth({
//		  authRealm: "Private",
//		  authFile: __dirname + "/htpasswd",
//		  authType: "digest"
//		}),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	eibc = require('./eibc');

var port = config.server.port;

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
		eibc.groupread(addr, function(status) {
			callback({"article":addr,"status":status});
		});
	});
	socket.on('articleStatusChange', function (addr, val, callback) {
		eibc.groupswrite(addr, val, function(status) {
			callback({"article":addr,"status":status});
		});
	});
});

eibc.opengroup(0);
