// src/pages/.../SelfIntroductionSection/M_SelfIntroductionSection.tsx
import React, { useEffect, useState } from "react";
import "./SelfIntroductionSection.css";
import { toast } from "react-toastify";
import { Icons } from "@/assets/icons";

import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";

import AISuggestArea from "@/pages/Resume/ResumeAISuggest";
import Modal from "@/shared/components/modal/Modal";

interface M_SelfIntroductionSectionProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;

  aiShow?: boolean;
  aiSuggestions?: string[];
  onClickAISuggest?: () => void;
  onCloseAISuggest?: () => void;
}

export default function M_SelfIntroductionSection({
  value = "",
  onChange,
  error = false,
  aiShow = false,
  aiSuggestions = [],
  onClickAISuggest,
  onCloseAISuggest,
}: M_SelfIntroductionSectionProps) {

  const MAX_SUMMARY = 2000;

  const [summary, setSummary] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [errorSummary, setErrorSummary] = useState(false);

  useEffect(() => {
    setSummary(value);
  }, [value]);

  useEffect(() => {
    setErrorSummary(!!error);
  }, [error]);

  const count = summary.length;
  const hasAnyInput = () => summary.trim().length > 0;

  const handleOpen = () => {
    setIsEditing(true);
    setErrorSummary(false);
  };

  const handleClose = () => {
    if (hasAnyInput()) {
      setShowCancelModal(true);
    } else {
      setIsEditing(false);
      setErrorSummary(false);
    }
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    setSummary(value);
    setErrorSummary(false);
    setIsEditing(false);
  };

  const cancelCancel = () => setShowCancelModal(false);

  const onChangeSummary = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value.slice(0, MAX_SUMMARY);
    setSummary(v);

    if (errorSummary) {
      setErrorSummary(false);
    }
  };

  const handleSave = () => {
    if (!summary.trim()) {
      toast.error("필수 항목을 모두 입력해 주세요.");
      setErrorSummary(true);
      return;
    }

    setErrorSummary(false);
    setIsEditing(false);
    onChange?.(summary);
  };

  const handleReset = () => {
    if (!hasAnyInput()) return;
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setSummary("");
    setErrorSummary(false);
    setShowResetModal(false);
    onChange?.("");
  };

  const cancelReset = () => setShowResetModal(false);

  const handlePickSuggestion = (text: string) => {
    setSummary((prev) => {
      const trimmed = prev.trim();
      const prefix = trimmed.length > 0 ? "\n" : "";
      return `${trimmed}${prefix}${text}`.slice(0, MAX_SUMMARY);
    });

    setErrorSummary(false);
  };

  return (
    <div
      id="resume__create-section--selfIntro"
      className="resume-create-page__section resume-create-page__section--personal-statement"
    >
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              자기소개서
            </div>
          </div>
        </div>
      </div>

      {summary.trim().length > 0 && (
        <div className="resume-create-page__section-body personal-statement-preview">
          <div className="resume-field__value resume-personal-statement">
            {summary.length > 200 ? `${summary.slice(0, 200)}...` : summary}
          </div>
        </div>
      )}

      <div className="resume-create-page__section-action">
        <button
          className="btn_w_full default_btn_white"
          onClick={handleOpen}
          disabled={isEditing}
          type="button"
        >
          {summary.trim().length > 0 ? (
            <>
              <img src={ic_edit_gray900_20} alt="" />
              수정
            </>
          ) : (
            <>
              <img src={ic_add_btn_gray900_20} alt="" />
              추가
            </>
          )}
        </button>
      </div>

      {isEditing && (
        <div className="basic-info-form-overlay">
          <div className="basic-info-form-container">
            <header className="resume-create-form__header">
              <img
                src={ic_close_gray900_24}
                alt=""
                className="resume-create-form__close-icon"
                onClick={handleClose}
                style={{ cursor: "pointer" }}
              />
              <span className="resume-create-form__title">자기소개서</span>
              <span></span>
            </header>

            <div className="resume-create-form__content personal-statement-section">
              <div className="field personal-section__control personal-section__control--summary">
                <label className="small_labe_black-14">
                  내용 <em className="error_text_red">*</em>
                </label>

                <div
                  className={
                    "personal-section__summary-input" +
                    (errorSummary ? " error_box" : "")
                  }
                >
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

                <AISuggestArea
                    show={aiShow}
                    items={aiSuggestions}
                    onClickSuggest={onClickAISuggest}
                    onClose={onCloseAISuggest}
                    wrapperClassName="resume-suggest__selfintro"
                    variant="text"
                    hintText="더 정확한 AI 추천을 위해 (희망 직무와 경력) 항목을 먼저 입력해 주세요."
                    triggerLabel="AI 자기소개 추천"
                    suggestResultTitle="AI 추천 결과"
                  />
              </div>
            </div>

            <div className="resume-create-page__form-action">
              <button
                className="btn-reset default_btn_white"
                onClick={handleReset}
                type="button"
              >
                <img src={ic_replay_gray900_20} alt="" />
                초기화
              </button>
              <button
                className="btn_w_full default_btn_black"
                onClick={handleSave}
                type="button"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={showResetModal}
        title="입력된 내용을 전부 삭제하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="아니오"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={confirmReset}
        onClose={cancelReset}
      />

      <Modal
        open={showCancelModal}
        title="수정사항을 저장하지 않고 취소하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="계속 작성"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={confirmCancel}
        onClose={cancelCancel}
      />
    </div>
  );
}