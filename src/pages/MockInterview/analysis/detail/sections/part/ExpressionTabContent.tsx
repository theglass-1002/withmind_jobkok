import React from "react";
import DetailMetric from "@/pages/MockInterview/analysis/detail/sections/part/DetailMetric";
import DetailMetricTable from "@/pages/MockInterview/analysis/detail/sections/part/DetailMetricTable";
import ExpressionDonutChart from "@/pages/MockInterview/analysis/chart/ExpressionDonutChart";

import ic_stars_gray600_20 from "@/assets/icons/size20/ic_stars_gray600_20.png";
import ic_conditions_gray600_20 from "@/assets/icons/size20/ic_conditions_gray600_20.png";

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

export default function ExpressionTabContent({
  faceAngle,
  bodyAngle,
  gradeLabel = "자세 등급",
  analysisTitle = "자세 분석",
  selectedGrade = "미흡",
  analysisText = <>전체 평균과 비교했을 때, 홍길동님의 자세는 양호합니다.</>,
  highlight = <>머리 '-1.234도', 어깨 '-1.234도', 좌우 움직임 '13회'</>,
  headers = ["", "머리 각도", "어깨 각도", "좌우 움직임"],
  rows = [
    { label: "전체 평균", values: ["1.23도", "1.23도", "4회"] },
    { label: "직군 평균", values: ["1.23도", "1.23도", "4회"] },
  ],
}: Props) {
  return (
    <>
      <div className="detail-analysis__attitude-content">
        <div className="detail-analysis__attitude-left expression">
          <ExpressionDonutChart
            value={70}
            label="무표정"
            size={300}
            stroke={20}
          />
        </div>

        <div className="detail-analysis__attitude-right">
          <DetailMetric
            type="expression"
            gradeLabel={gradeLabel}
            gradeIconSrc={ic_stars_gray600_20}
            gradeOptions={["우수", "보통", "미흡"]}
            selectedGrade={selectedGrade}
            className="expression"
            analysisTitle={analysisTitle}
            analysisIconSrc={ic_conditions_gray600_20}
            analysisText={analysisText}
            highlight={highlight}
          />
        </div>
      </div>

      <DetailMetricTable headers={headers} rows={rows} type="expression" />
    </>
  );
}