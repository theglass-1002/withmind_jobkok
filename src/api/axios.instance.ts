import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { API_BASE_URL } from "@/config/config";
import { logout } from "./auth/auth.api";

declare module "axios" {
  export interface AxiosRequestConfig {
    baseURL?: string;
    requiresAuth?: boolean;
    _retry?: boolean;
    tokenType?: "user" | "company";
    _startTime?: number;
  }
  export interface InternalAxiosRequestConfig {
    requiresAuth?: boolean;
    _retry?: boolean;
    tokenType?: "user" | "company";
    _startTime?: number;
  }
}

// ═══ 잡콕 이벤트 추적 (전체 자동 수집) ═══
const _eventQueue: any[] = [];

// window 객체에 _eventQueue 노출 (Layout에서 PAGE_VIEW 추적용)
declare global {
  interface Window {
    _eventQueue: any[];
  }
}
window._eventQueue = _eventQueue;

// ⑤ 10초마다 배치 전송 + 페이지 떠날 때 전송
function _flushEvents() {
  if (_eventQueue.length === 0) return;
  navigator.sendBeacon(
    '/_debug/tracking/api/events',
    new Blob([JSON.stringify(_eventQueue.splice(0))], { type: 'application/json' })
  );
}

setInterval(_flushEvents, 10000);
window.addEventListener('beforeunload', _flushEvents);

// ③ 버튼 클릭 자동 수집 (이벤트 위임 — 모든 button/a 태그)
document.addEventListener('click', (e) => {
  const el = (e.target as Element).closest('button, a, [data-track]');
  if (!el) return;
  const label = el.getAttribute('data-track')
    || el.getAttribute('aria-label')
    || (el as HTMLElement).innerText?.trim().substring(0, 50)
    || el.tagName;
  _eventQueue.push({
    type: 'CLICK',
    url: window.location.pathname,
    meta: label,
    timestamp: Date.now()
  });
});

// ④ JS 에러 자동 수집
window.addEventListener('error', (e) => {
  _eventQueue.push({
    type: 'JS_ERROR',
    url: e.filename || window.location.pathname,
    errorMessage: e.message + (e.lineno ? ` (line ${e.lineno})` : ''),
    timestamp: Date.now()
  });
});

window.addEventListener('unhandledrejection', (e) => {
  _eventQueue.push({
    type: 'JS_ERROR',
    url: window.location.pathname,
    errorMessage: String((e.reason as any)?.message || e.reason || 'Unhandled Promise'),
    timestamp: Date.now()
  });
});

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 일반 회원 토큰
export const getAccessToken = () =>
  sessionStorage.getItem("accessToken") ?? localStorage.getItem("accessToken");

export const getRefreshToken = () =>
  sessionStorage.getItem("refreshToken") ?? localStorage.getItem("refreshToken");

// 기업 회원 토큰
export const getCompanyAccessToken = () =>
  sessionStorage.getItem("companyAccessToken") ??
  localStorage.getItem("companyAccessToken");

export const getCompanyRefreshToken = () =>
  sessionStorage.getItem("companyRefreshToken") ??
  localStorage.getItem("companyRefreshToken");

export interface ApiBaseResponse {
  code: number;
  msg?: string;
  [key: string]: any;
}

export type ApiResponse<T = unknown> = ApiBaseResponse & T;

export interface ApiErrorResponse {
  code: number;
  msg: string;
  raw?: any;
}

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ① API 호출 자동 수집 (시작 시간 기록)
    config._startTime = Date.now();

    const requiresAuth =
      config.requiresAuth === undefined ? true : config.requiresAuth;

    if (requiresAuth) {
      const tokenType = config.tokenType ?? "user";
      const token =
        tokenType === "company"
          ? getCompanyAccessToken()
          : getAccessToken();

      if (token) {
        if (!config.headers) {
          config.headers = {} as AxiosRequestHeaders;
        }
        (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
      } else {
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

instance.interceptors.response.use(
  (res) => {
    // ② API 호출 자동 수집 (성공)
    _eventQueue.push({
      type: 'API_CALL',
      url: res.config.url,
      method: res.config.method?.toUpperCase(),
      status: res.status,
      elapsedMs: Date.now() - (res.config._startTime || Date.now()),
      timestamp: Date.now()
    });
    return res;
  },
  async (error: any) => {
    // ② API 호출 자동 수집 (에러)
    _eventQueue.push({
      type: 'ERROR',
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      errorMessage: error.message,
      timestamp: Date.now()
    });

    if (!error.response) {
      if (error.code && error.msg) {
        return Promise.reject(error as ApiErrorResponse);
      }

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

      const tokenType = originalRequest.tokenType ?? "user";
      const isCompanyRequest = tokenType === "company";
      const refreshToken = isCompanyRequest
        ? getCompanyRefreshToken()
        : getRefreshToken();


       

      if (!refreshToken) {
        const apiError: ApiErrorResponse = {
          code: 999,
          msg: "TOKEN_REFRESH_FAILED",
        };
        return Promise.reject(apiError);
      }

      const refreshUrl = isCompanyRequest
        ? `${API_BASE_URL}/company/auth/refresh`
        : `${API_BASE_URL}/auth/refresh`;
      
      try {
        const refreshResponse = await axios.post(
          refreshUrl,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const newAccessToken = (refreshResponse.data as any).token;
        const newRefreshToken = (refreshResponse.data as any).refreshToken;
    
        if (isCompanyRequest) {
          localStorage.setItem("companyAccessToken", newAccessToken);
          localStorage.setItem("companyRefreshToken", newRefreshToken);
        } else {
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        if (!originalRequest.headers) {
          originalRequest.headers = {} as AxiosRequestHeaders;
        }

        (originalRequest.headers as AxiosRequestHeaders).Authorization =
          `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (refreshError: any) {
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