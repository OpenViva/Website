import { Octokit } from "@octokit/core";
import { Endpoints } from "@octokit/types/dist-types/generated/Endpoints";

export type Releases = Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'];

const CACHE_LIFETIME = 5 * 60 * 1000; // 5 min

const octokit = new Octokit();

const versionsCache = {
  releases: null as Releases | null,
  time: 0,
};

export async function getReleases() {
  if(versionsCache.releases && versionsCache.time - Date.now() < CACHE_LIFETIME) return versionsCache.releases;
  
  const releases = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: 'OpenViva',
    repo: 'OpenViva',
    per_page: 100, // eslint-disable-line @typescript-eslint/naming-convention
    mediaType: { format: 'html' },
  });
  
  versionsCache.releases = releases.data;
  versionsCache.time = Date.now();
  
  return releases.data;
}
