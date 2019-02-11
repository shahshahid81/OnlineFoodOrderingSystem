const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const Food = require("./models/food");
const User = require("./models/user");

const app = express();

const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/foodDB",{ useNewUrlParser:true },function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log('connected');
	}
});

app.use(cookieParser());
app.use(session({cookie: { maxAge: 60000 },resave:true,saveUninitialized:true,secret : 'secret'}));
app.use(flash());

app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set('view engine','ejs');

app.get('/',function(req,res){
	res.render('index');
});

app.get('/menu',function(req,res){
	var itemCategory = req.query.item;
	if(itemCategory){

		Food.find({Category:itemCategory},function(err,allFoods){
			if(err){
				console.log(err);
			}else{
				res.render("partials/menu-item",{Foods:allFoods});
			}
		});

	} else {

		Food.find({Category:"Chicken"},function(err,allFoods){
			if(err){
				console.log(err);
			}else{
				res.render("menu",{Foods:allFoods});
			}
		});
		
	}
});

app.get('/signup',function(req,res){
	res.render("signup");
});

app.post('/signup',function(req,res){
	console.log(req.body);
	const Name = req.body.name;
	const EmailAddress = req.body.email;
	const Password = req.body.password;
	const PhoneNumber = req.body['phone-number'];
	User.create({
		Name,
		EmailAddress,
		Password,
		PhoneNumber
	},function(err){
		if(err){
			console.log(err);
			req.flash('error','An error occured!');
			res.redirect('signup');
		} else {
			res.redirect('signin');
		}
	});
});

app.get('*',function(req,res){
	res.send("page not found");
});

app.listen(port,function(err){
	if(err){
		console.log(err);
	}else{
		console.log('Server Started.....');
	}
});

