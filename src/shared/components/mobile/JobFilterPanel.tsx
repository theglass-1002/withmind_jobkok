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

import { fetchJobTree } from "@/api/job/job.api";
import { JobNode } from "@/api/job/job.types";

type FilterType = "role" | "career" | "education" | "location" | "employment";

interface JobFilterPanelProps {
  filterType?: FilterType;
  totalCount?: number;
  onClose?: () => void;
  onApply?: (filters: any) => void;
  onReset?: () => void;
}

export default function JobFilterPanel({ 
  filterType, 
  totalCount = 0,
  onClose,
  onApply,
  onReset,
}: JobFilterPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterType>(filterType ?? "role");
  const [selectedRoles, setSelectedRoles] = useState<SelectedRole[]>([]);

  const [jobTree, setJobTree] = useState<JobNode[]>([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setJobLoading(true);
        setJobError(null);
        const tree = await fetchJobTree();
        setJobTree(tree);
      } catch (e: any) {
        console.error("[JobFilterPanel] fetchJobTree 에러:", e);
        setJobError(e?.message || "직군/직무 정보를 불러오는 데 실패했습니다.");
      } finally {
        setJobLoading(false);
      }
    };

    init();
  }, []);

  const handleRoleChange = (roles: SelectedRole[]) => {
    setSelectedRoles(roles);
  };

  const handleRoleApply = (roles: SelectedRole[]) => {
    console.log("[JobFilterPanel] M_ModalJobRolePicker 적용하기 클릭");
    console.log("[JobFilterPanel] 선택된 직군/직무:", roles);
    setSelectedRoles(roles);
  };

  const handleRoleReset = () => {
    setSelectedRoles([]);
  };

  const handleRemoveChip = (roleKey: string) => {
    setSelectedRoles(prev => prev.filter(role => role.roleKey !== roleKey));
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleReset = () => {
    setSelectedRoles([]);
    if (onReset) onReset();
  };

  const handleApply = () => {
    console.log("[JobFilterPanel] 공고 보기 클릭 - totalCount:", totalCount);
    console.log("[JobFilterPanel] 최종 선택된 필터:", { roles: selectedRoles });
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
    setActiveTab(key as FilterType);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "role":
        return (
          <M_ModalJobRolePicker 
            jobTree={jobTree}
            loading={jobLoading}
            error={jobError}
            onChange={handleRoleChange}
            onApply={handleRoleApply}
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

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

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

        <Tabs
          tabs={tabItems}
          active={activeTab}
          onChange={handleTabClick}
          className="job-filter-panel__tabs default_tabs"
          itemClassName="job-filter-panel__tab-item"
          activeClassName="on"
        />

        <div className="job-filter-panel__content">
          {renderContent()}
        </div>

        <div className="job-filter-panel__footer">
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
              {totalCount.toLocaleString()}개 공고 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
