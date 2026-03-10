// src/pages/Resume/parts/ResumeAwardsSection.tsx
import React from "react";

type AwardItem = {
  title: string;    // 예: "[자격증] 정보처리기사"
  start: string;    // 예: "2017.09"
  end?: string;     // 기간이 있을 때만(없으면 단일 날짜)
  issuer?: string;  // 예: "한국산업인력공단"
};

type ResumeAwardsSectionProps = {
  label?: string;     // 기본: "수상ㆍ자격증"
  items: AwardItem[];
  className?: string; // 섹션 추가 클래스 필요 시
};

export default function ResumeAwardsSection({
  label = "수상ㆍ자격증",
  items,
  className = "",
}: ResumeAwardsSectionProps) {
  return (
    <div className={`resume-field resume-field--awards ${className}`.trim()}>
      <div className="resume-field__label">{label}</div>
      {items.length>0&&(
      <div className="resume-award-list resume-career-list">
        {items.map((it, idx) => (
         
          <div className="resume-award-item resume-career-item" key={idx}>
            <div className="resume-award-item__header resume-career-item__header">
              <span className="resume-award-item__title resume-career-item__company">
                {it.title}
              </span>

              <div className="resume-award-item__meta resume-career-item__meta">
                <span className="resume-award-item__period resume-career-item__period resume-career-item__period--stack">
                  <div className="resume-award-item__period-range resume-career-item__period-range">
                    <span className="resume-award-item__period-start resume-career-item__period-start">
                      {it.start}
                    </span>
                    {it.end && (
                      <>
                        <span className="resume-award-item__period-sep resume-career-item__period-sep">
                          {" "}
                          ~{" "}
                        </span>
                        <span className="resume-award-item__period-end resume-career-item__period-end">
                          {it.end}
                        </span>
                      </>
                    )}
                  </div>
                </span>
                {it.issuer && (
                  <span className="resume-award-item__issuer">{it.issuer}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
        )}
    </div>
  );
}
