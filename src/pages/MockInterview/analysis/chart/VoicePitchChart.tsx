// src/pages/MockInterview/analysis/components/VoicePitchChart.tsx
import React, { useMemo, useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type Plugin,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type Props = {
  /** 데이터 값 배열 (예: [220, 195, 210, 180, ...]) */
  values: number[];
  /** X축 라벨 (예: ["질문 1", "질문 2", ...] 또는 [["질문", "1"], ["질문", "2"], ...]) */
  labels?: (string | string[])[];
  /** 평균선 값 */
  averageLine?: number;
  /** 평균선 라벨 */
  averageLabel?: string;
  /** 차트 높이 */
  height?: number;
  /** 선 색상 */
  lineColor?: string;
  /** 영역 색상 (그라디언트 시작) */
  areaColorStart?: string;
  /** 영역 색상 (그라디언트 끝) */
  areaColorEnd?: string;
  /** 평균선 색상 */
  averageLineColor?: string;
  /** Y축 최소값 */
  min?: number;
  /** Y축 최대값 */
  max?: number;
};

export default function VoicePitchChart({
  values,
  labels,
  averageLine = 200,
  averageLabel = "평균",
  lineColor = "#15D078",
  areaColorStart = "rgba(21, 208, 120, 0.3)",
  areaColorEnd = "rgba(21, 208, 120, 0.05)",
  averageLineColor = "#FF524C",
  min = 0,
  max = 300,
}: Props) {
  const defaultLabels = useMemo(
    () => values.map((_, i) => ["질문", `${i + 1}`]),
    [values]
  );
  const chartLabels = labels || defaultLabels;

  const [animatedValues, setAnimatedValues] = useState<number[]>(
    values.map(() => min)
  );
  const animationRef = useRef<number>();

  // 애니메이션 효과
  useEffect(() => {
    const startTime = Date.now();
    const duration = 1200;
    const startValues = [...animatedValues];

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentValues = values.map((target, i) => {
        const start = startValues[i] || min;
        return start + (target - start) * easeProgress;
      });

      setAnimatedValues(currentValues);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [values, min]);

  const data = useMemo(() => {
    return {
      labels: chartLabels,
      datasets: [
        {
          label: "목소리 톤",
          data: animatedValues,
          borderColor: lineColor,
          backgroundColor: (context: any) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return areaColorStart;
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            gradient.addColorStop(0, areaColorStart);
            gradient.addColorStop(1, areaColorEnd);
            return gradient;
          },
          borderWidth: 2,
          fill: true,
          tension: 0,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: lineColor,
          pointBorderColor: "#15D078",
          pointBorderWidth: 2,
        },
      ],
    };
  }, [chartLabels, animatedValues, lineColor, areaColorStart, areaColorEnd]);

  const options = useMemo(() => {
    return {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (ctx: any) => ` ${ctx.parsed.y.toFixed(0)} Hz`,
          },
        },
      },
      scales: {
        y: {
          min,
          max,
          ticks: {
            stepSize: 50,
            callback: (v: any) => `${v} Hz`,
            font: { size: 14, family: "Pretendard" },
            color: "#848B93",
          },
          grid: {
            color: "#E0E2E4",
            drawBorder: false,
          },
          border: { display: false },
        },
        x: {
          ticks: {
            font: { size: 14, family: "Pretendard" },
            color: "#848B93",
          },
          grid: { display: false, drawBorder: false },
          border: { display: false },
        },
      },
    };
  }, [min, max]);

  // 평균선 플러그인
  const averageLinePlugin: Plugin<"line"> = useMemo(
    () => ({
      id: "averageLine",
      afterDatasetsDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        if (!chartArea || !scales.y) return;

        const y = scales.y.getPixelForValue(averageLine);

        ctx.save();

        // 점선 그리기
        ctx.setLineDash([8, 4]);
        ctx.strokeStyle = averageLineColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(chartArea.left, y);
        ctx.lineTo(chartArea.right, y);
        ctx.stroke();

        // 라벨 배지
        ctx.setLineDash([]);
        const text = averageLabel;
        ctx.font = "600 14px Pretendard";
        const textWidth = ctx.measureText(text).width;
        const badgeW = textWidth + 16;
        const badgeH = 24;
        const badgeX = chartArea.right - badgeW ;
        const badgeY = y - badgeH / 2;

        // 배지 배경
        ctx.fillStyle = averageLineColor;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
        ctx.fill();

        // 배지 텍스트
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, badgeX + badgeW / 2, badgeY + badgeH / 2);

        ctx.restore();
      },
    }),
    [averageLine, averageLineColor, averageLabel]
  );

  return (
    <div style={{ width: "100%", height:"100%", padding:"0px" }}>
      <Line data={data} options={options} plugins={[averageLinePlugin]} />
    </div>
  );
}