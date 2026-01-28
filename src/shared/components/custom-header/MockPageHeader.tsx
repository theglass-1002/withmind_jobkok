import React, { useState, useRef, useEffect } from "react";
import { HeaderProps } from "@/shared/utils/util";
import "./CustomHeader.css";

export default function MockPageHeader({
  leftElement,
  title,
  rightIcons,
  onLeftElementClick,
  onRightElementClick,
  sort,
  sortClassName,
  sortOptions,
  onSortChange,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  //  드롭다운 영역(아이콘+메뉴)을 감쌀 ref
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const handleOptionClick = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    onSortChange(value);
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      //  wrapRef 밖을 클릭하면 닫기
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="page-header mock">
      <div className="header-left" onClick={onLeftElementClick}>
        {leftElement}
      </div>

      {title && <span className="header-title">{title}</span>}

      {sort ? (
        //  여기! header-right에 ref 달기
        <div
          className="header-right"
          ref={wrapRef}
          onClick={() => setOpen((prev) => !prev)} // 토글
        >
          {rightIcons}

          {open && (
            <div className={`sort-control__menu ${sortClassName}`}>
              {sortOptions.map((opt) => (
                <span
                  key={opt.value}
                  className={`sort-control__option ${sortClassName} ${opt.className}`}
                  onClick={(e) => handleOptionClick(e, opt.value)}
                >
                  {opt.emoji ?? opt.emoji}
                  {opt.label}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="header-right" onClick={onRightElementClick}>
          {rightIcons}
        </div>
      )}
    </header>
  );
}
