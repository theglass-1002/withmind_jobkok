import React, { ReactNode } from "react";
import ic_bar_chart_24 from "@/assets/icons/size24/ic_bar_chart_24.png";
import ic_crown_white_20 from "@/assets/icons/size20/ic_crown_white_20.png";

type ScoreTrendCardProps = {
  title?: string;
  bestScoreLabel?: string;  // "최고 점수"
  bestScore?: string;       // "92점"
  graphAriaLabel?: string;
  children?: ReactNode;     // 내부에 라인차트 등 삽입
};

export default function ScoreTrendCard({
  title = "나의 모의면접 점수 추이",
  bestScoreLabel = "최고 점수",
  bestScore = "92점",
  graphAriaLabel = "점수 추이 차트",
  children,
}: ScoreTrendCardProps) {
  return (
    <div className="mock-interview-summary__chart mock-interview-summary__chart--surface">
      <div className="mock-interview-summary__chart-title mock-interview-summary__chart-title--surface">
        <img
          className="mock-interview-summary__chart-title-icon"
          src={ic_bar_chart_24}
          alt=""
          aria-hidden="true"
        />
        {title}
      </div>

      <div className="mock-interview-summary__chart-summary">
        <div className="mock-interview-summary__chart-summary-item">
          <div className="mock-interview-summary__chart-summary-label">
            <span className="mock-interview-summary__chart-summary-icon-wrap">
              <img
                className="mock-interview-summary__chart-summary-icon"
                src={ic_crown_white_20}
                alt=""
                aria-hidden="true"
              />
            </span>
            {bestScoreLabel}
          </div>
          <div className="mock-interview-summary__chart-summary-value">{bestScore}</div>
        </div>
      </div>

      <div className="mock-interview-summary__trend-graph" role="img">
        {children ?? "(최고점수)그래프차트 화면"}
      </div>
    </div>
  );
}
