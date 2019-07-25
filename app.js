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
const Admin = require("./models/admin");
const adminRoutes = require("./routes/admin");
const foodRoutes = require("./routes/food");
const userRoutes = require("./routes/user");
const routes = require("./routes/routes");
const seedDB = require('./seed');

const app = express();

const port = process.env.PORT || 3000;

async function main(){
	try {
		await mongoose.connect("mongodb://127.0.0.1:27017/foodDB",{ useNewUrlParser:true });
		console.log('connected');
		let items = await Food.find({}).exec();
		if(items.length === 0){
			seedDB();
		}
		let foundDoc = await Admin.findOne({username:'admin'}).exec();
		if(!foundDoc){
			const password = 'admin123';
			let user = await Admin.register({username : 'admin'},password);
			if(user) {
				console.log('Admin Registered.');
			}
		}
		console.log('Server Started.....');
	} catch(err) {
		console.log(err);
	}
}

passport.use('local',new LocalStrategy(User.authenticate()));
passport.use('admin-local',new LocalStrategy(Admin.authenticate()));

passport.serializeUser(function(user, done) {	
	done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		if(user) {
			done(err, user);
		} else {
			Admin.findById(id,function(err,admin){
				done(err,admin);
			});
		}
	});
});

app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
	cookie: { maxAge: 60 * 60 * 1000 },
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
app.use('/admin',adminRoutes);
app.use('/admin/user',userRoutes);
app.use('/admin/food',foodRoutes);

app.listen(port,main);