//--WEB SERVER
var express = require('express');
var app = express();
app.listen(3000);
var pug = require('pug');
var bodyParser = require('body-parser');
var validator = require('validator');
var fs = require('fs');
var isEmpty = require('lodash/isEmpty');
var uuid = require('uuid/v4');



//--MIDDLEWARE

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));



//--FUNCTIONS

var blog;
var json = JSON.stringify(blog);
var news;



	// verifier si les champs sont bien remplies

	var validerChamps = function(req){
		var errors = {};
		
		!validator.isEmpty(req.titre) ? console.log('titre ok') : errors.titre = "titre ko";
		
		!validator.isEmpty(req.article) ? console.log('article ok') : errors.article = "article ko";
		
		return errors;
	}




	// si les champs sont remplies => lecture json => ecriture sur json

	var enregisterChamps = function(req, resp){
		if(isEmpty(validerChamps(req))){
			req.uuid = uuid();
			fs.readFile('blog.json', function(err, data){
				blog = JSON.parse(data);
				if (err){
					resp.send('server ko');					
				} else {
					blog.push(req)
					json = JSON.stringify(blog);
					fs.writeFile('blog.json', json, function(err){
						if (err) throw err;
						resp.redirect('/');
						return req = {};
					});
				}

			});
		}
	}

	// envoyer les articles sur la page main

	var getContent = function(){
		var contenu = [];
		for (var i = 0; i < blog.length; i++){
			contenu.push({'titre': blog[i].titre, 'uuid': blog[i].uuid});
		}
		//console.log(contenu);
		return contenu;
	}

	
	// generer tableau dynamique de configuration



//--ROUTES

app.set('views', './views');
app.set('view engine', 'pug');


// admin to main

app.get('/', function(req, resp){
	resp.render('admin');
});

app.get('/setArticle', function(req, resp){
	news = {
		'titre' : req.query.titre,
		'article': req.query.article, 
	};
	enregisterChamps(news, resp);
});

app.get('/blog', function(req, resp){
	fs.readFile('blog.json', function(err, data){
		blog = JSON.parse(data);
		if (err){
			resp.send('server ko');
		} else {
			resp.render('main', {content: getContent()});						
		}
	});
});

app.post('/configurerBlog', function(req, resp){
	fs.readFile('blog.json', function(err, data){
		blog = JSON.parse(data);
		if (err){
			resp.send('server ko');
		} else {
			resp.send(getContent());
		}
	})
})

app.post('/deleteArticle', function(req, resp){
	fs.readFile('blog.json', function(err, data){
		blog = JSON.parse(data);
		if (err){
			resp.send('server ko');
		} else {
			for (var i = 0; i < blog.length; i++){
				if (blog[i].uuid === req.body.data){
					blog.splice(i, 1);
					json = JSON.stringify(blog);
					fs.writeFile('blog.json', json, function(err){
						if (err) throw err;	
						resp.send('ok');					
					});
				}
			}
		}
	})
});

app.post('/needUpdate', function(req, resp){
	fs.readFile('blog.json', function(err, data){
		blog = JSON.parse(data);
		if (err){
			resp.send('server ko');
		} else {
			for (var i = 0; i < blog.length; i++){
				if (blog[i].uuid === req.body.data){
					news = {
						'titre' : blog[i].titre,
						'article' : blog[i].article,
						'uuid' : blog[i].uuid, 
					}
				}
			}
			console.log(news);
			resp.send(news);
		}
	});
});

app.post('/updateArticle', function(req, resp){
	fs.readFile('blog.json', function(err, data){
		blog = JSON.parse(data);
		if (err){
			resp.send('server ko');
		} else {
			for (var i = 0; i < blog.length; i++){
				if (blog[i].uuid === req.body.uuid){
					blog[i].titre = req.body.titre;
					blog[i].article = req.body.article;
					json = JSON.stringify(blog);
					fs.writeFile('blog.json', json, function(err){
						if (err) throw err;
						resp.send('ok');
					});					
				}
			}
		}
	});
});
	
app.post('/getArticle', function(req, resp){
	console.log(req.body)
	fs.readFile('blog.json', function(err, data){
		blog = JSON.parse(data);
		if (err) {
			resp.send('server ko');
		} else {
			for (var i = 0; i < blog.length; i++){
				if (blog[i].uuid === req.body.uuid){
					article = blog[i].article
					resp.render('main', {article : article, content : getContent()});
				}
			}
		} 
	});
});
	

