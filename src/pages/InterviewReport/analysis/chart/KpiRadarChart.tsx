import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ScriptableContext,
  type Plugin,
  type ChartOptions, // ChartOptions 타입을 import
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type Props = {
  attitude?: number;
  voice?: number;
  tension?: number;
  competence?: number;
  className?: string;
};

function resolveVar(input: string) {
  const m = input.match(/^var\(\s*--([a-zA-Z0-9-_]+)\s*(?:,\s*([^)]+)\s*)?\)$/);
  if (!m) return input;
  const [, name, fb] = m;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim();
  return v || (fb?.trim() ?? input);
}

const radarVertexLabels: Plugin<"radar"> = {
  id: "radarVertexLabels",
  afterDraw(chart, _args, opts: any) {
    const scale: any = chart.scales?.r;
    const labels = chart.data.labels as string[];
    const values: number[] = (chart.data.datasets?.[0]?.data as number[]) ?? [];
   
    if (!scale || !labels?.length) return;
    if (labels.length !== 4) return;

    const ctx = chart.ctx as CanvasRenderingContext2D;

    const gap = opts?.gap ?? 15;
    const pairGapV = opts?.pairGapV ?? 18;
    
    const labelColor = resolveVar(opts?.labelColor ?? "var(--gray-600, #848B93)");
    const labelFont = opts?.labelFont ?? { family: "Pretendard", size: 14, weight: 400 };
    
    const scoreColor = resolveVar(opts?.scoreColor ?? "var(--gray-900, #2A2D2F)");
    const scoreFont = opts?.scoreFont ?? { family: "Pretendard", size: 18, weight: 600 };

    const baseR = scale.getDistanceFromCenterForValue(scale.max);

    ctx.save();

    const positions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ];

    labels.forEach((label, i) => {
      const pos = positions[i];
      const cx = scale.xCenter + pos.x * (baseR + gap);
      const cy = scale.yCenter + pos.y * (baseR + gap);

      let labelX = cx;
      let labelY = cy;
      let scoreX = cx;
      let scoreY = cy;
      
      const horizontalPush = 3;
      const verticalPush = 3;
      
      if (i === 0) { 
        labelX = cx + horizontalPush;
        scoreX = cx + horizontalPush;
        labelY = cy - pairGapV / 2;
        scoreY = cy + pairGapV / 2;
      } 
      else if (i === 1) { 
        labelY = cy - pairGapV / 2 + verticalPush;
        scoreY = cy + pairGapV / 2 + verticalPush;
      } 
      else if (i === 2) { 
        labelX = cx - horizontalPush;
        scoreX = cx - horizontalPush;
        labelY = cy - pairGapV / 2;
        scoreY = cy + pairGapV / 2;
      }
      else if (i === 3) { 
        labelY = cy - pairGapV / 2 - verticalPush;
        scoreY = cy + pairGapV / 2 - verticalPush;
      }
      
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.font = `${labelFont.weight} ${labelFont.size}px ${labelFont.family}, sans-serif`;
      ctx.fillStyle = labelColor;
      ctx.fillText(label, labelX, labelY);

      const score = values[i] ?? 0;
      ctx.textBaseline = "hanging";
      ctx.font = `${scoreFont.weight} ${scoreFont.size}px ${scoreFont.family}, sans-serif`;
      ctx.fillStyle = scoreColor;
      ctx.fillText(`${score}점`, scoreX, scoreY);
    });

    ctx.restore();
  },
};

export default function KpiRadarChart({
  attitude = 10,
  voice = 100,
  tension = 40,
  competence = 60,
  className,
}: Props) {
  const location = useLocation();
  const isPrintMode = new URLSearchParams(location.search).has('printViewr');
  
  const labels = ["태도", "목소리", "긴장도", "역량"]; 
  const values = [attitude, voice, tension, competence];

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "평가",
          data: values,
          borderColor: "#15D078",
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBackgroundColor: "#15D078",
          backgroundColor: "rgba(21, 208, 120, 0.10)",
          fill: true,
        },
      ],
    }),
    [labels, values]
  );

  const options = useMemo<ChartOptions<'radar'>>( 
    () => ({
      animation: isPrintMode ? false : {
        duration: 1200,
        easing: 'easeOutCubic' as const,
      },
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 55, right: 80, bottom: 50, left: 80 } }, 
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.formattedValue}점` } },
        radarVertexLabels: {
          gap: 35,
          pairGapV: 15,
          labelColor: "var(--gray-600, #848B93)",
          labelFont: { family: "Pretendard", size: 13, weight: 400 },
          scoreColor: "var(--gray-900, #2A2D2F)",
          scoreFont: { family: "Pretendard", size: 15, weight: 600 },
        },
      } as any,
      scales: {
        r: {
          startAngle: 0,
          min: 0,
          max: 100,
          ticks: { display: false, stepSize: 20 },
          grid: { color: "#E5E7EB" },
          angleLines: { color: "#E5E7EB", lineWidth: 1 },
          pointLabels: { display: false },
        },
      },
      elements: { line: { tension: 0 } },
    }),
    [isPrintMode]
  );

  return (
    <div className={`kpi-radar ${className ?? ""}`} style={{ height: "100%" }}>
      <Radar data={data} options={options} plugins={[radarVertexLabels]} />
    </div>
  );
}