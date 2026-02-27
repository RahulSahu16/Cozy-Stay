const path = require("path");
const express = require("express");


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

const mongo_db_url = "mongodb+srv://MERN_User:cozystay1234@merncluster.vlen7zm.mongodb.net/cozystay?retryWrites=true&w=majority&appName=MERNCluster";

mongoose.connect(mongo_db_url)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});