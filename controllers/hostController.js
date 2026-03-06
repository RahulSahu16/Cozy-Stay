const Home = require("../models/home");

// =====================================
// ADD HOME SECTION
// =====================================

// GET: Add Home Page
exports.getAddHome = (req, res, next) => {
  res.render("host/editHome", {
    editing: false,
    pageTitle: "Add Your Home",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};


// POST: Add New Home
exports.postAddHome = (req, res, next) => {
  const { houseName, city, price, rating, imageURL, description } = req.body;

  const newHome = new Home({
    houseName,
    city,
    price,
    rating,
    imageURL,
    description,
    host: req.session.user._id,
  });

  newHome.save()
    .then(() => {
      res.redirect("/host/hostHome");
    })
};



// =====================================
// HOST HOMES SECTION
// =====================================

// GET: All Homes Hosted by User
exports.getHostHome = (req, res, next) => {
  Home.find({host: req.session.user._id}).then((registeredHomes) => {
    console.log(registeredHomes);
    res.render("host/hostHome", {
      registeredHomes: registeredHomes,
      pageTitle: "Your Hosted Homes",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};



// =====================================
// EDIT HOME SECTION
// =====================================

// GET: Edit Home Page
exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  if (!editing) {
    console.log("Editing mode not enabled");
    return res.redirect("/host/hostHome");
  }

  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        console.log("Home not found for editing");
        return res.redirect("/host/hostHome");
      }

      res.render("host/editHome", {
        pageTitle: "Edit Your Home",
        editing: editing,
        home: home,
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    })
};


// POST: Update Home
exports.postEditHome = (req, res, next) => {
  const { homeId, houseName, city, price, rating, imageURL, description } = req.body;

  console.log(req.body);

  Home.findById(homeId)
    .then((existinghome) => {
      if (!existinghome) {
        console.log("Home not found for updating");
        return res.redirect("/host/hostHome");
      }

      existinghome.houseName = houseName;
      existinghome.city = city;
      existinghome.price = price;
      existinghome.rating = rating;
      existinghome.imageURL = imageURL;
      existinghome.description = description;

      return existinghome.save();
    })
    .finally(() => {
      return res.redirect("/host/hostHome")
    })
};



// =====================================
// DELETE HOME SECTION
// =====================================

// POST: Delete Home
exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;

  console.log("Received request to delete home with ID:", homeId);

  Home.findByIdAndDelete(homeId)
    .then(() => {
      console.log("Home deleted successfully with ID:", homeId);
      res.redirect("/host/hostHome");
    })
};