import express from 'express';
import { deleteFile, downloadFile, filesGet, filesPost, fileUploadMiddleware } from '../controllers/filesController.js';

const router = express.Router();

router.get("/folder/:id", filesGet);

router.get("/download/:url", downloadFile);

router.post("/uploads", fileUploadMiddleware, filesPost);

router.post("/folder/:id/delete", deleteFile);

export { router as filesRouter };