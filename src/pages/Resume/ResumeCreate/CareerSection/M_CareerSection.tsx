// src/pages/.../CareerSection/M_CareerSection.tsx
import React, { useState } from "react";
import M_CareerForm from "./Form/M_CareerForm";
import Modal from "@/shared/components/modal/Modal";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import "./CareerSection.css";

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

interface CareerSectionProps {
  values?: any;
  errors?: any;
  onChange?: (patch: any) => void;
  onFocusAny?: () => void;
  sectionRef?: (el: HTMLDivElement | null) => void;
}

export default function M_CareerSection({ sectionRef }: CareerSectionProps) {
  const [careers, setCareers] = useState<CareerInfo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isNewcomer, setIsNewcomer] = useState(false); 

  // 추가/수정 버튼
  const handleAddOrEdit = () => {
    console.log("✏️ 경력 추가/수정 버튼 클릭");
    setIsEditing(true);
  };


  const handleSave = (savedCareers: CareerInfo[]) => {
    console.log("💾 경력 저장 완료:", savedCareers);
    setCareers(savedCareers);
    setIsEditing(false);
    // 경력 정보가 저장되면 신입 체크 해제
    if (savedCareers.length > 0) {
      setIsNewcomer(false);
    }
  };

  // 취소
  const handleCancel = () => {
    console.log("🚫 경력 입력 취소");
    setIsEditing(false);
  };

  const handleNewcomerToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    
    // 경력 -> 신입으로 전환 시 (체크 시)
    if (checked) {
      if (careers.length > 0) {
        // 경력 데이터가 있을 경우 모달 띄우기 (데이터 삭제 확인)
        setShowResetModal(true);
      } else {
        // 경력 데이터가 없을 경우 바로 신입 상태로 전환
        setIsNewcomer(true);
      }
    } else {
      // 신입 -> 경력으로 전환 시 (체크 해제 시)
      setIsNewcomer(false);
    }
  };


  const handleConfirmReset = () => {
    console.log("✅ 신입 변경 확인: 기존 경력 초기화");
    setCareers([]); // 경력 데이터 초기화
    setIsNewcomer(true); // 신입 상태로 전환
    setShowResetModal(false); // 모달 닫기
  };

  const handleCancelReset = () => {
    console.log("❌ 신입 변경 취소: 경력 유지");
    // 모달을 닫으면 체크박스 상태는 현재 isNewcomer(false)로 유지됨
    setShowResetModal(false);
  };

  return (
    <>
    <div
      id="resume__create-section--career"
      ref={sectionRef}
      className="resume-create-page__section resume-create-page__section--career"
    >
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          경력<em className="resume-create-page__required">*</em>
        </div>
        <div className="resume-section-title__actions">
          <label className="resume-section-title__control resume-section-title__control--fresh">
            <input type="checkbox" className="resume-section-title__checkbox" 
              checked={isNewcomer}
              onChange={handleNewcomerToggle}/>
            <span className="resume-section-title__control-label">신입</span>
          </label>
        </div>
      </div>

      {/* 경력 카드 미리보기 */}
      {careers.length > 0 && (
        <div className="resume-create-page__section-body career-section">
          {careers.map((career) => (
            console.log(career),
            <div className="resume-career-item" key={career.id}>
            <div className="resume-career-item__header">
              <span className="resume-career-item__company">{career.company_name}</span>
              
              <div className="resume-career-item__meta">
                <span className="resume-career-item__period resume-career-item__period--stack">
                  <div className="resume-career-item__period-range">
                    <span className="resume-career-item__period-start">{career.startDate}</span>
                    <span className="resume-career-item__period-sep"> ~ </span>
                    <span
                      className={
                        "resume-career-item__period-end" + (career.isCurrent ? " current" : "")
                      }
                    >
                      {career.endDate}
                    </span>
                  </div>
                  <span className="resume-career-item__tenure">경력</span>
                </span>
                <div className="resume-career-item__meta-group resume-career-item__meta">
                {career.employmentType && (
                  <span className="resume-career-item__employment">{career.employmentType}</span>
                )}
                {career.role && <span className="resume-career-item__role">{career.role}</span>}
                {career.position && <span className="resume-career-item__level">{career.position}</span>}
                </div>
              </div> 
            </div>
            <div className="resume-career-item__bullets">
            {career.summary.slice(0, 100)}
                  {career.summary.length > 100 && "..."}
                </div>
          </div>
          ))}
        </div>
      )}

      {/* 추가/수정 버튼 */}
      <div className="resume-create-page__section-action">
        <button 
          className="btn_w_full default_btn_white" 
          onClick={handleAddOrEdit}
          disabled={isEditing}
        >
          <img src={ic_add_btn_gray900_20} alt="" /> 
          {careers.length > 0 ? "수정" : "추가"}
        </button>
      </div>

      {/* 오버레이 폼 */}
      {isEditing && (
        <div className="basic-info-form-overlay">
          <div className="basic-info-form-container">
            <M_CareerForm
              initialCareers={careers}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
    <Modal
        open={showResetModal}
        title="신입으로 변경하시겠습니까??"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="취소"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleConfirmReset}
        onClose={handleCancelReset}
      />
    </>
  );
}