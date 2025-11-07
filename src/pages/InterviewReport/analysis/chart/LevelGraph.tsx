import React, { useMemo } from "react";
import KpiGaugeChart from "@/pages/InterviewReport/analysis/chart/KpiGaugeChart";
import {
  DEFAULT_BREAKS,
  DEFAULT_LABELS,
  segmentsFromScore,
  bucketOf,
  modifierByBucket,
} from "@/shared/utils/util"; 

type LevelGraphProps = {
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

  valueLabel?: string;
  valueColorMap?: Record<string, string>;
  valueColorFallback?: string;
  valueTail?: boolean;
  valueTailSize?: number;

  kpiTitleModifierClass?: string;
  className?: string;
};

// 컴포넌트 밖으로 이동 (재생성 방지)
const DEFAULT_VALUE_COLOR_MAP: Record<string, string> = {
  "매우 미흡": "#FF524C",
  "미흡": "#FF972F",
  "보통": "#15D078",
  "우수": "#26A4FF",
  "최우수": "#816BFE",
};

// 필요 시 점수 클램프(선택)
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function LevelGraph({
  score,
  description,
  labels = DEFAULT_LABELS,
  breaks = DEFAULT_BREAKS,
  baseColor = "rgba(255, 255, 255, 0.40)",
  fillColor = "rgba(255, 255, 255, 0.80)",
  gap = 2,
  barHeight = 24,
  labelFontSize = 14,
  chartHeight = 108,
  valueLabel,
  valueColorMap = DEFAULT_VALUE_COLOR_MAP,
  valueColorFallback = "#26A4FF",
  valueTail = true,
  valueTailSize = 6,
  kpiTitleModifierClass,
  className,
}: LevelGraphProps) {
  // (선택) 점수 가드
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

  const modifier = kpiTitleModifierClass ?? modifierByBucket(bucketIndex);

  return (
    <div className={`detail-analysis__level-graph ${modifier} ${className ?? ""}`}>
      <div className="detail-analysis__level-info">
        <span className="detail-analysis__level-label">{bucketLabel}</span>
        {description && <span className="detail-analysis__level-desc">{description}</span>}
      </div>

      <div className="detail-analysis__level-chart">
        <div className="detail-analysis__chart-gauge">
        <KpiGaugeChart
            // 필수 데이터/레이아웃 props
            segments={segments}
            labels={labels}
            valueLabel={`${score}점`}
            height={chartHeight}

            // Theme props (색상/텍스트 관련)
            theme={{
                base: baseColor,       // baseColor 대신 theme.base
                fill: fillColor,       // fillColor 대신 theme.fill
                valueBg: "var(--white-100, #FFF)",
                valueColorMap: {
                    "매우 미흡": "#FF524C",
                    "미흡": "#FF972F",
                    "보통": "#15D078",
                    "우수": "#26A4FF",
                    "최우수": "#816BFE",
                },
                valueColorFallback: "#26A4FF",
            }}

            // Layout props (간격/크기 관련)
            layout={{
                gap: gap,
                barHeight: barHeight,
                labelFontSize: labelFontSize,
                valueFontSize: 16,
                valueFontWeight: 600,
                valuePaddingX: 8,
                valuePaddingY: 4,
                valueOffsetY: 16,
                valueRadius: 100,
                valueTail: true,
                valueTailSize: 6,
            }}
        />
        </div>
      </div>
    </div>
  );
}
