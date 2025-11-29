import React, { useState } from "react";

import check_box_purple from '@/assets/icons/check_box_purple.png';
import check_box_outline_blank_gray from '@/assets/icons/check_box_outline_blank_gray.png';

import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import chevron_right_gray_light from '@/assets/icons/chevron_right_gray_light.png';
import refresh_black from '@/assets/icons/refresh_black.png';
import ic_close_gray500_20 from '@/assets/icons/size20/ic_close_gray500_20.png';
import "./ModalEmploymentTypePicker.css";


type EmpOptionKey =
  | 'fullTime'
  | 'contract'
  | 'intern'
  | 'militaryService'
  | 'foreigner'
  | 'disability';

export default function ModalEmploymentTypePicker() {
  const [selectedOptions, setSelectedOptions] = useState<Set<EmpOptionKey>>(new Set());

  const isSelected = (key: EmpOptionKey) => selectedOptions.has(key);

  const handleToggleOption = (key: EmpOptionKey) => {
    setSelectedOptions(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });    
  };
 
  const handleReset = () => setSelectedOptions(new Set());

  return (
    <>
      <div className="employment-type-picker employment-type-picker--popup">
      <div className="employment-type-picker__body">
      <div className="emp-type__section emp-type__section--type">
      <span className="emp-type__title">고용형태</span>
      <div className="emp-type__list">
      <span
        className={`emp-type__option ${isSelected('fullTime') ? 'on' : ''}`}
        onClick={() => handleToggleOption('fullTime')}
        >정규직</span>
      <span
        className={`emp-type__option ${isSelected('contract') ? 'on' : ''}`}
        onClick={() => handleToggleOption('contract')}
        >계약직</span>
      <span
        className={`emp-type__option ${isSelected('intern') ? 'on' : ''}`}
        onClick={() => handleToggleOption('intern')}
        >인턴</span>
      </div>
    </div>

    <div className="emp-type__section emp-type__section--etc">
      <span className="emp-type__title">기타사항</span>
      <div className="emp-type__list">
      <span
        className={`emp-type__option ${isSelected('militaryService') ? 'on' : ''}`}
        onClick={() => handleToggleOption('militaryService')}
        >병역특례</span>
      <span
        className={`emp-type__option ${isSelected('foreigner') ? 'on' : ''}`}
        onClick={() => handleToggleOption('foreigner')}
        >외국인</span>
    <span
        className={`emp-type__option ${isSelected('disability') ? 'on' : ''}`}
         onClick={() => handleToggleOption('disability')}
            >장애인</span>
      </div>
    </div>
      </div>
        <div className="employment-type-picker__actions">
          <div className="default_btn_white" onClick={handleReset}>
            <span className="employment-type-picker__reset-icon">
              <img src={refresh_black} alt="" />
            </span>
            <span className="employment-type-picker__reset-text">초기화</span>
          </div>
          <span className="default_btn_black">적용</span>
        </div>
      </div>
      <div className="employment-type-picker employment-type-picker--popup mobile">
      <div className="employment-type-picker__body">
      <div className="emp-type__section emp-type__section--type">
      <span className="emp-type__title">고용형태</span>
      <div className="emp-type__list">
      <span
        className={`emp-type__option ${isSelected('fullTime') ? 'on' : ''}`}
        onClick={() => handleToggleOption('fullTime')}
        >정규직</span>
      <span
        className={`emp-type__option ${isSelected('contract') ? 'on' : ''}`}
        onClick={() => handleToggleOption('contract')}
        >계약직</span>
      <span
        className={`emp-type__option ${isSelected('intern') ? 'on' : ''}`}
        onClick={() => handleToggleOption('intern')}
        >인턴</span>
      </div>
    </div>

    <div className="emp-type__section emp-type__section--etc">
      <span className="emp-type__title">기타사항</span>
      <div className="emp-type__list">
      <span
        className={`emp-type__option ${isSelected('militaryService') ? 'on' : ''}`}
        onClick={() => handleToggleOption('militaryService')}
        >병역특례</span>
      <span
        className={`emp-type__option ${isSelected('foreigner') ? 'on' : ''}`}
        onClick={() => handleToggleOption('foreigner')}
        >외국인</span>
    <span
        className={`emp-type__option ${isSelected('disability') ? 'on' : ''}`}
         onClick={() => handleToggleOption('disability')}
            >장애인</span>
      </div>
    </div>
      </div>
      </div>
    </>
  );
}
