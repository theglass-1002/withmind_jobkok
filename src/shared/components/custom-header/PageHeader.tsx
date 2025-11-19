import React from 'react';
// 아이콘 컴포넌트를 받기 위해 import는 유지합니다.
import { ChevronLeft } from 'lucide-react';
import './PageHeader.css'; // 👈 CSS 파일명을 컴포넌트 이름에 맞게 수정했습니다.

// Props 타입을 정의합니다.
interface HeaderProps {
  leftElement?: React.ReactNode; // 뒤로가기 버튼(아이콘) 또는 텍스트
  title?: string;            // 중앙 페이지명 (버전 1의 핵심)
  rightIcons?: React.ReactNode[]; 
  onLeftElementClick?: () => void; // 왼쪽 요소 클릭 시 실행할 함수
}

/**
 * 버전 1: 페이지 헤더 (왼쪽 버튼 - 중앙 타이틀 - 오른쪽 아이콘)
 * (모든 Tailwind 클래스 제거됨)
 */
export default function PageHeader({ // 👈 컴포넌트 이름 변경: PageHeader
  leftElement, 
  title, 
  rightIcons = [], 
  onLeftElementClick 
}: HeaderProps) {

  return (
    <header className="page-header"> {/* custom-header -> page-header */}
      
      {/* 1. 왼쪽 영역 (뒤로가기 버튼/아이콘) */}
      <div className="header-left">
        {leftElement && (
          <button 
            onClick={onLeftElementClick} 
            className="icon-button"
          >
            {leftElement}
          </button>
        )}
      </div>

      {/* 2. 중앙 영역 (페이지 제목) */}
      <div className="header-center">
        {title && <h1 className="header-title">{title}</h1>}
      </div>

      {/* 3. 오른쪽 영역 (아이콘 목록) */}
      <div className="header-right">
        {rightIcons.map((icon, index) => (
          // 아이콘은 이미 ReactNode이므로, 바로 렌더링
          <div key={index} className="icon-container">
            {icon}
          </div>
        ))}
      </div>
    </header>
  );
}