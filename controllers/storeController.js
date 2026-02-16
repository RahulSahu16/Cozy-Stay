const { registeredHomes } = require("../models/home");

exports.getHomePage = (req, res, next) => {
  console.log(registeredHomes);
  res.render("store/homepage", {registeredHomes: registeredHomes,pageTitle: "Welcome to Stay Cozy"});
}