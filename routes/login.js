import express from "express";
import { loginGet, loginPost, logoutGet } from "../controllers/loginController.js";

const router = express.Router();

// Show the login form
router.get("/login", loginGet);

// Handle login form submission
router.post("/login", loginPost);

router.get('/logout', logoutGet);


export { router as loginRouter };