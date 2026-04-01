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
import type { ChartOptions, Plugin } from "chart.js";
import ic_crown_white_20 from "@/assets/icons/size20/ic_crown_white_20.png";
import type { MyReportResponse } from "@/api/report/report.types";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export interface ScoreTrendBarChartProps {
  className?: string;
  dates?: (string | Date)[];
  labels?: (string | string[])[];
  values?: number[];
  max?: number;
  height?: number;
  barThickness?: number;

  /** data로 직접 받기 */
  data?: MyReportResponse | null;

  /** 배지(아이콘만) 표시 여부 */
  showPeakLabel?: boolean;
  /** 배지 배경색 */
  peakLabelBg?: string;
  /** 아이콘 이미지 URL */
  peakIconUrl?: string;
  /** 아이콘 크기(px) */
  peakIconSize?: number;
  /** 아이콘과 막대 간격(px) */
  peakIconGap?: number;
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

  const matched = String(input).match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
  if (matched) {
    const y = Number(matched[1]);
    const mm = pad2(Number(matched[2]));
    const dd = pad2(Number(matched[3]));
    return [`${y}.`, `${mm}.${dd}`];
  }

  return [String(input), ""];
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
  img.onerror = () => {
    imgCache[url] = null;
  };
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
    if (idx < 0) return;

    const el: any = meta.data[idx];
    if (!el) return;

    const ctx = chart.ctx as CanvasRenderingContext2D;
    const { x, y } = el;

    const badgeSize = 24;
    const badgeBg: string = opts?.bg ?? "#F9C804";
    const offsetY: number = 6;

    const iconUrl: string | undefined = opts?.iconUrl;
    const iconSize: number = Math.max(1, opts?.iconSize ?? 20);

    const centerX = x;
    const rawCenterY = y - offsetY - badgeSize / 2;
    const centerY = Math.max(rawCenterY, badgeSize / 2 + 2);
    const radius = badgeSize / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = badgeBg;
    ctx.fill();

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
  className,
  dates,
  labels,
  values,
  max = 100,
  height = 293,
  barThickness = 24,
  data,
  showPeakLabel = true,
  peakLabelBg,
  peakIconUrl = ic_crown_white_20,
  peakIconSize = 20,
}: ScoreTrendBarChartProps) {
  const scoreTrend = data?.scoreTrend ?? [];

  const resolvedDates =
    scoreTrend.length > 0 ? scoreTrend.map((item) => item.date) : (dates ?? []);

  const resolvedValues =
    scoreTrend.length > 0
      ? scoreTrend.map((item) => item.score ?? 0)
      : (values ?? []);

  const safeValues = resolvedValues.length > 0 ? resolvedValues : [0];

  const labelItems: (string | string[])[] = useMemo(() => {
    if (resolvedDates.length > 0) return resolvedDates.map(toTwoLineLabel);
    if (labels && labels.length > 0) return labels;
    return [["-", ""]];
  }, [resolvedDates, labels]);

  const maxValue = useMemo(() => {
    if (safeValues.length === 0) return 0;
    return Math.max(...safeValues);
  }, [safeValues]);

  const maxIndex = useMemo(() => {
    if (safeValues.length === 0) return -1;
    return safeValues.indexOf(maxValue);
  }, [safeValues, maxValue]);

  const tickColor = useMemo(() => {
    if (typeof window === "undefined") return "#848B93";
    const css = getComputedStyle(document.documentElement);
    return (css.getPropertyValue("--gray-600") || "#848B93").trim();
  }, []);

  const gridColor = useMemo(() => {
    if (typeof window === "undefined") return "#EEEEEE";
    const css = getComputedStyle(document.documentElement);
    return (css.getPropertyValue("--gray-200") || "#EEEEEE").trim();
  }, []);

  /**
   * 데이터가 적을 때는 width: 100% 로 꽉 차고,
   * 많아질 때만 이 값 이상으로 넓어지면서 가로 스크롤이 생기게 함
   */
  const minChartWidth = useMemo(() => {
    const barCount = safeValues.length;

    // 막대 1개당 차지할 가로 영역(막대 + 여백)
    const slotWidth = Math.max(barThickness + 32, 56);

    // y축 라벨 영역
    const yAxisSpace = 72;

    return barCount * slotWidth + yAxisSpace;
  }, [safeValues.length, barThickness]);

  const chartData = useMemo(
    () => ({
      labels: labelItems,
      datasets: [
        {
          type: "bar" as const,
          label: "점수",
          data: safeValues,
          backgroundColor: (ctx: any) => {
            const i = ctx.dataIndex;
            const chart = ctx.chart;
            const { ctx: canvasCtx, chartArea } = chart;

            if (i !== maxIndex) return "#E0E2E4";
            if (!chartArea) return "#15D078";

            const grad = canvasCtx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            grad.addColorStop(0, "#15D078");
            grad.addColorStop(1, "#4BD1C8");
            return grad;
          },
          borderColor: "transparent",
          hoverBorderColor: "transparent",
          borderWidth: 0,
          hoverBorderWidth: 0,
          borderRadius: {
            topLeft: 2,
            topRight: 2,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: "bottom" as const,
          barThickness,
          maxBarThickness: barThickness,
          categoryPercentage: 0.8,
          barPercentage: 0.9,
          order: 1,
        },
      ],
    }),
    [labelItems, safeValues, barThickness, maxIndex]
  );

  const options = useMemo<ChartOptions<"bar">>(
    () => ({
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 24,
        },
      },
      elements: { bar: { borderWidth: 0 } },
      scales: {
        y: {
          min: 0,
          max,
          ticks: {
            color: tickColor,
            font: { family: "Pretendard", size: 16, weight: "normal" },
            stepSize: 20,
            callback: (v: any) => `${v}점`,
            padding: 6,
            autoSkip: false,
          },
          grid: { color: gridColor, drawBorder: false, drawTicks: false },
          border: { display: false },
        },
        x: {
          offset: true,
          grid: { display: false, drawBorder: false, drawTicks: false },
          ticks: {
            color: tickColor,
            font: { family: "Pretendard", size: 16, weight: "normal" },
            padding: 8,
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
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
        ...(showPeakLabel && maxIndex >= 0
          ? {
              peakLabel: {
                index: maxIndex,
                bg: peakLabelBg,
                iconUrl: peakIconUrl,
                iconSize: peakIconSize,
              },
            }
          : {}),
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
    <div
      className={className}
      style={{
        width: "100%",
        height,
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          width: `max(100%, ${minChartWidth}px)`,
          height: "100%",
        }}
      >
        <Bar data={chartData} options={options} plugins={[peakLabelPlugin]} />
      </div>
    </div>
  );
}