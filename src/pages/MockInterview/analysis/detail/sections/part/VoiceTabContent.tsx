// src/pages/MockInterview/analysis/detail/sections/part/VoiceTabContent.tsx
import React from "react";
import DetailMetric from "@/pages/MockInterview/analysis/detail/sections/part/DetailMetric";
import DetailMetricTable from "@/pages/MockInterview/analysis/detail/sections/part/DetailMetricTable";
import VoicePitchChart from "@/pages/MockInterview/analysis/chart/VoicePitchChart";



import ic_stars_gray600_20 from "@/assets/icons/size20/ic_stars_gray600_20.png";
import ic_conditions_gray600_20 from "@/assets/icons/size20/ic_conditions_gray600_20.png";
import ic_timeline_gray600_20 from "@/assets/icons/size20/ic_timeline_gray600_20.png";

type TableRow = { label: string; values: (string | number)[] };

type Props = {
  gradeLabel?: string;
  analysisTitle?: string;
  selectedGrade?: "우수" | "보통" | "미흡";
  analysisText?: React.ReactNode;
  highlight?: React.ReactNode;
  headers?: string[];
  rows?: TableRow[];
  className?: string;
};

export default function VoiceTabContent({
  gradeLabel = "목소리 톤 등급",
  analysisTitle = "목소리 톤 분석",
  selectedGrade = "보통",
  analysisText = <>전체 평균과 비교했을 때, 홍길동님의 목소리 톤은 적절합니다.</>,
  highlight = <>평균 톤 '205 Hz', 변동폭 '중간', 안정성 '우수'</>,
  headers = ["", "낮은 저음", "저음", "중간", "고음", "높은 고음"],
  rows = [
    { label: "전체 평균", values: ["180 Hz", "190 Hz", "205 Hz", "245 Hz", "280 Hz"] },
    { label: "직군 평균", values: ["175 Hz", "195 Hz", "210 Hz", "240 Hz", "275 Hz"] },
  ],
  className
}: Props) {
  return (
    <>
      <div className={`detail-analysis__attitude-content ${className ?? ""}`}>
        <div className="detail-analysis__attitude-left">
          <span className="detail-analysis__metric-grade-label">
            <img src={ic_timeline_gray600_20} alt="" />
            홍길동님의 목소리 톤
          </span>
          <VoicePitchChart
            values={[220, 195, 210, 180, 195, 170, 180, 170, 195, 145, 180]}
            averageLine={200}
            averageLabel="평균"
            min={0}
            max={300}
          />
        </div>

        <div className="detail-analysis__attitude-right">
          <DetailMetric
            type={className}
            gradeLabel={gradeLabel}
            gradeIconSrc={ic_stars_gray600_20}
            gradeOptions={["우수", "보통", "미흡"]}
            selectedGrade={selectedGrade}
            className={className}
            analysisTitle={analysisTitle}
            analysisIconSrc={ic_conditions_gray600_20}
            analysisText={analysisText}
            highlight={highlight}
          />
        </div>
      </div>

      <DetailMetricTable
        className={className}
        headers={headers}
        rows={rows}
        type={className}
      />
    </>
  );
}