import PromiseRouter from "express-promise-router";
import multer from "multer";
import { RequestHandlerEx } from "express-serve-static-core";
import { AssetCategory, AssetsSearchRequest, AssetsSearchResponse, AssetSubcategory, AssetsUploadRequest, AssetUpdateRequest, JustId, Order } from "../../types/api";
import { checkArray, checkBoolean, checkNumber, checkString } from "../helpers/utils";
import * as assetsController from "../controllers/assets";
import HTTPError from "../helpers/HTTPError";
import captchaMiddleware from "../middlewares/captchaMiddleware";

export const router = PromiseRouter();

router.patch<JustId, Empty, AssetUpdateRequest>("/:id", async (req, res) => {
  if(!req.user?.admin) throw new HTTPError(403);
  
  const name = checkString(req.body.name, "name", { min: 0, max: 32, trim: true, required: false });
  const description = checkString(req.body.description, "description", { min: 0, max: 512, trim: true, required: false });
  const approved = checkBoolean(req.body.approved, "approved", { required: false });
  
  await assetsController.update(req.params.id, { name, description, approved });
  
  res.json({});
});

router.post<never, JustId, AssetsUploadRequest>("/", multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 2,
    fields: 10,
  },
}).fields([
  { name: 'clothing', maxCount: 1 },
  { name: 'character', maxCount: 1 },
  { name: 'skin', maxCount: 1 },
]) as RequestHandlerEx, captchaMiddleware, async (req, res) => {
  if(!req.user) throw new HTTPError(401);
  if(req.user?.banned) throw new HTTPError(403, "You are banned");
  
  const name = checkString(req.body.name, "name", { min: 0, max: 32, trim: true });
  const description = checkString(req.body.description, "description", { min: 0, max: 512, trim: true, required: false }) || "";
  const category = checkString(req.body.category, "category", { trim: true, oneOf: Object.values(AssetCategory) }) as AssetCategory;
  const creator = req.user?.id;
  const baseUrl = req.protocol + '://' + req.get('host');
  const files: Dict<Express.Multer.File> = {};
  
  for(const [key, value] of Object.entries(req.files!)) {
    files[key] = value[0];
  }
  
  if(category === AssetCategory.CHARACTER) {
    if(!files.character) throw new HTTPError(400, "Character card must be included for character asset");
    if(!files.skin) throw new HTTPError(400, "Skin card must be included for character asset");
  } else if(category === AssetCategory.CLOTHING) {
    if(!files.clothing) throw new HTTPError(400, "Clothing card must be included for character asset");
  } else {
    throw new HTTPError(501);
  }
  
  const id = await assetsController.create({ name, description, category, creator, baseUrl }, files);
  
  res.json({ id });
});

router.delete<JustId, Empty>("/:id", async (req, res) => {
  if(!req.user?.admin) throw new HTTPError(403);
  
  await assetsController.remove(req.params.id);
  
  res.json({});
});

router.get<never, AssetsSearchResponse, AssetsSearchRequest>("/", async (req, res) => {
  const text = checkString(req.query.text, "text", { required: false, min: 0, max: 512, trim: true });
  const page = checkNumber(req.query.page, "page", { required: false, min: 0, max: 100 });
  const pageSize = checkNumber(req.query.pageSize, "pageSize", { required: false, min: 0, max: 20 });
  const ids = checkArray(req.query.ids, "ids", {
    max: 20,
    checkInner: (id, name) => checkString(id, name, { max: 50, trim: true }),
  });
  const sort = checkString(req.query.sort, "sort", { required: false, trim: true, oneOf: assetsController.sortColumns });
  const order = checkString(req.query.order, "order", { required: false, trim: true, oneOf: Object.values(Order) });
  const category = checkArray(req.query.category, "category", {
    max: 20,
    checkInner: (id, name) => checkString(id, name, { oneOf: Object.values(AssetCategory) }) as AssetCategory,
  });
  const subcategory = checkArray(req.query.subcategory, "category", {
    max: 20,
    checkInner: (id, name) => checkString(id, name, { oneOf: Object.values(AssetSubcategory) }) as AssetSubcategory,
  });
  const approved = !req.query.approved || req.query.approved === true || req.query.approved as any === "true";
  
  if(!approved && !req.user?.admin) throw new HTTPError(403);
  
  const assets = await assetsController.search({ text, page, pageSize, ids, sort, order, category, subcategory, approved });
  
  res.json(assets);
});
