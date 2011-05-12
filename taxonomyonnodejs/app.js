
/**
 * Module dependencies.
 */

var express = require('express');
var taxonomy = require('./data/taxonomy');
//Just for test
var db = taxonomy.DB;
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
app.get('/', function(req, res){
  db.query("SELECT * FROM taxonomy_vocabulary", function (error, results, fields) {
	  if (!error && results.length > 0) {
		  res.render('index', {
			  title:'Taxonomy',
			  taxonomy:results
		  });
	  }
  });
});

app.get('/terms/:id', function (req, res) {
   db.query("SELECT name FROM taxonomy_term_data ttd WHERE ttd.vid = " + req.params.id, function (error, results, fields) {
	   if (!error && results.length > 0) {
		   res.partial('terms', {
			  terms:results
		   }, function (error, str) {
			   res.send({data:str});
		   });
	   }
	   else {
		   res.send({data: ""});
	   }
   });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
