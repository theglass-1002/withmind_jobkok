import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartOptions, Plugin } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  value: number;
  label: string;
  size?: number;
  stroke?: number;
  fillColor?: string;
  trackColor?: string;
  labelColor?: string;
  valueColor?: string;
  labelFontSize?: number;
  valueFontSize?: number;
  className?: string;
};

export default function ExpressionDonutChart({
  value,
  label,
  size = 300,
  stroke = 54, // 현재는 UI 유지 위해 실제 계산엔 안 씀
  fillColor = "#816BFE",
  trackColor = "#EBECED",
  labelColor = "#6F767E",
  valueColor = "#816BFE",
  labelFontSize = 20,
  valueFontSize = 44,
  className,
}: Props) {
  const safe = Math.max(0, Math.min(100, value));

  const backgroundData = useMemo(
    () => ({
      datasets: [
        {
          data: [100],
          backgroundColor: [trackColor],
          borderWidth: 0,
          borderColor: "transparent",
        },
      ],
    }),
    [trackColor]
  );

  const foregroundData = useMemo(
    () => ({
      datasets: [
        {
          data: [safe, 100 - safe],
          backgroundColor: [fillColor, "transparent"],
          borderWidth: 0,
          borderColor: "transparent",
        },
      ],
    }),
    [safe, fillColor]
  );

  const backgroundOptions: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: false,
      maintainAspectRatio: false,
      cutout: "80%",
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    }),
    []
  );

  const foregroundOptions: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: false,
      maintainAspectRatio: false,
      cutout: "80%",
      animation: {
        animateRotate: true,
        animateScale: false,
        duration: 1500,
        easing: "easeInOutQuart",
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    }),
    []
  );

  const centerTextPlugin: Plugin<"doughnut"> = useMemo(
    () => ({
      id: `expression-center-text-${label}-${safe}`,
      afterDraw(chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;

        const centerX = chartArea.left + chartArea.width / 2;
        const centerY = chartArea.top + chartArea.height / 2;

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = labelColor;
        ctx.font = `600 ${labelFontSize}px sans-serif`;
        ctx.fillText(label, centerX, centerY - 20);

        ctx.fillStyle = valueColor;
        ctx.font = `bold ${valueFontSize}px sans-serif`;
        ctx.fillText(`${safe}%`, centerX, centerY + 25);

        ctx.restore();
      },
    }),
    [label, safe, labelColor, valueColor, labelFontSize, valueFontSize]
  );

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative" }}
    >
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <Doughnut
          data={backgroundData}
          options={backgroundOptions}
          width={size}
          height={size}
        />
      </div>

      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <Doughnut
          key={`${label}-${safe}`}
          data={foregroundData}
          options={foregroundOptions}
          plugins={[centerTextPlugin]}
          width={size}
          height={size}
        />
      </div>
    </div>
  );
}