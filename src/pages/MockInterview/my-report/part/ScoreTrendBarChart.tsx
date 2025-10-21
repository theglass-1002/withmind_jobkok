// src/pages/MockInterview/my-report/part/ScoreTrendBarChart.tsx
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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export interface ScoreTrendBarChartProps {
  dates?: (string | Date)[];
  labels?: (string | string[])[];
  values?: number[];
  max?: number;
  height?: number;
  barThickness?: number;
}

/** "YYYY-MM-DD" / "YYYY.MM.DD" / Date -> ["YYYY.", "MM.DD"] */
function toTwoLineLabel(input: string | Date): [string, string] {
  const pad2 = (n: number) => n.toString().padStart(2, "0");
  if (input instanceof Date) {
    const y = input.getFullYear();
    const m = pad2(input.getMonth() + 1);
    const d = pad2(input.getDate());
    return [`${y}.`, `${m}.${d}`];
  }
  const m = input.match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
  if (m) {
    const y = Number(m[1]);
    const mm = pad2(Number(m[2]));
    const dd = pad2(Number(m[3]));
    return [`${y}.`, `${mm}.${dd}`];
  }
  return [input as string, ""];
}

export default function ScoreTrendBarChart({
  dates,
  labels,
  values = [50, 30, 20, 60, 92, 80, 70, 80],
  max = 100,
  height = 293,
  barThickness = 24,
}: ScoreTrendBarChartProps) {
  const labelItems: (string | string[])[] = useMemo(() => {
    if (dates && dates.length) return dates.map(toTwoLineLabel);
    if (labels && labels.length) return labels;
    return [
      
      ["2025.", "01.01"],
      ["2025.", "01.03"],
      ["2025.", "01.08"],
      ["2025.", "01.10"],
      ["2025.", "01.12"],
      ["2025.", "01.15"],
      ["2025.", "01.18"],
      ["2025.", "01.20"],
    ];
  }, [dates, labels]);

  const maxValue = useMemo(() => Math.max(...values), [values]);
  const maxIndex = useMemo(() => values.indexOf(maxValue), [values, maxValue]);

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
          label: "점수",
          data: values,
          backgroundColor: (ctx: any) => {
            const i = ctx.dataIndex;
            const chart = ctx.chart;
            const { ctx: c, chartArea } = chart;
            if (i !== maxIndex) return "#E0E2E4";
            if (!chartArea) return "#15D078";
            const grad = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            grad.addColorStop(0, "#15D078");
            grad.addColorStop(1, "#4BD1C8");
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
    [labelItems, values, barThickness, maxIndex]
  );

  const options = useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      elements: { bar: { borderWidth: 0 } },
      scales: {
        y: {
          min: 0,
          max,
          ticks: {
            color: tickColor,
            font: { family: "Pretendard", size: 16, weight: "400" },
            stepSize: 20,
            callback: (v: any) => `${v}점`,
            padding: 6,
          },
          grid: {
            color: gridColor,
            drawBorder: false,
            drawTicks: false,
          },
          border: { display: false },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
            drawTicks: false,
          },
          ticks: {
            color: tickColor,
            font: { family: "Pretendard", size: 16, weight: "400" },
            padding: 8,
          },
          border: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (ctx: any) => ` ${ctx.parsed.y ?? ctx.parsed}점`,
          },
        },
      },
      animation: { duration: 400, easing: "easeOutQuad" },
    }),
    [max, tickColor, gridColor]
  );

  return (
    <div style={{ height, width: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
