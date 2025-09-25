// components/form/FormField.tsx
import React from 'react';

type Props = {
  label: React.ReactNode;             // ex) <>이름 <em>*</em></>
  className?: string;                 // ex) "in_icon email"
  children: React.ReactNode;          // 인풋/셀렉트 등
};
export default function FormField({ label, className, children }: Props) {
  return (
    <div className={`field ${className ?? ''}`}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
