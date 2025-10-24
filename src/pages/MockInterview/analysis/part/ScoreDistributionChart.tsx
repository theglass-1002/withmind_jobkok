// src/pages/MockInterview/my-report/part/ScoreDistributionChart.tsx
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type Plugin,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export interface ScoreDistributionChartProps {
  /** 구간 라벨: "0~9" 같은 문자열 또는 ["0","~9"] 형식 */
  labels: (string | string[])[];
  /** 각 구간 값(빈도/점수 등) */
  values: number[];
  /** y축 최대값 */
  max?: number;
  /** px */
  height?: number;
  /** px */
  barThickness?: number;

  /** 강조할 점수(예: 98 → "94~100" 구간 강조) */
  highlightScore?: number;
  /** 강조 텍스트 포맷(기본: "{score}점") */
  highlightTextFormatter?: (score: number) => string;

  /** 강조 그라디언트 / 비강조 색 */
  highlightGradientFrom?: string;
  highlightGradientTo?: string;
  barColorMuted?: string;

  /** 폰트 옵션 */
  tickFontFamily?: string;
  tickFontSize?: number;
}

/** "0~9", "0 ~ 9", "94-100" 등에서 [0,9] 추출 */
function parseRange(label: string | string[]): [number, number] | null {
  const raw = Array.isArray(label) ? label.join("") : String(label);
  const nums = raw.match(/-?\d+(\.\d+)?/g);
  if (!nums || nums.length === 0) return null;
  if (nums.length === 1) {
    const v = Number(nums[0]);
    return isNaN(v) ? null : [v, v];
  }
  const a = Number(nums[0]);
  const b = Number(nums[nums.length - 1]);
  if (isNaN(a) || isNaN(b)) return null;
  return a <= b ? [a, b] : [b, a];
}

/** 강조 점수 텍스트 플러그인 */
const scoreTextLabelPlugin: Plugin<"bar", any> = {
  id: "scoreTextLabel",
  afterDatasetsDraw(chart, _args, opts) {
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;

    const idx: number | undefined = opts?.index;
    const text: string | undefined = opts?.text;
    if (idx == null || !text) return;

    const el: any = meta.data[idx];
    if (!el) return;

    const ctx = chart.ctx as CanvasRenderingContext2D;
    const { x, y } = el;

    ctx.save();
    ctx.font = `${opts?.fontWeight ?? 600} ${opts?.fontSize ?? 14}px ${opts?.fontFamily ?? "Pretendard, system-ui"}`;
    ctx.fillStyle = opts?.color ?? "#111";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    const offsetY = opts?.offsetY ?? 8;
    ctx.fillText(text, x, y - offsetY);
    ctx.restore();
  },
};

export default function ScoreDistributionChart({
  labels,
  values,
  max = 100,
  height = 293,
  barThickness = 24,

  highlightScore,
  highlightTextFormatter = (s) => `${s}점`,

  highlightGradientFrom = "#15D078",
  highlightGradientTo = "#4BD1C8",
  barColorMuted = "#E0E2E4",

  tickFontFamily = "Pretendard",
  tickFontSize = 16,
}: ScoreDistributionChartProps) {
  const len = Math.min(labels.length, values.length);
  const labelItems = useMemo(() => labels.slice(0, len), [labels, len]);
  const series = useMemo(() => values.slice(0, len), [values, len]);

  // 강조할 구간 인덱스 계산
  const highlightIndex = useMemo(() => {
    if (highlightScore == null) {
      const maxVal = Math.max(...series);
      return series.indexOf(maxVal);
    }
    for (let i = 0; i < labelItems.length; i++) {
      const rng = parseRange(labelItems[i]);
      if (!rng) continue;
      const [lo, hi] = rng;
      if (highlightScore >= lo && highlightScore <= hi) return i;
    }
    const maxVal = Math.max(...series);
    return series.indexOf(maxVal);
  }, [highlightScore, labelItems, series]);

  const tickColor = useMemo(() => {
    const css = getComputedStyle(document.documentElement);
    return (css.getPropertyValue("--gray-600") || "#848B93").trim();
  }, []);
  const gridColor = useMemo(() => {
    const css = getComputedStyle(document.documentElement);
    return (css.getPropertyValue("--gray-200") || "#EEEEEE").trim();
  }, []);

  const data = useMemo(
    () => ({
      labels: labelItems,
      datasets: [
        {
          type: "bar" as const,
          label: "분포",
          data: series,
          backgroundColor: (ctx: any) => {
            const i = ctx.dataIndex;
            const { ctx: c, chartArea } = ctx.chart;
            if (i !== highlightIndex) return barColorMuted;
            if (!chartArea) return highlightGradientFrom;
            const grad = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            grad.addColorStop(0, highlightGradientFrom);
            grad.addColorStop(1, highlightGradientTo);
            return grad;
          },
          borderColor: "transparent",
          hoverBorderColor: "transparent",
          borderWidth: 0,
          hoverBorderWidth: 0,
          borderRadius: { topLeft: 2, topRight: 2, bottomLeft: 0, bottomRight: 0 },
          borderSkipped: "bottom",
          barThickness,
          maxBarThickness: barThickness,
          order: 1,
        },
      ],
    }),
    [labelItems, series, barThickness, highlightIndex, barColorMuted, highlightGradientFrom, highlightGradientTo]
  );

  const options = useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      elements: { bar: { borderWidth: 0 } },
      // 2줄 라벨 여백 확보
      layout: { padding: {
        top: 30 } },
      scales: {
        y: {
          min: 0,
          max,
          ticks: {
            color: tickColor,
            font: { family: tickFontFamily, size: tickFontSize, weight: "400" },
            stepSize: Math.ceil(max / 5),
            callback: (v: any) => `${v}`,
            padding: 6,
          },
          grid: { color: gridColor, drawBorder: false, drawTicks: false },
          border: { display: false },
        },
        x: {
          grid: { display: false, drawBorder: false, drawTicks: false },
          ticks: {
            color: tickColor,
            font: { family: tickFontFamily, size: tickFontSize, weight: "400" },
            padding: 8,
            maxRotation: 0,
            minRotation: 0,
            callback: (val: any, idx: number) => {
              const raw = labelItems[idx];
              if (Array.isArray(raw)) return raw;                // ["0","~9"] → 2줄
              if (typeof raw === "string" && raw.includes("\n")) return raw.split("\n");
              // "0~9"처럼 들어오면 보기 좋게 두 줄로 쪼개기
              const m = raw.match(/^(\s*\d+)\s*([~\-])\s*(\d+\s*)$/);
              if (m) return [m[1].trim(), `${m[2]}${m[3].trim()}`];
              return raw;
            },
          },
          border: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: { label: (ctx: any) => ` ${ctx.parsed.y ?? ctx.parsed}점` },
        },
        // 강조 텍스트(예: "98점")
        scoreTextLabel: {
          index: highlightIndex,
          text:
            highlightScore == null
              ? `${series[highlightIndex]}점`
              : highlightTextFormatter(highlightScore),
          fontSize: 20,
          fontWeight: 600,
          color: "#6F767E",
          offsetY: 10,
          fontFamily: tickFontFamily,
        },
      } as any,
      animation: { duration: 400, easing: "easeOutQuad" },
    }),
    [max, tickColor, gridColor, tickFontFamily, tickFontSize, labelItems, highlightIndex, highlightScore, series, highlightTextFormatter]
  );

  return (
    <div style={{ height, width: "100%" }}>
      <Bar data={data} options={options} plugins={[scoreTextLabelPlugin]} />
    </div>
  );
}
