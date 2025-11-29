// src/pages/.../JobFilterPanel.tsx
import React, { useEffect, useState } from "react";
import "./JobFilterPanel.css";
import Tabs from "@/shared/components/tabs/Tabs";

import M_ModalJobRolePicker, { SelectedRole } from "@/shared/components/job-role-picker/mobile/M_ModalJobRolePicker";
import ModalCareerRangePicker from "@/shared/components/career-range-picker/ModalCareerRangePicker";
import ModalEducationPicker from "@/shared/components/education-picker/ModalEducationPicker";
import ModalLocationPicker from "@/shared/components/location-picker/ModalLocationPicker";
import ModalEmploymentTypePicker from "@/shared/components/employment-type-picker/ModalEmploymentTypePicker";
import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import ic_close_gray500_20 from '@/assets/icons/size20/ic_close_gray500_20.png';

type FilterType = "role" | "career" | "education" | "location" | "employment";

interface JobFilterPanelProps {
  filterType?: FilterType;
  onClose?: () => void;
  onApply?: (filters: any) => void; // 필터 적용 시 콜백
  onReset?: () => void; // 초기화 시 콜백
}

export default function JobFilterPanel({ 
  filterType, 
  onClose,
  onApply,
  onReset,
}: JobFilterPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterType>(filterType ?? "role");
  
  // 직군·직무 선택값
  const [selectedRoles, setSelectedRoles] = useState<SelectedRole[]>([]);

  // 직군·직무 선택값 변경 핸들러
  const handleRoleChange = (roles: SelectedRole[]) => {
    console.log("📝 JobFilterPanel에서 받은 선택값:", roles);
    setSelectedRoles(roles);
  };

  // 직군·직무 초기화 핸들러
  const handleRoleReset = () => {
    console.log("🔄 직군·직무 초기화");
    setSelectedRoles([]);
  };

  // 칩 삭제 (부모에서도 삭제 가능)
  const handleRemoveChip = (roleKey: string) => {
    console.log("🗑️ 부모에서 칩 삭제:", roleKey);
    setSelectedRoles(prev => prev.filter(role => role.roleKey !== roleKey));
  };

  // X 버튼 (닫기) 클릭
  const handleClose = () => {
    console.log("🚪 필터 패널 닫기");
    if (onClose) onClose();
  };

  // 초기화 버튼 클릭
  const handleReset = () => {
    console.log("🔄 필터 초기화");
    setSelectedRoles([]);
    if (onReset) onReset();
  };

  // 적용 버튼 클릭
  const handleApply = () => {
    console.log("✅ 필터 적용");
    console.log("✅ 선택된 직군·직무:", selectedRoles);
    if (onApply) onApply({ roles: selectedRoles });
    if (onClose) onClose();
  };

  const tabItems = [
    { key: "role", label: `직군ㆍ직무(${selectedRoles.length})` },
    { key: "career", label: "경력(0)" },
    { key: "education", label: "학력(0)" },
    { key: "location", label: "지역(0)" },
    { key: "employment", label: "채용 유형(0)" },
  ];

  const handleTabClick = (key: string) => {
    console.log("📑 탭 변경:", key);
    setActiveTab(key as FilterType);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "role":
        return (
          <M_ModalJobRolePicker 
            onChange={handleRoleChange} 
            onReset={handleRoleReset}
          />
        );
      case "career":
        return <ModalCareerRangePicker />;
      case "education":
        return <ModalEducationPicker />;
      case "location":
        return <ModalLocationPicker />;
      case "employment":
        return <ModalEmploymentTypePicker />;
      default:
        return null;
    }
  };

  // 🔒 패널 열려 있는 동안 body 스크롤 막기
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="job-filter-panel__overlay">
      {/* 배경 클릭으로 닫기 */}
      <div
        className="job-filter-panel__backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="job-filter-panel" role="dialog" aria-modal="true" aria-labelledby="filter-title">
        <header className="job-filter-panel__header">
          <img
            src={ic_close_gray900_24}
            alt="닫기"
            className="job-filter-panel__close-icon"
            onClick={handleClose}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClose();
              }
            }}
          />
          <span id="filter-title" className="job-filter-panel__title">필터</span>
          <span></span>
        </header>

        {/* 탭 */}
        <Tabs
          tabs={tabItems}
          active={activeTab}
          onChange={handleTabClick}
          className="job-filter-panel__tabs default_tabs"
          itemClassName="job-filter-panel__tab-item"
          activeClassName="on"
        />

        {/* 내용 */}
        <div className="job-filter-panel__content">
          {renderContent()}
        </div>

        {/* 바텀 (고정) */}
        <div className="job-filter-panel__footer">
          {/* 선택된 칩 표시 */}
          <div className="job-filter-panel__selected-chips">
            {selectedRoles.length > 0 ? (
              <div className="jobs-chips">
                {selectedRoles.map((role) => (
                  <div key={role.roleKey} className="jobs-chips__item">
                    <span className="job-role-picker__chip-group">
                      {role.categoryTitle}
                    </span>
                    <span className="job-role-picker__chip-role">
                      <span className="job-role-picker__chip-chevron">
                        <img src={chevron_right_black} alt="" />
                      </span>
                      {role.roleLabel}
                    </span>
                    <img 
                      onClick={() => handleRemoveChip(role.roleKey)}
                      style={{ cursor: 'pointer' }}
                      src={ic_close_gray500_20} 
                      alt="" 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>

          {/* 버튼 */}
          <div className="btn_wrap">
            <button 
              className="btn_w_full default_btn_white" 
              type="button"
              onClick={handleReset}
            >
              <img src={ic_replay_gray900_20} alt="" /> 초기화
            </button>
            <button 
              className="btn_w_full default_btn_black" 
              type="button"
              onClick={handleApply}
            >
              공고 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
