// src/api/axios.instance.ts
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { API_BASE_URL } from "@/config/config";
import { logout } from "./auth/auth.api";

// ======================================
// axios 타입 확장: requiresAuth, _retry 추가
//  - AxiosRequestConfig: 실제 instance.get/post 쓸 때
//  - InternalAxiosRequestConfig: 인터셉터 내부에서 사용
// ======================================
declare module "axios" {
  export interface AxiosRequestConfig {
    baseURL?: string;        
    requiresAuth?: boolean;
    _retry?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    requiresAuth?: boolean;
    _retry?: boolean;
  }
}
const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Access Token 가져오는 함수
export const getAccessToken = () => sessionStorage.getItem("accessToken")??localStorage.getItem("accessToken");

//  Refresh Token 가져오기
export const getRefreshToken = () => sessionStorage.getItem("refreshToken")??localStorage.getItem("refreshToken");

// =======================
// 공통 베이스 응답
// =======================
export interface ApiBaseResponse {
  code: number; // 200, 400, 500 ...
  msg?: string; // "OK", "BAD_REQUEST" 등
  [key: string]: any; // 유동적인 필드 허용
}

// 제네릭 응답 래퍼: 공통 + 각 API별 추가 필드
export type ApiResponse<T = unknown> = ApiBaseResponse & T;

// =======================
// 공통 에러 응답 타입 (단순화)
//  - 서버에서 내려주는 code, msg만 쓰자
// =======================
export interface ApiErrorResponse {
  code: number;
  msg: string;
  raw?: any; // AxiosError 원본 (디버깅용)
}


instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requiresAuth =
      config.requiresAuth === undefined ? true : config.requiresAuth;
    if (requiresAuth) {
      const token = getAccessToken();

      if (token) {
        if (!config.headers) {
          config.headers = {} as AxiosRequestHeaders;
        }
        (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
      } else {
        console.warn("🚫 토큰이 없어서 로그아웃 처리합니다.");

        return Promise.reject({
          code: 999,
          msg: "NO_TOKEN",
        });
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// 응답 인터셉터
//  - 401이면 (requiresAuth=true인 경우에만) refresh 시도 후 재요청
//  - 실패 시 ApiErrorResponse 형태로 변환해서 reject
// =======================
instance.interceptors.response.use(
  (res) => res,
  async (error: any) => {
    if (!error.response) {
      if (error.code && error.msg) {
        return Promise.reject(error as ApiErrorResponse);
      }

      // 그 외는 공통 포맷으로 감싸기
      const apiError: ApiErrorResponse = {
        code: 999,                       
        msg: "TOKEN_REFRESH_FAILED",    
                     
      };
      return Promise.reject(apiError);
    }

    const axiosError = error as AxiosError;
    const originalRequest = axiosError.config as InternalAxiosRequestConfig;
    const res = axiosError.response!;
    const status = res.status;
 
    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      originalRequest.requiresAuth !== false
    ) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      console.log('리프래시',refreshToken);

      if (!refreshToken) {
        console.log('여기로들어옴',refreshToken);
        const apiError: ApiErrorResponse = {
          code: 999,                       
          msg: "TOKEN_REFRESH_FAILED",    
                       
        };
        return Promise.reject(apiError);
      }
    
      console.log('api전송 ');
      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log('토큰갱신 성공');
        const newAccessToken = (refreshResponse.data as any).token;
        const newRefreshToken = (refreshResponse.data as any).refreshToken;
        localStorage.setItem("accessToken",newAccessToken);
        localStorage.setItem("refreshToken",newRefreshToken);
        console.log('토근교체 성공');

        if (!originalRequest.headers) {
          originalRequest.headers = {} as AxiosRequestHeaders;
        }
        (originalRequest.headers as AxiosRequestHeaders).Authorization =
          `Bearer ${newAccessToken}`;
          console.log('api전송 ',refreshResponse);
        return instance(originalRequest);
   
      } catch (refreshError) {
        console.log("api전송", refreshError);

        const refreshErrorMessage =
          refreshError?.response?.data?.message ??
          refreshError?.response?.data?.msg ??
          refreshError?.message ??
          "TOKEN_REFRESH_FAILED";
          
        const apiError: ApiErrorResponse = {
          code: 999,
          msg: refreshErrorMessage,
          raw: refreshError,
        };
        return Promise.reject(apiError);
      }
    }

    // 3️⃣ 서버가 준 에러 포맷을 공통 ApiErrorResponse로 변환
    const data = res.data as any;

    const apiError: ApiErrorResponse = {
      code: data?.code ?? res.status ?? 500,
      msg: data?.msg ?? "UNKNOWN_ERROR",
      raw: axiosError,
    };

    return Promise.reject(apiError);
  }
);


export default instance;
