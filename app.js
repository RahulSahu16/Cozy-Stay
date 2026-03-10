// ================= CORE MODULES =================
const path = require("path");
require("dotenv").config();

// ================= EXTERNAL MODULES =================
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const multer = require("multer");
const MongoDBStore = require("connect-mongodb-session")(session);

// ================= LOCAL MODULES =================
const hostRouter = require("./routers/hostRouter");
const authRouter = require("./routers/authRouter");
const storeRouter = require("./routers/storeRouter");
const errorController = require("./controllers/errorController");

// ================= APP INIT =================
const app = express();

// ================= VIEW ENGINE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= BODY PARSER =================
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES =================
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= MULTER CONFIG =================
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Accept only images
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


// ================= SESSION STORE =================
const store = new MongoDBStore({
  uri: process.env.MONGO_DB_URL,
  collection: "sessions"
});

// Handle session store errors
store.on("error", function (error) {
  console.log("SESSION STORE ERROR:", error);
});

// ================= SESSION =================
app.use(
  session({
    secret: "MERN LIVE BATCH",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

// ================= GLOBAL VARIABLES =================
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.user = req.session.user;
  next();
});

// ================= ROUTES =================
app.use(storeRouter);
app.use(authRouter);

// Protect host routes
app.use("/host", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
});

app.use("/host", hostRouter);

// ================= 404 =================
app.use(errorController.getError);

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((err) => console.log(err));