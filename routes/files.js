import express from 'express';
import { filesGet, filesPost, fileUploadMiddleware } from '../controllers/filesController.js';

const router = express.Router();

router.get("/folder/:id", filesGet);

router.post("/uploads", fileUploadMiddleware, filesPost);

  export { router as filesRouter };