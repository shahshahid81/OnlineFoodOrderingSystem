const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require("./models/user");
const Food = require("./models/food");
const routes = require("./routes/routes");
const seedDB = require('./seed');

const app = express();

const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/foodDB",{ useNewUrlParser:true },function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log('connected');
		if(Food.find({},function(err,items){
			if(items.length === 0){
				seedDB();
			}
		}));
	}
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	cookie: { maxAge: 3600000 },
	resave:false,
	saveUninitialized:false,
	secret : 'secret'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next){
    res.locals.alert = req.flash('alert');
	res.locals.errors = req.flash('error');
	res.locals.success = req.flash('success');
	res.locals.user = req.user;
    next();
});

app.set('view engine','ejs');

app.use('/',routes);

app.listen(port,function(err){
	if(err){
		console.log(err);
	}else{
		console.log('Server Started.....');
	}
});