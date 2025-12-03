// src/shared/components/ui-filter/UiFilter.tsx
import React from "react";
import "./UiFilter.css";
export type UiFilterOption = {
  label: string;
  value: string;
};

interface UiFilterProps {
  options: UiFilterOption[];
  value: string;                      // 현재 선택값
  onChange: (value: string) => void;  // 선택 변경
  className?: string;                 // 페이지 전용 클래스 추가용
  itemClassName?: string; 
}

export default function UiFilter({ options, value, onChange, className, itemClassName }: UiFilterProps) {
  return (
    <div className={`ui-filter${className ? ` ${className}` : ""}`}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <span
            key={opt.value}
            className={`${itemClassName? `${itemClassName}`:'' } ui-filter__item${active?" on":""}`}
            // className={`${itemClassName} ui-filter__item${active ? " on" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onChange(opt.value);
            }}
          >
            {opt.label}
          </span>
        );
      })}
    </div>
  );
}
