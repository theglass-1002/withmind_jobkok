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
  GooglePrecheckRequest,
  GooglePrecheckResponse,
  GoogleLoginWithPreauthRequest,
  GoogleLoginWithPreauthResponse,
  SaInitResponse,
  SaConfirmResponse,
  SaConfirmRequest,
  FindIdResponse,
  FindIdRequest,
  IssueTempPasswordResponse,
  IssueTempPasswordRequest,
  FetchMyInfoResponse,
} from "./auth.types";

import {
  KAKAO_REDIRECT_URI,
  KAKAO_REST_API_KEY,
  NAVER_CLIENT_ID,
  NAVER_REDIRECT_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
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
  } catch (_) {}

  try {
    localStorage.clear();
  } catch (_) {}
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

export function buildGoogleAuthUrl(state: string) {
  const scope = encodeURIComponent("openid email profile");
  return (
    `https://accounts.google.com/o/oauth2/v2/auth?response_type=code` +
    `&client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
    `&scope=${scope}` +
    `&include_granted_scopes=true` +
    `&access_type=offline` +
    `&prompt=consent` +
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

export async function googlePrecheck(
  authorizationCode: string,
  state: string,
  deviceId: string
): Promise<GooglePrecheckResponse> {
  const body: GooglePrecheckRequest = {
    authorizationCode,
    redirectUri: GOOGLE_REDIRECT_URI,
    state,
    deviceId,
  };

  const res = await instance.post<GooglePrecheckResponse>(
    "/auth/oauth/google/precheck",
    body,
    { requiresAuth: false } as any
  );

  return res.data;
}

export async function googleLoginWithPreauth(
  payload: GoogleLoginWithPreauthRequest
): Promise<GoogleLoginWithPreauthResponse> {
  const res = await instance.post<GoogleLoginWithPreauthResponse>(
    "/auth/oauth/google/login",
    {
      preauthToken: payload.preauthToken,
      termsAgreed: payload.termsAgreed,
      deviceId: payload.deviceId,
    },
    { requiresAuth: false } as any
  );

  return res.data;
}



//https://api.jobkok.kr/auth/sa/init

export async function saInit(): Promise<SaInitResponse> {
  const res = await instance.post<SaInitResponse>(
    "/auth/sa/init",
    {}, // body
    { requiresAuth: false } as any // config
  );
  return res.data;
}

export async function saConfirm(txId: string): Promise<SaConfirmResponse> {
  const body: SaConfirmRequest = { txId };

  const res = await instance.post<SaConfirmResponse>(
    "/auth/sa/confirm",
    body,
    {
      requiresAuth: false,
      // X-API-Key가 필요하면 여기서 주입 가능
      // headers: { "X-API-Key": import.meta.env.VITE_SA_API_KEY ?? "" },
    } as any
  );

  return res.data;
}

export async function findIdByCi(ci: string): Promise<FindIdResponse> {
  const body: FindIdRequest = { ci };

  const res = await instance.post<FindIdResponse>(
    "/auth/find-id",
    body,
    { requiresAuth: false } as any
  );

  return res.data;
}


export async function issueTempPasswordLocal(
  userId: string,
  ci: string
): Promise<IssueTempPasswordResponse> {
  const body: IssueTempPasswordRequest = { userId, ci };

  const res = await instance.post<IssueTempPasswordResponse>(
    "/auth/password/issue-temp-local",
    body,
    {
      requiresAuth: false,
      // headers: { "X-API-Key": import.meta.env.VITE_SA_API_KEY ?? "" },
    } as any
  );

  return res.data;
}

/**
 * 내 정보 가져오기
 * GET /api/user/me
 */
export async function fetchMyInfo(): Promise<FetchMyInfoResponse> {
  const res = await instance.get<FetchMyInfoResponse>(
    "/api/user/me",
  );

  return res.data;
}

// export async function getInicisHash(
//   userName: string,
//   userPhone: string,
//   userBirth: string
// ): Promise<InicisHashResponse> {
//   const res = await instance.get<InicisHashResponse>("/api/auth/inicis/hash", {
//     params: { userName, userPhone, userBirth },
//     requiresAuth: false,
//   } as any);

//   return res.data;
// }
