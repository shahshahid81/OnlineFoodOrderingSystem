const express = require('express');
const moment = require('moment');
const passport = require('passport');

const router = express.Router();

const User = require('../models/user');
const Message = require("../models/message");
const Admin = require("../models/admin");
const middleware = require('../middleware/middleware');

router.get('/login',function(req,res){
    res.render('admin/login');
});

router.post('/login',
    passport.authenticate('admin-local',{
        successRedirect : '/admin',
        failureRedirect : "/admin/login",
        failureFlash : true
    }
));

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/admin/login');
});

router.get('/',middleware.isAdminLoggedIn,async function(req,res){
    
    try {
        let foundUsers = await  User.find({}).exec();
        var userCount = foundUsers.length;
        var orderCount=0;
        var totalSales = 0;
        foundUsers.forEach(function(user){
            orderCount += user.orders.length;
            user.orders.forEach(function(order){
                if(order.status === 'Delivered'){
                    totalSales += parseInt(order.grandTotal);
                }
            });
        });
        var statsObject = {
            user : userCount,
            order : orderCount,
            sales : totalSales
        };
        let docs = await Message.find({}).exec();
        res.render('admin/dashboard',{stats : statsObject,messages : docs});
    } catch(err) {
        console.log(err);
    }
});

router.get('/order',middleware.isAdminLoggedIn,function(req,res){

    User.aggregate([
		{$unwind : "$orders" },
		{$sort : {"orders.orderedAt" : -1}}
	]).exec(function(err,foundDocs){

        var allOrders = [];
        foundDocs.forEach(function(current){
            allOrders.push({
                username : current.username,
                order_id: current.orders.order_id,
                orderedAt : current.orders.orderedAt,
                total : current.orders.grandTotal,
                status : current.orders.status
            });
        });
        res.render('admin/order-status',{orders:allOrders,moment:moment});
	});
});

router.post('/order/:id',middleware.isAdminLoggedIn,async function(req,res){
    try {
        let doc = await User.findOne({'orders.order_id' : req.params.id },{orders:1}).exec();
        var order = doc.orders.find(function(current){
            return current.order_id == req.params.id;
        });
        
        order.status = req.body.category;
        
        doc.save(function(err,modifiedDoc){
            if(err){
                console.log(err);
            } else {
                res.send(order.status);
            }
        });

    } catch(err){
        console.log(err);
    }
});

router.post('/message/:id/delete',middleware.isAdminLoggedIn,function(req,res){
    Message.findByIdAndDelete(req.params.id,function(){
        req.flash('success','Message Deleted Successfully');
        res.redirect('/admin');
    });
});

router.get('/change-password',middleware.isAdminLoggedIn,async function(req,res){

    try {
        let foundUser = await Admin.findOne({username:'admin'}).exec();
        res.render('admin/change-password');
    } catch(err) {
        console.log(err);
    }
});

router.post('/change-password',middleware.isAdminLoggedIn,async function(req,res){

    try {
        let foundUser = await Admin.findOne({username:'admin'}).exec();
        foundUser.setPassword(req.body['new-password'],function(){
            foundUser.save();
            req.flash('success','Data updated successfully');
            res.redirect('/admin');
        });

    } catch(err) {
        console.log(err);
    }
});

module.exports = router;    