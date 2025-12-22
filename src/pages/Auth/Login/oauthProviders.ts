import {
  buildKakaoAuthUrl,
  buildNaverLoginUrl,
  buildGoogleAuthUrl,
  kakaoPrecheck,
  kakaoLoginWithPreauth,
  naverPrecheck,
  naverLoginWithPreauth,
  googlePrecheck,
  googleLoginWithPreauth,
} from "@/api/auth/auth.api";

import type {
  OAuthPrecheckResponse,
  OAuthLoginWithPreauthResponse,
} from "@/api/auth/auth.types";

export type ProviderKey = "kakao" | "naver" | "google";

export type ProviderConfig = {
  key: ProviderKey;
  callbackPath: string;
  buildAuthUrl?: (state: string) => string;
  precheck?: (code: string, state: string, did: string) => Promise<OAuthPrecheckResponse>;
  loginWithPreauth?: (payload: {
    preauthToken: string;
    termsAgreed: boolean;
    deviceId: string;
  }) => Promise<OAuthLoginWithPreauthResponse>;
};

export type PrecheckRes = OAuthPrecheckResponse;
export type LoginRes = OAuthLoginWithPreauthResponse;

export const PROVIDERS: Record<ProviderKey, ProviderConfig> = {
  kakao: {
    key: "kakao",
    callbackPath: "/auth/oauth/kakao/callback",
    buildAuthUrl: buildKakaoAuthUrl,
    precheck: kakaoPrecheck,
    loginWithPreauth: kakaoLoginWithPreauth,
  },
  naver: {
    key: "naver",
    callbackPath: "/auth/oauth/naver/callback",
    buildAuthUrl: buildNaverLoginUrl,
    precheck: naverPrecheck,
    loginWithPreauth: naverLoginWithPreauth,
  },
  google: {
    key: "google",
    callbackPath: "/auth/oauth/google/callback",
    buildAuthUrl: buildGoogleAuthUrl,
    precheck: googlePrecheck,
    loginWithPreauth: googleLoginWithPreauth,
  },
};

export function findProviderByPath(pathname: string): ProviderConfig | null {
  return Object.values(PROVIDERS).find((p) => p.callbackPath === pathname) ?? null;
}

export function createState() {
  return encodeURIComponent(Math.random().toString(36).substring(2, 15));
}
