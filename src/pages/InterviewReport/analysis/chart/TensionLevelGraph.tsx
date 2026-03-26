// src/pages/InterviewReport/analysis/components/TensionLevelGraph.tsx
import React, { useMemo } from "react";
import KpiGaugeChart from "@/pages/InterviewReport/analysis/chart/KpiGaugeChart";
import {
  TENSION_BREAKS,
  tensionModifierByBucket,
} from "@/shared/utils/util";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  score?: number;
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

const TENSION_GAUGE_LABELS = ["높음", "보통", "낮음"];

function segmentsFromTensionLabel(label?: string) {
  switch (label) {
    case "높음":
      return [0.5, 0, 0];
    case "보통":
      return [1, 0.5, 0];
    case "낮음":
      return [1, 1, 0.5];
    default:
      return [0, 0, 0];
  }
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export default function TensionLevelGraph({
  score = 0,
  description,
  labels = TENSION_GAUGE_LABELS,
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
    reportDetail?.tab2?.detailAttitude?.tensionData?.tensionGrade ?? "보통";

  const reportTensionScore =
    reportDetail?.tab2?.detailAttitude?.tensionData?.tensionScore;

  const reportTensionDescription =
    reportDetail?.tab1?.feedback?.tension ??
    "전반적으로 안정적인 모습을 보이며 긴장도가 낮은 편으로 평가됩니다.";

  const resolvedScore = Number(reportTensionScore ?? score);
  const safeScore = clamp(resolvedScore, 0, breaks[breaks.length - 1] ?? 100);

  const resolvedLabel = reportTensionGrade;
  const resolvedDescription = description ?? reportTensionDescription;

  const segments = useMemo(
    () => segmentsFromTensionLabel(resolvedLabel),
    [resolvedLabel]
  );

  const bucketIndex = useMemo(() => {
    switch (resolvedLabel) {
      case "높음":
        return 0;
      case "보통":
        return 1;
      case "낮음":
        return 2;
      default:
        return 1;
    }
  }, [resolvedLabel]);

  const tensionGradeClassMap: Record<string, string> = {
    낮음: "excellent",
    보통: "fair",
    높음: "poor",
  };

  const modifier =
    kpiTitleModifierClass ??
    (reportTensionGrade
      ? tensionGradeClassMap[reportTensionGrade] ??
        tensionModifierByBucket(bucketIndex)
      : tensionModifierByBucket(bucketIndex));

  return (
    <div
      className={`detail-analysis__level-graph ${modifier} ${className ?? ""}`}
    >
      <div className="detail-analysis__level-info">
        <span className="detail-analysis__level-label">{resolvedLabel}</span>
        {resolvedDescription && (
          <span className="detail-analysis__level-desc">
            {resolvedDescription}
          </span>
        )}
      </div>

      <div className="detail-analysis__level-chart">
        <div className="detail-analysis__chart-gauge">
          <KpiGaugeChart
            segments={segments}
            labels={labels as string[]}
            valueLabel={`${safeScore}점`}
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