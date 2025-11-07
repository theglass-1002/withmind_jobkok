// src/pages/InterviewReport/my-report/part/ScoreTrendBarChart.tsx
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
import type { Plugin } from "chart.js";
import ic_crown_white_20 from "@/assets/icons/size20/ic_crown_white_20.png";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export interface ScoreTrendBarChartProps {
  dates?: (string | Date)[];
  labels?: (string | string[])[];
  values?: number[];
  max?: number;
  height?: number;
  barThickness?: number;

  /** 배지(아이콘만) 표시 여부 */
  showPeakLabel?: boolean;
  /** 배지 배경색 */
  peakLabelBg?: string;
  /** 아이콘 이미지 URL */
  peakIconUrl?: string;
  /** 아이콘 크기(px) */
  peakIconSize?: number;
  /** 배지와 막대 간격(px) */
  peakIconGap?: number; // 사용 안 함(호환용)
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

// 이미지 캐시
const imgCache: Record<string, HTMLImageElement | null> = {};
function getImg(url?: string, onload?: () => void) {
  if (!url) return null;
  const cached = imgCache[url];
  if (cached !== undefined) return cached;
  const img = new Image();
  img.src = url;
  img.onload = () => {
    imgCache[url] = img;
    onload?.();
  };
  img.onerror = () => (imgCache[url] = null);
  imgCache[url] = img;
  return img;
}

/**
 * 최고점 막대 위에 텍스트 없이
 * 노란 원(24x24) + 중앙 아이콘만 그리는 플러그인
 */
const peakLabelPlugin: Plugin<"bar", any> = {
  id: "peakLabel",
  afterDatasetsDraw(chart, _args, opts) {
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;

    const idx: number = opts?.index ?? 0;
    const el: any = meta.data[idx];
    if (!el) return;

    const ctx = chart.ctx as CanvasRenderingContext2D;
    const { x, y } = el;

    const badgeSize = 24; // 정사각형 배지 크기
    const badgeBg: string = opts?.bg ?? "#F9C804";
    const offsetY: number = 6; // 막대 꼭대기와의 간격

    const iconUrl: string | undefined = opts?.iconUrl;
    const iconSize: number = Math.max(1, opts?.iconSize ?? 20);

    // 배지(원)
    const centerX = x;
    const centerY = y - offsetY - badgeSize / 2;
    const radius = badgeSize / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = badgeBg;
    ctx.fill();

    // 아이콘
    const icon = getImg(iconUrl, () => chart.draw());
    if (icon && icon.complete) {
      const drawX = centerX - iconSize / 2;
      const drawY = centerY - iconSize / 2;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(icon, drawX, drawY, iconSize, iconSize);
    }
    ctx.restore();
  },
};

export default function ScoreTrendBarChart({
  dates,
  labels,
  values = [50, 30, 20, 60, 92, 80, 70, 80],
  max = 100,
  height = 293,
  barThickness = 24,

  showPeakLabel = true,
  peakLabelBg,
  peakIconUrl = ic_crown_white_20,
  peakIconSize = 20,
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
      animation: false, 
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
          grid: { color: gridColor, drawBorder: false, drawTicks: false },
          border: { display: false },
        },
        x: {
          grid: { display: false, drawBorder: false, drawTicks: false },
          ticks: { color: tickColor, font: { family: "Pretendard", size: 16, weight: "400" }, padding: 8 },
          border: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: { label: (ctx: any) => ` ${ctx.parsed.y ?? ctx.parsed}점` },
        },
        ...(showPeakLabel && {
          peakLabel: {
            index: maxIndex,
            bg: peakLabelBg,
            iconUrl: peakIconUrl,
            iconSize: peakIconSize,
          },
        }),
      } as any,
    }),
    [
      max,
      tickColor,
      gridColor,
      showPeakLabel,
      peakLabelBg,
      peakIconUrl,
      peakIconSize,
      maxIndex,
    ]
  );

  return (
    <div style={{ height, width: "100%" }}>
      <Bar data={data} options={options} plugins={[peakLabelPlugin]} />
    </div>
  );
}
