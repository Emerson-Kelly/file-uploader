import express from 'express';
import { filesGet, filesPost, fileUploadMiddleware } from '../controllers/filesController.js';

const router = express.Router();

router.post("/uploads", fileUploadMiddleware, filesPost);

router.get("/folder/:id", filesGet);

  export { router as filesRouter };