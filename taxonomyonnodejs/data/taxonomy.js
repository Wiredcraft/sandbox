/**
 * 
 */
var db = require('./db');
var taxonomy = module.exports;

var dbSettings = {
		user: "root",
		pwd:"admin",
		server:"local",
		db:"britcham_dev_local",
};

this.client = db.Client(dbSettings, function (action, error, results) {
	if (action != undefined) {
		if (action == 'connect') {
			console.log('Connected');
		}
		if (action == 'selectDB') {
			console.log('DB be selected');
		}
	}
	if (error) {
		db.end();
	}
});



taxonomy.DB = this.client;
/**
 * @param data
 *  data:{vid, tid, name}
 */
taxonomy.save = function (data, callback) {
	// Add when tid = 0.
	if (data.tid == 0) {
		this.client.query("INSERT INTO taxonomy_term_data (vid, name, description, format, weight) VALUES(?, ?, 'Added by nodejs', 'NULL', '0')", [data.vid, data.name], function (error, results, fields) {
			callback(error, results);
		});
	}
	// Else edit.
	else {
		this.client.query('UPDATE taxonomy_term_data SET name = ? WHERE tid = ?', [data.name, data.tid], function (error, results) {
			console.log(data);
			callback(error, results);
		});
	}
}

