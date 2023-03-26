const express = require("express");
const moment = require("moment");
const passport = require("passport");

const router = express.Router();

const User = require("../models/user");
const Message = require("../models/message");
const Admin = require("../models/admin");
const middleware = require("../middleware/middleware");

router.get("/login", function (req, res) {
  res.render("admin/login");
});

router.post(
  "/login",
  passport.authenticate("admin-local", {
    successRedirect: "/admin",
    failureRedirect: "/admin/login",
    failureFlash: true,
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/admin/login");
});

router.get("/", middleware.isAdminLoggedIn, async function (req, res) {
  try {
    let foundUsers = await User.find({});

    const userCount = foundUsers.length;
    let orderCount = 0;
    let totalSales = 0;

    foundUsers.forEach((user) => {
      orderCount += user.orders.length;

      user.orders.forEach((order) => {
        if (order.status === "Delivered") {
          totalSales += parseInt(order.grandTotal);
        }
      });
    });

    const statsObject = {
      user: userCount,
      order: orderCount,
      sales: totalSales,
    };
    const docs = await Message.find({});
    res.render("admin/dashboard", { stats: statsObject, messages: docs });
  } catch (err) {
    console.log(err);
  }
});

router.get("/order", middleware.isAdminLoggedIn, async function (req, res) {
  const allOrders = await User.aggregate([
    { $unwind: "$orders" },
    { $sort: { "orders.orderedAt": -1 } },
  ]);

  const orders = allOrders.map((current) => {
    return {
      username: current.username,
      order_id: current.orders.order_id,
      orderedAt: current.orders.orderedAt,
      total: current.orders.grandTotal,
      status: current.orders.status,
    };
  });
  res.render("admin/order-status", { orders, moment });
});

router.post(
  "/order/:id",
  middleware.isAdminLoggedIn,
  async function (req, res) {
    let doc = await User.findOne(
      { "orders.order_id": req.params.id },
      { orders: 1 }
    );
    const order = doc.orders.find(function (current) {
      return current.order_id == req.params.id;
    });

    order.status = req.body.category;

    await doc.save();
    res.send(order.status);
  }
);

router.post(
  "/message/:id/delete",
  middleware.isAdminLoggedIn,
  async function (req, res) {
    await Message.findByIdAndDelete(req.params.id);
    req.flash("success", "Message Deleted Successfully");
    res.redirect("/admin");
  }
);

router.get("/change-password", middleware.isAdminLoggedIn, function (req, res) {
  res.render("admin/change-password");
});

router.post(
  "/change-password",
  middleware.isAdminLoggedIn,
  async function (req, res) {
    const foundUser = await Admin.findOne({ username: "admin" });
    await foundUser.setPassword(req.body["new-password"]);
    await foundUser.save();
    req.flash("success", "Data updated successfully");
    res.redirect("/admin");
  }
);

module.exports = router;
