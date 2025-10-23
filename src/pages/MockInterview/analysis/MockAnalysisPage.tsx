import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "@/shared/components/modal/Modal";
import ic_print_gray900_24 from "@/assets/icons/size24/ic_print_gray900_24.png";
import ic_arrow_left_gray900_20 from "@/assets/icons/size20/ic_arrow_left_gray900_20.png";
import ic_star_white_20 from "@/assets/icons/size20/ic_star_white_20.png";
import ic_magnifier_24 from "@/assets/icons/size24/ic_magnifier_24.png";

import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";
import ic_bar_chart_24 from "@/assets/icons/size24/ic_bar_chart_24.png";
import ic_laptop_24 from "@/assets/icons/size24/ic_laptop_24.png";
import ic_rocket_24 from "@/assets/icons/size24/ic_rocket_24.png";
import ic_clipboard_24 from "@/assets/icons/size24/ic_clipboard_24.png";
import ic_flag_green_24 from "@/assets/icons/size24/ic_flag_green_24.png";
import KpiOverview from "./part/KpiOverview";
import MockAnalysisKpiFit from "./part/MockAnalysisKpiFit";
import "./mock-analysis.css";


export default function MockAnalysisPage() {
  // 하드코딩 데이터
  const score = 10;
  const totalCandidates = 171;
  const percentile = 10;
  const fit = 80;


  return (
    <div className="mock-analysis">
     <div className="mock-analysis__inner">
        <div className="mock-analysis__header">
        <div className="mock-analysis__title">분석결과
        <div className="mock-analysis__title-meta">
            <span className="mock-analysis__title-date">2025.01.01 00:00</span>
            <span className="mock-analysis__title-status mock-analysis__title-status--done">진행 완료</span>
        </div>
        </div>
        <div className="mock-analysis__meta">
            <div className="mock-analysis__meta-row">
                <div className="mock-analysis__meta-item">
                <span className="mock-analysis__meta-key">이름</span>
                <span className="mock-analysis__meta-value">홍길동</span>
                </div>
                <div className="mock-analysis__meta-item">
                <span className="mock-analysis__meta-key">아이디</span>
                <span className="mock-analysis__meta-value">abc</span>
                </div>
            </div>

            <div className="mock-analysis__meta-row">
                <div className="mock-analysis__meta-item">
                <span className="mock-analysis__meta-key">희망직무</span>
                <span className="mock-analysis__meta-value">개발자</span>
                </div>
                <div className="mock-analysis__meta-item">
                <span className="mock-analysis__meta-key">선택 이력서</span>
                <span className="mock-analysis__meta-value">성장하는 개발자</span>
                </div>
            </div>

            <div className="mock-analysis__meta-row">
                <div className="mock-analysis__meta-item">
                <span className="mock-analysis__meta-key">신뢰도</span>
                <span className="mock-analysis__meta-value">중</span>
                </div>
                <div className="mock-analysis__meta-item">
                <span className="mock-analysis__meta-key">면접시간</span>
                <span className="mock-analysis__meta-value">12분</span>
                </div>
            </div>
            </div>


      </div>

      <div className="mock-analysis-tabs default_tabs">
        <span className="mock-analysis-tabs__item tab on">종합분석탭</span>
        <span className="mock-analysis-tabs__item tab">상세분석 탭</span>
        <span className="mock-analysis-tabs__item tab">이력서−면접 일치도 분석</span>
      </div>
        </div>
    
         <div className="mock-analysis-panel mock-analysis-report">
        <div className="mock-analysis-report__container">
            <div className="mock-analysis-report__inner">
            <span className="mock-analysis-report__icon-btn" role="button" aria-label="리포트 인쇄">
                <img className="mock-analysis-report__icon" src={ic_print_gray900_24} alt="" />
                </span>
            <div className="mock-analysis-report__content">
                <div className="mock-analysis-overview__kpi">
                <KpiOverview
                    score={score}
                    totalCandidates={totalCandidates}
                    percentile={percentile}
                />
                <MockAnalysisKpiFit
                    value={fit}
                    headIconSrc={ic_magnifier_24}
                    noteIconSrc={ic_error_gray500_20}
                    description="응답은 직무 핵심 키워드와 역할을 잘 반영해 이력서와 높은 일치도를 보였습니다. 이력서에서 강조한 프로젝트 경험과 협업 역량도 답변에 드러났으나, 정량적 성과와 최신 기술 활용 사례는 충분히 연결되지 않아 구체성과 최신성이 다소 부족했습니다."
                    />  
            </div>
            <div className="analysis-section mock-analysis-overview__score-distribution">
                <span className="analysis-section__title">
                    <img src={ic_bar_chart_24} alt="" />
                    종합 점수 분포 </span>
                    <div className="analysis-section__body">
                    <div className="analysis-section__left">
                 <div className="analysis-section__stat">
                    <div className="analysis-section__stat-head">
                    <span className="analysis-section__stat-role">개발직군</span>
                    <span className="analysis-section__stat-rank">응시자 2,851명 중 7위</span>
                    </div>

                    <div className="analysis-badge analysis-badge--up">
                    <img className="analysis-badge__icon" src={ic_flag_green_24} alt="" />
                    <span className="analysis-badge__text">상위 10%</span>
                    </div>
                </div>

                <div className="analysis-section__chart">그래프 영역</div>
                </div>
             <div className="analysis-section__right">
             <div className="analysis-section__stat">
                    <div className="analysis-section__stat-head">
                    <span className="analysis-section__stat-role">프론트엔드 직무</span>
                    <span className="analysis-section__stat-rank">응시자 267명 중 17위</span>
                    </div>

                    <div className="analysis-badge analysis-badge--up">
                    <img className="analysis-badge__icon" src={ic_flag_green_24} alt="" />
                    <span className="analysis-badge__text">상위 10%</span>
                    </div>
                </div>
                <div className="analysis-section__chart">그래프 영역</div>
                </div> 
            </div>
            </div>
            <div className="analysis-section mock-analysis-overview__category-summary">
            <span className="analysis-section__title">
            <img src={ic_clipboard_24} alt="" />
                항목별 종합 평가 섹션 </span>
             </div>
            <div className="analysis-section mock-analysis-overview__ai-summary">
            <span className="analysis-section__title">
            <img src={ic_laptop_24} alt="" />
                AI 분석 요약 섹션 </span>
           </div>
            <div className="analysis-section mock-analysis-overview__recommended-jobs">
            <span className="analysis-section__title">
            <img src={ic_rocket_24} alt="" />
                가장 잘 맞는 공고 섹션 </span>
              </div>

            </div>
            </div>
            <div className="bottom_btn_wrap mock-analysis-report__actions">
            <span className="default_btn_white mock-analysis-report__btn mock-analysis-report__btn--list">
                <img className="mock-analysis-report__btn-icon" src={ic_arrow_left_gray900_20} alt="" />
                목록으로
            </span>
            <span className="default_btn_black mock-analysis-report__btn mock-analysis-report__btn--redo">
                <img className="mock-analysis-report__btn-icon" src={ic_star_white_20} alt="" />
                모의면접 다시 보기
            </span>
            </div>
        </div>
        </div>


    </div>
  );
}
