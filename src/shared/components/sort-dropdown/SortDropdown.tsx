import React, { useState, useRef, useEffect } from "react";
import "./SortDropdown.css";




type SortDropdownProps = {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  className?: string;
};

export default function SortDropdown({
  value,
  options,
  onChange,
  className = "",
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const toggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div
      className={`sort-control ${className}`}
      ref={wrapRef}
      onClick={toggle}
    >
      <span className="sort-control__label">
        {value}
      </span>

      {open && (
        <div className="sort-control__menu">
          {options.map((opt) => (
            <span
              key={opt}
              className="sort-control__option"
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
