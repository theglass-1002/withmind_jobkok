import React, { useMemo, useState } from "react";
import "./MockInterviewAnalysisSection.css";
import AnalysisResultModal from "./AnalysisResultModal";

import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_close_gray500_24 from "@/assets/icons/size24/ic_close_gray500_24.png";
import ic_content_paste_gray900_20 from "@/assets/icons/size20/ic_content_paste_gray900_20.png";
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

export default function MockInterviewAnalysisSection() {
  const [isAdding, setIsAdding] = useState(false);

  // 모달 제어(선택 모달)
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null); // 선택 모달 내 현재 선택
  const [pickedItem, setPickedItem] = useState<Item | null>(null);   // 적용된 값

  // 닫기 확인 모달
  const [showConfirm, setShowConfirm] = useState(false);

  // 예시 데이터 (실사용에선 서버에서 가져오세요)
  const items: Item[] = useMemo(
    () => [
      {
        id: "1",
        score: "82점",
        role: "프론트엔드 개발자",
        date: "2025.01.01",
        title: "성장하는 개발자, 준비된 홍길동입니다.",
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
  const openPicker = () => {
    setIsPickerOpen(true);
    setSelectedId(pickedItem?.id ?? null); // 이전 적용값 있으면 프리셀렉트
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
    <div className="resume-create-page__section resume-create-page__section--mock-interview-analysis">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">모의면접 분석 결과</div>
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

      <div className={`resume-create-page__section-body ${isAdding ? "mock-interview-analysis-section" : "empty"}`}>
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

              <span className="default_btn_white" role="button" tabIndex={0} onClick={openPicker}>
                분석 결과 선택
              </span>
            </div>

            {/* 선택 모달 */}
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

      {/* 닫기 확인 모달 */}
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
