import { ApiResponse } from "./axios.instance";

export interface LoginRequest {
  userId: string;
  password: string;
  deviceId: string;
}

export interface LoginUser {
  userName: string;
  userIdx: number;
  userId: string;
}

export interface LoginResponse {
  code: number;
  tokenType: string;
  user: LoginUser;
  token: string;
  refreshToken: string;
}

export interface EmailCheckResponse {
  code: number;
  check: boolean;
  msg: string;
}

export interface RegisterRequest {
  userId: string;
  password: string;
  userName: string;
  ci: string;
  ciProvider: string;
  realName: string;
  birthdate: string;
  gender: string;
  phone: string;
  email: string;
}

export type RegisterResponse = ApiResponse<{
  userIdx: number;
}>;

export type OAuthPrecheckRequest = {
  authorizationCode: string;
  redirectUri: string;
  state: string;
  deviceId: string;
};

export type OAuthPrecheckProfile = {
  email?: string;
  name?: string;
};

export type OAuthPrecheckResponse = {
  code: number;
  provider: "kakao" | "naver" | string;
  exists: boolean;
  needTerms: boolean;
  suggestedUserId?: string;
  profile?: OAuthPrecheckProfile;
  providerUid?: string;
  preauthToken: string;
  msg?: string;
};

export type OAuthLoginWithPreauthRequest = {
  preauthToken: string;
  termsAgreed: boolean;
  deviceId: string;
};

export type OAuthLoginWithPreauthResponse = {
  code: number;
  provider: "kakao" | "naver" | string;
  linked: boolean;
  msg: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    idx: number;
    userId: string;
    userName: string;
    email: string | null;
  };
};

export type KakaoPrecheckRequest = OAuthPrecheckRequest;
export type KakaoPrecheckResponse = OAuthPrecheckResponse;
export type KakaoLoginWithPreauthRequest = OAuthLoginWithPreauthRequest;
export type KakaoLoginWithPreauthResponse = OAuthLoginWithPreauthResponse;

export type NaverPrecheckRequest = OAuthPrecheckRequest;
export type NaverPrecheckResponse = OAuthPrecheckResponse;
export type NaverLoginWithPreauthRequest = OAuthLoginWithPreauthRequest;
export type NaverLoginWithPreauthResponse = OAuthLoginWithPreauthResponse;

export interface InicisHashRequest {
  userName: string;
  userPhone: string;
  userBirth: string;
}

export interface InicisHashResponse {
  mid: string;
  mTxId: string;
  authHash: string;
  userHash: string;
  reqSvcCd: string;
}

export interface VerifiedUserInfo {
  name: string;
  phone: string;
  birth: string;
  ci: string;
}
