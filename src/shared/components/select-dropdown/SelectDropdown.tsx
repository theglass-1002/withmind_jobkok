// SelectDropdown.tsx
import React, { useState } from 'react';
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import "./SelectDropdown.css";

type SelectDropdownProps = {
  label: string;
  required?: boolean;
  placeholder: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  helperText?: string;
  errorText?: string;
  errorIconSrc?: string;     
  disabled?: boolean;
  className?: string;
};

export default function SelectDropdown({
  label,
  required = false,
  placeholder,
  options,
  value,
  onChange,
  helperText,
  errorText,
  errorIconSrc,       
  disabled = false,
  className = '',
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`select-dropdown ${className}`}>
      <label className="select-dropdown__label">
        {label}
        {required && <em className="select-dropdown__required">*</em>}
      </label>
      
      <div 
        className={`select-dropdown__control 
          ${isOpen ? 'open' : ''} 
          ${errorText||errorIconSrc ? 'error' : ''} 
          ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="select-dropdown__placeholder">
          {selectedOption?.label || placeholder}
        </span>


        <span className={`select-dropdown__icon ${isOpen ? 'rotate' : ''}`}>
          {errorText|| errorIconSrc && (
            <img className="select-dropdown__error-icon" src={errorIconSrc} alt="error" />
          )}
          <img src={ic_arrow_drop_down_gray900_24} alt="open" />
        </span>
      </div>

      {isOpen && !disabled && (
        <div className="select-dropdown__menu">
          {options.map((option) => (
            <div
              key={option.value}
              className={`select-dropdown__option ${value === option.value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {errorText && (
        <span className="select-dropdown__error">{errorText}</span>
      )}
      {!errorText && helperText && (
        <span className="select-dropdown__helper">{helperText}</span>
      )}
    </div>
  );
}
