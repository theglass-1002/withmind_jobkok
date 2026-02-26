// src/pages/Resume/ResumeAISuggest.tsx
import React from "react";

import { Icons } from "@/assets/icons";
import AiSuggestChips from "@/shared/components/ai/AiSuggestChips"; // 🔥 칩 컴포넌트 import

type Props = {
  show?: boolean;
  items?: string[];
  onClickSuggest?: () => void;
  onClose?: () => void;
  onPick?: (text: string) => void;
  starIconGray?: string;
  starIconGreen?: string;
  closeIcon?: string;
  hintText?: string;
  triggerLabel?: string;
  suggestResultTitle?:string;
  wrapperClassName?: string;
  variant?: "text" | "chips";
};

export default function AISuggestArea({
  show = false,
  items = [],
  onClickSuggest = () => {},
  onClose = () => {},
  onPick = () => {},
  wrapperClassName = "",
  starIconGray = Icons.ic_star_gray700_20,
  starIconGreen = Icons.ic_star_green_20,
  closeIcon = Icons.ic_close_gray500_20,
  suggestResultTitle ="AI 추천 결과",
  hintText = "더 적합한 문장 추천을 위해 아래 항목들을 먼저 채워주세요.",
  triggerLabel = "AI 문장 추천",
  variant = "text",
}: Props) {
  return (
    <>
      {/* 안내 + 트리거 버튼 */}
      <span
        className={`${wrapperClassName} resume-create-page__assist ${
          show ? "is-hidden" : ""
        }`}
      >
        <span className="resume-create-page__assist-text">
          {starIconGray && <img className="assist_icon" src={starIconGray} alt="star gray" />}
          {hintText}
        </span>

        <span
          className="ai-suggest-btn career-section__summary-ai-btn"
          role="button"
          tabIndex={0}
          onClick={onClickSuggest}
        >
          {triggerLabel}
        </span>
      </span>

      {/* 추천 결과 영역 */}
      {show && (
        <div className={`${wrapperClassName} resume-ai-suggest`}>
          <div className="resume-ai-suggest__header">
            <div className="resume-ai-suggest__title">
              {starIconGreen && <img className="star_green" src={starIconGreen} alt="star green" />}
            {suggestResultTitle}
            </div>

            {closeIcon && (
              <img
                className="resume-ai-suggest__close"
                src={closeIcon}
                alt="close"
                role="button"
                onClick={onClose}
              />
            )}
          </div>

          {variant === "chips" ? (
            <div className="resume-ai-suggest__list">
              <AiSuggestChips
                className={wrapperClassName}
                title="경력 및 학력 기반의 AI 추천 직무입니다."
                tags={items}
                onTagClick={(tag) => onPick(tag)}
              />
            </div>
          ) : (
            <div className="resume-ai-suggest__list">
              {items.map((t, i) => (
                <span
                  key={`${i}-${t.slice(0, 8)}`}
                  className="resume-ai-suggest__item"
                  onClick={() => onPick(t)}
                  role="button"
                  tabIndex={0}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
