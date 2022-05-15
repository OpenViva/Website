import PromiseRouter from "express-promise-router";
import { LocalUserLoginRequest, LocalUserLoginResponse, LocalUserPatchRequest, LocalUserRegisterRequest, User } from "../../types/api";
import * as usersController from "../controllers/users";
import { checkString } from "../helpers/utils";
import HTTPError from "../helpers/HTTPError";
import captchaMiddleware from "../middlewares/captchaMiddleware";

export const router = PromiseRouter();

router.post<never, Empty>("/logout", async (req, res) => {
  req.session.userId = null;
  
  res.json({});
});

router.post<never, LocalUserLoginResponse, LocalUserLoginRequest>("/login", async (req, res) => {
  const email = checkString(req.body.email, "email", { trim: true, lowercase: true });
  const password = checkString(req.body.password, "password", {});
  
  const user = await usersController.login(email, password);
  req.session.userId = user.id;
  
  res.json(user);
});

router.post<never, Empty, LocalUserRegisterRequest>("/register", captchaMiddleware, async (req, res) => {
  const email = checkString(req.body.email, "email", { max: 50, trim: true, lowercase: true });
  const username = checkString(req.body.username, "username", { max: 50, trim: true });
  const password = checkString(req.body.password, "password", { min: 6 });
  
  await usersController.register({ username, password, email });
  
  res.json({});
});

router.patch<never, User, LocalUserPatchRequest>("/", async (req, res) => {
  if(!req.user) throw new HTTPError(401);
  
  const username = checkString(req.body.username, "username", { max: 50, trim: true, required: false });
  const email = checkString(req.body.email, "email", { max: 50, trim: true, required: false, lowercase: true });
  const newPassword = checkString(req.body.newPassword, "newPassword", { min: 6, required: false });
  const password = checkString(req.body.password, "password");
  
  await usersController.checkPassword(req.user.id, password);
  await usersController.update(req.user.id, { username, email, password: newPassword });
  const user = await usersController.get(req.user.id);
  
  res.json(user!);
});

router.get<never, User>("/", async (req, res) => {
  if(!req.user) throw new HTTPError(401);
  
  res.json(req.user);
});
