const Favourite = require("../models/favourite");
const Home  = require("../models/home");

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

exports.postaddToFavourites = (req, res, next) => {
  const homeId = req.body.homeId;
  const favourite = new Favourite(homeId);
  favourite.save().then(() => {
    res.redirect("/favourites");
  }).catch(err => {
    console.log("Error adding to favourites", err);
    res.redirect("/allhomes");
  });
}

 exports.getFavourites = (req, res, next) => {
  Favourite.find().then(favouriteIds => {
    Home.find().then (registeredHomes => {
      favouriteIds = favouriteIds.map(favId => favId.homeId);
      const favouriteHomes = registeredHomes.filter(home => favouriteIds.includes(home._id.toString()));
      res.render("store/favourites", { favouriteHomes: favouriteHomes, pageTitle: "Your Favourites" });
    });
  })
};

exports.postRemoveFromFavourites = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.deleteById(homeId).then(() => {
    res.redirect("/favourites");
  }).catch(err => {
    console.log("Error removing from favourites", err);
    res.redirect("/favourites");
  }); 
};