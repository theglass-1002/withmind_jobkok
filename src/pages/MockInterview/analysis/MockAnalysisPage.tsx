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
import ScoreDistributionSection from "./part/ScoreDistributionSection";
import KpiRadarChart from "./part/KpiRadarChart";



import "./mock-analysis.css";


export default function MockAnalysisPage() {
  // 하드코딩 데이터
  const score = 10;
  const totalCandidates = 171;
  const percentile = 10;
  const fit = 80;

  const bucketLabels: (string | string[])[] = [
    ["0", "~9"],
    ["10", "~19"],
    ["20", "~35"],
    ["36", "~45"],
    ["46", "~59"],
    ["60", "~75"],
    ["76", "~85"],
    ["86", "~93"],
    ["94", "~100"],
  ];

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
            <ScoreDistributionSection
                title="종합 점수 분포"
                titleIconSrc={ic_bar_chart_24}
                labels={bucketLabels}
                max={100}
                badgeIconSrc={ic_flag_green_24}
                left={{
                  role: "개발직군",
                  rankText: "응시자 2,851명 중 7위",
                  badgeText: "상위 10%",
                  values: [50, 30, 20, 60, 92, 80, 70, 100, 50],
                  highlightScore: 38,
                }}
                right={{
                  role: "프론트엔드 직무",
                  rankText: "응시자 267명 중 17위",
                  badgeText: "상위 10%",
                  values: [50, 30, 20, 60, 92, 80, 70, 100, 50],
                  highlightScore: 48,
                }}
              />

            <div className="analysis-section mock-analysis-overview__category-summary">
            <span className="analysis-section__title">
            <img src={ic_clipboard_24} alt="" /> 항목별 종합 평가 섹션 </span>
             <div className="analysis-section__body">
                <div className="analysis-section__left">
                  <span>홍길동님의 점수(수정필요)</span>  
                    <KpiRadarChart
                        attitude={50} //태도:100
                        voice={20}  //목소리50
                        tension={30}  //긴장도30
                        competence={40}  // 왼 여량40
                        />
                    </div>
                    <div className="analysis-section__right">
                    <div className="analysis-eval-item">
                        <div className="analysis-eval-item__header">
                        <span className="analysis-eval-item__label">역량</span>
                        <span className="analysis-eval-item__grade excellent">최우수</span>
                        </div>
                        <p className="analysis-eval-item__description">
                        면접 과정에서 보인 의사소통능력과 문제해결능력은 매우 우수한 것으로 평가됩니다.
                        잘 이해하고 뛰어난 의사소통 기술을 보였으며, 문제의 핵심을 파악하고 해결책을
                        제시하는 등 전화 상담원으로서의 역량이 뛰어나다고 판단됩니다.
                        </p>
                    </div>

                    <div className="analysis-eval-item">
                        <div className="analysis-eval-item__header">
                        <span className="analysis-eval-item__label">태도</span>
                        <span className="analysis-eval-item__grade good">우수</span>
                        </div>
                        <p className="analysis-eval-item__description">
                        면접 과정에서 보인 의사소통능력과 문제해결능력은 매우 우수한 것으로 평가됩니다.
                        잘 이해하고 뛰어난 의사소통 기술을 보였으며, 문제의 핵심을 파악하고 해결책을
                        제시하는 등 전화 상담원으로서의 역량이 뛰어나다고 판단됩니다.
                        </p>
                    </div>

                    <div className="analysis-eval-item">
                        <div className="analysis-eval-item__header">
                        <span className="analysis-eval-item__label">목소리</span>
                        <span className="analysis-eval-item__grade fair">보통</span>
                        </div>
                        <p className="analysis-eval-item__description">
                        면접 과정에서 보인 의사소통능력과 문제해결능력은 매우 우수한 것으로 평가됩니다.
                        잘 이해하고 뛰어난 의사소통 기술을 보였으며, 문제의 핵심을 파악하고 해결책을
                        제시하는 등 전화 상담원으로서의 역량이 뛰어나다고 판단됩니다.
                        </p>
                    </div>

                    <div className="analysis-eval-item">
                        <div className="analysis-eval-item__header">
                        <span className="analysis-eval-item__label">긴장도</span>
                        <span className="analysis-eval-item__grade improvement">보통</span>
                        </div>
                        <p className="analysis-eval-item__description">
                        면접 과정에서 보인 의사소통능력과 문제해결능력은 매우 우수한 것으로 평가됩니다.
                        잘 이해하고 뛰어난 의사소통 기술을 보였으며, 문제의 핵심을 파악하고 해결책을
                        제시하는 등 전화 상담원으로서의 역량이 뛰어나다고 판단됩니다.
                        </p>
                    </div>
                    </div>

             </div>   
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
