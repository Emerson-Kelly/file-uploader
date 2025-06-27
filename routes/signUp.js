import express from "express";
import { usersCreateGet, signup_post } from "../controllers/usersController.js";

const router = express.Router();

router.get("/sign-up", usersCreateGet);

router.post("/sign-up", signup_post);

export { router as usersRouter };
