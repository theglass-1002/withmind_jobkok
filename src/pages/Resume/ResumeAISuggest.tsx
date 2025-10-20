// src/pages/Resume/ResumeAISuggest.tsx
import React from "react";

type Props = {
  show: boolean;
  items: string[];
  onOpen: () => void;
  onClose: () => void;
  onPick: (text: string) => void;
  starIconGray?: string;
  starIconGreen?: string;
  closeIcon?: string;
  hintText?: string;
  triggerLabel?: string;
};

export default function AISuggestArea({
  show,
  items,
  onOpen,
  onClose,
  onPick,
  starIconGray,
  starIconGreen,
  closeIcon,
  hintText = "더 적합한 문장을 추천을 위해 아래 항목들을 먼저 채워주세요.",
  triggerLabel = "AI 문장 추천",
}: Props) {
  return (
    <>
      <span className={`resume-edit-page__assist resume-create-page__assist ${show ? "is-hidden" : ""}`}>
        <span className="resume-edit-page__assist-text resume-create-page__assist-text">
          {starIconGray && <img src={starIconGray} alt="" />}
          {hintText}
        </span>
        <span
          className="ai-suggest-btn career-section__summary-ai-btn"
          role="button"
          tabIndex={0}
          onClick={onOpen}
        >
          {triggerLabel}
        </span>
      </span>

      {show && (
        <div className="resume-ai-suggest">
          <div className="resume-ai-suggest__header">
            <div className="resume-ai-suggest__title">
              {starIconGreen && <img src={starIconGreen} alt="" />}
              AI 추천 결과
            </div>
            {closeIcon && <img 
               className="resume-ai-suggest__close"
               onClick={onClose}
            src={closeIcon} alt="" />}
        
          </div>

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
        </div>
      )}
    </>
  );
}
