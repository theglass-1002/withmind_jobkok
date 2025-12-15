import React, { useMemo } from "react";
import KpiGaugeChart from "@/pages/InterviewReport/analysis/chart/KpiGaugeChart";

// 아이콘은 컴포넌트 내부에서 가져오면 부모가 간단해진다
import ic_page_facing_up_24 from "@/assets/icons/size24/ic_page-facing-up_24.png";
import ic_info_white80_20 from "@/assets/icons/size20/ic_info_white80_20.png";
import ic_yellow_flag20 from "@/assets/icons/size20/ic_yellow_flag20.png";
import Tooltip from "@/shared/components/tooltip/Tooltip";

type Props = {
  score: number;
  totalCandidates: number;
  percentile: number;

  // 라벨/구간 커스터마이즈 가능
  labels?: string[];
  breaks?: number[];

  // 차트 색상/치수 옵션
  baseColor?: string;
  fillColor?: string;
  gap?: number;
  barHeight?: number;
  labelFontSize?: number;
  chartHeight?: number;

  // KPI 상태 텍스트(미입력 시 점수로 계산된 버킷 라벨 사용)
  kpiTitleModifierClass?: string; // 예: "good", "fair" 등 모디파이어 클래스
  tooltipTitle?: string;
  tooltipDesc?: string;
};

const DEFAULT_BREAKS = [20, 40, 60, 80, 100] as const;
const DEFAULT_LABELS = ["매우 미흡", "미흡", "보통", "우수", "최우수"] as const;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function segmentsFromScore(score: number, breaks = DEFAULT_BREAKS as readonly number[]) {
  const segs = Array(breaks.length).fill(0) as number[];
  let prev = 0;
  for (let i = 0; i < breaks.length; i++) {
    const end = breaks[i];
    const filled = (score - prev) / (end - prev);
    segs[i] = score >= end ? 1 : clamp01(filled);
    if (score <= end) break;
    prev = end;
  }
  return segs.map((v) => clamp01(v));
}

function bucketOf(score: number, breaks = DEFAULT_BREAKS as readonly number[], labels = DEFAULT_LABELS as readonly string[]) {
  for (let i = 0; i < breaks.length; i++) {
    if (score <= breaks[i]) return { index: i, label: labels[i] };
  }
  return { index: breaks.length - 1, label: labels[breaks.length - 1] };
}

function modifierByBucket(i: number) {
  return ["poor", "improvement", "fair", "good", "excellent"][i] ?? "fair";
}

export default function KpiOverview({
  score,
  totalCandidates,
  percentile,

  labels = Array.from(DEFAULT_LABELS),
  breaks = Array.from(DEFAULT_BREAKS),

  baseColor = "rgba(255, 255, 255, 0.40)",
  fillColor = "rgba(255, 255, 255, 0.80)",
  gap = 2,
  barHeight = 24,
  labelFontSize = 16,
  chartHeight = 108,

  kpiTitleModifierClass,
  tooltipTitle = "모의면접 평균 점수",
  tooltipDesc = "모의면접 평균 점수는 여러분이 면접에 얼마나 잘 대비하고 있는지를 평가하는 지표입니다. 이 지표는 3단계(미흡, 보통, 우수)로 나뉘며, 모의면접 종합 코멘트가 함께 제공됩니다.",
}: Props) {
  const segments = useMemo(() => segmentsFromScore(score, breaks), [score, breaks]);
  const { index: bucketIndex, label: bucketLabel } = useMemo(
    () => bucketOf(score, breaks, labels),
    [score, breaks, labels]
  );

  const modifier = kpiTitleModifierClass ?? modifierByBucket(bucketIndex);

  return (
     
      <div className={`mock-analysis-overview__kpi-title ${modifier}`}>
        <div className="mock-analysis-overview__kpi-head">
          <div className="mock-analysis-overview__kpi-headline">
            <img className="mock-analysis-overview__kpi-icon" src={ic_page_facing_up_24} alt="" />
            모의면접 종합 평가
          </div>
          <Tooltip  
              iconElement={<img src={ic_info_white80_20} alt="" />}
                        title={tooltipTitle}
                        desc={tooltipDesc}
                        position="top"
                        className="mock-analysis-overview__kpi-help"
                      />
          {/* <span className="mock-analysis-overview__kpi-help" role="button" aria-label="도움말">
            <img className="mock-analysis-overview__kpi-help-icon" src={ic_info_white80_20} alt="" />
            <div className="tooltip__content" role="tooltip">
              <span className="tooltip__title">{tooltipTitle}</span>
              <span className="tooltip__desc">{tooltipDesc}</span>
            </div>
          </span> */}
        </div>

        <div className="mock-analysis-overview__kpi-desc">
          {bucketLabel}
          <div className="mock-analysis-overview__kpi-desc-text">
            <div className="mock-analysis-overview__kpi-desc-lead">
              정유리님의 종합 평가 점수는 {score}점이며, 응시자 {totalCandidates}명 중
              <span className="mock-analysis-overview__percent">
                <img className="mock-analysis-overview__percent-icon" src={ic_yellow_flag20} alt="" />
                상위 {percentile}% 에 해당합니다.
              </span>
            </div>
            영상 분석 결과, 정유리님은 자연스럽고 안정적인 목소리로 신뢰감을 주며, 중요한 단어를 잘 살려 말의 흐름이 자연스러웠습니다. 답변의 논리성과 구체성이 다소 부족했으나, 직무에 대한 이해도와 전문성은 높게 평가되었습니다. 전반적으로 직무 적합성과 대인 관계 능력이 돋보이는 면접이었습니다. 전반적으로 직무 적합성과 대인 관계 능력이 돋보이는 면접이었습니다.
          </div>
        </div>

        <div className="mock-analysis-overview__kpi-chart">
          <div className="kpi-chart__gauge">
          <KpiGaugeChart
            segments={segments}
            labels={labels}
            valueLabel={`${score}점`}
            height={chartHeight}

            theme={{
                base: baseColor,       // baseColor 대신 theme.base
                fill: fillColor,       // fillColor 대신 theme.fill
                valueBg: "var(--white-100, #FFF)",
                valueColorMap: {
                    "매우 미흡": "#FF524C",
                    "미흡": "#FF972F",
                    "보통": "#15D078",
                    "우수": "#26A4FF",
                    "최우수": "#816BFE",
                },
                valueColorFallback: "#26A4FF",
            }}

            // Layout props (간격/크기 관련)
            layout={{
                gap: gap,
                barHeight: barHeight,
                labelFontSize: labelFontSize,
                valueFontSize: 16,
                valueFontWeight: 600,
                valuePaddingX: 8,
                valuePaddingY: 4,
                valueOffsetY: 16,
                valueRadius: 100,
                valueTail: true,
                valueTailSize: 6,
            }}
        />
          </div>
        </div>
      </div>

  );
}
