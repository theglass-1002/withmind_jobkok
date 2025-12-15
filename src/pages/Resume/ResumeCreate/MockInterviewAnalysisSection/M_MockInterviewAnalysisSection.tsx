// src/pages/.../MockInterviewAnalysisSection/M_MockInterviewAnalysisSection.tsx
import React, { useMemo, useState } from "react";
import "./MockInterviewAnalysisSection.css";
import { toast } from "react-toastify";

import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_task_gray900_18 from "@/assets/icons/size18/ic_task_gray900_18.png";
import ic_content_paste_gray900_18 from "@/assets/icons/size18/ic_content_paste_gray900_18.png";
import icRadioChecked from "@/assets/icons/size20/ic_radio_checked_purple_20.png";
import icRadioUnchecked from "@/assets/icons/size20/ic_radio_unchecked_gray400_20.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";

import test_profile_img from "@/assets/testImg/test_profile_img.jpg";
import Modal from "@/shared/components/modal/Modal";

type Item = {
  id: string;
  score: string;
  role: string;
  date: string;
  title: string;
  thumbSrc: string;
  selectedBadge?: string;
};

export default function M_MockInterviewAnalysisSection() {
  const [isAdding, setIsAdding] = useState(false);

  // 분석 결과 선택 상태
  const [selectedId, setSelectedId] = useState<string | null>(null); // 오버레이 내 현재 선택
  const [pickedItem, setPickedItem] = useState<Item | null>(null);   // 실제 적용된 값

  // 모달 상태
  const [showCancelModal, setShowCancelModal] = useState(false); // X 닫기 시 확인 모달
  const [showResetModal, setShowResetModal] = useState(false);   // 초기화 버튼 모달

  // 예시 데이터
  const items: Item[] = useMemo(
    () => [
      {
        id: "1",
        score: "82점",
        role: "프로젝트 기획자",
        date: "2025.12.10",
        title: "성장하는 기획자 정유리입니다.",
        thumbSrc: test_profile_img,
        selectedBadge: "선택 이력서",
      },
      {
        id: "2",
        score: "90점",
        role: "백엔드 개발자",
        date: "2025.02.10",
        title: "문제 해결에 강한 엔지니어입니다.",
        thumbSrc: test_profile_img,
      },
    ],
    []
  );

  // 섹션에서 추가/수정 버튼
  const startAdd = () => {
    console.log("➕ 추가 버튼 클릭");
    setSelectedId(pickedItem?.id ?? null); // 이미 적용된 값이 있으면 미리 선택
    setIsAdding(true);
  };

  // 리스트에서 항목 선택
  const handleSelectItem = (id: string) => {
    console.log("📝 항목 선택:", id);
    setSelectedId(id);
  };

  // 저장 버튼 클릭
  const handleSave = () => {
    console.log("💾 저장 버튼 클릭:", selectedId);
    if (!selectedId) {
      toast.error("추가할 모의면접 분석 결과를 선택해 주세요.");
      return;
    }
    const found = items.find((it) => it.id === selectedId) || null;
    setPickedItem(found);
    setSelectedId(null);
    setIsAdding(false);
  };

  // X 닫기 버튼
  const handleClose = () => {
    console.log("🚫 닫기 버튼 클릭");
    if (selectedId) {
      // 뭔가 선택되어 있으면 확인 모달
      setShowCancelModal(true);
    } else {
      // 선택 없으면 그냥 닫기
      setIsAdding(false);
    }
  };

  // X 닫기 모달에서 "예" → 선택 초기화 + 닫기
  const confirmCancel = () => {
    console.log("🗑️ 선택 취소 확인");
    setSelectedId(null);
    setShowCancelModal(false);
    setIsAdding(false);
  };

  // X 닫기 모달에서 "계속 작성"
  const cancelCancel = () => {
    setShowCancelModal(false);
  };

  // 초기화 버튼 클릭
  const handleReset = () => {
    console.log("🔄 초기화 버튼 클릭");
    if (!selectedId) {
      // 아무 것도 선택 안 된 상태에서는 아무 동작 X
      return;
    }
    setShowResetModal(true);
  };

  // 초기화 모달에서 "예" → 선택만 제거 (오버레이는 유지)
  const confirmReset = () => {
    console.log("🧹 선택 초기화");
    setSelectedId(null);
    setShowResetModal(false);
  };

  const summaryText = pickedItem
    ? `${pickedItem.score}・${pickedItem.role}・${pickedItem.date} [${pickedItem.title}]`
    : "선택된 모의면접 분석 결과가 없습니다.";

  return (
    <div 
    id='resume__create-section--mockInterview' 
    className="resume-create-page__section resume-create-page__section--mock-interview-analysis">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              모의면접 분석 결과
            </div>
          </div>
        </div>
      </div>

      <div
        className={`resume-create-page__section-body ${
          isAdding ? "mock-interview-analysis-section" : "empty"
        }`}
      >
        {isAdding ? (
          <>
            <div className="basic-info-form-overlay">
              <div className="basic-info-form-container">
                {/* 헤더 */}
                <header className="resume-create-form__header">
                  <img
                    src={ic_close_gray900_24}
                    alt=""
                    className="resume-create-form__close-icon"
                    onClick={handleClose}
                    style={{ cursor: "pointer" }}
                  />
                  <span className="resume-create-form__title">
                    모의면접 분석 결과 선택
                  </span>
                  <span></span>
                </header>

                {/* 리스트 */}
                <div className="analysis-result-modal__body">
                  <div className="analysis-result-modal__list">
                    {items.map((it) => {
                      const isOn = selectedId === it.id;
                      return (
                        <div
                          key={it.id}
                          className={`analysis-result-modal__item ${
                            isOn ? "on" : ""
                          }`}
                          role="option"
                          aria-selected={isOn}
                          tabIndex={0}
                          onClick={() => handleSelectItem(it.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleSelectItem(it.id);
                            }
                          }}
                        >
                          <div className="analysis-result-modal__item-body">
                            <div className="analysis-result-modal__item-content">
                              <div className="analysis-result-modal__item-header">
                                <div className="analysis-result-modal__item-header-main">
                                  <div className="analysis-result-modal__item-score">
                                    [{it.score}]
                                  </div>
                                  <div className="analysis-result-modal__item-role">
                                    {it.role}
                                  </div>
                                </div>
                                <div className="analysis-result-modal__item-select">
                                  <img
                                    src={
                                      isOn ? icRadioChecked : icRadioUnchecked
                                    }
                                    alt=""
                                  />
                                </div>
                              </div>
                              <div className="analysis-result-modal__item-date">
                                {it.date}
                              </div>
                            </div>

                            <div className="analysis-result-modal__item-title">
                              <img src={ic_task_gray900_18} alt="" />
                              {it.title}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
          </>
        ) : (
          <>
            {/* 선택된 항목 표시 */}
            {pickedItem && (
             
                <div className="mock-preview-card">
                
                  <div className="mock-preview-card__info">
                    <img src={ic_content_paste_gray900_18} alt="" />
                    <div className="mock-preview-card__meta mock-preview-card__score">
                      {pickedItem.score}
                    </div>
                    <div className="mock-preview-card__meta mock-preview-card__role">
                      {pickedItem.role}
                    </div>
                    <div className="mock-preview-card__meta mock-preview-card__date">
                      {pickedItem.date}
                    </div>
                    </div>
                  
                    <div className="mock-preview-card__title">
                     [{pickedItem.title}]
                    </div>
            
                
              </div>
            )}

            {/* 추가 버튼 */}
            <div className="resume-create-page__section-action">
              <button
                className="btn_w_full default_btn_white"
                onClick={startAdd}
              >
                
                {pickedItem  ?
                  <>
                  <img src={ic_edit_gray900_20} alt="" />
                  수정
                  </>:<>
                  <img src={ic_add_btn_gray900_20} alt="" />
                  추가
                  </>}
            
              </button>
            </div>
          </>
        )}
      </div>

      {/* 초기화 확인 모달 */}
      <Modal
        open={showResetModal}
        title="입력된 내용을 전부 삭제하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="아니오"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={confirmReset}
        onClose={() => setShowResetModal(false)}
      />

      {/* 취소 확인 모달 (닫기 X) */}
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
