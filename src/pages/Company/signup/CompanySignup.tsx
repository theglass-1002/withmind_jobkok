import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import "./CompanySignup.css";
import ic_visibility_gray700_20 from "@/assets/icons/size20/ic_visibility_gray700_20.png";
import ic_visibility_off_gray700_20 from "@/assets/icons/size20/ic_visibility_off_gray700_20.png";
import ic_calendar_gray700_20 from "@/assets/icons/size20/ic_calendar_gray700_20.png";



export default function CompanySignup() {
    const navigate = useNavigate();
    
    const [company_name, setCompanyName] = useState('');
    const [business_no, setBusinessNo] = useState('');
    const [owner_name, setOwnerName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const togglePassword = () => setShowPassword((p) => !p);
    const togglePasswordConfirm = () => setShowPasswordConfirm((p) => !p);

   


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


  return (
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
                onChange={(e) => setBusinessNo(e.target.value)}
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

                <button className="default_btn_white company-signup__verify-btn">
                    중복 확인
                </button>
                </div>
            </div>

            <div className="company_name-group input-group">
            <label className="label">비밀번호 <em>*</em></label>
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
                src={showPasswordConfirm ? ic_visibility_off_gray700_20 : ic_visibility_gray700_20}
                className="company-signup__toggle-password"
                alt={showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
                onClick={togglePasswordConfirm}
                />
            </div>
            <span className="helper_txt">※ 영문, 숫자, 특수문자를 모두 포함한 8~16자로 입력해 주세요.</span>
          </div>

          <div className="company_name-group input-group">
            <label className="label">
            관리자 휴대폰 번호 <em>*</em>
            </label>
            <div className="company-signup__field-with-btn">
                <div className="company-signup__input-wrap admin_phone">
                     본인 인증을 진행해 주세요.
                </div>

                <button className="default_btn_white company-signup__verify-btn">
                    본인 인증
                </button>
                </div>
            </div>
            <div className="company_name-group input-group">
            <label className="label">
                이름 <em>*</em>
            </label>
            <div className="company-signup__input-wrap admin_name">
                본인 인증을 진행해 주세요.
          </div>
          </div>
          <div className="company_name-group input-group">
            <label className="label">
                생년월일 <em>*</em>
            </label>
            <div className="company-signup__input-wrap birth">
            <img src={ic_calendar_gray700_20} alt="" />
             YYYY.MM.DD
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
            </div>
             </div>  

            <div className="company-signup_btn_wrap">
             <button className="btn_w_full default_btn_white"
              onClick={() => { navigate('/company/login') }}
             >취소</button>
             <button className="btn_w_full default_btn_black"
              onClick={() => { navigate('/company') }}
             >가입하기</button>
            </div>     
         </div>
        </div>

  )
}