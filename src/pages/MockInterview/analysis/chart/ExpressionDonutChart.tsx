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
  stroke = 54,
  fillColor = "#816BFE",
  trackColor = "#EBECED",
  labelColor = "#6F767E",
  valueColor = "#816BFE",
  labelFontSize = 20,
  valueFontSize = 44,
  className,
}: Props) {
  const safe = Math.max(0, Math.min(100, value));

  // 배경 트랙 (애니메이션 없음)
  const backgroundData = useMemo(
    () => ({
      datasets: [
        {
          data: [100],
          backgroundColor: [trackColor],
          borderWidth: 0,
          borderColor: 'transparent',
        },
      ],
    }),
    [trackColor]
  );

  // 채워지는 부분 (애니메이션 있음)
  const foregroundData = useMemo(
    () => ({
      datasets: [
        {
          data: [safe, 100 - safe],
          backgroundColor: [fillColor, 'transparent'],
          borderWidth: 0,
          borderColor: 'transparent',
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
      animation: false, // 배경은 애니메이션 없음!
      plugins: { 
        legend: { display: false }, 
        tooltip: { enabled: false } 
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
        animateRotate: true, // 회전 애니메이션
        animateScale: false,
        duration: 1500, // 1.5초
        easing: 'easeInOutQuart',
      },
      plugins: { 
        legend: { display: false }, 
        tooltip: { enabled: false } 
      },
    }),
    []
  );

  const centerTextPlugin: Plugin<"doughnut"> = useMemo(
    () => ({
      id: "expression-center-text",
      afterDatasetsDraw(chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        
        const centerX = chartArea.left + chartArea.width / 2;
        const centerY = chartArea.top + chartArea.height / 2;
  
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
  
        // 라벨 (위)
        ctx.fillStyle = labelColor;
        ctx.font = `600 ${labelFontSize}px sans-serif`;
        ctx.fillText(label, centerX, centerY - 20); // 위로!
  
        // 퍼센트 (아래)
        ctx.fillStyle = valueColor;
        ctx.font = `bold ${valueFontSize}px sans-serif`;
        ctx.fillText(`${safe}%`, centerX, centerY + 25); // 아래로!
        
        ctx.restore();
      },
    }),
    [label, safe, valueColor, labelColor, valueFontSize, labelFontSize]
  );

  return (
    <div className={className} style={{ width: size, height: size, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <Doughnut 
          data={backgroundData} 
          options={backgroundOptions}
          width={size}
          height={size}
        />
      </div>
      
      {/* 애니메이션되는 채워지는 부분 */}
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <Doughnut 
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