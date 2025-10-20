// src/pages/Resume/parts/ResumeDesiredRoleSection.tsx
import React from "react";

type ResumeDesiredRoleSectionProps = {
  label?: string;      // 기본: "희망 직무"
  items: string[];     // 예: ["자바 개발자", "웹 개발자", "프론트엔드 개발자"]
};

export default function ResumeDesiredRoleSection({
  label = "희망 직무",
  items,
}: ResumeDesiredRoleSectionProps) {
  return (
    <div className="resume-field resume-field--desired-role">
      <span className="resume-field__label">{label}</span>
      <div className="resume-field__value resume-desired-role-list">
        {items.map((text, idx) => (
          <span className="resume-item-chip" key={`${text}-${idx}`}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
