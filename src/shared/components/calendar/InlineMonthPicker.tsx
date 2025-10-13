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
  onChange?: (v: MonthValue) => void; // 월 클릭 시(미리보기 등)
  onApply?: (v: MonthValue) => void;  // 적용 버튼 (기존 호환)
  // ✅ 확장: 적용 시 isCurrent 같은 부가 정보도 함께 올려보내고 싶을 때
  onApplyEx?: (v: MonthValue, isCurrent: boolean, meta?: { pickerType?: PickerType }) => void;

  minYear?: number; // 시작 연도 (기본 2000)
  isDisabledMonth?: (year: number, month: number) => boolean;
  className?: string;
  pickerType?: PickerType;

  // ✅ (선택) employmentEnd 외에도 토글을 보여주고 싶은 경우
  showCurrentToggle?: boolean;
  // ✅ (선택) 토글을 부모 상태와 동기화하고 싶을 때
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
  const nowMonth = now.getMonth(); // 0~11

  // 초기 선택값: 외부 value → defaultValue → 올해/현재월
  const initial: MonthValue = value ?? defaultValue ?? { year: nowYear, month: nowMonth };

  const [viewYear, setViewYear] = useState(initial.year);
  const [selected, setSelected] = useState<MonthValue>(initial);

  // "재직중" 토글 상태 (employmentEnd 등에서 사용)
  const [isCurrent, setIsCurrent] = useState<boolean>(!!currentChecked);

  // 커스텀 연도 드롭다운
  const [yearOpen, setYearOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 외부 value 동기화
  useEffect(() => {
    if (value) {
      setSelected(value);
      setViewYear(value.year);
    }
  }, [value]);

  // 외부 currentChecked 동기화
  useEffect(() => {
    if (typeof currentChecked === "boolean") {
      setIsCurrent(currentChecked);
    }
  }, [currentChecked]);

  // 연도 리스트: minYear ~ 올해 (최신 연도 위로)
  const years = useMemo(() => {
    const start =
      typeof minYear === "number" ? Math.min(minYear, nowYear) : DEFAULT_MIN_YEAR;
    const arr: number[] = [];
    for (let y = start; y <= nowYear; y++) arr.push(y);
    return arr.reverse();
  }, [minYear, nowYear]);

  // 드롭다운 바깥 클릭 닫기
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
    onChange?.(next); // 필요 시 미리보기
  };

  const chooseYear = (y: number) => {
    setViewYear(y);
    setYearOpen(false);
  };

  const toggleCurrent = () => {
    const next = !isCurrent;
    setIsCurrent(next);
    onCurrentChange?.(next); // (선택) 부모에 즉시 반영하고 싶을 때
  };

  const handleApply = () => {
    onApply?.(selected); // 기존 콜백 유지 (하위 호환)
    onApplyEx?.(selected, isCurrent, { pickerType }); // 확장 콜백으로 isCurrent 전달
  };

  // employmentEnd 이거나 showCurrentToggle이 true면 토글 표시
  const showToggle = pickerType === "employmentEnd" || !!showCurrentToggle;

  return (
    <div className={`cal cal--month ${className || ""}`}>
      <div className="cal_body">
        <div className="cal__header">
          <div
            className={`year-select ${yearOpen ? "is-open" : ""}`}
            ref={dropdownRef}
          >
            <span
              className="year-select__button"
              onClick={() => setYearOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={yearOpen}
              aria-label="연도 선택"
            >
              {viewYear}년
              <img
                className="year-select__arrow"
                src={ic_arrow_drop_down_gray900_24}
                alt=""
              />
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
          <span
            className="cal_bottom_items__option"
            onClick={toggleCurrent}>
            <img
              src={isCurrent ? ic_check_box_purple24 : ic_check_box_blank_gray400_24}
              alt=""/>
            재직중
          </span>
          <span
            className="default_btn_black"
            role="button"
            tabIndex={0}
            onClick={handleApply}
          >
            적용
          </span>
        </div>
      ) : (
        <div className="cal_bottom">
          <span
            className="default_btn_black"
            role="button"
            tabIndex={0}
            onClick={handleApply}
          >
            적용
          </span>
        </div>
      )}
    </div>
  );
}
