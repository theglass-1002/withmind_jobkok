// src/pages/InterviewReport/analysis/components/MockAnalysisKpiFit.tsx
import React, { useMemo } from "react";
import KpiFitBar from "@/pages/InterviewReport/analysis/chart/KpiFitBar";

type Props = {
  /** 0~100 */
  value: number;
  /** 카드 상단 타이틀 (기본: 직무 적합도) */
  title?: string;
  /** 역할/직군 라벨 (예: "개발 직군ㆍ프론트엔드 개발") */
  roleLabel?: string;
  /** 본문 설명 */
  description?: string;
  /** 하단 참고 노트 */
  note?: string;
  /** 상단 아이콘 src */
  headIconSrc?: string;
  /** 노트 아이콘 src */
  noteIconSrc?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function MockAnalysisKpiFit({
  value,
  title = "직무 적합도",
  roleLabel = "개발 직군ㆍ프론트엔드 개발",
  description = "",
  note = "직무 적합도는 모의면접 응답과 이력서 기반 분석을 종합해 산출된 참고 지표입니다.",
  headIconSrc,
  noteIconSrc,
  className,
  style,
}: Props) {
  const v = Math.max(0, Math.min(100, value));
  const percentText = useMemo(() => `${v}%`, [v]);
  const scoreText = useMemo(() => `${v} / 100%`, [v]);

  return (
    <div className={`mock-analysis-overview__kpi-fit${className ? ` ${className}` : ""}`} style={style}>
      <div className="kpi-fit__head">
        {headIconSrc && <img className="kpi-fit__head-icon" src={headIconSrc} alt="" />}
        <div className="kpi-fit__head-title">{title}</div>
      </div>

      <div className="kpi-fit__content">
        <div className="kpi-fit__meter">
          <div className="kpi-fit__percent">{percentText}</div>
          <div className="kpi-fit__bar">
            <KpiFitBar value={v} />
          </div>
          <div className="kpi-fit__meta">
            <span className="kpi-fit__role">{roleLabel}</span>
            <span className="kpi-fit__score">{scoreText}</span>
          </div>
        </div>

        {description && <span className="kpi-fit__desc">{description}</span>}
      </div>

      {(note || noteIconSrc) && (
        <div className="kpi-fit__note">
          {noteIconSrc && <img src={noteIconSrc} alt="" />}
          {note}
        </div>
      )}
    </div>
  );
}
