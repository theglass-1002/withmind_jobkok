// src/pages/Resume/parts/ResumeEducationSection.tsx
import { formatMonthStringToDisplay } from "@/shared/utils/util";
import React from "react";

type EducationItem = {
  school: string; // 예: "위드대학교"
  start: string;  // 예: "2010.03"
  end: string;    // 예: "2015.03"
  major: string;  // 예: "컴퓨터공학과"
  status: string; // 예: "졸업" | "재학" | "수료"
};

type ResumeEducationSectionProps = {
  label?: string;      // 기본: "학력"
  items: EducationItem[];
};

export default function ResumeEducationSection({
  label = "학력",
  items,
}: ResumeEducationSectionProps) {
  return (
    <div className="resume-field resume-field--education">
      <span className="resume-field__label">{label}</span>

      {items.map((edu, idx) => (
        <div
          className="resume-field__value resume-education"
          key={`${edu.school}-${edu.start}-${idx}`}
        >
          <span className="resume-education__school">{edu.school}</span>

          <div className="resume-education__meta">
            <div className="resume-education__period">
              <span className="resume-education__period-start">
                {formatMonthStringToDisplay(edu.start)}
              </span>
              <span className="resume-education__period-sep">~</span>
              <span className="resume-education__period-end">
              {formatMonthStringToDisplay(edu.end)}
              </span>
            </div>

            <span className="resume-education__major">{edu.major}</span>
            <span className="resume-education__status">{edu.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
