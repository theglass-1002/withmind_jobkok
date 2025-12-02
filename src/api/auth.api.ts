import axios from "axios";
import { API_BASE_URL,KAKAO_REST_API_KEY,KAKAO_REDIRECT_URI,NAVER_CLIENT_ID,NAVER_REDIRECT_URI } from "@/config/config";

// 회원가입 API
// 로그인 API
// 로그아웃 API
// accessToken 재발급
// 카카오 로그인
// 네이버 로그인
// Apple 로그인
// 이니시스 본인인증(precheck)
// 비밀번호 재설정 인증


//이메일 중복확인
export interface EmailCheckResponse {
    code: number;
    check: boolean;
    msg: string;
  }
  
  export async function checkEmailDuplicate(email: string): Promise<EmailCheckResponse> {
    const res = await axios.get<EmailCheckResponse>(
      `${API_BASE_URL}/auth/emailCheck`,
      {
        params: { email }, // 
        headers: {
            "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  }



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

export interface RegisterResponse {
  code: number;
  msg: string;
  data?: any;
}


export async function registerUser(data?: RegisterRequest): Promise<RegisterResponse> {
  const config = {
    method: "post" as const,
    url: `${API_BASE_URL}/auth/register`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };

  console.log("보내는 요청:", config);

  const res = await axios.request<RegisterResponse>(config);

  console.log("응답:", res.data);

  return res.data;
}
