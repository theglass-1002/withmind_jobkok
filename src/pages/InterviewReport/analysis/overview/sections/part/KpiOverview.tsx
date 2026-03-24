import React, { useMemo } from "react";
import KpiGaugeChart from "@/pages/InterviewReport/analysis/chart/KpiGaugeChart";

import ic_page_facing_up_24 from "@/assets/icons/size24/ic_page-facing-up_24.png";
import ic_info_white80_20 from "@/assets/icons/size20/ic_info_white80_20.png";
import ic_yellow_flag20 from "@/assets/icons/size20/ic_yellow_flag20.png";
import Tooltip from "@/shared/components/tooltip/Tooltip";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  score: number;
  totalCandidates: number;
  percentile: number;

  labels?: string[];
  breaks?: number[];

  baseColor?: string;
  fillColor?: string;
  gap?: number;
  barHeight?: number;
  labelFontSize?: number;
  chartHeight?: number;

  kpiTitleModifierClass?: string;
  tooltipTitle?: string;
  tooltipDesc?: string;
  reportDetail: InterviewReportDetailResponse | null;
};

const DEFAULT_BREAKS = [20, 40, 60, 80, 100] as const;
const DEFAULT_LABELS = ["매우 미흡", "미흡", "보통", "우수", "최우수"] as const;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function segmentsFromScore(
  score: number,
  breaks = DEFAULT_BREAKS as readonly number[]
) {
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

function getBucketIndexFromScore(
  score: number,
  breaks = DEFAULT_BREAKS as readonly number[]
) {
  for (let i = 0; i < breaks.length; i++) {
    if (score <= breaks[i]) return i;
  }
  return breaks.length - 1;
}

function getIndexFromLabel(label: string, labels: string[]) {
  return labels.findIndex((item) => item === label);
}

function modifierByBucket(i: number) {
  return ["poor", "improvement", "fair", "good", "excellent"][i] ?? "fair";
}

export default function KpiOverview({
  score,
  totalCandidates,
  percentile,
  reportDetail,

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
  const segments = useMemo(
    () => segmentsFromScore(score, breaks),
    [score, breaks]
  );

  const myScoreText =
    reportDetail?.overallScore?.myScoreText ?? DEFAULT_LABELS[getBucketIndexFromScore(score, breaks)];

  const overallFeedback = reportDetail?.feedback?.overall ?? "";

  const modifierIndex = useMemo(() => {
    const serverIndex = getIndexFromLabel(myScoreText, labels);
    if (serverIndex >= 0) return serverIndex;
    return getBucketIndexFromScore(score, breaks);
  }, [myScoreText, labels, score, breaks]);

  const modifier = kpiTitleModifierClass ?? modifierByBucket(modifierIndex);

  return (
    <div className={`mock-analysis-overview__kpi-title ${modifier}`}>
      <div className="mock-analysis-overview__kpi-head">
        <div className="mock-analysis-overview__kpi-headline">
          <img
            className="mock-analysis-overview__kpi-icon"
            src={ic_page_facing_up_24}
            alt=""
          />
          모의면접 종합 평가
        </div>

        <Tooltip
          iconElement={<img src={ic_info_white80_20} alt="" />}
          title={tooltipTitle}
          desc={tooltipDesc}
          position="top"
          className="mock-analysis-overview__kpi-help"
        />
      </div>

      <div className="mock-analysis-overview__kpi-desc">
        {myScoreText}

        <div className="mock-analysis-overview__kpi-desc-text">
          <div className="mock-analysis-overview__kpi-desc-lead">
            정유리님의 종합 평가 점수는 {score}점이며, 응시자 {totalCandidates}명 중
            <span className="mock-analysis-overview__percent">
              <img
                className="mock-analysis-overview__percent-icon"
                src={ic_yellow_flag20}
                alt=""
              />
              상위 {percentile}% 에 해당합니다.
            </span>
          </div>

          <div className="mock-analysis-overview__kpi-desc-body">
            {overallFeedback}
          </div>
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
              base: baseColor,
              fill: fillColor,
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
            activeLabel={myScoreText}
            layout={{
              gap,
              barHeight,
              labelFontSize,
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