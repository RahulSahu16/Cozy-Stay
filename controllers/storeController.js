const Favourite = require("../models/favourite");
const Home  = require("../models/home");
const mongoose = require("mongoose");

exports.getHomePage = (req, res, next) => {
  Home.find().then ((registeredHomes) => {
  res.render("store/homepage", {registeredHomes: registeredHomes,pageTitle: "Welcome to Stay Cozy"});
})
} 

exports.getAllHomes = (req, res, next) => {
  Home.find().then ((registeredHomes) => {
  res.render("store/allHomes", {registeredHomes: registeredHomes,pageTitle: "All Homes"});
})
}

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(home => {
    if (!home) {
      console.log("Home not found");
      return res.redirect("/allhomes");
    }
    res.render("store/homeDetails", {home: home, pageTitle: "Home Details"});
  }
)
}

// FAVOURITES SECTION

exports.postaddToFavourites = async (req, res, next) => {
  const homeId = req.body.homeId;
  const existing = await Favourite.findOne({ homeId: homeId });

  if (existing) {
    return res.redirect("/favourites");
  }
  const favourite = new Favourite({
    homeId: homeId
  });
  await favourite.save();
  res.redirect("/favourites");
};

 exports.getFavourites = (req, res, next) => {
  Favourite.find().then((favouriteIds) => {
    favouriteIds = favouriteIds.map(fav => fav.homeId.toString());
    Home.find().then(registeredHomes => {
      const favouriteHomes = registeredHomes.filter(home => favouriteIds.includes(home._id.toString()));
      res.render("store/favourites", { favouriteHomes: favouriteHomes, pageTitle: "Your Favourites" });
    });
  })
};

exports.postRemoveFromFavourites = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.findOneAndDelete({ homeId: homeId })
  .then(() => {
    res.redirect("/favourites");
  }).catch(err => {
    console.log(err);
    res.redirect("/favourites");
  });
};