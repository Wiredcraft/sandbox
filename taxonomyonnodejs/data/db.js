/**
 * 
 */
var Client = require('mysql').Client;

/**
 * DB settings
 */
var _dbSettings = function (options, callback) {
	var client = new Client();
	if ('object' == typeof options) {
		for (var o in defaultOptions) {
			if (options[o] != undefined) {
				defaultOptions[o] = options[o];
			}
		}
	}
	else {
		callback('connection params must is object');
		return;
	}
	client.user = defaultOptions.user;
	client.password = defaultOptions.pwd;
	return client;
};

var _dbConnect = function (options, callback) {
	var client;
	if (client  = _dbSettings(options)) {
		client.connect(function (error, results) {
			callback('connect', error, results);
		});
		
		//Select db 
		client.query('USE ' + options.db, function (error, results) {
			callback("selectDB", error, results);
		});
		return client;	
	}
	else {
		return null
	}
};

module.exports.Client = function (dbSettings, callback) {
	return _dbConnect (dbSettings, callback);
};


