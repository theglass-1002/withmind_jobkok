// src/pages/.../AwardsCertificationsSection/Form/M_AwardsCertificationsForm.tsx
import React, { useEffect, useState } from "react";
import "../AwardsCertificationsSection.css";

import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import { toast } from "react-toastify";

import Modal from "@/shared/components/modal/Modal";
import type {
  AwardsCertItem,
  AwardsCertErrors,
} from "../M_AwardsCertificationsSection";
import M_AwardsCertificationsItemForm from "./M_AwardsCertificationsItemForm";

const makeId = () => Math.random().toString(36).slice(2, 10);

const blankItem = (): AwardsCertItem => ({
  id: makeId(),
  kind: null,
  title: "",
  dateValue: "",
  score: "",
  issuer: "",
});

type AwardsErrors = Partial<Record<keyof AwardsCertItem, string>>;

interface M_AwardsCertificationsFormProps {
  initialItems: AwardsCertItem[];
  onSave: (items: AwardsCertItem[]) => void;
  onCancel: () => void;
  errors?: AwardsCertErrors[];
}

export default function M_AwardsCertificationsForm({
  initialItems,
  onSave,
  onCancel,
  errors = [],
}: M_AwardsCertificationsFormProps) {
  const [items, setItems] = useState<AwardsCertItem[]>(
    initialItems.length > 0 ? initialItems : [blankItem()]
  );

  const [showResetModal, setShowResetModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [itemsErrors, setItemsErrors] = useState<AwardsErrors[]>(errors);

  const hasAnyInput = () =>
    items.some((it) => it.kind || it.title || it.dateValue || it.score || it.issuer);

  const handleClose = () => {
    if (hasAnyInput()) {
      setShowCancelModal(true);
    } else {
      onCancel();
    }
  };

  const addItem = () => {
    setItems((prev) => [blankItem(), ...prev]);
    setItemsErrors((prev) => [{}, ...prev]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      setShowResetModal(true);
      return;
    }

    setItems((prev) => prev.filter((_, i) => i !== index));
    setItemsErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;

    setItems((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });

    setItemsErrors((prev) => {
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

    setItemsErrors((prev) => {
      const next = [...prev];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      return next;
    });
  };

  const updateItem = (index: number, patch: Partial<AwardsCertItem>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));

    if (itemsErrors[index]) {
      const updatedErrors = { ...itemsErrors[index] };
      Object.keys(patch).forEach((key) => {
        delete updatedErrors[key as keyof AwardsCertItem];
      });
      setItemsErrors((prev) => prev.map((err, i) => (i === index ? updatedErrors : err)));
    }
  };

  const handleReset = () => {
    if (!hasAnyInput() && initialItems.length === 0) return;
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setShowResetModal(false);
    setItemsErrors([]);
    onSave([]);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    onCancel();
  };

  const handleSave = () => {
    const newErrors: AwardsErrors[] = items.map((it) => {
      const err: AwardsErrors = {};
      if (!it.kind) {
        err.kind = "구분을 선택해 주세요.";
      }
      if (!it.title?.trim()) {
        err.title = "수상ㆍ자격증명을 입력해 주세요.";
      }
      return err;
    });

    const hasErrors = newErrors.some((e) => Object.keys(e).length > 0);

    if (hasErrors) {
      setItemsErrors(newErrors);
      toast.error("필수 항목을 모두 입력해 주세요.");
      return;
    }

    setItemsErrors([]);
    onSave(items);
  };

  useEffect(() => {
    if (items.length === 0) {
      setItems([blankItem()]);
      setItemsErrors([{}]);
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
        <span className="resume-create-form__title">수상ㆍ자격증</span>
        <span></span>
      </header>

      <div className="resume-create-form__content awards-certifications-section">
        {items.map((item, index) => {
          const canMoveUp = items.length > 1 && index > 0;
          const canMoveDown = items.length > 1 && index < items.length - 1;

          return (
            <M_AwardsCertificationsItemForm
              key={item.id}
              index={index}
              total={items.length}
              value={item}
              errors={itemsErrors[index] || {}}
              canMoveUp={canMoveUp}
              canMoveDown={canMoveDown}
              onChange={(patch) => updateItem(index, patch)}
              onMoveUp={() => moveUp(index)}
              onMoveDown={() => moveDown(index)}
              onRemove={() => removeItem(index)}
            />
          );
        })}

        <button
          className="career-add-btn btn_w_full default_btn_white"
          onClick={addItem}
          type="button"
        >
          <img src={ic_add_btn_gray900_20} alt="" /> 추가
        </button>
      </div>

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
        onClose={() => setShowCancelModal(false)}
      />
    </>
  );
}