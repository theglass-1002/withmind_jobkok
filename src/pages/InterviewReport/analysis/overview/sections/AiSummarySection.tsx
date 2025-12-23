import { InterviewReportResponse } from "@/api/report/report.types";
import { Icons } from "@/assets/icons";
import React from "react";

type TagItem = string;

type StrengthProps = {
  iconSrc: string;
  label: string; // 강점
  tags: TagItem[];
  description: string;
};

type WeaknessProps = {
  iconSrc: string;
  label: string; // 약점
  tags: TagItem[];
  description: string;
};

type Props = {
  /** 섹션 제목 */
  title?: string;
  /** 타이틀 아이콘 */
  titleIconSrc?: string;
  /** 좌측 강점 정보 */
  strength?: StrengthProps;
  /** 우측 약점 정보 */
  weakness?: WeaknessProps;
  report: InterviewReportResponse | null;
};

export default function AiSummarySection({
  title,
  titleIconSrc,
  strength,
  weakness,
  report
}: Props) {
  console.log(report);
  const powerKeywords = report?.powerKeywords;

  return (
    <div className="analysis-section mock-analysis-overview__ai-summary">
      <span className="analysis-section__title">
        {titleIconSrc && <img className="ai-summary-icon" src={titleIconSrc} alt="" />}
        {title}
      </span>

      <div className="analysis-section__body">
        <div className="analysis-section__left">
          <div className="analysis-strength__head">
            <div className="analysis-strength__label">
            <img src={Icons.ic_strength_circle_24} alt="" />
             강점
            </div>
            <div className="analysis-strength__tags">
              {strength.tags.map((tag, i) => (
                <span key={i} className="analysis-tag analysis-tag--strength">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="analysis-strength__description">
            {strength.description}
          </div>
        </div>

        {/* RIGHT: 약점 */}
        <div className="analysis-section__right">
          <div className="analysis-weakness__head">
            <div className="analysis-weakness__label">
             <img src={Icons.ic_weakness_circle_24} alt="" />
              약점
              </div>
            <div className="analysis-weakness__tags">
              {weakness.tags.map((tag, i) => (
                <span key={i} className="analysis-tag analysis-tag--weakness">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="analysis-weakness__description">
            {weakness.description}
          </div>
        </div>
      </div>
    </div>
  );
}
