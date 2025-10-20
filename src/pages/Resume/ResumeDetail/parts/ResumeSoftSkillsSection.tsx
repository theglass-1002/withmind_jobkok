// src/pages/Resume/parts/ResumeSoftSkillsSection.tsx
import React from "react";

type ResumeSoftSkillsSectionProps = {
  label?: string;      // 기본: "소프트 스킬"
  items: string[];     // 예: ["팀워크", "공감 능력"]
  className?: string;  // 섹션에 추가 클래스가 필요하면 사용
};

export default function ResumeSoftSkillsSection({
  label = "소프트 스킬",
  items,
  className = "",
}: ResumeSoftSkillsSectionProps) {
  return (
    <div className={`resume-field resume-field--soft-skills ${className}`}>
      <span className="resume-field__label">{label}</span>
      <div className="resume-field__value resume-soft-skill-list">
        {items.map((text, idx) => (
          <span
            key={`${text}-${idx}`}
            className="resume-soft-skill-item resume-item-chip"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
