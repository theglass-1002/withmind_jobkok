// src/pages/InterviewReport/analysis/detail/sections/part/GestureTabContent.tsx
import React from "react";
import DetailMetric from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetric";
import DetailMetricTable from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetricTable";

import ic_posture_body from "@/assets/illustrations/ic_posture_body.png";
import ic_arrow_horizontal from "@/assets/illustrations/ic_arrow_horizontal.png";
import ic_arrow_vertical from "@/assets/illustrations/ic_arrow_vertical.png";

import ic_stars_gray600_20 from "@/assets/icons/size20/ic_stars_gray600_20.png";
import ic_conditions_gray600_20 from "@/assets/icons/size20/ic_conditions_gray600_20.png";

type TableRow = { label: string; values: (string | number)[] };

type Props = {
  gradeLabel?: string;
  analysisTitle?: string;
  selectedGrade?: "우수" | "보통" | "미흡";
  analysisText?: React.ReactNode;
  highlight?: React.ReactNode;
  headers?: string[];
  rows?: TableRow[];
};

export default function GestureTabContent({
  gradeLabel = "제스처 등급",
  analysisTitle = "제스처 분석",
  selectedGrade = "보통",
  analysisText = <>전체 평균과 비교했을 때, 홍길동님의 제스처 사용은 적절합니다.</>,
  highlight = <>손 제스처 빈도 ‘5회’, 다양도 ‘중간’, 동기화 ‘보통’</>,
  headers = ["", "손 제스처 빈도", "제스처 다양도", "동기화"],
  rows = [
    { label: "전체 평균", values: ["10회", "중간", "보통"] },
    { label: "직군 평균", values: ["9회", "낮음", "낮음"] },
  ],
}: Props) {
  return (
    <>
      <div className="detail-analysis__attitude-content">
        <div className="detail-analysis__attitude-left">
          <div className="attitude-control">
            <img className="attitude-control__image" src={ic_posture_body} alt="제스처 이미지" />

            <div className="attitude-control__overlay_gesture left">
              <span>5회</span>
            </div>
            <div className="attitude-control__overlay_gesture right">
              <span>2회</span>
            </div>

            <div className="attitude-control__label-horizontal">
              <span className="attitude-control__label">L</span>
              <span className="attitude-control__label">R</span>
            </div>

            <img className="attitude-control__arrows-horizontal" src={ic_arrow_horizontal} alt="" />
            <img className="attitude-control__arrows-vertical" src={ic_arrow_vertical} alt="" />
          </div>
        </div>

        <div className="detail-analysis__attitude-right">
          <DetailMetric
            type="gesture"
            gradeLabel={gradeLabel}
            gradeIconSrc={ic_stars_gray600_20}
            gradeOptions={["우수", "보통", "미흡"]}
            selectedGrade={selectedGrade}
            className="gesture"
            analysisTitle={analysisTitle}
            analysisIconSrc={ic_conditions_gray600_20}
            analysisText={analysisText}
            highlight={highlight}
          />
        </div>
      </div>

      <DetailMetricTable headers={headers} rows={rows} type="gesture" />
    </>
  );
}
