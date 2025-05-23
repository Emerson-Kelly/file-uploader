import express from "express";
import path from "node:path";
import { fileURLToPath } from "url";
import passport from "./config/passport.js";
import session from "express-session";
//import pgSession from "connect-pg-simple";
import PrismaSessionStore from "./prisma/sessionStore.js";
import { PrismaClient } from '@prisma/client';
import { indexRouter } from "./routes/index.js";
import { usersRouter } from "./routes/signUp.js";
import { loginRouter } from "./routes/login.js";
import { signup_post } from "./controllers/usersController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
//const PgSession = pgSession(session);

const prisma = new PrismaClient();
const store = new PrismaSessionStore(prisma);

app.use(session({
    store,
    secret: 'your-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  }));

app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });

app.use("/", indexRouter);
app.use("/", usersRouter);
app.use("/", loginRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
