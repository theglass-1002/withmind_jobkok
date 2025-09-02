// src/shared/components/calendar/DateCalendar.tsx
import { useMemo, useState } from "react";
import "./calendar.css";

type Props = {
  value?: Date | null;
  defaultValue?: Date;
  minYear?: number;
  maxYear?: number;
  onChange?: (date: Date) => void;   // 날짜 클릭 시
  onApply?: (date: Date) => void;    // "적용" 버튼
};

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTH_LABELS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

function getMonthMatrix(year: number, month: number) {
  // month: 0~11
  const firstDayIdx = new Date(year, month, 1).getDay(); // 0(일)~6(토)
  const lastDate = new Date(year, month + 1, 0).getDate(); // 말일
  const cells: (number | null)[] = Array(firstDayIdx).fill(null).concat(
    Array.from({ length: lastDate }, (_, i) => i + 1)
  );
  // 6줄 × 7칸 = 42 셀로 맞춤
  while (cells.length < 42) cells.push(null);
  return cells;
}

export default function DateCalendar({
  value,
  defaultValue,
  minYear = 2000,
  maxYear = 2035,
  onChange,
  onApply,
}: Props) {
  const init = value ?? defaultValue ?? new Date();
  const [year, setYear] = useState(init.getFullYear());
  const [month, setMonth] = useState(init.getMonth()); // 0~11
  const [selected, setSelected] = useState<Date>(new Date(init.getFullYear(), init.getMonth(), init.getDate()));

  const matrix = useMemo(() => getMonthMatrix(year, month), [year, month]);

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = minYear; y <= maxYear; y++) arr.push(y);
    return arr;
  }, [minYear, maxYear]);

  const onPick = (d: number | null) => {
    if (!d) return;
    const next = new Date(year, month, d);
    setSelected(next);
    onChange?.(next);
  };

  const handleApply = () => {
    onApply?.(selected);
  };

  return (
    <div className="cal">
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

        <div className="select">
          <select
            aria-label="월"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTH_LABELS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
          <span className="select__arrow">▾</span>
        </div>
      </div>

      <div className="cal__week">
        {WEEK_LABELS.map((w) => (
          <div key={w} className="cal__weekcell">{w}</div>
        ))}
      </div>

      <div className="cal__grid">
        {matrix.map((d, i) => {
          const isSelected =
            d !== null &&
            selected.getFullYear() === year &&
            selected.getMonth() === month &&
            selected.getDate() === d;

          return (
            <button
              key={i}
              type="button"
              className={`cal__cell ${d ? "" : "cal__cell--empty"} ${isSelected ? "is-selected" : ""}`}
              onClick={() => onPick(d)}
              disabled={!d}
            >
              {d ?? ""}
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
