import instance from "@/api/axios.instance";
import {
  EmailCheckResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  InicisHashResponse,
  KakaoPrecheckRequest,
  KakaoPrecheckResponse,
  KakaoLoginWithPreauthRequest,
  KakaoLoginWithPreauthResponse,
  NaverPrecheckRequest,
  NaverPrecheckResponse,
  NaverLoginWithPreauthRequest,
  NaverLoginWithPreauthResponse,
} from "./auth.types";

import {
  KAKAO_REDIRECT_URI,
  KAKAO_REST_API_KEY,
  NAVER_CLIENT_ID,
  NAVER_REDIRECT_URI,
} from "@/config/config";

export async function checkEmailDuplicate(email: string): Promise<EmailCheckResponse> {
  const res = await instance.get<EmailCheckResponse>("/auth/emailCheck", {
    params: { email },
    requiresAuth: false,
  } as any);
  return res.data;
}

export async function registerUser(payload: RegisterRequest): Promise<RegisterResponse> {
  const res = await instance.post<RegisterResponse>("/auth/register", payload, {
    requiresAuth: false,
  } as any);
  return res.data;
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const res = await instance.post<LoginResponse>("/auth/login", payload, {
    requiresAuth: false,
  } as any);
  return res.data;
}

export async function logoutUser() {
  return await instance.post("/auth/logout");
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await instance.post("/auth/refresh", { refreshToken });
  return res.data;
}

export const isLoggedIn = () => !!localStorage.getItem("accessToken");

export const logout = () => {
  try {
    sessionStorage.clear();
  } catch (e) {
    // ignore
  }

  try {
    localStorage.clear();
  } catch (e) {
    // ignore
  }
};


export function buildKakaoAuthUrl(state: string) {
  return (
    `https://kauth.kakao.com/oauth/authorize?response_type=code` +
    `&client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}` +
    `&state=${state}`
  );
}

export function buildNaverLoginUrl(state: string) {
  return (
    `https://nid.naver.com/oauth2.0/authorize?response_type=code` +
    `&client_id=${NAVER_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}` +
    `&state=${state}`
  );
}

export async function kakaoPrecheck(
  authorizationCode: string,
  state: string,
  deviceId: string
): Promise<KakaoPrecheckResponse> {
  const body: KakaoPrecheckRequest = {
    authorizationCode,
    redirectUri: KAKAO_REDIRECT_URI,
    state,
    deviceId,
  };

  const res = await instance.post<KakaoPrecheckResponse>(
    "/auth/oauth/kakao/precheck",
    body,
    { requiresAuth: false } as any
  );

  return res.data;
}

export async function kakaoLoginWithPreauth(
  payload: KakaoLoginWithPreauthRequest
): Promise<KakaoLoginWithPreauthResponse> {
  const res = await instance.post<KakaoLoginWithPreauthResponse>(
    "/auth/oauth/kakao/login",
    {
      preauthToken: payload.preauthToken,
      termsAgreed: payload.termsAgreed,
      deviceId: payload.deviceId,
    },
    { requiresAuth: false } as any
  );

  return res.data;
}

export async function naverPrecheck(
  authorizationCode: string,
  state: string,
  deviceId: string
): Promise<NaverPrecheckResponse> {
  const body: NaverPrecheckRequest = {
    authorizationCode,
    redirectUri: NAVER_REDIRECT_URI,
    state,
    deviceId,
  };

  const res = await instance.post<NaverPrecheckResponse>(
    "/auth/oauth/naver/precheck",
    body,
    { requiresAuth: false } as any
  );

  return res.data;
}

export async function naverLoginWithPreauth(
  payload: NaverLoginWithPreauthRequest
): Promise<NaverLoginWithPreauthResponse> {
  const res = await instance.post<NaverLoginWithPreauthResponse>(
    "/auth/oauth/naver/login",
    {
      preauthToken: payload.preauthToken,
      termsAgreed: payload.termsAgreed,
      deviceId: payload.deviceId,
    },
    { requiresAuth: false } as any
  );

  return res.data;
}

export async function getInicisHash(
  userName: string,
  userPhone: string,
  userBirth: string
): Promise<InicisHashResponse> {
  const res = await instance.get<InicisHashResponse>("/api/auth/inicis/hash", {
    params: { userName, userPhone, userBirth },
    requiresAuth: false,
  } as any);

  return res.data;
}
