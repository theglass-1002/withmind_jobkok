// src/pages/.../EducationSection/M_EducationSection.tsx
import React, { useState, useEffect } from 'react';
import ic_add_btn_gray900_20 from '@/assets/icons/size20/ic_add_btn_gray900_20.png';
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";

import './EducationSection.css';
import M_EducationForm from './Form/M_EducationForm';
import { formatMonthStringToDisplay } from '@/shared/utils/util';

export type Education = {
  school_name?: string;
  major_degree?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
};

export type EducationErrors = Partial<Record<keyof Education, string>>;

const blankItem = (): Education => ({
  school_name: '',
  major_degree: '',
  startDate: '',
  endDate: '',
  status: '',
});

const initialItems = (values?: Education[]): Education[] =>
  values && values.length > 0 ? values : [blankItem()];

interface M_EducationSectionProps {
  values?: Education[];
  onChange?: (list: Education[]) => void;
  onFocusAny?: () => void;
  errors?: EducationErrors[];
  sectionRef?: (el: HTMLDivElement | null) => void;
}

export default function M_EducationSection({
  values = [],
  onChange,
  onFocusAny,
  errors = [],
  sectionRef,
}: M_EducationSectionProps) {
  const [items, setItems] = useState<Education[]>([]);
  const [gradTypeList, setGradTypeList] = useState<(string | null)[]>(
    () =>
      values && values.length > 0
        ? values.map((v) => (v.status ?? null))
        : [null]
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (values && values.length > 0) {
      setItems(values);
      setGradTypeList(values.map((v) => v.status ?? null));
    }
  }, [values]);

  const handleAddOrEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (savedItems: Education[], savedGradTypes: (string | null)[]) => {
    const merged: Education[] = savedItems.map((edu, idx) => ({
      ...edu,
      status: savedGradTypes[idx] ?? '',
    }));

    setItems(merged);
    setGradTypeList(savedGradTypes);
    setIsEditing(false);

    console.log('✅ Education 저장 값:', merged);
    onChange?.(merged);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div
        id='resume__create-section--education'
        ref={sectionRef}
        className="resume-create-page__section resume-create-page__section--education"
      >
        <div className="resume-create-page__section-title resume-create-page__section-title--simple">
          <div className="resume-create-page__section-title__heading">
            학력 <em className="resume-create-page__required">*</em>
          </div>
        </div>

        {items.length > 0 && (
          <div className="resume-create-page__section-body education-section">
            {items.map((edu, idx) => (
              <div key={idx} className="resume-field__value resume-education">
                <span className="resume-education__school">{edu.school_name}</span>

                <div className="resume-education__meta">
                  <div className="resume-education__period">
                    <span className="resume-education__period-start">
                      {formatMonthStringToDisplay(edu.startDate)}
                    </span>
                    <span className="resume-education__period-sep">~</span>
                    <span className="resume-education__period-end">
                      {formatMonthStringToDisplay(edu.endDate)}
                    </span>
                  </div>

                  <span className="resume-education__major">{edu.major_degree}</span>
                  <span className="resume-education__status">
                    {edu.status ?? gradTypeList[idx] ?? ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="resume-create-page__section-action">
          <button
            className="btn_w_full default_btn_white"
            onClick={handleAddOrEdit}
            disabled={isEditing}
          >
            {items.length > 0 ? (
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
            <div className="basic-info-form-container education">
              <M_EducationForm
                initialItems={items.length > 0 ? items : initialItems(values)}
                initialGradTypes={gradTypeList}
                onSave={handleSave}
                onCancel={handleCancel}
                onFocusAny={onFocusAny}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}