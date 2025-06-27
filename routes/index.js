import express from "express";
import { indexGet } from "../controllers/indexController.js";

const router = express.Router();

router.get("/", indexGet);

export { router as indexRouter };
