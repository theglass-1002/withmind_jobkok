import React, { useMemo } from "react";
import KpiGaugeChart from "@/pages/InterviewReport/analysis/chart/KpiGaugeChart";
import {
  DEFAULT_BREAKS,
  DEFAULT_LABELS,
  segmentsFromScore,
  bucketOf,
  modifierByBucket,
} from "@/shared/utils/util";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type LevelModifier = "poor" | "improvement" | "fair" | "good" | "excellent";

type LevelGraphProps = {
  score: number;
  description?: string;

  reportDetail?: InterviewReportDetailResponse | null;
  type?: "voice" | "attitude" | "competence" | "tension";

  labels?: readonly string[];
  breaks?: readonly number[];

  baseColor?: string;
  fillColor?: string;
  gap?: number;
  barHeight?: number;
  labelFontSize?: number;
  chartHeight?: number;

  valueLabel?: string;
  valueColorMap?: Record<string, string>;
  valueColorFallback?: string;
  valueTail?: boolean;
  valueTailSize?: number;

  kpiTitleModifierClass?: string;
  className?: string;
};

const DEFAULT_VALUE_COLOR_MAP: Record<string, string> = {
  "매우 미흡": "#FF524C",
  "미흡": "#FF972F",
  "보통": "#15D078",
  "우수": "#26A4FF",
  "최우수": "#816BFE",
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

function getModifierFromGradeText(gradeText?: string): LevelModifier {
  switch (gradeText) {
    case "최우수":
      return "excellent";
    case "우수":
      return "good";
    case "보통":
      return "fair";
    case "미흡":
      return "improvement";
    case "매우 미흡":
      return "poor";
    default:
      return "fair";
  }
}

function getGradeTextFromReport(
  reportDetail?: InterviewReportDetailResponse | null,
  type?: "voice" | "attitude" | "competence" | "tension"
): string | undefined {
  if (!reportDetail || !type) return undefined;
  console.log(type);
  switch (type) {
    case "competence":
      return (
        reportDetail.detailAbility?.abilityTotalScoreText ??
        reportDetail.itemTotalScores?.abilityTotalScoreText
      );

    case "attitude":
      return (
        reportDetail.detailAttitude?.attitudeTotalScoreText ??
        reportDetail.itemTotalScores?.attitudeTotalScoreText
      );

    case "voice":
      return (
        reportDetail.voiceAnalysis?.voiceTotalScoreText ??
        reportDetail.itemTotalScores?.voiceTotalScoreText
      );

    case "tension":
      return reportDetail.itemTotalScores?.tensionTotalScoreText;

    default:
      return undefined;
  }
}

export default function LevelGraph({
  score,
  description,
  reportDetail,
  type,
  labels = DEFAULT_LABELS,
  breaks = DEFAULT_BREAKS,
  baseColor = "rgba(255, 255, 255, 0.40)",
  fillColor = "rgba(255, 255, 255, 0.80)",
  gap = 2,
  barHeight = 24,
  labelFontSize = 14,
  chartHeight = 108,
  valueLabel,
  valueColorMap = DEFAULT_VALUE_COLOR_MAP,
  valueColorFallback = "#26A4FF",
  valueTail = true,
  valueTailSize = 6,
  kpiTitleModifierClass,
  className,
}: LevelGraphProps) {
  const resolvedScore = useMemo(() => {
    if (!reportDetail || !type) return score;

    switch (type) {
      case "voice":
        return (
          reportDetail.voiceAnalysis?.voiceTotalScore ??
          reportDetail.itemTotalScores?.voiceTotalScore ??
          score
        );

      case "attitude":
        return (
          reportDetail.detailAttitude?.attitudeTotalScore ??
          reportDetail.itemTotalScores?.attitudeTotalScore ??
          score
        );

      case "competence":
        return (
          reportDetail.detailAbility?.abilityTotalScore ??
          reportDetail.itemTotalScores?.abilityTotalScore ??
          score
        );

      case "tension":
        return reportDetail.itemTotalScores?.tensionTotalScore ?? score;

      default:
        return score;
    }
  }, [reportDetail, type, score]);

  const resolvedDescription = useMemo(() => {
    if (!reportDetail || !type) return description;

    switch (type) {
      case "voice":
        return (
          reportDetail.voiceAnalysis?.voiceFeedBack ??
          reportDetail.feedback?.voice ??
          description
        );

      case "attitude":
        return (
          reportDetail.detailAttitude?.attitudeFeedBack ??
          reportDetail.feedback?.attitude ??
          description
        );

      case "competence":
        return (
          reportDetail.detailAbility?.abilityFeedBack ??
          reportDetail.feedback?.competency ??
          description
        );

      case "tension":
        return reportDetail.feedback?.tension ?? description;

      default:
        return description;
    }
  }, [reportDetail, type, description]);

  const resolvedGradeText = useMemo(() => {
    return getGradeTextFromReport(reportDetail, type);
  }, [reportDetail, type]);

  const maxBreak = breaks[breaks.length - 1] ?? 100;
  const safeScore = clamp(resolvedScore, 0, maxBreak);

  const segments = useMemo(
    () => segmentsFromScore(safeScore, breaks),
    [safeScore, breaks]
  );

  const { index: bucketIndex, label: bucketLabel } = useMemo(
    () => bucketOf(safeScore, breaks, labels as string[]),
    [safeScore, breaks, labels]
  );

  const modifier = useMemo(() => {
    if (kpiTitleModifierClass) {
      return kpiTitleModifierClass;
    }

    if (resolvedGradeText) {
      return getModifierFromGradeText(resolvedGradeText);
    }

    return modifierByBucket(bucketIndex);
  }, [kpiTitleModifierClass, resolvedGradeText, bucketIndex]);

  return (
    <div className={`detail-analysis__level-graph ${modifier} ${className ?? ""}`}>
      <div className="detail-analysis__level-info">
        <span className="detail-analysis__level-label">
          {resolvedGradeText ?? bucketLabel}
        </span>
        {resolvedDescription && (
          <span className="detail-analysis__level-desc">{resolvedDescription}</span>
        )}
      </div>

      <div className="detail-analysis__level-chart">
        <div className="detail-analysis__chart-gauge">
          <KpiGaugeChart
            segments={segments}
            labels={Array.from(labels)}
            activeLabel={resolvedGradeText ?? bucketLabel}
            valueLabel={valueLabel ?? `${resolvedScore}점`}
            height={chartHeight}
            theme={{
              base: baseColor,
              fill: fillColor,
              valueBg: "var(--white-100, #FFF)",
              valueColorMap,
              valueColorFallback,
            }}
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
              valueTail,
              valueTailSize,
            }}
          />
        </div>
      </div>
    </div>
  );
}