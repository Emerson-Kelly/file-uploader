import { validationResult, body } from "express-validator";
import passport from "passport";

// Validation middleware for login form
export const validateLogin = [
  body("email").trim().isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password cannot be blank"),
];

// GET login page
export const loginGet = (req, res) => {
  res.render("pages/login", {
    title: "Login",
    errors: [],
  });
};

// POST login logic using Passport.js
export const loginPost = [
  validateLogin,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("pages/login", {
        title: "Login",
        errors: errors.array(),
      });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).render("pages/login", {
          title: "Login",
          errors: [{ msg: "Invalid email or password" }],
        });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect("/");
      });
    })(req, res, next);
  },
];

// GET logout
export const logoutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
