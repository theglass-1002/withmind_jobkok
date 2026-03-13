import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import check_box_purple from "@/assets/icons/check_box_purple.png";
import check_box_outline_blank_gray from "@/assets/icons/check_box_outline_blank_gray.png";

import refresh_black from "@/assets/icons/refresh_black.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";

import "@/shared/components/education-picker/ModalEducationPicker.css";

interface ModalEducationPickerProps {
  onApply?: (selected: string[]) => void;
  onChange?: (selected: string[]) => void;
  initialSelected?: string[];
}

const EDUCATION_OPTIONS_LEFT = [
  { key: "ANY", label: "학력 무관" },
  { key: "HS_OR_LESS", label: "고교 졸업 이하" },
  { key: "HS", label: "고등학교 졸업" },
  { key: "COLLEGE_2_3", label: "대학 졸업(2, 3년제)" },
] as const;

const EDUCATION_OPTIONS_RIGHT = [
  { key: "UNIV_4", label: "대학 졸업(4년제)" },
  { key: "MASTER", label: "대학원 석사 졸업" },
  { key: "PHD", label: "대학원 박사 졸업" },
] as const;

const MAX_EDU_COUNT = 5;

const areSetsEqual = (a: Set<string>, b: Set<string>) => {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
};

export default function ModalEducationPicker({
  onApply,
  onChange,
  initialSelected = [],
}: ModalEducationPickerProps) {
  const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());

  const initialSelectedKey = useMemo(() => {
    return [...initialSelected].sort().join("|");
  }, [initialSelected]);

  useEffect(() => {
    const next = new Set(initialSelected);
    setCheckedRoles((prev) => (areSetsEqual(prev, next) ? prev : next));
  }, [initialSelectedKey]);

  const emitChange = (nextSet: Set<string>) => {
    if (onChange) onChange(Array.from(nextSet));
  };

  const onClickRole = (key: string) => {
    const isAlreadyChecked = checkedRoles.has(key);

    if (!isAlreadyChecked && checkedRoles.size >= MAX_EDU_COUNT) {
      toast("최대 5개까지 선택 가능합니다.");
      return;
    }

    const next = new Set(checkedRoles);
    if (next.has(key)) next.delete(key);
    else next.add(key);

    setCheckedRoles(next);
    emitChange(next);
  };

  const handleReset = () => {
    const next = new Set<string>();
    setCheckedRoles(next);
    emitChange(next);
  };

  const handleApply = () => {
    onApply?.(Array.from(checkedRoles));
  };

  const selectedOptions = [...EDUCATION_OPTIONS_LEFT, ...EDUCATION_OPTIONS_RIGHT].filter(
    (opt) => checkedRoles.has(opt.key)
  );

  return (
    <>
      <div className="education-picker education-picker__popup">
        <div className="education-picker__body">
          <div className="education-picker__column education-picker__column--left">
            {EDUCATION_OPTIONS_LEFT.map((opt) => (
              <div
                key={opt.key}
                className={`job-role-picker__role ${checkedRoles.has(opt.key) ? "on" : ""}`}
                onClick={() => onClickRole(opt.key)}
              >
                <span className="job-role-picker__checkbox-wrap">
                  <img
                    src={checkedRoles.has(opt.key) ? check_box_purple : check_box_outline_blank_gray}
                    alt=""
                  />
                </span>
                <span className="job-role-picker__role-label">{opt.label}</span>
              </div>
            ))}
          </div>

          <div className="education-picker__column education-picker__column--right">
            {EDUCATION_OPTIONS_RIGHT.map((opt) => (
              <div
                key={opt.key}
                className={`job-role-picker__role ${checkedRoles.has(opt.key) ? "on" : ""}`}
                onClick={() => onClickRole(opt.key)}
              >
                <span className="job-role-picker__checkbox-wrap">
                  <img
                    src={checkedRoles.has(opt.key) ? check_box_purple : check_box_outline_blank_gray}
                    alt=""
                  />
                </span>
                <span className="job-role-picker__role-label">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="education-picker__options">
          <span className="education-picker__options-note">
            ※ 옵션은 최대 5개까지 선택 가능합니다.
          </span>

          <div className="education-picker__selected">
            {selectedOptions.map((opt) => (
              <div key={opt.key} className="education-picker__chip">
                <div className="education-picker__chip-body">
                  <span className="education-picker__chip-group">{opt.label}</span>
                </div>
                <span className="education-picker__chip-close" onClick={() => onClickRole(opt.key)}>
                  <img src={ic_close_gray500_20} alt="" />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="education-picker__actions">
          <div className="default_btn_white" onClick={handleReset}>
            <span className="education-picker__reset-icon">
              <img src={refresh_black} alt="" />
            </span>
            <span className="education-picker__reset-text">초기화</span>
          </div>
          <span className="default_btn_black" onClick={handleApply}>
            적용
          </span>
        </div>
      </div>

      <div className="education-picker education-picker__popup mobile">
        <div className="education-picker__body">
          <div className="education-picker__column education-picker__column--left">
            {EDUCATION_OPTIONS_LEFT.map((opt) => (
              <div
                key={opt.key}
                className={`job-role-picker__role ${checkedRoles.has(opt.key) ? "on" : ""}`}
                onClick={() => onClickRole(opt.key)}
              >
                <span className="job-role-picker__checkbox-wrap">
                  <img
                    src={checkedRoles.has(opt.key) ? check_box_purple : check_box_outline_blank_gray}
                    alt=""
                  />
                </span>
                <span className="job-role-picker__role-label">{opt.label}</span>
              </div>
            ))}
          </div>

          <div className="education-picker__column education-picker__column--right">
            {EDUCATION_OPTIONS_RIGHT.map((opt) => (
              <div
                key={opt.key}
                className={`job-role-picker__role ${checkedRoles.has(opt.key) ? "on" : ""}`}
                onClick={() => onClickRole(opt.key)}
              >
                <span className="job-role-picker__checkbox-wrap">
                  <img
                    src={checkedRoles.has(opt.key) ? check_box_purple : check_box_outline_blank_gray}
                    alt=""
                  />
                </span>
                <span className="job-role-picker__role-label">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
