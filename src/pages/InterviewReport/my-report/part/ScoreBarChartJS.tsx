// src/pages/InterviewReport/my-report/part/ScoreBarChartJS.tsx
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import type { Plugin, ChartArea, Scale } from "chart.js";

type SolidBarOpts = {
  score: number;
  avg: number;
  max: number;
  opacity: number;
  radius: number;
  lineWidth: number;
};

const solidBarPlugin: Plugin<"bar", SolidBarOpts> = {
  id: "solidBar",
  afterDatasetsDraw(chart, _args, opts) {
    if (!opts) return;

    const { ctx, chartArea, scales } = chart;
    const x = (scales as Record<string, Scale>).x;
    if (!x || !chartArea) return;

    const max = Math.max(1, opts.max ?? 100);
    const score = Math.max(0, Math.min(opts.score ?? 0, max));
    const avg = Math.max(0, Math.min(opts.avg ?? 0, max));
    const opacity = opts.opacity ?? 0.8;
    const radius = opts.radius ?? 2;
    const lineWidth = opts.lineWidth ?? 2;

    const getCss = (name: string, fallback: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name) || fallback;

    const trackColor = getCss("--white-20", "rgba(134, 58, 58, 0.2)");
    const fillColor = `rgba(255,255,255,${opacity})`;
    const lineColor = getCss("--primary-primary", "#816BFE");

    const { top, bottom, left, right } = chartArea as ChartArea;
    const h = bottom - top;

    const rr = Math.max(0, Math.min(radius, h / 2, (right - left) / 2));
    const roundedRect = (
      xx: number,
      yy: number,
      w: number,
      hh: number,
      r: number,
      leftOnly: boolean
    ) => {
      const rr2 = Math.max(0, Math.min(r, hh / 2, w / 2));
      ctx.beginPath();
      if (leftOnly) {
        ctx.moveTo(xx + rr2, yy);
        ctx.lineTo(xx + w, yy);
        ctx.lineTo(xx + w, yy + hh);
        ctx.lineTo(xx + rr2, yy + hh);
        ctx.quadraticCurveTo(xx, yy + hh, xx, yy + hh - rr2);
        ctx.lineTo(xx, yy + rr2);
        ctx.quadraticCurveTo(xx, yy, xx + rr2, yy);
      } else {
        ctx.moveTo(xx + rr2, yy);
        ctx.lineTo(xx + w - rr2, yy);
        ctx.quadraticCurveTo(xx + w, yy, xx + w, yy + rr2);
        ctx.lineTo(xx + w, yy + hh - rr2);
        ctx.quadraticCurveTo(xx + w, yy + hh, xx + w - rr2, yy + hh);
        ctx.lineTo(xx + rr2, yy + hh);
        ctx.quadraticCurveTo(xx, yy + hh, xx, yy + hh - rr2);
        ctx.lineTo(xx, yy + rr2);
        ctx.quadraticCurveTo(xx, yy, xx + rr2, yy);
      }
      ctx.closePath();
    };

    ctx.save();
    ctx.fillStyle = trackColor;
    roundedRect(left, top, right - left, h, rr, false);
    ctx.fill();

    const valX = x.getPixelForValue(score);
    ctx.fillStyle = fillColor;
    roundedRect(left, top, Math.max(0, valX - left), h, rr, true);
    ctx.fill();

    const avgX = x.getPixelForValue(avg);
    ctx.beginPath();
    ctx.moveTo(avgX, top);
    ctx.lineTo(avgX, bottom);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.stroke();
    ctx.restore();
  },
};

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export type ScoreBarChartJSProps = {
  score?: number;
  average?: number;
  max?: number;
  height?: number;
  opacity?: number;
  radius?: number;
  lineWidth?: number;
  className?: string;
};

export default function ScoreBarChartJS({
  score = 82,
  average = 87,
  max = 100,
  height = 24,
  opacity = 0.8,
  radius = 2,
  lineWidth = 2,
  className,
}: ScoreBarChartJSProps) {
  const data = useMemo(
    () => ({
      labels: [""],
      datasets: [{ data: [score], backgroundColor: "transparent" }],
    }),
    [score]
  );

  const options = useMemo(
    () => ({
      animation: false as const, 
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y" as const,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        solidBar: { score, avg: average, max, opacity, radius, lineWidth },
      } as any,
      layout: { padding: 0 },
      elements: { bar: { borderWidth: 0 } },
      scales: {
        y: { display: false, offset: false, grid: { display: false, drawBorder: false }, ticks: { display: false } },
        x: { min: 0, max, grid: { display: false, drawBorder: false }, ticks: { display: false }, display: false },
      },
    }),
    [score, average, max, opacity, radius, lineWidth]
  );

  return (
    <div style={{ height, width: "100%" }} className={className}>
      <Bar data={data} options={options} plugins={[solidBarPlugin]} />
    </div>
  );
}
