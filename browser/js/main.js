COM = (typeof COM === 'undefined') ? {} : COM;
COM.Server = (typeof COM.Server === 'undefined') ? {} : COM.Server;
COM.Log = (typeof COM.Log === 'undefined') ? {} : COM.Log;
COM.Server = (typeof COM.Server === 'undefined') ? {} : COM.Server;

COM.LogLevel = 0;

COM.Web = function(){
	var that = {};
	that.init = function(){
		bindButtons();
	};
	var bindButtons = function(){
		var buttons = $('button');
		$('button').each(function(){
			element = this;
			element.innerHTML = 'Checking...';
			var addr = $(element).data('article-address');
			COM.Server.checkStatus(addr, function(data){that.updateStatus(element, data)});
		});
	};
	that.updateStatus = function(element, data){
		COM.Log.debug('Status for ' + data.article + ' is ' + data.status);
		element.innerHTML = (data.status == 1 ? 'On' : 'Off');
	};
	return that;
}();

COM.Server = function(){
	var that = {};
	var socket;
	that.connect = function(callback){
		socket = io.connect('/');
		socket.on('connect', function(){
			COM.Log.debug('Connected to socket');
			callback();
		});
		socket.on('connect_failed', function(){
			COM.Log.error('Failed to connected to socket');
		});
	};
	that.checkStatus = function(addr, callback){
		COM.Log.debug('Checking status for ' + addr);
		socket.emit('articleStatus', addr, callback);
	};
	return that;
}();

COM.Log = function(){
	var that = {};
	that.DEBUG_LEVEL = 3;
	that.WARN_LEVEL = 2;
	that.ERROR_LEVEL = 1;
	that.error = function(msg){
		if(COM.LogLevel < that.ERROR_LEVEL){return}
		logWrite('[ERROR] ' + msg);
	};
	that.warn = function(msg){
		if(COM.LogLevel < that.WARN_LEVEL){return}
		logWrite('[WARN] ' + msg);
	};
	that.debug = function(msg){
		if(COM.LogLevel < that.DEBUG_LEVEL){return}
		logWrite('[DEBUG] ' + msg);
	};
	that.object = function(obj){
		logWrite(obj);
	}
	var logWrite = function(msg){
		if (typeof console == "object") {
			console.log(msg);
		}
	};
	return that;
}();

$(document).ready(function(){
	COM.LogLevel = COM.Log.DEBUG_LEVEL;
	COM.Server.connect(COM.Web.init);
});