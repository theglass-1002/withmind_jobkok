// src/pages/MockInterview/my-report/part/ScoreDistributionSection.tsx
import React from "react";
import ScoreDistributionChart from "./ScoreDistributionChart";

type SideProps = {
  role: string;
  rankText: string;
  badgeText: string;
  values: number[];
  highlightScore?: number;
};

type Props = {
  title: string;
  titleIconSrc: string;
  labels: (string | string[])[];
  max?: number;
  left: SideProps;
  right: SideProps;
  badgeIconSrc: string;
};

export default function ScoreDistributionSection({
  title,
  titleIconSrc,
  labels,
  max = 100,
  left,
  right,
  badgeIconSrc,
}: Props) {
  return (
    <div className="analysis-section mock-analysis-overview__score-distribution">
      <span className="analysis-section__title">
        <img src={titleIconSrc} alt="" />
        {title}
      </span>

      <div className="analysis-section__body">
        <div className="analysis-section__left">
          <div className="analysis-section__stat">
            <div className="analysis-section__stat-head">
              <span className="analysis-section__stat-role">{left.role}</span>
              <span className="analysis-section__stat-rank">{left.rankText}</span>
            </div>
            <div className="analysis-badge analysis-badge--up">
              <img className="analysis-badge__icon" src={badgeIconSrc} alt="" />
              <span className="analysis-badge__text">{left.badgeText}</span>
            </div>
          </div>

          <ScoreDistributionChart
            labels={labels}
            values={left.values}
            max={max}
            highlightScore={left.highlightScore}
          />
        </div>

        <div className="analysis-section__right">
          <div className="analysis-section__stat">
            <div className="analysis-section__stat-head">
              <span className="analysis-section__stat-role">{right.role}</span>
              <span className="analysis-section__stat-rank">{right.rankText}</span>
            </div>
            <div className="analysis-badge analysis-badge--up">
              <img className="analysis-badge__icon" src={badgeIconSrc} alt="" />
              <span className="analysis-badge__text">{right.badgeText}</span>
            </div>
          </div>

          <ScoreDistributionChart
            labels={labels}
            values={right.values}
            max={max}
            highlightScore={right.highlightScore}
          />
        </div>
      </div>
    </div>
  );
}
