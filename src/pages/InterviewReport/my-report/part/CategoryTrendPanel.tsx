// src/pages/InterviewReport/my-report/part/CategoryTrendPanel.tsx
import React from "react";
import ic_card_index_dividers_24 from "@/assets/icons/size24/ic_card_index_dividers_24.png";

import CategoryTrendLineChart from "./CategoryTrendLineChart";
import type { CategoryTrendLineChartProps } from "./CategoryTrendLineChart";

import TrendLegendItem from "./TrendLegendItem";
import type { TrendLegendItemProps } from "./TrendLegendItem";
import type { MyReportResponse } from "@/api/report/report.types";

export interface CategoryTrendPanelProps {
  /** 패널 타이틀 */
  title?: string;

  /** data 없을 때 사용할 fallback */
  labels?: CategoryTrendLineChartProps["labels"];
  series?: {
    stress: number[];
    competency: number[];
    attitude: number[];
    voice: number[];
  };

  /** 선 곡률(0=직선) */
  tension?: number;
  /** 차트 높이(px) */
  height?: number;
  multiLineLabels?: boolean;

  /** data 없을 때 사용할 fallback */
  legendItems?: Array<
    Omit<TrendLegendItemProps, "variant" | "name"> & {
      variant: TrendLegendItemProps["variant"];
      name?: string;
    }
  >;

  data?: MyReportResponse | null;
}

const DEFAULT_NAME: Record<TrendLegendItemProps["variant"], string> = {
  competency: "역량 분석",
  attitude: "태도 분석",
  voice: "목소리 분석",
  stress: "긴장도 분석",
};

function convertGradeToRating(grade?: string): number {
  switch (grade) {
    case "상":
      return 3;
    case "중":
      return 2;
    case "하":
      return 1;
    default:
      return 0;
  }
}

export default function CategoryTrendPanel({
  title = "항목별 종합 분석 추이",
  labels = [],
  series = {
    stress: [],
    competency: [],
    attitude: [],
    voice: [],
  },
  tension = 0,
  height = 260,
  legendItems = [],
  multiLineLabels = false,
  data,
}: CategoryTrendPanelProps) {
  const trendData = data?.categoryTrend ?? [];
  const myAvgFeedback = data?.myAvgFeedback ?? {};
  const categorySummary = data?.categorySummary ?? {};

  const resolvedLabels =
    trendData.length > 0 ? trendData.map((item) => item.date) : labels;

  const resolvedSeries =
    trendData.length > 0
      ? {
          stress: trendData.map((item) => item.tensionScore),
          competency: trendData.map((item) => item.abilityScore),
          attitude: trendData.map((item) => item.attitudeScore),
          voice: trendData.map((item) => item.voiceScore),
        }
      : series;

      const resolvedLegendItems =
      data != null
        ? [
            {
              variant: "competency" as const,
              description: data?.myAvgFeedback?.abilityFeedback ?? "-",
              rating: convertGradeToRating(data?.categorySummary?.abilityGrade),
              ratingText: data?.categorySummary?.abilityGrade ?? "-",
            },
            {
              variant: "attitude" as const,
              description: data?.myAvgFeedback?.attitudeFeedback ?? "-",
              rating: convertGradeToRating(data?.categorySummary?.attitudeGrade),
              ratingText: data?.categorySummary?.attitudeGrade ?? "-",
            },
            {
              variant: "voice" as const,
              description: data?.myAvgFeedback?.voiceFeedback ?? "-",
              rating: convertGradeToRating(data?.categorySummary?.voiceGrade),
              ratingText: data?.categorySummary?.voiceGrade ?? "-",
            },
            {
              variant: "stress" as const,
              description: data?.myAvgFeedback?.tensionFeedback ?? "-",
              rating: convertGradeToRating(data?.categorySummary?.tensionGrade),
              ratingText: data?.categorySummary?.tensionGrade ?? "-",
            },
          ]
        : legendItems;

  return (
    <>
      <span className="mock-interview__title mock-interview-category-trend__title">
        <img
          className="mock-category-icon"
          src={ic_card_index_dividers_24}
          alt=""
          aria-hidden="true"
        />
        {title}
      </span>

      <div className="mock-interview-category-trend__content">
        <div className="mock-interview-category-trend__chart">
          <CategoryTrendLineChart
            multiLineLabels={multiLineLabels}
            labels={resolvedLabels}
            tension={tension}
            dataStress={resolvedSeries.stress}
            dataCompetency={resolvedSeries.competency}
            dataAttitude={resolvedSeries.attitude}
            dataVoice={resolvedSeries.voice}
            height={height}
          />
        </div>

        <div className="mock-trend__legend">
          {resolvedLegendItems.map((item, idx) => (
            <TrendLegendItem
              key={`${item.variant}-${idx}`}
              variant={item.variant}
              name={item.name ?? DEFAULT_NAME[item.variant]}
              description={item.description}
              rating={item.rating}
              ratingText={item.ratingText}
              maxStars={item.maxStars}
              starFilledSrc={item.starFilledSrc}
              starEmptySrc={item.starEmptySrc}
            />
          ))}
        </div>
      </div>
    </>
  );
}