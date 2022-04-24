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
  _config: Config;
  _user: User | null;
}

export interface JustId {
  id: string;
}

export interface Config {
  discordInvite: string;
  contactEmailBase64: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  confirmed: boolean;
  created: number;
}

export enum AssetCategory {
  CHARACTER = "character",
  CLOTHING = "clothing",
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

export interface AssetsPageResponse {

}

/////////////////////////
//         API         //
/////////////////////////

export type LocalUserResponse = User | null;

export interface LocalUserLoginRequest {
  email: string;
  password: string;
}

export type LocalUserLoginResponse = User;

export interface LocalUserRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LocalUserPatchRequest {
  username?: string;
  email?: string;
  newPassword?: string;
  password: string;
}
