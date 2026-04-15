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
  }
  export interface InternalAxiosRequestConfig {
    requiresAuth?: boolean;
    _retry?: boolean;
    tokenType?: "user" | "company";
  }
}

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
  (res) => res,
  async (error: any) => {
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