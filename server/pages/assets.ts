import PromiseRouter from "express-promise-router";
import { AssetCategory, AssetsPageRequest, AssetsPageResponse, AssetSubcategory, Order } from "../../types/api";
import { checkArray, checkNumber, checkString } from "../helpers/utils";
import * as assetsController from "../controllers/assets";
import HTTPError from "../helpers/HTTPError";

export const router = PromiseRouter();

router.get<never, AssetsPageResponse, AssetsPageRequest>('/', async (req, res) => {
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
  
  res.react({
    assets,
  });
});
