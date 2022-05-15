import PromiseRouter from "express-promise-router";
import { VerifyEmailRequest, VerifyEmailResponse } from "../../types/api";
import * as usersController from "../controllers/users";

export const router = PromiseRouter();

router.get<never, VerifyEmailResponse, VerifyEmailRequest>('/', async (req, res) => {
  console.log(req.query);
  const verified = await usersController.verifyEmail(req.query.token);
  
  res.react({
    verified,
  });
});
