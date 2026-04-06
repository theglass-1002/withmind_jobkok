import React, { useEffect, useMemo, useState } from "react";

import refresh_black from "@/assets/icons/refresh_black.png";
import "./ModalEmploymentTypePicker.css";
import { EmpOptionKey } from "@/api/job/job.api";

interface ModalEmploymentTypePickerProps {
  onApply?: (selected: EmpOptionKey[]) => void;
  onChange?: (selected: EmpOptionKey[]) => void;
  initialSelected?: EmpOptionKey[];
}

const areSetsEqual = <T,>(a: Set<T>, b: Set<T>) => {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
};

export default function ModalEmploymentTypePicker({
  onApply,
  onChange,
  initialSelected = [],
}: ModalEmploymentTypePickerProps) {
  const [selectedOptions, setSelectedOptions] = useState<Set<EmpOptionKey>>(new Set());

  const initialSelectedKey = useMemo(() => {
    return [...initialSelected].sort().join("|");
  }, [initialSelected]);

  useEffect(() => {
    const next = new Set<EmpOptionKey>(initialSelected);
    setSelectedOptions((prev) => (areSetsEqual(prev, next) ? prev : next));
  }, [initialSelectedKey]);

  const emitChange = (next: Set<EmpOptionKey>) => {
    if (onChange) onChange(Array.from(next));
  };

  const isSelected = (key: EmpOptionKey) => selectedOptions.has(key);

  const handleToggleOption = (key: EmpOptionKey) => {
    const next = new Set(selectedOptions);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedOptions(next);
    emitChange(next);
  };

  const handleReset = () => {
    const next = new Set<EmpOptionKey>();
    setSelectedOptions(next);
    emitChange(next);
  };

  const handleApply = () => {
    onApply?.(Array.from(selectedOptions));
  };

  return (
    <>
      <div className="employment-type-picker employment-type-picker--popup">
        <div className="employment-type-picker__body">
          <div className="emp-type__section emp-type__section--type">
            <span className="emp-type__title">고용형태</span>
            <div className="emp-type__list">
              <span
                className={`emp-type__option ${isSelected("regular") ? "on" : ""}`}
                onClick={() => handleToggleOption("regular")}
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

      <div className="employment-type-picker employment-type-picker--popup mobile">
        <div className="employment-type-picker__body">
          <div className="emp-type__section emp-type__section--type">
            <span className="emp-type__title">고용형태</span>
            <div className="emp-type__list">
              <button
                type="button"
                className={`emp-type__option ${isSelected("regular") ? "on" : ""}`}
                onClick={() => handleToggleOption("regular")}
              >
                정규직
              </button>
              <button
                type="button"
                className={`emp-type__option ${isSelected("contract") ? "on" : ""}`}
                onClick={() => handleToggleOption("contract")}
              >
                계약직
              </button>
              <button
                type="button"
                className={`emp-type__option ${isSelected("intern") ? "on" : ""}`}
                onClick={() => handleToggleOption("intern")}
              >
                인턴
              </button>
            </div>
          </div>

          <div className="emp-type__section emp-type__section--etc">
            <span className="emp-type__title">기타사항</span>
            <div className="emp-type__list">
              <button
                type="button"
                className={`emp-type__option ${isSelected("militaryService") ? "on" : ""}`}
                onClick={() => handleToggleOption("militaryService")}
              >
                병역특례
              </button>
              <button
                type="button"
                className={`emp-type__option ${isSelected("foreigner") ? "on" : ""}`}
                onClick={() => handleToggleOption("foreigner")}
              >
                외국인
              </button>
              <button
                type="button"
                className={`emp-type__option ${isSelected("disability") ? "on" : ""}`}
                onClick={() => handleToggleOption("disability")}
              >
                장애인
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
