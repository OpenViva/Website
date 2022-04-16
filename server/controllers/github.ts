import SQL from "sql-template-strings";
import { Octokit } from "@octokit/core";
import { Endpoints } from "@octokit/types/dist-types/generated/Endpoints";
import configs from "../helpers/configs";
import db from "../helpers/db";
import HTTPError from "../helpers/HTTPError";

export type Releases = Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'];

const octokit = new Octokit();

interface ReleasesCache {
  releases: Releases;
  created: number;
}

export async function getReleases() {
  const cache = await db.queryFirst<ReleasesCache>(SQL`
    SELECT
      releases,
      from_timestamp_ms(created) as created
    FROM releases_cache
  `);
  
  if(cache && Date.now() - cache.created < configs.github.cacheLifeMs) return cache.releases;
  
  const response = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: configs.github.owner,
    repo: configs.github.repo,
    per_page: 100, // eslint-disable-line @typescript-eslint/naming-convention
    mediaType: { format: 'html' },
  });
  
  const releases = response.data;
  const releasesJSON = JSON.stringify(releases);
  
  await db.query(SQL`
    INSERT INTO releases_cache(releases, created)
    VALUES (${releasesJSON}, NOW())
    ON CONFLICT (id)
    DO UPDATE SET
      releases = ${releasesJSON},
      created = NOW()
  `);
  
  return releases;
}
