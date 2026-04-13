import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./CompanySignup.css";
import ic_visibility_gray700_20 from "@/assets/icons/size20/ic_visibility_gray700_20.png";
import ic_visibility_off_gray700_20 from "@/assets/icons/size20/ic_visibility_off_gray700_20.png";
import ic_calendar_gray700_20 from "@/assets/icons/size20/ic_calendar_gray700_20.png";

import { openAuthPopup, stripAllWhitespace } from "@/shared/utils/util";
import { saConfirm, saInit } from "@/api/auth/auth.api";
import { InicisParams } from "@/api/auth/auth.types";
import { registerCompany } from "@/api/company/auth/companyAuth.api";
import type { CompanyRegisterRequest } from "@/api/company/auth/companyAuth.types";
import { ApiErrorResponse } from "@/api/axios.instance";

type VerifiedCompanyUserInfo = {
  name: string;
  phone: string;
  birth: string;
  ci: string;
  gender?: string;
};

function onlyDigits(value: string) {
  return (value ?? "").replace(/\D/g, "");
}

function formatBusinessNo(value: string) {
  const digits = onlyDigits(value).slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function formatBirthDisplay(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length < 8) return value;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6, 8)}`;
}

function toBirthApiValue(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length !== 8) return "";
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function getDeviceId() {
  const key = "companyDeviceId";
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const created = `device_company_${Date.now()}`;
  localStorage.setItem(key, created);
  return created;
}

export default function CompanySignup() {
  const navigate = useNavigate();
  const saFormRef = useRef<HTMLFormElement | null>(null);

  const [company_name, setCompanyName] = useState("");
  const [business_no, setBusinessNo] = useState("");
  const [owner_name, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [identityVerifiedError, setIdentityVerifiedError] = useState(false);
  const [verifiedUserInfo, setVerifiedUserInfo] =
    useState<VerifiedCompanyUserInfo | null>(null);
  const [inicisParams, setInicisParams] = useState<InicisParams | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePassword = () => setShowPassword((p) => !p);
  const togglePasswordConfirm = () => setShowPasswordConfirm((p) => !p);

  const [isOver14, setIsOver14] = useState(false);
  const [isPaidTermsAgreed, setIsPaidTermsAgreed] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);

  const [isEmailConsent, setIsEmailConsent] = useState(false);
  const [isPushConsent, setIsPushConsent] = useState(false);

  const isMarketingChecked = isEmailConsent || isPushConsent;

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

  useEffect(() => {
    const allowedOrigins = new Set([window.location.origin, "https://api.jobkok.kr"]);

    const handleMessage = async (event: MessageEvent) => {
      if (!allowedOrigins.has(event.origin)) return;

      if (event.data?.type === "SA_RESULT") {
        const { resultCode, txId } = event.data || {};

        if (!txId) {
          toast.error("본인인증 결과(txId)가 없습니다.");
          return;
        }

        if (resultCode !== "0000") {
          toast.error("본인인증에 실패했습니다.");
          return;
        }

        try {
          const confirmRes = await saConfirm(txId);

          if (!confirmRes?.verified) {
            toast.error("본인인증 검증에 실패했습니다.");
            return;
          }

          setIsIdentityVerified(true);
          setIdentityVerifiedError(false);
          setVerifiedUserInfo({
            name: confirmRes.userName,
            phone: confirmRes.userPhone,
            birth: confirmRes.userBirth,
            ci: confirmRes.ci,
            gender: confirmRes.userSex,
          });

          toast.success("본인인증이 완료되었습니다!");
        } catch (e) {
          console.error("[INICIS] saConfirm error:", e);
          toast.error("본인인증 확인 중 오류가 발생했습니다.");
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
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    setIsOver14(isChecked);
    setIsPaidTermsAgreed(isChecked);
    setIsTermsAgreed(isChecked);
    setIsPrivacyAgreed(isChecked);
    setIsEmailConsent(isChecked);
    setIsPushConsent(isChecked);
  };

  const handleSingleCheck =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  const handleMarketingParent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsEmailConsent(isChecked);
    setIsPushConsent(isChecked);
  };

  const handleMarketingChild =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  const handleVerification = async () => {
    try {
      const init = await saInit();

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
        return;
      }

      requestAnimationFrame(() => {
        const form = saFormRef.current;
        if (!form) {
          toast.error("본인인증 폼을 찾을 수 없습니다.");
          return;
        }

        form.target = "sa_popup";
        form.setAttribute("method", "post");
        form.setAttribute("action", "https://sa.inicis.com/auth");
        form.submit();
      });
    } catch (error) {
      console.error("본인인증 준비 실패:", error);
      toast.error("본인인증을 시작할 수 없습니다.");
    }
  };

  const validateForm = () => {
    if (!stripAllWhitespace(company_name)) {
      toast.error("기업명을 입력해 주세요.");
      return false;
    }

    if (onlyDigits(business_no).length !== 10) {
      toast.error("사업자등록번호 10자리를 입력해 주세요.");
      return false;
    }

    if (!stripAllWhitespace(owner_name)) {
      toast.error("대표자명을 입력해 주세요.");
      return false;
    }

    if (!stripAllWhitespace(email)) {
      toast.error("아이디(이메일)를 입력해 주세요.");
      return false;
    }

    if (!stripAllWhitespace(password) || !stripAllWhitespace(passwordConfirm)) {
      toast.error("비밀번호를 입력해 주세요.");
      return false;
    }

    if (stripAllWhitespace(password) !== stripAllWhitespace(passwordConfirm)) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return false;
    }

    if (!isIdentityVerified || !verifiedUserInfo) {
      setIdentityVerifiedError(true);
      toast.error("본인 인증을 완료해 주세요.");
      return false;
    }

    if (!isOver14 || !isPaidTermsAgreed || !isTermsAgreed || !isPrivacyAgreed) {
      toast.error("필수 약관에 모두 동의해 주세요.");
      return false;
    }

    return true;
  };

  const handleCompanySignup = async () => {
    if (!validateForm()) return;

    if (!verifiedUserInfo) return;

    try {
      setIsSubmitting(true);

      const payload: CompanyRegisterRequest = {
        deviceId: getDeviceId(),
        companyUserId: stripAllWhitespace(email),
        password: stripAllWhitespace(password),
        password2: stripAllWhitespace(passwordConfirm),
        managerName: verifiedUserInfo.name,
        managerPhone: formatPhone(verifiedUserInfo.phone),
        birthdate: toBirthApiValue(verifiedUserInfo.birth),
        gender: verifiedUserInfo.gender === "F" || verifiedUserInfo.gender === "W" ? "W" : "M",
        companyName: stripAllWhitespace(company_name),
        bizRegNo: onlyDigits(business_no),
        ceoName: stripAllWhitespace(owner_name),
        agreeOver14Yn: isOver14 ? 1 : 0,
        agreePaidTermsYn: isPaidTermsAgreed ? 1 : 0,
        agreeTermsYn: isTermsAgreed ? 1 : 0,
        agreePrivacyYn: isPrivacyAgreed ? 1 : 0,
        agreeMarketingYn: isMarketingChecked ? 1 : 0,
        marketingEmailYn: isEmailConsent ? 1 : 0,
        marketingPushYn: isPushConsent ? 1 : 0,
      };

      const result = await registerCompany(payload);

      if (result.code === 200) {
        toast.success("기업회원 가입이 완료되었습니다.");
        navigate("/company");
        return;
      }

      toast.error("기업회원 가입에 실패했습니다.");
    } catch (error) {
      console.error(error);
      const e = error as ApiErrorResponse;
      toast.error(e?.msg || `기업회원 가입 실패 (code: ${e?.code ?? "unknown"})`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="company-contanier">
      <div className="company-signup">
        <div className="company-signup__title">회원가입</div>

        <div className="company-signup__content">
          <div className="company-signup__form">
            <div className="company_name-group input-group">
              <label className="label">
                기업명 <em>*</em>
              </label>
              <div className="company-signup__input-wrap">
                <input
                  className="form-input"
                  type="text"
                  aria-invalid="true"
                  placeholder="ex) 위드마인드"
                  value={company_name}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            <div className="company_name-group input-group">
              <label className="label">
                사업자등록번호 <em>*</em>
              </label>
              <div className="company-signup__input-wrap">
                <input
                  className="form-input"
                  type="text"
                  aria-invalid="true"
                  placeholder="-제외 10자리"
                  value={business_no}
                  onChange={(e) => setBusinessNo(formatBusinessNo(e.target.value))}
                />
              </div>
            </div>

            <div className="company_name-group input-group">
              <label className="label">
                대표자명 <em>*</em>
              </label>
              <div className="company-signup__input-wrap">
                <input
                  className="form-input"
                  type="text"
                  aria-invalid="true"
                  placeholder="사업자등록증에 기재된 대표자명"
                  value={owner_name}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </div>
            </div>

            <div className="company_name-group input-group">
              <label className="label">
                아이디 <em>*</em>
              </label>
              <div className="company-signup__field-with-btn">
                <div className="company-signup__input-wrap">
                  <input
                    className="form-input"
                    type="text"
                    aria-invalid="true"
                    placeholder="이메일을 입력해 주세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button type="button" className="default_btn_white company-signup__verify-btn">
                  중복 확인
                </button>
              </div>
            </div>

            <div className="company_name-group input-group">
              <label className="label">
                비밀번호 <em>*</em>
              </label>
              <div className="company-signup__input-wrap">
                <input
                  className="company-signup__input"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해 주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  src={showPassword ? ic_visibility_off_gray700_20 : ic_visibility_gray700_20}
                  className="company-signup__toggle-password"
                  alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  onClick={togglePassword}
                />
              </div>

              <div className="company-signup__input-wrap">
                <input
                  className="company-signup__input"
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력해 주세요."
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <img
                  src={
                    showPasswordConfirm
                      ? ic_visibility_off_gray700_20
                      : ic_visibility_gray700_20
                  }
                  className="company-signup__toggle-password"
                  alt={showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
                  onClick={togglePasswordConfirm}
                />
              </div>
              <span className="helper_txt">
                ※ 영문, 숫자, 특수문자를 모두 포함한 8~16자로 입력해 주세요.
              </span>
            </div>

            <div className="company_name-group input-group">
              <label className="label">
                관리자 휴대폰 번호 <em>*</em>
              </label>
              <div className="company-signup__field-with-btn">
                <div
                  className={`company-signup__input-wrap admin_phone ${
                    identityVerifiedError ? "error" : ""
                  }`}
                >
                  {isIdentityVerified && verifiedUserInfo
                    ? formatPhone(verifiedUserInfo.phone)
                    : "본인 인증을 진행해 주세요."}
                </div>

                <button
                  type="button"
                  className="default_btn_white company-signup__verify-btn"
                  onClick={handleVerification}
                >
                  본인 인증
                </button>
              </div>
              {identityVerifiedError && (
                <p className="error_text_red">본인 인증을 완료해 주세요.</p>
              )}
            </div>

            <div className="company_name-group input-group">
              <label className="label">
                이름 <em>*</em>
              </label>
              <div className="company-signup__input-wrap admin_name">
                {isIdentityVerified && verifiedUserInfo
                  ? verifiedUserInfo.name
                  : "본인 인증을 진행해 주세요."}
              </div>
            </div>

            <div className="company_name-group input-group">
              <label className="label">
                생년월일 <em>*</em>
              </label>
              <div className="company-signup__input-wrap birth">
                <img src={ic_calendar_gray700_20} alt="" />
                {isIdentityVerified && verifiedUserInfo
                  ? formatBirthDisplay(verifiedUserInfo.birth)
                  : "YYYY.MM.DD"}
              </div>
            </div>
          </div>

          <div className="consent-card">
            <div className="consent-item--all">
              <input type="checkbox" checked={isAllAgreed} onChange={handleAllCheck} />
              <span className="consent-label">전체 동의</span>
            </div>

            <div className="consent-item">
              <label className="consent-item__control">
                <input
                  type="checkbox"
                  checked={isOver14}
                  onChange={handleSingleCheck(setIsOver14)}
                />
                <span className="consent-item__label">
                  <em className="consent-badge badge--required">(필수)</em>
                  만 14세 이상
                </span>
              </label>
              <Link className="consent-item__view" to={""}>
                보기
              </Link>
            </div>

            <div className="consent-item">
              <label className="consent-item__control">
                <input
                  type="checkbox"
                  checked={isPaidTermsAgreed}
                  onChange={handleSingleCheck(setIsPaidTermsAgreed)}
                />
                <span className="consent-item__label">
                  <em className="consent-badge badge--required">(필수)</em>
                  유료 서비스 이용약관 동의
                </span>
              </label>
              <Link className="consent-item__view" to={""}>
                보기
              </Link>
            </div>

            <div className="consent-item">
              <label className="consent-item__control">
                <input
                  type="checkbox"
                  checked={isTermsAgreed}
                  onChange={handleSingleCheck(setIsTermsAgreed)}
                />
                <span className="consent-item__label">
                  <em className="consent-badge badge--required">(필수)</em>
                  이용약관 동의
                </span>
              </label>
              <Link className="consent-item__view" to={""}>
                보기
              </Link>
            </div>

            <div className="consent-item">
              <label className="consent-item__control">
                <input
                  type="checkbox"
                  checked={isPrivacyAgreed}
                  onChange={handleSingleCheck(setIsPrivacyAgreed)}
                />
                <span className="consent-item__label">
                  <em className="consent-badge badge--required">(필수)</em>
                  개인정보 수집 및 이용 동의
                </span>
              </label>
              <Link className="consent-item__view" to={""}>
                보기
              </Link>
            </div>

            <div className="consent-item--optional">
              <div className="consent-item">
                <label className="consent-item__control">
                  <input
                    type="checkbox"
                    checked={isMarketingChecked}
                    onChange={handleMarketingParent}
                  />
                  <span className="consent-item__label">
                    <em className="badge--optional">(선택)</em>
                    이벤트 및 서비스 안내 수신 동의
                  </span>
                </label>
                <Link className="consent-item__view" to="/terms/marketing">
                  보기
                </Link>
              </div>

              <div className="consent-item__options">
                <label className="consent-option">
                  <input
                    type="checkbox"
                    checked={isEmailConsent}
                    onChange={handleMarketingChild(setIsEmailConsent)}
                  />{" "}
                  이메일
                </label>
                <label className="consent-option">
                  <input
                    type="checkbox"
                    checked={isPushConsent}
                    onChange={handleMarketingChild(setIsPushConsent)}
                  />{" "}
                  APP Push 알림
                </label>
              </div>
            </div>
          </div>

          <div className="company-signup_btn_wrap">
            <button
              className="btn_w_full default_btn_white"
              onClick={() => {
                navigate("/company/login");
              }}
            >
              취소
            </button>
            <button
              className="btn_w_full default_btn_black"
              type="button"
              onClick={handleCompanySignup}
              disabled={isSubmitting}
            >
              {isSubmitting ? "가입 중..." : "가입하기"}
            </button>
          </div>
        </div>

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
      </div>
    </div>
  );
}