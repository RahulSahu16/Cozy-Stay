// =====================================
// IMPORTS
// =====================================

const User = require("../models/user");
const Home = require("../models/home");
const mongoose = require("mongoose");


// =====================================
// HOME PAGE CONTROLLERS
// =====================================

// GET: Homepage
exports.getHomePage = async (req, res) => {
  try {
    const homes = await Home.find();

    res.render("store/homepage", {
      homes: homes,
      pageTitle: "Welcome to Stay Cozy",
    });

  } catch (err) {
    console.log("Error loading homepage:", err);
    res.redirect("/");
  }
};


// GET: All Homes
exports.getAllHomes = async (req, res) => {
  try {
    const registeredHomes = await Home.find();

    res.render("store/allHomes", {
      registeredHomes: registeredHomes,
      pageTitle: "All Homes",
    });

  } catch (err) {
    console.log("Error fetching homes:", err);
    res.redirect("/");
  }
};


// GET: Home Details
exports.getHomeDetails = async (req, res) => {
  try {
    const homeId = req.params.homeId;
    const home = await Home.findById(homeId);

    if (!home) {
      console.log("Home not found");
      return res.redirect("/allhomes");
    }

    res.render("store/homeDetails", {
      home: home,
      pageTitle: "Home Details",
    });

  } catch (err) {
    console.log("Error fetching home details:", err);
    res.redirect("/allhomes");
  }
};



// =====================================
// FAVOURITES CONTROLLERS
// =====================================

// POST: Add Home to Favourites
exports.postaddToFavourites = async (req, res) => {
  try {

    const homeId = req.body.homeId;
    const userId = req.session.user._id;

    const user = await User.findById(userId);

    if (!user.favouriteHomes.includes(homeId)) {
      user.favouriteHomes.push(homeId);
      await user.save();
    }

    res.redirect("/favourites");

  } catch (err) {
    console.log("Error adding favourite:", err);
    res.redirect("/favourites");
  }
};


// GET: Favourites Page
exports.getFavourites = async (req, res) => {
  try {

    const userId = req.session.user._id;

    const user = await User.findById(userId)
      .populate("favouriteHomes");

    res.render("store/favourites", {
      favouriteHomes: user.favouriteHomes,
      pageTitle: "Your Favourites",
    });

  } catch (err) {
    console.log("Error loading favourites:", err);
    res.redirect("/");
  }
};


// POST: Remove Home from Favourites
exports.postRemoveFromFavourites = async (req, res) => {
  try {

    const homeId = req.params.homeId;
    const userId = req.session.user._id;

    const user = await User.findById(userId);

    user.favouriteHomes = user.favouriteHomes.filter(
      (id) => id.toString() !== homeId
    );

    await user.save();

    res.redirect("/favourites");

  } catch (err) {
    console.log("Error removing favourite:", err);
    res.redirect("/favourites");
  }
};