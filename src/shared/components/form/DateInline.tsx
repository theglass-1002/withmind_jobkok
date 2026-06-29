// components/form/DateInline.tsx
import React from 'react';

type Props = {
  id?: string;
  iconSrc: string;
  value?: string;
  onClick?: () => void;
  rightIconSrc?: string;
  invalid?: boolean;
  errorMessage?: string;
  className?: string;
  /** 달력 팝오버 열림 여부 → true면 .on 클래스 부여 */
  isOpen?: boolean;
  disabled?: boolean;
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
  isOpen = false,
  disabled = false,
}: Props) {
  const hasError = Boolean(invalid || errorMessage);
  const describedBy = errorMessage ? `${id ?? 'date'}-error` : undefined;

  const innerClass = [
    'section__date-inner',
    hasError ? 'error' : '',
    isOpen ? 'on' : '',
    disabled ? 'disabled' : '',
  ].join(' ').trim();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div className={`date-section ${className ?? ''}`}>
      <div
        className={innerClass}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        aria-expanded={isOpen || undefined}
        aria-controls={isOpen ? `${id}-popover` : undefined}
        style={disabled ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : undefined}
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
