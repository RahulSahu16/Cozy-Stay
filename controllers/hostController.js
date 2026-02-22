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
    newHome.save(error => {
      if(error){
        res.redirect("/");
      }
      else{
        res.render("host/homeAdded", {
        pageTitle: "Home Hosted Successfully",
      }
    )
  }
}
)};


exports.getHostHome = (req, res, next) => {
  Home.fetchAll(registeredHomes => {
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
  Home.findById(homeId, (home) => {
    if(!home){
      console.log("Home not found for editing");
      return res.redirect("/host/hostHome");
    }

    console.log("Editing home with ID:", homeId, "Editing mode:", editing, "Home details:", home);
    res.render("host/editHome", {
      pageTitle: "Edit Your Home",
      editing: editing,
      home: home
    });
  });
};

exports.postEditHome = (req, res, next) => {
  const {homeId, houseName, city, price, rating, imageURL, description} = req.body;
  const updatedHome = new Home(houseName, city, price, rating, imageURL, description);
  updatedHome.id = homeId;
  updatedHome.save((error) => {
    if(error){
      console.log("Error updating home:", error);
      return res.redirect("/host/hostHome");
    }
    console.log("Home updated successfully:", updatedHome);
    res.redirect("/host/hostHome");
  });
}


// DELETE HOME SECTION 

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  if (!homeId) {
    console.log("Home ID is missing!");
    return res.redirect("/host/hostHome");
  }
  console.log("Received request to delete home with ID:", homeId);
  Home.deleteById(homeId, (error) => {
    if(error){
      console.log("Error deleting home:", error);
    } else {
      console.log("Home deleted successfully with ID:", homeId);
    }
    res.redirect("/host/hostHome");
  });   
}