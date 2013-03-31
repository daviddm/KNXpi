/**
 * New node file
 */
var eibd = require('eibd');
var EIBClient = exports;
var groupListener;

EIBClient.opts = {
	host: '127.0.0.1',
	port: '6720'
};

EIBClient.groupswrite = function(addr, val, callback) {
	if(typeof addr === 'undefined'){return}
	if(typeof val === 'undefined'){return}
	eibc = Client();
	eibc.connect(EIBClient.opts, function(){
		eibc.groupswrite(addr, val, callback);
	});
};
EIBClient.groupread = function(addr, callback) {
	if(typeof addr === 'undefined'){return}
	eibc = Client();
	eibc.connect(EIBClient.opts, function(){
		eibc.groupread(addr, callback);
	});
};
EIBClient.opengroup = function(wOnly, callback) {
	eibc = Client();
	eibc.connect(EIBClient.opts, function(){
		eibc.opengroup(wOnly, callback);
		groupListener = eibc;
	});
};

var Client = function(){
	var that = {};
	var que = new Array();
	var conn;
	var isListener = false;
	var listenerCallbacks = new Array();
	
	that.connect = function(opts, callback) {
		if(typeof conn != 'undefined') {
			if(typeof callback != 'undefined'){callback();}
			return;
		}
		conn = eibd();
		console.log('EIBD Trying to connect to ' + opts.host + ':' + opts.port);
		opts.allowHalfOpen = true;
		conn.socketRemote(opts, function(err) {
			// Connected
		});
		
		
//		conn.on('data', function(action, src, dest, val) {
//			console.log('GroupSocket ' + action + ' ' + src + ' ' + dest + ' ' + val);
//		});
		conn.socket.on('data', function(data){
			
		});
		conn.socket.on('end', function(){
			console.log('EIBD Closed the connection');
		});
		conn.socket.on('connect', function(){
			console.log('EIBD Connected');
//			conn.socket.setNoDelay(true);
//			conn.socket.setKeepAlive(true);
//			openGroup(0);
			if(typeof callback != 'undefined'){callback();}
		});
		conn.socket.on('close', function(){
			console.log('EIBD Transmission error');
		});
		
//		conn.end = function() {
//			console.log('Trying to end connection');
//		}
	};
	
	/**
	 * For sending LESS than 6 bit
	 * 
	 * addr - in format x/x/x
	 * value - 1|0
	 */
	that.groupswrite = function(addr, val, callback) {
		openTGroup(addr, 0, function () {
			var data = new Array(2);
			data[0] = 0;
			data[1] = 0x80 | val;
			conn.sendAPDU(data, function() {
				console.log('Sent "' + val + '" to ' + addr)
				if(callback) callback();
			});
		});
	};
	/**
	 * For sending MORE than 6 bit
	 * 
	 * addr - in format x/x/x
	 * value - 0..255
	 */
	that.groupwrite = function(addr, val, callback) {
		console.log('Not Implemented this yet');
	};
	/**
	 * Reading status of the addr
	 * 
	 * addr - in format x/x/x
	 */
	that.groupread = function(addr, callback) {
		openTGroup(addr, 0, function () {
			var data = new Array(2);
			data[0] = 0;
			data[1] = 0;
			conn.sendAPDU(data, function() {
				console.log('Reading ' + addr)
				groupListener.addListenerCallback(addr, callback)
			});
		});
	};
	that.test = function(){
		console.log('test');
	}
	
	/**
	 * addr - in format x/x/x
	 * wOnly - Write only
	 */
	var openTGroup = function(addr, wOnly, callback) {
		if(typeof conn === 'undefined'){console.log('Open connection before T_Group');return}
		conn.openTGroup(conn.str2addr(addr), wOnly, function (err) {
			if(err) {console.log('ERROR opening T_Group');return}
			callback();
		});
	};
	that.opengroup = function(wOnly, callback) {
		if(typeof conn === 'undefined'){console.log('Open connection before Group');return}
		isListener = true;
		console.log('Enabled listener');
		conn.openGroupSocket(wOnly, function (err) {
			if(typeof callback != 'undefined'){callback();}
		});
		conn.on('data', function(action, src, dest, val) {
			console.log('GroupSocket ' + action + ' ' + src + ' ' + conn.addr2str(dest.toString(), true) + ' ' + val);
			if(action == 'Response') {
				that.fireListenerCallback(conn.addr2str(dest.toString(), true), val);
			} else if(action == 'Write') {
				that.fireListenerCallback(conn.addr2str(dest.toString(), true), val);
			}
		});
	};
	 // TODO add this a an extend class to this object
	that.addListenerCallback = function(addr, callback) {
		if(!isListener){console.log('Can not add listener to this object');return}
		// TODO add functionality to have more than 1 callback per addr
		console.log('Addling callback for ' + addr);
		listenerCallbacks[addr] = callback;
	}
	
	that.fireListenerCallback = function(addr, val) {
		if(typeof listenerCallbacks[addr] !== 'undefined') {
			console.log('Firing callback for ' + addr);
			listenerCallbacks[addr](val);
		}
	};
		
	return that;
};
