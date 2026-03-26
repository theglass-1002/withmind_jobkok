// src/pages/InterviewReport/analysis/detail/sections/part/TensionContent.tsx
import React, { useMemo } from "react";
import TensionAnalysisChart from "@/pages/InterviewReport/analysis/chart/TensionAnalysisChart";

import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";
import ic_timeline_gray600_20 from "@/assets/icons/size20/ic_timeline_gray600_20.png";
import ic_cardiology_gray600_20 from "@/assets/icons/size20/ic_cardiology_gray600_20.png";
import ic_favorite_green_20 from "@/assets/icons/size20/ic_favorite_green_20.png";
import ic_favorite_blue_20 from "@/assets/icons/size20/ic_favorite_blue_20.png";
import ic_favorite_red_20 from "@/assets/icons/size20/ic_favorite_red_20.png";

import { Storage } from "@/shared/utils/StorageManager";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  className?: string;
  reportDetail?: InterviewReportDetailResponse | null;
};

const EMPTY_CHART_VALUES = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export default function TensionContent({
  className,
  reportDetail,
}: Props) {
  const userName =
    reportDetail?.userInfo?.userName ||
    reportDetail?.userInfo?.name ||
    Storage.getUserName() ||
    "사용자";

  const tensionData = reportDetail?.tab2?.detailAttitude?.tensionData;
  const tebHeartRate = tensionData?.tebHeartRate;
  const heartRateSummary = tebHeartRate?.heartRate;

  const tensionSummaryText =
    tensionData?.tensionSummaryText ??
    tebHeartRate?.tensionSummaryText ??
    "질문별 긴장도 변화가 분석됩니다.";

  const averageHeartRate = heartRateSummary?.heartAvg ?? 0;
  const averageHeartRateLevel = heartRateSummary?.average ?? "-";

  const minHeartRate = heartRateSummary?.heartRateMin ?? 0;
  const minHeartRateLevel = heartRateSummary?.lowest ?? "-";

  const maxHeartRate = heartRateSummary?.heartRateMax ?? 0;
  const maxHeartRateLevel = heartRateSummary?.highest ?? "-";

  const chartSource = tebHeartRate?.heartRateCharts ?? [];

  const userValues = useMemo(() => {
    const first = chartSource[0];
    if (!first) return EMPTY_CHART_VALUES;

    return [
      first.x1,
      first.x2,
      first.x3,
      first.x4,
      first.x5,
      first.x6,
      first.x7,
      first.x8,
      first.x9,
      first.x10,
    ];
  }, [chartSource]);

  const averageValues = useMemo(() => {
    const second = chartSource[1];
    if (!second) return EMPTY_CHART_VALUES;

    return [
      second.x1,
      second.x2,
      second.x3,
      second.x4,
      second.x5,
      second.x6,
      second.x7,
      second.x8,
      second.x9,
      second.x10,
    ];
  }, [chartSource]);

  return (
    <div className={`detail-analysis__attitude-content ${className ?? ""}`}>
      <div className="detail-analysis__attitude-left">
        <div className="detail-analysis__tension-content">
          <div className="detail-analysis__tension-header">
            <span className="detail-analysis__metric-grade-label">
              <img src={ic_timeline_gray600_20} alt="" />
              {userName}님의 응답 긴장도
            </span>
            <span className="detail-analysis__tension-summary">
              {tensionSummaryText}
            </span>
          </div>

          <TensionAnalysisChart
            userValues={userValues}
            averageValues={averageValues}
            userLineColor="#FF524C"
            averageLineColor="#26A4FF"
            min={0}
            max={300}
          />
        </div>

        <div className="detail-analysis__tension-description">
          <img src={ic_error_gray500_20} alt="" />
          면접 질문당 평균 심박수와 표준편차를 계산하여 응시자의 질문별 긴장도와
          답변 도중 동요한 정도를 파악합니다. 표준편차란 지원자의 심박수가 1분의
          답변 시간 동안 평균 심박수에서 얼마나 멀어지며 요동쳤는지에 대한
          수치입니다. 푸른색 그래프는 해당 질문에 대한 지원자의 평균 심박을,
          붉은색 그래프는 평균에서 표준 편차가 더해진 심박 수치를 나타냅니다.
          푸른색과 붉은색 그래프 사이의 폭이 넓을수록 표준편차가 큰 것이며,
          해당 지원자의 긴장도와 동요도가 높았다고 해석할 수 있습니다.
        </div>
      </div>

      <div className="detail-analysis__attitude-right">
        <div className="detail-analysis__tension-stat-item average">
          <span className="detail-analysis__tension-stat-label">
            <img src={ic_cardiology_gray600_20} alt="" />
            평균 심박 수치
          </span>
          <div className="detail-analysis__tension-stat-content">
            <div className="detail-analysis__tension-stat-value-wrapper">
              <span className="detail-analysis__tension-stat-value">
                {averageHeartRate}
              </span>
              <div className="detail-analysis__tension-stat-unit">
                <span className="detail-analysis__tension-stat-icon">
                  <img src={ic_favorite_green_20} alt="" />
                </span>
                <span className="detail-analysis__tension-stat-unit-text">
                  BPM
                </span>
              </div>
            </div>
            <span className="detail-analysis__tension-stat-level">
              {averageHeartRateLevel}
            </span>
          </div>
        </div>

        <div className="detail-analysis__tension-stat-item min">
          <span className="detail-analysis__tension-stat-label">
            <img src={ic_cardiology_gray600_20} alt="" />
            최저 심박 수치
          </span>
          <div className="detail-analysis__tension-stat-content">
            <div className="detail-analysis__tension-stat-value-wrapper">
              <span className="detail-analysis__tension-stat-value">
                {minHeartRate}
              </span>
              <div className="detail-analysis__tension-stat-unit">
                <span className="detail-analysis__tension-stat-icon">
                  <img src={ic_favorite_blue_20} alt="" />
                </span>
                <span className="detail-analysis__tension-stat-unit-text">
                  BPM
                </span>
              </div>
            </div>
            <span className="detail-analysis__tension-stat-level">
              {minHeartRateLevel}
            </span>
          </div>
        </div>

        <div className="detail-analysis__tension-stat-item max">
          <span className="detail-analysis__tension-stat-label">
            <img src={ic_cardiology_gray600_20} alt="" />
            최고 심박 수치
          </span>
          <div className="detail-analysis__tension-stat-content">
            <div className="detail-analysis__tension-stat-value-wrapper">
              <span className="detail-analysis__tension-stat-value">
                {maxHeartRate}
              </span>
              <div className="detail-analysis__tension-stat-unit">
                <span className="detail-analysis__tension-stat-icon">
                  <img src={ic_favorite_red_20} alt="" />
                </span>
                <span className="detail-analysis__tension-stat-unit-text">
                  BPM
                </span>
              </div>
            </div>
            <span className="detail-analysis__tension-stat-level">
              {maxHeartRateLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}