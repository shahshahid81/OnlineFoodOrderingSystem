const express = require('express');
const moment = require('moment');
const passport = require('passport');

const router = express.Router();

const User = require('../models/user');
const Message = require("../models/message");
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

router.get('/',middleware.isAdminLoggedIn,function(req,res){
    User.find({},function(err,foundUsers){
        if(err){
            console.log(err);
        } else {
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
            Message.find({},function(err,docs){
                res.render('admin/dashboard',{stats : statsObject,messages : docs});
            });
        }
    });
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

router.post('/order/:id',middleware.isAdminLoggedIn,function(req,res){
    User.findOne({'orders.order_id' : req.params.id },{orders:1},function(err,doc){
        if(err){
            console.log(err);
        } else {
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
        }
    });
});

module.exports = router;