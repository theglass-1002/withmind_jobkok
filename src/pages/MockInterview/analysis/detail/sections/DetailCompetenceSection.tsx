// src/pages/MockInterview/my-report/detail/sections/DetailCompetenceSection.tsx
import React, { useMemo } from "react";
import KpiGaugeChart from "@/pages/MockInterview/analysis/chart/KpiGaugeChart";

type Props = {
  score: number;
  title?: string;
  titleIconSrc?: string;
  description?: string;

  labels?: string[];
  breaks?: number[];

  baseColor?: string;
  fillColor?: string;
  gap?: number;
  barHeight?: number;
  labelFontSize?: number;
  chartHeight?: number;

  valueLabel?: string;
  valueColorMap?: Record<string, string>;
  valueColorFallback?: string;
  valueTail?: boolean;
  valueTailSize?: number;
};

const DEFAULT_BREAKS = [20, 40, 60, 80, 100] as const;
const DEFAULT_LABELS = ["매우 미흡", "미흡", "보통", "우수", "최우수"] as const;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function segmentsFromScore(score: number, breaks = DEFAULT_BREAKS as readonly number[]) {
  const segs = Array(breaks.length).fill(0) as number[];
  let prev = 0;
  for (let i = 0; i < breaks.length; i++) {
    const end = breaks[i];
    const filled = (score - prev) / (end - prev);
    segs[i] = score >= end ? 1 : clamp01(filled);
    if (score <= end) break;
    prev = end;
  }
  return segs.map((v) => clamp01(v));
}

function bucketOf(
  score: number,
  breaks = DEFAULT_BREAKS as readonly number[],
  labels = DEFAULT_LABELS as readonly string[]
) {
  for (let i = 0; i < breaks.length; i++) {
    if (score <= breaks[i]) return { index: i, label: labels[i] };
  }
  return { index: breaks.length - 1, label: labels[breaks.length - 1] };
}

export default function DetailCompetenceSection({
  score,
  title = "역량분석 섹션",
  titleIconSrc,
  description = "면접 과정에서 보인 의사소통 능력과 문제해결 능력은 우수하다고 평가됩니다.",
  labels = Array.from(DEFAULT_LABELS),
  breaks = Array.from(DEFAULT_BREAKS),
  baseColor = "rgba(0, 0, 0, 0.08)",
  fillColor = "rgba(0, 0, 0, 0.22)",
  gap = 2,
  barHeight = 24,
  labelFontSize = 14,
  chartHeight = 108,
  valueLabel,
  valueColorMap = {
    "매우 미흡": "#FF524C",
    "미흡": "#FF972F",
    "보통": "#15D078",
    "우수": "#26A4FF",
    "최우수": "#816BFE",
  },
  valueColorFallback = "#26A4FF",
  valueTail = true,
  valueTailSize = 6,
}: Props) {
  const segments = useMemo(() => segmentsFromScore(score, breaks), [score, breaks]);
  const { label: bucketLabel } = useMemo(
    () => bucketOf(score, breaks, labels),
    [score, breaks, labels]
  );

  return (
    <div className="analysis-section detail-analysis__section detail-analysis__section--competence">
      <span className="analysis-section__title">
        {titleIconSrc && <img src={titleIconSrc} alt="" />} {title}
      </span>

      <div className="analysis-section__body">
        <div className="detail-analysis__competence-head">
          <span className="detail-analysis__grade">{bucketLabel}</span>
          <p className="detail-analysis__desc">{description}</p>
        </div>

        <div className="detail-analysis__competence-chart">
          <KpiGaugeChart
            segments={segments}
            labels={labels}
            baseColor={baseColor}
            fillColor={fillColor}
            gap={gap}
            barHeight={barHeight}
            labelFontSize={labelFontSize}
            height={chartHeight}
            valueLabel={valueLabel ?? `${score}점`}
            valueColorAuto
            valueColorMap={valueColorMap}
            valueColorFallback={valueColorFallback}
            valueBg="var(--white-100, #FFF)"
            valueFontSize={16}
            valueFontWeight={600}
            valuePaddingX={8}
            valuePaddingY={4}
            valueOffsetY={16}
            valueRadius={100}
            valueTail={valueTail}
            valueTailSize={valueTailSize}
          />
        </div>
      </div>
    </div>
  );
}
