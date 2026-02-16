exports.getError = (req, res, next) => {
  res.status(404).render("store/error", { pageTitle: "Page Not Found" });
}