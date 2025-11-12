import React from 'react'
import { useNavigate } from 'react-router-dom';
import ic_logout_white_24 from "@/assets/icons/size24/ic_logout_white_24.png";
import ic_progress_intro from "@/assets/progress/ic_progress_intro.png";



export default function LiveSidePanel() {
    const navigate = useNavigate();
    
    const handleExit= () => {
        navigate('/');
    };

    return (
      <div className="mock-interview__sidepanel">
        <div className="mock-interview__sidepanel-section info">
          <span className="mock-interview__sidepanel-title">면접 정보</span>
          <div className="mock-interview__info-list">
            <div className="mock-interview__info-item">
              <span className="mock-interview__info-label">이력서</span>
              <span className="mock-interview__info-value">성장하는 개발자, 준비된 홍길동입니다</span>
            </div>
            <div className="mock-interview__info-item">
              <span className="mock-interview__info-label">희망 직무</span>
              <span className="mock-interview__info-value">프론트엔드 개발자</span>
            </div>
            <div className="mock-interview__info-item">
              <span className="mock-interview__info-label">채용 공고</span>
              <span className="mock-interview__info-value">[위드마인드] 프론트엔드 개발자 채용</span>
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
          <button className="mock-interview__exit-btn"
          onClick={handleExit}>
            <img src={ic_logout_white_24} alt="" />
            나가기</button>
        </div>
      </div>
    );
  }
  