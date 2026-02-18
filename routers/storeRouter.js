const express = require("express");
const storeRouter = express.Router();
const storeController = require('../controllers/storeController');

storeRouter.get("/", storeController.getHomePage);
storeRouter.get("/allhomes", storeController.getAllHomes);
storeRouter.get("/allhomes/:homeId", storeController.getHomeDetails);
module.exports = storeRouter;
