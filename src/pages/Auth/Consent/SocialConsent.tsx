// SocialConsent.tsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import ic_turn_right_gray400_22x21 from "@/assets/icons/ic_turn_right_gray400_22x21.png";

const SocialConsent: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const snsType = params.get("snsType"); // "kakao"


  // --- 동의 항목 상태 ---
  const [isOver14, setIsOver14] = useState(false);              // 만 14세 이상 (필수)
  const [isPaidTermsAgreed, setIsPaidTermsAgreed] = useState(false); // 유료 서비스 이용약관 (필수)
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);        // 이용약관 (필수)
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);    // 개인정보 수집 및 이용 (필수)

  // 선택 항목: 이벤트 및 서비스 안내 수신 동의 (마케팅)
  const [isEmailConsent, setIsEmailConsent] = useState(false); // 이메일 수신 (선택)
  const [isPushConsent, setIsPushConsent] = useState(false);   // APP 푸시 알림 (선택)

  // 마케팅 부모 체크박스 상태 (자식 중 하나라도 true면 true)
  const isMarketingChecked = isEmailConsent || isPushConsent;

  // 전체 동의 상태
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

  // 전체 동의
  const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    // 필수 항목
    setIsOver14(checked);
    setIsPaidTermsAgreed(checked);
    setIsTermsAgreed(checked);
    setIsPrivacyAgreed(checked);

    // 선택 항목
    setIsEmailConsent(checked);
    setIsPushConsent(checked);
  };

  // 개별 필수 항목 체크
  const handleSingleCheck =
    (setter: (v: boolean) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  // 마케팅 부모
  const handleMarketingParent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsEmailConsent(checked);
    setIsPushConsent(checked);
  };

  // 마케팅 자식
  const handleMarketingChild =
    (setter: (v: boolean) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  // 동의 완료 후 다음 단계로
  const handleNext = () => {
    const isRequiredAgreed =
      isOver14 && isPaidTermsAgreed && isTermsAgreed && isPrivacyAgreed;

    if (!isRequiredAgreed) {
      alert("필수 약관에 모두 동의해야 합니다.");
      return;
    }

    // TODO: 동의 정보 서버로 보내거나 상태에 저장하고, 다음 페이지로 이동
    // 예: navigate("/signup");
    console.log("동의 완료", {
      isOver14,
      isPaidTermsAgreed,
      isTermsAgreed,
      isPrivacyAgreed,
      isEmailConsent,
      isPushConsent,
    });

   // navigate("/signup"); // 필요에 따라 경로 수정
  };

  const handleCancel = () => {
    navigate("/login"); // 취소시 로그인으로
  };

  return (
    console.log(snsType),
    <div className="consent-page">
      <div className="consent-contatiner">
      <h1 className="signup-title">회원 가입</h1>
        <span className="sub-title">회원이 되시면 AI면접서비스를 간편하게 이용하실 수 있습니다.</span>
      <div className="signup-card">
        <div className="consent-card">
          {/* 전체 동의 */}
          <div className="consent-item--all">
            <input
              type="checkbox"
              checked={isAllAgreed}
              onChange={handleAllCheck}
            />
            <span className="consent-label">전체 동의</span>
          </div>

          {/* (필수) 만 14세 이상 */}
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
            <Link className="consent-item__view" to="">
              보기
            </Link>
          </div>

          {/* (필수) 유료 서비스 이용약관 동의 */}
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
            <Link className="consent-item__view" to="">
              보기
            </Link>
          </div>

          {/* (필수) 이용약관 동의 */}
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
            <Link className="consent-item__view" to="">
              보기
            </Link>
          </div>

          {/* (필수) 개인정보 수집 및 이용 동의 */}
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
            <Link className="consent-item__view" to="">
              보기
            </Link>
          </div>

          {/* (선택) 마케팅 수신 동의 */}
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

            {/* 자식 옵션 - 데스크톱 */}
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

            {/* 자식 옵션 - 모바일 */}
            <div className="consent-item__options mobile">
              <img src={ic_turn_right_gray400_22x21} alt="" />
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

        {/* 하단 버튼 */}
        <div className="form-actions">
          <button
            className="btn_w_full default_btn_white"
            type="button"
            onClick={handleCancel}
          >
            취소
          </button>
          <button
            className="btn_w_full default_btn_black"
            type="button"
            onClick={handleNext}
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
