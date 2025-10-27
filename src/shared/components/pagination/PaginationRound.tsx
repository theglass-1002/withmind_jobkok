import React from "react";

type Props = {
  /** 현재 페이지 번호 */
  current: number;
  /** 전체 페이지 수 */
  total: number;
  /** 이전 버튼 클릭 핸들러 */
  onPrev?: () => void;
  /** 다음 버튼 클릭 핸들러 */
  onNext?: () => void;
  /** 아이콘 src (선택) */
  prevIconSrc?: string;
  nextIconSrc?: string;
};

export default function PaginationRound({
  current,
  total,
  onPrev,
  onNext,
  prevIconSrc,
  nextIconSrc,
}: Props) {
  return (
    <div className="pagination-round">
      <button
        className="pagination__btn pagination-round__btn pagination-round__prev"
        onClick={onPrev}
        disabled={current <= 1}
      >
        {prevIconSrc && <img src={prevIconSrc} alt="이전 페이지" />}
      </button>

      <div className="pagination-round__info pagination__info">
        <span className="pagination-round__current">{current}</span>
        <span className="pagination-round__divider">/</span>
        <span className="pagination-round__total">{total}</span>
      </div>

      <button
        className="pagination__btn pagination-round__btn pagination-round__next"
        onClick={onNext}
        disabled={current >= total}
      >
        {nextIconSrc && <img src={nextIconSrc} alt="다음 페이지" />}
      </button>
    </div>
  );
}
