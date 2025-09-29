// components/form/FormInput.tsx
import React from 'react';

type Props = {
  id: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  required?: boolean;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;

  // ▼ 추가
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  invalid?: boolean;           // 에러 여부
  errorMessage?: string;       // 에러 텍스트(옵션)
  rightIconSrc?: string;       // 에러 아이콘 등
  rightIconAlt?: string;
  inputClassName?: string;
  leftIconSrc?: string;
  leftIconAlt?: string;
};

export default function FormInput({
  id, type = 'text', required, value, placeholder,
  onChange, onFocus, onBlur,
  invalid, errorMessage,
  rightIconSrc, rightIconAlt = '',
  inputClassName,
  leftIconSrc, leftIconAlt = '',
}: Props) {
  const hasError = Boolean(invalid || errorMessage);  
  const describedBy = errorMessage ? `${id}-error` : undefined;
  return (
    <>
  <div className={`input-group ${hasError ? 'error' : ''}`}>
  {leftIconSrc && (
                   <img src={leftIconSrc} alt={leftIconAlt} />
        )}

      <input
        id={id}
        className={`form-input ${inputClassName ?? ''}`}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
      {rightIconSrc && <img src={rightIconSrc} alt={rightIconAlt} />}
    </div>
    {errorMessage&&(
    <p id={`${id}-error`} className="form-error-text">
          {errorMessage}
        </p>)
       }
    </>
  );
}
