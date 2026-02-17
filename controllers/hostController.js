const Home = require("../models/home")

exports.getAddHome = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Your Home",
  });
}

exports.postAddHome = (req, res, next) =>{
    const{houseName, city, price, rating, imageURL, description} = req.body;
    const newHome = new Home(houseName, city, price, rating, imageURL, description);
    newHome.save(error => {
      if(error){
        res.redirect("/");
      }
      else{
        res.render("host/homeAdded", {
    pageTitle: "Home Hosted Successfully",
      })}})};
