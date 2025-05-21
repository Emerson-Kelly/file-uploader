import express from 'express';
import { usersCreateGet, signup_post } from '../controllers/usersController.js';

const router = express.Router();

// Show the sign-up form
router.get("/sign-up", usersCreateGet);

// Handle sign-up form submission
router.post("/sign-up", signup_post);

export { router as usersRouter };
