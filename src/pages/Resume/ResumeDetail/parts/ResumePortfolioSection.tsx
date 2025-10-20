// src/pages/Resume/parts/ResumePortfolioSection.tsx
import React from "react";

type PortfolioFileItem = {
  kind: "file";
  name: string;                // 예: "홍길동_포트폴리오.pdf"
  iconSrc?: string;            // 없으면 defaultIcons.file 사용
};

type PortfolioLinkItem = {
  kind: "link";
  url: string;                 // 예: "https://interview.kr"
  displayText?: string;        // 표시 텍스트 커스텀 (없으면 url 그대로)
  iconSrc?: string;            // 없으면 defaultIcons.link 사용
};

export type PortfolioItem = PortfolioFileItem | PortfolioLinkItem;

type ResumePortfolioSectionProps = {
  label?: string;              // 기본: "포트폴리오ㆍ기타 문서"
  items: PortfolioItem[];
  defaultIcons?: { file?: string; link?: string };
  className?: string;          // 섹션에 추가 클래스 필요할 때
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
            return (
              <div
                key={idx}
                className="resume-portfolio-item resume-portfolio-item--file"
              >
                { (it.iconSrc || defaultIcons?.file) && (
                  <img
                    className="resume-portfolio-item__icon"
                    src={it.iconSrc || defaultIcons?.file!}
                    alt=""
                  />
                )}
                <span className="resume-portfolio-item__name">{it.name}</span>
              </div>
            );
          }

          // kind === "link"
          return (
            <div
              key={idx}
              className="resume-portfolio-item resume-portfolio-item--link"
            >
              { (it.iconSrc || defaultIcons?.link) && (
                <img
                  className="resume-portfolio-item__icon"
                  src={it.iconSrc || defaultIcons?.link!}
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
