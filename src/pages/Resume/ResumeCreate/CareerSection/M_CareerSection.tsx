// src/pages/.../CareerSection/M_CareerSection.tsx
import React, { useState } from "react";
import M_CareerForm from "./Form/M_CareerForm";
import Modal from "@/shared/components/modal/Modal";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";

import "./CareerSection.css";
import { formatMonthStringToDisplay } from "@/shared/utils/util";
import { calcTenureLabel } from "@/api/resume/resume.types";

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
export type CareerErrors = Partial<Record<keyof CareerInfo, string>>;

interface CareerSectionProps {
  values?: any;
  errors?: any;
  onChange?: (list: CareerInfo[]) => void;
  onFocusAny?: () => void;
  sectionRef?: (el: HTMLDivElement | null) => void;
}

export default function M_CareerSection({
  sectionRef,
  onChange,
}: CareerSectionProps) {
  const [careers, setCareers] = useState<CareerInfo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isNewcomer, setIsNewcomer] = useState(false);

  const handleAddOrEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (savedCareers: CareerInfo[]) => {
    setCareers(savedCareers);
    setIsEditing(false);

    if (savedCareers.length > 0) {
      setIsNewcomer(false);
    }

    onChange?.(savedCareers);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleNewcomerToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    if (checked) {
      setShowResetModal(true);
      return;
    }

    setIsNewcomer(false);
  };

  const handleConfirmReset = () => {
    setCareers([]);
    setIsNewcomer(true);
    setShowResetModal(false);
    onChange?.([]);
  };

  const handleCancelReset = () => {
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
              <input
                type="checkbox"
                className="resume-section-title__checkbox"
                checked={isNewcomer}
                onChange={handleNewcomerToggle}
              />
              <span className="resume-section-title__control-label">신입</span>
            </label>
          </div>
        </div>

        {careers.length > 0 && (
          <div className="resume-create-page__section-body career-section">
            {careers.map((career) => (
              <div className="resume-career-item" key={career.id}>
                <div className="resume-career-item__header">
                  <span className="resume-career-item__company">
                    {career.company_name}
                  </span>

                  <div className="resume-career-item__meta">
                    <span className="resume-career-item__period resume-career-item__period--stack">
                      <div className="resume-career-item__period-range">
                        <span className="resume-career-item__period-start">
                          {formatMonthStringToDisplay(career.startDate)}
                        </span>
                        <span className="resume-career-item__period-sep"> ~ </span>
                        <span
                          className={
                            "resume-career-item__period-end" +
                            (career.isCurrent ? " current" : "")
                          }
                        >
                          {career.isCurrent
                            ? "재직 중"
                            : formatMonthStringToDisplay(career.endDate)}
                        </span>
                      </div>

                      <span className="resume-career-item__tenure">
                        {calcTenureLabel(career.startDate, career.endDate)}
                      </span>
                    </span>

                    <div className="resume-career-item__meta-group resume-career-item__meta">
                      {career.employmentType && (
                        <span className="resume-career-item__employment">
                          {career.employmentType}
                        </span>
                      )}
                      {career.role && (
                        <span className="resume-career-item__role">
                          {career.role}
                        </span>
                      )}
                      {career.position && (
                        <span className="resume-career-item__level">
                          {career.position}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {career.summary&&(
                    <div className="resume-career-item__bullets">{career.summary}</div>
                )}
              
              </div>
            ))}
          </div>
        )}

        <div className="resume-create-page__section-action">
          <button
            className="btn_w_full default_btn_white"
            onClick={handleAddOrEdit}
            disabled={isEditing}
            type="button"
          >
            {careers.length > 0 ? (
              <>
                <img src={ic_edit_gray900_20} alt="" />
                수정
              </>
            ) : (
              <>
                <img src={ic_add_btn_gray900_20} alt="" />
                추가
              </>
            )}
          </button>
        </div>

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