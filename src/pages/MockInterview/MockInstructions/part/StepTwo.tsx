import React from 'react';
import arrow_curve_down from "@/assets/testImg/arrow_curve_down.png";
import video_interview from "@/assets/testImg/video_interview.png";
import video_interview_time from "@/assets/testImg/video_interview_time.png";
import ic_keyboard_arrow_left_gray900_24 from "@/assets/icons/size24/ic_keyboard_arrow_left_gray900_24.png";
import ic_chevron_right_white_24 from "@/assets/icons/size24/ic_chevron_right_white_24.png";

type StepTwoProps = {
    onPrev: () => void;
};

export default function StepTwo({ onPrev }: StepTwoProps) {
    return (
      <div className="step_two">
        <div className="mock-instructions__progress-bar step_two">
            <span></span>
        </div>
        <div className="mock-instructions__content">
          <div className="mock-instructions__header">
              <span className="mock-instructions__step-label">안내사항 2/2</span>
              <span className="mock-instructions__title">면접은 다음과 같이 진행됩니다.</span>
          </div>
          <div className="mock-instructions__cards">
              <div className="mock-instructions__card">
                  <div className="mock-instructions__card-text">
                      <span className="mock-instructions__card-description">면접 문항 구성</span>
                      <div className="mock-instructions__card-title">
                        총
                        <span className="mock-instructions__card-count">12개</span>
                        의 문항이 제공됩니다.
                      </div>
                  </div>
                  <div className="mock-instructions__card-questions">
                    <span className="mock-instructions__question-item">
                        [질문 1] 우리 회사에 지원한 동기는 무엇인가요?
                    </span>
                    <span className="mock-instructions__question-item">
                        [질문 2] 어려운 목표를 달성한 경험이 있나요?
                    </span>
                    <span className="mock-instructions__question-item">
                        [질문 3] 다른 사람과 협력했던 경험이 있나요?
                    </span>
                    <span className="mock-instructions__question-item">
                        [질문 4] 본인만의 업무 경쟁력은 무엇인가요?
                    </span>
                    <span className="mock-instructions__question-item">
                        [질문 5] 가장 최선을 다했던 경험은 무엇인가요?
                    </span>
                </div>
              </div>
              <div className="mock-instructions__card">
                  <div className="mock-instructions__card-text">
                      <span className="mock-instructions__card-description">면접 시간 구성</span>
                      <div className="mock-instructions__card-title">
                        생각 시간
                        <span className="mock-instructions__card-time">60초</span>
                        ,답변 시간
                        <span className="mock-instructions__card-time">90초</span>
                        가 주어집니다.
                      </div>
                  </div>
                  <div className="mock-interview-scene">
                    <img src={video_interview_time} alt="화상 면접 배경" className="interview-background" />
                    <div className="interview-foreground-container">
                        <img src={video_interview} alt="화상 면접 메인" className="interview-foreground" />
                    </div>
                    <img src={arrow_curve_down} alt="화면 전환 화살표" className="arrow-up-left" />
                    <img src={arrow_curve_down} alt="화면 전환 화살표" className="arrow-down-right" />
                </div>
              </div>
          </div>
        </div>
        <div className="btn_wrap">
          <button className="default_btn_white radius" onClick={onPrev}>
            <img src={ic_keyboard_arrow_left_gray900_24} alt="" />
            이전으로
          </button>
          <button className="mock-instructions__btn--primary radius">
            시작하기
            <img src={ic_chevron_right_white_24} alt="" />
          </button>
        </div>
      </div>
    );
}