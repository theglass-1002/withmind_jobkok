// src/shared/components/calendar/InlineMonthPicker.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./calendar.css";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import ic_check_box_blank_gray400_24 from "@/assets/icons/size24/ic_check_box_blank_gray400_24.png";
import ic_check_box_purple24 from "@/assets/icons/size24/ic_check_box_purple24.png";

type MonthValue = { year: number; month: number }; // month: 0~11

export type PickerType =
  | "employmentStart"
  | "employmentEnd"
  | "educationStart"
  | "educationEnd";

type Props = {
  value?: MonthValue | null;
  defaultValue?: MonthValue;
  onChange?: (v: MonthValue) => void;
  onApply?: (v: MonthValue) => void;
  onApplyEx?: (v: MonthValue, isCurrent: boolean, meta?: { pickerType?: PickerType }) => void;

  minYear?: number;
  isDisabledMonth?: (year: number, month: number) => boolean;
  className?: string;
  pickerType?: PickerType;

  showCurrentToggle?: boolean;
  currentChecked?: boolean;
  onCurrentChange?: (checked: boolean) => void;
};

const MONTH_LABELS = [
  "1월","2월","3월","4월","5월","6월",
  "7월","8월","9월","10월","11월","12월"
];

const DEFAULT_MIN_YEAR = 2000;

export default function InlineMonthPicker({
  value,
  defaultValue,
  onChange,
  onApply,
  onApplyEx,
  minYear,
  isDisabledMonth,
  pickerType,
  className,
  showCurrentToggle,
  currentChecked,
  onCurrentChange,
}: Props) {
  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();

  const initial: MonthValue =
    value ?? defaultValue ?? { year: nowYear, month: nowMonth };

  const [viewYear, setViewYear] = useState(initial.year);
  const [selected, setSelected] = useState<MonthValue>(initial);
  const [isCurrent, setIsCurrent] = useState<boolean>(!!currentChecked);

  const [yearOpen, setYearOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value) {
      setSelected(value);
      setViewYear(value.year);
    }
  }, [value]);

  useEffect(() => {
    if (typeof currentChecked === "boolean") {
      setIsCurrent(currentChecked);
    }
  }, [currentChecked]);

  const years = useMemo(() => {
    const start = typeof minYear === "number" ? Math.min(minYear, nowYear) : DEFAULT_MIN_YEAR;
    const arr: number[] = [];
    for (let y = start; y <= nowYear; y++) arr.push(y);
    return arr.reverse();
  }, [minYear, nowYear]);

  useEffect(() => {
    if (!yearOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setYearOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [yearOpen]);

  const defaultIsDisabled = (y: number, m: number) =>
    y > nowYear || (y === nowYear && m > nowMonth);

  const pick = (m: number) => {
    const disabled = isDisabledMonth
      ? isDisabledMonth(viewYear, m)
      : defaultIsDisabled(viewYear, m);
    if (disabled) return;

    const next = { year: viewYear, month: m };
    setSelected(next);
    onChange?.(next);
  };

  const chooseYear = (y: number) => {
    setViewYear(y);
    setYearOpen(false);
  };

  const toggleCurrent = () => {
    const next = !isCurrent;
    setIsCurrent(next);
    onCurrentChange?.(next);
  };

  const handleApply = () => {
    onApply?.(selected);
    onApplyEx?.(selected, isCurrent, { pickerType });
  };

  const showToggle = pickerType === "employmentEnd" || !!showCurrentToggle;

  return (
    <div className={`cal cal--month ${className || ""}`}>
      <div className="cal_body">
        <div className="cal__header">
          <div className={`year-select ${yearOpen ? "is-open" : ""}`} ref={dropdownRef}>
            <span
              className="year-select__button"
              onClick={() => setYearOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={yearOpen}
              aria-label="연도 선택"
            >
              {viewYear}년
              <img className="year-select__arrow" src={ic_arrow_drop_down_gray900_24} alt="" />
            </span>

            {yearOpen && (
              <div className="year-select__menu" role="listbox" aria-label="연도">
                {years.map((y) => (
                  <div
                    key={y}
                    role="option"
                    aria-selected={y === viewYear}
                    className={`year-select__option ${y === viewYear ? "is-active" : ""}`}
                    onClick={() => chooseYear(y)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        chooseYear(y);
                      }
                    }}
                  >
                    {y}년
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="cal__months" role="grid" aria-label={`${viewYear}년`}>
          {MONTH_LABELS.map((label, idx) => {
            const disabled = isDisabledMonth
              ? isDisabledMonth(viewYear, idx)
              : defaultIsDisabled(viewYear, idx);
            const isSel = selected.year === viewYear && selected.month === idx;

            return (
              <button
                key={label}
                type="button"
                role="gridcell"
                className={`cal__month ${isSel ? "is-selected" : ""}`}
                data-month={idx}
                onClick={() => pick(idx)}
                disabled={disabled}
                aria-pressed={isSel}
                title={`${viewYear}.${idx + 1}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {showToggle ? (
        <div className="cal_bottom_items">
          <span className="cal_bottom_items__option" onClick={toggleCurrent}>
            <img
              src={isCurrent ? ic_check_box_purple24 : ic_check_box_blank_gray400_24}
              alt=""
            />
            재직중
          </span>
          <span className="default_btn_black" role="button" tabIndex={0} onClick={handleApply}>
            적용
          </span>
        </div>
      ) : (
        <div className="cal_bottom">
          <span className="default_btn_black" role="button" tabIndex={0} onClick={handleApply}>
            적용
          </span>
        </div>
      )}
    </div>
  );
}
