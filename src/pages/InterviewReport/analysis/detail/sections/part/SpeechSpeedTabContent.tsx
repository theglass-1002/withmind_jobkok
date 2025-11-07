// src/pages/InterviewReport/analysis/detail/sections/part/SpeechSpeedTabContent.tsx
import React from "react";
import DetailMetric from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetric";
import DetailMetricTable from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetricTable";
import SpeakingSpeedChart from "@/pages/InterviewReport/analysis/chart/SpeakingSpeedChart";

import ic_stars_gray600_20 from "@/assets/icons/size20/ic_stars_gray600_20.png";
import ic_record_voice_gray600_20 from "@/assets/icons/size20/ic_record_voice_gray600_20.png";
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

export default function SpeechSpeedTabContent({
  gradeLabel = "말하는 속도 등급",
  analysisTitle = "말하는 속도 분석",
  selectedGrade = "보통",
  analysisText = <>전체 평균과 비교했을 때, 홍길동님의 말하는 속도는 적절합니다.</>,
  highlight = <>평균 속도 '5.2 SPS', 변동폭 '안정적', 일관성 '우수'</>,
  headers = ["느림", "다소 느림", "보통", "다소 빠름", "빠름"],
  rows = [
    { label: "3.5 SPS 이하", values: ["3.5~4.5 SPS", "4.5~5.5 SPS", "5.5~6.5 SPS", "6.5 SPS 이상"] },
  ],
  className
}: Props) {
  return (
    <>
      <div className={`detail-analysis__attitude-content ${className ?? ""}`}>
        <div className="detail-analysis__attitude-left">
          <span className="detail-analysis__metric-grade-label">
            <img src={ic_timeline_gray600_20} alt="" />
            홍길동님의 말하는 속도
          </span>
          <SpeakingSpeedChart
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
            analysisIconSrc={ic_record_voice_gray600_20}
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