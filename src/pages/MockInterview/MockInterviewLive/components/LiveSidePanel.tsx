import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ic_logout_white_24 from "@/assets/icons/size24/ic_logout_white_24.png";
import ic_progress_intro from "@/assets/progress/ic_progress_intro.png";
import ic_close_white_24 from "@/assets/icons/size24/ic_close_white_24.png";

// ✅ 실제 Modal 컴포넌트 경로에 맞게 수정
import Modal from "@/shared/components/modal/Modal";

type LiveSidePanelProps = {
  activeStep?: number;
  onExit?: () => void;
};

export default function LiveSidePanel({ activeStep, onExit }: LiveSidePanelProps) {
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ "나가기" 버튼을 눌렀을 때: 바로 이동 X, 모달만 띄움
  const handleExitClick = () => {
    setShowConfirm(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  // ✅ 모달에서 "나가기" 눌렀을 때 실제 이동
  const handleConfirmExit = () => {
    setShowConfirm(false);
    navigate("/mock-interview-report");
  };

  // ✅ 모바일 상단 X도 동일하게 모달 띄우기
  const handleMobileCloseClick = () => {
    setShowConfirm(true);
    onExit?.(); // (원하면 이 줄 제거: 지금은 기존 동작 유지)
  };

  return (
    <>
      <Modal
        open={showConfirm}
        title="모의면접을 중단하시겠습니까?"
        confirmText="나가기"
        confirmClassName="btn_w_full default_btn_red radius"
        cancelText="취소"
        cancelClassName="btn_w_full default_btn_gray_100 radius"
        onConfirm={handleConfirmExit}
        onClose={handleCloseConfirm}
      />

      {/* PC */}
      <div className="mock-interview__sidepanel">
        <div className="mock-interview__sidepanel-section info">
          <span className="mock-interview__sidepanel-title">면접 정보</span>
          <div className="mock-interview__info-list">
            <div className="mock-interview__info-item">
              <span className="mock-interview__info-label">이력서</span>
              <span className="mock-interview__info-value">성장하는 기획자 정유리입니다</span>
            </div>
            <div className="mock-interview__info-item">
              <span className="mock-interview__info-label">희망 직무</span>
              <span className="mock-interview__info-value">프로젝트 기획자</span>
            </div>
            <div className="mock-interview__info-item">
              <span className="mock-interview__info-label">채용 공고</span>
              <span className="mock-interview__info-value">[위드마인드] 기획자 채용</span>
            </div>
          </div>
        </div>

        <div className="mock-interview__sidepanel-section stage">
          <div className="mock-interview__stage-header">
            <span className="mock-interview__stage-title">면접 단계</span>
            <div className="mock-interview__stage-list">
              <div className="mock-interview__stage-icons">
                <img src={ic_progress_intro} alt="" />
              </div>
              <div className="mock-interview__stage-items">
                <div className="mock-interview__stage-item">
                  <span className="mock-interview__stage-name">자기소개 및 지원 동기</span>
                  <span className="mock-interview__stage-desc">본인의 강점과 지원 동기 확인</span>
                </div>
                <div className="mock-interview__stage-item">
                  <span className="mock-interview__stage-name">직무 질문</span>
                  <span className="mock-interview__stage-desc">직무 이해도와 역량 평가</span>
                </div>
                <div className="mock-interview__stage-item">
                  <span className="mock-interview__stage-name">이력서 기반 질문</span>
                  <span className="mock-interview__stage-desc">작성한 경험과 경력 검증</span>
                </div>
                <div className="mock-interview__stage-item">
                  <span className="mock-interview__stage-name">채용 공고 기반 질문</span>
                  <span className="mock-interview__stage-desc">공고 요구사항과 적합성 확인</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mock-interview__progress">
            <div className="mock-interview__progress-header">
              <span className="mock-interview__progress-label">진행 현황</span>
              <span className="mock-interview__progress-count">질문 1 / 12</span>
            </div>

            <div className="mock-interview__progress-bar">
              <span className="mock-interview__progress-fill"></span>
            </div>
          </div>
        </div>

        <div className="mock-interview__sidepanel-footer">
          <button className="mock-interview__exit-btn" onClick={handleExitClick}>
            <img src={ic_logout_white_24} alt="" />
            나가기
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="mock-interview__sidepanel mobile">
        <div className="mock-interview__sidepanel-section info">
          <div className="mock-settings__panel-header">
            <img
              onClick={handleMobileCloseClick}
              className="mock-settings_header_icon"
              src={ic_close_white_24}
              alt=""
            />
            <span className="mock-settings__panel-section-title">면접 진행 현황</span>
          </div>

          <span className="mock-interview__sidepanel-title">면접 정보</span>
          <div className="mock-interview__info-list">
            <div className="mock-interview__info-item">
              <span className="mock-interview__info-label">이력서</span>
              <span className="mock-interview__info-value">성장하는 기획자 정유리입니다</span>
            </div>
            <div className="mock-interview__info-item">
              <span className="mock-interview__info-label">희망 직무</span>
              <span className="mock-interview__info-value">프로젝트 기획자</span>
            </div>
            <div className="mock-interview__info-item">
              <span className="mock-interview__info-label">채용 공고</span>
              <span className="mock-interview__info-value">[위드마인드] 기획자 채용</span>
            </div>
          </div>
        </div>

        <div className="mock-interview__sidepanel-section stage">
          <div className="mock-interview__stage-header">
            <span className="mock-interview__stage-title">면접 단계</span>
            <div className="mock-interview__stage-list">
              <div className="mock-interview__stage-icons">
                <img src={ic_progress_intro} alt="" />
              </div>
              <div className="mock-interview__stage-items">
                <div className="mock-interview__stage-item">
                  <span className="mock-interview__stage-name">자기소개 및 지원 동기</span>
                  <span className="mock-interview__stage-desc">본인의 강점과 지원 동기 확인</span>
                </div>
                <div className="mock-interview__stage-item">
                  <span className="mock-interview__stage-name">직무 질문</span>
                  <span className="mock-interview__stage-desc">직무 이해도와 역량 평가</span>
                </div>
                <div className="mock-interview__stage-item">
                  <span className="mock-interview__stage-name">이력서 기반 질문</span>
                  <span className="mock-interview__stage-desc">작성한 경험과 경력 검증</span>
                </div>
                <div className="mock-interview__stage-item">
                  <span className="mock-interview__stage-name">채용 공고 기반 질문</span>
                  <span className="mock-interview__stage-desc">공고 요구사항과 적합성 확인</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mock-interview__progress">
            <div className="mock-interview__progress-header">
              <span className="mock-interview__progress-label">진행 현황</span>
              <span className="mock-interview__progress-count">질문 1 / 12</span>
            </div>

            <div className="mock-interview__progress-bar">
              <span className="mock-interview__progress-fill"></span>
            </div>
          </div>
        </div>

        <div className="mock-interview__sidepanel-footer">
          <button className="mock-interview__exit-btn" onClick={handleExitClick}>
            <img src={ic_logout_white_24} alt="" />
            나가기
          </button>
        </div>
      </div>
    </>
  );
}
