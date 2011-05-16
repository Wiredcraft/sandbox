/**
 * 
 */
var db = require('./db');
var unilt = require('./unilt');
var taxonomy = module.exports;

var dbSettings = {
		user: "root",
		pwd:"admin",
		server:"local",
		db:"britcham_dev_local"
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
taxonomy.termSave = function (data, callback) {
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
};

taxonomy.termLoad = function (data, callback) {
	// Term ID.
	if ('number' == typeof data) {
		this.client.query("SELECT * FROM taxonomy_term_data WHERE tid = ?", [data], function (error, results, fields) {
			callback(error, results, fields);
		});
	}
	else if ('object' == typeof data) {
		var sql = "SELECT * FROM taxonomy_term_data";
		var where = '';
		var values = [];
		for (var field in data) {
			where += ' '+ field +' = ?';
			values.push(data[field]);
		}
		if (where != '' && values.length > 0) {
			sql += ' where ' + where;
			this.client.query(sql, values, function (error, results, fields) {
				callback(error, results, fields);
			});
		}
		else {
			this.client.query(sql, function (error, results, fields) {
				callback(error, results, fields);
			});
		}
	}
};

taxonomy.vocabularyLoad = function (data, callback) {
	// Term ID.
	if ('number' == typeof data) {
		this.client.query("SELECT * FROM taxonomy_vocabulary ttd WHERE vid = ?", [data], function (error, results, fields) {
			callback(error, results, fields);
		});	
	}
	else if ('object' == typeof data) {
		var sql = "SELECT * FROM taxonomy_vocabulary";
		var where = '';
		var values = [];
		for (var field in data) {
			where += ' '+ field +' = ';
			values.push(data[field]);
		}
		if (where != '' && values.length > 0) {
			sql += ' where ' + where;
			this.client.query(sql, values, function (error, results, fields) {
				callback(error, results, fields);
			});
		}
		else {
			this.client.query(sql, function (error, results, fields) {
				callback(error, results, fields);
			});
		}
	}
};

taxonomy.vocabularySave = function (data, callback) {
	if (data.vid == 0) {
		// Insert it.
		this.client.query("INSERT INTO taxonomy_vocabulary (name, machine_name, description, module, weight) VALUES(?, ?, 'Added by nodejs', 'taxonomy', 0)", [data.name, unilt(data.name)], function (error, results) {
			callback(error, fields);
		});
	}
	else {
		// Edit it.
		this.client.query('UPDATE taxonomy_vocabulary SET name = ? WHERE vid = ?', [data.name, data.vid], function (error, results) {
			callback(error, data);
		});
	}
}

