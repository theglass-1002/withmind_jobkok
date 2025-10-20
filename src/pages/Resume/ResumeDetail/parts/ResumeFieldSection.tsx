import React, { ReactNode } from "react";

type Props = {
  label: ReactNode;
  children: ReactNode;
  className?: string;         // 예: "resume-field--location"
  valueAs?: "div" | "span";
  valueClassName?: string;    // 예: "resume-location-list"
};

export default function ResumeFieldSection({
  label,
  children,
  className,
  valueAs = "div",
  valueClassName,
}: Props) {
  const ValueTag = valueAs as keyof JSX.IntrinsicElements;

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
