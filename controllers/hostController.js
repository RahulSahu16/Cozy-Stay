const {Home} = require("../models/home")

exports.getAddHome = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Your Home",
  });
}

exports.postAddHome = (req, res, next) =>{
    const houseName = req.body.houseName;
    const newHome = new Home(houseName);
    newHome.save();
    res.render("host/homeAdded", {
    pageTitle: "Home Hosted Successfully",
  })
}

