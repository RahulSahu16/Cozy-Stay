const express = require("express");
const storeRouter = express.Router();
const storeController = require('../controllers/storeController');

storeRouter.get("/", storeController.getHomePage);
storeRouter.get("/allhomes", storeController.getAllHomes);
storeRouter.get("/allhomes/:homeId", storeController.getHomeDetails);
storeRouter.get("/favourites", storeController.getFavourites); 
storeRouter.post("/favourites", storeController.postaddToFavourites); 
storeRouter.post("/favourites/remove/:homeId", storeController.postRemoveFromFavourites);
module.exports = storeRouter;
