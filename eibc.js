/**
 * New node file
 */
var eibd = require('eibd');
var EIBClient = exports;

EIBClient.opts = {
	host: '127.0.0.1',
	port: '6720'
};

EIBClient.groupswrite = function(){
	eibc.test();
};

var eibc = function(){
	var that = {};
	var que = new Array();
	var conn;
	
	that.execute = function() {
		var conn = eibd.socketRemote(eibd_opts, function() {
			if(eibd.socket) {
				console.log('EIBD Connected');
			} else {
				console.log('EIBD Failed');
			}
		});
		conn.onData = function(data){
			if(que.length > 0) {
				
			}
			console.log(data);
		};
	};
	
	that.test = function() {
		var conn = new eibd();
		conn.onData = function(data){
			console.log(data);
		}
		conn.socketRemote(EIBClient.opts, function() {
			// connected
			if(conn.socket) {
				console.log('EIBD Connected');
			} else {
				console.log('EIBD Failed');
			}
			setTimeout(conn.test, 800); 
		});
		conn.test = function(){
			conn.openTGroup(conn.str2addr('1/0/0'), 0, function (err) {
				console.log('Opened group');
		    if(err) {
		      console.log(err);
		    } else {
		      var data = new Array(2);
		      data[0] = 0;
		      data[1] = 0x80; 
		      conn.sendAPDU(data, function(){console.log('Sent')});
		    }

		  });
		}
	};
	
	return that;
}();
