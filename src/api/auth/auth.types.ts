import { ApiResponse } from "@/api/axios.instance";

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
  provider: "kakao" | "naver" | "google" | string;
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
  provider: "kakao" | "naver" | "google" | string;
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


export type GooglePrecheckRequest = OAuthPrecheckRequest;
export type GooglePrecheckResponse = OAuthPrecheckResponse;
export type GoogleLoginWithPreauthRequest = OAuthLoginWithPreauthRequest;
export type GoogleLoginWithPreauthResponse = OAuthLoginWithPreauthResponse;


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

export interface InicisParams {
  mid: string;

  reqSvcCd: string;
  mTxId: string;
  authHash: string;
  flgFixedUser: string;
  userName: string;
  userPhone: string;
  userBirth: string;
  userHash: string;
  reservedMsg: string;
  directAgency: string;
  successUrl: string;
  failUrl: string;
}

export interface SaInitResponse {
  status: number;          // 200
  mid: string;             // "Thhamncoms"
  mtxId: string;           // "mtxId_..."
  reqSvcCd: string;        // "01"
  reqDateTime: string;     // "20251229091825"
  authHash: string;        // "3207..."
  reservedMsg: string;     // "isUseToken=N"
  flgFixedUser: string;    // "N" | "Y"
  authUrl: string;         // "https://stg-auth.inicis.com/api/authRequest"
  resultUrl: string;       // "https://stg-auth.inicis.com/api/authResult"
  callbackUrl: string;     // "http://34.64.175.29:9090/auth/sa/callback"
  returnUrl: string;       // "http://localhost:3000/inicis/callback"
}
