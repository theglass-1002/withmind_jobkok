import React from "react";
import ic_page_facing_up_24 from "@/assets/icons/size24/ic_page-facing-up_24.png";
import ic_info_white80_20 from "@/assets/icons/size20/ic_info_white80_20.png";
import ic_yellow_flag20 from "@/assets/icons/size20/ic_yellow_flag20.png";
import ic_check_circle_white_100_20 from "@/assets/icons/size20/ic_check_circle_white_100_20.png";
import ScoreBarChartJS from "@/pages/InterviewReport/my-report/part/ScoreBarChartJS";

type AverageScoreCardProps = {
  score: number;
  average: number;
  max: number;
  userName: string;                  // 우측 메트릭에 표시할 사용자명
  markLabel?: string;                // “면접우수 마크” 텍스트
  desc?: string;                     // 설명 문구
  topBadgeText?: string;             // “상위10%” 같은 강조 배지
  secondaryBadges?: string[];        // 보조 배지 리스트
};

export default function AverageScoreCard({
  score,
  average,
  max,
  userName,
  markLabel = "면접우수 마크",
  desc = "꾸준한 연습과 경험이 안정적으로 반영된 결과입니다. 면접 대응의 기본 역량과 직무 관련 이해도가 충분히 확보되어 있으며, 추가 보완을 통해 더 높은 성과로 이어질 수 있습니다.",
  topBadgeText = "상위10%",
  secondaryBadges = ["기본기 충실", "준비도 높음"],
}: AverageScoreCardProps) {
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
          <span className="tooltip tooltip--top mock-interview__chart-info">
          <img
            className="mock-interview-summary__chart-info-icon"
            src={ic_info_white80_20}
            alt=""
            aria-hidden="true"
            tabIndex={0}  // 키보드 포커스로도 열리게(선택)
          />
          <div className="tooltip__content" role="tooltip">
            <span className="tooltip__title">모의면접 평균 점수</span>
            <span className="tooltip__desc">
              모의면접 평균 점수는 여러분이 면접에 얼마나 잘 대비하고 있는지를 평가하는 지표입니다.
              이 지표는 3단계(미흡, 보통, 우수)로 나뉘며, 모의면접 종합 코멘트가 함께 제공됩니다.
            </span>
          </div>
        </span>
                
        </div>
        <div className="mock-interview-summary__chart-scorebox">
          <div className="mock-interview-summary__chart-score">
            {score}점
            <div className="mock-interview-summary__chart-badge">{markLabel}</div>
          </div>
          <span className="mock-interview-summary__chart-desc">{desc}</span>
        </div>

        <div className="mock-interview-summary__chart-tags">
          <span className="mock-interview-summary__chart-tag mock-interview-summary__chart-tag--accent">
            <img
              className="mock-interview-summary__chart-tag-icon"
              src={ic_yellow_flag20}
              alt=""
              aria-hidden="true"
            />
            {topBadgeText}
          </span>

          <div className="mock-interview-summary__chart-tags mock-interview-summary__chart-tags--secondary">
            {secondaryBadges.map((label, i) => (
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
          <span className="mock-interview-summary__chart-metric-name">{userName}</span>
          <span className="mock-interview-summary__chart-metric-score">
            {score}/{max}점
          </span>
        </div>

        <div
          className="mock-interview-summary__chart-graph"
          role="img"
          aria-label="평균 점수 그래프"
        >
          <ScoreBarChartJS score={score} average={average} max={max} />
        </div>

        <div className="mock-interview-summary__chart-axis">
          <div className="mock-interview-summary__chart-axis-range">
            <span className="mock-interview-summary__chart-axis-min">0점</span>
            <span className="mock-interview-summary__chart-axis-max">{max}점</span>
            <span
              className="mock-interview-summary__chart-axis-avg"
              style={{ left: `${(average / 100) * 100}%`, transform: "translateX(-50%)" }}
            >
              평균{average}점
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
