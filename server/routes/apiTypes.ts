import { Releases } from "../controllers/github";

export { Releases };

export interface ErrorResponse {
  error: {
    code: number;
    message: string;
    stack?: string;
  };
}

export interface IndexPageResponse {
  latest: {
    version: string;
    url: string;
  } | null;
}

export interface DownloadsPageResponse {
  releases: Releases | null;
}
