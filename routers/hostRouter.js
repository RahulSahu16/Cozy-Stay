const express = require('express');
const hostRouter = express.Router();


hostRouter.get("/addHome", (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Your Home",
  });
});

const registeredHomes = [];


hostRouter.post("/addHome", (req, res, next) =>{
    registeredHomes.push(req.body);
    console.log(registeredHomes);
    res.render("host/homeAdded", {
    pageTitle: "Home Hosted Successfully",
  })
});

exports.hostRouter = hostRouter;
exports.registeredHomes = registeredHomes;

