// src/pages/Resume/parts/ResumeEducationSection.tsx
import React from "react";

type ResumeEducationSectionProps = {
  label?: string;          // 기본: "학력"
  school: string;          // 예: "위드대학교"
  start: string;           // 예: "2010.03"
  end: string;             // 예: "2015.03"
  major: string;           // 예: "컴퓨터공학과"
  status: string;          // 예: "졸업" | "재학" | "수료"
};

export default function ResumeEducationSection({
  label = "학력",
  school,
  start,
  end,
  major,
  status,
}: ResumeEducationSectionProps) {
  return (
    <div className="resume-field resume-field--education">
      <span className="resume-field__label">{label}</span>

      {/* NOTE: 네가 주신 구조 그대로 value에 resume-education 클래스 동시 부여 */}
      <div className="resume-field__value resume-education">
        <span className="resume-education__school">{school}</span>

        <div className="resume-education__meta">
          <div className="resume-education__period">
            <span className="resume-education__period-start">{start}</span>
            <span className="resume-education__period-sep">~</span>
            <span className="resume-education__period-end">{end}</span>
          </div>

          <span className="resume-education__major">{major}</span>
          <span className="resume-education__status">{status}</span>
        </div>
      </div>
    </div>
  );
}
