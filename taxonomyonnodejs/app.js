
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
	taxonomy.vocabularyLoad({}, function (error, results, fields) {
	  if (!error) {
		  res.render('index', {
			  title:'Taxonomy',
			  taxonomy:results
		  });
	  }
	  else {
		  res.render('error', {
			  message: error
		  });
	  }
  });
});

// Load all terms with vocabulary ID.
app.get('/terms/:id', function (req, res) {
	taxonomy.termLoad({vid:parseInt(req.params.id)}, function (error, results, fields) {
	   if (!error && results.length > 0) {
		   res.partial('terms', {
			  terms:results,
			  vid:parseInt(req.params.id)
		   }, function (error, str) {
			   res.send({data:str});
		   });
	   }
	   else {
		   res.send({data: ""});
	   }
   });
});

app.get('/term/:id/save', function (req, res) {
	if (typeof(req.query) != undefined) {
		taxonomy.termSave({tid:req.params.id, name:req.query.name, vid:req.query.vid}, function (error, results) {
			res.partial('success', {message:'add successful'}, function (error, str) {
				if (!error) {
					res.send({data:str});
				}
				else {
					res.send({data:"Have error occurs on server: " + error});
				}
			});
		});
	}
	else {
		res.partial('error', {message:'error'}, function (error, str) {
			res.send({data: str});
		});
	}
});

app.get('/vocabulary/:id/edit', function (req, res) {
	console.log(req.params.id);
	taxonomy.vocabularySave({vid:parseInt(req.params.id), name:req.query.name}, function (error, results) {
		if (!error) {
			res.partial('success', {message:'Edit Vocabulary' + req.query.name}, function (error, str) {
				if (!error) {
					res.send({data:str});
				}
				else {
					res.send({data: 'Have errors on the server: ' + error});
				}
			});
		}
		else {
			res.send({data:error});
		}
	});
});

app.get('/load/part', function (req, res) {
	if (typeof(req.query.tpl) == undefined) {
		res.partial('error', {messsage:"Error. Maybe you don\'t provide template"}, function (error, str) {
			res.send({data: str + error});
			return;
		});
	}
	var template = req.query.tpl;
	var options = {};
	if (typeof(req.query.options)  != undefined) {
      options = req.query.options;	
	}
	
	res.partial(template, options, function (error, str) {
		res.send({data:str});
	});
});

app.get('/test', function (req, res) {
	res.render('test', {title: 'test'});
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
