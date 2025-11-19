import React from 'react';
import { X } from 'lucide-react';
import './CustomHeader.css';
// Props 타입을 정의합니다. (title이 제외됨)
interface ActionHeaderProps {
  leftElement?: React.ReactNode; // 텍스트나 닫기 버튼 (예: "취소", <X /> 아이콘)
  rightIcons?: React.ReactNode[]; // 오른쪽 아이콘 배열 (예: "저장" 버튼)
  onFirstRightElementClick?: () => void; // 왼쪽 요소 클릭 시 실행할 함수
  onSecondRightElementClick?: () => void; // 왼쪽 요소 클릭 시 실행할 함수

}

/**
 * 버전 2: 액션 헤더 (왼쪽 텍스트/버튼 - 오른쪽 아이콘)
 * (중앙 타이틀 영역 없음, 왼쪽과 오른쪽이 공간을 나눔)
 */
export default function ActionHeader({
  leftElement,
  rightIcons = [],
  onFirstRightElementClick,
  onSecondRightElementClick,
}: ActionHeaderProps) {

  
  
  return (
    <header className="action-header">
      <div className="header-title">
       {leftElement}
      </div>
      <div className="header-right-actions">
        {rightIcons.map((icon, index) => (
          <div key={index} onClick={
          ()=>{
            if(index==0){
              onFirstRightElementClick()
            }else{
              onSecondRightElementClick()
            }
          }
          } className="icon-container">
            {icon}
          </div>
        ))}
      </div>
    </header>
  );
}