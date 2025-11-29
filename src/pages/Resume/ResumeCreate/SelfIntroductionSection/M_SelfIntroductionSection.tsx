// src/pages/.../SelfIntroductionSection/M_SelfIntroductionSection.tsx
import React, { useState } from "react";
import "./SelfIntroductionSection.css";
import { toast } from "react-toastify";

import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_star_gray700_20 from "@/assets/icons/size20/ic_star_gray700_20.png";
import ic_star_green_20 from "@/assets/icons/size20/ic_star_green_20.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";

import AISuggestArea from "@/pages/Resume/ResumeAISuggest";
import Modal from "@/shared/components/modal/Modal";

export default function M_SelfIntroductionSection() {
  const MAX_SUMMARY = 2000;

  const [summary, setSummary] = useState("");
  const [isEditing, setIsEditing] = useState(false); // 오버레이 열림 여부
  const [editingField, setEditingField] = useState(false); // textarea 편집 or 읽기

  const [showCancelModal, setShowCancelModal] = useState(false); // X 닫기용 모달
  const [showResetModal, setShowResetModal] = useState(false); // 초기화 버튼용 모달

  const [errorSummary, setErrorSummary] = useState(false); // 내용 에러 여부

  // AI 추천 상태
  const [showAISuggest, setShowAISuggest] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);

  const count = summary.length;
  const hasAnyInput = () => summary.trim().length > 0;

  // 섹션에서 "추가/수정" 클릭
  const handleOpen = () => {
    setIsEditing(true);
    setEditingField(summary.trim().length === 0);
    setErrorSummary(false);
  };

  // 오버레이 닫기 (X 버튼)
  const handleClose = () => {
    if (hasAnyInput()) {
      setShowCancelModal(true);
    } else {
      setIsEditing(false);
      setErrorSummary(false);
      setShowAISuggest(false);
    }
  };

  // X 모달에서 "예" → 내용 삭제 + 오버레이 닫기
  const confirmCancel = () => {
    setShowCancelModal(false);
    setSummary("");
    setEditingField(false);
    setErrorSummary(false);
    setShowAISuggest(false);
    setIsEditing(false);
  };

  const cancelCancel = () => setShowCancelModal(false);

  const onChangeSummary = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value.slice(0, MAX_SUMMARY);
    setSummary(v);
    if (errorSummary) setErrorSummary(false);
  };

  const startEditingField = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e) {
      // 조합 중 입력(한글 IME 등)일 때는 무시
      const nativeEvent: any = (e as any).nativeEvent;
      if (nativeEvent?.isComposing) return;

      const key = e.key;
      if (key !== "Enter" && key !== " ") return;

      e.preventDefault();
    }
    setEditingField(true);
  };

  // 저장 버튼 클릭
  const handleSave = () => {
    if (!summary.trim()) {
      toast.error("필수 항목을 모두 입력해 주세요.");
      setErrorSummary(true);
      setEditingField(true);
      return;
    }

    setErrorSummary(false);
    setShowAISuggest(false);
    setIsEditing(false);
  };

  // 초기화 버튼 클릭
  const handleReset = () => {
    if (!hasAnyInput()) return; // 내용 없으면 모달 안 띄움
    setShowResetModal(true);
  };

  // 초기화 모달에서 "예" → 내용만 삭제, 오버레이는 유지
  const confirmReset = () => {
    setSummary("");
    setEditingField(true);
    setErrorSummary(false);
    setShowAISuggest(false);
    setShowResetModal(false);
  };

  const cancelReset = () => setShowResetModal(false);

  // AI 문장 추천 버튼 클릭
  const handleClickAISuggest = () => {
    const dummy =
      "5년 8개월차 JAVA 개발자 홍길동입니다. Spring Boot와 JPA를 활용한 백엔드 개발 및 API 설계 경험이 있으며, 성능 최적화와 데이터베이스 설계에 강점을 가지고 있습니다. 최근에는 MSA 및 CI/CD 구축을 통해 서비스 확장성과 자동화를 경험했습니다. 효율적인 시스템 개발과 문제 해결을 통해 성장하는 개발자가 되고 싶습니다.";

    setAISuggestions([dummy]);
    setShowAISuggest(true);
  };

  const handleCloseAISuggest = () => {
    setShowAISuggest(false);
  };

  const handlePickSuggestion = (text: string) => {
    setSummary((prev) => {
      const trimmed = prev.trim();
      const prefix = trimmed.length > 0 ? "\n" : "";
      return `${trimmed}${prefix}${text}`.slice(0, MAX_SUMMARY);
    });
    setEditingField(true);
    setShowAISuggest(false);
    setErrorSummary(false);
  };

  return (
    <div 
    id='resume__create-section--selfIntro'
    className="resume-create-page__section resume-create-page__section--personal-statement">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              자기소개서
            </div>
          </div>
        </div>
      </div>

      {/* 미리보기 영역 */}
      {summary.trim().length > 0 && (
        <div className="resume-create-page__section-body personal-statement-preview">
          <div className="resume-field__value resume-personal-statement">
            {summary.length > 200 ? `${summary.slice(0, 200)}...` : summary}
          </div>
        </div>
      )}

      {/* 추가/수정 버튼 */}
      <div className="resume-create-page__section-action">
        <button
          className="btn_w_full default_btn_white"
          onClick={handleOpen}
          disabled={isEditing}
        >
             {summary.trim().length > 0 ?
          <>
          <img src={ic_edit_gray900_20} alt="" />
          수정
          </>:<>
          <img src={ic_add_btn_gray900_20} alt="" />
          추가
          </>}

        </button>
      </div>

      {/* 오버레이 폼 */}
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

                {editingField ? (
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
                ) : (
                  <div
                    className="personal-section__summary-input"
                    role="button"
                    tabIndex={0}
                    onClick={startEditingField}
                    onKeyDown={startEditingField}
                  >
                    {summary.trim().length > 0 ? (
                      <div className="personal-section__summary-read">
                        {summary}
                      </div>
                    ) : (
                      <ul className="personal-section__summary-tips">
                        <li className="personal-section__summary-tip">
                          내용을 입력해 주세요.
                        </li>
                      </ul>
                    )}
                    <span className="personal-section__char-count">
                      <span>{count}</span>
                      <span className="max"> / {MAX_SUMMARY}</span>
                    </span>
                  </div>
                )}

                {/* AI 문장 추천 영역 */}
                <AISuggestArea
                  show={showAISuggest}
                  items={aiSuggestions}
                  onOpen={handleClickAISuggest}
                  onClose={handleCloseAISuggest}
                  onPick={handlePickSuggestion}
                  starIconGray={ic_star_gray700_20}
                  starIconGreen={ic_star_green_20}
                  closeIcon={ic_close_gray500_20}
                  hintText="[AI 문장 추천]을 통해 간편하게 작성해 보세요."
                  triggerLabel="AI 문장 추천"
                />
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="resume-create-page__form-action">
              <button
                className="btn-reset default_btn_white"
                onClick={handleReset}
                type="button"
              >
                <img src={ic_replay_gray900_20} alt="" /> 초기화
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

      {/* 초기화 확인 모달 (초기화 버튼 전용) */}
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

      {/* X 닫기용 전체 삭제 확인 모달 */}
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
