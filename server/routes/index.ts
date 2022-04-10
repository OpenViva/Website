import PromiseRouter from "express-promise-router";
import * as githubController from "../controllers/github";
import { DownloadsPageResponse, IndexPageResponse } from "./apiTypes";

export const router = PromiseRouter();

router.get('/download', async (req, res) => {
  const releases = await githubController.getReleases();
  
  res.react<DownloadsPageResponse>({
    releases,
  });
});

router.get('/', async (req, res) => {
  const releases = await githubController.getReleases();
  const latest = releases[0];
  
  res.react<IndexPageResponse>({
    latest: latest ? {
      url: latest.assets[0]?.browser_download_url || latest.html_url,
      version: latest.tag_name,
    } : null,
  });
});

