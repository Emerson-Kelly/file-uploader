import express from 'express';
import { indexGet } from '../controllers/indexController.js';

const router = express.Router();

// Show the Homepage with posts
router.get("/", indexGet);

  export { router as indexRouter };