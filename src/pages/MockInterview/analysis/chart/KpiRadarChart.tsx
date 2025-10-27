// src/pages/MockInterview/analysis/components/KpiRadarChart.tsx
import React, { useMemo } from "react";
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

//    const values: number[] = [...((chart.data.datasets?.[0]?.data as number[]) ?? [])].reverse();

    const values: number[] = (chart.data.datasets?.[0]?.data as number[]) ?? [];
   
    if (!scale || !labels?.length) return;

    const ctx = chart.ctx as CanvasRenderingContext2D;

    const gap = opts?.gap ?? 16;
    const pairGapV = opts?.pairGapV ?? 14; // 위/아래 라벨-점수 간격
    const pairGapH = opts?.pairGapH ?? 12; // 좌/우 라벨-점수 간격
    const labelColor = resolveVar(opts?.labelColor ?? "var(--gray-600, #848B93)");
    const labelFont = opts?.labelFont ?? { family: "Pretendard", size: 14, weight: 400 };
    const scoreColor = resolveVar(opts?.scoreColor ?? "#111111");
    const scoreFont = opts?.scoreFont ?? { family: "Pretendard", size: 18, weight: 700 };

    const baseR = scale.getDistanceFromCenterForValue(scale.max);

    ctx.save();

    labels.forEach((label, i) => {
      const angle = scale.getIndexAngle(i);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      let textAlign: CanvasTextAlign = "center";
      let baselineLabel: CanvasTextBaseline = "alphabetic";
      let baselineScore: CanvasTextBaseline = "hanging";

      const pushIn = 10;
      const dx = cos * pushIn;
      const dy = sin * pushIn;

      const cx = scale.xCenter + Math.cos(angle) * (baseR + gap*2) ;
      const cy = scale.yCenter + Math.sin(angle) * (baseR + gap*2) ;

      let labelY = cy;
      let scoreY = cy;

      if (sin < -0.2) {
        // 위쪽
        baselineLabel = "bottom";
        baselineScore = "top";
         scoreY = cy + pairGapV/3;
      } else if (sin > 0.2) {
        baselineLabel = "bottom";
        baselineScore = "top";
        labelY = cy + pairGapV/2;
        scoreY = cy + pairGapV;

      } else {
        baselineLabel = "alphabetic";
        baselineScore = "hanging";
        scoreY = cy + pairGapV;

      }

      ctx.textAlign = textAlign;
      ctx.textBaseline = baselineLabel;
      ctx.font = `${labelFont.weight} ${labelFont.size}px ${labelFont.family}`;
      ctx.fillStyle = labelColor;
      ctx.fillText(label, cx, labelY);

      

      const score = values[i] ?? 0;
      ctx.textBaseline = baselineScore;
      ctx.font = `${scoreFont.weight} ${scoreFont.size}px ${scoreFont.family}`;
      ctx.fillStyle = scoreColor;
      ctx.fillText(`${score}점!`, cx, scoreY);
    });

    ctx.restore();
  },
};

export default function KpiRadarChart({
  attitude = 50,
  voice = 92,
  tension = 80,
  competence = 92,
  className,
}: Props) {
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
          backgroundColor: (ctx: ScriptableContext<"radar">) => {
            const { ctx: c, chartArea } = ctx.chart as any;
            if (!chartArea) return "rgba(21,208,120,0.10)";
            const g = c.createLinearGradient(chartArea.left, chartArea.top, chartArea.right, chartArea.top);
            g.addColorStop(0, "rgba(21, 208, 120, 0.10)");
            g.addColorStop(1, "rgba(75, 209, 200, 0.10)");
            return g;
          },
          fill: true,
        },
      ],
    }),
    [labels, values]
  );

  const options = useMemo(
    () => ({
      animation: false, 
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 0, right: 80, bottom: 0, left: 80 } },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.formattedValue}점` } },
        radarVertexLabels: {
          gap: 15,
          pairGapV: 14,  // 위/아래 간격
          pairGapH: 12,  // 좌/우 간격
          labelColor: "var(--gray-600, #848B93)",
          labelFont: { family: "Pretendard", size: 14, weight: 400 },
          scoreColor: "#111111",
          scoreFont: { family: "Pretendard", size: 18, weight: 700 },
        },
      } as any,
      scales: {
        r: {
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
    []
  );

  return (
    <div className={`kpi-radar${className ?? ""}`}
    style={{ height: "100%" }}
    >
      <Radar data={data} options={options} plugins={[radarVertexLabels]} />
    </div>
  );
}
