// src/pages/MockInterview/analysis/components/KpiGaugeChart.tsx
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement);

type Props = {
  segments?: number[];
  labels?: string[];
  baseColor?: string;
  fillColor?: string;
  gap?: number;
  barHeight?: number;
  labelColor?: string;
  labelFontSize?: number;
  labelTopMargin?: number;
  labelFontFamily?: string;
  height?: number;

  valueLabel?: string;
  valueBg?: string;
  /** 기본: 라벨에 따라 자동 색상 적용. 비활성화하려면 false */
  valueColorAuto?: boolean;
  /** 라벨별 배지 텍스트 색 커스텀 (없으면 기본 매핑 사용) */
  valueColorMap?: Record<string, string>;
  /** 자동 매핑에 실패하면 사용할 폴백 색상 */
  valueColorFallback?: string;

  valueFontSize?: number;
  valueFontWeight?: number | string;
  valuePaddingX?: number;
  valuePaddingY?: number;
  valueOffsetY?: number;
  valueRadius?: number;
  valueTail?: boolean;
  valueTailSize?: number;
  valueFontFamily?: string;

  labelActiveColor?: string;
  labelFontWeight?: number | string;
  labelActiveFontWeight?: number | string;
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function resolveColor(input: string): string {
  if (!input) return input as unknown as string;
  const VAR_REGEX = /^var\(\s*--([a-zA-Z0-9-_]+)\s*(?:,\s*([^)]+)\s*)?\)$/;
  const m = input.trim().match(VAR_REGEX);
  if (!m) return input;
  const [, name, fb] = m;
  const css = getComputedStyle(document.documentElement);
  const val = css.getPropertyValue(`--${name}`).trim();
  if (val) return val;
  return (fb || "").trim() || input;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r = 6
) {
  const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

const DEFAULT_VALUE_COLOR_MAP: Record<string, string> = {
  "매우 미흡": "#FF524C",
  "미흡": "#FF972F",
  "보통": "#15D078",
  "우수": "#26A4FF",
  "최우수": "#816BFE",
};

export default function KpiGaugeChart({
  segments = [1, 1, 1, 0.8, 0],
  labels = ["매우 미흡", "미흡", "보통", "우수", "최우수"],
  baseColor = "rgba(255, 255, 255, 0.40)",
  fillColor = "rgba(255, 255, 255, 0.80)",
  gap = 2,
  barHeight = 24,
  labelColor = "rgba(255,255,255,0.80)",
  labelFontSize = 16,
  labelTopMargin = 15,
  labelFontFamily = "Pretendard, system-ui, -apple-system, Segoe UI, Roboto",
  height = 110,

  labelFontWeight = 400,
  labelActiveColor = "var(--white-100, #FFF)",
  labelActiveFontWeight = 600,

  valueLabel,
  valueBg = "var(--white-100, #FFF)",
  valueColorAuto = true,
  valueColorMap,
  valueColorFallback = "var(--report-blue-100, #26A4FF)",
  valueFontSize = 16,
  valueFontWeight = 600,
  valuePaddingX = 8,
  valuePaddingY = 4,
  valueOffsetY = 8,
  valueRadius = 100,
  valueTail = true,
  valueTailSize = 6,
  valueFontFamily = "Pretendard, system-ui, -apple-system, Segoe UI, Roboto",
}: Props) {
  const n = segments.length;

  const data = useMemo(
    () => ({
      labels: [""],
      datasets: [
        { label: "gauge", data: [1], backgroundColor: "transparent", borderWidth: 0 },
      ],
    }),
    []
  );

  const options = useMemo(
    () => ({
      animation: false, 
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y" as const,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false, min: 0, max: 1, grid: { display: false }, ticks: { display: false }, border: { display: false } },
        y: { display: false, grid: { display: false }, ticks: { display: false }, border: { display: false } },
      },
      layout: { padding: 0 },
    }),
    []
  );

  const plugin = useMemo(
    () => ({
      id: "kpiGaugeWithLabelsAndBadge",
      afterDatasetsDraw(chart: any) {
        const { ctx, chartArea } = chart;
        const { left, top, width, height: areaH } = chartArea;

        const segW = (width - gap * (n - 1)) / n;
        const labelArea = Math.max(labelFontSize + labelTopMargin, 24);
        const barY = top + (areaH - labelArea - barHeight) / 1.2;

        const base = resolveColor(baseColor);
        const fill = resolveColor(fillColor);
        const badgeBg = resolveColor(valueBg);

        ctx.save();

        let activeIndex = -1;
        let activeRatio = 0;

        // 바 + 채움
        for (let i = 0; i < n; i++) {
          const x = left + i * (segW + gap);
          ctx.fillStyle = base;
          ctx.fillRect(x, barY, segW, barHeight);

          const r = clamp01(segments[i] ?? 0);
          if (r > 0) {
            ctx.fillStyle = fill;
            ctx.fillRect(x, barY, segW * r, barHeight);
            activeIndex = i;
            activeRatio = r;
          }
        }

        // 라벨
        const normalFont = `${labelFontWeight} ${labelFontSize}px ${labelFontFamily}`;
        const activeFont = `${labelActiveFontWeight} ${labelFontSize}px ${labelFontFamily}`;
        const labelY = barY + barHeight + labelTopMargin;

        for (let i = 0; i < n; i++) {
          const xCenter = left + i * (segW + gap) + segW / 2;
          if (i === activeIndex) {
            ctx.font = activeFont;
            ctx.fillStyle = resolveColor(labelActiveColor);
          } else {
            ctx.font = normalFont;
            ctx.fillStyle = labelColor;
          }
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(labels[i] ?? "", xCenter, labelY);
        }

        // 배지
        if (valueLabel && activeIndex >= 0) {
          const activeLabel = labels[activeIndex] ?? "";
          const colorTable = { ...DEFAULT_VALUE_COLOR_MAP, ...(valueColorMap || {}) };
          const resolvedTextColor = valueColorAuto
            ? (colorTable[activeLabel] || valueColorFallback)
            : valueColorFallback;

          const badgeColor = resolveColor(resolvedTextColor);

          const xStart = left + activeIndex * (segW + gap);
          const filledW = segW * (activeRatio || 1);
          const rawAnchorX = xStart + Math.min(segW, Math.max(0, filledW));

          const right = left + width;
          ctx.font = `${valueFontWeight} ${valueFontSize}px ${valueFontFamily}`;
          const textW = ctx.measureText(valueLabel).width;
          const badgeW = Math.ceil(textW + valuePaddingX * 2);
          const badgeH = Math.ceil(valueFontSize + valuePaddingY * 2);

          const clampedCenterX = Math.max(left + badgeW / 2, Math.min(right - badgeW / 2, rawAnchorX));

          const badgeBottomY = barY - valueOffsetY;
          const badgeX = Math.round(clampedCenterX - badgeW / 2);
          const badgeY = Math.round(badgeBottomY - badgeH);

          ctx.fillStyle = badgeBg;
          roundRect(ctx, badgeX, badgeY, badgeW, badgeH, valueRadius);
          ctx.fill();

          if (valueTail && valueTailSize > 0) {
            const s = Math.max(3, Math.floor(valueTailSize));
            const tipX = clampedCenterX;
            const tipY = badgeY + badgeH + s;
            ctx.beginPath();
            ctx.moveTo(tipX, tipY);
            ctx.lineTo(tipX - s, tipY - s);
            ctx.lineTo(tipX + s, tipY - s);
            ctx.closePath();
            ctx.fillStyle = badgeBg;
            ctx.fill();
          }

          ctx.fillStyle = badgeColor;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(valueLabel, badgeX + badgeW / 2, badgeY + badgeH / 2);
        }

        ctx.restore();
      },
    }),
    [
      n, gap, barHeight,
      baseColor, fillColor, segments,
      labelColor, labelFontSize, labelTopMargin, labelFontFamily, labelFontWeight,
      labelActiveColor, labelActiveFontWeight,
      labels,
      valueLabel, valueBg,
      valueColorAuto, valueColorMap, valueColorFallback,
      valueFontSize, valueFontWeight, valueFontFamily,
      valuePaddingX, valuePaddingY, valueOffsetY, valueRadius,
      valueTail, valueTailSize
    ]
  );

  return (
    <div style={{ width: "100%", height }}>
      <Bar data={data} options={options} plugins={[plugin]} />
    </div>
  );
}
