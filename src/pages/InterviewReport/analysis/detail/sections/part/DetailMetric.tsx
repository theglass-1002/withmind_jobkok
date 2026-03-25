// src/shared/components/detail-analysis/DetailMetric.tsx
import { InterviewReportDetailResponse } from "@/api/report/report.types";
import React from "react";

type Grade = "우수" | "보통" | "미흡";

type Props = {
  type?: string;
  gradeLabel?: string;
  gradeIconSrc?: string;
  gradeOptions?: Grade[];
  selectedGrade?: Grade;
  onSelectGrade?: (g: Grade) => void;
  analysisTitle?: string;
  analysisIconSrc?: string;
  analysisText?: React.ReactNode;
  highlight?: React.ReactNode;
  className?: string;
  reportDetail?: InterviewReportDetailResponse | null;
};

function toThreeGrade(value?: string): Grade | undefined {
  switch (value) {
    case "최우수":
    case "우수":
      return "우수";
    case "보통":
      return "보통";
    case "미흡":
    case "매우 미흡":
      return "미흡";
    default:
      return undefined;
  }
}

export default function DetailMetric({
  type = "attitude",
  gradeLabel = "등급",
  gradeIconSrc,
  gradeOptions = ["우수", "보통", "미흡"],
  selectedGrade,
  onSelectGrade,
  analysisTitle = "분석",
  analysisIconSrc,
  analysisText,
  highlight,
  className,
  reportDetail,
}: Props) {
  const gradeClassMap: Record<Grade, string> = {
    우수: "excellent",
    보통: "normal",
    미흡: "poor",
  };

  const resolvedSelectedGrade: Grade | undefined = (() => {
    if (!reportDetail) return selectedGrade;

    switch (type) {
      case "voice":
        return (
          toThreeGrade(reportDetail?.tab2?.voiceAnalysis?.tone?.scoreText) ??
          toThreeGrade(reportDetail?.tab2?.voiceAnalysis?.voiceTotalScoreText) ??
          selectedGrade
        );

      case "speed":
        return (
          toThreeGrade(reportDetail?.tab2?.voiceAnalysis?.speed?.scoreText) ??
          toThreeGrade(reportDetail?.tab2?.voiceAnalysis?.voiceTotalScoreText) ??
          selectedGrade
        );

      case "attitude":
        return (
          toThreeGrade(reportDetail?.tab2?.detailAttitude?.attitudeTotalScoreText) ??
          toThreeGrade(reportDetail?.tab1?.itemTotalScores?.attitudeTotalScoreText) ??
          selectedGrade
        );

      case "competence":
        return (
          toThreeGrade(
            reportDetail?.tab2?.abilityAnalysis?.detailAbility?.abilityTotalScoreText
          ) ??
          toThreeGrade(reportDetail?.tab1?.itemTotalScores?.abilityTotalScoreText) ??
          selectedGrade
        );

      case "tension":
        return (
          toThreeGrade(
            reportDetail?.tab2?.detailAttitude?.tensionData?.tensionGrade
          ) ??
          toThreeGrade(reportDetail?.tab1?.itemTotalScores?.tensionTotalScoreText) ??
          selectedGrade
        );

      case "gesture":
        return (
          toThreeGrade(reportDetail?.tab2?.detailAttitude?.gesture?.gestureGrade) ??
          selectedGrade
        );

      case "gaze":
        return (
          toThreeGrade(reportDetail?.tab2?.detailAttitude?.gaze?.gazeGrade) ??
          selectedGrade
        );

      case "expression":
        return (
          toThreeGrade(reportDetail?.tab2?.detailAttitude?.emotion?.emotionGrade) ??
          selectedGrade
        );

      default:
        return selectedGrade;
    }
  })();

  return (
    <>
      <div className={`detail-analysis__metric-grade ${className ?? ""}`}>
        <span className="detail-analysis__metric-grade-label">
          {gradeIconSrc && <img src={gradeIconSrc} alt="" aria-hidden="true" />}{" "}
          {gradeLabel}
        </span>

        <div
          className="detail-analysis__metric-grade-options"
          role="tablist"
          aria-label={`${gradeLabel} 선택`}
        >
          {gradeOptions.map((g) => {
            const isOn = resolvedSelectedGrade === g;
            const modifier = gradeClassMap[g];
            const itemCls = `detail-analysis__metric-grade-option ${modifier} ${
              isOn ? "on" : ""
            }`;

            return onSelectGrade ? (
              <button
                key={g}
                type="button"
                className={itemCls}
                aria-pressed={isOn}
                onClick={() => onSelectGrade(g)}
              >
                {g}
              </button>
            ) : (
              <span
                key={g}
                className={itemCls}
                aria-current={isOn || undefined}
              >
                {g}
              </span>
            );
          })}
        </div>
      </div>

      <div className={`detail-analysis__metric-analysis ${className ?? ""}`}>
        <span className="detail-analysis__metric-analysis-title">
          {analysisIconSrc && (
            <img src={analysisIconSrc} alt="" aria-hidden="true" />
          )}{" "}
          {analysisTitle}
        </span>

        {analysisText && (
          <span className="detail-analysis__metric-analysis-text">
            {analysisText}{" "}
            {highlight && (
              <span className="detail-analysis__metric-highlight">
                {highlight}
              </span>
            )}
          </span>
        )}
      </div>
    </>
  );
}