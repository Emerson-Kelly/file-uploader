import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
//import passport from './config/passport.js';
import session from 'express-session';
//import pgSession from "connect-pg-simple";
//import { pool } from "./db/pool.js";
import { indexRouter } from './routes/index.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));


app.use('/', indexRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
