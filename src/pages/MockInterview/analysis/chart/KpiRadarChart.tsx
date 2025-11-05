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
  type Plugin, // Plugin 타입 추가
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type Props = {
  attitude?: number;
  voice?: number;
  tension?: number;
  competence?: number;
  className?: string;
};

// CSS 변수를 가져오는 유틸리티 함수 (이전 버전에서 복구)
function resolveVar(input: string) {
  const m = input.match(/^var\(\s*--([a-zA-Z0-9-_]+)\s*(?:,\s*([^)]+)\s*)?\)$/);
  if (!m) return input;
  const [, name, fb] = m;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim();
  return v || (fb?.trim() ?? input);
}


// 라벨과 점수를 분리하여 스타일링하는 커스텀 플러그인
const radarVertexLabels: Plugin<"radar"> = {
  id: "radarVertexLabels",
  afterDraw(chart, _args, opts: any) {
    const scale: any = chart.scales?.r;
    const labels = chart.data.labels as string[];
    const values: number[] = (chart.data.datasets?.[0]?.data as number[]) ?? [];
   
    if (!scale || !labels?.length) return;
    if (labels.length !== 4) return; // 4개 항목(사각형)에만 최적화

    const ctx = chart.ctx as CanvasRenderingContext2D;

    // 플러그인 옵션에서 스타일 및 간격 설정
    const gap = opts?.gap ?? 15; // 축 끝과 텍스트 중앙 사이의 거리
    const pairGapV = opts?.pairGapV ?? 18; // 라벨과 점수 사이의 수직 간격 (줄 바꿈 효과)
    
    // 라벨 (항목 이름) 스타일 (요청하신 대로 업데이트)
    const labelColor = resolveVar(opts?.labelColor ?? "var(--gray-600, #848B93)");
    const labelFont = opts?.labelFont ?? { family: "Pretendard", size: 14, weight: 400 };
    
    // 점수 스타일 
    const scoreColor = resolveVar(opts?.scoreColor ?? "var(--gray-900, #2A2D2F)");
    const scoreFont = opts?.scoreFont ?? { family: "Pretendard", size: 18, weight: 600 };

    // 차트 최대 반지름을 기준으로 라벨 위치 계산
    const baseR = scale.getDistanceFromCenterForValue(scale.max);

    ctx.save();

    labels.forEach((label, i) => {
      const angle = scale.getIndexAngle(i);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      let textAlign: CanvasTextAlign = "center";
      
      // 축 끝점에서 gap 만큼 떨어진 지점 (텍스트 중앙 기준)
      const cx = scale.xCenter + cos * (baseR + gap);
      const cy = scale.yCenter + sin * (baseR + gap);

      let labelX = cx;
      let labelY = cy;
      let scoreX = cx;
      let scoreY = cy;
      
      const horizontalPush = 3;
      const verticalPush = 3;
      
      // 4개 항목은 12시(i=0), 3시(i=1), 6시(i=2), 9시(i=3)에 위치합니다.
      
      // 12시 (i=0): 역량 (상단)
      if (i === 0) { 
        textAlign = "center";
        // 라벨을 위쪽에, 점수를 아래쪽에 배치 (중앙 기준)
        labelY = cy - pairGapV / 2 - verticalPush;
        scoreY = cy + pairGapV / 2 - verticalPush;
      } 
      // 3시 (i=1): 목소리 (오른쪽)
      else if (i === 1) { 
        textAlign = "left";
        labelX = cx + horizontalPush;
        scoreX = cx + horizontalPush;
        // 라벨과 점수 모두 중앙 정렬
        labelY = cy - pairGapV / 2;
        scoreY = cy + pairGapV / 2;
      } 
      // 6시 (i=2): 태도 (하단)
      else if (i === 2) { 
        textAlign = "center";
        // 라벨을 위쪽에, 점수를 아래쪽에 배치 (중앙 기준)
        labelY = cy - pairGapV / 2 + verticalPush;
        scoreY = cy + pairGapV / 2 + verticalPush;
      }
      // 9시 (i=3): 긴장도 (왼쪽)
      else if (i === 3) { 
        textAlign = "right";
        labelX = cx - horizontalPush;
        scoreX = cx - horizontalPush;
        // 라벨과 점수 모두 중앙 정렬
        labelY = cy - pairGapV / 2;
        scoreY = cy + pairGapV / 2;
      }
      
      // 1. 라벨 (항목 이름) 그리기
      ctx.textAlign = textAlign;
      ctx.textBaseline = "alphabetic"; // 라벨은 상단 정렬
      ctx.font = `${labelFont.weight} ${labelFont.size}px ${labelFont.family}, sans-serif`;
      ctx.fillStyle = labelColor;
      ctx.fillText(label, labelX, labelY);

      // 2. 점수 그리기 (줄 바꿈 효과)
      const score = values[i] ?? 0;
      ctx.textBaseline = "hanging"; // 점수는 하단 정렬
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
  tension = 40, // 기본값 40 추가
  competence = 60,
  className,
}: Props) {
  
  // 12시: 역량(competence), 3시: 목소리(voice), 6시: 태도(attitude), 9시: 긴장도(tension) - 사각형 레이아웃
  // 순서는 Chart.js의 기본 레이더 순서(12시부터 시계방향)를 따름
  const labels = ["역량", "목소리", "태도", "긴장도"]; 
  
  // values 순서는 labels 순서에 따라 [competence, voice, attitude, tension]
  const values = [competence, voice, attitude, tension];
  

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
            const { chartArea } = ctx.chart as any;
            if (!chartArea) return "rgba(21,208,120,0.10)";
            return "rgba(21, 208, 120, 0.10)"; 
          },
          fill: true,
        },
      ],
    }),
    [labels, values]
  );

  const options = useMemo(
    () => ({
      animation: {
        duration: 1200,
        easing: 'easeOutCubic' as const,
      },
      responsive: true,
      maintainAspectRatio: false,
      // 커스텀 라벨이 바깥쪽에 그려지므로 패딩을 넉넉히 줌
      layout: { padding: { top: 30, right: 30, bottom: 30, left: 30 } }, 
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.formattedValue}점` } },
        
        // 커스텀 플러그인 설정
        radarVertexLabels: {
          gap: 15, // 축 끝과 텍스트 중앙 사이의 거리
          pairGapV: 18, // 라벨과 점수 사이의 간격 (줄 바꿈 높이)
          
          // 라벨 스타일 (요청하신 대로 업데이트)
          labelColor: "var(--gray-600, #848B93)",
          labelFont: { family: "Pretendard", size: 14, weight: 400 },
          
          // 점수 스타일 (이전 요청 그대로 유지)
          scoreColor: "var(--gray-900, #2A2D2F)",
          scoreFont: { family: "Pretendard", size: 18, weight: 600 },
        },
      } as any,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false, stepSize: 20 },
          grid: { color: "#E5E7EB" },
          angleLines: { color: "#E5E7EB", lineWidth: 1 },
          pointLabels: { display: false }, // 커스텀 플러그인 사용 시 기본 라벨 숨김
        },
      },
      elements: { line: { tension: 0 } },
    }),
    []
  );

  return (
    <div className={`kpi-radar${className ?? ""}`} style={{ height: "100%" }}>
      <Radar data={data} options={options} plugins={[radarVertexLabels]} />
    </div>
  );
}