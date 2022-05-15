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
  hcaptchaSiteKey: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  verified: boolean;
  created: number;
  admin: boolean;
  banned: boolean;
  lastLoginIp: string;
}

export enum AssetCategory {
  CHARACTER = "character",
  CLOTHING = "clothing",
}

export enum AssetSubcategory {
  UNKNOWN = "unknown",
  CHARACTER = "character",
  BLOUSE = "blouse 1",
  JACKET = "jacket",
  PANTY = "panty 1",
  SANDALS = "sandals 1",
  SWIMSUIT = "school swimsuit",
  SHIRT = "shirt 1",
  SHOE = "shoe 1",
  SKIRT = "skirt 1",
  SPATS = "spats",
  STOCKING = "stockings",
  TOWEL = "towelWrap",
  TSHIRT = "tshirt 1",
}

export enum Order {
  ASC = "asc",
  DESC = "desc",
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  file: string;
  creatorName: string;
  category: AssetCategory;
  subcategory: AssetSubcategory;
  created: number;
  approved: boolean;
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

export type AssetsPageRequest = AssetsSearchRequest;
export interface AssetsPageResponse {
  assets: Asset[];
}

export interface VerifyEmailRequest {
  token: string;
}
export interface VerifyEmailResponse {
  verified: boolean;
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
  "h-captcha-response"?: string; // eslint-disable-line @typescript-eslint/naming-convention
}
export interface LocalUserRegisterResponse {
  verified: boolean;
}

export interface LocalUserUpdateRequest {
  username?: string;
  email?: string;
  newPassword?: string;
  password: string;
}

export interface AssetsSearchRequest {
  text?: string;
  page?: number;
  pageSize?: number;
  ids?: string[];
  sort?: string;
  order?: string;
  category?: AssetCategory[];
  subcategory?: AssetSubcategory[];
  approved?: boolean;
}
export type AssetsSearchResponse = Asset[];

export interface AssetsUploadRequest {
  name: string;
  description: string;
  category: AssetCategory;
  clothing?: Express.Multer.File;
  character?: Express.Multer.File;
  skin?: Express.Multer.File;
  "h-captcha-response"?: string; // eslint-disable-line @typescript-eslint/naming-convention
}

export interface AssetUpdateRequest {
  name?: string;
  description?: string;
  approved?: boolean;
}

export interface UsersSearchRequest {
  text?: string;
  page?: number;
  pageSize?: number;
  ids?: string[];
  sort?: string;
  order?: string;
  banned?: boolean;
  verified?: boolean;
}
export type UsersSearchResponse = User[];

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  password?: string;
  banned?: boolean;
  verified?: boolean;
  admin?: boolean;
}
