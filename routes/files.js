import express from 'express';
import { filesGet } from '../controllers/filesController.js';


const router = express.Router();

router.get("/folder/:id", filesGet);


  export { router as filesRouter };