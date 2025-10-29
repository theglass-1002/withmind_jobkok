
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


export const DEFAULT_BREAKS = [20, 40, 60, 80, 100] as const;
export const DEFAULT_LABELS = ["매우 미흡", "미흡", "보통", "우수", "최우수"] as const;

export function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function segmentsFromScore(score: number, breaks = DEFAULT_BREAKS as readonly number[]) {
  const segs = Array(breaks.length).fill(0) as number[];
  let prev = 0;
  for (let i = 0; i < breaks.length; i++) {
    const end = breaks[i];
    const filled = (score - prev) / (end - prev);
    segs[i] = score >= end ? 1 : clamp01(filled);
    if (score <= end) break;
    prev = end;
  }
  return segs.map(clamp01);
}

export function bucketOf(
  score: number,
  breaks = DEFAULT_BREAKS as readonly number[],
  labels = DEFAULT_LABELS as readonly string[]
) {
  for (let i = 0; i < breaks.length; i++) {
    if (score <= breaks[i]) return { index: i, label: labels[i] };
  }
  return { index: breaks.length - 1, label: labels[breaks.length - 1] };
}

export function modifierByBucket(i: number) {
  return ["poor", "improvement", "fair", "good", "excellent"][i] ?? "fair";
}
