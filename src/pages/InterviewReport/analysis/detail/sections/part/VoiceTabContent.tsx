// src/pages/InterviewReport/analysis/detail/sections/part/VoiceTabContent.tsx
import React from "react";
import DetailMetric from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetric";
import DetailMetricTable from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetricTable";
import VoicePitchChart from "@/pages/InterviewReport/analysis/chart/VoicePitchChart";

import ic_stars_gray600_20 from "@/assets/icons/size20/ic_stars_gray600_20.png";
import ic_conditions_gray600_20 from "@/assets/icons/size20/ic_conditions_gray600_20.png";
import ic_timeline_gray600_20 from "@/assets/icons/size20/ic_timeline_gray600_20.png";
import { InterviewReportDetailResponse } from "@/api/report/report.types";
import { Storage } from "@/shared/utils/StorageManager";

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
  reportDetail?: InterviewReportDetailResponse | null;
};

export default function VoiceTabContent({
  gradeLabel = "목소리 톤 등급",
  analysisTitle = "목소리 톤 분석",
  selectedGrade = "보통",
  analysisText = (
    <>전체 평균과 비교했을 때, 위위님의 목소리 톤은 적절합니다.</>
  ),
  highlight = <>평균 톤 '205 Hz', 변동폭 '중간', 안정성 '우수'</>,
  headers = ["", "낮은 저음", "저음", "중간", "고음", "높은 고음"],
  rows = [
    {
      label: "전체 평균",
      values: ["180 Hz", "190 Hz", "205 Hz", "245 Hz", "280 Hz"],
    },
    {
      label: "직군 평균",
      values: ["175 Hz", "195 Hz", "210 Hz", "240 Hz", "275 Hz"],
    },
  ],
  className,
  reportDetail,
}: Props) {
  const averageLine = Number(
    reportDetail?.tab2?.voiceAnalysis?.tone?.avgHz ?? 200
  );

  const rawChartData = reportDetail?.tab2?.voiceAnalysis?.tone?.chartData;

  const chartValues = rawChartData
    ? [
        Number(rawChartData.x1 ?? 0),
        Number(rawChartData.x2 ?? 0),
        Number(rawChartData.x3 ?? 0),
        Number(rawChartData.x4 ?? 0),
        Number(rawChartData.x5 ?? 0),
        Number(rawChartData.x6 ?? 0),
        Number(rawChartData.x7 ?? 0),
        Number(rawChartData.x8 ?? 0),
        Number(rawChartData.x9 ?? 0),
        Number(rawChartData.x10 ?? 0),
      ]
    : [220, 195, 210, 180, 195, 170, 180, 170, 195, 145, 180];

  const userName = Storage.getUserName() || "사용자";


  return (
    <>
      <div className={`detail-analysis__attitude-content ${className ?? ""}`}>
        <div className="detail-analysis__attitude-left">
          <span className="detail-analysis__metric-grade-label">
            <img src={ic_timeline_gray600_20} alt="" />
            {userName}님의 목소리 톤
          </span>

          <VoicePitchChart
            values={chartValues}
            averageLine={averageLine}
            averageLabel="평균"
            min={0}
            max={300}
          />
        </div>

        <div className="detail-analysis__attitude-right">
          <DetailMetric
            type="voice_tone"
            gradeLabel={gradeLabel}
            gradeIconSrc={ic_stars_gray600_20}
            className={className}
            analysisTitle={analysisTitle}
            analysisIconSrc={ic_conditions_gray600_20}
            analysisText={analysisText}
            highlight={highlight}
            reportDetail={reportDetail}
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