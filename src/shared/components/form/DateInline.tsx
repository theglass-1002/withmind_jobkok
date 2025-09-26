// components/form/DateInline.tsx
import React from 'react';

type Props = {
  id?: string;
  iconSrc: string;           // 캘린더 아이콘 (정상/에러에 따라 부모가 선택)
  value?: string;            // 'YYYY.MM'
  onClick?: () => void;      // date picker 열기
  rightIconSrc?: string;     // 오른쪽 오류 아이콘 (선택)
  invalid?: boolean;         // 에러 여부
  errorMessage?: string;     // 에러 텍스트 (선택)
  className?: string;        // 추가 클래스
};

export default function DateInline({
  id,
  iconSrc,
  value,
  onClick,
  rightIconSrc,
  invalid,
  errorMessage,
  className,
}: Props) {
  const hasError = Boolean(invalid || errorMessage);
  const describedBy = errorMessage ? `${id ?? 'date'}-error` : undefined;

  return (
    <div className={`date-section ${className ?? ''}`}>
      <div
        className={`section__date-inner ${hasError ? 'error' : ''}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
      >
        <span className="section__date-input">
          <img src={iconSrc} alt="" />
          <span className="section__date-value">{value || 'YYYY.MM'}</span>
        </span>

        {hasError && rightIconSrc && <img src={rightIconSrc} alt="" />}
      </div>
    </div>
  );
}
