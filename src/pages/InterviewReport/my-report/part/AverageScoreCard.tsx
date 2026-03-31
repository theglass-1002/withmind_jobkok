// src/pages/InterviewReport/my-report/part/AverageScoreCard.tsx
import React from "react";
import ic_page_facing_up_24 from "@/assets/icons/size24/ic_page-facing-up_24.png";
import ic_info_white80_20 from "@/assets/icons/size20/ic_info_white80_20.png";
import ic_yellow_flag20 from "@/assets/icons/size20/ic_yellow_flag20.png";
import ic_check_circle_white_100_20 from "@/assets/icons/size20/ic_check_circle_white_100_20.png";
import ScoreBarChartJS from "@/pages/InterviewReport/my-report/part/ScoreBarChartJS";

import Tooltip from "@/shared/components/tooltip/Tooltip";
import type { MyReportResponse } from "@/api/report/report.types";
import { Storage } from "@/shared/utils/StorageManager";
// 실제 경로가 다르면 이 import 경로만 네 프로젝트에 맞게 수정

type AverageScoreCardProps = {
  score: number;
  average: number;
  max: number;
  markLabel?: string;
  desc?: string;
  topBadgeText?: string;
  secondaryBadges?: string[];
  data?: MyReportResponse | null;
};

export default function AverageScoreCard({
  score,
  average,
  max,
  markLabel = "면접우수 마크",
  desc = "꾸준한 연습과 경험이 안정적으로 반영된 결과입니다. 면접 대응의 기본 역량과 직무 관련 이해도가 충분히 확보되어 있으며, 추가 보완을 통해 더 높은 성과로 이어질 수 있습니다.",
  topBadgeText = "상위10%",
  secondaryBadges = ["기본기 충실", "준비도 높음"],
  data,
}: AverageScoreCardProps) {
  console.log("[AverageScoreCard data]", data);

  if (!data) {
    return null;
  }

  const myAvgScore = data.myAvgScore;
  const myAvgFeedback = data.myAvgFeedback;
  const userName = Storage.getUserName();

  const displayScore = myAvgScore.avgScore ?? score;
  const displayAverage = myAvgScore.globalAvg ?? average;
  const displayMarkLabel = myAvgScore.gradeText ?? markLabel;
  const displayDesc = myAvgFeedback.overallFeedback ?? desc;
  const displayTopBadgeText = `상위 ${myAvgScore.topPercent}%`;
  const displaySecondaryBadges = [
    myAvgScore.basicLevel,
    myAvgScore.readiness,
  ].filter(Boolean);

  return (
    <div className="mock-interview-summary__chart mock-interview-summary__chart--brand">
      <div className="mock-interview-summary__chart-left">
        <div className="mock-interview-summary__chart-header">
          <div className="mock-interview-summary__chart-title mock-interview-summary__chart-title--brand">
            <img
              className="mock-interview-summary__chart-title-icon"
              src={ic_page_facing_up_24}
              alt=""
              aria-hidden="true"
            />
            나의 모의면접 평균 점수
          </div>

          <Tooltip
            iconElement={<img src={ic_info_white80_20} alt="" />}
            title="모의면접 평균 점수"
            desc={`모의면접 평균 점수는 여러분이 면접에 얼마나 잘 대비하고 있는지를 평가하는 지표입니다.
이 지표는 3단계(미흡, 보통, 우수)로 나뉘며, 모의면접 종합 코멘트가 함께 제공됩니다.`}
            position="top"
            className="mock-interview__chart-info"
          />
        </div>

        <div className="mock-interview-summary__chart-scorebox">
          <div className="mock-interview-summary__chart-score">
            {displayScore}점
            <div className="mock-interview-summary__chart-badge">
              면접 준비 {displayMarkLabel}
            </div>
          </div>
          <span className="mock-interview-summary__chart-desc">
            {displayDesc}
          </span>
        </div>

        <div className="mock-interview-summary__chart-tags">
          <span className="mock-interview-summary__chart-tag mock-interview-summary__chart-tag--accent">
            <img
              className="mock-interview-summary__chart-tag-icon"
              src={ic_yellow_flag20}
              alt=""
              aria-hidden="true"
            />
            {displayTopBadgeText || topBadgeText}
          </span>

          <div className="mock-interview-summary__chart-tags mock-interview-summary__chart-tags--secondary">
            {(displaySecondaryBadges.length > 0
              ? displaySecondaryBadges
              : secondaryBadges
            ).map((label, i) => (
              <span className="mock-interview-summary__chart-tag" key={i}>
                <img
                  className="mock-interview-summary__chart-tag-icon"
                  src={ic_check_circle_white_100_20}
                  alt=""
                  aria-hidden="true"
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mock-interview-summary__chart-right">
        <div className="mock-interview-summary__chart-metric">
          <span className="mock-interview-summary__chart-metric-name">
            {userName}
          </span>
          <span className="mock-interview-summary__chart-metric-score">
            {displayScore}/{max}점
          </span>
        </div>

        <div
          className="mock-interview-summary__chart-graph"
          role="img"
          aria-label="평균 점수 그래프"
        >
          <ScoreBarChartJS
            score={displayScore}
            average={displayAverage}
            max={max}
          />
        </div>

        <div className="mock-interview-summary__chart-axis">
          <div className="mock-interview-summary__chart-axis-range">
            <span className="mock-interview-summary__chart-axis-min">0점</span>
            <span className="mock-interview-summary__chart-axis-max">
              {max}점
            </span>
            <span
              className="mock-interview-summary__chart-axis-avg"
              style={{
                left: `${(displayAverage / max) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              평균{displayAverage}점
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}