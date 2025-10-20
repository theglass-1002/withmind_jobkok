// src/pages/Resume/parts/ResumeMockInterviewSection.tsx
import React from "react";

type MockReportItem = {
  title: string;        // 예: "82점ㆍ프론트엔드 개발자ㆍ25.01.01 [...]"
  iconSrc?: string;     // 없으면 defaultIcon 사용
};

type ResumeMockInterviewSectionProps = {
  label?: string;       // 기본: "모의면접 분석 결과"
  items: MockReportItem[];
  defaultIcon?: string; // 아이콘 기본값
  className?: string;   // 섹션 추가 클래스
  lastItem?: boolean;   // 마지막 섹션일 때 true면 .last-item 부여
};

export default function ResumeMockInterviewSection({
  label = "모의면접 분석 결과",
  items,
  defaultIcon,
  className = "",
  lastItem = false,
}: ResumeMockInterviewSectionProps) {
  return (
    <div
      className={[
        "resume-field",
        "resume-field--mock-interview",
        lastItem ? "last-item" : "",
        className,
      ].join(" ").trim()}
    >
      <div className="resume-field__label">{label}</div>

      <div className="resume-mock-report-list resume-career-list">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="resume-mock-report-item resume-career-item resume-mock-report-item--file"
          >
            {(it.iconSrc || defaultIcon) && (
              <img
                className="resume-mock-report-item__icon"
                src={it.iconSrc || defaultIcon!}
                alt=""
              />
            )}
            <span className="resume-mock-report-item__title">{it.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
