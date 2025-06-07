import express from 'express';
import { deleteFile, filesGet, filesPost, fileUploadMiddleware } from '../controllers/filesController.js';

const router = express.Router();

router.get("/folder/:id", filesGet);

router.post("/uploads", fileUploadMiddleware, filesPost);

router.post("/folder/:id/delete", deleteFile);

export { router as filesRouter };