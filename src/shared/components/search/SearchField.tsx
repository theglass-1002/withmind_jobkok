import React, { useEffect, useRef, useState } from 'react';
import './SearchField.css';

type SearchFieldProps = {
  id: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange: (v: string) => void;
  onSubmit?: (v: string) => void;
  onClear?: () => void;
  onOpen?: () => void;
  leftIconSrc?: string;
  rightIconSrc?: string;
  clearIconSrc?: string;
  disabled?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  errorIconSrc?: string;
  className?: string;
  inputClassName?: string;
  showSubmitButton?: boolean;
  submitButtonLabel?: string;
  submitButtonAriaLabel?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
};

export default function SearchField({
  id,
  value,
  defaultValue = '',
  placeholder = '검색어를 입력하세요',
  onChange,
  onSubmit,
  onClear,
  onOpen,
  leftIconSrc,
  rightIconSrc,
  clearIconSrc,
  disabled = false,
  invalid,
  errorMessage,
  errorIconSrc,
  className,
  inputClassName,
  showSubmitButton = false,
  submitButtonLabel = '검색',
  submitButtonAriaLabel = '검색',
  onFocus,
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState<string>(value ?? defaultValue);

  useEffect(() => {
    if (value !== undefined) setCurrent(value);
  }, [value]);

  const hasError = Boolean(invalid || errorMessage);
  const describedBy = errorMessage ? `${id}-error` : undefined;

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' && onSubmit) onSubmit(current);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (disabled) return;
    const next = e.target.value;
    setCurrent(next);
    onChange(next);
  };

  const clear = () => {
    if (disabled) return;
    setCurrent('');
    onClear ? onClear() : onChange('');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleClickSubmit = () => {
    if (disabled || !onSubmit) return;
    onSubmit(current);
  };

  return (
    <div
      className={[
        'search-field',
        className ?? '',
        disabled ? 'is-disabled' : '',
        hasError ? 'is-error' : '',
      ].join(' ').trim()}
      onClick={() => onOpen?.()}
    >
      {leftIconSrc && (
        <span className="search-field__icon search-field__icon--left" aria-hidden="true">
          <img src={leftIconSrc} alt="" />
        </span>
      )}

      <input
        ref={inputRef}
        id={id}
        className={[
          'search-field__input',
          leftIconSrc ? 'has-left-icon' : '',
          (rightIconSrc || errorIconSrc) ? 'has-right-icon' : '',
          inputClassName ?? '',
        ].join(' ').trim()}
        type="text"
        value={current}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        onFocus={onFocus}
      />

      {rightIconSrc && !hasError && (
        <span className="search-field__icon search-field__icon--right" aria-hidden="true">
          <img src={rightIconSrc} alt="" />
        </span>
      )}

      {hasError && errorIconSrc && (
        <span className="search-field__icon search-field__icon--right" aria-hidden="true">
          <img src={errorIconSrc} alt="" />
        </span>
      )}

      {!!clearIconSrc && !disabled && current && (
        <img
          className="search-field__clear"
          onClick={clear}
          src={clearIconSrc}
          alt=""
          role="button"
          aria-label="검색어 지우기"
        />
      )}

      {showSubmitButton && (
        <button
          type="button"
          className="search-field__submit"
          onClick={handleClickSubmit}
          aria-label={submitButtonAriaLabel}
          disabled={disabled || !onSubmit}
        >
          {submitButtonLabel}
        </button>
      )}

      {errorMessage && (
        <p id={`${id}-error`} className="search-field__error-text" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
