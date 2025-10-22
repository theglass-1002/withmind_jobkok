// src/components/JobCardV2.tsx
import React from "react";
import "./JobCardV2.css";
import defaultActive from "@/assets/icons/size24/ic_bookmark_active_purple24.png";
import defaultInactive from "@/assets/icons/size24/ic_blank_bookmark_gray400_24.png";

export type JobCardV2Badge = {
  text: string;
  iconSrc: string;
  urgent?: boolean;
};

export interface JobCardV2Props {
  logoSrc: string;
  company: string;
  sourceLogoSrc: string;
  role: string;

  // 북마크 관련
  isBookmarked?: boolean; // ← 추가: 상위에서 상태 전달
  favoriteIconActiveSrc?: string;   // ← 추가: 활성 아이콘 (기본값 제공)
  favoriteIconInactiveSrc?: string; // ← 추가: 비활성 아이콘 (기본값 제공)
  onClickFavorite?: () => void;     // ← 클릭 핸들러

  matchPercent: number;
  matchIconSrc: string;
  locationMeta: string;
  employmentMeta: string;
  deadline: string;
  badges: JobCardV2Badge[];
  stickerSrc?: string;
}

export default function JobCardV2({
  logoSrc,
  company,
  sourceLogoSrc,
  role,
  isBookmarked = false,
  favoriteIconActiveSrc = defaultActive,
  favoriteIconInactiveSrc = defaultInactive,
  onClickFavorite,
  matchPercent,
  matchIconSrc,
  locationMeta,
  employmentMeta,
  deadline,
  badges,
  stickerSrc,
}: JobCardV2Props) {
  const favoriteIcon = isBookmarked ? favoriteIconActiveSrc : favoriteIconInactiveSrc;

  return (
    <div className="jobcard-v2">
      <div className="jobcard-v2__header">
        <div className="jobcard-v2__left">
          <span className="jobcard-v2__logo">
            <img  src={logoSrc} alt="" />
          </span>
          <div className="jobcard-v2__identity">
            <div className="jobcard-v2__byline">
              <span className="jobcard-v2__company">{company}</span>
              <span className="jobcard-v2__source-logo">
                <img src={sourceLogoSrc} alt="" />
              </span>
            </div>
            <span className="jobcard-v2__role">{role}</span>
          </div>
        </div>

        {/* 북마크 버튼 */}
        <img
          className="book_mark"
          src={favoriteIcon}
          alt=""
          role="button"
          tabIndex={0}
          aria-label="즐겨찾기 토글"
          aria-pressed={isBookmarked}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClickFavorite?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onClickFavorite?.();
            }
          }}
        />
      </div>

      <div className="jobcard-v2__divider" />

      <div className="jobcard-v2__body">
        <div className="jobcard-v2__content">
          <span className="jobcard-v2__match jobcard-v2__match--level">
            <img src={matchIconSrc} alt="" />
            AI 적합도 {matchPercent}%
          </span>

          <div className="jobcard-v2__facts">
            <div className="jobcard-v2__meta-items">
              <span className="jobcard-v2__meta-item">{locationMeta}</span>
              <span className="jobcard-v2__meta-item">{employmentMeta}</span>
            </div>
            <span className="jobcard-v2__deadline">{deadline}</span>
          </div>
        </div>

        <div className="jobcard-v2__badges">
          {badges.map((b, i) => (
            <span
              key={`${b.text}-${i}`}
              className={`jobcard-v2__badge${b.urgent ? " jobcard-v2__badge--urgent" : ""}`}
            >
              <img src={b.iconSrc} alt="" />
              {b.text}
            </span>
          ))}
        </div>
      </div>

      {stickerSrc ? (
        <div className="jobcard-v2__sticker">
          <img src={stickerSrc} alt="" />
        </div>
      ) : null}
    </div>
  );
}
