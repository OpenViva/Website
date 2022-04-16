import PromiseRouter from "express-promise-router";
import { IndexPageResponse } from "../../types/api";
import * as githubController from "../controllers/github";
import * as download from "./download";

export const router = PromiseRouter();

router.use("/download", download.router);

router.get<never, IndexPageResponse>('/', async (req, res) => {
  const releases = await githubController.getReleases();
  const latest = releases[0];
  
  res.react({
    latest: latest ? {
      url: latest.assets[0]?.browser_download_url || latest.html_url,
      version: latest.tag_name,
    } : null,
  });
});

