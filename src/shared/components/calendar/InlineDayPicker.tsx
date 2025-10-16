// src/shared/components/calendar/InlineDayPicker.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./calendar.css";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";

type DayValue = { year: number; month: number; day: number }; // month: 0~11, day: 1~31

type Props = {
  value?: DayValue | null;
  defaultValue?: DayValue;
  onChange?: (v: DayValue) => void;
  onApply?: (v: DayValue) => void;

  minYear?: number;
  // 특정 날짜 비활성화 규칙 (y:YYYY, m:0~11, d:1~31)
  isDisabledDate?: (y: number, m: number, d: number) => boolean;

  className?: string;
};

const MONTH_LABELS = [
  "1월","2월","3월","4월","5월","6월",
  "7월","8월","9월","10월","11월","12월"
];
const WEEK_LABELS = ["일","월","화","수","목","금","토"];
const DEFAULT_MIN_YEAR = 2000;

export default function InlineDayPicker({
  value,
  defaultValue,
  onChange,
  onApply,
  minYear,
  isDisabledDate,
  className,
}: Props) {
  const now = new Date();
  const nowY = now.getFullYear();
  const nowM = now.getMonth();
  const nowD = now.getDate();

  const initial: DayValue =
    value ?? defaultValue ?? { year: nowY, month: nowM, day: nowD };

  // 드롭다운 제어
  const [yearOpen, setYearOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement | null>(null);
  const monthRef = useRef<HTMLDivElement | null>(null);

  // 뷰/선택 상태
  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);
  const [selected, setSelected] = useState<DayValue>(initial);

  // 외부에서 value 변경될 때 동기화
  useEffect(() => {
    if (value) {
      setSelected(value);
      setViewYear(value.year);
      setViewMonth(value.month);
    }
  }, [value]);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (yearOpen && yearRef.current && !yearRef.current.contains(t)) setYearOpen(false);
      if (monthOpen && monthRef.current && !monthRef.current.contains(t)) setMonthOpen(false);
    };
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("touchstart", onDown, true);
    return () => {
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("touchstart", onDown, true);
    };
  }, [yearOpen, monthOpen]);

  // 연도 리스트
  const years = useMemo(() => {
    const start = typeof minYear === "number" ? Math.min(minYear, nowY) : DEFAULT_MIN_YEAR;
    const arr: number[] = [];
    for (let y = start; y <= nowY; y++) arr.push(y);
    return arr.reverse();
  }, [minYear, nowY]);

  // 기본 비활성 규칙: 미래 날짜 선택 불가
  const defaultIsDisabled = (y: number, m: number, d: number) => {
    if (y > nowY) return true;
    if (y === nowY && m > nowM) return true;
    if (y === nowY && m === nowM && d > nowD) return true;
    return false;
  };

  // 해당 월의 총 일수
  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  // 해당 월 1일의 요일(0:일)
  const firstDayOfWeek = (y: number, m: number) => new Date(y, m, 1).getDay();

  // 날짜 그리드 생성
  const grid = useMemo(() => {
    const dim = daysInMonth(viewYear, viewMonth);
    const first = firstDayOfWeek(viewYear, viewMonth);
    const cells: Array<{ day: number | null; disabled?: boolean; isSel?: boolean }> = [];

    // 앞쪽 빈칸
    for (let i = 0; i < first; i++) cells.push({ day: null });

    for (let d = 1; d <= dim; d++) {
      const disabled = isDisabledDate
        ? isDisabledDate(viewYear, viewMonth, d)
        : defaultIsDisabled(viewYear, viewMonth, d);
      const isSel =
        selected.year === viewYear &&
        selected.month === viewMonth &&
        selected.day === d;

      cells.push({ day: d, disabled, isSel });
    }

    // 7열 맞추기 위한 뒤쪽 패딩(선택/포커스 불가)
    while (cells.length % 7 !== 0) cells.push({ day: null });

    return cells;
  }, [viewYear, viewMonth, selected, isDisabledDate]);

  const chooseYear = (y: number) => {
    setViewYear(y);
    setYearOpen(false);
    // viewYear만 바뀌면 선택은 그대로 유지
  };

  const chooseMonth = (m: number) => {
    setViewMonth(m);
    setMonthOpen(false);
  };

  const pickDay = (d: number | null) => {
    if (!d) return;
    const disabled = isDisabledDate
      ? isDisabledDate(viewYear, viewMonth, d)
      : defaultIsDisabled(viewYear, viewMonth, d);
    if (disabled) return;

    const next = { year: viewYear, month: viewMonth, day: d };
    setSelected(next);
    onChange?.(next);
  };

  const handleApply = () => {
    onApply?.(selected);
  };

  return (
    <div className={`cal cal--day ${className || ""}`}>
      <div className="cal_body">
        {/* 헤더: 연/월 드롭다운 */}
        <div className="cal__header cal__header--row">
          {/* 연도 */}
          <div className={`year-select ${yearOpen ? "is-open" : ""}`} ref={yearRef}>
            <span
              className="year-select__button"
              onClick={() => setYearOpen(o => !o)}
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

          {/* 월 */}
          <div className={`month-select ${monthOpen ? "is-open" : ""}`} ref={monthRef}>
            <span
              className="month-select__button"
              onClick={() => setMonthOpen(o => !o)}
              aria-haspopup="listbox"
              aria-expanded={monthOpen}
              aria-label="월 선택"
            >
              {MONTH_LABELS[viewMonth]}
              <img className="month-select__arrow" src={ic_arrow_drop_down_gray900_24} alt="" />
            </span>
            {monthOpen && (
              <div className="month-select__menu" role="listbox" aria-label="월">
                {MONTH_LABELS.map((label, idx) => (
                  <div
                    key={label}
                    role="option"
                    aria-selected={idx === viewMonth}
                    className={`month-select__option ${idx === viewMonth ? "is-active" : ""}`}
                    onClick={() => chooseMonth(idx)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        chooseMonth(idx);
                      }
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="daypicker__weekdays" role="row">
          {WEEK_LABELS.map((w) => (
            <div key={w} className="daypicker__weekday" role="columnheader" aria-label={w}>
              {w}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="daypicker__grid" role="grid" aria-label={`${viewYear}년 ${viewMonth + 1}월`}>
          {grid.map((cell, i) => {
            if (cell.day === null) {
              return <div key={`empty-${i}`} className="daypicker__cell daypicker__cell--empty" role="gridcell" aria-disabled="true" />;
            }
            const cls = [
              "daypicker__cell",
              cell.disabled ? "is-disabled" : "",
              cell.isSel ? "is-selected" : "",
            ].join(" ").trim();

            return (
              <button
                key={`d-${i}`}
                type="button"
                role="gridcell"
                className={cls}
                disabled={!!cell.disabled}
                aria-pressed={!!cell.isSel}
                onClick={() => pickDay(cell.day!)}
                title={`${viewYear}.${viewMonth + 1}.${cell.day}`}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="cal_bottom">
        <span className="default_btn_black" role="button" tabIndex={0} onClick={handleApply}>
          적용
        </span>
      </div>
    </div>
  );
}
