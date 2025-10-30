// src/pages/MockInterview/analysis/components/TensionLevelGraph.tsx
import React, { useMemo } from "react";
import KpiGaugeChart from "@/pages/MockInterview/analysis/chart/KpiGaugeChart";

import {
  TENSION_BREAKS,
  TENSION_LABELS,
  segmentsFromScore,
  bucketOf,
  tensionModifierByBucket,
} from "@/shared/utils/util";

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
};

const TENSION_VALUE_COLOR_MAP: Record<string, string> = {
  "낮음": "#816BFE",
  "보통": "#15D078",
  "높음": "#FF524C",
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
}: Props) {
  const maxBreak = breaks[breaks.length - 1] ?? 100;
  const safeScore = clamp(score, 0, maxBreak);

  const segments = useMemo(
    () => segmentsFromScore(safeScore, breaks),
    [safeScore, breaks]
  );

  const { index: bucketIndex, label: bucketLabel } = useMemo(
    () => bucketOf(safeScore, breaks, labels as string[]),
    [safeScore, breaks, labels]
  );

  const modifier = kpiTitleModifierClass ?? tensionModifierByBucket(bucketIndex);

  return (
    <div className={`detail-analysis__level-graph ${modifier} ${className ?? ""}`}>
      <div className="detail-analysis__level-info">
        <span className="detail-analysis__level-label">{bucketLabel}</span>
        {description && (
          <span className="detail-analysis__level-desc">{description}</span>
        )}
      </div>

      <div className="detail-analysis__level-chart">
        <div className="detail-analysis__chart-gauge">
          <KpiGaugeChart
            segments={segments}
            labels={labels as string[]}  // 타입 캐스팅 추가
            valueLabel={`${score}점`}
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