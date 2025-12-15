// src/pages/InterviewReport/my-report/part/CategorySummarySection.tsx
import React from "react";

export type GradeTone = "excellent" | "good" | "fair" | "improvement" | (string & {});

export type EvalItem = {
  label: string;
  gradeText: string;
  gradeTone?: GradeTone;
  description: string;
};

type LeftProps = {
  /** 좌측 상단 점수 타이틀 (ex. 정유리님의 점수) */
  scoreTitle?: string;
  /** 레이더 차트에 들어갈 점수 */
  scores?: {
    attitude?: number;
    voice?: number;
    tension?: number;
    competence?: number;
  };
  /** 외부에서 주입할 레이더 차트 컴포넌트 (예: KpiRadarChart) */
  RadarChartComponent?: React.ComponentType<{
    attitude?: number;
    voice?: number;
    tension?: number;
    competence?: number;
  }>;
};

type RightProps = {
  /** 우측 평가 아이템 목록 */
  items: EvalItem[];
};

type Props = {
  /** 섹션 제목 (ex. 항목별 종합 평가 섹션) */
  title: string;
  /** 제목 아이콘 src (ex. ic_clipboard_24) */
  titleIconSrc?: string;
  /** 좌측 영역 (점수/차트) */
  left: LeftProps;
  /** 우측 영역 (평가 아이템 리스트) */
  right: RightProps;
};

export default function CategorySummarySection({
  title,
  titleIconSrc,
  left,
  right,
}: Props) {
  const { scoreTitle, scores, RadarChartComponent } = left;

  return (
    <div className="analysis-section mock-analysis-overview__category-summary page-break-start">
      <span className="analysis-section__title">
        {titleIconSrc && <img src={titleIconSrc} alt="" />} {title}
      </span>

      <div className="analysis-section__body">
        {/* LEFT: 점수 + 레이더 차트 */}
        <div className="analysis-section__left">
          {scoreTitle && (
            <span className="analysis-score-title">{scoreTitle}</span>
          )}

          {RadarChartComponent && scores ? (
            <RadarChartComponent
              attitude={scores.attitude}
              voice={scores.voice}
              tension={scores.tension}
              competence={scores.competence}
            />
          ) : (
            <div
              className="analysis-section__chart-placeholder"
              aria-label="레이더 차트 자리표시자"
              style={{
                border: "1px dashed #e2e8f0",
                borderRadius: 12,
                padding: 16,
                fontSize: 12,
              }}
            >
              레이더 차트를 주입하거나 이 영역을 대체 UI로 채우세요.
            </div>
          )}
        </div>

        {/* RIGHT: 평가 아이템 목록 */}
        <div className="analysis-section__right">
          {right.items.map((item, idx) => (
            <div className="analysis-eval-item" key={`${item.label}-${idx}`}>
              <div className="analysis-eval-item__header">
                <span className="analysis-eval-item__label">{item.label}</span>
                <span className={`analysis-eval-item__grade ${item.gradeTone ?? ""}`}>
                  {item.gradeText}
                </span>
              </div>
              <p className="analysis-eval-item__description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
