// components/form/FormInput.tsx
import React from 'react';

type Props = {
  id?: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  required?: boolean;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;

  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  invalid?: boolean;
  errorMessage?: string;
  rightIconSrc?: string;
  rightIconAlt?: string;
  inputClassName?: string;
  leftIconSrc?: string;
  leftIconAlt?: string;

  // ✅ 추가
  readOnly?: boolean;
};

export default function FormInput({
  id,
  type = 'text',
  required,
  value,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  invalid,
  errorMessage,
  rightIconSrc,
  rightIconAlt = '',
  inputClassName,
  leftIconSrc,
  leftIconAlt = '',

  // ✅ 기본값 false
  readOnly = false,
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
          readOnly={readOnly}   // ✅ 핵심
        />

        {rightIconSrc && (
          <img src={rightIconSrc} alt={rightIconAlt} />
        )}
      </div>

      {errorMessage && (
        <p id={`${id}-error`} className="form-error-text">
          {errorMessage}
        </p>
      )}
    </>
  );
}