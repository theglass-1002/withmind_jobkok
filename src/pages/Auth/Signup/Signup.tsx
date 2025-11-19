import React, { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ic_clear_btn_gray400_20 from '@/assets/icons/size20/ic_clear_btn_gray400_20.png';
import error_Item from '@/assets/icons/size20/ic_error_red100_20.png';
import ic_check_circle_green_20 from '@/assets/icons/size20/ic_check_circle_green_20.png';
import ic_visibility_gray700_20 from '@/assets/icons/size20/ic_visibility_gray700_20.png';
import ic_visibility_off_gray700_20 from '@/assets/icons/size20/ic_visibility_off_gray700_20.png';
import calendar_today from '@/assets/icons/size20/ic_calendar_gray700_20.png';
import ic_turn_right_gray400_22x21 from '@/assets/icons/ic_turn_right_gray400_22x21.png';

import "./Signup.css";


export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false); 
  const [emailErrorType, setEmailErrorType] = useState(0); 
  //0: 오류 없음 이메일을 입력해 주세요. / 이미 가입된 이메일입니다. 해당 이메일로 로그인해 주세요. / 중복 확인을 완료해 주세요.

 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [isPasswordVisible, setIsPasswordVisible] = useState(false);
 const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

 const [passwordErrorType, setPasswordErrorType] = useState(0); 
 //0: 오류 없음  비밀번호를 입력해 주세요. / 입력한 비밀번호를 확인해 주세요. / 비밀번호가 일치하지 않습니다.


 const [isIdentityVerified, setIsIdentityVerified] = useState(false);
 const [identityVerifiedError, setIdentityVerifiedError] = useState(false);

 const [selectedGender, setSelectedGender] = useState(1); 


   // --- 동의 항목 상태 (새로 추가) ---
   const [isOver14, setIsOver14] = useState(false);           // 만 14세 이상 (필수)
   const [isPaidTermsAgreed, setIsPaidTermsAgreed] = useState(false); // 유료 서비스 이용약관 (필수)
   const [isTermsAgreed, setIsTermsAgreed] = useState(false);     // 이용약관 (필수)
   const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);   // 개인정보 수집 및 이용 (필수)
   
   // 선택 항목: 이벤트 및 서비스 안내 수신 동의 (마케팅)
   const [isEmailConsent, setIsEmailConsent] = useState(false);     // 이메일 수신 (선택 자식)
   const [isPushConsent, setIsPushConsent] = useState(false);       // 앱 푸시 알림 (선택 자식)
   
   // 1. 마케팅 항목 체크 상태 (자식 중 하나라도 체크되면 true)
   const isMarketingChecked = isEmailConsent || isPushConsent;
     
  // 2. 전체 동의 상태
  const isAllAgreed = useMemo(() => {
    return (
      isOver14 &&
      isPaidTermsAgreed &&
      isTermsAgreed &&
      isPrivacyAgreed &&
      // 선택 항목은 자식 중 하나라도 체크되거나, 아예 체크 해제되어야 전체 동의가 될 수 있음
      (isEmailConsent || isPushConsent || (!isEmailConsent && !isPushConsent))
    );
  }, [isOver14, isPaidTermsAgreed, isTermsAgreed, isPrivacyAgreed, isEmailConsent, isPushConsent]);

  const handleAllCheck = (e) => {
    const isChecked = e.target.checked;
    
    // 필수 항목 모두 업데이트
    setIsOver14(isChecked);
    setIsPaidTermsAgreed(isChecked);
    setIsTermsAgreed(isChecked);
    setIsPrivacyAgreed(isChecked);
    
    // 선택 항목 자식들 모두 업데이트
    setIsEmailConsent(isChecked);
    setIsPushConsent(isChecked);
  };

  // 개별 동의 체크박스 핸들러
  const handleSingleCheck = (setter) => (e) => {
    setter(e.target.checked);
  };


  // 선택 항목 부모 체크박스 핸들러 (새로 추가)
  const handleMarketingParent = (e) => {
    const isChecked = e.target.checked;
    // 부모가 체크/해제되면 자식 항목들을 일괄적으로 업데이트
    setIsEmailConsent(isChecked);
    setIsPushConsent(isChecked);
};

// 선택 항목 자식 체크박스 핸들러 (새로 추가)
const handleMarketingChild = (setter) => (e) => {
    const isChecked = e.target.checked;
    setter(isChecked);

};


const handleSignup = (e) => {
  e.preventDefault(); // 기본 폼 제출 방지

  // 필수 항목 체크
  const isRequiredAgreed = isOver14 && isPaidTermsAgreed && isTermsAgreed && isPrivacyAgreed;

  if (isRequiredAgreed) {
    console.log(true);
    // alert("필수 약관 동의가 완료되어 가입을 진행합니다.");
  } else {
    setEmailErrorType(1);
    setPasswordErrorType(2);
    setIdentityVerifiedError(true);
    toast.success("필수 약관에 모두 동의해야 합니다.");
    // alert("필수 약관에 모두 동의해야 합니다.");
  }
};


  const handleClearEmail = () => {
    setEmail('');
    setIsEmailChecked(false); 
  };

  const handleDuplicateCheck = () => {
    setEmailErrorType(0);
    if (email.length > 0) {
      console.log(`Checking email: ${email}`);
      setIsEmailChecked(true); 
    } else {
      setIsEmailChecked(false);
    }
  };


  const handleClearPassword = () => {
    setPassword('');
  };
  
  const handleClearConfirmPassword = () => {
    setConfirmPassword('');
  };


  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleVerification = () => {
    setIdentityVerifiedError(false);
    setIsIdentityVerified(true);
  };


  // error

  const emailErrorMessage = useMemo(() => {
    switch (emailErrorType) {
      case 1:
        return "이메일을 입력해 주세요. ";
      case 2:
        return "이미 가입된 이메일입니다. 해당 이메일로 로그인해 주세요.";
      case 3:
        return "중복 확인을 완료해 주세요.";
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
      default:
        return "";
    }
  }, [passwordErrorType]);





  

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
            {emailErrorType==0?<div className="input-group">
              <input
                className="form-input"
                type="email"
                aria-invalid="true"
                aria-describedby="email-error"
                placeholder="이메일을 입력해 주세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            
            {email.length > 0 && (
                  isEmailChecked ? (
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
                  )
                )}
            </div>:
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
          
            <img className="input-icon email_check" 
                    src={error_Item} 
                    alt="이메일 확인 완료"
                  />
          </div>
            }
            <button type="button" className="default_btn_white" onClick={handleDuplicateCheck} >
              중복확인
            </button>
          </div>
          <p id="email-error" className="error_text_red">
           {emailErrorMessage}
          </p>
          </div>

          {passwordErrorType==0?
           <div className="pwd-group">
           <div className="field in_icon">
           <label className="label" htmlFor="password">
             비밀번호
           </label>
           <div className="input-group">
             <input placeholder="비밀번호를 입력해 주세요." className="form-input" type={isPasswordVisible ? "text" : "password"}  value={password}  onChange={(e) => setPassword(e.target.value)} required/>
             <img className="input-icon clear-btn" 
                       onClick={handleClearPassword}
                       src={ic_clear_btn_gray400_20} 
                       alt="입력 내용 지우기" 
                 />
              {/* <img src={error_Item} alt="" /> */}
              <img src={isPasswordVisible ? ic_visibility_off_gray700_20 : ic_visibility_gray700_20} onClick={togglePasswordVisibility}  alt="" />
      
           </div>
           <div className="input-group">
             <input placeholder="비밀번호를 다시 입력해 주세요." className="form-input"  type={isConfirmPasswordVisible ? "text" : "password"} value={confirmPassword}  onChange={(e) => setConfirmPassword(e.target.value)} required/>
              <img      className="input-icon clear-btn" 
                       onClick={handleClearConfirmPassword}
                       src={ic_clear_btn_gray400_20} 
                       alt="입력 내용 지우기" 
                 />
              {/* <img src={error_Item} alt="" /> */}
              <img   src={isConfirmPasswordVisible ? ic_visibility_off_gray700_20 : ic_visibility_gray700_20} onClick={toggleConfirmPasswordVisibility} alt="" />
           </div>
          </div>
           </div>:
            <div className="pwd-group">
            <div className="field in_icon">
            <label className="label" htmlFor="password">
              비밀번호
            </label>
            <div className="input-group error">
              <input placeholder="비밀번호를 입력해 주세요." className="form-input" type={isPasswordVisible ? "text" : "password"}  value={password}  onChange={(e) => setPassword(e.target.value)} required/>
              {password.length>0&& <img className="input-icon clear-btn" 
                       onClick={handleClearPassword}
                       src={ic_clear_btn_gray400_20} 
                       alt="입력 내용 지우기" 
                 />}
               <img src={error_Item} alt="" />
               <img src={isPasswordVisible ? ic_visibility_off_gray700_20 : ic_visibility_gray700_20} onClick={togglePasswordVisibility}  alt="" />
       
            </div>
            <div className="input-group error">
              <input placeholder="비밀번호를 다시 입력해 주세요." className="form-input"  type={isConfirmPasswordVisible ? "text" : "password"} value={confirmPassword}  onChange={(e) => setConfirmPassword(e.target.value)} required/>
              {confirmPassword.length>0&& <img className="input-icon clear-btn" 
                       onClick={handleClearConfirmPassword}
                       src={ic_clear_btn_gray400_20} 
                       alt="입력 내용 지우기" 
                 />}
               <img src={error_Item} alt="" />
               <img   src={isConfirmPasswordVisible ? ic_visibility_off_gray700_20 : ic_visibility_gray700_20} onClick={toggleConfirmPasswordVisibility} alt="" />
            </div>
            <p className="error_text_red">{passwordErrorMessage}</p>
            <p className="form-tip_text_gray">※ 영문, 숫자, 특수문자를 모두 포함한 8~16자로 입력해 주세요.</p>
           </div>
            </div>
           }
          {identityVerifiedError?   <div className="number-group">
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
          <p className="error_text_red">
          본인 인증을 완료해 주세요.
          </p>
          </div>: <div className="number-group">
          <label className="label">
          휴대폰 번호 <em>*</em>
          </label>
          <div className="input-row">
            <div className="data-group">
            {isIdentityVerified?"010-1234-5678":"본인 인증을 진행해 주세요."}
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
          </div>}
          {/* <div className="number-group">
          <label className="label">
          휴대폰 번호 <em>*</em>
          </label>
          <div className="input-row">
            <div className="data-group">
            {isIdentityVerified?"010-1234-5678":"본인 인증을 진행해 주세요."}
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
          <p className="error_text_red">
          본인 인증을 완료해 주세요.
          </p>
          </div> */}

          <div className="name-group">
          <label className="label">
            이름 <em>*</em>
          </label>
          <div className="input-row">
            <div className="data-group">
            {isIdentityVerified?"홍길동":"본인 인증을 진행해 주세요."}
            
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
            alt="본인 인증 완료"
            />
            {isIdentityVerified?"2000.01.01":"YYYY.MM.DD"}
        
            </div>
          </div>
          </div>


          <div className="toggle-group">
          <label className="label" htmlFor="email">
          성별 <em>*</em>
          </label>
           <div className="gender-btn_wrap">
            <button className={`default_btn_white ${selectedGender==1?'on':''}`} onClick={()=>{setSelectedGender(1)}}>남성</button>
            <button className={`default_btn_white ${selectedGender==2?'on':''}`} onClick={()=>{setSelectedGender(2)}}>여성</button>
           </div>
          </div>

        </div>
        <div className="consent-card">
          <div className="consent-item--all">
            <input type="checkbox" checked={isAllAgreed} onChange={handleAllCheck}
                  />
            <span className="consent-label">전체 동의</span>
          </div>

          <div className="consent-item">
            <label className="consent-item__control">
              <input type="checkbox" 
                     checked={isOver14} 
                     onChange={handleSingleCheck(setIsOver14)}
              />
              <span className="consent-item__label">
                <em className="consent-badge badge--required">(필수)</em>
                만 14세 이상
              </span>
            </label>
             <Link className="consent-item__view" to={""}>보기</Link>
            </div>
            <div className="consent-item">
            <label className="consent-item__control">
              <input type="checkbox" 
               checked={isPaidTermsAgreed}
               onChange={handleSingleCheck(setIsPaidTermsAgreed)}
              />
              <span className="consent-item__label">
                <em className="consent-badge badge--required">(필수)</em>
                유료 서비스 이용약관 동의
              </span>
            </label>
             <Link className="consent-item__view" to={""}>보기</Link>
            </div>
            <div className="consent-item">
            <label className="consent-item__control">
              <input type="checkbox" 
               checked={isTermsAgreed}
               onChange={handleSingleCheck(setIsTermsAgreed)}
              />
              <span className="consent-item__label">
                <em className="consent-badge badge--required">(필수)</em>
                이용약관 동의
              </span>
            </label>
             <Link className="consent-item__view" to={""}>보기</Link>
            </div>
            <div className="consent-item">
            <label className="consent-item__control">
              <input type="checkbox" 
                    checked={isPrivacyAgreed}
                    onChange={handleSingleCheck(setIsPrivacyAgreed)}
              />
              <span className="consent-item__label">
                <em className="consent-badge badge--required">(필수)</em>
                개인정보 수집 및 이용 동의
              </span>
            </label>
             <Link className="consent-item__view" to={""}>보기</Link>
            </div>
            <div className="consent-item--optional">
              <div className="consent-item">
                <label className="consent-item__control">
                  <input type="checkbox" 
                     checked={isMarketingChecked} 
                     onChange={handleMarketingParent} 
                  />
                  <span className="consent-item__label">
                    <em className="badge--optional">(선택)</em>
                    이벤트 및 서비스 안내 수신 동의
                  </span>
                </label>
                <Link className="consent-item__view" to="/terms/marketing">보기</Link>
              </div>

              <div className="consent-item__options">
                <label className="consent-option">
                  <input type="checkbox"
                   checked={isEmailConsent}
                   onChange={handleMarketingChild(setIsEmailConsent)}
                  /> 이메일
                </label>
                <label className="consent-option">
                  <input type="checkbox"
                  checked={isPushConsent}
                  onChange={handleMarketingChild(setIsPushConsent)}
                  /> APP Push 알림
                </label>
              </div>

              <div className="consent-item__options mobile">
                <img src={ic_turn_right_gray400_22x21} alt="" />
                <label className="consent-option">
                  <input type="checkbox"
                   checked={isEmailConsent}
                   onChange={handleMarketingChild(setIsEmailConsent)}
                  /> 이메일
                </label>
                <label className="consent-option">
                  <input type="checkbox"
                  checked={isPushConsent}
                  onChange={handleMarketingChild(setIsPushConsent)}
                  /> APP Push 알림
                </label>
              </div>
            </div>
        </div>
        <div className="form-actions">
       
            <button className="btn_w_full default_btn_white"
            onClick={()=>{navigate('/login')}}
            >취소</button>
      
         
            <button className="btn_w_full default_btn_black"
              onClick={handleSignup}
            >가입하기</button>
        </div>
      </div>

    </div>
  );
}

