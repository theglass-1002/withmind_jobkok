// src/pages/.../EducationSection/Form/M_EducationForm.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import ic_close_gray900_24 from '@/assets/icons/size24/ic_close_gray900_24.png';
import ic_replay_gray900_20 from '@/assets/icons/size20/ic_replay_gray900_20.png';
import ic_add_btn_gray900_20 from '@/assets/icons/size20/ic_add_btn_gray900_20.png';
import Modal from '@/shared/components/modal/Modal';

import '../EducationSection.css';
import type { Education, EducationErrors } from '../M_EducationSection';
import M_EducationItemForm from './M_EducationItemForm';

const blankItem = (): Education => ({
  school_name: '',
  major_degree: '',
  startDate: '',
  endDate: '',
});

const swap = <T,>(arr: T[], i: number, j: number) => {
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

interface M_EducationFormProps {
  initialItems: Education[];
  initialGradTypes: (string | null)[];
  onSave: (items: Education[], gradTypes: (string | null)[]) => void;
  onCancel: () => void;
  onFocusAny?: () => void;
}

export default function M_EducationForm({
  initialItems,
  initialGradTypes,
  onSave,
  onCancel,
  onFocusAny,
}: M_EducationFormProps) {
  const [items, setItems] = useState<Education[]>(
    initialItems.length > 0 ? initialItems : [blankItem()]
  );

  const [gradTypes, setGradTypes] = useState<(string | null)[]>(
    initialGradTypes.length === (initialItems.length || 1)
      ? initialGradTypes
      : (initialItems.length > 0 ? initialItems : [blankItem()]).map(() => null)
  );

  const [itemsErrors, setItemsErrors] = useState<EducationErrors[]>([]);
  const [gradErrors, setGradErrors] = useState<boolean[]>(
    new Array(initialItems.length > 0 ? initialItems.length : 1).fill(false)
  );

  const [openedSelectIdx, setOpenedSelectIdx] = useState<number | null>(null);

  // 🔹 모달 상태
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const hasAnyInput = () =>
    items.some(
      (e) =>
        e.school_name ||
        e.major_degree ||
        e.startDate ||
        e.endDate
    );

  // 닫기(X) 버튼 클릭
  const handleClose = () => {
    if (hasAnyInput()) {
      setShowCancelModal(true);
    } else {
      onCancel();
    }
  };

  // 초기화 버튼 클릭
  const handleReset = () => {
    if (!hasAnyInput()) return; // 값 없으면 모달도 안 띄움
    setShowResetModal(true);
  };

  // 초기화 확인 모달 - "예" 클릭
  const confirmReset = () => {
    setItems([blankItem()]);
    setGradTypes([null]);
    setItemsErrors([{}]);
    setGradErrors([false]);
    setShowResetModal(false);
  };

  // 취소 확인 모달 - "예" 클릭
  const confirmCancel = () => {
    // 변경사항 버리고 닫기
    setShowCancelModal(false);
    onCancel();
  };

  const addItem = () => {
    setItems((prev) => [...prev, blankItem()]);
    setGradTypes((prev) => [...prev, null]);
    setItemsErrors((prev) => [...prev, {}]);
    setGradErrors((prev) => [...prev, false]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
    setGradTypes((prev) => prev.filter((_, i) => i !== index));
    setItemsErrors((prev) => prev.filter((_, i) => i !== index));
    setGradErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setItems((prev) => swap(prev, index, index - 1));
    setGradTypes((prev) => swap(prev, index, index - 1));
    setItemsErrors((prev) => swap(prev, index, index - 1));
    setGradErrors((prev) => swap(prev, index, index - 1));
  };

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;
    setItems((prev) => swap(prev, index, index + 1));
    setGradTypes((prev) => swap(prev, index, index + 1));
    setItemsErrors((prev) => swap(prev, index, index + 1));
    setGradErrors((prev) => swap(prev, index, index + 1));
  };

  const updateItem = (index: number, patch: Partial<Education>) => {
    setItems((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));

    // 수정된 필드는 에러 제거
    if (itemsErrors[index]) {
      const updatedErrors = { ...itemsErrors[index] };
      Object.keys(patch).forEach((key) => {
        delete updatedErrors[key as keyof Education];
      });
      setItemsErrors((prev) =>
        prev.map((err, i) => (i === index ? updatedErrors : err))
      );
    }
  };

  const handleSelectGrad = (index: number, label: string) => {
    setGradTypes((prev) => prev.map((v, i) => (i === index ? label : v)));
    setGradErrors((prev) =>
      prev.map((err, i) => (i === index ? false : err))
    );
    setOpenedSelectIdx(null);
  };

  const handleSave = () => {
    const newErrors: EducationErrors[] = items.map((e) => {
      const err: EducationErrors = {};
      if (!e.school_name?.trim()) {
        err.school_name = '학교명을 입력해 주세요.';
      }
      if (!e.startDate?.trim()) {
        err.startDate = '입학일을 선택해 주세요.';
      }
      if (!e.endDate?.trim()) {
        err.endDate = '졸업/재학 종료일을 선택해 주세요.';
      }
      return err;
    });

    const newGradErrors: boolean[] = gradTypes.map((g) => !g);

    const hasInputErrors = newErrors.some((e) => Object.keys(e).length > 0);
    const hasGradErr = newGradErrors.some((v) => v);

    if (hasInputErrors || hasGradErr) {
      setItemsErrors(newErrors);
      setGradErrors(newGradErrors);
      toast.error('필수 항목을 모두 입력해 주세요.');
      return;
    }

    setItemsErrors([]);
    setGradErrors([]);
    onSave(items, gradTypes);
  };

  return (
    <>
      <header className="resume-create-form__header">
        <img
          src={ic_close_gray900_24}
          alt=""
          className="resume-create-form__close-icon"
          onClick={handleClose}
          style={{ cursor: 'pointer' }}
        />
        <span className="resume-create-form__title">학력</span>
        <span></span>
      </header>

      <div className="resume-create-form__content">
        {/* 학력 목록 */}
        {items.map((item, index) => (
          <M_EducationItemForm
            key={index}
            index={index}
            total={items.length}
            value={item}
            errors={itemsErrors[index] || {}}
            gradLabel={gradTypes[index]}
            selectOpen={openedSelectIdx === index}
            onToggleSelect={() =>
              setOpenedSelectIdx((prev) => (prev === index ? null : index))
            }
            onSelectGrad={(label) => handleSelectGrad(index, label)}
            onChange={(patch) => updateItem(index, patch)}
            onMoveUp={() => moveUp(index)}
            onMoveDown={() => moveDown(index)}
            onRemove={() => removeItem(index)}
            onFocusAny={onFocusAny}
            gradError={gradErrors[index]}
          />
        ))}

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
