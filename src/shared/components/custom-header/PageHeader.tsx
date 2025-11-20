import React from 'react';
import './CustomHeader.css';


// Props 타입을 정의합니다.
interface HeaderProps {
  leftElement?: React.ReactNode; // 뒤로가기 버튼(아이콘) 또는 텍스트
  title?: string;            // 중앙 페이지명 (버전 1의 핵심)
  rightIcons?: React.ReactNode; 
  onLeftElementClick?: () => void; // 왼쪽 요소 클릭 시 실행할 함수
  onRightElementClick?: () => void;
}

/**
 * 버전 1: 페이지 헤더 (왼쪽 버튼 - 중앙 타이틀 - 오른쪽 아이콘)
 * (모든 Tailwind 클래스 제거됨)
 */
export default function PageHeader({ // 👈 컴포넌트 이름 변경: PageHeader
  leftElement, 
  title, 
  rightIcons, 
  onLeftElementClick,
  onRightElementClick
}: HeaderProps) {

  return (
    <header className="page-header"> {/* custom-header -> page-header */}
      
      {/* 1. 왼쪽 영역 (뒤로가기 버튼/아이콘) */}
      <div className="header-left" onClick={onLeftElementClick}>
        {leftElement}

      </div>

      {/* 2. 중앙 영역 (페이지 제목) */}
      {title && <span className="header-title">{title}</span>}
      {/* 3. 오른쪽 영역 (아이콘 목록) */}
      <div className="header-right" onClick={onRightElementClick}>
        {rightIcons}
      </div>
    </header>
  );
}