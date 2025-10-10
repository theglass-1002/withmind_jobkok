import React, { useMemo, useState } from "react";
import "./MockInterviewAnalysisSection.css";
import AnalysisResultModal from "./AnalysisResultModal";

import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import ic_content_paste_gray900_20 from "@/assets/icons/size20/ic_content_paste_gray900_20.png";
import test_profile_img from "@/assets/testImg/test_profile_img.jpg"; 

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

  // 모달 제어
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);    // 모달 내부 현재 선택
  const [pickedItem, setPickedItem] = useState<Item | null>(null);      // 최종 적용된 값

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
  const stopAdd = () => setIsAdding(false);

  const openPicker = () => {
    setIsPickerOpen(true);
    setSelectedId(pickedItem?.id ?? null); // 이전 적용값이 있으면 프리셀렉트
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
          <div className="section-title__right">
            {isAdding ? (
              <img src={ic_close_gray500_20} alt="닫기" onClick={stopAdd} />
            ) : (
              <span className="resume-section-title__action--import" onClick={startAdd}>
                <img src={ic_add_purple_20} alt="" />
                추가
              </span>
            )}
          </div>
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

            {/* 모달 */}
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
    </div>
  );
}
