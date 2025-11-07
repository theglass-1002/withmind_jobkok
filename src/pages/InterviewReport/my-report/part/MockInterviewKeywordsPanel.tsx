// src/pages/InterviewReport/my-report/part/MockInterviewKeywordsPanel.tsx
import React from "react";
import KeywordsBubbleChart, { type KeywordPoint } from "./KeywordsBubbleChart";

type RankItem = { rank: number; label: string; count: number; };

export interface MockInterviewKeywordsPanelProps {
  iconSrc: string;
  title: string;
  keywords: KeywordPoint[];
  rankItems: RankItem[];
  chartClassName?: string;
}

export default function MockInterviewKeywordsPanel({
  iconSrc,
  title,
  keywords,
  rankItems,
  chartClassName = "keywords-panel__chart-fill",
}: MockInterviewKeywordsPanelProps) {
  return (
     <>
      <span className="mock-interview__title mock-interview-category-trend__title">
        <img src={iconSrc} alt="" aria-hidden="true" />
        {title}
      </span>
      <div className="keywords-panel__content">
        <div className="keywords-panel__chart">
          <div className="keywords-panel__chart-box">
            <KeywordsBubbleChart data={keywords} showLabels className={chartClassName} />
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
