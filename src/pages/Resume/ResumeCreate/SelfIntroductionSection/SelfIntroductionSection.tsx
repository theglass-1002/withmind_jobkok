import React, { useState } from "react";
import "./SelfIntroductionSection.css";

import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_close_gray500_24 from "@/assets/icons/size24/ic_close_gray500_24.png";
import ic_star_gray700_20 from "@/assets/icons/size20/ic_star_gray700_20.png";
import Modal from "@/shared/components/modal/Modal";

export default function SelfIntroductionSection() {
  const MAX_SUMMARY = 2000;

  const [isAdding, setIsAdding] = useState(false);
  const [summary, setSummary] = useState("");
  const [editing, setEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const startAdd = () => setIsAdding(true);
  const stopAdd = () => {
    setIsAdding(false);
    setSummary("");
    setEditing(false);
  };

  const handleClickClose = () => {
    if (summary.trim().length > 0) setShowConfirm(true);
    else stopAdd();
  };

  const handleConfirmDeleteAll = () => {
    setShowConfirm(false);
    stopAdd();
  };
  const handleCancelDelete = () => setShowConfirm(false);

  const startEditing = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e) {
      // @ts-ignore
      if (e.nativeEvent?.isComposing) return;
      const key = (e as React.KeyboardEvent).key;
      if (key !== "Enter" && key !== " ") return;
      e.preventDefault();
    }
    setEditing(true);
  };

  const onChangeSummary = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value.slice(0, MAX_SUMMARY);
    setSummary(v);
  };

  const count = summary.length;

  return (
    <div className="resume-create-page__section resume-create-page__section--personal-statement">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">자기소개서</div>
          </div>
          {isAdding ? (
            <img src={ic_close_gray500_24} alt="닫기" onClick={handleClickClose} />
          ) : (
            <span className="resume-section-title__action--import" onClick={startAdd}>
              <img src={ic_add_purple_20} alt="" />
              추가
            </span>
          )}
        </div>
      </div>

      <div className={`resume-create-page__section-body ${isAdding ? "personal-statement-section" : "empty"}`}>
        {isAdding ? (
          <div className="field personal-section__control personal-section__control--summary">
            <label className="small_labe_black-14">
              내용 <em className="error_text_red">*</em>
            </label>

            {editing ? (
              <div className="personal-section__summary-input">
                <textarea
                  value={summary}
                  onChange={onChangeSummary}
                  maxLength={MAX_SUMMARY}
                />
                <span className="personal-section__char-count">
                  <span>{count}</span>
                  <span className="max"> / {MAX_SUMMARY}</span>
                </span>
              </div>
            ) : (
              <div
                className="personal-section__summary-input"
                role="button"
                tabIndex={0}
                onClick={startEditing}
                onKeyDown={startEditing}
              >
                {summary.trim().length > 0 ? (
                  <div className="personal-section__summary-read">{summary}</div>
                ) : (
                  <ul className="personal-section__summary-tips">
                    <li className="personal-section__summary-tip">내용을 입력해 주세요.</li>
                  </ul>
                )}
                <span className="personal-section__char-count">
                  <span>{count}</span>
                  <span className="max"> / {MAX_SUMMARY}</span>
                </span>
              </div>
            )}

            <div className="resume-create-page__assist">
              <span className="resume-create-page__assist-text">
                <img src={ic_star_gray700_20} alt="" />
                [AI 문장 추천]을 통해 간편하게 작성해 보세요.
              </span>
              <span className="ai-suggest-btn personal-section__summary-ai-btn">AI 문장 추천</span>
            </div>
          </div>
        ) : (
          <>자기소개서를 추가해 주세요.</>
        )}
      </div>

      <Modal
        open={showConfirm}
        title="입력된 내용을 전부 삭제하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="계속 작성"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleConfirmDeleteAll}
        onClose={handleCancelDelete}
      />
    </div>
  );
}
