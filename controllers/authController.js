const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const sendGrid = require("@sendgrid/mail");

const User = require("../models/user");

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);


/* ======================================
   HELPER FUNCTIONS
====================================== */

const renderAuthPage = (res, view, pageTitle, errors = [], oldInput = {}, email = "") => {
  return res.status(422).render(view, {
    pageTitle,
    isLoggedIn: false,
    errorMessage: errors,
    oldInput,
    email
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};


/* ======================================
   GET ROUTES
====================================== */

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login",
    isLoggedIn: false
  });
};

exports.getSignup = (req, res) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    isLoggedIn: false
  });
};

exports.getForgotPassword = (req, res) => {
  res.render("auth/forgot", {
    pageTitle: "Forgot Password",
    isLoggedIn: false
  });
};

exports.getResetPassword = (req, res) => {
  const { email } = req.query;

  res.render("auth/resetPassword", {
    pageTitle: "Reset Password",
    isLoggedIn: false,
    email
  });
};


/* ======================================
   LOGIN
====================================== */

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return renderAuthPage(res, "auth/login", "Login", ["User not found"]);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return renderAuthPage(res, "auth/login", "Login", ["Invalid password"]);
    }

    req.session.isLoggedIn = true;
    req.session.user = user;

    req.session.save(err => {
      if (err) console.log("Session Error:", err);
      res.redirect("/");
    });

  } catch (err) {
    renderAuthPage(res, "auth/login", "Login", [err.message]);
  }
};


/* ======================================
   SIGNUP VALIDATION
====================================== */

exports.signupValidation = [

  check("name")
    .notEmpty().withMessage("Name is required")
    .trim()
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/).withMessage("Only letters allowed"),

  check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter valid email")
    .normalizeEmail(),

  check("password")
    .notEmpty().withMessage("Password required")
    .isLength({ min: 8 }).withMessage("Minimum 8 characters")
    .matches(/[A-Z]/).withMessage("Must contain uppercase")
    .matches(/[a-z]/).withMessage("Must contain lowercase"),

  check("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("role")
    .isIn(["user", "host"])
    .withMessage("Role must be user or host"),

  check("terms")
    .notEmpty()
    .withMessage("You must accept terms")
];


/* ======================================
   SIGNUP
====================================== */

exports.postSignup = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return renderAuthPage(
      res,
      "auth/signup",
      "Signup",
      errors.array().map(err => err.msg),
      req.body
    );
  }

  const { name, email, password, role } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    res.redirect("/login");

  } catch (err) {
    renderAuthPage(res, "auth/signup", "Signup", [err.message], req.body);
  }
};


/* ======================================
   LOGOUT
====================================== */

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};


/* ======================================
   FORGOT PASSWORD
====================================== */

exports.postForgotPassword = async (req, res) => {

  const { email } = req.body;

  try {

    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000);
    };

    const user = await User.findOne({ email });

    if (!user) {
      return renderAuthPage(res, "auth/forgot", "Forgot Password", [
        "No account found with this email"
      ]);
    }

    const otp = generateOTP();

    user.resetOtp = otp;
    user.resetOtpExpiration = Date.now() + 5 * 60 * 1000;

    await user.save();

    const message = {
      to: email,
      from: "rahulssahu1116@gmail.com",
      subject: "Cozy Stay Password Reset OTP",
      text: `Your OTP is ${otp}`,
      html: `<h2>Your OTP: ${otp}</h2><p>Expires in 5 minutes</p>`
    };

    await sendGrid.send(message);

    console.log("OTP sent:", otp);

    res.redirect(`/reset-password?email=${email}`);

  } catch (err) {
    renderAuthPage(res, "auth/forgot", "Forgot Password", [err.message]);
  }
};


/* ======================================
   RESET PASSWORD
====================================== */

exports.postResetPassword = async (req, res) => {

  const { email, otp, password, confirmPassword } = req.body;

  try {

    if (!email || !otp || !password || !confirmPassword) {
      return renderAuthPage(res, "auth/resetPassword", "Reset Password",
        ["All fields are required"], {}, email);
    }

    if (password !== confirmPassword) {
      return renderAuthPage(res, "auth/resetPassword", "Reset Password",
        ["Passwords do not match"], {}, email);
    }

    if (password.length < 8) {
      return renderAuthPage(res, "auth/resetPassword", "Reset Password",
        ["Password must be at least 8 characters"], {}, email);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return renderAuthPage(res, "auth/resetPassword", "Reset Password",
        ["User not found"], {}, email);
    }

    if (!user.resetOtp || user.resetOtp.toString() !== otp.toString()) {
      return renderAuthPage(res, "auth/resetPassword", "Reset Password",
        ["Invalid OTP"], {}, email);
    }

    if (Date.now() > user.resetOtpExpiration) {
      return renderAuthPage(res, "auth/resetPassword", "Reset Password",
        ["OTP expired"], {}, email);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiration = undefined;

    await user.save();

    res.redirect("/login?message=Password reset successful");

  } catch (err) {

    renderAuthPage(res, "auth/resetPassword", "Reset Password",
      [err.message], {}, email);

  }
};