import * as http from "http";
import express from "express";
import expressCore from "express-serve-static-core";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import csrf from "csurf";
import session from "express-session";
import pgConnect from "connect-pg-simple";
import { ErrorResponse } from "../types/api";
import reactMiddleware from "./middlewares/reactMiddleware";
import userMiddleware from "./middlewares/userMiddleware";
import countDownloadsMiddleware from "./middlewares/countDownloadsMiddleware";
import HTTPError from "./helpers/HTTPError";
import configs from "./helpers/configs";
import { pool } from "./helpers/db";
import { router as apiRouter } from "./api";
import { router as pagesRouter } from "./pages";

const app = express();

app.set('trust proxy', '127.0.0.1');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use('/static', express.static('static'));
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use(require('./middlewares/webpackMiddleware').mount());
} else {
  app.use('/client.js', express.static('client.js'));
  app.use('/style.css', express.static('style.css'));
}

const pgSession = pgConnect(session);
app.use(session({
  store: new pgSession({ pool }),
  secret: configs.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
}));

app.use(csrf());
app.use(userMiddleware);
app.use(reactMiddleware);
app.use(countDownloadsMiddleware);

app.use((err: any, req: expressCore.RequestEx<any, any, any>, res: expressCore.ResponseEx<ErrorResponse>, next: expressCore.NextFunction) => {
  if(err.code === "EBADCSRFTOKEN") next(new HTTPError(400, "Bad CSRF Token"));
  else next(err);
});

app.use('/assets', express.static('assets'));
app.use('/api', apiRouter);
app.use('/', pagesRouter);

app.use((req, res, next) => {
  next(new HTTPError(404));
});

app.use((err: Partial<HTTPError>, req: expressCore.RequestEx<any, any, any>, res: expressCore.ResponseEx<ErrorResponse>, _next: expressCore.NextFunction) => {
  if(err.HTTPcode !== 404) console.error(err);
  
  const code = err.HTTPcode || 500;
  const result = {
    _error: {
      code,
      message: err.publicMessage || http.STATUS_CODES[code] || "Something Happened",
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  };
  
  if("react" in res) res.status(code).react(result);
  else res.status(code).json(result);
});

export default app;
