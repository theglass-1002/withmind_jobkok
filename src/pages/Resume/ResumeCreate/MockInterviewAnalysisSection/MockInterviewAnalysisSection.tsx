import React, { useState } from "react";
import "./MockInterviewAnalysisSection.css";
import AnalysisResultModal from "./AnalysisResultModal";

import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_close_gray500_24 from "@/assets/icons/size24/ic_close_gray500_24.png";
import ic_content_paste_gray900_20 from "@/assets/icons/size20/ic_content_paste_gray900_20.png";
import test_profile_img from "@/assets/testImg/test_profile_img.jpg";
import Modal from "@/shared/components/modal/Modal";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { toast } from "react-toastify";
import { fetchInterviewReportList } from "@/api/interview/interview.api";

type Item = {
  id: string;
  score: string;
  role: string;
  date: string;
  title: string;
  thumbSrc: string;
  selectedBadge?: string;
};

const formatDateToDot = (date?: string) => {
  if (!date) return "";
  return date.replaceAll("-", ".");
};

export default function MockInterviewAnalysisSection() {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 모달 제어(선택 모달)
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickedItem, setPickedItem] = useState<Item | null>(null);

  // 닫기 확인 모달
  const [showConfirm, setShowConfirm] = useState(false);

  // API 데이터
  const [items, setItems] = useState<Item[]>([]);

  const startAdd = () => setIsAdding(true);

  const stopAdd = () => {
    setIsAdding(false);
    setSelectedId(null);
    setPickedItem(null);
    setIsPickerOpen(false);
  };

  // 상단 X 눌렀을 때: 값 있으면 확인 모달, 없으면 즉시 닫기
  const handleClickClose = () => {
    if (pickedItem) setShowConfirm(true);
    else stopAdd();
  };

  const handleConfirmDeleteAll = () => {
    setShowConfirm(false);
    stopAdd();
  };

  const handleCancelDelete = () => setShowConfirm(false);

  // 분석 결과 선택 모달
  const openPicker = async () => {
    try {
      if (isLoading) return;

      setIsLoading(true);

      const res = await fetchInterviewReportList({
        page: 1,
        size: 10,
      });

      const mappedItems: Item[] = (res.list ?? []).map((it, idx) => ({
        id: String(it.qzGroup ?? idx + 1),
        score: `${it.totalScore ?? 0}점`,
        role: it.job || it.jobGroup || "",
        date: formatDateToDot(it.regdate),
        title: it.jobGroup
          ? `${it.jobGroup} 모의면접 분석 결과`
          : "모의면접 분석 결과",
        thumbSrc: it.photoUrl || test_profile_img,
        selectedBadge: it.interviewAllYn === "Y" ? "전체 면접" : undefined,
      }));

      setItems(mappedItems);
      setSelectedId(pickedItem?.id ?? null);
      setIsPickerOpen(true);

      if (mappedItems.length === 0) {
        toast.info("불러올 모의면접 분석 결과가 없습니다.");
      }
    } catch (error) {
      console.error("❌ 모의면접 분석 결과 리스트 조회 실패:", error);
      toast.error("모의면접 분석 결과를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const closePicker = () => setIsPickerOpen(false);

  const applyPicker = () => {
    const found = items.find((it) => it.id === selectedId) || null;
    setPickedItem(found);
    setIsPickerOpen(false);
  };

  // 화면에 요약 문구
  const summaryText = pickedItem
    ? `${pickedItem.score}・${pickedItem.role}・${pickedItem.date} [${pickedItem.title}]`
    : "선택된 모의면접 분석 결과가 없습니다.";

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <div className="resume-create-page__section resume-create-page__section--mock-interview-analysis">
        <div className="resume-create-page__section-title resume-create-page__section-title--simple">
          <div className="section-title__row">
            <div className="section-title__left">
              <div className="resume-create-page__section-title__heading">
                모의면접 분석 결과
              </div>
            </div>
            {isAdding ? (
              <img src={ic_close_gray500_24} alt="닫기" onClick={handleClickClose} />
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
            isAdding ? "mock-interview-analysis-section" : "empty"
          }`}
        >
          {isAdding ? (
            <>
              <label className="portfolio-documents__label small_labe_black-14">
                분석 결과 <em className="error_text_red">*</em>
              </label>

              <div className="portfolio-documents__file">
                <div className="portfolio-documents__file-name">
                  <img src={ic_content_paste_gray900_20} alt="" />
                  {summaryText}
                </div>

                <span
                  className="default_btn_white"
                  role="button"
                  tabIndex={0}
                  onClick={openPicker}
                >
                  분석 결과 선택
                </span>
              </div>

              <AnalysisResultModal
                isOpen={isPickerOpen}
                items={items}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onCancel={closePicker}
                onApply={applyPicker}
              />
            </>
          ) : (
            <>모의면접 결과를 추가해 주세요.</>
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
    </>
  );
}