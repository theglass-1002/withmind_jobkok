// src/pages/.../EducationSection/M_EducationSection.tsx
import React, { useState, useEffect } from 'react';
import ic_add_btn_gray900_20 from '@/assets/icons/size20/ic_add_btn_gray900_20.png';

import './EducationSection.css';
import M_EducationForm from './Form/M_EducationForm';

export type Education = {
  school_name?: string;
  major_degree?: string;
  startDate?: string;
  endDate?: string;
};

export type EducationErrors = Partial<Record<keyof Education, string>>;

const blankItem = (): Education => ({
  school_name: '',
  major_degree: '',
  startDate: '',
  endDate: '',
});

const initialItems = (values?: Education[]): Education[] =>
  values && values.length > 0 ? values : [blankItem()];

interface M_EducationSectionProps {
  values?: Education[];
  onChange?: (list: Education[]) => void;
  onFocusAny?: () => void;
  errors?: EducationErrors; // 필요시 확장해서 사용
  sectionRef?: (el: HTMLDivElement | null) => void;
}

export default function M_EducationSection({
  values = [],
  onChange,
  onFocusAny,
  errors = {},
  sectionRef,
}: M_EducationSectionProps) {
  const [items, setItems] = useState<Education[]>([]);
  // const [items, setItems] = useState<Education[]>(() => initialItems(values));
  const [gradTypeList, setGradTypeList] = useState<(string | null)[]>(
    () => (values && values.length > 0 ? values.map(() => null) : [null])
  );
  const [isEditing, setIsEditing] = useState(false);

  // 외부에서 values 바뀌면 동기화 (선택 사항)
  useEffect(() => {
    if (values && values.length > 0) {
      setItems(values);
      setGradTypeList(prev =>
        values.length === prev.length ? prev : values.map(() => null)
      );
    }
  }, [values]);

  const handleAddOrEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (savedItems: Education[], savedGradTypes: (string | null)[]) => {
    setItems(savedItems);
    setGradTypeList(savedGradTypes);
    setIsEditing(false);
    onChange?.(savedItems);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div
        ref={sectionRef}
        className="resume-create-page__section resume-create-page__section--education"
      >
        <div className="resume-create-page__section-title resume-create-page__section-title--simple">
          <div className="resume-create-page__section-title__heading">
            학력 <em className="resume-create-page__required">*</em>
          </div>
        </div>

        {/* 학력 카드 미리보기 */}
        {items.length > 0 && (
          <div className="resume-create-page__section-body education-section">
            {items.map((edu, idx) => (
                <div className="resume-field__value resume-education">
                <span className="resume-education__school">{edu.school_name}</span>
        
                <div className="resume-education__meta">
                  <div className="resume-education__period">
                    <span className="resume-education__period-start">{edu.startDate}</span>
                    <span className="resume-education__period-sep">~</span>
                    <span className="resume-education__period-end">{edu.endDate}</span>
                  </div>
        
                  <span className="resume-education__major">{edu.major_degree}</span>
                  <span className="resume-education__status"> {gradTypeList[idx]}</span>
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
            {items.length > 0 ? '수정' : '추가'}
          </button>
        </div>

        {/* 오버레이 폼 */}
        {isEditing && (
          <div className="basic-info-form-overlay">
            <div className="basic-info-form-container">
              <M_EducationForm
                initialItems={items}
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
