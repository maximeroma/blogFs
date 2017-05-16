//--WEB SERVER
var express = require('express');
var app = express();
app.listen(3000);
var pug = require('pug');
var bodyParser = require('body-parser');
var validator = require('validator');
var nodefs = require('fs');
var isEmpty = require('lodash/isEmpty');


//--MIDDLEWARE

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));



//--FUNCTIONS

var blog;
var json = JSON.stringify(blog);
var news;

	var validerChamps = function(req){
		var errors = {};
		
		if(!validator.isEmpty(req.titre)){
			console.log(req.titre);
		} else {
			errors.titre = "Pas de titre";
		}
		if(!validator.isEmpty(req.article)){
			console.log(req.article);
		} else {
			errors.article = "Pas d'article";
		}
		return errors;
	}

	var enregisterChamps = function(req, resp){
		if(isEmpty(validerChamps(req))){
			nodefs.readFile('blog.json', function(err, req){
				blog = JSON.parse(req);
				if (err){
					resp.send('erreur');
					
				}
				blog.push(news)
				json = JSON.stringify(blog);
				nodefs.writeFile('blog.json', json, function(err){
					if (err){
						resp.send('erreur');
						
					} else {
						resp.render('main');
					}
				});

			});
		}
	}


//--ROUTES

app.set('views', './views');
app.set('view engine', 'pug');


// admin to main

app.get('/', function(req, resp){
	resp.render('admin');
});

app.post('/setArticle', function(req, resp){
	news = {
		'titre' : req.body.titre,
		'article': req.body.article, 
	};
	enregisterChamps(news, resp);
});