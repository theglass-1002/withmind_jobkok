import React, { useEffect, useState } from "react";
import "../ActivitiesSection.css";

import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import { toast } from "react-toastify";

import Modal from "@/shared/components/modal/Modal";
import type { ActivityItem, ActivityErrors } from "../M_ActivitiesSection";
import M_ActivitiesItemForm from "./M_ActivitiesItemForm";

const makeId = () => Math.random().toString(36).slice(2, 10);
const MAX_SUMMARY = 2000;

interface M_ActivitiesFormProps {
  initialItems: ActivityItem[];
  onSave: (items: ActivityItem[]) => void;
  onCancel: () => void;
  errors?: ActivityErrors[];
  onFocusAny?: () => void;
}

export default function M_ActivitiesForm({
  initialItems,
  onSave,
  onCancel,
  errors = [],
  onFocusAny,
}: M_ActivitiesFormProps) {
  const [items, setItems] = useState<ActivityItem[]>(
    initialItems.length > 0
      ? initialItems
      : [{ id: makeId(), activityType: null, activityName: "", summary: "" }]
  );

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [itemsErrors, setItemsErrors] = useState<ActivityErrors[]>(errors);

  useEffect(() => {
    setItemsErrors(errors);
  }, [errors]);

  const hasAnyInput = () =>
    items.some(
      (it) =>
        it.activityType ||
        it.activityName ||
        it.startDate ||
        it.endDate ||
        (it.summary ?? "").trim().length > 0
    );

  const handleClose = () => {
    if (hasAnyInput()) {
      setShowCancelModal(true);
    } else {
      onCancel();
    }
  };

  const addItem = () => {
    onFocusAny?.();
    setItems((prev) => [
      ...prev,
      { id: makeId(), activityType: null, activityName: "", summary: "" },
    ]);
    setItemsErrors((prev) => [...prev, {}]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      setShowResetModal(true);
      return;
    }

    onFocusAny?.();

    setItems((prev) => prev.filter((_, i) => i !== index));
    setItemsErrors((prev) => prev.filter((_, i) => i !== index));

    setEditingIndex((cur) => {
      if (cur === null) return null;
      if (cur === index) return null;
      if (cur > index) return cur - 1;
      return cur;
    });
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;

    onFocusAny?.();

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

    setEditingIndex((cur) =>
      cur === index ? index - 1 : cur === index - 1 ? index : cur
    );
  };

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;

    onFocusAny?.();

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

    setEditingIndex((cur) =>
      cur === index ? index + 1 : cur === index + 1 ? index : cur
    );
  };

  const updateItem = (index: number, patch: Partial<ActivityItem>) => {
    onFocusAny?.();

    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it))
    );

    if (itemsErrors[index]) {
      const updatedErrors = { ...itemsErrors[index] };
      Object.keys(patch).forEach((key) => {
        delete updatedErrors[key as keyof ActivityItem];
      });

      setItemsErrors((prev) =>
        prev.map((err, i) => (i === index ? updatedErrors : err))
      );
    }
  };

  const onChangeSummary = (index: number, v: string) => {
    onFocusAny?.();

    const next = v.slice(0, MAX_SUMMARY);
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, summary: next } : it))
    );

    if (itemsErrors[index]?.summary) {
      setItemsErrors((prev) =>
        prev.map((err, i) =>
          i === index ? { ...err, summary: undefined } : err
        )
      );
    }
  };

  const handleReset = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    const resetItems: ActivityItem[] = [
      { id: makeId(), activityType: null, activityName: "", summary: "" },
    ];

    setItems(resetItems);
    setItemsErrors([{}]);
    setEditingIndex(null);
    setShowResetModal(false);
    onSave(resetItems);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    onCancel();
  };

  const handleSave = () => {
    const newErrors: ActivityErrors[] = items.map((it) => {
      const err: ActivityErrors = {};

      if (!it.activityType) {
        err.activityType = "구분을 선택해 주세요.";
      }
      if (!it.activityName?.trim()) {
        err.activityName = "활동ㆍ경험명을 입력해 주세요.";
      }
      if (!it.startDate?.trim()) {
        err.startDate = "시작일을 선택해 주세요.";
      }
      if (!it.endDate?.trim()) {
        err.endDate = "종료일을 선택해 주세요.";
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
      setItems([
        { id: makeId(), activityType: null, activityName: "", summary: "" },
      ]);
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
        <span className="resume-create-form__title">활동ㆍ경험</span>
        <span></span>
      </header>

      <div className="resume-create-form__content activities-section">
        {items.map((item, index) => {
          const canMoveUp = items.length > 1 && index > 0;
          const canMoveDown = items.length > 1 && index < items.length - 1;

          return (
            <M_ActivitiesItemForm
              key={item.id}
              index={index}
              total={items.length}
              value={item}
              errors={itemsErrors[index] || {}}
              canMoveUp={canMoveUp}
              canMoveDown={canMoveDown}
              isEditingSummary={editingIndex === index}
              onChange={(patch) => updateItem(index, patch)}
              onMoveUp={() => moveUp(index)}
              onMoveDown={() => moveDown(index)}
              onRemove={() => removeItem(index)}
              onStartEditSummary={() => {
                onFocusAny?.();
                setEditingIndex(index);
              }}
              onChangeSummary={(v) => onChangeSummary(index, v)}
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