import { FileNode } from "@/types";

export interface accountData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string|null;
  bio: string|null;
}

export interface loginRequest {
  emailOrPhone: string;
  password: string;
}



export interface userState {
  accountData: accountData | null;
  bearerToken: string | null;
  fileNodes: FileNode[] | null;
  setAccountData: (accountData: accountData | null) => void;
  setBearerToken: (bearerToken: string | null) => void;
  setFileNodes: (fileNodes: FileNode[] | null) => void;
}
export interface userProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
  nickname: string;
  bio: string|null;
  password: string|null;
}

/**
 * Refresh token object
 */
export interface refreshTokenObject {
  accessToken: string;
  refreshToken: string;
}

/**
 * Refreshed response object
 */

export interface refreshedResponseObject {
  token: string;
  refreshToken: string;
  user: accountData;
}