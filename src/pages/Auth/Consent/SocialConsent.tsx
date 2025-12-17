import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ic_turn_right_gray400_22x21 from "@/assets/icons/ic_turn_right_gray400_22x21.png";
import { toast } from "react-toastify";
import { kakaoOauthLogin } from "@/api/auth.api";
import { deviceId } from "@/shared/utils/util";

type SnsAuthPayload = {
  code: number;
  provider: string; // "kakao"
  exists: boolean;
  needTerms: boolean;
  preauthToken: string;
  profile?: {
    email?: string;
    name?: string;
  };
  providerUid?: string;
  suggestedUserId?: string;
  [key: string]: any; // 백엔드가 필드 더 줄 수도 있으니
};

const SocialConsent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const snsType = params.get("snsType"); // "kakao"

  // ✅ Login에서 navigate state로 넘긴 값 받기
  const snsAuth = (location.state as any)?.snsAuth as SnsAuthPayload | undefined;

  // --- 동의 항목 상태 ---
  const [isOver14, setIsOver14] = useState(false); // (필수) 만 14세 이상
  const [isPaidTermsAgreed, setIsPaidTermsAgreed] = useState(false); // (필수) 유료서비스 약관
  const [isTermsAgreed, setIsTermsAgreed] = useState(false); // (필수) 이용약관
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false); // (필수) 개인정보

  // (선택) 마케팅 수신 동의
  const [isEmailConsent, setIsEmailConsent] = useState(false);
  const [isPushConsent, setIsPushConsent] = useState(false);

  const isMarketingChecked = isEmailConsent || isPushConsent;

  // ✅ 페이지 진입 시 snsAuth 확인 + 로그
  useEffect(() => {
    console.log("snsType:", snsType);
    console.log("snsAuth(넘겨받은 값):", snsAuth);

    // 새로고침/직접 접근 시 state가 날아갈 수 있음
    if (!snsAuth) {
      toast.error("소셜 로그인 정보가 없습니다. 다시 시도해 주세요.");
      navigate("/login");
      return;
    }
  }, [snsAuth, snsType, navigate]);

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

    setIsOver14(checked);
    setIsPaidTermsAgreed(checked);
    setIsTermsAgreed(checked);
    setIsPrivacyAgreed(checked);

    setIsEmailConsent(checked);
    setIsPushConsent(checked);
  };

  const handleSingleCheck =
    (setter: (v: boolean) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  const handleMarketingParent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsEmailConsent(checked);
    setIsPushConsent(checked);
  };

  const handleMarketingChild =
    (setter: (v: boolean) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  // ✅ 동의 완료
  const handleNext = async () => {
    const isRequiredAgreed =
      isOver14 && isPaidTermsAgreed && isTermsAgreed && isPrivacyAgreed;
  
    if (!isRequiredAgreed) {
      toast.info("필수 약관에 모두 동의해야 합니다.");
      return;
    }
  
    console.log("✅ 동의 완료(약관)", {
      isOver14,
      isPaidTermsAgreed,
      isTermsAgreed,
      isPrivacyAgreed,
      isEmailConsent,
      isPushConsent,
    });
  
    console.log("✅ snsType:", snsType);
    console.log("✅ snsAuth 전체:", snsAuth);
  
    console.log("✅ snsAuth.profile:", snsAuth?.profile);
    console.log("✅ providerUid:", snsAuth?.providerUid);
    console.log("✅ suggestedUserId:", snsAuth?.suggestedUserId);
    console.log("✅ preauthToken:", snsAuth?.preauthToken);
  
    try {
      if (snsType === "kakao") {
        if (!snsAuth?.preauthToken) {
          toast.error("소셜 인증 정보가 없습니다. 다시 로그인해 주세요.");
          return;
        }
        
        const data = await kakaoOauthLogin({
          authorizationCode: snsAuth.preauthToken, // ⚠️ 아래 설명 참고
          deviceId: deviceId(), // "postman-web" 말고 너 util 쓰는 게 좋음
        });
  
        console.log("✅ kakaoOauthLogin 응답:", data);
        // TODO: 토큰 저장 / 이동 처리
        // navigate("/");
      }
    } catch (e) {
      console.error("❌ kakaoOauthLogin 실패:", e);
      toast.error("카카오 로그인 처리 중 오류가 발생했습니다.");
      navigate("/login");
    }
  };
  

  const handleCancel = () => {
    navigate("/login");
  };

  // snsAuth가 없으면 렌더 전에 막기 (useEffect에서 navigate 하지만 깜빡임 방지)
  if (!snsAuth) return null;

  return (
    <div className="consent-page">
      <div className="consent-contatiner">
        <h1 className="signup-title">회원 가입</h1>
        <span className="sub-title">
          회원이 되시면 AI면접서비스를 간편하게 이용하실 수 있습니다.
        </span>

        <div className="signup-card">
          <div className="consent-card">
            {/* 전체 동의 */}
            <div className="consent-item--all">
              <input type="checkbox" checked={isAllAgreed} onChange={handleAllCheck} />
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
