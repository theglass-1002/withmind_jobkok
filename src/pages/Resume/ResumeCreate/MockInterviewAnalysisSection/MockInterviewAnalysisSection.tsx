import React, { useEffect, useState } from "react";
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

type InitialPicked = {
  qzGroup: number;
  score?: number | null;
  job?: string | null;
  date?: string | null; // raw "YYYY-MM-DD HH:mm:ss"
  resumeTitle?: string;
};

type Props = {
  onPickedChange?: (qzGroup: number | null) => void;
  initialPicked?: InitialPicked | null;
};

const buildInitialItem = (p: InitialPicked): Item => ({
  id: String(p.qzGroup),
  score: typeof p.score === "number" ? `${p.score}점` : "",
  role: p.job ?? "",
  date: p.date ? p.date.slice(0, 10).replaceAll("-", ".") : "",
  resumeDate: "",
  title: "모의면접 분석 결과",
  resumeTitle: p.resumeTitle ?? "",
  photoUrl: test_profile_img,
  badgeLabel: "전체 면접",
});

export default function MockInterviewAnalysisSection({
  onPickedChange,
  initialPicked,
}: Props = {}) {
  const [isAdding, setIsAdding] = useState(!!initialPicked);
  const [isLoading, setIsLoading] = useState(false);

  // 모달 제어(선택 모달)
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialPicked ? String(initialPicked.qzGroup) : null
  );
  const [pickedItem, setPickedItem] = useState<Item | null>(
    initialPicked ? buildInitialItem(initialPicked) : null
  );

  // 부모에서 초기 모의면접 결과가 비동기로 도착할 수 있으니 동기화
  useEffect(() => {
    if (initialPicked) {
      const item = buildInitialItem(initialPicked);
      setPickedItem(item);
      setSelectedId(item.id);
      setIsAdding(true);
    }
  }, [initialPicked]);

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
    onPickedChange?.(null);
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
      setIsPickerOpen(true);
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
    console.log("✅ [모의면접 분석결과 선택] selectedId:", selectedId);
    console.log("✅ [모의면접 분석결과 선택] 선택된 아이템:", found);
    console.log("✅ [모의면접 분석결과 선택] 전체 items 목록:", items);
    setPickedItem(found);
    setIsPickerOpen(false);

    const qzGroupNum = found ? Number(found.id) : NaN;
    onPickedChange?.(Number.isFinite(qzGroupNum) ? qzGroupNum : null);
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