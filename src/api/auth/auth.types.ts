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
  email?: string;
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
  accountType?: string;
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
  saToken?: string;
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
  gender:string;
  
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
  txId: string;           // "mtxId_..."
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

export interface SaConfirmRequest {
  txId: string;
  purpose?: string;
}

export interface SaConfirmResponse {
  status: number;     // 200
  verified: boolean;  // true
  message: string;    // "OK"
  saToken: string;
  ci: string;
  userName: string;
  userPhone: string;
  userBirth: string;
  userSex: string;    // 
}

// auth.types.ts

export interface FindIdRequest {
  ci: string;
}

export interface FindIdAccount {
  userId: string;
  email: string;
  accountType: string;
}

export interface FindIdResponse {
  code: number;
  accounts: FindIdAccount[];
}

// auth.types.ts

export interface IssueTempPasswordRequest {
  userId: string;
  ci: string;
}

export interface IssueTempPasswordResponse {
  code: number;              // 200 or 500 ...
  msg: string;               // "TEMP_PASSWORD_ISSUED" | "INTERNAL_SERVER_ERROR" ...
  userIdx?: number;          // 성공 시
  tempPassword?: string;     // 성공 시
  message?: string;          // 실패 시(서버가 내려주는 경우)
}

export interface MyInfo {
  birthdate:string;
  gender:string;
  idx: string;
  phone:string;
  userId: string;
  userName: string;
  ciHash: string;
  accountType?: string;
  ciVerified?: boolean;
}

export interface FetchMyInfoResponse {
  code: number; // 200
  user: MyInfo;
}

/**
 * 생년월일 변환1
 * "YYYYMMDD" → "YYYY.MM.DD"
 * 예) "19981002" → "1998.10.02"
 */
export function formatBirthdate(yyyymmdd?: string): string {
  if (!yyyymmdd) return "";

  // 숫자 8자리인지 체크
  if (!/^\d{8}$/.test(yyyymmdd)) return "";

  const year = yyyymmdd.slice(0, 4);
  const month = yyyymmdd.slice(4, 6);
  const day = yyyymmdd.slice(6, 8);

  return `${year}.${month}.${day}`;
}

export interface UpdateUserRequest {
  userIdx: number;
  phone?: string;
  userName?: string;
  birthdate?: string;
  gender?: "M" | "W";
  certified?: boolean;

  // 선택으로 변경
  email?: string;
  newPassword?: string;
  oldPassword?: string;
}

export interface UpdateUserResponse {
  code: number;
  msg: string;
  userIdx?: number | string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  result?: "SUCCESS";
  code?: number;
  msg?: string;
  reasonCode?: string;
}

export interface WithdrawUserResponse {
  code: number;
  msg: string;
}