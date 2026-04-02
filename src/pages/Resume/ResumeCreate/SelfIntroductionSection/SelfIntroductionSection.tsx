// src/pages/Resume/ResumeCreate/SelfIntroductionSection/SelfIntroductionSection.tsx
import React, { useEffect, useState } from "react";
import "./SelfIntroductionSection.css";

import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_close_gray500_24 from "@/assets/icons/size24/ic_close_gray500_24.png";
import ic_star_gray700_20 from "@/assets/icons/size20/ic_star_gray700_20.png";
import Modal from "@/shared/components/modal/Modal";
import AISuggestArea from "@/pages/Resume/ResumeAISuggest";

// 🔥 상위와 연결하기 위한 props 타입
interface SelfIntroductionSectionProps {
  value: string;                        // 현재 자기소개 내용
  onChange: (content: string) => void;  // 내용 변경 시 호출
  isEdit?: boolean;                     // 작성/수정 모드 구분

  // ✅ AI 관련 (상위에서 내려줌)
  aiShow?: boolean;
  aiItems?: string[];
  onClickAISuggest?: () => void;
  onCloseAISuggest?: () => void;
}

export default function SelfIntroductionSection({
  value,
  onChange,
  isEdit = false,
  aiShow = false,
  aiItems = [],
  onClickAISuggest,
  onCloseAISuggest,
}: SelfIntroductionSectionProps) {
  const MAX_SUMMARY = 2000;

  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const summary = value ?? "";
  const count = summary.length;

  // 🔥 edit 모드 & 서버에서 내용이 있을 때, 처음에 자동으로 펼쳐주기
  useEffect(() => {
    if (!isEdit) return;
    if (!summary.trim()) return;
    // 수정 화면에서 내용이 이미 있으면 바로 섹션 오픈
    setIsAdding(true);
    // 처음엔 읽기 모드로 보여주고, 클릭하면 editing 시작
    setEditing(false);
  }, [isEdit, summary]);

  const startAdd = () => {
    setIsAdding(true);
    // if (!summary.trim()) setEditing(true);
  };

  const stopAdd = () => {
    setIsAdding(false);
    onChange(""); // 내용도 같이 초기화 (create/edit 공통 정책)
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
    onChange(v); // 상위 상태로 바로 전달
  };

 

  return (
    <div className="resume-create-page__section resume-create-page__section--personal-statement">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              자기소개서
            </div>
          </div>
          {isAdding ? (
            <img
              src={ic_close_gray500_24}
              alt="닫기"
              onClick={handleClickClose}
            />
          ) : (
            <span
              className="resume-section-title__action--import"
              onClick={startAdd}
            >
              <img src={ic_add_purple_20} alt="" />
              추가
            </span>
          )}
        </div>
      </div>

      <div
        className={`resume-create-page__section-body ${
          isAdding ? "personal-statement-section" : "empty"
        }`}
      >
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
            <AISuggestArea
              show={aiShow}
              items={aiItems}
            hintText="자기소개서 문장 추천을 위해 (희망 직무와 경력) 항목을 먼저 입력해 주세요."
              onClickSuggest={onClickAISuggest}
              onClose={onCloseAISuggest}
              wrapperClassName="resume-suggest__career"
            />
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
