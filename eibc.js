/**
 * New node file
 */
var eibd = require('eibd');
var EIBClient = exports;

EIBClient.groupswrite = function(){
	
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
	return that;
}():

var eibd = new eibd();
eibd.onData = function(data){
	console.log(data);
}
eibd.socketRemote(eibd_opts, function() {
	// connected
	if(eibd.socket) {
		console.log('EIBD Connected');
	} else {
		console.log('EIBD Failed');
	}
	setTimeout(eibd.test, 800); 
});
eibd.test = function(){
	eibd.openTGroup(eibd.str2addr('1/0/0'), 0, function (err) {
		console.log('Opened group');
    if(err) {
      console.log(err);
    } else {
      var data = new Array(2);
      data[0] = 0;
      data[1] = 0x80; 
  	eibd.sendAPDU(data, function(){console.log('Sent')});
    }

  });
}