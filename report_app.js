/**
 * New node file
 */
var config = require('./config.js'),
	http = require('http'),
	redis = require("redis"),
	client = redis.createClient(),
	os = require('os'),
	crypto = require('crypto');

var data = {};
data.server = {};
data.server.port = config.server.port;
data.server.hostname = os.hostname();
data.server.type = os.type();
data.server.arch = os.arch();
data.server.platform = os.platform();
data.server.release = os.release();
data.server.uptime = os.uptime();
data.server.load = os.loadavg();
data.server.cpu = os.cpus();
data.server.memory_total = os.totalmem();
data.server.memory_free = os.freemem();

data.software = {};
data.software.id = config.server.id;
data.software.version = -1; // TODO

data.redis = {};
data.redis.host = config.redis.host;
data.redis.port = config.redis.port;
data.redis.size = -1; // TODO

data.usage = {};
data.usage.requests = -1; // TODO
data.usage.uniqueDevices = -1; // TODO
data.usage.localRequests = -1; // TODO
data.usage.externalRequest = -1; // TODO

var json_data = JSON.stringify(data);
var send_data = 'report=' + json_data + '&hash=' + crypto.createHash('md5').update(json_data).digest("hex");
console.log(send_data);

// TODO: add hash signature with local secret

var options = {
    host: config.report.server,
    port: config.report.port,
    path: config.report.path,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': send_data.length
    }
};

var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log("body: " + chunk);
    });
});

req.write(send_data);
req.end();