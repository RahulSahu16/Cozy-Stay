const Favourite = require("../models/favourite");
const Home  = require("../models/home");

exports.getHomePage = (req, res, next) => {
  Home.fetchAll(registeredHomes => {
  res.render("store/homepage", {registeredHomes: registeredHomes,
                                pageTitle: "Welcome to Stay Cozy"});
})
} 

exports.getAllHomes = (req, res, next) => {
  Home.fetchAll(registeredHomes => {
  res.render("store/allHomes", {registeredHomes: registeredHomes,pageTitle: "All Homes"});
})
}

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId, home => {
    if(home){
      res.render("store/homeDetails", {home: home, pageTitle: home.houseName});
    }else{
      res.status(404).render("store/homeDetails", {home: null, pageTitle: "Home Not Found"});
    }
   }
)
}

exports.addToFavourites = (req, res, next) => {
  console.log("Came to add to favourites", req.body);
  Favourite.addToFavourite(req.body.homeId, error => { 
    if(error){
      console.log("Error adding to favourites", error);
    } else{
       res.redirect("/favourites");
    } 
  }   
 )}

 exports.getFavourites = (req, res, next) => {
  Favourite.fetchAll(favouriteIds => {
    Home.fetchAll((homes) => {
      const favouriteHomes = homes.filter(home => favouriteIds.includes(home.id));
      res.render("store/favourites", { favouriteHomes: favouriteHomes, pageTitle: "Your Favourites" });
    });
  })

};
