// src/shared/components/detail-analysis/DetailMetric.tsx
import { InterviewReportDetailResponse } from "@/api/report/report.types";
import React from "react";

type Grade = string;

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
}: Props) {
  /** 한글 → 영어 modifier 매핑 */
  const gradeClassMap: Record<string, string> = {
    우수: "excellent",
    보통: "normal",
    미흡: "poor",
  };

  return (
    <>
      {/* 등급 영역 */}
      <div className={`detail-analysis__metric-grade ${className ?? ""}`}>
        <span className="detail-analysis__metric-grade-label">
          {gradeIconSrc && <img src={gradeIconSrc} alt="" aria-hidden="true" />} {gradeLabel}
        </span>

        <div
          className="detail-analysis__metric-grade-options"
          role="tablist"
          aria-label={`${gradeLabel} 선택`}
        >
          {gradeOptions.map((g) => {
            const isOn = selectedGrade === g;
            const modifier = gradeClassMap[g] || "unknown";
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
              <span key={g} className={itemCls} aria-current={isOn || undefined}>
                {g}
              </span>
            );
          })}
        </div>
      </div>

      {/* 분석 영역 */}
      <div className={`detail-analysis__metric-analysis ${className ?? ""}`}>
        <span className="detail-analysis__metric-analysis-title">
          {analysisIconSrc && <img src={analysisIconSrc} alt="" aria-hidden="true" />} {analysisTitle}
        </span>

        {analysisText && (
          <span className="detail-analysis__metric-analysis-text">
            {analysisText}{" "}
            {highlight && <span className="detail-analysis__metric-highlight">{highlight}</span>}
          </span>
        )}
      </div>
    </>
  );
}
