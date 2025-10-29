// src/pages/MockInterview/analysis/components/KpiFitBar.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const RADIUS = 2;
const TRACK_COLOR = "#EBECED";
const GRADIENT_START = "#15D078";
const GRADIENT_END = "#4BD1C8";

type Props = {
  value: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function KpiFitBar({ value, className, style }: Props) {
  const v = Math.max(0, Math.min(100, value));

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [wrapH, setWrapH] = useState<number>(24);
  const [animatedValue, setAnimatedValue] = useState<number>(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const update = () => setWrapH(el.clientHeight || 24);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, []);

  // 애니메이션 효과
  useEffect(() => {
    const startTime = Date.now();
    const duration = 1200;
    const startValue = animatedValue;
    const targetValue = v;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (targetValue - startValue) * easeProgress;
      setAnimatedValue(currentValue);

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
  }, [v]);

  const gradientCacheRef = useRef<{ key: string; gradient: CanvasGradient } | null>(null);
  function getGradient(chart: any) {
    const { ctx, chartArea } = chart || {};
    if (!chartArea) return GRADIENT_START;
    const key = `${chartArea.left},${chartArea.top},${chartArea.right},${chartArea.bottom}`;
    if (!gradientCacheRef.current || gradientCacheRef.current.key !== key) {
      const g = ctx.createLinearGradient(chartArea.left, chartArea.top, chartArea.right, chartArea.top);
      g.addColorStop(0, GRADIENT_START);
      g.addColorStop(1, GRADIENT_END);
      gradientCacheRef.current = { key, gradient: g };
    }
    return gradientCacheRef.current.gradient;
  }

  const data = useMemo(() => {
    const common = {
      borderRadius: RADIUS,
      borderSkipped: false as const,
      barPercentage: 1,
      categoryPercentage: 1,
      grouped: false as const,
      borderWidth: 0,
      barThickness: wrapH,
    };
    return {
      labels: [""],
      datasets: [
        { label: "track", data: [100], backgroundColor: TRACK_COLOR, order: 1, ...common },
        { label: "value", data: [animatedValue], backgroundColor: (c: any) => getGradient(c.chart), order: 0, ...common },
      ],
    };
  }, [animatedValue, wrapH]);

  const options = useMemo(
    () => ({
      animation: false, // Chart.js 기본 애니메이션 끄기
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      layout: { padding: 0 },
      scales: {
        x: {
          min: 0,
          max: 100,
          beginAtZero: true,
          grid: { display: false },
          ticks: { display: false },
          border: { display: false },
        },
        y: {
          display: false,
          offset: false,
          grid: { display: false },
          ticks: { display: false },
          border: { display: false },
        },
      },
    }),
    []
  );

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ width: "100%", height: "100%", overflow: "hidden", ...style }}
      aria-label={`KPI bar ${v}%`}
    >
      <Bar data={data} options={options} />
    </div>
  );
}