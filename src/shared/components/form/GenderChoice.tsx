// components/form/GenderChoice.tsx
import React from 'react';
type Gender = 'male' | 'female' | null;

export default function GenderChoice({
  value, onChange,
}: { value: Gender; onChange: (v: Exclude<Gender, null>) => void }) {
  return (
    <div className="gender-btn_wrap">
      <div
        className={`default_btn_white ${value === 'male' ? 'on' : ''}`}
        onClick={() => onChange('male')}
        role="button"
        tabIndex={0}
        aria-pressed={value === 'male'}
      >
        남자
      </div>
      <div
        className={`default_btn_white ${value === 'female' ? 'on' : ''}`}
        onClick={() => onChange('female')}
        role="button"
        tabIndex={0}
        aria-pressed={value === 'female'}
      >
        여자
      </div>
    </div>
  );
}
