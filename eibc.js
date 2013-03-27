/**
 * New node file
 */
var eibd = require('eibd');
var EIBClient = exports;

EIBClient.opts = {
	host: '127.0.0.1',
	port: '6720'
};

EIBClient.groupswrite = function(addr, val, callback) {
	if(typeof addr === 'undefined'){return}
	if(typeof val === 'undefined'){return}
	eibc.connect(EIBClient.opts, function() {
		eibc.groupswrite(addr, val, callback);
	});
};

var eibc = function(){
	var that = {};
	var que = new Array();
	var conn;
	
	that.connect = function(opts, callback) {
		conn = eibd();
		console.log('EIBD Trying to connect to ' + opts.host + ':' + opts.port);
		conn.socket.on('data', function(data){
			if(que.length > 0) {
				
			}
			console.log(data);
		});
		conn.socket.on('end', function(){
			console.log('EIBD Closed the connection');
		});
		conn.socket.on('connect', function(){
			console.log('EIBD Connected');
			callback();
		});
		conn.socket.on('close', function(){
			console.log('EIBD Transmission error');
		});
		conn.socketRemote(opts, function() {
			
		});
	};
	
	/**
	 * addr - in format x/x/x
	 * value - 1|0
	 */
	that.groupswrite = function(addr, val, callback) {
		if(typeof conn === 'undefined'){console.log('Trying to send too early');return false;}
		conn.openTGroup(conn.str2addr(addr), 0, function (err) {
			if(err) {
				console.log('ERROR opening T_Group');
			}
			var data = new Array(2);
			data[0] = 0;
			data[1] = 0x80 | val;
			conn.sendAPDU(data, function() {
				console.log('Sent "' + val + '" to ' + addr)
				if(callback) callback();
			});
		});
	};
		
	return that;
}();
