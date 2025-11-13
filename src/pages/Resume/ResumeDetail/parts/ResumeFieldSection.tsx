import React, { ReactNode } from "react";

type Props = {
  label: ReactNode;
  children: ReactNode;
  className?: string;         
  valueAs?: "div" | "span";
  valueClassName?: string;    
};

export default function ResumeFieldSection({
  label,
  children,
  className,
  valueAs = "div",
  valueClassName,
}: Props) {

  const ValueTag = valueAs as React.ElementType; 

  return (
    <div className={`resume-field ${className ?? ""}`.trim()}>
      <span className="resume-field__label">{label}</span>
      <ValueTag
        className={`resume-field__value ${valueClassName ?? ""}`.trim()}
      >
        {children}
      </ValueTag>
    </div>
  );
}