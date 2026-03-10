// src/pages/Resume/parts/ResumeHardSkillsSection.tsx
import React from "react";

type ResumeHardSkillsSectionProps = {
  label?: string;        // 기본: "하드스킬"
  items: string[];       // 예: ["자바", "피그마"]
  className?: string;    // 필요 시 섹션에 추가 클래스
};

export default function ResumeHardSkillsSection({
  label = "하드스킬",
  items,
  className = "",
}: ResumeHardSkillsSectionProps) {
  return (
    <div className={`resume-field resume-field--hard-skills ${className}`}>
      <span className="resume-field__label">{label}</span>
      {items.length > 0 && (
        <div className="resume-field__value resume-hard-skill-list">
          {items.map((text, idx) => (
            <span
              key={`${text}-${idx}`}
              className="resume-hard-skill-item resume-item-chip"
            >
              {text}
            </span>
          ))}
        </div>
      )}
  
    </div>
  );
}
