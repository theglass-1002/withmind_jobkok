// src/pages/InterviewReport/analysis/detail/sections/part/AttitudeTabContent.tsx
import React from "react";
import DetailMetric from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetric";
import DetailMetricTable from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetricTable";

import ic_posture_body from "@/assets/illustrations/ic_posture_body.png";
import ic_arrow_horizontal from "@/assets/illustrations/ic_arrow_horizontal.png";
import ic_arrow_vertical from "@/assets/illustrations/ic_arrow_vertical.png";
import body_outline_dotted from "@/assets/illustrations/body_outline_dotted.png";
import face_outline_dotted from "@/assets/illustrations/face_outline_dotted.png";

import ic_stars_gray600_20 from "@/assets/icons/size20/ic_stars_gray600_20.png";
import ic_conditions_gray600_20 from "@/assets/icons/size20/ic_conditions_gray600_20.png";
import ic_refresh_gray500_24 from "@/assets/icons/size24/ic_refresh_gray500_24.png";
import ic_height_gray500_24 from "@/assets/icons/size24/ic_height_gray500_24.png";

type TableRow = { label: string; values: (string | number)[] };

type Props = {
  faceAngle: number;
  bodyAngle: number;
  gradeLabel?: string;
  analysisTitle?: string;
  selectedGrade?: "우수" | "보통" | "미흡";
  analysisText?: React.ReactNode;
  highlight?: React.ReactNode;
  headers?: string[];
  rows?: TableRow[];
};

export default function AttitudeTabContent({
  faceAngle,
  bodyAngle,
  gradeLabel = "자세 등급",
  analysisTitle = "자세 분석",
  selectedGrade = "미흡",
  analysisText = <>전체 평균과 비교했을 때, 홍길동님의 자세는 양호합니다.</>,
  highlight = <>머리 ‘-1.234도’, 어깨 ‘-1.234도’, 좌우 움직임 ‘13회’</>,
  headers = ["", "머리 각도", "어깨 각도", "좌우 움직임"],
  rows = [
    { label: "전체 평균", values: ["1.23도", "1.23도", "4회"] },
    { label: "직군 평균", values: ["1.23도", "1.23도", "4회"] },
  ],
}: Props) {
  return (
    <>
      <div className="detail-analysis__attitude-content">
        <div className="detail-analysis__attitude-left">
          <div className="attitude-control">
            <div className="attitude-control__rotation">
              <span className="attitude-control__rotation-btn left">
                <img src={ic_refresh_gray500_24} alt="왼쪽 회전" />
              </span>
              <span className="attitude-control__rotation-btn right">
                <img src={ic_refresh_gray500_24} alt="오른쪽 회전" />
              </span>
            </div>

            <img className="attitude-control__image" src={ic_posture_body} alt="자세 이미지" />
            <img
              className="attitude-control__overlay-face"
              style={{ '--face-angle': `${faceAngle}deg` } as React.CSSProperties}
              src={face_outline_dotted}
              alt=""
            />
            <img
              className="attitude-control__overlay-body"
              style={{ '--body-angle': `${bodyAngle}deg` } as React.CSSProperties}
              src={body_outline_dotted}
              alt=""
            />


            <div className="attitude-control__label-horizontal">
              <span className="attitude-control__label">L</span>
              <span className="attitude-control__label">R</span>
            </div>

            <img className="attitude-control__arrows-horizontal" src={ic_arrow_horizontal} alt="" />
            <img className="attitude-control__arrows-vertical" src={ic_arrow_vertical} alt="" />

            <div className="attitude-control__height">
              <span className="attitude-control__height-btn">
                <img src={ic_height_gray500_24} alt="높이 증가" />
              </span>
              <span className="attitude-control__height-btn">
                <img src={ic_height_gray500_24} alt="높이 감소" />
              </span>
            </div>
          </div>
        </div>

        <div className="detail-analysis__attitude-right">
          <DetailMetric
            type="attitude"
            gradeLabel={gradeLabel}
            gradeIconSrc={ic_stars_gray600_20}
            gradeOptions={["우수", "보통", "미흡"]}
            selectedGrade={selectedGrade}
            className="attitude"
            analysisTitle={analysisTitle}
            analysisIconSrc={ic_conditions_gray600_20}
            analysisText={analysisText}
            highlight={highlight}
          />
        </div>
      </div>

      <DetailMetricTable headers={headers} rows={rows} type="attitude" />
    </>
  );
}
