/**
 * 
 */
var Client = require('mysql').Client;

/**
 * DB settings
 */
var _dbSettings = function (options) {
	var client = new Client();
	var defaultOptions = {
			user: "root",
			pwd:'admin',
			db:"britcham_dev_local",
			server:"local", // Maybe we don't need this variable.
	};
	if ('object' == typeof options) {
		for (var o in defaultOptions) {
			if (options[o] != undefined) {
				defaultOptions[o] = options[o];
			}
		}
	}
	client.user = defaultOptions.user;
	client.password = defaultOptions.pwd;
	return client;
}

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
}

module.exports.Client = function (dbSettings, callback) {
	return _dbConnect (dbSettings, callback);
}


