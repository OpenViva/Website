import PromiseRouter from "express-promise-router";
import { DownloadsPageResponse } from "../../types/api";
import * as githubController from "../controllers/github";

export const router = PromiseRouter();

router.get<never, DownloadsPageResponse>('/', async (req, res) => {
  const releases = await githubController.getReleases();
  
  res.react({
    releases,
  });
});
