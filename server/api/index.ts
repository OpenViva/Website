import http from "http";
import PromiseRouter from "express-promise-router";
import expressCore from "express-serve-static-core";
import HTTPError from "../helpers/HTTPError";
import { ErrorResponse } from "../../types/api";
import * as localUser from "./localUser";
import * as assets from "./assets";
import * as users from "./users";

export const router = PromiseRouter();

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'max-age=0, no-store');
  
  next();
});

router.use("/localUser", localUser.router);
router.use("/assets", assets.router);
router.use("/users", users.router);

router.use((req, res, next) => {
  next(new HTTPError(404));
});

router.use((err: Partial<HTTPError>, req: expressCore.RequestEx<any, any, any>, res: expressCore.ResponseEx<ErrorResponse>, _next: expressCore.NextFunction) => {
  if(err.HTTPcode !== 404) console.error(err);
  
  const code = err.HTTPcode || 500;
  const result = {
    _error: {
      code,
      message: err.publicMessage || http.STATUS_CODES[code] || "Something Happened",
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  };
  res.status(code).json(result);
});
