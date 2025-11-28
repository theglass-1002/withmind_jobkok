// src/pages/.../PortfolioDocumentsSection/Form/M_PortfolioDocumentsForm.tsx
import React, { useEffect, useState } from "react";
import "../PortfolioDocumentsSection.css";

import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import { toast } from "react-toastify";

import Modal from "@/shared/components/modal/Modal";
import type { PortfolioDocItem } from "../M_PortfolioDocumentsSection";
import M_PortfolioDocumentsItemForm from "./M_PortfolioDocumentsItemForm";

const makeId = () => Math.random().toString(36).slice(2, 10);

const blankItem = (): PortfolioDocItem => ({
  id: makeId(),
  source: "file",
  title: "",
  file: null,
  url: "",
  note: "",
});

interface M_PortfolioDocumentsFormProps {
  initialItems: PortfolioDocItem[];
  onSave: (items: PortfolioDocItem[]) => void;
  onCancel: () => void;
}

export default function M_PortfolioDocumentsForm({
  initialItems,
  onSave,
  onCancel,
}: M_PortfolioDocumentsFormProps) {
  const [items, setItems] = useState<PortfolioDocItem[]>(
    initialItems.length > 0 ? initialItems : [blankItem()]
  );
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const hasAnyInput = () =>
    items.some(
      (it) =>
        it.file ||
        (it.url && it.url.trim().length > 0) ||
        (it.title && it.title.trim().length > 0) ||
        (it.note && it.note.trim().length > 0)
    );

  // X 클릭
  const handleClose = () => {
    if (hasAnyInput()) {
      setShowCancelModal(true);
    } else {
      onCancel();
    }
  };

  const addItem = () => {
    setItems((prev) => [
      { id: makeId(), source: "file", title: "", file: null, url: "", note: "" },
      ...prev,
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      setShowResetModal(true);
      return;
    }
    setItems((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      return next;
    });
  };

  const updateItem = (index: number, patch: Partial<PortfolioDocItem>) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it))
    );
  };

  // 초기화 버튼 클릭
  const handleReset = () => {
    if (!hasAnyInput()) return; // 입력 없으면 모달 안 띄움
    setShowResetModal(true);
  };

  // 초기화 모달에서 "예"
  const confirmReset = () => {
    setItems([blankItem()]);
    setShowResetModal(false);
    onCancel(); // 폼 닫기
  };

  // 취소 모달에서 "예"
  const confirmCancel = () => {
    // 폼 내용 초기화 후 닫기
    setItems([blankItem()]);
    setShowCancelModal(false);
    onCancel();
  };

  // 저장 버튼 클릭
  const handleSave = () => {
    // 파일/URL 검증: 각 아이템당 최소 하나는 있어야 함
    const hasInvalid = items.some((it) => {
      if (it.source === "file") {
        return !it.file; // 파일 모드인데 file 없음
      }
      // URL 모드
      return !(it.url && it.url.trim().length > 0);
    });

    if (hasInvalid) {
      toast.error("파일 또는 URL을 등록해 주세요.");
      return; // 저장 안 하고 폼 유지
    }

    onSave(items);
  };

  useEffect(() => {
    if (items.length === 0) {
      setItems([blankItem()]);
    }
  }, [items.length]);

  return (
    <>
      <header className="resume-create-form__header">
        <img
          src={ic_close_gray900_24}
          alt=""
          className="resume-create-form__close-icon"
          onClick={handleClose}
          style={{ cursor: "pointer" }}
        />
        <span className="resume-create-form__title">포트폴리오ㆍ기타 문서</span>
        <span></span>
      </header>

      <div className="resume-create-form__content portfolio-documents-section">
        {items.map((item, index) => {
          const canMoveUp = items.length > 1 && index > 0;
          const canMoveDown = items.length > 1 && index < items.length - 1;

          return (
            <M_PortfolioDocumentsItemForm
              key={item.id}
              index={index}
              total={items.length}
              value={item}
              canMoveUp={canMoveUp}
              canMoveDown={canMoveDown}
              onChange={(patch) => updateItem(index, patch)}
              onMoveUp={() => moveUp(index)}
              onMoveDown={() => moveDown(index)}
              onRemove={() => removeItem(index)}
            />
          );
        })}

        {/* 추가 버튼 */}
        <button
          className="career-add-btn btn_w_full default_btn_white"
          onClick={addItem}
          type="button"
        >
          <img src={ic_add_btn_gray900_20} alt="" /> 추가
        </button>
      </div>

      {/* 하단 버튼 */}
      <div className="resume-create-page__form-action">
        <button
          className="btn_w_full default_btn_white"
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

      {/* 전체 삭제 확인 모달 */}
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

      {/* 취소 확인 모달 */}
      <Modal
        open={showCancelModal}
        title="수정사항을 저장하지 않고 취소하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="계속 작성"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={confirmCancel}
        onClose={() => setShowCancelModal(false)}
      />
    </>
  );
}
