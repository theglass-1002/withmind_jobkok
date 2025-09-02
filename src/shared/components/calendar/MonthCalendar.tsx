// src/shared/components/calendar/MonthCalendar.tsx
import { useMemo, useState } from "react";
import "./calendar.css";

type Props = {
  value?: { year: number; month: number } | null; // month: 0~11
  defaultValue?: { year: number; month: number };
  minYear?: number;
  maxYear?: number;
  onChange?: (v: { year: number; month: number }) => void; // 월 클릭 시
  onApply?: (v: { year: number; month: number }) => void;   // 적용
  isDisabledMonth?: (year: number, month: number) => boolean;
};

const MONTH_LABELS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

export default function MonthCalendar({
  value,
  defaultValue,
  minYear = 2000,
  maxYear = 2035,
  onChange,
  onApply,
  isDisabledMonth,
}: Props) {
  const now = new Date();
  const initYear = value?.year ?? defaultValue?.year ?? now.getFullYear();
  const initMonth = value?.month ?? defaultValue?.month ?? now.getMonth();

  const [year, setYear]   = useState(initYear);
  const [month, setMonth] = useState(initMonth);

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = minYear; y <= maxYear; y++) arr.push(y);
    return arr;
  }, [minYear, maxYear]);

  const onPick = (m: number) => {
    if (isDisabledMonth?.(year, m)) return;
    setMonth(m);
    onChange?.({ year, month: m });
  };

  const handleApply = () => onApply?.({ year, month });

  return (
    <div className="cal cal--month">
      <div className="cal__header">
        <div className="select">
          <select
            aria-label="연도"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
          <span className="select__arrow">▾</span>
        </div>
      </div>

      <div className="cal__months">
        {MONTH_LABELS.map((label, idx) => {
          const disabled = isDisabledMonth?.(year, idx) ?? false;
          const isSelected = idx === month;
          return (
            <button
              key={label}
              type="button"
              className={`cal__month ${isSelected ? "is-selected" : ""}`}
              onClick={() => onPick(idx)}
              disabled={disabled}
              aria-pressed={isSelected}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="cal__footer">
        <button type="button" className="btn btn--primary" onClick={handleApply}>
          적용
        </button>
      </div>
    </div>
  );
}
