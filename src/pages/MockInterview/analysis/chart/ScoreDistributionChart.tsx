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
  labels: (string | string[])[];
  values: number[];
  max?: number;
  height?: number;
  barThickness?: number;

  highlightScore?: number;
  highlightTextFormatter?: (score: number) => string;

  highlightGradientFrom?: string;
  highlightGradientTo?: string;
  barColorMuted?: string;

  tickFontFamily?: string;
  tickFontSize?: number;

  animate?: boolean;
  durationMs?: number;
  staggerMs?: number;
  easing?: "linear" | "easeOutCubic" | "easeInOutCubic";
}

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

  animate = true,
  durationMs = 800,
  staggerMs = 35,
  easing = "easeOutCubic",
}: ScoreDistributionChartProps) {
  const len = Math.min(labels.length, values.length);
  const labelItems = useMemo(() => labels.slice(0, len), [labels, len]);
  const series = useMemo(() => values.slice(0, len), [values, len]);

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
    if (typeof window === 'undefined') return "#848B93";
    const css = getComputedStyle(document.documentElement);
    return (css.getPropertyValue("--gray-600") || "#848B93").trim();
  }, []);
  const gridColor = useMemo(() => {
    if (typeof window === 'undefined') return "#EEEEEE";
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
      layout: { padding: { top: 30 } },
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
              if (Array.isArray(raw)) return raw;
              if (typeof raw === "string" && raw.includes("\n")) return raw.split("\n");
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

      animation: animate
        ? {
            duration: durationMs,
            easing:
              easing === "linear"
                ? "linear"
                : easing === "easeInOutCubic"
                ? "easeInOutCubic"
                : "easeOutCubic",
            delay: (ctx: any) => {
              if (ctx.type !== "data" || ctx.mode !== "default") return 0;
              return ctx.dataIndex * staggerMs;
            },
            datasets: {
                y: {
                    duration: 0,
                }
            }
          }
        : false,

      animations: animate
        ? {
            y: {
              from: 0,
              duration: durationMs,
              easing:
                easing === "linear"
                  ? "linear"
                  : easing === "easeInOutCubic"
                  ? "easeInOutCubic"
                  : "easeOutCubic",
            },
            base: {
              from: 0,
              duration: 0, 
            }
          }
        : undefined,
    }),
    [
      max,
      tickColor,
      gridColor,
      tickFontFamily,
      tickFontSize,
      labelItems,
      highlightIndex,
      highlightScore,
      series,
      highlightTextFormatter,
      animate,
      durationMs,
      staggerMs,
      easing,
    ]
  );

  const chartKey = useMemo(() => JSON.stringify({ labels, values, animate }), [labels, values, animate]);

  return (
    <div style={{ height, width: "100%" }}>
      <Bar 
        key={chartKey} 
        data={data} 
        options={options} 
        plugins={[scoreTextLabelPlugin]} 
      />
    </div>
  );
}