
/**
 * Module dependencies.
 */

var express = require('express');
var taxonomy = require('./data/taxonomy');
//Just for test
var db = taxonomy.DB;
var self = this;
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
this.users = ['1', '2'];
db.query("SELECT * FROM users", function (error, results, fields) {
	if (error) {
		console.log("error");
	}
	if (results.length  > 0) {
		console.log('Query success: ' + "SELECT * FROM users");
		self.users = results;
	}
});

app.get('/', function(req, res){
  res.render('index', {
    title: "hell world"
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
