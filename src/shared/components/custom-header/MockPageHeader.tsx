import React, { useState, useRef, useEffect } from "react";
// import {SortOption} from '@/shared/utils/util';
import {HeaderProps} from '@/shared/utils/util';
import './CustomHeader.css';

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
  const wrapRef = useRef<HTMLDivElement | null>(null);


  // 옵션 클릭 핸들러 (수정된 부분: e.stopPropagation() 추가)
  const handleOptionClick = (e: React.MouseEvent, value: string) => {
    e.stopPropagation(); 
    onSortChange(value);
    setOpen(false);
  };


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
    <header className="page-header mock">
      <div className="header-left" onClick={onLeftElementClick}>
        {leftElement}

      </div>
      {title && <span className="header-title">{title}</span>}
      {sort? <div className="header-right" onClick={()=>{
        setOpen(true);
      }}>
        {rightIcons}  
        {open &&( <div className={`sort-control__menu ${sortClassName}`}>
          {sortOptions.map((opt) => (
            <span
              key={opt.value}
              className={`sort-control__option ${sortClassName} ${opt.className}`}
              onClick={(e) => handleOptionClick(e, opt.value)} 
            > {opt.emoji??opt.emoji}
              {opt.label}
            </span>
          ))}
        </div>)}  
      </div>: <div className="header-right" onClick={onRightElementClick}>
        {rightIcons}    
      </div>}
     
    </header>
  );
}