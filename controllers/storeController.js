const Home  = require("../models/home");

exports.getHomePage = (req, res, next) => {
  Home.fetchAll(registeredHomes => {
  res.render("store/homepage", {registeredHomes: registeredHomes,pageTitle: "Welcome to Stay Cozy"});
})
} 
