// src/pages/Resume/parts/ResumePortfolioSection.tsx
import { PortfolioItem } from "@/api/resume/resume.types";
import React from "react";

type ResumePortfolioSectionProps = {
  label?: string;
  items: PortfolioItem[];
  defaultIcons?: { file?: string; link?: string };
  className?: string;
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

      {items.length > 0 && (
        <div className="resume-portfolio-list resume-career-list">
          {items.map((it, idx) => {
            const rawKind =
              "kind" in it && typeof it.kind === "string" ? it.kind : "";
            const rawItemType =
              "itemType" in it && typeof it.itemType === "string"
                ? it.itemType
                : "";

            const normalizedType = (rawItemType || rawKind).trim().toUpperCase();

            const isFile =
              normalizedType === "FILE" || rawKind.trim().toLowerCase() === "file";

            const isLink =
              normalizedType === "LINK" || rawKind.trim().toLowerCase() === "link";

            if (isFile) {
              const iconSrc =
                "iconSrc" in it && typeof it.iconSrc === "string"
                  ? it.iconSrc
                  : defaultIcons?.file;

              const fileName =
                ("name" in it && typeof it.name === "string" && it.name) ||
                ("title" in it && typeof it.title === "string" && it.title) ||
                "-";

              const filePath =
                ("filePath" in it && typeof it.filePath === "string" && it.filePath) ||
                "";

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

                  {filePath ? (
                    <a
                      href={filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <span className="resume-portfolio-item__name">
                        {fileName}
                      </span>
                    </a>
                  ) : (
                    <span className="resume-portfolio-item__name">
                      {fileName}
                    </span>
                  )}
                </div>
              );
            }

            if (isLink) {
              const iconSrc =
                "iconSrc" in it && typeof it.iconSrc === "string"
                  ? it.iconSrc
                  : defaultIcons?.link;

              const url =
                ("url" in it && typeof it.url === "string" && it.url) ||
                ("filePath" in it && typeof it.filePath === "string" && it.filePath) ||
                "";

              const displayText =
                ("displayText" in it &&
                  typeof it.displayText === "string" &&
                  it.displayText) ||
                ("title" in it && typeof it.title === "string" && it.title) ||
                url ||
                "-";

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

                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resume-portfolio-item__url"
                    >
                      {displayText}
                    </a>
                  ) : (
                    <span className="resume-portfolio-item__url">
                      {displayText}
                    </span>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
}