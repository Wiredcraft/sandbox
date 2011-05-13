
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

// Load all terms with vocabulary ID.
app.get('/terms/:id', function (req, res) {
   db.query("SELECT * FROM taxonomy_term_data ttd WHERE ttd.vid = " + req.params.id, function (error, results, fields) {
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

// The form for add term with special vocabulary ID.
app.get('/term/:id/add', function (req, res) {
	// Add.
	if (req.query.addTerm == 'Add') {
		taxonomy.save({vid:req.query.vid, tid: 0, name:req.query.name}, function (error, results) {
			if (!error) {
				/**res.partial('addterm', {
					title: 'Add term',
					vid: req.params.id,
					tvalue:req.query.name,
					name: 'name'
				}, function (error, str) {
					res.send({form:str});
				});**/
				res.partial('success', {
					message:'success: add term'
				});
			}
			else {
				res.partial('error', {
					message:error,
					type:'error',
					title: 'Error'
				}, function (error, str) {
					res.send({form:str});
				});
			}
		});
	}
	else {
		res.partial('addterm', {
			title: 'Add term',
			vid: req.params.id,
			tvalue:'',
			name: 'name'
		}, function (error, str) {
			if (!error) {
				res.send({form:str});
			}
			else {
				res.send({form:'error'});
			}
		});
	}
});

// Edit term.
app.get('/term/:id/edit', function (req, res) {
	taxonomy.save({tid: req.params.id, name: req.query.name, vid:0}, function (error, results) {
		if (!error) {
			res.partial('success', {message: 'Edited'}, function (error, str) {
				if (!error) {
					res.send({data:str});
				}
				else {
					res.send({data:"Have errors on the server:" + error});
				}
			});
		}
	});
});
// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
