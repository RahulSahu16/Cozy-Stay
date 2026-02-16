const express = require('express');
const hostRouter = express.Router();
const hostController = require("../controllers/hostController")

hostRouter.get("/addHome", hostController.getAddHome);
hostRouter.post("/addHome", hostController.postAddHome);

exports.hostRouter = hostRouter;


