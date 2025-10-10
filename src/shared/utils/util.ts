
export function stripAllWhitespace(value: string): string {
    // 스페이스/탭/개행 등 모든 공백 제거
    return value.replace(/\s+/g, "");
  }
  // 영문/숫자/특수문자 각각 1개 이상 + 공백 금지 + 8~16자
  export const pwRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s])\S{8,16}$/;

  export function isValidPassword(pw: string): boolean {
    return pwRule.test(pw);
  }
  
  // src/shared/utils/date.ts

// 월 단위 ---------------------------------------
export type MonthValue = { year: number; month: number }; // 0~11

/** "YYYY.MM" -> {year, month(0~11)} 엄격 파서 */
export const parseMonth = (s?: string | null): MonthValue | null => {
  if (!s) return null;
  const m = s.match(/^(\d{4})\.(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mm = Number(m[2]);
  if (!y || mm < 1 || mm > 12) return null;
  return { year: y, month: (mm - 1) as MonthValue["month"] };
};

/** {year, month(0~11)} -> "YYYY.MM" */
export const fmtMonth = (v: MonthValue): string =>
  `${v.year}.${String(v.month + 1).padStart(2, "0")}`;


// 일 단위 ---------------------------------------
export type DateValue = Date;

/** {Date} -> "YYYY.MM.DD" */
export const fmtDate = (d?: DateValue | null): string =>
  d
    ? `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
        d.getDate()
      ).padStart(2, "0")}`
    : "";

/** "YYYY.MM.DD" -> Date (유효성 체크 포함) */
export const parseDate = (s?: string | null): DateValue | null => {
  if (!s) return null;
  const m = s.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mm = Number(m[2]);
  const dd = Number(m[3]);
  if (!y || mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;

  const d = new Date(y, mm - 1, dd);
  // 잘못된 날짜(예: 2024.02.31) 방지: 역검증
  if (
    d.getFullYear() !== y ||
    d.getMonth() !== mm - 1 ||
    d.getDate() !== dd
  ) {
    return null;
  }
  return d;
};
