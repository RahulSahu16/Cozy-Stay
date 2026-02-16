const express = require("express");

const { registeredHomes } = require("./hostRouter");

const storeRouter = express.Router();

storeRouter.get("/", (req, res, next) => {
  console.log(registeredHomes);

  res.render("store/homepage", {
    registeredHomes: registeredHomes,
    pageTitle: "Welcome to Stay Cozy"
  });
});

module.exports = storeRouter;
