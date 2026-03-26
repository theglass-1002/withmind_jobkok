// src/pages/InterviewReport/analysis/detail/sections/part/GazeTabContent.tsx
import React from "react";
import DetailMetric from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetric";

import ic_posture_body from "@/assets/illustrations/ic_posture_body.png";
import ic_arrow_horizontal from "@/assets/illustrations/ic_arrow_horizontal.png";
import ic_arrow_vertical from "@/assets/illustrations/ic_arrow_vertical.png";
import ic_focus_target from "@/assets/illustrations/ic_focus_target.png";

import ic_stars_gray600_20 from "@/assets/icons/size20/ic_stars_gray600_20.png";
import ic_conditions_gray600_20 from "@/assets/icons/size20/ic_conditions_gray600_20.png";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  reportDetail?: InterviewReportDetailResponse | null;
};

export default function GazeTabContent({ reportDetail }: Props) {
  const gaze = reportDetail?.tab2?.detailAttitude?.gaze;
  const pointList = gaze?.gazeData?.geze?.pointList ?? [];

  return (
    <>
      <div className="detail-analysis__attitude-content">
        <div className="detail-analysis__attitude-left">
          <div className="attitude-control">
            <img
              className="attitude-control__image"
              src={ic_posture_body}
              alt="시선 분석 가이드"
            />

            <div className="attitude-control__label-horizontal">
              <span className="attitude-control__label">L</span>
              <span className="attitude-control__label">R</span>
            </div>

            <img
              className="attitude-control__overlay_target"
              src={ic_focus_target}
              alt=""
            />

            {pointList.map((point, index) => (
              <span
                key={`${point.x}-${point.y}-${index}`}
                className="attitude-control__overlay_scatter"
                style={
                  {
                    position: "absolute",
                    left: `${point.x}px`,
                    top: `${point.y}px`,
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                  } as React.CSSProperties
                }
                aria-hidden="true"
              />
            ))}

            <img
              className="attitude-control__arrows-horizontal"
              src={ic_arrow_horizontal}
              alt=""
            />
            <img
              className="attitude-control__arrows-vertical"
              src={ic_arrow_vertical}
              alt=""
            />
          </div>
        </div>

        <div className="detail-analysis__attitude-right">
          <DetailMetric
            type="gaze"
            gradeLabel="시선 등급"
            gradeIconSrc={ic_stars_gray600_20}
            gradeOptions={["우수", "보통", "미흡"]}
            className="gaze"
            analysisTitle="시선 분석"
            analysisIconSrc={ic_conditions_gray600_20}
            reportDetail={reportDetail}
          />
        </div>
      </div>
    </>
  );
}