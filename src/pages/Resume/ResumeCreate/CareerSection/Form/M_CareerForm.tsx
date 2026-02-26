// src/pages/.../CareerSection/Form/M_CareerForm.tsx
import React, { useState } from "react";
import Modal from "@/shared/components/modal/Modal";
import CareerItemForm from "./CareerItemForm";
import { toast } from "react-toastify";

import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import "../CareerSection.css";

const makeId = () => Math.random().toString(36).slice(2, 10);

export type CareerInfo = {
  id: string;
  company_name: string;
  role: string;
  position: string;
  summary: string;
  employmentType: string | null;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  tenure: string;
};

type CareerErrors = Partial<Record<keyof CareerInfo, string>>;

interface M_CareerFormProps {
  initialCareers: CareerInfo[];
  onSave: (careers: CareerInfo[]) => void;
  onCancel: () => void;
}

const blankCareer = (): CareerInfo => ({
  id: makeId(),
  company_name: "",
  role: "",
  position: "",
  summary: "",
  employmentType: null,
  isCurrent: false,
  startDate: "",
  endDate: "",
  tenure: "",
});

const swap = <T,>(arr: T[], i: number, j: number) => {
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

export default function M_CareerForm({
  initialCareers,
  onSave,
  onCancel,
}: M_CareerFormProps) {
  const [careers, setCareers] = useState<CareerInfo[]>(
    initialCareers.length > 0 ? initialCareers : [blankCareer()]
  );

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [careersErrors, setCareersErrors] = useState<CareerErrors[]>([]);

  const addCareer = () => {
    setCareers((prev) => [...prev, blankCareer()]);
    setCareersErrors((prev) => [...prev, {}]);
  };

  const removeCareer = (index: number) => {
    if (careers.length <= 1) return;
    setCareers((prev) => prev.filter((_, i) => i !== index));
    setCareersErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setCareers((prev) => swap(prev, index, index - 1));
    setCareersErrors((prev) => swap(prev, index, index - 1));
  };

  const moveDown = (index: number) => {
    if (index >= careers.length - 1) return;
    setCareers((prev) => swap(prev, index, index + 1));
    setCareersErrors((prev) => swap(prev, index, index + 1));
  };

  const updateCareer = (index: number, patch: Partial<CareerInfo>) => {
    setCareers((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...patch } : c))
    );

    if (careersErrors[index]) {
      const updatedErrors = { ...careersErrors[index] };
      Object.keys(patch).forEach((key) => {
        delete updatedErrors[key as keyof CareerInfo];
      });
      setCareersErrors((prev) =>
        prev.map((err, i) => (i === index ? updatedErrors : err))
      );
    }
  };

  const hasAnyInput = () => {
    return careers.some(
      (c) =>
        c.company_name ||
        c.role ||
        c.position ||
        c.summary ||
        c.employmentType ||
        c.startDate ||
        c.endDate
    );
  };

  const handleClose = () => {
    if (hasAnyInput()) {
      setShowCancelModal(true);
      return;
    }
    onCancel();
  };

  const handleReset = () => {
    if (!hasAnyInput()) return;
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setCareers([blankCareer()]);
    setCareersErrors([{}]);
    setShowResetModal(false);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    onCancel();
  };

  const handleSave = () => {
    const newErrors: CareerErrors[] = careers.map((c) => {
      const errors: CareerErrors = {};

      if (!c.company_name?.trim()) errors.company_name = "회사명을 입력해주세요.";
      if (!c.employmentType) errors.employmentType = "재직 형태를 선택해주세요.";
      if (!c.startDate?.trim()) errors.startDate = "시작일을 선택해주세요.";
      if (!c.isCurrent && !c.endDate?.trim()) errors.endDate = "종료일을 선택해주세요.";
      if (!c.role?.trim()) errors.role = "직무를 입력해주세요.";
      if (!c.position?.trim()) errors.position = "직책을 입력해주세요.";

      return errors;
    });

    const hasErrors = newErrors.some((err) => Object.keys(err).length > 0);

    if (hasErrors) {
      setCareersErrors(newErrors);
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }

    setCareersErrors([]);
    onSave(careers);
  };

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
        <span className="resume-create-form__title">경력</span>
        <span />
      </header>

      <div className="resume-create-form__content">
        {careers.map((career, index) => (
          <CareerItemForm
            key={career.id}
            index={index}
            total={careers.length}
            value={career}
            errors={careersErrors[index] || {}}
            onChange={(patch) => updateCareer(index, patch)}
            onMoveUp={() => moveUp(index)}
            onMoveDown={() => moveDown(index)}
            onRemove={() => removeCareer(index)}
          />
        ))}

        <button
          className="career-add-btn btn_w_full default_btn_white"
          onClick={addCareer}
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