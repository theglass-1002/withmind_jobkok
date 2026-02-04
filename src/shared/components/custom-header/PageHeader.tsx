import React from "react";
import "./CustomHeader.css";

interface HeaderProps {
  leftElement?: React.ReactNode;
  title?: string;
  rightIcons?: React.ReactNode;
  onLeftElementClick?: () => void;
  onRightElementClick?: () => void;
  pageHeaderClassName?: string;
}

export default function PageHeader({
  leftElement,
  title,
  rightIcons,
  onLeftElementClick,
  onRightElementClick,
  pageHeaderClassName,
}: HeaderProps) {
  return (
    <header className={`page-header ${pageHeaderClassName ?? ""}`}>
      <div className="header-left" onClick={onLeftElementClick}>
        {leftElement}
      </div>

      {title && <span className="header-title">{title}</span>}

      <div className="header-right" onClick={onRightElementClick}>
        {rightIcons}
      </div>
    </header>
  );
}
