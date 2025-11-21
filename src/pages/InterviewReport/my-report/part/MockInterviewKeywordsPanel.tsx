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
  scale?: number; // 버블 크기 스케일 (기본값: 1)
}

export default function MockInterviewKeywordsPanel({
  iconSrc,
  title,
  keywords,
  rankItems,
  chartClassName = "keywords-panel__chart-fill",
  scale = 1,
  
}: MockInterviewKeywordsPanelProps) {
  return (
     <>
      <span className="mock-interview__title mock-interview-category-trend__title">
        <img className="keywords-keywords-icon" src={iconSrc} alt="" aria-hidden="true" />
        {title}
      </span>
      <div className="keywords-panel__content">
        <div className="keywords-panel__chart">
          <div className="keywords-panel__chart-box">
            <KeywordsBubbleChart 
            scale={scale}
            data={keywords} showLabels className={chartClassName} />
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
