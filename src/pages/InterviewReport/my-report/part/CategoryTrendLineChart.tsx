// // src/pages/InterviewReport/my-report/part/CategoryTrendLineChart.tsx
// import React, { useMemo } from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// type Series = {
//   stress?: number[];      // 긴장도(F87884)
//   competency?: number[];  // 역량(26A4FF)
//   attitude?: number[];    // 태도(AF8CFF)
//   voice?: number[];       // 목소리(15D078)
// };

// export interface CategoryTrendLineChartProps {
//   labels?: string[];   // "2025.01.01" 형식
//   height?: number;     // px
//   tension?: number;    // 0 = 직선
//   // 개별 전달(기존 방식)
//   dataStress?: number[];
//   dataCompetency?: number[];
//   dataAttitude?: number[];
//   dataVoice?: number[];
//   // 한 번에 전달(신규)
//   series?: Series;
// }

// export default function CategoryTrendLineChart({
//   labels = [
//     "2025.01.02","2025.01.04","2025.01.06","2025.01.08","2025.01.10",
//     "2025.01.12","2025.01.14","2025.01.16","2025.01.18","2025.01.20",
//   ],
//   height = 260,
//   tension = 0,
//   dataStress = [70, 65, 60, 62, 58, 55, 50, 45, 48, 44],
//   dataCompetency = [55, 58, 60, 63, 65, 68, 70, 72, 74, 76],
//   dataAttitude = [60, 62, 64, 63, 66, 67, 69, 70, 72, 73],
//   dataVoice = [50, 52, 55, 58, 60, 62, 65, 67, 70, 72],
//   series,
// }: CategoryTrendLineChartProps) {
//   const COLORS = {
//     stress: "#F87884",
//     competency: "#26A4FF",
//     attitude: "#AF8CFF",
//     voice: "#15D078",
//   };

//   // series가 있으면 series 우선, 없으면 개별 props 사용
//   const sStress      = series?.stress      ?? dataStress;
//   const sCompetency  = series?.competency  ?? dataCompetency;
//   const sAttitude    = series?.attitude    ?? dataAttitude;
//   const sVoice       = series?.voice       ?? dataVoice;

//   const tickColor = useMemo(() => {
//     const css = getComputedStyle(document.documentElement);
//     return (css.getPropertyValue("--gray-600") || "#848B93").trim();
//   }, []);

//   const gridColor = useMemo(() => {
//     const css = getComputedStyle(document.documentElement);
//     return (css.getPropertyValue("--gray-200") || "#EEEEEE").trim();
//   }, []);

//   const data = useMemo(
//     () => ({
//       labels,
//       datasets: [
//         {
//           label: "긴장도 분석",
//           data: sStress,
//           borderColor: COLORS.stress,
//           backgroundColor: COLORS.stress,
//           borderWidth: 2,
//           tension,
//           pointRadius: 4,
//           pointHoverRadius: 5,
//           pointBackgroundColor: COLORS.stress,
//           pointBorderColor: COLORS.stress,
//           pointBorderWidth: 2,
//           fill: false,
//           order: 0,
//         },
//         {
//           label: "역량 분석",
//           data: sCompetency,
//           borderColor: COLORS.competency,
//           backgroundColor: COLORS.competency,
//           borderWidth: 2,
//           tension,
//           pointRadius: 4,
//           pointHoverRadius: 5,
//           pointBackgroundColor: COLORS.competency,
//           pointBorderColor: COLORS.competency,
//           pointBorderWidth: 2,
//           fill: false,
//           order: 0,
//         },
//         {
//           label: "태도 분석",
//           data: sAttitude,
//           borderColor: COLORS.attitude,
//           backgroundColor: COLORS.attitude,
//           borderWidth: 2,
//           tension,
//           pointRadius: 4,
//           pointHoverRadius: 5,
//           pointBackgroundColor: COLORS.attitude,
//           pointBorderColor: COLORS.attitude,
//           pointBorderWidth: 2,
//           fill: false,
//           order: 0,
//         },
//         {
//           label: "목소리 분석",
//           data: sVoice,
//           borderColor: COLORS.voice,
//           backgroundColor: COLORS.voice,
//           borderWidth: 2,
//           tension,
//           pointRadius: 4,
//           pointHoverRadius: 5,
//           pointBackgroundColor: COLORS.voice,
//           pointBorderColor: COLORS.voice,
//           pointBorderWidth: 2,
//           fill: false,
//           order: 0,
//         },
//       ],
//     }),
//     [labels, sStress, sCompetency, sAttitude, sVoice, tension]
//   );

//   const options = useMemo(
//     () => ({
//       animation: false as const,
//       maintainAspectRatio: false,
//       responsive: true,
//       layout: {
//         padding: { left: 12, right: 8, top: 0, bottom: 0 },
//       },
//       scales: {
//         y: {
//           min: 0,
//           max: 100,
//           ticks: {
//             stepSize: 20,
//             color: tickColor,
//             font: { family: "Pretendard", size: 14,   weight: 'normal' as const },
//           },
//           grid: { color: gridColor, drawBorder: false },
//           border: { display: false },
//         },
//         x: {
//           offset: true,
//           grid: { display: false, drawBorder: false },
//           ticks: {
//             color: tickColor,
//             font: { family: "Pretendard", size: 14, weight: 'normal' as const },
//             autoSkip: false,
//           },
//           border: { display: false },
//         },
//       },
//       plugins: {
//         legend: { display: false },
//         tooltip: {
//           enabled: true,
//           callbacks: {
//             label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.y}점`,
//           },
//         },
//       },
//       elements: { line: { tension } },

//     }),
//     [tickColor, gridColor, tension]
//   );

//   return (
//     <div style={{ height, width: "100%" }}>
//       <Line data={data} options={options} />
//     </div>
//   );
// }

// src/pages/InterviewReport/my-report/part/CategoryTrendLineChart.tsx

// src/pages/InterviewReport/my-report/part/CategoryTrendLineChart.tsx
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ChartData, 
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

type Series = {
  stress?: number[];      // 긴장도(F87884)
  competency?: number[];  // 역량(26A4FF)
  attitude?: number[];    // 태도(AF8CFF)
  voice?: number[];       // 목소리(15D078)
};

export interface CategoryTrendLineChartProps {
  className?: string;
  labels?: string[];   // "2025.01.01" 형식
  height?: number;     // px
  tension?: number;    // 0 = 직선
  multiLineLabels?: boolean; // true면 "YYYY\nMM.DD" 형식으로 2줄 표시
  // 개별 전달(기존 방식)
  dataStress?: number[];
  dataCompetency?: number[];
  dataAttitude?: number[];
  dataVoice?: number[];
  // 한 번에 전달(신규)
  series?: Series;
}

/** "2025.01.02" -> ["2025", "01.02"] */
function formatToTwoLines(dateStr: string): [string, string] {
  const parts = dateStr.split(".");
  if (parts.length >= 3) {
    return [parts[0], `${parts[1]}.${parts[2]}`];
  }
  return [dateStr, ""];
}

export default function CategoryTrendLineChart({
  className,
  labels = [
    "2025.01.02","2025.01.04","2025.01.06","2025.01.08","2025.01.10",
    "2025.01.12","2025.01.14","2025.01.16","2025.01.18","2025.01.20",
  ],
  height = 260,
  tension = 0,
  multiLineLabels = false,
  dataStress = [70, 65, 60, 62, 58, 55, 50, 45, 48, 44],
  dataCompetency = [55, 58, 60, 63, 65, 68, 70, 72, 74, 76],
  dataAttitude = [60, 62, 64, 63, 66, 67, 69, 70, 72, 73],
  dataVoice = [50, 52, 55, 58, 60, 62, 65, 67, 70, 72],
  series,
}: CategoryTrendLineChartProps) {
  const COLORS = {
    stress: "#F87884",
    competency: "#26A4FF",
    attitude: "#AF8CFF",
    voice: "#15D078",
  };

  // series가 있으면 series 우선, 없으면 개별 props 사용
  const sStress      = series?.stress      ?? dataStress;
  const sCompetency  = series?.competency  ?? dataCompetency;
  const sAttitude    = series?.attitude    ?? dataAttitude;
  const sVoice       = series?.voice       ?? dataVoice;

  const tickColor = useMemo(() => {
    const css = getComputedStyle(document.documentElement);
    return (css.getPropertyValue("--gray-600") || "#848B93").trim();
  }, []);

  const gridColor = useMemo(() => {
    const css = getComputedStyle(document.documentElement);
    return (css.getPropertyValue("--gray-200") || "#EEEEEE").trim();
  }, []);

  // 라벨 포맷팅: multiLineLabels가 true면 2줄 배열로 변환
  const formattedLabels = useMemo(() => {
    if (multiLineLabels) {
      return labels.map(formatToTwoLines);
    }
    return labels;
  }, [labels, multiLineLabels]);

  // 최소 너비 계산: 데이터 포인트 수 * 포인트당 최소 간격
  const minWidth = useMemo(() => {
    const pointCount = labels.length;
    const minGap = multiLineLabels ? 60 : 80; // 2줄일 때는 간격 좁게
    return pointCount * minGap;
  }, [labels.length, multiLineLabels]);

  const data: ChartData<'line', number[], string> = useMemo(
    () => ({
      labels: labels,
      datasets: [
        {
          label: "긴장도 분석",
          data: sStress,
          borderColor: COLORS.stress,
          backgroundColor: COLORS.stress,
          borderWidth: 2,
          tension,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBackgroundColor: COLORS.stress,
          pointBorderColor: COLORS.stress,
          pointBorderWidth: 2,
          fill: false,
          order: 0,
        },
        {
          label: "역량 분석",
          data: sCompetency,
          borderColor: COLORS.competency,
          backgroundColor: COLORS.competency,
          borderWidth: 2,
          tension,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBackgroundColor: COLORS.competency,
          pointBorderColor: COLORS.competency,
          pointBorderWidth: 2,
          fill: false,
          order: 0,
        },
        {
          label: "태도 분석",
          data: sAttitude,
          borderColor: COLORS.attitude,
          backgroundColor: COLORS.attitude,
          borderWidth: 2,
          tension,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBackgroundColor: COLORS.attitude,
          pointBorderColor: COLORS.attitude,
          pointBorderWidth: 2,
          fill: false,
          order: 0,
        },
        {
          label: "목소리 분석",
          data: sVoice,
          borderColor: COLORS.voice,
          backgroundColor: COLORS.voice,
          borderWidth: 2,
          tension,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBackgroundColor: COLORS.voice,
          pointBorderColor: COLORS.voice,
          pointBorderWidth: 2,
          fill: false,
          order: 0,
        },
      ],
    }),
    [formattedLabels, sStress, sCompetency, sAttitude, sVoice, tension, COLORS]
  );

  const options = useMemo(
    () => ({
      animation: false as const,
      maintainAspectRatio: false,
      responsive: true,
      layout: {
        padding: { left: 12, right: 8, top: 0, bottom: 0 },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            color: tickColor,
            font: { family: "Pretendard", size: 14, weight: 'normal' as const },
            autoSkip: false,
          },
          grid: { color: gridColor, drawBorder: false },
          border: { display: false },
        },
        x: {
          offset: true,
          grid: { display: false, drawBorder: false },
          ticks: {
            color: tickColor,
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            // 멀티라인 여부에 따라 폰트 크기 조정
            font: { 
                family: "Pretendard", 
                size: multiLineLabels ? 12 : 14, // 2줄일 경우 폰트 크기 감소
                weight: 'normal' as const 
            },
            // !!! 핵심 수정: 콜백 함수 시그니처와 라벨 접근 방식 수정
            callback: function(this: any, tickValue: any, index: number, ticks: any) {
              // index를 사용하여 labels 배열에서 정확한 라벨 문자열을 가져옵니다.
              const dateStr = labels[index]; 
              
              if (multiLineLabels && dateStr && typeof dateStr === 'string') {
                // "YYYY.MM.DD" 형식에서 년도와 "월.일"을 분리
                const parts = dateStr.split('.');
                if (parts.length >= 3) {
                  // Chart.js는 배열을 반환받으면 각 요소를 줄바꿈하여 표시합니다.
                  return [parts[0], `${parts[1]}.${parts[2]}`]; 
                }
              }
              return dateStr;
            }
          },
          border: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.y}점`,
          },
        },
      },
      elements: { line: { tension } },
    }),
    [tickColor, gridColor, tension]
  );

  return (
    <div
      className={className}
      style={{
        height,
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <div style={{ minWidth, height: "100%" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}