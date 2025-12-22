import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import ic_turn_right_gray400_22x21 from "@/assets/icons/ic_turn_right_gray400_22x21.png";

import { deviceId } from "@/shared/utils/util";
import {
  kakaoLoginWithPreauth,
  naverLoginWithPreauth,
  googleLoginWithPreauth,
} from "@/api/auth/auth.api";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

type ProviderKey = "kakao" | "naver" | "google";

type SnsAuthPayload = {
  code: number;
  provider: string;
  exists: boolean;
  needTerms: boolean;
  preauthToken: string;
  profile?: {
    email?: string;
    name?: string;
  };
  providerUid?: string;
  suggestedUserId?: string;
  [key: string]: any;
};

type LoginRes = {
  code: number;
  tokens: { accessToken: string; refreshToken: string };
  user: { idx: number; userId: string; userName: string; email: string | null };
  [key: string]: any;
};

type ProviderConfig = {
  key: ProviderKey;
  loginWithPreauth?: (payload: {
    preauthToken: string;
    termsAgreed: boolean;
    deviceId: string;
  }) => Promise<LoginRes>;
};

const PROVIDERS: Record<ProviderKey, ProviderConfig> = {
  kakao: { key: "kakao", loginWithPreauth: kakaoLoginWithPreauth as any },
  naver: { key: "naver", loginWithPreauth: naverLoginWithPreauth as any },
  google: { key: "google", loginWithPreauth: googleLoginWithPreauth as any },
};

function parseProviderKey(v: string | null): ProviderKey | null {
  if (!v) return null;
  const k = v.toLowerCase();
  if (k === "kakao" || k === "naver" || k === "google") return k;
  return null;
}

const SocialConsent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const snsTypeParam = params.get("snsType");
  const snsType = parseProviderKey(snsTypeParam);

  const snsAuth = (location.state as any)?.snsAuth as SnsAuthPayload | undefined;

  const [isOver14, setIsOver14] = useState(false);
  const [isPaidTermsAgreed, setIsPaidTermsAgreed] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);

  const [isEmailConsent, setIsEmailConsent] = useState(false);
  const [isPushConsent, setIsPushConsent] = useState(false);

  const isMarketingChecked = isEmailConsent || isPushConsent;

  useEffect(() => {
    console.log("[SocialConsent] snsType:", snsTypeParam);
    console.log("[SocialConsent] snsAuth:", snsAuth);

    if (!snsAuth || !snsAuth.preauthToken) {
      toast.error("소셜 로그인 정보가 없습니다. 다시 시도해 주세요.");
      navigate("/login");
      return;
    }

    if (!snsType) {
      toast.error("소셜 로그인 타입이 올바르지 않습니다.");
      navigate("/login");
      return;
    }
  }, [snsAuth, snsType, snsTypeParam, navigate]);

  const isAllAgreed = useMemo(() => {
    return (
      isOver14 &&
      isPaidTermsAgreed &&
      isTermsAgreed &&
      isPrivacyAgreed &&
      (isEmailConsent || isPushConsent || (!isEmailConsent && !isPushConsent))
    );
  }, [
    isOver14,
    isPaidTermsAgreed,
    isTermsAgreed,
    isPrivacyAgreed,
    isEmailConsent,
    isPushConsent,
  ]);

  const isRequiredAgreed = useMemo(() => {
    return isOver14 && isPaidTermsAgreed && isTermsAgreed && isPrivacyAgreed;
  }, [isOver14, isPaidTermsAgreed, isTermsAgreed, isPrivacyAgreed]);

  const handleAllCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    setIsOver14(checked);
    setIsPaidTermsAgreed(checked);
    setIsTermsAgreed(checked);
    setIsPrivacyAgreed(checked);

    setIsEmailConsent(checked);
    setIsPushConsent(checked);
  }, []);

  const handleSingleCheck =
    (setter: (v: boolean) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  const handleMarketingParent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setIsEmailConsent(checked);
      setIsPushConsent(checked);
    },
    []
  );

  const handleMarketingChild =
    (setter: (v: boolean) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  const saveLoginTokens = (loginRes: LoginRes) => {
    localStorage.setItem("accessToken", loginRes.tokens.accessToken);
    localStorage.setItem("refreshToken", loginRes.tokens.refreshToken);
    localStorage.setItem("userName", loginRes.user.userName);
    localStorage.setItem("userId", loginRes.user.userId);
    localStorage.setItem("userIdx", String(loginRes.user.idx));
  };

  const handleNext = useCallback(async () => {
    if (!isRequiredAgreed) {
      toast.info("필수 약관에 모두 동의해야 합니다.");
      return;
    }

    if (!snsAuth?.preauthToken) {
      toast.error("소셜 인증 정보가 없습니다. 다시 로그인해 주세요.");
      navigate("/login");
      return;
    }

    if (!snsType) {
      toast.error("소셜 로그인 타입이 올바르지 않습니다.");
      navigate("/login");
      return;
    }

    const provider = PROVIDERS[snsType];
    if (!provider?.loginWithPreauth) {
      toast.info("현재 해당 소셜 로그인은 준비 중입니다.");
      return;
    }

    setIsLoading(true);
    try {
      const did = deviceId();

      const loginRes = await provider.loginWithPreauth({
        preauthToken: snsAuth.preauthToken,
        termsAgreed: true,
        deviceId: did,
      });

      console.log(`[SocialConsent] ${snsType} login(preauth) 응답:`, loginRes);

      if (loginRes?.code !== 200) {
        toast.error("소셜 로그인 처리에 실패했습니다.");
        navigate("/login");
        return;
      }

      saveLoginTokens(loginRes);
      navigate("/");
    } catch (e) {
      console.error("[SocialConsent] loginWithPreauth 실패:", e);
      toast.error("소셜 로그인 처리 중 오류가 발생했습니다.");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [isRequiredAgreed, snsAuth, snsType, navigate]);

  const handleCancel = useCallback(() => {
    if (isLoading) return;
    navigate("/login");
  }, [isLoading, navigate]);

  if (!snsAuth) return null;

  return (
    <div className="consent-page">
      <LoadingOverlay isLoading={isLoading} isLogo text="처리 중..." />

      <div className="consent-contatiner">
        <h1 className="signup-title">회원 가입</h1>
        <span className="sub-title">
          회원이 되시면 AI면접서비스를 간편하게 이용하실 수 있습니다.
        </span>

        <div className="signup-card">
          <div className="consent-card">
            <div className="consent-item--all">
              <input
                type="checkbox"
                checked={isAllAgreed}
                onChange={handleAllCheck}
                disabled={isLoading}
              />
              <span className="consent-label">전체 동의</span>
            </div>

            <div className="consent-item">
              <label className="consent-item__control">
                <input
                  type="checkbox"
                  checked={isOver14}
                  onChange={handleSingleCheck(setIsOver14)}
                  disabled={isLoading}
                />
                <span className="consent-item__label">
                  <em className="consent-badge badge--required">(필수)</em>
                  만 14세 이상
                </span>
              </label>
            </div>

            <div className="consent-item">
              <label className="consent-item__control">
                <input
                  type="checkbox"
                  checked={isPaidTermsAgreed}
                  onChange={handleSingleCheck(setIsPaidTermsAgreed)}
                  disabled={isLoading}
                />
                <span className="consent-item__label">
                  <em className="consent-badge badge--required">(필수)</em>
                  유료 서비스 이용약관 동의
                </span>
              </label>
              <a
                href="/paid-service-terms"
                target="_blank"
                rel="noopener noreferrer"
                className="consent-item__view"
              >
                보기
              </a>
            </div>

            <div className="consent-item">
              <label className="consent-item__control">
                <input
                  type="checkbox"
                  checked={isTermsAgreed}
                  onChange={handleSingleCheck(setIsTermsAgreed)}
                  disabled={isLoading}
                />
                <span className="consent-item__label">
                  <em className="consent-badge badge--required">(필수)</em>
                  이용약관 동의
                </span>
              </label>
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="consent-item__view"
              >
                보기
              </a>
            </div>

            <div className="consent-item">
              <label className="consent-item__control">
                <input
                  type="checkbox"
                  checked={isPrivacyAgreed}
                  onChange={handleSingleCheck(setIsPrivacyAgreed)}
                  disabled={isLoading}
                />
                <span className="consent-item__label">
                  <em className="consent-badge badge--required">(필수)</em>
                  개인정보 수집 및 이용 동의
                </span>
              </label>
              <a
                href="/privacy-consent"
                target="_blank"
                rel="noopener noreferrer"
                className="consent-item__view"
              >
                보기
              </a>
            </div>

            <div className="consent-item--optional">
              <div className="consent-item">
                <label className="consent-item__control">
                  <input
                    type="checkbox"
                    checked={isMarketingChecked}
                    onChange={handleMarketingParent}
                    disabled={isLoading}
                  />
                  <span className="consent-item__label">
                    <em className="badge--optional">(선택)</em>
                    이벤트 및 서비스 안내 수신 동의
                  </span>
                </label>
                <a
                  href="/marketing-consent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="consent-item__view"
                >
                  보기
                </a>
              </div>

              <div className="consent-item__options">
                <label className="consent-option">
                  <input
                    type="checkbox"
                    checked={isEmailConsent}
                    onChange={handleMarketingChild(setIsEmailConsent)}
                    disabled={isLoading}
                  />{" "}
                  이메일
                </label>
                <label className="consent-option">
                  <input
                    type="checkbox"
                    checked={isPushConsent}
                    onChange={handleMarketingChild(setIsPushConsent)}
                    disabled={isLoading}
                  />{" "}
                  APP Push 알림
                </label>
              </div>

              <div className="consent-item__options mobile">
                <img src={ic_turn_right_gray400_22x21} alt="" />
                <label className="consent-option">
                  <input
                    type="checkbox"
                    checked={isEmailConsent}
                    onChange={handleMarketingChild(setIsEmailConsent)}
                    disabled={isLoading}
                  />{" "}
                  이메일
                </label>
                <label className="consent-option">
                  <input
                    type="checkbox"
                    checked={isPushConsent}
                    onChange={handleMarketingChild(setIsPushConsent)}
                    disabled={isLoading}
                  />{" "}
                  APP Push 알림
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn_w_full default_btn_white"
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
            >
              취소
            </button>
            <button
              className="btn_w_full default_btn_black"
              type="button"
              onClick={handleNext}
              disabled={isLoading}
            >
              동의하고 계속
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialConsent;
