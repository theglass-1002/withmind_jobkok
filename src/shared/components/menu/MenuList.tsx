// src/shared/components/menu/MenuList.tsx
import React from "react";

export type MenuOption = {
  label: string;
  value: string;
  icon?: string;
  className?: string; // delete 같은 클래스
};

interface MenuListProps {
  options: MenuOption[];
  onSelect: (value: string) => void;
  className?: string; // resume-item__menu 같은 스타일 적용
}

export default function MenuList({ options, onSelect, className }: MenuListProps) {
  return (
    <ul className={className ?? "resume-item__menu"} role="menu">
      {options.map((opt) => (
        <li
          key={opt.value}
          role="menuitem"
          className={`resume-item__menu-item ${opt.className ?? ""}`}
          onClick={() => onSelect(opt.value)}
        >
          {opt.icon && <img src={opt.icon} alt="" />}
          {opt.label}
        </li>
      ))}
    </ul>
  );
}
