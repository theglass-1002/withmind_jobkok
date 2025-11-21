// src/pages/InterviewReport/my-report/part/KeywordsBubbleChart.tsx
import React, { useMemo } from "react";
import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  type ChartArea,
} from "chart.js";
import type { Plugin, Chart, ChartOptions } from "chart.js";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

type ColorGroup = "green" | "teal" | "gray";

export type KeywordPoint = {
  label: string;
  x: number;
  y: number;
  r: number;
  group: ColorGroup;
};

export interface KeywordsBubbleChartProps {
  data?: KeywordPoint[];
  showLabels?: boolean;
  className?: string;
  style?: React.CSSProperties;
  scale?: number; // 버블 크기 스케일 (기본값: 1)
}

function makeGradient(chart: Chart, group: ColorGroup) {
  const { ctx, chartArea } = chart as unknown as {
    ctx: CanvasRenderingContext2D;
    chartArea: ChartArea | undefined;
  };
  if (!chartArea) return "#ccc";
  const g = ctx.createLinearGradient(
    chartArea.left,
    chartArea.top,
    chartArea.right,
    chartArea.bottom
  );
  if (group === "green") {
    g.addColorStop(0, "rgba(21, 208, 120, 0.12)");
    g.addColorStop(0.8, "#15D078");
  } else if (group === "teal") {
    g.addColorStop(0, "rgba(75, 209, 200, 0.12)");
    g.addColorStop(0.8, "#4BD1C8");
  } else {
    g.addColorStop(0, "rgba(158, 164, 170, 0.12)");
    g.addColorStop(0.8, "#9EA4AA");
  }
  return g;
}

const cssVar = (name: string, fallback: string) => {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

const createBubbleLabelPlugin = (scale: number): Plugin<"bubble"> => ({
  id: "bubbleLabel",
  afterDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(0);
    const ds: any = chart.data.datasets[0];
    if (!meta?.data?.length) return;

    const ctx = chart.ctx;
    ctx.save();
    
    // scale에 따라 폰트 크기 조정
    const baseFontSize = 25;
    const fontSize = Math.round(baseFontSize * scale);
    ctx.font = `600 ${fontSize}px Pretendard, system-ui, -apple-system`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const white = cssVar("--white-100", "#FFF");
    ctx.fillStyle = white;
    ctx.shadowColor = "rgba(42, 45, 47, 0.08)";
    ctx.shadowBlur = 12 * scale; // shadow도 스케일에 맞춤

    meta.data.forEach((el: any, i: number) => {
      const p = (ds._points as KeywordPoint[])[i];
      if (!p) return;
      const { x, y } = el;
      ctx.fillText(p.label, x, y);
    });

    ctx.restore();
  },
});

export default function KeywordsBubbleChart({
  data = [],
  showLabels = true,
  className,
  style,
  scale = 1, // 기본값 1 (원본 크기)
}: KeywordsBubbleChartProps) {
  // scale 적용된 데이터
  const scaledData = useMemo(
    () => data.map(point => ({
      ...point,
      r: point.r * scale,
    })),
    [data, scale]
  );

  const chartData = useMemo(
    () => ({
      labels: scaledData.map((d) => d.label),
      datasets: [
        {
          label: "keywords",
          data: scaledData.map(({ x, y, r }) => ({ x, y, r })),
          borderWidth: 0,
          backgroundColor: (ctx: any) => {
            const idx = ctx.dataIndex ?? 0;
            const p: KeywordPoint = (ctx.dataset as any)._points[idx];
            return makeGradient(ctx.chart, p.group);
          },
          hoverBackgroundColor: (ctx: any) => {
            const idx = ctx.dataIndex ?? 0;
            const p: KeywordPoint = (ctx.dataset as any)._points[idx];
            return makeGradient(ctx.chart, p.group);
          },
          _points: scaledData,
        } as any,
      ],
    }),
    [scaledData]
  );

  const options = useMemo<ChartOptions<'bubble'>>( 
    () => ({
      animation: false, 
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point: {
          borderWidth: 0,
          hoverBorderWidth: 0,
        },
      },
      layout: { padding: 0 },
      scales: {
        x: {
          type: "linear" as const,
          grid: {
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            color: "transparent",
            lineWidth: 0,
          },
          border: { display: false },
          ticks: { display: false },
        },
        y: {
          type: "linear" as const,
          grid: {
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            color: "transparent",
            lineWidth: 0,
          },
          border: { display: false },
          ticks: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const p: KeywordPoint = (ctx.dataset as any)._points[ctx.dataIndex];
              return ` ${p.label}`;
            },
          },
        },
      },
    }),
    []
  );

  return (
    <Bubble
      data={chartData}
      options={options}
      plugins={showLabels ? [createBubbleLabelPlugin(scale)] : []}
      className={className}
      style={style}
    />
  );
}