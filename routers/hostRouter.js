const express = require("express");
const hostRouter = express.Router();
const hostController = require("../controllers/hostController");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

hostRouter.get("/addHome", hostController.getAddHome);

hostRouter.post(
  "/addHome",
  upload.single("image"),
  hostController.postAddHome
);

hostRouter.get("/hostHome", hostController.getHostHome);
hostRouter.get("/editHome/:homeId", hostController.getEditHome);
hostRouter.post(
  "/editHome",
  upload.single("image"),
  hostController.postEditHome
);
hostRouter.post("/deleteHome/:homeId", hostController.postDeleteHome);

module.exports = hostRouter;