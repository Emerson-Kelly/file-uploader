import express from 'express';
import { createFolderPost, deleteFolder, editFolderPost, folderGet } from '../controllers/foldersController.js';

const router = express.Router();

router.post('/folder', createFolderPost);

router.post('/folder/:id/rename', editFolderPost);

router.post("/folder/:id/deleteFolder", deleteFolder);

export { router as folderRouter };
