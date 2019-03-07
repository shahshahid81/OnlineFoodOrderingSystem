const express = require('express');
const moment = require('moment');

const router = express.Router();

const User = require('../models/user');

router.get('/',function(req,res){
    User.find({},function(err,foundDocs){
        console.log(foundDocs);

        var allOrders = [];
        foundDocs.forEach(function(current){
            current.orders.forEach(function(order){
                allOrders.push({
                    username : current.username,
                    order_id: order.order_id,
                    orderedAt : order.orderedAt,
                    total : order.grandTotal,
                    status : order.status
                });
            });
        });
        console.log(allOrders);
        // res.render('admin',{orders:{}});
        res.render('admin',{orders:allOrders,moment:moment});
    });
});

module.exports = router;