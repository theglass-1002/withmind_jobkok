import React, { useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';

import ic_bar_chart_24 from "@/assets/icons/size24/ic_bar_chart_24.png";
import ic_laptop_24 from "@/assets/icons/size24/ic_laptop_24.png";
import ic_rocket_24 from "@/assets/icons/size24/ic_rocket_24.png";
import ic_clipboard_24 from "@/assets/icons/size24/ic_clipboard_24.png";
import ic_flag_green_24 from "@/assets/icons/size24/ic_flag_green_24.png";
import ic_keyboard_arrow_left_gray900_24 from "@/assets/icons/size24/ic_keyboard_arrow_left_gray900_24.png";
import ic_keyboard_arrow_right_gray900_24 from "@/assets/icons/size24/ic_keyboard_arrow_right_gray900_24.png";

import KpiOverviewSection from "./sections/KpiOverviewSection";
import AiSummarySection from "./sections/AiSummarySection";
import ScoreDistributionSection from "./sections/ScoreDistributionSection";
import CategorySummarySection, { type EvalItem } from "./sections/CategorySummarySection";
import ResumeRecommendedJobsSection, { type JobCardV2Item } from "./sections/ResumeRecommendedJobsSection";
import "./overviewPage.css";

// --------------------------------------------------
// Type Definitions
// --------------------------------------------------
type ScoreSectionSide = {
  role: string;
  rankText: string;
  badgeText: string;
  values: number[];
  highlightScore?: number;
};

type CategoryLeft = {
  scoreTitle?: string;
  scores?: { attitude?: number; voice?: number; tension?: number; competence?: number };
  RadarChartComponent?: React.ComponentType<any>;
};
type CategoryRight = {
  items: EvalItem[];
};

type AiSummaryItem = {
  iconSrc: string;
  label: string;
  tags: string[];
  description: string;
};

type Props = {
  score: number;
  totalCandidates: number;
  percentile: number;
  fit: number;

  jobs: JobCardV2Item[];
  onToggleFavorite: (id: number | string, nextValue?: boolean) => void;

  scoreSection: {
    labels: (string | string[])[];
    max?: number;
    left: ScoreSectionSide;
    right: ScoreSectionSide;
  };

  categorySummary: {
    left: CategoryLeft;
    right: CategoryRight;
  };

  aiSummary: {
    strength: AiSummaryItem;
    weakness: AiSummaryItem;
  };
};

// --------------------------------------------------
// Main Component
// --------------------------------------------------
export default function OverviewPage({
  score,
  totalCandidates,
  percentile,
  fit,
  scoreSection,
  categorySummary,
  aiSummary,
  jobs,
  onToggleFavorite,
}: Props) {
  
  // 1. 최상위 div 요소에 접근하기 위한 Ref 생성
  const contentRef = useRef<HTMLDivElement>(null); 
  const location = useLocation();

  useEffect(() => {
    // URL의 쿼리 파라미터를 분석합니다.
    const query = new URLSearchParams(location.search);
    
    // 'printViewr' 플래그가 URL에 존재하는지 확인합니다.
    const isPrintMode = query.has('printViewr');

    // 2. Ref와 클래스 리스트를 사용하여 클래스 적용
    if (contentRef.current) {
        if (isPrintMode) {
            // Ref가 연결된 mock-analysis-report__content div에 클래스 추가
            document.body.classList.add('mock-analysis-print-mode');
        } else {
            // Ref가 연결된 div에서 클래스 제거
            contentRef.current.classList.remove('mock-analysis-print-mode');
        }
    }
  }, [location.search]);

  return (
    <div className="mock-analysis-report__content" ref={contentRef}>
      <KpiOverviewSection
        score={score}
        totalCandidates={totalCandidates}
        percentile={percentile}
        fit={fit}
      />

      <ScoreDistributionSection
        title="종합 점수 분포"
        titleIconSrc={ic_bar_chart_24}
        labels={scoreSection.labels}
        max={scoreSection.max}
        badgeIconSrc={ic_flag_green_24}
        left={scoreSection.left}
        right={scoreSection.right}
      />
   
      <CategorySummarySection
        title="항목별 종합 평가 섹션"
        titleIconSrc={ic_clipboard_24}
        left={categorySummary.left}
        right={categorySummary.right}
      />

      <AiSummarySection
        title="AI 분석 요약 섹션"
        titleIconSrc={ic_laptop_24}
        strength={aiSummary.strength}
        weakness={aiSummary.weakness}
      />

      <ResumeRecommendedJobsSection
        title="이 이력서와 가장 잘 맞는 공고"
        titleIconSrc={ic_rocket_24}
        jobs={jobs}
        pageSize={3}
        prevIconSrc={ic_keyboard_arrow_left_gray900_24}
        nextIconSrc={ic_keyboard_arrow_right_gray900_24}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
}