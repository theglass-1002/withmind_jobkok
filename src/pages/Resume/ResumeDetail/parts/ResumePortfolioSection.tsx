// src/pages/Resume/parts/ResumePortfolioSection.tsx
import { PortfolioItem } from "@/api/resume/resume.types";
import React from "react";

type ResumePortfolioSectionProps = {
  label?: string; // 기본: "포트폴리오ㆍ기타 문서"
  items: PortfolioItem[];
  defaultIcons?: { file?: string; link?: string };
  className?: string; // 섹션에 추가 클래스 필요할 때
};

export default function ResumePortfolioSection({
  label = "포트폴리오ㆍ기타 문서",
  items,
  defaultIcons,
  className = "",
}: ResumePortfolioSectionProps) {
  return (
    <div className={`resume-field resume-field--portfolio ${className}`.trim()}>
      <div className="resume-field__label">{label}</div>
      <div className="resume-portfolio-list resume-career-list">
        {items.map((it, idx) => {
          if (it.kind === "file") {
            const iconSrc = it.iconSrc ?? defaultIcons?.file;

            return (
              <div
                key={idx}
                className="resume-portfolio-item resume-portfolio-item--file"
              >
                {iconSrc && (
                  <img
                    className="resume-portfolio-item__icon"
                    src={iconSrc}
                    alt=""
                  />
                )}

                {it.filePath ? (
                  <a
                    href={it.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    download // ✅ 다운로드 시도
                  >
                  <span className="resume-portfolio-item__name">{it.name}</span>
                  </a>
                ) : (
                  <span className="resume-portfolio-item__name">{it.name}</span>
                )}
              </div>
            );
            // return (
            //   <div
            //     key={idx}
            //     className="resume-portfolio-item resume-portfolio-item--file"
            //   >
            //     {iconSrc && (
            //       <img
            //         className="resume-portfolio-item__icon"
            //         src={iconSrc}
            //         alt=""
            //       />
            //     )}
            //     <span className="resume-portfolio-item__name">{it.name}</span>
            //   </div>
            // );
          }

          // kind === "link"
          const iconSrc = it.iconSrc ?? defaultIcons?.link;

          return (
            <div
              key={idx}
              className="resume-portfolio-item resume-portfolio-item--link"
            >
              {iconSrc && (
                <img
                  className="resume-portfolio-item__icon"
                  src={iconSrc}
                  alt=""
                />
              )}
              <span className="resume-portfolio-item__url">
                {it.displayText ?? it.url}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
