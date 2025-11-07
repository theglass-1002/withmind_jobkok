import React from 'react';
import "./MockInstructions.css";
import test_profile_img_530 from "@/assets/testImg/test_profile_img_530.png";
import mock_interview_screen from "@/assets/testImg/mock_interview_screen.png";

export default function MockInstructions() {
    return (
      <div className="mock-instructions-page">
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
                      <span className="mock-instructions__card-badge">
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
                      <span className="mock-instructions__card-badge">화면엔 한 명만!</span>
                  </div>
              </div>
          </div>
        </div>
        <div className="mock-instructions__actions">
          <button className="mock-instructions__btn mock-instructions__btn--secondary">나가기</button>
          <button className="mock-instructions__btn mock-instructions__btn--primary">다음으로</button>
        </div>
      </div>
    );
  }


// ── instructions/
//             ├── MockInterviewInstructions.tsx
//             ├── MockInterviewInstructions.css
//             ├── StepOne.tsx
//             ├── StepOne.css
//             ├── StepTwo.tsx
//             └── StepTwo.css