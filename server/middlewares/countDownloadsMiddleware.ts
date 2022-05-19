import PromiseRouter from "express-promise-router";
import * as assetsController from "../controllers/assets";

const router = PromiseRouter();

interface Params {
  id: string;
  file: string;
}

router.get<Params, any, any>('/assets/:id/:file', async (req, res, next) => {
  try {
    if(req.params.file !== "thumbnail.jpg") await assetsController.incDownloads(req.params.id);
  } catch(e) {
    console.log(e);
  }
  
  next();
});

export default router;
