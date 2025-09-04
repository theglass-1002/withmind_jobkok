// src/shared/components/Pagination.tsx
import React from "react";

type Props = {
  current: number;                         // 현재 페이지 (1-based)
  total: number;                           // 전체 페이지 수
  onChange: (page: number) => void;        // 페이지 변경 핸들러
  pageWindow?: number;                     // 동시에 보여줄 페이지 버튼 개수 (기본 5)
  prevIcon?: React.ReactNode;              // 이전 버튼 아이콘 (옵션)
  nextIcon?: React.ReactNode;              // 다음 버튼 아이콘 (옵션)
};

export default function Pagination({
  current,
  total,
  onChange,
  pageWindow = 5,
  prevIcon,
  nextIcon,
}: Props) {
  if (total <= 0) return null;

  // 안전 가드
  const cur = Math.min(Math.max(1, current), total);
  const win = Math.max(1, pageWindow);

  // 페이지 윈도우 계산 (current를 가운데로)
  const half = Math.floor(win / 2);
  let start = Math.max(1, cur - half);
  let end = start + win - 1;
  if (end > total) {
    end = total;
    start = Math.max(1, end - win + 1);
  }

  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const go = (p: number) => {
    if (p < 1 || p > total || p === cur) return;
    onChange(p);
  };

  return (
    <nav className="pagination" aria-label="페이지 매김">
      {/* Prev */}
      <button
        type="button"
        className="pagination__btn pagination__prev"
        aria-label="이전 페이지"
        disabled={cur === 1}
        onClick={() => go(cur - 1)}
      >
        {prevIcon ?? "‹"}
      </button>

      <ul className="pagination__list" role="list">
        {pages.map((p) => (
          <li className="pagination__item" key={p}>
            <button
              type="button"
              className={`pagination__page ${p === cur ? "is-active" : ""}`}
              aria-current={p === cur ? "page" : undefined}
              onClick={() => go(p)}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>

      {/* Next */}
      <button
        type="button"
        className="pagination__btn pagination__next"
        aria-label="다음 페이지"
        disabled={cur === total}
        onClick={() => go(cur + 1)}
      >
        {nextIcon ?? "›"}
      </button>
    </nav>
  );
}
