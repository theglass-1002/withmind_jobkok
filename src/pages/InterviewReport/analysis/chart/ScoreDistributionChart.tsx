// src/pages/InterviewReport/my-report/part/ScoreDistributionChart.tsx
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
  type ChartOptions,
  type FontSpec,
} from "chart.js";
import { useLocation } from 'react-router-dom';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export interface ScoreDistributionChartProps {
  className?: string;
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
  className,
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
  const location = useLocation(); 

  const isPrintMode = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.has('printViewr');
  }, [location.search]);
  
  const enableAnimation = animate && !isPrintMode;

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

  // 최소 너비 계산: 막대 수 * (막대 너비 + 여백) + Y축 공간
  const minWidth = useMemo(() => {
    const barCount = series.length;
    const barGap = 30; // 막대 간 최소 간격
    const yAxisSpace = 0; // Y축 레이블 공간
    return barCount * (barThickness + barGap) + yAxisSpace;
  }, [series.length, barThickness]);

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
          borderSkipped: "bottom" as const,
          barThickness,
          maxBarThickness: barThickness,
          order: 1,
        },
      ],
    }),
    [labelItems, series, barThickness, highlightIndex, barColorMuted, highlightGradientFrom, highlightGradientTo]
  );

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: false, // responsive를 false로 변경
      elements: { bar: { borderWidth: 0 } },
      layout: { padding: { top: 30 } },
      scales: {
        y: {
          min: 0,
          max,
          ticks: {
            color: tickColor,
            font: { 
              family: tickFontFamily, 
              size: tickFontSize, 
              weight: "400" as "400" | "normal", 
            } as Partial<FontSpec>,
            stepSize: Math.ceil(max / 5),
            callback: (v: any) => `${v}`,
            padding: 6,
            autoSkip: false, // 자동 생략 방지
            autoSkip: false, // 자동 생략 방지
          },
          grid: { color: gridColor, drawBorder: false, drawTicks: false },
          border: { display: false },
        },
        x: {
          grid: { display: false, drawBorder: false, drawTicks: false },
          ticks: {
            color: tickColor,
            font: { 
              family: tickFontFamily, 
              size: tickFontSize, 
              weight: "400" as "400" | "normal",
            } as Partial<FontSpec>,
            padding: 8,
            maxRotation: 0,
            minRotation: 0,
            autoSkip: false, // 자동 생략 방지
            autoSkip: false, // 자동 생략 방지
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

      animation: enableAnimation
        ? {
            duration: durationMs,
            easing:
              (easing === "linear"
                ? "linear"
                : easing === "easeInOutCubic"
                ? "easeInOutCubic"
                : "easeOutCubic") as "linear" | "easeOutCubic" | "easeInOutCubic",
            delay: (ctx: any) => {
              if (ctx.type !== "data" || ctx.mode !== "default") return 0;
              return ctx.dataIndex * staggerMs;
            },
          }
        : { duration: 0 },

      animations: enableAnimation
        ? {
            y: {
              from: 0, 
              duration: durationMs,
              easing:
                (easing === "linear"
                  ? "linear"
                  : easing === "easeInOutCubic"
                  ? "easeInOutCubic"
                  : "easeOutCubic") as "linear" | "easeOutCubic" | "easeInOutCubic",
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
      enableAnimation,
      durationMs,
      staggerMs,
      easing,
    ]
  );

  const chartKey = useMemo(() => JSON.stringify({ labels, values, animate: enableAnimation, max }), [labels, values, enableAnimation, max]);

  return (
    <div
      className={className}
      style={{
        height,
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <div style={{ minWidth, height: "100%" }}>
        <Bar 
          key={chartKey} 
          data={data} 
          options={options} 
          plugins={[scoreTextLabelPlugin]}
          width={minWidth}
          height={height}
        />
      </div>
    </div>
  );
}