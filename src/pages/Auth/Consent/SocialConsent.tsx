import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import ic_turn_right_gray400_22x21 from "@/assets/icons/ic_turn_right_gray400_22x21.png";
import ic_check_circle_green_20 from "@/assets/icons/size20/ic_check_circle_green_20.png";
import error_Item from "@/assets/icons/size20/ic_error_red100_20.png";
import calendar_today from "@/assets/icons/size20/ic_calendar_gray700_20.png";

import { deviceId, openAuthPopup, stripAllWhitespace } from "@/shared/utils/util";
import {
  kakaoLoginWithPreauth,
  naverLoginWithPreauth,
  googleLoginWithPreauth,
  saInit,
  saConfirm,
} from "@/api/auth/auth.api";
import type { InicisParams, VerifiedUserInfo } from "@/api/auth/auth.types";

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
    saToken?: string;
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
  const saFormRef = useRef<HTMLFormElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const snsTypeParam = params.get("snsType");
  const snsType = parseProviderKey(snsTypeParam);

  const snsAuth = (location.state as any)?.snsAuth as SnsAuthPayload | undefined;

  // 본인인증 관련 state
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [identityVerifiedError, setIdentityVerifiedError] = useState(false);
  const [duplicateUserError, setDuplicateUserError] = useState(false);
  const [verifiedUserInfo, setVerifiedUserInfo] = useState<VerifiedUserInfo | null>(null);
  const [saToken, setSaToken] = useState<string | undefined>(undefined);
  const [isVerifying, setIsVerifying] = useState(false);
  const [inicisParams, setInicisParams] = useState<InicisParams | null>(null);
  const [showMarketingModal, setShowMarketingModal] = useState(false);

  // 약관 동의
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

  // 이니시스 본인인증 postMessage 수신
  useEffect(() => {
    const allowedOrigins = new Set([window.location.origin, "https://api.jobkok.kr"]);

    const handleMessage = async (event: MessageEvent) => {
      if (!allowedOrigins.has(event.origin)) return;

      if (event.data?.type === "SA_RESULT") {
        console.log("[SocialConsent] SA_RESULT 수신:", event.data);
        const { resultCode, txId } = event.data || {};
        console.log("[SocialConsent] resultCode:", resultCode, "txId:", txId);

        if (!txId) {
          toast.error("본인인증 결과(txId)가 없습니다.");
          return;
        }

        if (resultCode !== "0000") {
          toast.error("본인인증에 실패했습니다.");
          return;
        }

        try {
          console.log("[SocialConsent] saConfirm 요청 - txId:", txId);
          const confirmRes = await saConfirm(txId);
          console.log("[SocialConsent] saConfirm 응답:", confirmRes);

          // status 409: 이미 가입된 회원
          if (confirmRes?.status === 409) {
            setIdentityVerifiedError(true);
            setDuplicateUserError(true);
            return;
          }

          if (!confirmRes?.verified) {
            toast.error("본인인증 검증에 실패했습니다.");
            setIdentityVerifiedError(true);
            setDuplicateUserError(false);
            return;
          }

          setIsIdentityVerified(true);
          setIdentityVerifiedError(false);
          setDuplicateUserError(false);
          const userInfo = {
            name: confirmRes.userName,
            phone: confirmRes.userPhone,
            birth: confirmRes.userBirth,
            ci: confirmRes.ci,
            gender: confirmRes.userSex,
          };
          setVerifiedUserInfo(userInfo);
          setSaToken(confirmRes.saToken);
          console.log("[SocialConsent] 본인인증 완료 - verifiedUserInfo:", userInfo);
          console.log("[SocialConsent] saToken 저장:", confirmRes.saToken);

          toast.success(`본인인증이 완료되었습니다!`);
        } catch (e: any) {
          console.error("[INICIS] saConfirm error:", e);

          // status 409: 이미 가입된 회원 (axios 인터셉터가 변환한 에러)
          if (e?.code === 409) {
            setIdentityVerifiedError(true);
            setDuplicateUserError(true);
            return;
          }

          toast.error("본인인증 확인 중 오류가 발생했습니다.");
          setIdentityVerifiedError(true);
          setDuplicateUserError(false);
        }

        return;
      }

      if (event.data?.type === "INICIS_AUTH_SUCCESS") {
        const { name, phone, birth, ci, gender } = event.data.data || {};

        if (!name || !phone || !birth || !ci || !gender) {
          toast.error("본인인증 데이터가 올바르지 않습니다.");
          return;
        }

        setIsIdentityVerified(true);
        setIdentityVerifiedError(false);
        setVerifiedUserInfo({ name, phone, birth, ci, gender });

        toast.success(`${name}님, 본인인증이 완료되었습니다!`);
        return;
      }

      if (event.data?.type === "INICIS_AUTH_FAIL") {
        toast.error("본인인증에 실패했습니다.");
        return;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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

  // 가입하기 버튼 활성화 조건
  const isSignupEnabled = useMemo(() => {
    return (
      // 본인인증 완료
      isIdentityVerified &&
      verifiedUserInfo !== null &&
      // 필수 약관 동의
      isRequiredAgreed
    );
  }, [isIdentityVerified, verifiedUserInfo, isRequiredAgreed]);

  const formatPhone = (phone: string) => {
    if (!phone) return "";
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  const formatBirth = (birth: string) => {
    if (!birth) return "";
    return birth.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
  };

  const handleVerification = async () => {
    if (isVerifying) {
      console.log("[SocialConsent] 본인인증이 이미 진행 중입니다.");
      return;
    }

    try {
      setIsVerifying(true);
      console.log("[SocialConsent] saInit 요청");
      const init = await saInit();
      console.log("[SocialConsent] saInit 응답:", init);

      const userName = "홍길동";
      const userPhone = "01012345678";
      const userBirth = "19901101";

      const params: InicisParams = {
        mid: init.mid,
        reqSvcCd: init.reqSvcCd,
        mTxId: init.txId || "",
        authHash: init.authHash,
        flgFixedUser: init.flgFixedUser,
        userName,
        userPhone,
        userBirth,
        userHash: "",
        reservedMsg: init.reservedMsg ?? "isUseToken=N",
        directAgency: "",
        successUrl: init.returnUrl,
        failUrl: init.returnUrl,
      };

      setInicisParams(params);

      const popup = openAuthPopup();
      if (!popup) {
        alert("팝업이 차단되었습니다. 브라우저 팝업 허용을 확인해 주세요.");
        setIsVerifying(false);
        return;
      }

      requestAnimationFrame(() => {
        const form = saFormRef.current;
        if (!form) {
          toast.error("본인인증 폼을 찾을 수 없습니다.");
          setIsVerifying(false);
          return;
        }

        form.target = "sa_popup";
        form.setAttribute("method", "post");
        form.setAttribute("action", "https://sa.inicis.com/auth");

        form.submit();

        setTimeout(() => {
          setIsVerifying(false);
        }, 5000);
      });
    } catch (error) {
      console.error("본인인증 준비 실패:", error);
      toast.error("본인인증을 시작할 수 없습니다.");
      setIsVerifying(false);
    }
  };

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

  const processSignup = useCallback(async () => {
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
        saToken: saToken,
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
  }, [isRequiredAgreed, snsAuth, snsType, saToken, navigate]);

  const handleNext = useCallback(async () => {
    // 마케팅 동의가 체크되어 있으면 모달 표시
    if (isEmailConsent || isPushConsent) {
      setShowMarketingModal(true);
      return;
    }

    // 마케팅 동의가 없으면 바로 회원가입 진행
    await processSignup();
  }, [isEmailConsent, isPushConsent, processSignup]);

  const handleMarketingModalConfirm = useCallback(async () => {
    setShowMarketingModal(false);
    await processSignup();
  }, [processSignup]);

  const handleCancel = useCallback(() => {
    if (isLoading) return;
    navigate("/login");
  }, [isLoading, navigate]);

  if (!snsAuth) return null;

  return (
    <div className="consent-page">
      <LoadingOverlay isLoading={isLoading} isLogo  />

      <div className="consent-contatiner">
        <h1 className="signup-title">회원 가입</h1>
        <span className="sub-title">
          회원이 되시면 AI면접서비스를 간편하게 이용하실 수 있습니다.
        </span>

        <div className="signup-card">
          {/* 본인인증, 이름, 생년월일 */}
          <div className="field form-group form-group--with-icon">
            {/* 휴대폰 본인인증 */}
            {identityVerifiedError ? (
              <div className="number-group">
                <label className="label">
                  휴대폰 번호 <em>*</em>
                </label>
                <div className="input-row">
                  <div className="data-group error">
                    본인 인증을 진행해 주세요
                    <img src={error_Item} alt="" />
                  </div>
                  <button
                    type="button"
                    className="default_btn_white"
                    onClick={handleVerification}
                    disabled={isVerifying}
                  >
                    {isVerifying ? "진행 중..." : "본인 인증"}
                  </button>
                </div>
                <p className="error_text_red">
                  {duplicateUserError
                    ? "이미 가입한 사용자입니다. 아이디/비밀번호 찾기를 통해 기존 계정으로 로그인해 주세요."
                    : "본인 인증을 완료해 주세요."}
                </p>
              </div>
            ) : (
              <div className="number-group">
                <label className="label">
                  휴대폰 번호 <em>*</em>
                </label>
                <div className="input-row">
                  <div className="data-group">
                    {isIdentityVerified && verifiedUserInfo
                      ? formatPhone(verifiedUserInfo.phone)
                      : "본인 인증을 진행해 주세요."}

                    {isIdentityVerified && (
                      <img
                        className="input-icon email_check"
                        src={ic_check_circle_green_20}
                        alt="본인 인증 완료"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    className="default_btn_white"
                    onClick={handleVerification}
                    disabled={isVerifying}
                  >
                    {isVerifying ? "진행 중..." : "본인 인증"}
                  </button>
                </div>
              </div>
            )}

            {/* 이름 */}
            <div className="name-group">
              <label className="label">
                이름 <em>*</em>
              </label>
              <div className="input-row">
                <div className="data-group">
                  {isIdentityVerified && verifiedUserInfo ? verifiedUserInfo.name : "본인 인증을 진행해 주세요."}
                </div>
              </div>
            </div>

            {/* 생년월일 */}
            <div className="birth-group">
              <label className="label">
                생년월일 <em>*</em>
              </label>
              <div className="input-row">
                <div className="data-group">
                  <img className="input-icon email_check" src={calendar_today} alt="생년월일" />
                  {isIdentityVerified && verifiedUserInfo ? formatBirth(verifiedUserInfo.birth) : "YYYY.MM.DD"}
                </div>
              </div>
            </div>
          </div>

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
              disabled={isLoading || !isSignupEnabled}
            >
              가입하기
            </button>
          </div>
        </div>
      </div>

      {/* 이니시스 본인인증 hidden form */}
      <form ref={saFormRef} name="saForm" style={{ display: "none" }}>
        <input type="hidden" name="mid" value={inicisParams?.mid || ""} />
        <input type="hidden" name="reqSvcCd" value={inicisParams?.reqSvcCd || ""} />
        <input type="hidden" name="identifier" value="테스트서명입니다." />
        <input type="hidden" name="mTxId" value={inicisParams?.mTxId || ""} />
        <input type="hidden" name="authHash" value={inicisParams?.authHash || ""} />
        <input type="hidden" name="flgFixedUser" value={inicisParams?.flgFixedUser || ""} />
        <input type="hidden" name="userName" value={inicisParams?.userName || ""} />
        <input type="hidden" name="userPhone" value={inicisParams?.userPhone || ""} />
        <input type="hidden" name="userBirth" value={inicisParams?.userBirth || ""} />
        <input type="hidden" name="userHash" value={inicisParams?.userHash || ""} />
        <input type="hidden" name="reservedMsg" value={inicisParams?.reservedMsg || ""} />
        <input type="hidden" name="directAgency" value={inicisParams?.directAgency || ""} />
        <input type="hidden" name="successUrl" value={inicisParams?.successUrl || ""} />
        <input type="hidden" name="failUrl" value={inicisParams?.failUrl || ""} />
      </form>

      {/* 마케팅 동의 모달 */}
      {showMarketingModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowMarketingModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "8px",
              maxWidth: "670px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "32px",
                textAlign: "center",
                color: "#2A2D2F",
              }}
            >
              개인정보 활용 동의 처리 안내
            </h2>
            <div
              style={{
                marginBottom: "40px",
                lineHeight: "2",
                color: "#6F767E",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              <p>처리자: (주)위드마인드</p>
              <p>처리 내역: (선택) 이벤트 및 서비스 안내 수신 동의</p>
              {isEmailConsent && <p>이메일 수신 동의</p>}
              {isPushConsent && <p>APP Push 알람 동의</p>}
              <p>
                처리일자{" "}
                {new Date().toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>
            </div>
            <button
              className="btn_w_full default_btn_white"
              onClick={handleMarketingModalConfirm}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialConsent;
