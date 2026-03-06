const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render("auth/login", { pageTitle: "Login", isLoggedIn: false });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    isLoggedIn : false
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User Not Found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid Password");
    }

    req.session.isLoggedIn = true;
    req.session.user = user;

    req.session.save((err) => {
      if (err) {
        console.log("Session save error:", err);
      }
      return res.redirect("/");
    });

  } catch (err) {
    res.render("auth/login", {
      pageTitle: "Login",
      isLoggedIn: false,
      errorMessage: [err.message]
    });
  }
};

exports.postSignup = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .trim()
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["user", "host"])
    .withMessage("Role must be either 'user' or 'host'"),

  check("terms")
    .notEmpty()
    .withMessage("You must agree to the terms and conditions"),

  (req, res, next) => {
    console.log("Signup data:", req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        isLoggedIn: false,
        errorMessage: errors.array().map(err => err.msg),
        oldInput: req.body
      });
    }

    const { name, email, password, role } = req.body;

    bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
          role
        });

       user.save().then(result => {
        console.log(result);
        res.redirect("/login");
      }).catch(error => {
        return res.status(422).render('auth/signup', 
          {
            pageTitle: 'Login', 
            isLoggedIn: false,
            errorMessages: [error],
            oldInput: req.body,
          })
      });
    })
  }
];
exports.postLogout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
};