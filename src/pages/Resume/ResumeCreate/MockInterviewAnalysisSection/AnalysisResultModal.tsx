import React from "react";

import icRadioChecked from "@/assets/icons/size20/ic_radio_checked_purple_20.png";
import icRadioUnchecked from "@/assets/icons/size20/ic_radio_unchecked_gray400_20.png";
import icSelectedFile from "@/assets/icons/size20/ic_selected_file_purple_20.png";

type Item = {
  id: string;
  score: string;
  role: string;
  date: string;
  title: string;
  thumbSrc: string;
  selectedBadge?: string;
};

export default function AnalysisResultModal({
  isOpen,
  items,
  selectedId,
  onSelect,
  onCancel,
  onApply,
}: {
  isOpen: boolean;
  items: Item[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCancel: () => void;
  onApply: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="analysis-result-modal" role="dialog" aria-modal="true">
      <div className="analysis-result-modal__overlay" onClick={onCancel} />
      <div className="analysis-result-modal__dialog">
        <div className="analysis-result-modal__body">
          <div className="analysis-result-modal__list">
            {items.map((it) => {
              const isOn = selectedId === it.id;
              return (
                <div
                  key={it.id}
                  className={`analysis-result-modal__item ${isOn ? "on" : ""}`}
                  role="option"
                  aria-selected={isOn}
                  tabIndex={0}
                  onClick={() => onSelect(it.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect(it.id);
                  }}
                >
                  <div className="analysis-result-modal__item-body">
                    <div className="analysis-result-modal__item-select">
                      <img src={isOn ? icRadioChecked : icRadioUnchecked} alt="" />
                    </div>
                    <div className="analysis-result-modal__item-thumb">
                      <img src={it.thumbSrc} alt="" />
                    </div>
                    <div className="analysis-result-modal__item-score">{it.score}</div>
                    <div className="analysis-result-modal__item-role">{it.role}</div>
                    <div className="analysis-result-modal__item-date">{it.date}</div>
                  </div>

                  <div className="analysis-result-modal__item-bottom">
                  <div className="analysis-result-modal__item-status">
                        <img src={icSelectedFile} alt="" />
                        선택 이력서
                      </div>
                    <div className="analysis-result-modal__item-title">{it.title}</div>
                    <div className="analysis-result-modal__item-created">{it.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="analysis-result-modal__footer btn_wrap">
          <span className="btn_w_full default_btn_black" role="button" tabIndex={0} onClick={onCancel}>취소</span>
          <span className="btn_w_full default_btn_white" role="button" tabIndex={0} onClick={onApply}>적용</span>
        </div>
      </div>
    </div>
  );
}
