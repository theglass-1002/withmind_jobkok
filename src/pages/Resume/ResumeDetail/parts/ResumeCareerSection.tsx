// src/pages/Resume/ResumeCareerSection.tsx
import React from "react";

type CareerItem = {
  company: string;
  start: string;       // 예: "2020.04"
  end: string;         // 예: "재직중" or "2024.08"
  isCurrent?: boolean; // true면 .current 클래스 추가
  tenure: string;      // 예: "(0년 0개월)"
  employment?: string; // 예: "정규직"
  role?: string;       // 예: "프론트엔드 개발자"
  level?: string;      // 예: "매니저"
  bullets: string[];   // 예: ["• ...", "• ..."]
};

type ResumeCareerSectionProps = {
  totalLabel: string;  // "(총 0년 0개월)" 등
  items: CareerItem[];
};

export default function ResumeCareerSection({ totalLabel, items }: ResumeCareerSectionProps) {
  return (
    <div className="resume-field resume-field--career">
      <div className="resume-field__label">
        경력 <span className="resume-field__label-meta">{totalLabel}</span>
      </div>

      <div className="resume-career-list">
        {items.map((it, idx) => (
          <div className="resume-career-item" key={idx}>
            <div className="resume-career-item__header">
              <span className="resume-career-item__company">{it.company}</span>

              <div className="resume-career-item__meta">
                <span className="resume-career-item__period resume-career-item__period--stack">
                  <div className="resume-career-item__period-range">
                    <span className="resume-career-item__period-start">{it.start}</span>
                    <span className="resume-career-item__period-sep"> ~ </span>
                    <span
                      className={
                        "resume-career-item__period-end" + (it.isCurrent ? " current" : "")
                      }
                    >
                      {it.end}
                    </span>
                  </div>
                  <span className="resume-career-item__tenure">{it.tenure}</span>
                </span>
                <div className="resume-career-item__period--stack">
                  </div>  
                  <div className="resume-career-item__meta">
                      {it.employment && (
                      <span className="resume-career-item__employment">{it.employment}</span>
                    )}
                    {it.role && <span className="resume-career-item__role">{it.role}</span>}
                    {it.level && <span className="resume-career-item__level">{it.level}</span>}
              
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


  