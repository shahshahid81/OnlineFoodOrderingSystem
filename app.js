const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const Food = require("./models/food");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/foodDB",{ useNewUrlParser:true },function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log('connected');
	}
});

app.use(express.static(__dirname + "/public"));
app.set('view engine','ejs');

app.get('/',function(req,res){
	res.render('index');
});

app.get('/menu',function(req,res){
	Food.find({Category:"Chicken"},function(err,allFoods){
		if(err){
			console.log(err);
		}else{
			res.render("menu",{Foods:allFoods});
		}
	});
});

app.get('*',function(req,res){
	res.send("page not found");
});

app.listen(3000,function(err){
	if(err){
		console.log(err);
	}else{
		console.log('Server Started.....');
	}
});
