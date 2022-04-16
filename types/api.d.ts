import { Releases } from "../server/controllers/github";

export { Releases };


/////////////////////////
//       Commons       //
/////////////////////////

export interface ErrorResponse {
  _error: {
    code: number;
    message: string;
    stack?: string;
  };
}

export interface InitialData {
  _csrf: string;
}

export interface JustId {
  id: string;
}

export interface Config {

}


/////////////////////////
//        Pages        //
/////////////////////////

export interface IndexPageResponse {
  latest: {
    version: string;
    url: string;
  } | null;
}

export interface DownloadsPageResponse {
  releases: Releases | null;
}


/////////////////////////
//         API         //
/////////////////////////
