import express from 'express';
import { folderGet } from '../controllers/folderController.js';


const router = express.Router();

router.get("/folder/:id", folderGet);


  export { router as folderRouter };