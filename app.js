const path = require("path");
const express = require("express");

const storeRouter = require("./routers/storeRouter");
const { hostRouter } = require("./routers/hostRouter");

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
app.use((req, res, next) => {
  res.status(404).render("store/error", { pageTitle: "Page Not Found" });
});

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});





