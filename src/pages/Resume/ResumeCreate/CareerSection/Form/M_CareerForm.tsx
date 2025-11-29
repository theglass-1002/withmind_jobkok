// src/pages/.../CareerSection/Form/M_CareerForm.tsx
import React, { useState } from "react";
import Modal from "@/shared/components/modal/Modal";
import CareerItemForm from "./CareerItemForm";
import { toast } from "react-toastify";

import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import ic_add_white_20 from "@/assets/icons/size20/ic_add_white_20.png";
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
  
  // 각 경력의 에러 상태 (배열)
  const [careersErrors, setCareersErrors] = useState<CareerErrors[]>([]);

  // 경력 추가
  const addCareer = () => {
    console.log("➕ 경력 추가");
    setCareers(prev => [...prev, blankCareer()]);
    setCareersErrors(prev => [...prev, {}]); // 에러도 추가
  };

  // 경력 불러오기 (가짜 데이터)
  const importCareers = () => {
    console.log("📥 경력 불러오기");
    const fetched: Omit<CareerInfo, "id">[] = [
      {
        company_name: "위드마인드",
        role: "",
        position: "",
        summary: "",
        employmentType: "정규직",
        isCurrent: false,
        startDate: "2022.03",
        endDate: "2023.01",
      },
      {
        company_name: "케이티밀리의서재",
        role: "",
        position: "",
        summary: "",
        employmentType: "계약직",
        isCurrent: false,
        startDate: "2023.02",
        endDate: "2024.11",
      },
    ];
    
    const importedCareers = (fetched.length ? fetched : [blankCareer()]).map(it => ({ 
      id: makeId(), 
      ...it 
    }));
    
    setCareers(importedCareers);
    setCareersErrors(importedCareers.map(() => ({}))); // 에러 초기화
  };

  // 경력 삭제
  const removeCareer = (index: number) => {
    if (careers.length <= 1) return;
    console.log("🗑️ 경력 삭제:", index);
    setCareers(prev => prev.filter((_, i) => i !== index));
    setCareersErrors(prev => prev.filter((_, i) => i !== index)); // 에러도 삭제
  };

  // 위로 이동
  const moveUp = (index: number) => {
    if (index <= 0) return;
    console.log("⬆️ 위로 이동:", index);
    setCareers(prev => swap(prev, index, index - 1));
    setCareersErrors(prev => swap(prev, index, index - 1)); // 에러도 이동
  };

  // 아래로 이동
  const moveDown = (index: number) => {
    if (index >= careers.length - 1) return;
    console.log("⬇️ 아래로 이동:", index);
    setCareers(prev => swap(prev, index, index + 1));
    setCareersErrors(prev => swap(prev, index, index + 1)); // 에러도 이동
  };

  // 경력 수정
  const updateCareer = (index: number, patch: Partial<CareerInfo>) => {
    setCareers(prev => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
    
    // 수정된 필드의 에러 제거
    if (careersErrors[index]) {
      const updatedErrors = { ...careersErrors[index] };
      Object.keys(patch).forEach(key => {
        delete updatedErrors[key as keyof CareerInfo];
      });
      setCareersErrors(prev => prev.map((err, i) => (i === index ? updatedErrors : err)));
    }
  };

  // 입력 여부 확인
  const hasAnyInput = () => {
    return careers.some(c => 
      c.company_name || c.role || c.position || c.summary || 
      c.employmentType || c.startDate || c.endDate
    );
  };

  // X 버튼 클릭
  const handleClose = () => {
    if (hasAnyInput()) {
      console.log("✏️ 입력된 내용이 있어 취소 모달 표시");
      setShowCancelModal(true);
    } else {
      console.log("❌ 입력된 내용 없음 - 바로 닫기");
      onCancel();
    }
  };

  // 초기화 버튼 클릭
  const handleReset = () => {
    if (hasAnyInput()) {
      console.log("🔄 입력된 내용이 있어 초기화 모달 표시");
      setShowResetModal(true);
    } else {
      console.log("🔄 입력된 내용 없음 - 초기화 불필요");
    }
  };

  // 초기화 확인
  const confirmReset = () => {
    console.log("🗑️ 초기화 확인 - 모든 경력 삭제");
    setCareers([blankCareer()]);
    setCareersErrors([{}]);
    setShowResetModal(false);
  };

  // 취소 확인
  const confirmCancel = () => {
    console.log("🚫 취소 확인 - 폼 닫기");
    setShowCancelModal(false);
    onCancel();
  };

  // 저장
  const handleSave = () => {
    console.log("💾 저장 버튼 클릭!");
    console.log("💾 저장할 경력들:", careers);
    
    // 각 경력의 에러 검증
    const newErrors: CareerErrors[] = careers.map(c => {
      const errors: CareerErrors = {};
      
      if (!c.company_name?.trim()) {
        errors.company_name = "회사명을 입력해주세요.";
      }
      if (!c.employmentType) {
        errors.employmentType = "재직 형태를 선택해주세요.";
      }
      if (!c.startDate?.trim()) {
        errors.startDate = "시작일을 선택해주세요.";
      }
      if (!c.isCurrent && !c.endDate?.trim()) {
        errors.endDate = "종료일을 선택해주세요.";
      }
      if (!c.role?.trim()) {
        errors.role = "직무를 입력해주세요.";
      }
      if (!c.position?.trim()) {
        errors.position = "직책을 입력해주세요.";
      }
      
      return errors;
    });
    
    // 에러가 있는지 확인
    const hasErrors = newErrors.some(err => Object.keys(err).length > 0);
    
    if (hasErrors) {
      console.log("⚠️ 필수값 누락된 경력이 있습니다:", newErrors);
      setCareersErrors(newErrors);
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }
    
    console.log("✅ 모든 필수 입력값 확인 완료!");
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
        <span></span>
      </header>

      <div className="resume-create-form__content">
        {/* 경력 불러오기 버튼 */}
        <button 
          className="btn_w_full resume-career-autofill-button" 
          onClick={importCareers}
          type="button"
        > 
          <img src={ic_add_white_20} alt="" />
          경력 불러오기
        </button>

        {/* 경력 목록 */}
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

        {/* 추가 버튼 */}
        <button 
          className="career-add-btn btn_w_full default_btn_white" 
          onClick={addCareer}
          type="button"
        >
          <img src={ic_add_btn_gray900_20} alt="" /> 추가
        </button>
      </div>

      {/* 하단 버튼 */}
      <div className="resume-create-page__form-action">
        <button className="btn-reset default_btn_white" onClick={handleReset} type="button">
          <img src={ic_replay_gray900_20} alt="" /> 초기화
        </button>
        <button className="btn_w_full default_btn_black" onClick={handleSave} type="button">
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