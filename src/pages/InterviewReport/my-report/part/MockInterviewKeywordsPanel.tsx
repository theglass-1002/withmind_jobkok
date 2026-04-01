// src/pages/InterviewReport/my-report/part/MockInterviewKeywordsPanel.tsx
import React from "react";
import KeywordsBubbleChart, { type KeywordPoint } from "./KeywordsBubbleChart";
import type { MyReportResponse } from "@/api/report/report.types";

type RankItem = {
  rank: number;
  label: string;
  count: number;
};

export interface MockInterviewKeywordsPanelProps {
  iconSrc: string;
  title: string;
  chartClassName?: string;
  scale?: number;
  data?: MyReportResponse | null;
}

export default function MockInterviewKeywordsPanel({
  iconSrc,
  title,
  chartClassName = "keywords-panel__chart-fill",
  scale = 1,
  data,
}: MockInterviewKeywordsPanelProps) {


  const frequentWords = data?.frequentWords ?? [];

  const keywords: KeywordPoint[] = frequentWords.slice(0, 5).map((item, index) => {
    const preset = [
      { x: 30, y: 50, r: 90, group: "green" as const },
      { x: 45, y: 35, r: 72, group: "teal" as const },
      { x: 15, y: 60, r: 64, group: "teal" as const },
      { x: 20, y: 35, r: 52, group: "gray" as const },
      { x: 80, y: 30, r: 48, group: "gray" as const },
    ][index];

    return {
      label: item.word ?? "-",
      x: preset?.x ?? 50,
      y: preset?.y ?? 50,
      r: preset?.r ?? 50,
      group: preset?.group ?? "gray",
    };
  });

  const rankItems: RankItem[] = frequentWords.slice(0, 5).map((item, index) => ({
    rank: item.rank ?? index + 1,
    label: item.word ?? "-",
    count: item.count ?? 0,
  }));

  return (
    <>
      <span className="mock-interview__title mock-interview-category-trend__title">
        <img
          className="keywords-keywords-icon"
          src={iconSrc}
          alt=""
          aria-hidden="true"
        />
        {title}
      </span>

      <div className="keywords-panel__content">
        <div className="keywords-panel__chart">
          <div className="keywords-panel__chart-box">
            <KeywordsBubbleChart
              scale={scale}
              data={keywords}
              showLabels
              className={chartClassName}
            />
          </div>
        </div>

        <div className="keywords-panel__rank">
          {rankItems.map((item) => (
            <div className="keywords-panel__rank-item" key={item.rank}>
              <div className="keywords-panel__rank-item-head">
                <span className="keywords-panel__rank-badge">{item.rank}위</span>
                {item.label}
              </div>
              {item.count}회
            </div>
          ))}
        </div>
      </div>
    </>
  );
}