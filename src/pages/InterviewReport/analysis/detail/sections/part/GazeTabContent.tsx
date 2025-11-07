// src/pages/InterviewReport/analysis/detail/sections/part/GazeTabContent.tsx
import React from "react";
import DetailMetric from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetric";

import ic_posture_body from "@/assets/illustrations/ic_posture_body.png";
import ic_arrow_horizontal from "@/assets/illustrations/ic_arrow_horizontal.png";
import ic_arrow_vertical from "@/assets/illustrations/ic_arrow_vertical.png";
import ic_focus_target from "@/assets/illustrations/ic_focus_target.png";
import ic_gaze_scatter from "@/assets/illustrations/ic_gaze_scatter.png";

import ic_stars_gray600_20 from "@/assets/icons/size20/ic_stars_gray600_20.png";
import ic_conditions_gray600_20 from "@/assets/icons/size20/ic_conditions_gray600_20.png";

type Props = {
  gazeAngle: number;
  gazeX?: number;
  gazeY?: number;
  gradeLabel?: string;
  analysisTitle?: string;
  selectedGrade?: "우수" | "보통" | "미흡";
  analysisText?: React.ReactNode;
  highlight?: React.ReactNode;
};

export default function GazeTabContent({
  gazeAngle,
  gazeX = 0,
  gazeY = 0,
  gradeLabel = "시선 등급",
  analysisTitle = "시선 분석",
  selectedGrade = "보통",
  analysisText = <>전체 평균과 비교했을 때, 홍길동님의 시선은 양호합니다.</>,
  highlight = <>정면 응시 ‘72%’, 시선 분산도 ‘낮음’, 눈 깜박임 ‘15회’</>,
}: Props) {
  return (
    <>
      <div className="detail-analysis__attitude-content">
        <div className="detail-analysis__attitude-left">
          <div className="attitude-control">
            <img className="attitude-control__image" src={ic_posture_body} alt="시선 분석 가이드" />

            <div className="attitude-control__label-horizontal">
              <span className="attitude-control__label">L</span>
              <span className="attitude-control__label">R</span>
            </div>

            <img className="attitude-control__overlay_target" src={ic_focus_target} alt="" />

            <img
              className="attitude-control__overlay_scatter"
              style={{ transform: `translate(${gazeX}px, ${gazeY}px) rotate(${gazeAngle}deg)` }}
              src={ic_gaze_scatter}
              alt=""
            />

            <img className="attitude-control__arrows-horizontal" src={ic_arrow_horizontal} alt="" />
            <img className="attitude-control__arrows-vertical" src={ic_arrow_vertical} alt="" />
          </div>
        </div>

        <div className="detail-analysis__attitude-right">
          <DetailMetric
            type="gaze"
            gradeLabel={gradeLabel}
            gradeIconSrc={ic_stars_gray600_20}
            gradeOptions={["우수", "보통", "미흡"]}
            selectedGrade={selectedGrade}
            className="gaze"
            analysisTitle={analysisTitle}
            analysisIconSrc={ic_conditions_gray600_20}
            analysisText={analysisText}
            highlight={highlight}
          />
        </div>
      </div>
    </>
  );
}
