// src/pages/InterviewReport/analysis/components/MockAnalysisKpiFit.tsx
import React, { useMemo } from "react";
import KpiFitBar from "@/pages/InterviewReport/analysis/chart/KpiFitBar";
import { InterviewReportDetailResponse } from "@/api/report/report.types";
import { Icons } from "@/assets/icons";

type Props = {
  /** API 전체 응답 */
  reportDetail?: InterviewReportDetailResponse | null;

  /** 아래는 모두 선택값 (override용) */
  value?: number;
  title?: string;
  roleLabel?: string;
  description?: string;
  note?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function MockAnalysisKpiFit({
  reportDetail,

  value,
  title = "직무 적합도",
  roleLabel,
  description,
  note = "직무 적합도는 모의면접 응답과 이력서 기반 분석을 종합해 산출된 참고 지표입니다.",
  className,
  style,
}: Props) {
  /**  서버값 fallback */
  const resolvedValue =
    value ?? reportDetail?.tab1?.jobFitInfo?.jobFitScore ?? 0;

  const resolvedRoleLabel =
    roleLabel ??
    reportDetail?.tab1?.jobFitInfo?.jobFitText ??
    "직군";

  const resolvedDescription =
    description ??
    reportDetail?.tab1?.jobFitInfo?.jobFitFeedback ??
    "직무 적합도 분석 결과가 없습니다.";

  const v = Math.max(0, Math.min(100, resolvedValue));

  const percentText = useMemo(() => `${v}%`, [v]);
  const scoreText = useMemo(() => `${v} / 100%`, [v]);

  return (
    <div
      className={`mock-analysis-overview__kpi-fit${
        className ? ` ${className}` : ""
      }`}
      style={style}
    >
      <div className="kpi-fit__head">
        <img className="kpi-fit__head-icon" src={Icons.ic_magnifier_24} alt="" />
        <div className="kpi-fit__head-title">{title}</div>
      </div>

      <div className="kpi-fit__content">
        <div className="kpi-fit__meter">
          <div className="kpi-fit__percent">{percentText}</div>

          <div className="kpi-fit__bar">
            <KpiFitBar value={v} />
          </div>

          <div className="kpi-fit__meta">
            <span className="kpi-fit__role">{resolvedRoleLabel}</span>
            <span className="kpi-fit__score">{scoreText}</span>
          </div>
        </div>

        {resolvedDescription && (
          <span className="kpi-fit__desc">{resolvedDescription}</span>
        )}
      </div>

      <div className="kpi-fit__note">
             <img src={Icons.ic_error_gray500_20} alt="" />
          {note}
        </div>
    </div>
  );
}