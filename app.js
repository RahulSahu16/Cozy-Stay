const path = require("path");
const express = require("express");
require("dotenv").config();


const storeRouter = require("./routers/storeRouter");
const { hostRouter } = require("./routers/hostRouter");
const errorController = require("./controllers/errorController")

const app = express();


// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(storeRouter);
app.use("/host", hostRouter);

// 404 Page
app.use(errorController.getError);

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });