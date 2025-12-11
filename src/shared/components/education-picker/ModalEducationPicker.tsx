import React, { useState } from "react";

import check_box_purple from "@/assets/icons/check_box_purple.png";
import check_box_outline_blank_gray from "@/assets/icons/check_box_outline_blank_gray.png";

import chevron_right_black from "@/assets/icons/chevron_right_black.png";
import refresh_black from "@/assets/icons/refresh_black.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";

import "./ModalEducationPicker.css";

interface ModalEducationPickerProps {
  // 🔥 선택된 학력 코드 배열을 부모로 전달
  onApply?: (selected: string[]) => void;
}

// 학력 옵션 정의
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

export default function ModalEducationPicker({
  onApply,
}: ModalEducationPickerProps) {
  const [allChecked, setAllChecked] = useState(false);
  const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());

  const onClickAll = () => {
    setAllChecked((prev) => {
      const next = !prev;
      if (next) setCheckedRoles(new Set());
      return next;
    });
  };

  const onClickRole = (key: string) => {
    setAllChecked(false);
    setCheckedRoles((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleReset = () => {
    setAllChecked(false);
    setCheckedRoles(new Set());
  };

  const handleApply = () => {
    if (onApply) {
      onApply(Array.from(checkedRoles));
    }
  };

  // 선택된 항목 칩용 데이터
  const selectedOptions = [
    ...EDUCATION_OPTIONS_LEFT,
    ...EDUCATION_OPTIONS_RIGHT,
  ].filter((opt) => checkedRoles.has(opt.key));

  return (
    <>
      {/* PC 버전 */}
      <div className="education-picker education-picker--popup">
        <div className="education-picker__body">
          <div className="education-picker__column education-picker__column--left">
            {EDUCATION_OPTIONS_LEFT.map((opt) => (
              <div
                key={opt.key}
                className={`job-role-picker__role ${
                  checkedRoles.has(opt.key) ? "on" : ""
                }`}
                onClick={() => onClickRole(opt.key)}
              >
                <span className="job-role-picker__checkbox-wrap">
                  <img
                    src={
                      checkedRoles.has(opt.key)
                        ? check_box_purple
                        : check_box_outline_blank_gray
                    }
                    alt=""
                  />
                </span>
                <span className="job-role-picker__role-label">
                  {opt.label}
                </span>
              </div>
            ))}
          </div>

          <div className="education-picker__column education-picker__column--right">
            {EDUCATION_OPTIONS_RIGHT.map((opt) => (
              <div
                key={opt.key}
                className={`job-role-picker__role ${
                  checkedRoles.has(opt.key) ? "on" : ""
                }`}
                onClick={() => onClickRole(opt.key)}
              >
                <span className="job-role-picker__checkbox-wrap">
                  <img
                    src={
                      checkedRoles.has(opt.key)
                        ? check_box_purple
                        : check_box_outline_blank_gray
                    }
                    alt=""
                  />
                </span>
                <span className="job-role-picker__role-label">
                  {opt.label}
                </span>
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
                  <span className="education-picker__chip-group">
                    {opt.label}
                  </span>
                </div>
                <span
                  className="education-picker__chip-close"
                  onClick={() => onClickRole(opt.key)}
                >
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

      {/* 모바일 버전 */}
      <div className="education-picker education-picker--popup mobile">
        <div className="education-picker__body">
          <span className="education-picker__options-note">
            ※ 옵션은 최대 5개까지 선택 가능합니다.
          </span>
          <div className="education-picker__column education-picker__column--left">
            {EDUCATION_OPTIONS_LEFT.map((opt) => (
              <div
                key={opt.key}
                className={`job-role-picker__role ${
                  checkedRoles.has(opt.key) ? "on" : ""
                }`}
                onClick={() => onClickRole(opt.key)}
              >
                <span className="job-role-picker__checkbox-wrap">
                  <img
                    src={
                      checkedRoles.has(opt.key)
                        ? check_box_purple
                        : check_box_outline_blank_gray
                    }
                    alt=""
                  />
                </span>
                <span className="job-role-picker__role-label">
                  {opt.label}
                </span>
              </div>
            ))}
          </div>

          <div className="education-picker__column education-picker__column--right">
            {EDUCATION_OPTIONS_RIGHT.map((opt) => (
              <div
                key={opt.key}
                className={`job-role-picker__role ${
                  checkedRoles.has(opt.key) ? "on" : ""
                }`}
                onClick={() => onClickRole(opt.key)}
              >
                <span className="job-role-picker__checkbox-wrap">
                  <img
                    src={
                      checkedRoles.has(opt.key)
                        ? check_box_purple
                        : check_box_outline_blank_gray
                    }
                    alt=""
                  />
                </span>
                <span className="job-role-picker__role-label">
                  {opt.label}
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
    </>
  );
}
