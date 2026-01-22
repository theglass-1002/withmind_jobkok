import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

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

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay"; // ✅ 경로 맞게 수정


import "./overviewPage.css";
import { fetchInterviewReport } from "@/api/report/report.api";
import { InterviewReportResponse } from "@/api/report/report.types";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [report, setReport] = useState<InterviewReportResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ 1) OverviewPage 진입 시 통신
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        if (!mounted) return;
        setLoading(true);

        const query = new URLSearchParams(location.search);
        const qzGroupParam = query.get("qzGroup");
        const qzGroup = qzGroupParam ? Number(qzGroupParam) : 1;

        const data = await fetchInterviewReport(qzGroup);
        setReport(data);
        console.log("fetchInterviewReport response:", data);
      } catch (err) {
        console.error("fetchInterviewReport error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [location.search]);

  //  printViewr 플래그에 따른 body class 처리 (버그 수정 버전)
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const isPrintMode = query.has("printViewr");

    if (isPrintMode) {
      document.body.classList.add("mock-analysis-print-mode");
    } else {
      document.body.classList.remove("mock-analysis-print-mode");
    }

    return () => {
      document.body.classList.remove("mock-analysis-print-mode");
    };
  }, [location.search]);

  return (
    <>
      <LoadingOverlay isLoading={loading} isLogo />

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
          report={report}
        />
        {/* <AiSummarySection
          title="AI 분석 요약 섹션"
          titleIconSrc={ic_laptop_24}
          strength={aiSummary.strength}
          weakness={aiSummary.weakness}
        /> */}

        {/* 필요하면 다시 켜면 됨 */}
        {/* <ResumeRecommendedJobsSection
          title="이 이력서와 가장 잘 맞는 공고"
          titleIconSrc={ic_rocket_24}
          jobs={jobs}
          pageSize={3}
          prevIconSrc={ic_keyboard_arrow_left_gray900_24}
          nextIconSrc={ic_keyboard_arrow_right_gray900_24}
          onToggleFavorite={onToggleFavorite}
        /> */}
      </div>
    </>
  );
}
