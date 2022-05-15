import PromiseRouter from "express-promise-router";
import { JustId, Order, UsersSearchRequest, UsersSearchResponse, UserUpdateRequest } from "../../types/api";
import { checkArray, checkBoolean, checkNumber, checkString } from "../helpers/utils";
import * as usersController from "../controllers/users";
import HTTPError from "../helpers/HTTPError";

export const router = PromiseRouter();


router.patch<JustId, Empty, UserUpdateRequest>("/:id", async (req, res) => {
  if(!req.user?.admin) throw new HTTPError(403);
  
  const username = checkString(req.body.username, "username", { max: 50, trim: true, required: false });
  const email = checkString(req.body.email, "email", { max: 50, trim: true, required: false, lowercase: true });
  const password = checkString(req.body.password, "password", { required: false });
  const admin = checkBoolean(req.body.admin, "admin", { required: false });
  const verified = checkBoolean(req.body.verified, "verified", { required: false });
  const banned = checkBoolean(req.body.banned, "banned", { required: false });
  
  await usersController.update(req.params.id, { username, email, password, admin, verified, banned });
  
  res.json({});
});

router.get<never, UsersSearchResponse, UsersSearchRequest>("/", async (req, res) => {
  if(!req.user?.admin) throw new HTTPError(403);
  
  const text = checkString(req.query.text, "text", { required: false, min: 0, max: 512, trim: true });
  const page = checkNumber(req.query.page, "page", { required: false, min: 0, max: 100 });
  const pageSize = checkNumber(req.query.pageSize, "pageSize", { required: false, min: 0, max: 50 });
  const ids = checkArray(req.query.ids, "ids", {
    max: 20,
    checkInner: (id, name) => checkString(id, name, { max: 50, trim: true }),
  });
  const sort = checkString(req.query.sort, "sort", { required: false, trim: true, oneOf: usersController.sortColumns });
  const order = checkString(req.query.order, "order", { required: false, trim: true, oneOf: Object.values(Order) });
  const banned = checkBoolean(req.query.banned, "banned", { required: false });
  const verified = checkBoolean(req.query.verified, "verified", { required: false });
  
  const users = await usersController.search({ text, page, pageSize, ids, sort, order, banned, verified });
  
  res.json(users);
});
