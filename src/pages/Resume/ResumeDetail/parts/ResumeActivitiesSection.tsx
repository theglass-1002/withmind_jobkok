// src/pages/Resume/parts/ResumeActivitiesSection.tsx
import React from "react";

type ActivityItem = {
  title: string;       
  start: string;       
  end?: string;         
  bullets?: string[];   
};

type ResumeActivitiesSectionProps = {
  label?: string;      
  items: ActivityItem[];
  className?: string;   
};

export default function ResumeActivitiesSection({
  label = "활동ㆍ경험",
  items,
  className = "",
}: ResumeActivitiesSectionProps) {
  return (
    <div className={`resume-field resume-field--activities ${className}`.trim()}>
      <div className="resume-field__label">{label}</div>

      <div className="resume-activity-list resume-career-list">
        {items.map((it, idx) => (
          <div className="resume-activity-item resume-career-item" key={idx}>
            <div className="resume-activity-item__header resume-career-item__header">
              <span className="resume-activity-item__title resume-career-item__company">
                {it.title}
              </span>

              <div className="resume-activity-item__meta resume-career-item__meta">
                <span className="resume-activity-item__period resume-career-item__period resume-career-item__period--stack">
                  <div className="resume-activity-item__period-range resume-career-item__period-range">
                    <span className="resume-activity-item__period-start resume-career-item__period-start">
                      {it.start}
                    </span>
                    {it.end && (
                      <>
                        <span className="resume-activity-item__period-sep resume-career-item__period-sep">
                          {" "}
                          ~{" "}
                        </span>
                        <span className="resume-activity-item__period-end resume-career-item__period-end">
                          {it.end}
                        </span>
                      </>
                    )}
                  </div>
                </span>
              </div>
            </div>

            {it.bullets && it.bullets.length > 0 && (
              <ul className="resume-activity-item__bullets resume-career-item__bullets">
                {it.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
