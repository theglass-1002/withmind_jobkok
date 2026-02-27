import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ic_clear_btn_gray400_20 from "@/assets/icons/size20/ic_clear_btn_gray400_20.png";
import error_Item from "@/assets/icons/size20/ic_error_red100_20.png";
import ic_check_circle_green_20 from "@/assets/icons/size20/ic_check_circle_green_20.png";
import ic_visibility_gray700_20 from "@/assets/icons/size20/ic_visibility_gray700_20.png";
import ic_visibility_off_gray700_20 from "@/assets/icons/size20/ic_visibility_off_gray700_20.png";
import calendar_today from "@/assets/icons/size20/ic_calendar_gray700_20.png";
import ic_turn_right_gray400_22x21 from "@/assets/icons/ic_turn_right_gray400_22x21.png";

import "./Signup.css";
import {
  isValidEmail,
  isValidPassword,
  openAuthPopup,
  stripAllWhitespace,
} from "@/shared/utils/util";

import {
  checkEmailDuplicate,
  logout,
  registerUser,
  saConfirm,
  saInit,
} from "@/api/auth/auth.api";

import { ApiErrorResponse } from "@/api/axios.instance";
import { RegisterRequest, VerifiedUserInfo, InicisParams } from "@/api/auth/auth.types";

export default function Signup() {
  const navigate = useNavigate();
  const saFormRef = useRef<HTMLFormElement | null>(null);

  // 입력값
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 상태
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [emailErrorType, setEmailErrorType] = useState(0);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [passwordErrorType, setPasswordErrorType] = useState(0);

  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [identityVerifiedError, setIdentityVerifiedError] = useState(false);
  const [verifiedUserInfo, setVerifiedUserInfo] = useState<VerifiedUserInfo | null>(null);

  const [inicisParams, setInicisParams] = useState<InicisParams | null>(null);

  const [selectedGender, setSelectedGender] = useState(1);

  // 약관
  const [isOver14, setIsOver14] = useState(false);
  const [isPaidTermsAgreed, setIsPaidTermsAgreed] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [isEmailConsent, setIsEmailConsent] = useState(false);
  const [isPushConsent, setIsPushConsent] = useState(false);

  const isMarketingChecked = isEmailConsent || isPushConsent;

  const isAllAgreed = useMemo(() => {
    // 전체동의는: 필수 4개 + 마케팅(선택)은 on/off 상관없이 전체 체크 토글에 포함
    return (
      isOver14 &&
      isPaidTermsAgreed &&
      isTermsAgreed &&
      isPrivacyAgreed &&
      (isEmailConsent || isPushConsent || (!isEmailConsent && !isPushConsent))
    );
  }, [isOver14, isPaidTermsAgreed, isTermsAgreed, isPrivacyAgreed, isEmailConsent, isPushConsent]);

  /**
   * 이니시스 팝업 -> postMessage 수신
   * SA_RESULT 받으면 txId로 saConfirm 호출하여 최종 사용자정보(ci, 이름, 폰, 생일) 세팅
   */
  useEffect(() => {
    const allowedOrigins = new Set([window.location.origin, "https://api.jobkok.kr"]);

    const handleMessage = async (event: MessageEvent) => {
      if (!allowedOrigins.has(event.origin)) return;

      // 1) 백엔드가 보내는 SA_RESULT (txId 포함)
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
          console.log('본인인증성공값',confirmRes)
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
            gender:confirmRes.userSex
          });

          toast.success(`본인인증이 완료되었습니다!`);
        } catch (e) {
          console.error("[INICIS] saConfirm error:", e);
          toast.error("본인인증 확인 중 오류가 발생했습니다.");
        }

        return;
      }

      // 2) 혹시 직접 성공/실패를 보내는 형태도 대비(예전 호환)
      if (event.data?.type === "INICIS_AUTH_SUCCESS") {
        const { name, phone, birth, ci ,gender} = event.data.data || {};

        if (!name || !phone || !birth || !ci ||!gender) {
          toast.error("본인인증 데이터가 올바르지 않습니다.");
          return;
        }

        setIsIdentityVerified(true);
        setIdentityVerifiedError(false);
        setVerifiedUserInfo({ name, phone, birth, ci ,gender});

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

  // ====== 검증/유틸 ======
  const emailErrorMessage = useMemo(() => {
    switch (emailErrorType) {
      case 1:
        return "이메일을 입력해 주세요.";
      case 2:
        return "이미 가입된 이메일입니다. 해당 이메일로 로그인해 주세요.";
      case 3:
        return "중복 확인을 완료해 주세요.";
      case 4:
        return "올바른 이메일 형식이 아닙니다.";
      default:
        return "";
    }
  }, [emailErrorType]);

  const passwordErrorMessage = useMemo(() => {
    switch (passwordErrorType) {
      case 1:
        return "비밀번호를 입력해 주세요.";
      case 2:
        return "입력한 비밀번호를 확인해 주세요.";
      case 3:
        return "비밀번호가 일치하지 않습니다.";
      case 4:
        return "영문, 숫자, 특수문자를 모두 포함한 8~16자로 입력해 주세요.";
      default:
        return "";
    }
  }, [passwordErrorType]);

  const formatPhone = (phone: string) => {
    if (!phone) return "";
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  const formatBirth = (birth: string) => {
    if (!birth) return "";
    return birth.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
  };

  // ====== 핸들러 ======
  const handleDuplicateCheck = async () => {
    const trimmedEmail = stripAllWhitespace(email);

    if (!trimmedEmail) {
      setEmailErrorType(1);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setEmailErrorType(4);
      return;
    }

    try {
      console.log(trimmedEmail);
      const result = await checkEmailDuplicate(trimmedEmail);
      console.log(result);
      if (result.check === true) {
        setIsEmailChecked(false);
        setEmailErrorType(2);
      } else {
        setEmailErrorType(0);
        setIsEmailChecked(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("이메일 중복확인 중 오류 발생");
    }
  };

  const validateEmailCheck = () => {
    if (!isEmailChecked) {
      setEmailErrorType(3);
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    const trimmedPassword = stripAllWhitespace(password);
    const trimmedConfirmPassword = stripAllWhitespace(confirmPassword);

    if (!trimmedPassword || !trimmedConfirmPassword) {
      setPasswordErrorType(1);
      return false;
    }

    if (!isValidPassword(trimmedPassword)) {
      setPasswordErrorType(4);
      return false;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setPasswordErrorType(3);
      return false;
    }

    setPasswordErrorType(0);
    return true;
  };

  const validateIdentityVerification = () => {
    if (!isIdentityVerified) {
      setIdentityVerifiedError(true);
      return false;
    }
    return true;
  };

  const validateAgreements = () => {
    const ok = isOver14 && isPaidTermsAgreed && isTermsAgreed && isPrivacyAgreed;
    if (!ok) {
      toast.error("필수 약관에 모두 동의해야 합니다.");
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateEmailCheck()) return;
    if (!validatePassword()) return;
    if (!validateIdentityVerification()) return;
    if (!validateAgreements()) return;

    const trimmedEmail = stripAllWhitespace(email);
    const trimmedPassword = stripAllWhitespace(password);

    if (!verifiedUserInfo) {
      toast.error("본인인증 정보가 없습니다.");
      return;
    }

    const regisData: RegisterRequest = {
      userId: trimmedEmail,
      password: trimmedPassword,
      userName: verifiedUserInfo.name,
      ci: verifiedUserInfo.ci,
      ciProvider: "inicis",
      realName: verifiedUserInfo.name,
      birthdate: verifiedUserInfo.birth.replace(/-/g, ""),
      gender: selectedGender === 1 ? "M" : "W",
      phone: verifiedUserInfo.phone.replace(/-/g, ""),
      email: trimmedEmail,
    };

    try {
      const result = await registerUser(regisData);

      if (result.code === 200) {
        logout();
        navigate("/login");
        toast.success("회원가입 완료");
      }
    } catch (error) {
      logout();
      const e = error as ApiErrorResponse;

      if (e.code === 400) {
        toast.error("존재하는 계정입니다.");
      } else {
        toast.error(`관리자에게 문의해주세요 Ecode:${e.code}`);
      }
    }
  };

  const handleClearEmail = () => {
    setEmailErrorType(0);
    setEmail("");
    setIsEmailChecked(false);
  };

  const handleClearPassword = () => {
    setPasswordErrorType(0);
    setPassword("");
  };

  const handleClearConfirmPassword = () => {
    setConfirmPassword("");
  };

  const togglePasswordVisibility = () => setIsPasswordVisible((v) => !v);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible((v) => !v);

  const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsOver14(checked);
    setIsPaidTermsAgreed(checked);
    setIsTermsAgreed(checked);
    setIsPrivacyAgreed(checked);
    setIsEmailConsent(checked);
    setIsPushConsent(checked);
  };

  const handleSingleCheck =
    (setter: (v: boolean) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  const handleMarketingParent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsEmailConsent(checked);
    setIsPushConsent(checked);
  };

  const handleMarketingChild =
    (setter: (v: boolean) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  /**
   * 본인인증 버튼 클릭
   * - saInit 호출 -> inicisParams 생성/세팅
   * - 팝업 열기
   * - hidden form submit
   */
  const handleVerification = async () => {
    try {
      const init = await saInit();
      

      // TODO: 실제 서비스에서는 사용자 입력값을 쓰거나, 이니시스 페이지에서 입력받는 구조로 변경
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

      // DOM에 hidden form 렌더가 반영된 다음 submit
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

  return (
    <div className="signup-page">
      <h1 className="signup-title">회원가입</h1>

      <div className="signup-card">
        <div className="field form-group form-group--with-icon">
          {/* 이메일 */}
          <div className="email-group">
            <label className="label" htmlFor="email">
              이메일 <em>*</em>
            </label>

            <div className="input-row">
              {emailErrorType === 0 ? (
                <div className="input-group">
                  <input
                    className="form-input"
                    type="email"
                    aria-invalid="true"
                    aria-describedby="email-error"
                    placeholder="이메일을 입력해 주세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  {email.length > 0 &&
                    (isEmailChecked ? (
                      <img
                        className="input-icon email_check"
                        src={ic_check_circle_green_20}
                        alt="이메일 확인 완료"
                      />
                    ) : (
                      <img
                        className="input-icon email clear-btn"
                        src={ic_clear_btn_gray400_20}
                        alt="입력 내용 지우기"
                        onClick={handleClearEmail}
                      />
                    ))}
                </div>
              ) : (
                <div className="input-group error">
                  <input
                    className="form-input"
                    type="email"
                    aria-invalid="true"
                    aria-describedby="email-error"
                    placeholder="이메일을 입력해 주세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <img className="input-icon email_check" src={error_Item} alt="이메일 오류" />
                </div>
              )}

              <button type="button" className="default_btn_white" onClick={handleDuplicateCheck}>
                중복확인
              </button>
            </div>

            <p id="email-error" className="error_text_red">
              {emailErrorMessage}
            </p>
          </div>

          {/* 비밀번호 */}
          {passwordErrorType === 0 ? (
            <div className="pwd-group">
              <div className="field in_icon">
                <label className="label" htmlFor="password">
                  비밀번호
                </label>

                <div className="input-group">
                  <input
                    placeholder="비밀번호를 입력해 주세요."
                    className="form-input"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <img
                    className="input-icon clear-btn"
                    onClick={handleClearPassword}
                    src={ic_clear_btn_gray400_20}
                    alt="입력 내용 지우기"
                  />
                  <img
                    src={isPasswordVisible ? ic_visibility_off_gray700_20 : ic_visibility_gray700_20}
                    onClick={togglePasswordVisibility}
                    alt=""
                  />
                </div>

                <div className="input-group">
                  <input
                    placeholder="비밀번호를 다시 입력해 주세요."
                    className="form-input"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <img
                    className="input-icon clear-btn"
                    onClick={handleClearConfirmPassword}
                    src={ic_clear_btn_gray400_20}
                    alt="입력 내용 지우기"
                  />
                  <img
                    src={
                      isConfirmPasswordVisible
                        ? ic_visibility_off_gray700_20
                        : ic_visibility_gray700_20
                    }
                    onClick={toggleConfirmPasswordVisibility}
                    alt=""
                  />
                </div>

                <span className="password_info">
                  ※ 영문, 숫자, 특수문자를 모두 포함한 8~16자로 입력해 주세요.
                </span>
              </div>
            </div>
          ) : (
            <div className="pwd-group">
              <div className="field in_icon">
                <label className="label" htmlFor="password">
                  비밀번호
                </label>

                <div className="input-group error">
                  <input
                    placeholder="비밀번호를 입력해 주세요."
                    className="form-input"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {password.length > 0 && (
                    <img
                      className="input-icon clear-btn"
                      onClick={handleClearPassword}
                      src={ic_clear_btn_gray400_20}
                      alt="입력 내용 지우기"
                    />
                  )}
                  <img src={error_Item} alt="" />
                  <img
                    src={isPasswordVisible ? ic_visibility_off_gray700_20 : ic_visibility_gray700_20}
                    onClick={togglePasswordVisibility}
                    alt=""
                  />
                </div>

                <div className="input-group error">
                  <input
                    placeholder="비밀번호를 다시 입력해 주세요."
                    className="form-input"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {confirmPassword.length > 0 && (
                    <img
                      className="input-icon clear-btn"
                      onClick={handleClearConfirmPassword}
                      src={ic_clear_btn_gray400_20}
                      alt="입력 내용 지우기"
                    />
                  )}
                  <img src={error_Item} alt="" />
                  <img
                    src={
                      isConfirmPasswordVisible
                        ? ic_visibility_off_gray700_20
                        : ic_visibility_gray700_20
                    }
                    onClick={toggleConfirmPasswordVisibility}
                    alt=""
                  />
                </div>

                <p className="error_text_red">{passwordErrorMessage}</p>
                <p className="form-tip_text_gray">
                  ※ 영문, 숫자, 특수문자를 모두 포함한 8~16자로 입력해 주세요.
                </p>
              </div>
            </div>
          )}

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
                <button type="button" className="default_btn_white" onClick={handleVerification}>
                  본인 인증
                </button>
              </div>
              <p className="error_text_red">본인 인증을 완료해 주세요.</p>
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
                <button type="button" className="default_btn_white" onClick={handleVerification}>
                  본인 인증
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

          {/* 성별 */}
          <div className="toggle-group">
            <label className="label" htmlFor="email">
              성별 <em>*</em>
            </label>
            <div className="gender-btn_wrap">
              <button
                type="button"
                className={`default_btn_white ${selectedGender === 1 ? "on" : ""}`}
                onClick={() => setSelectedGender(1)}
              >
                남성
              </button>
              <button
                type="button"
                className={`default_btn_white ${selectedGender === 2 ? "on" : ""}`}
                onClick={() => setSelectedGender(2)}
              >
                여성
              </button>
            </div>
          </div>
        </div>

        {/* 약관 */}
        <div className="consent-card">
          <div className="consent-item--all">
            <input type="checkbox" checked={isAllAgreed} onChange={handleAllCheck} />
            <span className="consent-label">전체 동의</span>
          </div>

          <div className="consent-item">
            <label className="consent-item__control">
              <input type="checkbox" checked={isOver14} onChange={handleSingleCheck(setIsOver14)} />
              <span className="consent-item__label">
                <em className="consent-badge badge--required">(필수)</em>만 14세 이상
              </span>
            </label>
          </div>

          <div className="consent-item">
            <label className="consent-item__control">
              <input
                type="checkbox"
                checked={isPaidTermsAgreed}
                onChange={handleSingleCheck(setIsPaidTermsAgreed)}
              />
              <span className="consent-item__label">
                <em className="consent-badge badge--required">(필수)</em>유료 서비스 이용약관 동의
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
              <input type="checkbox" checked={isTermsAgreed} onChange={handleSingleCheck(setIsTermsAgreed)} />
              <span className="consent-item__label">
                <em className="consent-badge badge--required">(필수)</em>이용약관 동의
              </span>
            </label>
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="consent-item__view">
              보기
            </a>
          </div>

          <div className="consent-item">
            <label className="consent-item__control">
              <input
                type="checkbox"
                checked={isPrivacyAgreed}
                onChange={handleSingleCheck(setIsPrivacyAgreed)}
              />
              <span className="consent-item__label">
                <em className="consent-badge badge--required">(필수)</em>개인정보 수집 및 이용 동의
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
                <input type="checkbox" checked={isMarketingChecked} onChange={handleMarketingParent} />
                <span className="consent-item__label">
                  <em className="badge--optional">(선택)</em>이벤트 및 서비스 안내 수신 동의
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
                <input type="checkbox" checked={isEmailConsent} onChange={handleMarketingChild(setIsEmailConsent)} />
                이메일
              </label>
              <label className="consent-option">
                <input type="checkbox" checked={isPushConsent} onChange={handleMarketingChild(setIsPushConsent)} />
                APP Push 알림
              </label>
            </div>

            <div className="consent-item__options mobile">
              <img src={ic_turn_right_gray400_22x21} alt="" />
              <label className="consent-option">
                <input type="checkbox" checked={isEmailConsent} onChange={handleMarketingChild(setIsEmailConsent)} />
                이메일
              </label>
              <label className="consent-option">
                <input type="checkbox" checked={isPushConsent} onChange={handleMarketingChild(setIsPushConsent)} />
                APP Push 알림
              </label>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="form-actions">
          <button className="btn_w_full default_btn_white" type="button" onClick={() => navigate("/login")}>
            취소
          </button>

          <button className="btn_w_full default_btn_black" type="button" onClick={handleSignup}>
            가입하기
          </button>
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
    </div>
  );
}
