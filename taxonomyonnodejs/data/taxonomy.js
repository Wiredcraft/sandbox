/**
 * 
 */
var db = require('./db');

var dbSettings = {
		user: "root",
		pwd:"admin",
		server:"local",
		db:"britcham_dev_local",
};

var Db = db.Client(dbSettings, function (action, error, results) {
	if (action != undefined) {
		if (action == 'connect') {
			console.log('Connected');
		}
		if (action == 'selectDB') {
			console.log('DB be selected');
		}
	}
});

module.exports.DB = Db;

