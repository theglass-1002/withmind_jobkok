import React, { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";

import ic_bar_chart_24 from "@/assets/icons/size24/ic_bar_chart_24.png";
import ic_laptop_24 from "@/assets/icons/size24/ic_laptop_24.png";
import ic_clipboard_24 from "@/assets/icons/size24/ic_clipboard_24.png";
import ic_flag_green_24 from "@/assets/icons/size24/ic_flag_green_24.png";
import ic_strength_circle_24 from "@/assets/icons/size24/ic_strength_circle_24.png";
import ic_weakness_circle_24 from "@/assets/icons/size24/ic_weakness_circle_24.png";

import KpiOverviewSection from "./sections/KpiOverviewSection";
import AiSummarySection from "./sections/AiSummarySection";
import ScoreDistributionSection from "./sections/ScoreDistributionSection";
import CategorySummarySection, {
  type EvalItem,
} from "./sections/CategorySummarySection";

import KpiRadarChart from "@/pages/InterviewReport/analysis/chart/KpiRadarChart";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

import "./overviewPage.css";

type ScoreSectionSide = {
  role: string;
  rankText: string;
  badgeText: string;
  values: number[];
  highlightScore?: number;
};

type ScoreSection = {
  labels: (string | string[])[];
  max?: number;
  left: ScoreSectionSide;
  right: ScoreSectionSide;
};

type CategoryLeft = {
  scoreTitle?: string;
  scores?: {
    attitude?: number;
    voice?: number;
    tension?: number;
    competence?: number;
  };
  RadarChartComponent?: React.ComponentType<any>;
};

type CategoryRight = {
  items: EvalItem[];
};

type CategorySummary = {
  left: CategoryLeft;
  right: CategoryRight;
};

type AiSummaryItem = {
  iconSrc: string;
  label: string;
  tags: string[];
  description: string;
};

type AiSummary = {
  strength: AiSummaryItem;
  weakness: AiSummaryItem;
};

type Props = {
  score?:number
  reportDetail?: InterviewReportDetailResponse | null;
  scoreSection?: ScoreSection;
  categorySummary?: CategorySummary;
  aiSummary?: AiSummary;
};

const SCORE_LABELS: (string | string[])[] = [
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

const FALLBACK_SCORE_SECTION: ScoreSection = {
  labels: SCORE_LABELS,
  max: 100,
  left: {
    role: "-",
    rankText: "-",
    badgeText: "-",
    values: [],
  },
  right: {
    role: "-",
    rankText: "-",
    badgeText: "-",
    values: [],
  },
};

const FALLBACK_CATEGORY_SUMMARY: CategorySummary = {
  left: {
    scoreTitle: "점수",
    scores: {
      attitude: 0,
      voice: 0,
      tension: 0,
      competence: 0,
    },
    RadarChartComponent: KpiRadarChart,
  },
  right: {
    items: [
      {
        label: "역량",
        gradeText: "-",
        gradeTone: "fair",
        description: "-",
      },
      {
        label: "태도",
        gradeText: "-",
        gradeTone: "fair",
        description: "-",
      },
      {
        label: "목소리",
        gradeText: "-",
        gradeTone: "fair",
        description: "-",
      },
      {
        label: "긴장도",
        gradeText: "-",
        gradeTone: "fair",
        description: "-",
      },
    ],
  },
};

const FALLBACK_AI_SUMMARY: AiSummary = {
  strength: {
    iconSrc: ic_strength_circle_24,
    label: "강점",
    tags: [],
    description: "-",
  },
  weakness: {
    iconSrc: ic_weakness_circle_24,
    label: "약점",
    tags: [],
    description: "-",
  },
};

function buildScoreSectionFromReport(
  reportDetail: InterviewReportDetailResponse
): ScoreSection {
  const groupRankInfo = reportDetail.tab1?.groupRankInfo;
  const jobRankInfo = reportDetail.tab1?.jobRankInfo;

  return {
    labels: SCORE_LABELS,
    max: 100,
    left: {
      role: groupRankInfo?.jobGroup ? `${groupRankInfo.jobGroup} 직군` : "-",
      rankText: `응시자 ${(groupRankInfo?.totalCount ?? 0).toLocaleString()}명 중 ${
        groupRankInfo?.myRank ?? 0
      }위`,
      badgeText: `상위 ${groupRankInfo?.topPercent ?? 0}%`,
      values: groupRankInfo?.distribution ?? [],
      highlightScore: groupRankInfo?.myScore,
    },
    right: {
      role: jobRankInfo?.job ? `${jobRankInfo.job} 직무` : "-",
      rankText: `응시자 ${(jobRankInfo?.totalCount ?? 0).toLocaleString()}명 중 ${
        jobRankInfo?.myRank ?? 0
      }위`,
      badgeText: `상위 ${jobRankInfo?.topPercent ?? 0}%`,
      values: jobRankInfo?.distribution ?? [],
      highlightScore: jobRankInfo?.myScore,
    },
  };
}

function getGradeTone(
  gradeText?: string
): "excellent" | "good" | "fair" | "improvement" | "poor" {
  switch (gradeText) {
    case "최우수":
      return "excellent";
    case "우수":
      return "good";
    case "보통":
      return "fair";
    case "미흡":
      return "improvement";
    case "매우 미흡":
      return "poor";
    default:
      return "improvement";
  }
}

function buildCategorySummaryFromReport(
  reportDetail: InterviewReportDetailResponse
): CategorySummary {
  const itemTotalScores = reportDetail.tab1?.itemTotalScores;
  const feedback = reportDetail.tab1?.feedback;
  const userInfo = reportDetail.userInfo;

  return {
    left: {
      scoreTitle: userInfo?.name ? `${userInfo.name}님의 점수` : "내 점수",
      scores: {
        attitude: itemTotalScores?.attitudeTotalScore ?? 0,
        voice: itemTotalScores?.voiceTotalScore ?? 0,
        tension: itemTotalScores?.tensionTotalScore ?? 0,
        competence: itemTotalScores?.abilityTotalScore ?? 0,
      },
      RadarChartComponent: KpiRadarChart,
    },
    right: {
      items: [
        {
          label: "역량",
          gradeText: itemTotalScores?.abilityTotalScoreText ?? "-",
          gradeTone: getGradeTone(itemTotalScores?.abilityTotalScoreText),
          description: feedback?.competency ?? "-",
        },
        {
          label: "태도",
          gradeText: itemTotalScores?.attitudeTotalScoreText ?? "-",
          gradeTone: getGradeTone(itemTotalScores?.attitudeTotalScoreText),
          description: feedback?.attitude ?? "-",
        },
        {
          label: "목소리",
          gradeText: itemTotalScores?.voiceTotalScoreText ?? "-",
          gradeTone: getGradeTone(itemTotalScores?.voiceTotalScoreText),
          description: feedback?.voice ?? "-",
        },
        {
          label: "긴장도",
          gradeText: itemTotalScores?.tensionTotalScoreText ?? "-",
          gradeTone: getGradeTone(itemTotalScores?.tensionTotalScoreText),
          description: feedback?.tension ?? "-",
        },
      ],
    },
  };
}

function buildAiSummaryFromReport(
  reportDetail: InterviewReportDetailResponse
): AiSummary {
  const powerKeywords = reportDetail.tab1?.powerKeywords;

  return {
    strength: {
      iconSrc: ic_strength_circle_24,
      label: "강점",
      tags: [powerKeywords?.strength1, powerKeywords?.strength2].filter(
        (tag): tag is string => Boolean(tag && tag.trim())
      ),
      description: powerKeywords?.strength ?? "-",
    },
    weakness: {
      iconSrc: ic_weakness_circle_24,
      label: "약점",
      tags: [powerKeywords?.weakness1, powerKeywords?.weakness2].filter(
        (tag): tag is string => Boolean(tag && tag.trim())
      ),
      description: powerKeywords?.weakness ?? "-",
    },
  };
}

export default function OverviewPage({
  reportDetail,
  scoreSection,
  categorySummary,
  aiSummary,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const resolvedScoreSection = useMemo(() => {
    if (reportDetail?.tab1?.groupRankInfo && reportDetail?.tab1?.jobRankInfo) {
      return buildScoreSectionFromReport(reportDetail);
    }
    return scoreSection ?? FALLBACK_SCORE_SECTION;
  }, [reportDetail, scoreSection]);

  const resolvedCategorySummary = useMemo(() => {
    if (reportDetail?.tab1?.itemTotalScores && reportDetail?.tab1?.feedback) {
      return buildCategorySummaryFromReport(reportDetail);
    }
    return categorySummary ?? FALLBACK_CATEGORY_SUMMARY;
  }, [reportDetail, categorySummary]);

  const resolvedAiSummary = useMemo(() => {
    if (reportDetail?.tab1?.powerKeywords) {
      return buildAiSummaryFromReport(reportDetail);
    }
    return aiSummary ?? FALLBACK_AI_SUMMARY;
  }, [reportDetail, aiSummary]);

  return (
    <div className="mock-analysis-report__content" ref={contentRef}>
      <KpiOverviewSection reportDetail={reportDetail} />

      <ScoreDistributionSection
        title="종합 점수 분포"
        titleIconSrc={ic_bar_chart_24}
        labels={resolvedScoreSection.labels}
        max={resolvedScoreSection.max}
        badgeIconSrc={ic_flag_green_24}
        left={resolvedScoreSection.left}
        right={resolvedScoreSection.right}
      />

      <CategorySummarySection
        title="항목별 종합 평가 섹션"
        titleIconSrc={ic_clipboard_24}
        left={resolvedCategorySummary.left}
        right={resolvedCategorySummary.right}
      />

      <AiSummarySection
        title="AI 분석 요약 "
        titleIconSrc={ic_laptop_24}
        strength={resolvedAiSummary.strength}
        weakness={resolvedAiSummary.weakness}
      />
    </div>
  );
}