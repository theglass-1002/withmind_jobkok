// components/form/DateInline.tsx
import React from 'react';

type Props = {
  iconSrc: string;
  value?: string;   // 'YYYY.MM'
  onClick?: () => void; // date picker 열기
  rightIconSrc?: string; // 오류 아이콘
};
export default function DateInline({ iconSrc, value, onClick, rightIconSrc }: Props) {
  return (
    <div className="date-section">
      <div className="section__date-inner" onClick={onClick} role="button" tabIndex={0}>
        <span className="section__date-input">
          <img src={iconSrc} alt="" />
          <span className="section__date-value">{value || 'YYYY.MM'}</span>
        </span>
        {rightIconSrc && <img src={rightIconSrc} alt="" />}
      </div>
    </div>
  );
}
