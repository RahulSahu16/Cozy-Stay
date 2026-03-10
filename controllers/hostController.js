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

  if (!req.body) {
    console.error("req.body is undefined");
    return res.status(400).render("store/error", {
      pageTitle: "Invalid Request",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user
    });
  }

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const houseName = req.body.houseName;
  const city = req.body.city;
  const price = req.body.price;
  const rating = req.body.rating;
  const description = req.body.description;

  const imageURL = req.file ? req.file.filename : null;

  if (!imageURL) {
    console.error("No image uploaded");
    return res.status(400).render("store/error", {
      pageTitle: "Image Required",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user
    });
  }

  const newHome = new Home({
    houseName,
    city,
    price,
    rating,
    imageURL,
    description,
    host: req.session.user._id
  });

  newHome.save()
    .then(() => {
      res.redirect("/host/hostHome");
    })
    .catch(err => {
      console.error("Error saving home:", err);
      res.status(500).render("store/error", {
        pageTitle: "Error Adding Home",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user
      });
    });

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
  if (!req.body) {
    console.error("req.body is undefined in postEditHome");
    return res.status(400).render("store/error", {
      pageTitle: "Invalid Request",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user
    });
  }

  const homeId = req.body.homeId;
  const houseName = req.body.houseName;
  const city = req.body.city;
  const price = req.body.price;
  const rating = req.body.rating;
  const description = req.body.description;

  console.log("EDIT BODY:", req.body);
  console.log("EDIT FILE:", req.file);

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
      existinghome.description = description;

      // If a new image was uploaded, update the imageURL; otherwise keep the existing one
      if (req.file) {
        existinghome.imageURL = req.file.filename;
      }

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