import React, { useEffect, useMemo, useState } from "react";
import "./JobFilterPanel.css";

import Tabs from "@/shared/components/tabs/Tabs";
import M_ModalJobRolePicker, { SelectedRole } from "@/shared/components/job-role-picker/mobile/M_ModalJobRolePicker";
import ModalCareerRangePicker from "@/shared/components/career-range-picker/ModalCareerRangePicker";
import ModalEducationPicker from "@/shared/components/education-picker/ModalEducationPicker";
import ModalLocationPicker, { SelectedLocation } from "@/shared/components/location-picker/ModalLocationPicker";
import ModalEmploymentTypePicker from "@/shared/components/employment-type-picker/ModalEmploymentTypePicker";
import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import chevron_right_black from "@/assets/icons/chevron_right_black.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";

import {
  fetchJobTree,
  fetchJobList,
  toCareerParam,
  toEducationCodeParam,
  toLocationCodeParam,
  EMPLOYMENT_TYPE_KEYS,
  EMPLOYMENT_ETC_KEYS,
  EmpOptionKey,
} from "@/api/job/job.api";
import { JobNode, SIZE_MAP, SORT_CODE_MAP } from "@/api/job/job.types";

type FilterType = "role" | "career" | "education" | "location" | "employment";

export type AppliedFilters = {
  roles: SelectedRole[];
  career: { min: number; max: number };
  education: string[];
  location: SelectedLocation[];
  employment: EmpOptionKey[];
};

interface JobFilterPanelProps {
  filterType?: FilterType;
  totalCount?: number;
  initialFilters?: AppliedFilters;
  onClose?: () => void;
  onApply?: (filters: AppliedFilters) => void;
  onReset?: () => void;
}

export default function JobFilterPanel({
  filterType,
  totalCount = 0,
  initialFilters,
  onClose,
  onApply,
  onReset,
}: JobFilterPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterType>(filterType ?? "role");
  const [selectedRoles, setSelectedRoles] = useState<SelectedRole[]>(initialFilters?.roles ?? []);
  const [careerRange, setCareerRange] = useState<{ min: number; max: number }>(
    initialFilters?.career ?? { min: 0, max: 10 }
  );
  const [educationSelected, setEducationSelected] = useState<string[]>(initialFilters?.education ?? []);
  const [locationSelected, setLocationSelected] = useState<SelectedLocation[]>(initialFilters?.location ?? []);
  const [employmentSelected, setEmploymentSelected] = useState<EmpOptionKey[]>(initialFilters?.employment ?? []);

  const [jobTree, setJobTree] = useState<JobNode[]>([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);

  const [dynamicTotalCount, setDynamicTotalCount] = useState<number>(totalCount);

  useEffect(() => {
    setDynamicTotalCount(totalCount);
  }, [totalCount]);

  useEffect(() => {
    if (!initialFilters) return;
    setSelectedRoles(initialFilters.roles ?? []);
    setCareerRange(initialFilters.career ?? { min: 0, max: 10 });
    setEducationSelected(initialFilters.education ?? []);
    setLocationSelected(initialFilters.location ?? []);
    setEmploymentSelected(initialFilters.employment ?? []);
  }, [initialFilters]);

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

  useEffect(() => {
    setActiveTab(filterType ?? "role");
  }, [filterType]);

  const careerLabel = useMemo(() => {
    const { min, max } = careerRange;
    if (min === 0 && max === 10) return "경력";
    if (min === 0 && max === 1) return "경력(신입)";
    if (min === 0) return `경력(신입~${max}년)`;
    if (max === 10) return `경력(${min}년 이상)`;
    return `경력(${min}~${max}년)`;
  }, [careerRange]);

  const careerChipLabel = useMemo(() => {
    const { min, max } = careerRange;

    if (min === 0 && max === 10) return null;
    if (min === 0 && max === 1) return "신입";
    if (min === 0) return `신입~${max}년`;
    if (max === 10) return `${min}년 이상`;
    return `${min}~${max}년`;
  }, [careerRange]);

  const isCareerSelected = careerRange.min !== 0 || careerRange.max !== 10;

  const eduLabelMap: Record<string, string> = {
    ANY: "학력 무관",
    HS_OR_LESS: "고교 졸업 이하",
    HS: "고등학교 졸업",
    COLLEGE_2_3: "대학 졸업(2, 3년제)",
    UNIV_4: "대학 졸업(4년제)",
    MASTER: "대학원 석사 졸업",
    PHD: "대학원 박사 졸업",
  };

  const empLabelMap: Record<EmpOptionKey, string> = {
    fullTime: "정규직",
    contract: "계약직",
    intern: "인턴",
    militaryService: "병역특례",
    foreigner: "외국인",
    disability: "장애인",
  };

  const hasFilters = useMemo(() => {
    const hasRole = selectedRoles.length > 0;
    const hasCareer = careerRange.min !== 0 || careerRange.max !== 10;
    const hasEducation = educationSelected.length > 0;
    const hasLocation = locationSelected.length > 0;
    const hasEmployment = employmentSelected.length > 0;
    return hasRole || hasCareer || hasEducation || hasLocation || hasEmployment;
  }, [
    selectedRoles.length,
    careerRange.min,
    careerRange.max,
    educationSelected.length,
    locationSelected.length,
    employmentSelected.length,
  ]);

  const fetchCountByFilters = async () => {
    try {
      const roleIds = selectedRoles.map((r) =>
        r.roleKey === r.categoryKey ? Number(r.categoryKey) : Number(r.roleKey)
      );

      const career = toCareerParam(careerRange);
      const educationCode = toEducationCodeParam(educationSelected);
      const locationCode = toLocationCodeParam(locationSelected);

      const employmentType = employmentSelected
        .filter((k) => EMPLOYMENT_TYPE_KEYS.includes(k))
        .join(",");

      const employmentEtc = employmentSelected
        .filter((k) => EMPLOYMENT_ETC_KEYS.includes(k))
        .join(",");

      const size = SIZE_MAP["15개씩"] ?? 15;
      const sortCode = SORT_CODE_MAP["최신순"] ?? "latest";

      const params: any = {
        sort: sortCode,
      };

      if (hasFilters) {
        params.categoryIdx = roleIds.length ? roleIds : undefined;
        params.career = career;
        params.educationCode = educationCode;
        params.locationCode = locationCode;
        params.employmentType = employmentType || undefined;
        params.employmentEtc = employmentEtc || undefined;
      }

      const { totalCount: nextTotalCount } = await fetchJobList(1, size, params);
      setDynamicTotalCount(nextTotalCount);
    } catch (e) {
      console.error("[JobFilterPanel] fetchCountByFilters error:", e);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchCountByFilters();
    }, 250);

    return () => clearTimeout(t);
  }, [selectedRoles, careerRange, educationSelected, locationSelected, employmentSelected, hasFilters]);

  const handleRoleApply = (roles: SelectedRole[]) => {
    setSelectedRoles(roles);
  };

  const handleRoleReset = () => {
    setSelectedRoles([]);
  };

  const handleCareerChange = (range: { min: number; max: number }) => {
    setCareerRange(range);
  };

  const handleCareerApply = (range: { min: number; max: number }) => {
    setCareerRange(range);
  };

  const handleEducationApply = (selected: string[]) => {
    setEducationSelected(selected);
  };

  const handleLocationApply = (selected: SelectedLocation[]) => {
    setLocationSelected(selected);
  };

  const handleEmploymentApply = (selected: EmpOptionKey[]) => {
    setEmploymentSelected(selected);
  };

  const handleRemoveRoleChip = (roleKey: string) => {
    setSelectedRoles((prev) => prev.filter((role) => role.roleKey !== roleKey));
  };

  const handleRemoveCareerChip = () => {
    setCareerRange({ min: 0, max: 10 });
  };

  const handleRemoveEducationChip = (key: string) => {
    setEducationSelected((prev) => prev.filter((v) => v !== key));
  };

  const handleRemoveLocationChip = (code: string) => {
    setLocationSelected((prev) => prev.filter((v) => v.code !== code));
  };

  const handleRemoveEmploymentChip = (key: EmpOptionKey) => {
    setEmploymentSelected((prev) => prev.filter((v) => v !== key));
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleReset = () => {
    setSelectedRoles([]);
    setCareerRange({ min: 0, max: 10 });
    setEducationSelected([]);
    setLocationSelected([]);
    setEmploymentSelected([]);
    if (onReset) onReset();
  };

  const handleApply = () => {
    if (onApply) {
      onApply({
        roles: selectedRoles,
        career: careerRange,
        education: educationSelected,
        location: locationSelected,
        employment: employmentSelected,
      });
    }
    if (onClose) onClose();
  };

  const tabItems = [
    { key: "role", label: `직군ㆍ직무(${selectedRoles.length})` },
    { key: "career", label: careerLabel },
    { key: "education", label: `학력(${educationSelected.length})` },
    { key: "location", label: `지역(${locationSelected.length})` },
    { key: "employment", label: `채용 유형(${employmentSelected.length})` },
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
            value={selectedRoles}
            onApply={handleRoleApply}
            onReset={handleRoleReset}
          />
        );
      case "career":
        return (
          <ModalCareerRangePicker
            initialRange={careerRange}
            onChange={handleCareerChange}
            onApply={handleCareerApply}
          />
        );
      case "education":
        return (
          <ModalEducationPicker
            initialSelected={educationSelected}
            onChange={setEducationSelected}
            onApply={handleEducationApply}
          />
        );
      case "location":
        return (
          <ModalLocationPicker
            initialSelected={locationSelected}
            onChange={setLocationSelected}
            onApply={handleLocationApply}
          />
        );
      case "employment":
        return (
          <ModalEmploymentTypePicker
            initialSelected={employmentSelected}
            onChange={setEmploymentSelected}
            onApply={handleEmploymentApply}
          />
        );
      default:
        return null;
    }
  };

  const hasAnyChips =
    selectedRoles.length > 0 ||
    isCareerSelected ||
    educationSelected.length > 0 ||
    locationSelected.length > 0 ||
    employmentSelected.length > 0;

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
      <div className="job-filter-panel__backdrop" onClick={handleClose} aria-hidden="true" />

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

        <div className="job-filter-panel__content">{renderContent()}</div>

        <div className="job-filter-panel__footer">
          <div className="job-filter-panel__selected-chips">
            {hasAnyChips ? (
              <div className="jobs-chips">
                {selectedRoles.map((role) => (
                  <div key={role.roleKey} className="jobs-chips__item">
                    <span className="job-role-picker__chip-group">{role.categoryTitle}</span>
                    <span className="job-role-picker__chip-role">
                      <span className="job-role-picker__chip-chevron">
                        <img src={chevron_right_black} alt="" />
                      </span>
                      {role.roleLabel}
                    </span>
                    <img
                      onClick={() => handleRemoveRoleChip(role.roleKey)}
                      style={{ cursor: "pointer" }}
                      src={ic_close_gray500_20}
                      alt=""
                    />
                  </div>
                ))}

                {isCareerSelected && careerChipLabel && (
                  <div className="jobs-chips__item">
                    <span className="job-role-picker__chip-role">{careerChipLabel}</span>
                    <img
                      onClick={handleRemoveCareerChip}
                      style={{ cursor: "pointer" }}
                      src={ic_close_gray500_20}
                      alt=""
                    />
                  </div>
                )}

                {educationSelected.map((key) => (
                  <div key={key} className="jobs-chips__item">
                    <span className="job-role-picker__chip-group">학력</span>
                    <span className="job-role-picker__chip-role">
                      <span className="job-role-picker__chip-chevron">
                        <img src={chevron_right_black} alt="" />
                      </span>
                      {eduLabelMap[key] || key}
                    </span>
                    <img
                      onClick={() => handleRemoveEducationChip(key)}
                      style={{ cursor: "pointer" }}
                      src={ic_close_gray500_20}
                      alt=""
                    />
                  </div>
                ))}

                {locationSelected.map((loc) => (
                  <div key={loc.code} className="jobs-chips__item">
                    {loc.districtName === "전체" ? (
                      <span className="job-role-picker__chip-group">{loc.regionName} 전체</span>
                    ) : (
                      <>
                        <span className="job-role-picker__chip-group">{loc.regionName}</span>
                        <span className="job-role-picker__chip-role">
                          <span className="job-role-picker__chip-chevron">
                            <img src={chevron_right_black} alt="" />
                          </span>
                          {loc.districtName}
                        </span>
                      </>
                    )}
                    <img
                      onClick={() => handleRemoveLocationChip(loc.code)}
                      style={{ cursor: "pointer" }}
                      src={ic_close_gray500_20}
                      alt=""
                    />
                  </div>
                ))}

                {employmentSelected.map((key) => (
                  <div key={key} className="jobs-chips__item">
                    <span className="job-role-picker__chip-group">채용 유형</span>
                    <span className="job-role-picker__chip-role">
                      <span className="job-role-picker__chip-chevron">
                        <img src={chevron_right_black} alt="" />
                      </span>
                      {empLabelMap[key] || key}
                    </span>
                    <img
                      onClick={() => handleRemoveEmploymentChip(key)}
                      style={{ cursor: "pointer" }}
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
            <button className="btn_w_full default_btn_white" type="button" onClick={handleReset}>
              <img src={ic_replay_gray900_20} alt="" /> 초기화
            </button>
            <button className="btn_w_full default_btn_black" type="button" onClick={handleApply}>
              {dynamicTotalCount.toLocaleString()}개 공고 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
