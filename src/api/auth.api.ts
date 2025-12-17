
// auth.api.ts
import instance from "@/api/axios.instance";

import {
  EmailCheckResponse,
  KakaoOauthLoginRequest,
  KakaoOauthLoginResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./auth.types";
import { API_BASE_URL, KAKAO_REDIRECT_URI, KAKAO_REST_API_KEY, NAVER_CLIENT_ID, NAVER_REDIRECT_URI } from "@/config/config";




//이메일 중복확인
export async function checkEmailDuplicate(email: string): Promise<EmailCheckResponse> {
  const res = await instance.get<EmailCheckResponse>("/auth/emailCheck", {
    params: { email },
    requiresAuth: false,
  });
  
  return res.data;
}

//회원가입
export async function registerUser(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const res = await instance.post<RegisterResponse>("/auth/register", payload,{
    requiresAuth:false
  });
  return res.data;
}

// 로그인
export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const res = await instance.post<LoginResponse>("/auth/login", payload,{
   requiresAuth: false});
  return res.data;
}

// 로그아웃
export async function logoutUser() {
  return await instance.post("/auth/logout");
}

// accessToken 재발급
export async function refreshAccessToken(refreshToken: string) {
  const res = await instance.post("/auth/refresh", { refreshToken });
  return res.data;
}

// 로그인 여부 체크
export const isLoggedIn = () => {
  return !!localStorage.getItem("accessToken");
};

// 로그아웃
export const logout = () => {
 // 세션 스토리지
 sessionStorage.removeItem("accessToken");
 sessionStorage.removeItem("refreshToken");
 sessionStorage.removeItem("userName");
 sessionStorage.removeItem("userId");
 sessionStorage.removeItem("userIdx");

 localStorage.removeItem("accessToken");
 localStorage.removeItem("refreshToken");
 localStorage.removeItem("userName");
 localStorage.removeItem("userId");
 localStorage.removeItem("userIdx");
};



// ----------------------
// 1) 카카오 로그인 URL 생성
// ----------------------
export function buildKakaoAuthUrl(state: string) {
  return (
    `https://kauth.kakao.com/oauth/authorize?response_type=code` +
    `&client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}` +
    `&state=${state}`
  );
}

// ----------------------
// 1) 네이버 로그인 URL 생성
// ----------------------
export function buildNaverLoginUrl(state: string) {
  return (
    `https://nid.naver.com/oauth2.0/authorize?response_type=code` +
    `&client_id=${NAVER_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}` +
    `&state=${state}`
  );
}



export async function loginWithKakao(code: string, state: string , deviceId:string) {
const body = JSON.stringify({
    authorizationCode: code,
    state: state,
    redirectUri: KAKAO_REDIRECT_URI,
    deviceId: deviceId
  });

  const res = await fetch(`${API_BASE_URL}/auth/oauth/kakao/precheck`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body,
  });
  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    throw new Error(`카카오 토큰 실패: ${res.status} / ${res}`);
  }

  console.log("카카오 토큰 응답:", res);
  return {
    kakaoToken: data,
  };
}

export async function kakaoOauthLogin(
  payload: KakaoOauthLoginRequest
): Promise<KakaoOauthLoginResponse> {
  const body = {
    authorizationCode: payload.authorizationCode,
    redirectUri: KAKAO_REDIRECT_URI,
    deviceId: payload.deviceId,
  };

  const res = await instance.post<KakaoOauthLoginResponse>(
    "/auth/oauth/kakao/login",
    body,
    { requiresAuth: false } as any
  );
  console.log(res);

  console.log('보낸값',body);
  return res.data;
}




