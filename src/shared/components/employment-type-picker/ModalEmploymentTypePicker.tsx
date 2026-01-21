import React, { useEffect, useState } from "react";

import refresh_black from "@/assets/icons/refresh_black.png";
import "./ModalEmploymentTypePicker.css";
import { EmpOptionKey } from "@/api/job/job.api";



interface ModalEmploymentTypePickerProps {
  onApply?: (selected: EmpOptionKey[]) => void;

  //  복원용
  initialSelected?: EmpOptionKey[];
}

export default function ModalEmploymentTypePicker({
  onApply,
  initialSelected = [],
}: ModalEmploymentTypePickerProps) {
  const [selectedOptions, setSelectedOptions] = useState<Set<EmpOptionKey>>(
    new Set()
  );

  //  모달 재오픈 시 복원
  useEffect(() => {
    setSelectedOptions(new Set(initialSelected));
  }, [initialSelected]);

  const isSelected = (key: EmpOptionKey) => selectedOptions.has(key);

  const handleToggleOption = (key: EmpOptionKey) => {
    setSelectedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleReset = () => setSelectedOptions(new Set());

  const handleApply = () => {
    onApply?.(Array.from(selectedOptions));
  };

  return (
    <>
      {/* PC 버전 */}
      <div className="employment-type-picker employment-type-picker--popup">
        <div className="employment-type-picker__body">
          <div className="emp-type__section emp-type__section--type">
            <span className="emp-type__title">고용형태</span>
            <div className="emp-type__list">
              <span
                className={`emp-type__option ${isSelected("fullTime") ? "on" : ""}`}
                onClick={() => handleToggleOption("fullTime")}
              >
                정규직
              </span>
              <span
                className={`emp-type__option ${isSelected("contract") ? "on" : ""}`}
                onClick={() => handleToggleOption("contract")}
              >
                계약직
              </span>
              <span
                className={`emp-type__option ${isSelected("intern") ? "on" : ""}`}
                onClick={() => handleToggleOption("intern")}
              >
                인턴
              </span>
            </div>
          </div>

          <div className="emp-type__section emp-type__section--etc">
            <span className="emp-type__title">기타사항</span>
            <div className="emp-type__list">
              <span
                className={`emp-type__option ${isSelected("militaryService") ? "on" : ""}`}
                onClick={() => handleToggleOption("militaryService")}
              >
                병역특례
              </span>
              <span
                className={`emp-type__option ${isSelected("foreigner") ? "on" : ""}`}
                onClick={() => handleToggleOption("foreigner")}
              >
                외국인
              </span>
              <span
                className={`emp-type__option ${isSelected("disability") ? "on" : ""}`}
                onClick={() => handleToggleOption("disability")}
              >
                장애인
              </span>
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
          <span className="default_btn_black" onClick={handleApply}>
            적용
          </span>
        </div>
      </div>

      {/* 모바일 버전 */}
      <div className="employment-type-picker employment-type-picker--popup mobile">
        <div className="employment-type-picker__body">
          <div className="emp-type__section emp-type__section--type">
            <span className="emp-type__title">고용형태</span>
            <div className="emp-type__list">
              <span
                className={`emp-type__option ${isSelected("fullTime") ? "on" : ""}`}
                onClick={() => handleToggleOption("fullTime")}
              >
                정규직
              </span>
              <span
                className={`emp-type__option ${isSelected("contract") ? "on" : ""}`}
                onClick={() => handleToggleOption("contract")}
              >
                계약직
              </span>
              <span
                className={`emp-type__option ${isSelected("intern") ? "on" : ""}`}
                onClick={() => handleToggleOption("intern")}
              >
                인턴
              </span>
            </div>
          </div>

          <div className="emp-type__section emp-type__section--etc">
            <span className="emp-type__title">기타사항</span>
            <div className="emp-type__list">
              <span
                className={`emp-type__option ${isSelected("militaryService") ? "on" : ""}`}
                onClick={() => handleToggleOption("militaryService")}
              >
                병역특례
              </span>
              <span
                className={`emp-type__option ${isSelected("foreigner") ? "on" : ""}`}
                onClick={() => handleToggleOption("foreigner")}
              >
                외국인
              </span>
              <span
                className={`emp-type__option ${isSelected("disability") ? "on" : ""}`}
                onClick={() => handleToggleOption("disability")}
              >
                장애인
              </span>
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
          <span className="default_btn_black" onClick={handleApply}>
            적용
          </span>
        </div>
      </div>
    </>
  );
}
