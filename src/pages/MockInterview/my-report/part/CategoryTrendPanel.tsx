// src/pages/MockInterview/my-report/part/CategoryTrendPanel.tsx
import React from "react";
import ic_card_index_dividers_24 from "@/assets/icons/size24/ic_card_index_dividers_24.png";

import CategoryTrendLineChart from "./CategoryTrendLineChart";
import type { CategoryTrendLineChartProps } from "./CategoryTrendLineChart";

import TrendLegendItem from "./TrendLegendItem";
import type { TrendLegendItemProps } from "./TrendLegendItem";
export interface CategoryTrendPanelProps {
  /** 패널 타이틀 */
  title?: string;
  /** 차트 라벨 (하단 날짜 10개) */
  labels: CategoryTrendLineChartProps["labels"];
  /** 차트 시리즈 */
  series: {
    stress: number[];     // 긴장도
    competency: number[]; // 역량
    attitude: number[];   // 태도
    voice: number[];      // 목소리
  };
  /** 선 곡률(0=직선) */
  tension?: number;
  /** 차트 높이(px) */
  height?: number;

  /** 우측 레전드 아이템들 */
  legendItems: Array<
    Omit<TrendLegendItemProps, "variant" | "name"> & {
      variant: TrendLegendItemProps["variant"];
      name?: string; // 비우면 variant로 기본 이름 매핑
    }
  >;
}

const DEFAULT_NAME: Record<TrendLegendItemProps["variant"], string> = {
  competency: "역량 분석",
  attitude: "태도 분석",
  voice: "목소리 분석",
  stress: "긴장도 분석",
};

export default function CategoryTrendPanel({
  title = "항목별 종합 분석 추이",
  labels,
  series,
  tension = 0,
  height = 260,
  legendItems,
}: CategoryTrendPanelProps) {
  return (
    <>
       <span className="mock-interview__title mock-interview-category-trend__title">
        <img src={ic_card_index_dividers_24} alt="" aria-hidden="true" />
        {title}
      </span>

      <div className="mock-interview-category-trend__content">
        <div className="mock-interview-category-trend__chart">
          <CategoryTrendLineChart
            labels={labels}
            tension={tension}
            dataStress={series.stress}
            dataCompetency={series.competency}
            dataAttitude={series.attitude}
            dataVoice={series.voice}
            height={height}
          />
        </div>

        <div className="mock-trend__legend">
          {legendItems.map((item, idx) => (
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
