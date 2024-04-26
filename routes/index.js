var express = require("express");
var router = express.Router();
const passport = require("passport");
const userModel = require("./users");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { nav: false });
});

router.get("/register", function (req, res, next) {
  res.render("register", { nav: false });
});

router.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("profile", { nav: true });
});

router.post("/register", function (req, res, next) {
  const data = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact,
  });
  userModel.register(data, req.body.password).then(function (user) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }),
  function (req, res, next) {}
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

module.exports = router;
