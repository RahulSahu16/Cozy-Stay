const express = require('express');
const hostRouter = express.Router();
const hostController = require("../controllers/hostController")

hostRouter.get("/addHome", hostController.getAddHome);
hostRouter.post("/addHome", hostController.postAddHome);
hostRouter.get("/hostHome", hostController.getHostHome);
hostRouter.get("/editHome/:homeId", hostController.getEditHome);
hostRouter.post("/editHome", hostController.postEditHome);
hostRouter.post("/deleteHome/:homeId", hostController.postDeleteHome);

module.exports = hostRouter;


