import express from 'express';
import { createFolderPost, editFolderPost } from '../controllers/foldersController.js';

const router = express.Router();

router.post('/folders', createFolderPost);

router.post('/folders/:id/rename', editFolderPost);

export { router as folderRouter };
