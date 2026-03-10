// src/pages/Resume/parts/ResumeSoftSkillsSection.tsx
import React from "react";

type ResumeSoftSkillsSectionProps = {
  label?: string;
  items?: string[];
  className?: string;
};

export default function ResumeSoftSkillsSection({
  label = "소프트 스킬",
  items = [],
  className = "",
}: ResumeSoftSkillsSectionProps) {
  return (
    <div className={`resume-field resume-field--soft-skills ${className}`}>
      <span className="resume-field__label">{label}</span>

      {items.length > 0 && (
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
      )}
    </div>
  );
}