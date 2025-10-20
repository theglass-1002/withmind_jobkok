// src/pages/Resume/parts/ResumeSelfIntroSection.tsx
import React from "react";

type ResumeSelfIntroSectionProps = {
  label?: string;     // 기본: "자기소개서"
  text: string;       // 자기소개 본문
  className?: string; // 섹션에 추가 클래스 필요 시
};

export default function ResumeSelfIntroSection({
  label = "자기소개서",
  text,
  className = "",
}: ResumeSelfIntroSectionProps) {
  return (
    <div className={`resume-field resume-field--self-intro ${className}`.trim()}>
      <div className="resume-field__label">{label}</div>
      <span className="resume-field__value resume-self-intro">
        {text}
      </span>
    </div>
  );
}
