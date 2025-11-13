// src/pages/InterviewReport/analysis/components/TensionAnalysisChart.tsx
import React, { useMemo, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

type Props = {
  /** 사용자 데이터 값 배열 */
  userValues: number[];
  /** 평균 데이터 값 배열 */
  averageValues: number[];
  /** X축 라벨 */
  labels?: (string | string[])[];
  /** 사용자 선 색상 */
  userLineColor?: string;
  /** 평균 선 색상 */
  averageLineColor?: string;
  /** Y축 최소값 */
  min?: number;
  /** Y축 최대값 */
  max?: number;
};

export default function TensionAnalysisChart({
  userValues,
  averageValues,
  labels,
  userLineColor = "#FF524C",
  averageLineColor = "#26A4FF",
  min = 0,
  max = 100,
}: Props) {
  const location = useLocation();
  const isPrintMode = new URLSearchParams(location.search).has('printViewr');

  const defaultLabels = useMemo(
    () => userValues.map((_, i) => `질문 ${i + 1}`),
    [userValues]
  );
  const chartLabels = labels || defaultLabels;

  const [animatedUserValues, setAnimatedUserValues] = useState<number[]>(
    userValues.map(() => min)
  );
  const [animatedAverageValues, setAnimatedAverageValues] = useState<number[]>(
    averageValues.map(() => min)
  );
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1200;
    const startUserValues = [...animatedUserValues];
    const startAverageValues = [...animatedAverageValues];

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentUserValues = userValues.map((target, i) => {
        const start = startUserValues[i] || min;
        return start + (target - start) * easeProgress;
      });

      const currentAverageValues = averageValues.map((target, i) => {
        const start = startAverageValues[i] || min;
        return start + (target - start) * easeProgress;
      });

      setAnimatedUserValues(currentUserValues);
      setAnimatedAverageValues(currentAverageValues);

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
  }, [userValues, averageValues, min, animatedUserValues, animatedAverageValues]);

  const data = useMemo(() => {
    return {
      labels: chartLabels,
      datasets: [
        {
          label: "사용자",
          data: animatedUserValues,
          borderColor: userLineColor,
          backgroundColor: "transparent",
          borderWidth: 2,
          fill: false,
          tension: 0,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: userLineColor,
          pointBorderColor: userLineColor,
          pointBorderWidth: 2,
        },
        {
          label: "평균",
          data: animatedAverageValues,
          borderColor: averageLineColor,
          backgroundColor: "transparent",
          borderWidth: 2,
          fill: false,
          tension: 0,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: averageLineColor,
          pointBorderColor: averageLineColor,
          pointBorderWidth: 2,
        },
      ],
    };
  }, [chartLabels, animatedUserValues, animatedAverageValues, userLineColor, averageLineColor]);

  const options = useMemo(() => {
    const fontSize = isPrintMode ? 10 : 12;

    return {
      animation: false as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(0)}점`,
          },
        },
      },
      scales: {
        y: {
          min,
          max,
          ticks: {
            stepSize: (max - min) / 5,
            display: false,
          },
          grid: {
            color: "#E0E2E4",
            drawBorder: false,
          },
          border: { display: false },
        },
        x: {
          ticks: {
            font: { size: fontSize, family: "Pretendard" },
            color: "#848B93",
            maxRotation: 0, 
            minRotation: 0,
          },
          grid: { display: false, drawBorder: false },
          border: { display: false },
        },
      },
    };
  }, [min, max, isPrintMode]);

  return (
    <div className="detail-analysis__tension-chart-wrapper" style={{ width: "100%", height: "100%", padding: "0px" }}>
      <Line data={data} options={options} />
    </div>
  );
}