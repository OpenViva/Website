import PromiseRouter from "express-promise-router";
import { AssetsPageResponse } from "../../types/api";

export const router = PromiseRouter();

router.get<never, AssetsPageResponse>('/', async (req, res) => {
  res.react({});
});
