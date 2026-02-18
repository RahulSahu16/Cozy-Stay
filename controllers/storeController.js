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
  Home.fetchAll((homes) => {
    const home = homes.find(home => home.id === homeId);
    if (!home) {
      return res.send("Home not found");
    }
    res.render("store/homeDetails", {
      pageTitle: "Home Details",
      home: home
    });
  });
};


