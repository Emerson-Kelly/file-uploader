import express from "express";
import { loginGet, loginPost } from "../controllers/loginController.js";

const router = express.Router();

// Show the login form
router.get("/login", loginGet);

// Handle login form submission
router.post("/login", loginPost);

router.get('/logout', (req, res, next) => {
    req.logout(err => {
      if (err) return next(err);
      res.redirect('/');
    });
  });

export { router as loginRouter };