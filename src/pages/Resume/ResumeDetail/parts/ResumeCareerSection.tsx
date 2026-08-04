import { CareerItem } from "@/api/resume/resume.types";
import { formatMonthStringToDisplay } from "@/shared/utils/util";
import React from "react";


type ResumeCareerSectionProps = {
  totalLabel: string;  // "(총 0년 0개월)" 등
  items: CareerItem[];
};

export default function ResumeCareerSection({
  totalLabel,
  items,
}: ResumeCareerSectionProps) {
  // 유효한 경력만 필터링 (start가 있어야 유효한 경력)
  const validItems = items.filter(it => it.start && it.start.trim() !== '');

  // 유효한 경력이 없으면 아예 렌더링 안함
  if (validItems.length === 0) {
    return null;
  }

  return (
    <div className="resume-field resume-field--career">
      <div className="resume-field__label">
        경력 <span className="resume-field__label-meta">{totalLabel}</span>
      </div>
      <div className="resume-career-list">
        {validItems.map((it, idx) => (
          <div className="resume-career-item" key={idx}>
            <div className="resume-career-item__header">
              <span className="resume-career-item__company">{it.company}</span>

              <div className="resume-career-item__meta">
                <span className="resume-career-item__period resume-career-item__period--stack">
                  <div className="resume-career-item__period-range">
                    <span className="resume-career-item__period-start">
             
                      {formatMonthStringToDisplay(it.start)}
                    </span>
                    <span className="resume-career-item__period-sep"> ~ </span>
                    <span
                      className={
                        "resume-career-item__period-end" +
                        (it.isCurrent ? " current" : "")
                      }
                    >
                      {formatMonthStringToDisplay(it.end)}
               
                    </span>
                  </div>
                  <span className="resume-career-item__tenure">
                    {it.tenure}
                  </span>
                </span>

        

                <div className="resume-career-item__meta">
                  {it.employment && (
                    <span className="resume-career-item__employment">
                      {it.employment}
                    </span>
                  )}
                  {it.role && (
                    <span className="resume-career-item__role">{it.role}</span>
                  )}
                  {it.level && (
                    <span className="resume-career-item__level">
                      {it.level}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <ul className="resume-career-item__bullets">
              {it.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
