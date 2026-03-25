// src/pages/InterviewReport/analysis/components/TensionLevelGraph.tsx
import React, { useMemo } from "react";
import KpiGaugeChart from "@/pages/InterviewReport/analysis/chart/KpiGaugeChart";

import {
  TENSION_BREAKS,
  TENSION_LABELS,
  segmentsFromScore,
  bucketOf,
  tensionModifierByBucket,
} from "@/shared/utils/util";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  score: number;
  description?: string;
  labels?: readonly string[];
  breaks?: readonly number[];
  baseColor?: string;
  fillColor?: string;
  gap?: number;
  barHeight?: number;
  labelFontSize?: number;
  chartHeight?: number;
  valueColorMap?: Record<string, string>;
  valueColorFallback?: string;
  valueTail?: boolean;
  valueTailSize?: number;
  kpiTitleModifierClass?: string;
  className?: string;
  reportDetail?: InterviewReportDetailResponse | null;
};

const TENSION_VALUE_COLOR_MAP: Record<string, string> = {
  낮음: "#816BFE",
  보통: "#15D078",
  높음: "#FF524C",
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export default function TensionLevelGraph({
  score,
  description,
  labels = TENSION_LABELS,
  breaks = TENSION_BREAKS,
  baseColor = "rgba(255, 255, 255, 0.40)",
  fillColor = "rgba(255, 255, 255, 0.80)",
  gap = 2,
  barHeight = 24,
  labelFontSize = 14,
  chartHeight = 108,
  valueColorMap = TENSION_VALUE_COLOR_MAP,
  valueColorFallback = "#15D078",
  valueTail = true,
  valueTailSize = 6,
  kpiTitleModifierClass,
  className,
  reportDetail,
}: Props) {
  const reportTensionGrade =
    reportDetail?.detailAttitude?.tensionData?.tebHeartRate?.tensionGrade;

  const reportTensionScore =
    reportDetail?.detailAttitude?.tensionData?.tebHeartRate?.tensionScore;

  const resolvedScore = Number(reportTensionScore ?? score);

  const maxBreak = breaks[breaks.length - 1] ?? 100;
  const safeScore = clamp(resolvedScore, 0, maxBreak);

  const segments = useMemo(
    () => segmentsFromScore(safeScore, breaks),
    [safeScore, breaks]
  );

  const { index: bucketIndex, label: bucketLabel } = useMemo(
    () => bucketOf(safeScore, breaks, labels as string[]),
    [safeScore, breaks, labels]
  );

  const resolvedLabel = reportTensionGrade ?? bucketLabel;

  const tensionGradeClassMap: Record<string, string> = {
    최우수: "excellent",
    우수: "good",
    보통: "fair",
    미흡: "improvement",
    매우미흡: "poor",
    "매우 미흡": "poor",
  };

  const modifier =
    kpiTitleModifierClass ??
    (reportTensionGrade
      ? tensionGradeClassMap[reportTensionGrade] ??
        tensionModifierByBucket(bucketIndex)
      : tensionModifierByBucket(bucketIndex));

  return (
    <div className={`detail-analysis__level-graph ${modifier} ${className ?? ""}`}>
      <div className="detail-analysis__level-info">
        <span className="detail-analysis__level-label">{resolvedLabel}</span>
        {description && (
          <span className="detail-analysis__level-desc">{description}</span>
        )}
      </div>

      <div className="detail-analysis__level-chart">
        <div className="detail-analysis__chart-gauge">
          <KpiGaugeChart
            segments={segments}
            labels={labels as string[]}
            valueLabel={`${resolvedScore}점`}
            height={chartHeight}
            theme={{
              base: baseColor,
              fill: fillColor,
              valueBg: "var(--white-100, #FFF)",
              valueColorMap,
              valueColorFallback,
            }}
            layout={{
              gap,
              barHeight,
              labelFontSize,
              valueFontSize: 16,
              valueFontWeight: 600,
              valuePaddingX: 8,
              valuePaddingY: 4,
              valueOffsetY: 16,
              valueRadius: 100,
              valueTail,
              valueTailSize,
            }}
          />
        </div>
      </div>
    </div>
  );
}