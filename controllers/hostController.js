
const Home = require("../models/home");

// ADD HOME SECTION
exports.getAddHome = (req, res, next) => {
  res.render("host/editHome", {
    editing: false,
    pageTitle: "Add Your Home",
  });
}


exports.postAddHome = (req, res, next) =>{
    const{houseName, city, price, rating, imageURL, description} = req.body;
    const newHome = new Home({houseName, city, price, rating, imageURL, description});
    newHome.save().then(() => {
      res.redirect("/host/hostHome");
    }).catch(err => {
      console.log("Error adding home:", err);
      res.redirect("/host/addHome");
    });
}


exports.getHostHome = (req, res, next) => {
  Home.find().then ((registeredHomes) => {
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
  console.log(req.body);
  Home.findById(homeId).then(existinghome => {
    if(!existinghome){
      console.log("Home not found for updating");
      return res.redirect("/host/hostHome");
    }
    existinghome.houseName = houseName;
    existinghome.city = city;
    existinghome.price = price;
    existinghome.rating = rating;
    existinghome.imageURL = imageURL;
    existinghome.description = description;
    return existinghome.save().then(() => {
      console.log("Home updated successfully:", existinghome);
      res.redirect("/host/hostHome");
    });
  }).catch(error => {
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
  Home.findByIdAndDelete(homeId).then(() => {
    console.log("Home deleted successfully with ID:", homeId);
    res.redirect("/host/hostHome");
  })
   .catch(err => {
    console.log("Error deleting home:", err);
    res.redirect("/host/hostHome");
  }); 
};
