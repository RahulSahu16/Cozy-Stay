exports.getError = (req, res, next) => {
  res.statusCode = 404;
  res.render("store/error", { pageTitle: "Page Not Found", isLoggedIn: req.isLoggedIn , user : req.session.user});
}