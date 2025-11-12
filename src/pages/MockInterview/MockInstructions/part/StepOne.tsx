import React from 'react';
import { useNavigate } from 'react-router-dom';
import test_profile_img_530 from "@/assets/testImg/test_profile_img_530.png";
import mock_interview_screen from "@/assets/testImg/mock_interview_screen.png";
import ic_logout_white_24 from "@/assets/icons/size24/ic_logout_white_24.png";
import ic_keyboard_arrow_right_gray900_24 from "@/assets/icons/size24/ic_keyboard_arrow_right_gray900_24.png";

type StepOneProps = {
    onNext: () => void;
};

export default function StepOne({ onNext }: StepOneProps) {
  const navigate = useNavigate();

    return (
        <>
        <div className="mock-instructions__progress-bar">
            <span></span>
        </div>
        <div className="mock-instructions__content">
          <div className="mock-instructions__header">
              <span className="mock-instructions__step-label">안내사항 1/2</span>
              <span className="mock-instructions__title">면접 시 반드시 지켜주세요.</span>
          </div>
          <div className="mock-instructions__cards">
              <div className="mock-instructions__card">
                  <div className="mock-instructions__card-text">
                      <div className="mock-instructions__card-title">단정한 상태와 올바른 자세를 유지해 주세요.</div>
                      <span className="mock-instructions__card-description">얼굴과 어깨가 화면에 잘 보이도록 해 주세요.</span>
                  </div>
                  <div className="mock-instructions__card-image">
                       <img src={test_profile_img_530} alt="" />
                      <span className="mock-instructions__card-badge mock-instructions__card-badge--left">
                        <span className="mock-instructions__card-badge-text">올바른 자세로!</span>
                    </span>
                  </div>
              </div>
              <div className="mock-instructions__card">
                  <div className="mock-instructions__card-text">
                      <div className="mock-instructions__card-title">화면에는 지원자 한 분만 나오도록 해 주세요.</div>
                      <span className="mock-instructions__card-description">다른 사람이 함께 보이지 않도록 유의해 주세요.</span>
                  </div>
                  <div className="mock-instructions__card-image">
                  <img src={mock_interview_screen} alt="" />
                      <span className="mock-instructions__card-badge mock-instructions__card-badge--right">
                      <span className="mock-instructions__card-badge-text">화면엔 한 명만!</span>
                      </span>
                  </div>
              </div>
          </div>
        </div>
        <div className="btn_wrap">
          <button className="default_btn_white_08 radius"
          onClick={() => navigate('/')}>
            <img src={ic_logout_white_24} alt="" />
            나가기
          </button>
          <button className="default_btn_white radius" onClick={onNext}>
            다음으로
            <img src={ic_keyboard_arrow_right_gray900_24} alt="" />
          </button>
        </div>
      </>
    );
}