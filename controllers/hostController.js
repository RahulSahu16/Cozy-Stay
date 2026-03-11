const Home = require("../models/home");
const { deleteFile } = require("../util/file");
const path = require("path");

// Image folder path
const IMAGE_FOLDER = path.join(__dirname, "..", "uploads");

// =====================================
// ADD HOME SECTION
// =====================================

// GET: Add Home Page
exports.getAddHome = (req, res, next) => {
  res.render("host/editHome", {
    editing: false,
    pageTitle: "Add Your Home",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user
  });
};


// POST: Add New Home
exports.postAddHome = (req, res, next) => {

  if (!req.body) {
    console.error("Request body is undefined");
    return res.status(400).render("store/error", {
      pageTitle: "Invalid Request",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user
    });
  }

  const { houseName, city, price, rating, description } = req.body;

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const imageURL = req.file ? req.file.filename : null;

  if (!imageURL) {
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
    description,
    imageURL,
    host: req.session.user._id
  });

  newHome.save()
    .then(() => res.redirect("/host/hostHome"))
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

  Home.find({ host: req.session.user._id })
    .then((registeredHomes) => {

      res.render("host/hostHome", {
        registeredHomes,
        pageTitle: "Your Hosted Homes",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user
      });

    })
    .catch(err => {
      console.log(err);
      res.redirect("/");
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
    return res.redirect("/host/hostHome");
  }

  Home.findById(homeId)
    .then(home => {

      if (!home) {
        return res.redirect("/host/hostHome");
      }

      res.render("host/editHome", {
        pageTitle: "Edit Your Home",
        editing,
        home,
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user
      });

    })
    .catch(err => {
      console.log(err);
      res.redirect("/host/hostHome");
    });

};


// POST: Update Home
exports.postEditHome = (req, res, next) => {

  if (!req.body) {
    console.error("req.body undefined in postEditHome");
    return res.status(400).render("store/error", {
      pageTitle: "Invalid Request",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user
    });
  }

  const { homeId, houseName, city, price, rating, description } = req.body;

  console.log("EDIT BODY:", req.body);
  console.log("EDIT FILE:", req.file);

  Home.findById(homeId)
    .then(existingHome => {

      if (!existingHome) {
        return res.redirect("/host/hostHome");
      }

      existingHome.houseName = houseName;
      existingHome.city = city;
      existingHome.price = price;
      existingHome.rating = rating;
      existingHome.description = description;

      // If new image uploaded
      if (req.file) {

        if (existingHome.imageURL) {

          const oldImagePath = path.join(
            IMAGE_FOLDER,
            existingHome.imageURL
          );

          deleteFile(oldImagePath);
        }

        existingHome.imageURL = req.file.filename;
      }

      return existingHome.save();

    })
    .then(() => res.redirect("/host/hostHome"))
    .catch(err => console.log(err));

};


// =====================================
// DELETE HOME SECTION
// =====================================

// POST: Delete Home
exports.postDeleteHome = (req, res, next) => {

  const homeId = req.params.homeId;

  console.log("Deleting home:", homeId);

  Home.findById(homeId)
    .then(home => {

      if (!home) {
        return res.redirect("/host/hostHome");
      }

      if (home.imageURL) {

        const imagePath = path.join(
          IMAGE_FOLDER,
          home.imageURL
        );

        deleteFile(imagePath);
      }

      return Home.findByIdAndDelete(homeId);

    })
    .then(() => {
      console.log("Home deleted:", homeId);
      res.redirect("/host/hostHome");
    })
    .catch(err => {
      console.log(err);
      res.redirect("/host/hostHome");
    });

};