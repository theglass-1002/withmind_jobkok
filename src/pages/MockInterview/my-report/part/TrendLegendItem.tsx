import React from "react";
import ic_star_yellow_20 from "@/assets/icons/size20/ic_star_yellow_20.png";
import ic_star_gray300_20 from "@/assets/icons/size20/ic_star_gray300_20.png";

type Variant = "competency" | "attitude" | "voice" | "stress";

export interface TrendLegendItemProps {
  /** 색 점(dot)과 아이템 색상 스킴을 결정 */
  variant: Variant;
  /** 제목 (예: 역량 분석) */
  name: string;
  /** 설명 본문 */
  description: string;
  /** 별점 수(0~maxStars) */
  rating: number;
  /** “상/중/하” 등 텍스트 (지정 없으면 rating으로 추론) */
  ratingText?: string;
  /** 별 개수(기본 3개) */
  maxStars?: number;
  /** 커스텀 아이콘을 쓰고 싶을 때 덮어쓰기 */
  starFilledSrc?: string;
  starEmptySrc?: string;
}

/** 레전드 한 항목 (클래스/마크업은 기존 구조 그대로 유지) */
export default function TrendLegendItem({
  variant,
  name,
  description,
  rating,
  ratingText,
  maxStars = 3,
  starFilledSrc = ic_star_yellow_20,
  starEmptySrc = ic_star_gray300_20,
}: TrendLegendItemProps) {
  const safeRating = Math.max(0, Math.min(rating, maxStars));
  const label =
    ratingText ??
    (maxStars === 3
      ? ["하", "중하", "중", "상"][safeRating] ?? "중"
      : `${safeRating}/${maxStars}`);

  return (
    <div className={`mock-trend__legend-item mock-trend__legend-item--${variant}`}>
      <span className={`mock-trend__name ${variant}`}>{name}</span>
      {description}
      <div className="mock-trend__rating">
        <div className="mock-trend__rating-icon">
          {Array.from({ length: maxStars }).map((_, i) => (
            <img
              key={i}
              src={i < safeRating ? starFilledSrc : starEmptySrc}
              alt=""
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="mock-trend__rating-text">{label}</div>
      </div>
    </div>
  );
}
