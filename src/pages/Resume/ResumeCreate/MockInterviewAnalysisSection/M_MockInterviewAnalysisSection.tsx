// src/pages/.../MockInterviewAnalysisSection/M_MockInterviewAnalysisSection.tsx
import React, { useState } from "react";
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
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { fetchInterviewReportList } from "@/api/interview/interview.api";

type Item = {
  id: string;
  score: string;
  role: string;
  date: string;
  resumeDate: string;
  title: string;
  resumeTitle: string;
  photoUrl: string;
  badgeLabel: string;
};

const formatDateToDot = (date?: string) => {
  if (!date) return "";
  return date.replaceAll("-", ".");
};

export default function M_MockInterviewAnalysisSection() {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 분석 결과 선택 상태
  const [selectedId, setSelectedId] = useState<string | null>(null); // 오버레이 내 현재 선택
  const [pickedItem, setPickedItem] = useState<Item | null>(null);   // 실제 적용된 값

  // 모달 상태
  const [showCancelModal, setShowCancelModal] = useState(false); // X 닫기 시 확인 모달
  const [showResetModal, setShowResetModal] = useState(false);   // 초기화 버튼 모달

  // API 데이터
  const [items, setItems] = useState<Item[]>([]);

  // API 호출 후 오버레이 열기
  const startAdd = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);

      const res = await fetchInterviewReportList({ page: 1, size: 10 });
      console.log("📦 API 원본 응답:", res);
      console.log("📦 list:", res.list);

      const filteredList = (res.list ?? []).filter(
        (it) => it.interviewAllYn === "Y"
      );

      const mappedItems: Item[] = await Promise.all(
        filteredList.map(async (it, idx) => {
          let resolvedPhotoUrl = test_profile_img;
          if (it.photoUrl) {
            try {
              const r = await fetch(it.photoUrl);
              const data = await r.json();
              resolvedPhotoUrl = data?.signedUrl || test_profile_img;
            } catch (err) {
              console.error("❌ photoUrl 해석 실패:", err);
            }
          }

          return {
            id: String(it.qzGroup ?? idx + 1),
            score: `${it.totalScore ?? 0}점`,
            role: it.job || it.jobGroup || "",
            date: formatDateToDot(it.regdate),
            resumeDate: formatDateToDot(it.resumeDate),
            title: it.jobGroup
              ? `${it.jobGroup} 모의면접 분석 결과`
              : "모의면접 분석 결과",
            resumeTitle: it.resumeTitle || "",
            photoUrl: resolvedPhotoUrl,
            badgeLabel: it.interviewAllYn === "Y" ? "전체 면접" : "선택 이력서",
          };
        })
      );

      setItems(mappedItems);
      setSelectedId(pickedItem?.id ?? null);
      setIsAdding(true);
    } catch (error) {
      console.error("❌ 모의면접 분석 결과 리스트 조회 실패:", error);
      toast.error("모의면접 분석 결과를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 리스트에서 항목 선택
  const handleSelectItem = (id: string) => {
    setSelectedId(id);
  };

  // 저장 버튼 클릭
  const handleSave = () => {
    if (!selectedId) {
      toast.error("추가할 모의면접 분석 결과를 선택해 주세요.");
      return;
    }
    const found = items.find((it) => it.id === selectedId) || null;
    console.log("✅ [모의면접 분석결과 선택] selectedId:", selectedId);
    console.log("✅ [모의면접 분석결과 선택] 선택된 아이템:", found);
    console.log("✅ [모의면접 분석결과 선택] 전체 items 목록:", items);
    setPickedItem(found);
    setSelectedId(null);
    setIsAdding(false);
  };

  // X 닫기 버튼
  const handleClose = () => {
    if (selectedId) {
      setShowCancelModal(true);
    } else {
      setIsAdding(false);
    }
  };

  const confirmCancel = () => {
    setSelectedId(null);
    setShowCancelModal(false);
    setIsAdding(false);
  };

  const cancelCancel = () => {
    setShowCancelModal(false);
  };

  const handleReset = () => {
    if (!selectedId) return;
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setSelectedId(null);
    setShowResetModal(false);
  };

  const summaryText = pickedItem
    ? `${pickedItem.score}・${pickedItem.role}・${pickedItem.date} [${pickedItem.resumeTitle || pickedItem.title}]`
    : "선택된 모의면접 분석 결과가 없습니다.";

  return (
    <div
      id="resume__create-section--mockInterview"
      className="resume-create-page__section resume-create-page__section--mock-interview-analysis"
    >
      <LoadingOverlay isLoading={isLoading} />

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

                <div className="analysis-result-modal__body">
                  {items.length === 0 ? (
                    <div className="analysis-result-modal__empty">
                      완료된 모의면접 분석이 없습니다.
                    </div>
                  ) : (
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
                                {it.resumeTitle || it.title}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="resume-create-page__form-action">
                  {items.length === 0 ? (
                    <button
                      className="btn_w_full default_btn_black"
                      onClick={() => setIsAdding(false)}
                      type="button"
                    >
                      확인
                    </button>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
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
                  [{pickedItem.resumeTitle || pickedItem.title}]
                </div>
              </div>
            )}

            <div className="resume-create-page__section-action">
              <button
                className="btn_w_full default_btn_white"
                onClick={startAdd}
              >
                {pickedItem ? (
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
          </>
        )}
      </div>

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
