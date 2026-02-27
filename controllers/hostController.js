const e = require("express");
const Home = require("../models/home")

// ADD HOME SECTION
exports.getAddHome = (req, res, next) => {
  res.render("host/editHome", {
    editing: false,
    pageTitle: "Add Your Home",
  });
}


exports.postAddHome = (req, res, next) =>{
    const{houseName, city, price, rating, imageURL, description} = req.body;
    const newHome = new Home(houseName, city, price, rating, imageURL, description);
    newHome.save().then((rows) => {
      res.render("host/homeAdded", {pageTitle: "Home Hosted Successfully"})})
}


exports.getHostHome = (req, res, next) => {
  Home.fetchAll().then ((registeredHomes) => {
    res.render("host/hostHome", {registeredHomes: registeredHomes,pageTitle: "Your Hosted Homes"});
  })};



// EDIT HOME SECTION

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  if(!editing) {
    console.log("Editing mode not enabled");
    return res.redirect("/host/hostHome");
  }
  Home.findById(homeId)
    .then(home => {
      if(!home){
        console.log("Home not found for editing");
        return res.redirect("/host/hostHome");
      }
      res.render("host/editHome", {
        pageTitle: "Edit Your Home",
        editing: editing,
        home: home
      });
    })
    .catch(err => {
      console.log("Error fetching home for edit:", err);
      res.redirect("/host/hostHome");
    });
};

exports.postEditHome = (req, res, next) => {
  const {homeId, houseName, city, price, rating, imageURL, description} = req.body;
  const updatedHome = new Home(houseName, city, price, rating, imageURL, description);
  updatedHome._id = homeId;

  updatedHome.save()
    .then(() => {
      console.log("Home updated successfully:", updatedHome);
      res.redirect("/host/hostHome");
    })
    .catch(error => {
      console.log("Error updating home:", error);
      res.redirect("/host/hostHome");
    });
};


// DELETE HOME SECTION 

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  if (!homeId) {
    console.log("Home ID is missing!");
    return res.redirect("/host/hostHome");
  }
  console.log("Received request to delete home with ID:", homeId);
  Home.deleteById(homeId).then(() => {
    console.log("Home deleted successfully with ID:", homeId);
  })
    res.redirect("/host/hostHome");
};   
