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
import { isValidEmail, isValidPassword, openAuthPopup, stripAllWhitespace } from "@/shared/utils/util";
import { 
  checkEmailDuplicate, 
  logout, 
  registerUser,
  saInit
} from "@/api/auth/auth.api";
import { ApiErrorResponse } from "@/api/axios.instance";
import { RegisterRequest, VerifiedUserInfo, InicisParams } from "@/api/auth/auth.types";
import { IsDev, LOCAL_BASE_URL, REAL_BASE_URL } from "@/config/config";

export default function Signup() {
  const navigate = useNavigate();
  const saFormRef = useRef<HTMLFormElement | null>(null);

  const [email, setEmail] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [emailErrorType, setEmailErrorType] = useState(0);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [passwordErrorType, setPasswordErrorType] = useState(0);

  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [identityVerifiedError, setIdentityVerifiedError] = useState(false);

  const [verifiedUserInfo, setVerifiedUserInfo] = useState<VerifiedUserInfo | null>(null);
  const [inicisParams, setInicisParams] = useState<InicisParams | null>(null);
  const [shouldSubmitForm, setShouldSubmitForm] = useState(false);

  const [selectedGender, setSelectedGender] = useState(1);

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
  }, [isOver14, isPaidTermsAgreed, isTermsAgreed, isPrivacyAgreed, isEmailConsent, isPushConsent]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        console.warn("허용되지 않은 origin:", event.origin);
        return;
      }

      if (event.data.type === 'INICIS_AUTH_SUCCESS') {
        const { name, phone, birth, ci } = event.data.data;

        console.log("본인인증 성공:", { name, phone, birth, ci });

        setIsIdentityVerified(true);
        setIdentityVerifiedError(false);
        setVerifiedUserInfo({ name, phone, birth, ci });

        toast.success(`${name}님, 본인인증이 완료되었습니다!`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!shouldSubmitForm || !inicisParams || !saFormRef.current) return;

    const form = saFormRef.current;
    form.target = "sa_popup";
    form.method = "POST";
    form.action = "https://sa.inicis.com/auth";
    
    console.log("폼 제출:", form.action);
    console.log("폼 데이터:", {
      mid: inicisParams.mid,
      mTxId: inicisParams.mTxId,
      successUrl: inicisParams.successUrl
    });
    
    form.submit();
    
    setShouldSubmitForm(false);
  }, [shouldSubmitForm, inicisParams]);

  const handleDuplicateCheck = async () => {
    if (!email) {
      setEmailErrorType(1);
      return;
    }
    if (!isValidEmail(email)) {
      setEmailErrorType(4);
      return;
    }
    const trimmedEmail = stripAllWhitespace(email);

    try {
      const result = await checkEmailDuplicate(trimmedEmail);
      console.log('이메일 중복확인 결과:', result);
      
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

  const validateEmailCheck = (): boolean => {
    if (!isEmailChecked) {
      setEmailErrorType(3);
      return false;
    }
    return true;
  };

  const validatePassword = (): boolean => {
    const trimmedPassword = stripAllWhitespace(password);
    const trimmedConfirmPassword = stripAllWhitespace(confirmPassword);

    if (!trimmedPassword) {
      setPasswordErrorType(1);
      return false;
    }

    if (!trimmedConfirmPassword) {
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

  const validateIdentityVerification = (): boolean => {
    if (!isIdentityVerified) {
      setIdentityVerifiedError(true);
      return false;
    }
    return true;
  };

  const validateAgreements = (): boolean => {
    const isRequiredAgreed = isOver14 && isPaidTermsAgreed && isTermsAgreed && isPrivacyAgreed;

    if (!isRequiredAgreed) {
      toast.error("필수 약관에 모두 동의해야 합니다.");
      return false;
    }

    return true;
  };

  const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsOver14(isChecked);
    setIsPaidTermsAgreed(isChecked);
    setIsTermsAgreed(isChecked);
    setIsPrivacyAgreed(isChecked);
    setIsEmailConsent(isChecked);
    setIsPushConsent(isChecked);
  };

  const handleSingleCheck = (setter: (v: boolean) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.checked);
  };

  const handleMarketingParent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsEmailConsent(isChecked);
    setIsPushConsent(isChecked);
  };

  const handleMarketingChild = (setter: (v: boolean) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.checked);
  };

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    console.log("회원가입 검증 시작");

    if (!validateEmailCheck()) {
      console.log("이메일 중복 확인 실패");
      return;
    }

    if (!validatePassword()) {
      console.log("비밀번호 검증 실패");
      return;
    }

    if (!validateIdentityVerification()) {
      console.log("본인 인증 검증 실패");
      return;
    }

    if (!validateAgreements()) {
      console.log("필수 동의 항목 검증 실패");
      return;
    }

    console.log("모든 검증 통과!");

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
      birthdate: verifiedUserInfo.birth.replace(/-/g, ''),
      gender: selectedGender === 1 ? "M" : "W",
      phone: verifiedUserInfo.phone.replace(/-/g, ''),
      email: trimmedEmail,
    };
    
    console.log("회원가입 보낼값!", regisData);

    try {
      const result = await registerUser(regisData);
      if (result.code == 200) {
        logout();
        navigate("/login");
        toast.success('회원가입 완료');
      }
    } catch (error) {
      logout();
      const e = error as ApiErrorResponse;
      console.log("에러코드:", e.code);
      console.log(e);
      if (e.code == 400) {
        return toast.error("존재하는 계정입니다.");
      } else {
        return toast.error(`관리자에게 문의해주세요 Ecode:${e.code}`);
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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleVerification = async () => {
    try {
      console.log("1. saInit 호출...");
      const init = await saInit();
      console.log("2. saInit 응답:", init);
       const baseUrl = IsDev ? "http://localhost:5173" : REAL_BASE_URL;
       const callbackUrl = `${baseUrl}/inicis/callback`;
      const userName = "";
      const userPhone = "";
      const userBirth = "";
 

      const params = {
        mid: init.mid,
        reqSvcCd: init.reqSvcCd,
        mTxId: init.mtxId,
        authHash: init.authHash,
        flgFixedUser: init.flgFixedUser,
        userName,
        userPhone,
        userBirth,
        userHash: "",
        reservedMsg: init.reservedMsg ?? "isUseToken=N",
        directAgency: "",
        successUrl: callbackUrl,
        failUrl: callbackUrl,
         //successUrl: init.callbackUrl,
         //failUrl: init.callbackUrl,
      };

      console.log("3. 팝업 열기");
      const popup = openAuthPopup();
      if (!popup) {
        alert("팝업이 차단되었습니다. 브라우저 팝업 허용을 확인해 주세요.");
        return;
      }

      console.log("4. State 업데이트");
      setInicisParams(params);

      console.log("5. 폼 제출 트리거");
      setTimeout(() => {
        setShouldSubmitForm(true);
      }, 150);
      
    } catch (error) {
      console.error("본인인증 준비 실패:", error);
    }
  };

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

  return (
    <div className="signup-page">
      <h1 className="signup-title">회원가입</h1>
      <div className="signup-card">
        <div className="field form-group form-group--with-icon">
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
                  <img
                    className="input-icon email_check"
                    src={error_Item}
                    alt="이메일 오류"
                  />
                </div>
              )}
              <button
                type="button"
                className="default_btn_white"
                onClick={handleDuplicateCheck}
              >
                중복확인
              </button>
            </div>
            <p id="email-error" className="error_text_red">
              {emailErrorMessage}
            </p>
          </div>

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
                    src={
                      isPasswordVisible
                        ? ic_visibility_off_gray700_20
                        : ic_visibility_gray700_20
                    }
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
                <span className="password_info">※ 영문, 숫자, 특수문자를 모두 포함한 8~16자로 입력해 주세요.</span>
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
                    src={
                      isPasswordVisible
                        ? ic_visibility_off_gray700_20
                        : ic_visibility_gray700_20
                    }
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
                >
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
                <button
                  type="button"
                  className="default_btn_white"
                  onClick={handleVerification}
                >
                  본인 인증
                </button>
              </div>
            </div>
          )}

          <div className="name-group">
            <label className="label">
              이름 <em>*</em>
            </label>
            <div className="input-row">
              <div className="data-group">
                {isIdentityVerified && verifiedUserInfo
                  ? verifiedUserInfo.name
                  : "본인 인증을 진행해 주세요."}
              </div>
            </div>
          </div>

          <div className="birth-group">
            <label className="label">
              생년월일 <em>*</em>
            </label>
            <div className="input-row">
              <div className="data-group">
                <img
                  className="input-icon email_check"
                  src={calendar_today}
                  alt="생년월일"
                />
                {isIdentityVerified && verifiedUserInfo
                  ? formatBirth(verifiedUserInfo.birth)
                  : "YYYY.MM.DD"}
              </div>
            </div>
          </div>

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

        <div className="consent-card">
          <div className="consent-item--all">
            <input
              type="checkbox"
              checked={isAllAgreed}
              onChange={handleAllCheck}
            />
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
                />
                이메일
              </label>
              <label className="consent-option">
                <input
                  type="checkbox"
                  checked={isPushConsent}
                  onChange={handleMarketingChild(setIsPushConsent)}
                />
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
                />
                이메일
              </label>
              <label className="consent-option">
                <input
                  type="checkbox"
                  checked={isPushConsent}
                  onChange={handleMarketingChild(setIsPushConsent)}
                />
                APP Push 알림
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            className="btn_w_full default_btn_white"
            type="button"
            onClick={() => navigate("/login")}
          >
            취소
          </button>

          <button
            className="btn_w_full default_btn_black"
            type="button"
            onClick={handleSignup}
          >
            가입하기
          </button>
        </div>
      </div>

      {inicisParams && (
        <form ref={saFormRef} name="saForm" style={{ display: "none" }}>
          <input type="hidden" name="mid" value={inicisParams.mid} />
          <input type="hidden" name="reqSvcCd" value={inicisParams.reqSvcCd} />
          <input type="hidden" name="mTxId" value={inicisParams.mTxId} />
          <input type="hidden" name="authHash" value={inicisParams.authHash} />
          <input type="hidden" name="flgFixedUser" value={inicisParams.flgFixedUser} />
          <input type="hidden" name="userName" value={inicisParams.userName} />
          <input type="hidden" name="userPhone" value={inicisParams.userPhone} />
          <input type="hidden" name="userBirth" value={inicisParams.userBirth} />
          <input type="hidden" name="userHash" value={inicisParams.userHash} />
          <input type="hidden" name="reservedMsg" value={inicisParams.reservedMsg} />
          <input type="hidden" name="directAgency" value={inicisParams.directAgency} />
          <input type="hidden" name="successUrl" value={inicisParams.successUrl} />
          <input type="hidden" name="failUrl" value={inicisParams.failUrl} />
        </form>
      )}
    </div>
  );
}