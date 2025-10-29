// src/pages/MockInterview/analysis/components/KpiGaugeChart.tsx
import React, { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement);

type Theme = {
  base?: string;
  fill?: string;
  label?: string;
  labelActive?: string;
  valueBg?: string;
  valueColorMap?: Record<string, string>;
  valueColorFallback?: string;
};

type Layout = {
  gap?: number;
  barHeight?: number;
  labelFontSize?: number;
  labelTopMargin?: number;
  valueFontSize?: number;
  valueFontWeight?: number | string;
  valuePaddingX?: number;
  valuePaddingY?: number;
  valueOffsetY?: number;
  valueRadius?: number;
  valueTail?: boolean;
  valueTailSize?: number;
};

type Props = {
  /** 각 구간의 채움 비율 (0~1) */
  segments: number[];
  /** 구간 라벨 */
  labels?: string[];
  /** 배지 텍스트(예: "82점") */
  valueLabel?: string;
  /** 차트 높이 */
  height?: number;
  /** 색상/텍스트 컬러 묶음 (옵션) */
  theme?: Theme;
  /** 간격/폰트/패딩 묶음 (옵션) */
  layout?: Layout;
};

function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }

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

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r = 6) {
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

const DEFAULT_THEME: Required<Theme> = {
  base: "rgba(255, 255, 255, 0.40)",
  fill: "rgba(255, 255, 255, 0.80)",
  label: "rgba(255,255,255,0.80)",
  labelActive: "var(--white-100, #FFF)",
  valueBg: "var(--white-100, #FFF)",
  valueColorMap: DEFAULT_VALUE_COLOR_MAP,
  valueColorFallback: "var(--report-blue-100, #26A4FF)",
};

const DEFAULT_LAYOUT: Required<Layout> = {
  gap: 2,
  barHeight: 24,
  labelFontSize: 16,
  labelTopMargin: 15,
  valueFontSize: 16,
  valueFontWeight: 600,
  valuePaddingX: 8,
  valuePaddingY: 4,
  valueOffsetY: 8,
  valueRadius: 100,
  valueTail: true,
  valueTailSize: 6,
};

export default function KpiGaugeChart({
  segments,
  labels = ["매우 미흡", "미흡", "보통", "우수", "최우수"],
  valueLabel,
  height = 110,
  theme,
  layout,
}: Props) {
  const n = segments.length;
  const T = { ...DEFAULT_THEME, ...(theme || {}) };
  const L = { ...DEFAULT_LAYOUT, ...(layout || {}) };

  const data = useMemo(
    () => ({
      labels: [""],
      datasets: [{ label: "gauge", data: [1], backgroundColor: "transparent", borderWidth: 0 }],
    }),
    []
  );

  const options = useMemo(
    () => ({
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

        const segW = (width - L.gap * (n - 1)) / n;
        const labelArea = Math.max(L.labelFontSize + L.labelTopMargin, 24);
        const barY = top + (areaH - labelArea - L.barHeight) / 1.2;

        const base = resolveColor(T.base);
        const fill = resolveColor(T.fill);
        const badgeBg = resolveColor(T.valueBg);

        ctx.save();

        let activeIndex = -1;
        let activeRatio = 0;

        // 바 + 채움
        for (let i = 0; i < n; i++) {
          const x = left + i * (segW + L.gap);
          ctx.fillStyle = base;
          ctx.fillRect(x, barY, segW, L.barHeight);

          const r = clamp01(segments[i] ?? 0);
          if (r > 0) {
            ctx.fillStyle = fill;
            ctx.fillRect(x, barY, segW * r, L.barHeight);
            activeIndex = i;
            activeRatio = r;
          }
        }

        // 라벨
        const normalFont = `${400} ${L.labelFontSize}px Pretendard, system-ui, -apple-system, Segoe UI, Roboto`;
        const activeFont = `${600} ${L.labelFontSize}px Pretendard, system-ui, -apple-system, Segoe UI, Roboto`;
        const labelY = barY + L.barHeight + L.labelTopMargin;

        for (let i = 0; i < n; i++) {
          const xCenter = left + i * (segW + L.gap) + segW / 2;
          if (i === activeIndex) {
            ctx.font = activeFont;
            ctx.fillStyle = resolveColor(T.labelActive);
          } else {
            ctx.font = normalFont;
            ctx.fillStyle = resolveColor(T.label);
          }
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(labels[i] ?? "", xCenter, labelY);
        }

        // 배지
        if (valueLabel && activeIndex >= 0) {
          const activeLabel = labels[activeIndex] ?? "";
          const colorTable = { ...DEFAULT_VALUE_COLOR_MAP, ...(T.valueColorMap || {}) };
          const resolvedTextColor = colorTable[activeLabel] || T.valueColorFallback;
          const badgeColor = resolveColor(resolvedTextColor);

          const xStart = left + activeIndex * (segW + L.gap);
          const filledW = segW * (activeRatio || 1);
          const rawAnchorX = xStart + Math.min(segW, Math.max(0, filledW));

          const right = left + width;
          ctx.font = `${L.valueFontWeight} ${L.valueFontSize}px Pretendard, system-ui, -apple-system, Segoe UI, Roboto`;
          const textW = ctx.measureText(valueLabel).width;
          const badgeW = Math.ceil(textW + L.valuePaddingX * 2);
          const badgeH = Math.ceil(L.valueFontSize + L.valuePaddingY * 2);

          const clampedCenterX = Math.max(left + badgeW / 2, Math.min(right - badgeW / 2, rawAnchorX));

          const badgeBottomY = barY - L.valueOffsetY;
          const badgeX = Math.round(clampedCenterX - badgeW / 2);
          const badgeY = Math.round(badgeBottomY - badgeH*1.2);

          ctx.fillStyle = badgeBg;
          roundRect(ctx, badgeX, badgeY, badgeW, badgeH, L.valueRadius);
          ctx.fill();

          if (L.valueTail && L.valueTailSize > 0) {
            const s = Math.max(3, Math.floor(L.valueTailSize));
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
    
    [segments, labels, n, T, L]
  );

  return (
    <div style={{ width: "100%", height }}>
      <Bar data={data} options={options} plugins={[plugin]} />
    </div>
  );
}
