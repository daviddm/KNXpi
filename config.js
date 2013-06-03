/**
 * New node file
 */
var config = {}

// Server
config.server = {};
config.server.id = 1;
config.server.secret = 'c4ca4238a0b923820dcc509a6f75849b';
config.server.port = 80;

// Redis
config.redis = {};
config.redis.host = '127.0.0.1';
config.redis.port = '6379';

// Reporting to central server
config.report = {};
config.report.server = 'www.casinoroom.localhost'; // 'report.knxpi.com';
config.report.path = '/majax/test/'; // '';
config.report.port = 80; // 443;

module.exports = config;