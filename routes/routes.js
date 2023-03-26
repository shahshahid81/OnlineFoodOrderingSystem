const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const moment = require("moment");

const router = express.Router();

const Food = require("../models/food");
const User = require("../models/user");
const Message = require("../models/message");
const middleware = require("../middleware/middleware");

const savedUsers = [];

router.get("/", function (req, res) {
  res.render("user/index");
});

router.get("/menu", async function (req, res) {
  const allFoods = await Food.find({});
  if (typeof req.user === "undefined") {
    const currentUser = savedUsers.find(
      (element) => element.user === req.user.username
    );
    if (typeof currentUser !== "undefined") {
      res.render("user/menu", {
        Foods: allFoods,
        cartItems: currentUser.cart,
      });
    }
  }
  res.render("user/menu", { Foods: allFoods, cartItems: {} });
});

router.get("/contactus", function (req, res) {
  res.render("user/contact-us");
});

router.post("/contactus", async function (req, res) {
  const messageObject = {
    name: req.body.name,
    phoneNumber: req.body["phone-number"],
    email: req.body.email,
    message: req.body.message,
  };

  try {
    await Message.insertMany(messageObject);
    req.flash("success", "Message Submitted Successfully.");
    res.redirect("/contactus");
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occured.");
    res.redirect("/contactus");
  }
});

router.get("/signup", function (req, res) {
  res.render("user/signup");
});

router.post("/signup", async function (req, res, next) {
  const Password = req.body.password;
  const newUser = {
    name: req.body.name,
    phoneNumber: req.body["phone-number"],
    username: req.body.email,
  };

  try {
    const user = await User.register(newUser, Password);
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/menu");
    });
  } catch (error) {
    console.log(error);
    if (error.name === "UserExistsError") {
      req.flash("error", error.message);
    } else {
      req.flash("error", "An error occured.");
    }
    return res.redirect("/signup");
  }
});

router.get("/signin", function (req, res) {
  res.render("user/signin");
});

router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/menu",
    failureRedirect: "/signin",
    failureFlash: true,
  })
);

router.get("/cart", middleware.isLoggedIn, function (req, res) {
  currentItems = savedUsers.find(function (element) {
    return element.user === req.user.username;
  });
  if (typeof currentItems !== "undefined") {
    res.render("user/cart", { cartItems: currentItems.cart });
  } else {
    res.render("user/cart", {});
  }
});

router.post("/cart", middleware.isLoggedIn, async function (req, res) {
  if (
    savedUsers.find((element) => element.user === req.user.username) ===
    undefined
  ) {
    savedUsers.push({ user: req.user.username });
  }

  const removeItem = req.get("removeItem");
  const clearCart = req.get("clearCart");

  if (removeItem === "true") {
    const items = req.query.items;

    const userObject = savedUsers.find(function (element) {
      return element.user === req.user.username;
    });

    const itemIndex = userObject.cart.findIndex(function (element) {
      return element.Name === items;
    });

    userObject.cart.splice(itemIndex, 1);

    for (let i = 0; i < savedUsers.length; i++) {
      if (savedUsers[i].user === userObject.user) {
        savedUsers[i].cart = userObject.cart;
        break;
      }
    }

    res.sendStatus(200);
  } else if (clearCart === "true") {
    const userObject = savedUsers.find(
      (element) => element.user === req.user.username
    );

    if (typeof userObject.cart !== "undefined") {
      userObject.cart = [];
    }

    res.sendStatus(200);
  } else {
    const items = req.query.items;

    const foundItems = await Food.findOne({ Name: items });

    const user = savedUsers.find(
      (element) => element.user === req.user.username
    );

    if (typeof user.cart === "undefined") {
      user.cart = [];
      user.cart.push(foundItems);
      res.sendStatus(200);
    } else {
      if (user.cart.length === 0) {
        user.cart = [];
        user.cart.push(foundItems);
      } else {
        const index = user.cart.findIndex(
          (element) => element.Name === foundItems.Name
        );

        if (index === -1) {
          user.cart.push(foundItems);
        }
      }
      res.sendStatus(200);
    }
  }
});

router.get("/signout", function (req, res) {
  req.logout();
  res.redirect("/menu");
});

router.get("/aboutus", function (req, res) {
  res.render("user/aboutus");
});

router.get(
  "/change-password",
  middleware.isLoggedIn,
  async function (req, res) {
    const foundUser = await User.findOne({ username: req.user.username });
    res.render("user/change-password", { User: foundUser });
  }
);

router.post(
  "/change-password",
  middleware.isLoggedIn,
  async function (req, res) {
    const foundUser = await User.findOne({
      username: req.user.username,
    });
    await foundUser.setPassword(req.body["new-password"]);
    await foundUser.save();
    req.flash("success", "Data updated successfully");
    res.redirect("/change-password");
  }
);

router.get("/update-profile", middleware.isLoggedIn, async function (req, res) {
  const user = await User.findOne({ username: req.user.username });
  res.render("user/update-profile.ejs", { User: user });
});

router.post(
  "/update-profile",
  middleware.isLoggedIn,
  async function (req, res) {
    try {
      const foundUser = await User.findOne({
        username: req.user.username,
      });

      const name = req.body.name || foundUser.name;
      const username = req.body.email || foundUser.username;
      const phoneNumber = req.body["phone-number"] || foundUser.phoneNumber;

      const updatedUser = {
        name,
        phoneNumber,
        username,
      };
      await User.findOneAndUpdate({ _id: foundUser._id }, updatedUser, {
        new: true,
      });
      req.flash("success", "Data updated successfully");
      res.redirect("/update-profile");
    } catch (err) {
      console.log(err);
      req.flash("error", "Error while updating data");
      res.redirect("/update-profile");
    }
  }
);

router.post("/order", middleware.isLoggedIn, async function (req, res) {
  const orderItems = JSON.parse(req.query.items);

  const savedUser = savedUsers.find(
    (element) => element.user === req.user.username
  );

  if (typeof savedUser === "undefined" || typeof orderItems === "undefined") {
    req.flash("error", "Please Enter items in the cart");
    res.redirect("/menu");
  } else if (typeof orderItems.items === "undefined") {
    req.flash("error", "Please Enter items in the cart");
    res.redirect("/menu");
  } else if (orderItems.items.length === 0) {
    req.flash("error", "Please Enter items in the cart");
    res.redirect("/menu");
  } else {
    const foodToFind = orderItems.items.map((item) => item._id);
    const foundItems = await Food.find({ _id: { $in: foodToFind } });

    const savedOrderItems = foundItems.map((item) => {
      const order = orderItems.items.find(
        (orderItem) => orderItem._id === item._id
      );

      return {
        product_id: item._id,
        quantity: order.quantity,
        price: parseInt(order.quantity) * parseInt(item.Price).toString(),
      };
    });

    const savedOrder = { items: savedOrderItems, grandTotal: orderItems.total };
    savedUser.order = savedOrder;

    const foundUser = User.findOne({ username: savedUser.user });
    res.render("user/order", { User: foundUser });
  }
});

router.get("/order", middleware.isLoggedIn, async function (req, res) {
  const orderArr = await User.aggregate([
    { $match: { username: req.user.username } },
    { $project: { orders: 1, _id: 0 } },
    { $unwind: "$orders" },
    { $sort: { "orders.orderedAt": -1 } },
  ]);

  res.render("user/orders", { orderArr, moment });
});

router.get("/order/:id", middleware.isLoggedIn, async function (req, res) {
  try {
    const user = await User.findOne({
      "orders.order_id": req.params.id,
    });
    const order = user.orders.find(
      (element) => element.order_id.toString() === req.params.id
    );

    const foodToFind = order.items.map((item) => item._id);
    const foundItems = await Food.find(
      { _id: { $in: foodToFind } },
      { Description: 0, Category: 0 }
    );

    const items = foundItems.map((foundItem) => {
      const order = order.items.find(
        (orderItem) => orderItem._id === item._id
      );

      return {
        item: foundItem,
        quantity: order.quantity,
      };
    });

    let grandTotal = 0;
    items.forEach((current) => {
      grandTotal += parseInt(current.item.Price) * current.quantity;
    });
    res.render("user/order-item", { items, grandTotal });
  } catch (err) {
    console.log(err);
  }
});

router.post("/checkout", middleware.isLoggedIn, async function (req, res) {
  const address = {
    apartment: req.body.apartment,
    street: req.body.street,
    city: req.body.city,
    pincode: req.body.pincode,
  };

  const savedUser = savedUsers.find(function (element) {
    return element.user === req.user.username;
  });

  if (typeof savedUser === "undefined" || typeof address === "undefined") {
    req.flash("error", "Please Enter items in the cart");
    res.redirect("/menu");
  } else if (typeof savedUser.order === "undefined") {
    req.flash("error", "Please Enter items in the cart");
    res.redirect("/menu");
  } else if (typeof savedUser.order.items === "undefined") {
    req.flash("error", "Please Enter items in the cart");
    res.redirect("/menu");
  } else if (savedUser.order.items.length === 0) {
    req.flash("error", "Please Enter items in the cart");
    res.redirect("/menu");
  } else {
    savedUser.order.address = address;
    order = savedUser.order;
    order.order_id = mongoose.mongo.ObjectId();
    order.orderedAt = moment().toDate();
    order.status = "Pending";
    await User.findOneAndUpdate(
      { username: savedUser.user },
      { $push: { orders: order } }
    );
    savedUser.cart = "";
    savedUser.order = "";
    res.render("user/checkout", {
      orderID: order.order_id,
      amount: order.grandTotal,
    });
  }
});

module.exports = router;
