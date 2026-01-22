import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import search from "@/assets/icons/size20/ic_search_gray900_20.png";
import cancel from "@/assets/icons/size20/ic_cancel_gray400_20.png";
import arrow_drop_up_black from "@/assets/icons/arrow_drop_up_black.png";
import arrow_drop_down from "@/assets/icons/arrow_drop_down.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import refresh_gray from "@/assets/icons/refresh_gray.png";
import chevron_right_black from "@/assets/icons/chevron_right_black.png";
import grid_gray from "@/assets/icons/grid_gray.png";
import grid_black from "@/assets/icons/grid_black.png";
import row_white from "@/assets/icons/row_gray.png";
import row_black from "@/assets/icons/row_black.png";
import arrow_left from "@/assets/icons/keyboard_arrow_left.png";
import arrow_right from "@/assets/icons/keyboard_arrow_right.png";

import ModalJobRolePicker from "@/shared/components/job-role-picker/ModalJobRolePicker";
import ModalCareerRangePicker from "@/shared/components/career-range-picker/ModalCareerRangePicker";
import ModalEducationPicker from "@/shared/components/education-picker/ModalEducationPicker";
import ModalLocationPicker from "@/shared/components/location-picker/ModalLocationPicker";
import ModalEmploymentTypePicker from "@/shared/components/employment-type-picker/ModalEmploymentTypePicker";
import SortDropdown from "@/shared/components/sort-dropdown/SortDropdown";

import JobPostingRow from "@/shared/components/job-posting-item/JobPostingRow";
import JobPostingCard from "@/shared/components/job-posting-item/JobPostingCard";

import Tooltip from "@/shared/components/tooltip/Tooltip";
import Pagination from "@/shared/components/Pagination";

import {
  fetchJobTree,
  fetchJobList,
  toCareerParam,
  educationKeyToCode,
  toEducationCodeParam,
  LocationSelectedItem,
  toLocationCodeParam,
  EmpOptionKey,
  EMPLOYMENT_TYPE_KEYS,
  EMPLOYMENT_ETC_KEYS,
} from "@/api/job/job.api";
import { JobNode, JobItem, SORT_CODE_MAP, SIZE_MAP } from "@/api/job/job.types";
import { logout } from "@/api/auth/auth.api";
import { Icons } from "@/assets/icons";
import JobEmptyResult from "@/shared/components/empty/job/JobEmptyResult";

type ChipKind = "role" | "career" | "education" | "location" | "employmentType" | "employmentEtc";

type Chip = {
  id: string;
  group?: string;
  role?: string;
  kind?: ChipKind;
  value?: string;
};

type FilterKey = "role" | "career" | "education" | "location" | "employment";

type RoleSelectedItem = {
  categoryId: number;
  categoryName: string;
  roleId: number;
  roleName: string;
};

export default function AllJobPostingSection() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [resumeReco, setResumeReco] = useState(false);

  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [sort, setSort] = useState("적합도순");
  const [sizeSort, setSizeSort] = useState("15개씩");
  const [view, setView] = useState(0);

  const sortOptions = ["적합도순", "최신순", "인기순", "마감임박순"];
  const sizeSortOptions = ["15개씩", "30개씩", "45개씩"];

  const [chips, setChips] = useState<Chip[]>([]);

  const [roleSelected, setRoleSelected] = useState<RoleSelectedItem[]>([]);
  const [careerRange, setCareerRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 10,
  });
  const [educationSelected, setEducationSelected] = useState<string[]>([]);
  const [locationSelected, setLocationSelected] = useState<LocationSelectedItem[]>([]);
  const [employmentSelected, setEmploymentSelected] = useState<EmpOptionKey[]>([]);

  const [jobTree, setJobTree] = useState<JobNode[]>([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);

  const [allJobs, setAllJobs] = useState<JobItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [initialized, setInitialized] = useState(false);

  // 초기 진입 시 필터 트리(직군/직무)만 로딩
  useEffect(() => {
    const init = async () => {
      try {
        setJobLoading(true);
        setJobError(null);

        const tree = await fetchJobTree();
        setJobTree(tree);
        setInitialized(true);
      } catch (e: any) {
        console.error(e);

        if (e?.code === 999) {
          logout();
          navigate("/login");
          return;
        }

        setJobError(e?.message || "초기 로딩 중 직군/직무 정보를 불러오는 데 실패했습니다.");
      } finally {
        setJobLoading(false);
      }
    };

    init();
  }, [navigate]);

  // 현재 필터가 하나라도 적용되어 있는지 판단
  const hasFilters = useMemo(() => {
    const hasRole = roleSelected.length > 0;
    const hasCareer = careerRange.min !== 0 || careerRange.max !== 10;
    const hasEducation = educationSelected.length > 0;
    const hasLocation = locationSelected.length > 0;
    const hasEmployment = employmentSelected.length > 0;
    return hasRole || hasCareer || hasEducation || hasLocation || hasEmployment;
  }, [
    roleSelected.length,
    careerRange.min,
    careerRange.max,
    educationSelected.length,
    locationSelected.length,
    employmentSelected.length,
  ]);

  // 공고 리스트 로딩(무필터/필터 공통). 중복 호출 방지를 위해 한 곳에서만 fetchJobList 호출
  useEffect(() => {
    if (!initialized) return;
    const loadJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);

        const size = SIZE_MAP[sizeSort] ?? 15;
        const sortCode = SORT_CODE_MAP[sort] ?? "latest";
        
        const roleIds = roleSelected.map((r) => (r.roleId === 0 ? r.categoryId : r.roleId));
        const career = toCareerParam(careerRange);
        const educationCode = toEducationCodeParam(educationSelected);
        const locationCode = toLocationCodeParam(locationSelected);

        const employmentType = employmentSelected
          .filter((k) => EMPLOYMENT_TYPE_KEYS.includes(k))
          .join(",");

        const employmentEtc = employmentSelected
          .filter((k) => EMPLOYMENT_ETC_KEYS.includes(k))
          .join(",");

          const params: any = {
            sort: sortCode,   //  sortCode -> sort
          };

        if (hasFilters) {
          params.categoryId = roleIds.length ? roleIds : undefined;
          params.career = career;
          params.educationCode = educationCode;
          params.locationCode = locationCode;
          params.employmentType = employmentType || undefined;
          params.employmentEtc = employmentEtc || undefined;
        }

        const { jobs, totalPages, totalCount } = await fetchJobList(page, size, params);
        setAllJobs(jobs);
        setJobs(resumeReco ? jobs.filter((j) => j.aiPick === true) : jobs);
        setTotalPages(totalPages);
        setTotalCount(totalCount);
      } catch (e: any) {
        console.error(e);

        if (e?.code === 999) {
          logout();
          navigate("/login");
          return;
        }

        setJobsError(e?.message || "공고를 불러오는 데 실패했습니다.");
      } finally {
        setJobsLoading(false);
      }
    };

    loadJobs();
  }, [
    initialized,
    navigate,
    page,
    sizeSort,
    sort,
    resumeReco,
    hasFilters,
    roleSelected,
    careerRange,
    educationSelected,
    locationSelected,
    employmentSelected,
  ]);

  // 필터 메뉴 토글
  const toggleFilter = (key: FilterKey) => setOpenFilter((prev) => (prev === key ? null : key));

  // 필터 전체 초기화
  const resetFilters = () => {
    setChips([]);
    setRoleSelected([]);
    setCareerRange({ min: 0, max: 10 });
    setEducationSelected([]);
    setLocationSelected([]);
    setEmploymentSelected([]);
    setOpenFilter(null);
    setPage(1);
  };

  // 칩 제거 시 해당 필터 상태도 함께 제거하고 1페이지로 이동
  const removeChip = (chip: Chip) => {
    setChips((prev) => prev.filter((c) => c.id !== chip.id));

    switch (chip.kind) {
      case "role":
        setRoleSelected((prev) =>
          prev.filter(
            (r) => `role-${r.roleId}` !== chip.id && `role-all-${r.categoryId}` !== chip.id
          )
        );
        break;

      case "career":
        setCareerRange({ min: 0, max: 10 });
        break;

      case "education":
        setEducationSelected((prev) => prev.filter((e) => `edu-${e}` !== chip.id));
        break;

      case "location":
        setLocationSelected((prev) => prev.filter((l) => l.code !== chip.id));
        break;

      case "employmentType":
      case "employmentEtc":
        setEmploymentSelected((prev) => prev.filter((e) => e !== chip.value));
        break;
    }

    setPage(1);
  };

  // 지역 필터 적용
  const handleLocationApply = (selected: LocationSelectedItem[]) => {
    setLocationSelected(selected);

    const locationChips: Chip[] = selected.map((s) => {
      if (s.districtName === "전체") {
        return { id: `${s.code}`, role: `${s.regionName} 전체`, kind: "location" };
      }
      return { id: `${s.code}`, group: s.regionName, role: s.districtName, kind: "location" };
    });

    setChips((prev) => {
      const others = prev.filter((chip) => chip.kind !== "location");
      return [...others, ...locationChips];
    });

    setPage(1);
    setOpenFilter(null);
  };

  // 경력 필터 적용
  const handleCareerApply = (range: { min: number; max: number }) => {
    setCareerRange(range);

    const { min, max } = range;
    let label = "";
    if (min === 0 && max === 1) label = "신입";
    else if (min === 0 && max === 10) label = "경력전체";
    else if (min === 0) label = `~${max}년`;
    else if (max === 10) label = `${min}년 이상`;
    else label = `${min}~${max}년`;

    const careerChip: Chip = {
      id: "career",
      role: label,
      kind: "career",
      value: toCareerParam(range),
    };

    setChips((prev) => {
      const others = prev.filter((chip) => chip.kind !== "career");
      return [...others, careerChip];
    });

    setPage(1);
    setOpenFilter(null);
  };

  // 학력 필터 적용
  const handleEducationApply = (selected: string[]) => {
    setEducationSelected(selected);

    const eduLabelMap: Record<string, string> = {
      ANY: "학력 무관",
      HS_OR_LESS: "고교 졸업 이하",
      HS: "고등학교 졸업",
      COLLEGE_2_3: "대학 졸업(2, 3년제)",
      UNIV_4: "대학 졸업(4년제)",
      MASTER: "대학원 석사 졸업",
      PHD: "대학원 박사 졸업",
    };

    const eduChips: Chip[] = selected.map((key) => ({
      id: `edu-${key}`,
      group: "학력",
      role: eduLabelMap[key] || key,
      kind: "education",
      value: educationKeyToCode[key],
    }));

    setChips((prev) => {
      const others = prev.filter((chip) => chip.kind !== "education");
      return [...others, ...eduChips];
    });

    setPage(1);
    setOpenFilter(null);
  };

  // 채용유형 필터 적용
  const handleEmploymentApply = (selected: EmpOptionKey[]) => {
    setEmploymentSelected(selected);

    const empLabelMap: Record<EmpOptionKey, string> = {
      fullTime: "정규직",
      contract: "계약직",
      intern: "인턴",
      militaryService: "병역특례",
      foreigner: "외국인",
      disability: "장애인",
    };

    const empChips: Chip[] = selected.map((key) => {
      const isType = EMPLOYMENT_TYPE_KEYS.includes(key);
      return {
        id: key,
        role: empLabelMap[key],
        kind: isType ? "employmentType" : "employmentEtc",
        value: key,
      };
    });

    setChips((prev) => {
      const others = prev.filter(
        (chip) => chip.kind !== "employmentType" && chip.kind !== "employmentEtc"
      );
      return [...others, ...empChips];
    });

    setPage(1);
    setOpenFilter(null);
  };

  // 직군/직무 필터 적용
  const handleRoleApply = (selected: RoleSelectedItem[]) => {
    setRoleSelected(selected);

    const roleChips: Chip[] = selected.map((s) => {
      const isAll = s.roleId === -1 || s.roleName === "전체";
      if (isAll) return { id: `role-all-${s.categoryId}`, role: `${s.categoryName} 전체`, kind: "role" };
      return { id: `role-${s.roleId}`, group: s.categoryName, role: s.roleName, kind: "role" };
    });

    setChips((prev) => {
      const others = prev.filter((chip) => chip.kind !== "role");
      return [...others, ...roleChips];
    });

    setPage(1);
    setOpenFilter(null);
  };

  // 이력서 기반 추천 토글
  const handleResumeRecoToggle = (checked: boolean) => {
    setResumeReco(checked);
    setPage(1);
  };

  if (
    (jobLoading || jobsLoading) &&
    !jobError &&
    !jobsError &&
    jobTree.length === 0 &&
    jobs.length === 0
  ) {
    return <LoadingOverlay />;
  }

  const roleChipCount = chips.filter((chip) => chip.kind === "role").length;
  const careerChipCount = chips.filter((chip) => chip.kind === "career").length;
  const careerRole = chips.find((chip) => chip.kind === "career")?.role;
  const educationChipCount = chips.filter((chip) => chip.kind === "education").length;
  const locationChipCount = chips.filter((chip) => chip.kind === "location").length;
  const employmentChipCount = chips.filter(
    (chip) => chip.kind === "employmentType" || chip.kind === "employmentEtc"
  ).length;

  return (
    <>
      <div className="jobs-toolbar">
        <div className="jobs-toolbar__search">
          <div className="panel-search">
            <img className="jobs-search__icon" src={search} alt="" />
            <input type="text" placeholder="직무, 기업명, 지역등을 입력해주세요" />
            <span className="jobs-search__clear_icon">
              <img src={cancel} alt="" />
            </span>
          </div>

          <div className="job-search-filters">
            <div className="job-search-filter job-search-filter--toggle">
              <div className="job-search-filter__label">
                <span className="job-search-filter__text">이력서 기반 추천</span>
                <Tooltip
                  title="이력서 기반 추천이란?"
                  desc="등록된 기본 이력서를 기반으로, 적합한 채용 공고를 찾아주는 잡콕만의 AI 추천 서비스입니다. 적합도가 높은 공고에는 [AI Pick] 태그가 표시됩니다."
                  position="top"
                  className="job-posting__tooltip"
                />
              </div>
              <Switch
                checked={resumeReco}
                onChange={handleResumeRecoToggle}
                onColor="#000000"
                offColor="#E5E7EB"
                onHandleColor="#FFFFFF"
                offHandleColor="#FFFFFF"
                handleDiameter={18}
                height={22}
                width={42}
                uncheckedIcon={false}
                checkedIcon={false}
                aria-label="이력서 기반 추천"
              />
            </div>

            <ul className="job-search-filter-menu">
              <li
                className={`job-search-filter-menu__item ${openFilter === "role" ? "on" : ""} ${
                  roleChipCount > 0 ? "selected" : ""
                }`}
                onClick={() => toggleFilter("role")}
              >
                <span className="job-search-filter-menu__label">
                  직군ㆍ직무
                  {roleChipCount > 0 ? <span className="chip-label">{roleChipCount}</span> : null}
                </span>
                {openFilter === "role" ? (
                  <div
                    className="job-filter__popup"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <ModalJobRolePicker
                      jobTree={jobTree}
                      loading={jobLoading}
                      error={jobError}
                      onApply={handleRoleApply}
                      initialSelected={roleSelected}
                    />
                  </div>
                ) : null}
              </li>

              <li
                className={`job-search-filter-menu__item ${openFilter === "career" ? "on" : ""} ${
                  careerChipCount > 0 ? "selected" : ""
                }`}
                onClick={() => toggleFilter("career")}
              >
                <span className="job-search-filter-menu__label">
                  경력
                  {careerChipCount > 0 ? <span className="chip-label">{careerRole}</span> : null}
                </span>

                {openFilter === "career" ? (
                  <div
                    className="job-filter__popup"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <ModalCareerRangePicker onApply={handleCareerApply} initialRange={careerRange} />
                  </div>
                ) : null}
              </li>

              <li
                className={`job-search-filter-menu__item ${openFilter === "education" ? "on" : ""} ${
                  educationChipCount > 0 ? "selected" : ""
                }`}
                onClick={() => toggleFilter("education")}
              >
                <span className="job-search-filter-menu__label">
                  학력
                  {educationChipCount > 0 ? <span className="chip-label">{educationChipCount}</span> : null}
                </span>

                {openFilter === "education" ? (
                  <div
                    className="job-filter__popup"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <ModalEducationPicker onApply={handleEducationApply} initialSelected={educationSelected} />
                  </div>
                ) : null}
              </li>

              <li
                className={`job-search-filter-menu__item ${openFilter === "location" ? "on" : ""} ${
                  locationChipCount > 0 ? "selected" : ""
                }`}
                onClick={() => toggleFilter("location")}
              >
                <span className="job-search-filter-menu__label">
                  지역
                  {locationChipCount > 0 ? <span className="chip-label">{locationChipCount}</span> : null}
                </span>

                {openFilter === "location" ? (
                  <div
                    className="job-filter__popup"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <ModalLocationPicker onApply={handleLocationApply} initialSelected={locationSelected} />
                  </div>
                ) : null}
              </li>

              <li
                className={`job-search-filter-menu__item ${openFilter === "employment" ? "on" : ""} ${
                  employmentChipCount > 0 ? "selected" : ""
                }`}
                onClick={() => toggleFilter("employment")}
              >
                <span className="job-search-filter-menu__label">
                  채용 유형
                  {employmentChipCount > 0 ? <span className="chip-label">{employmentChipCount}</span> : null}
                </span>

                {openFilter === "employment" ? (
                  <div
                    className="job-filter__popup"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <ModalEmploymentTypePicker onApply={handleEmploymentApply} initialSelected={employmentSelected} />
                  </div>
                ) : null}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="jobs-toolbar-container">
          <div className="jobs-toolbar__actions">
            <div className="jobs-actions__reset" onClick={resetFilters} style={{ cursor: "pointer" }}>
              <img src={refresh_gray} alt="" />
              초기화
            </div>

            <div className="jobs-chips">
              {chips.map((chip) => (
                <div key={chip.id} className="jobs-chips__item">
                  {chip.group && <span className="job-role-picker__chip-group">{chip.group}</span>}
                  {chip.role && (
                    <span className="job-role-picker__chip-role">
                      {chip.group && (
                        <span className="job-role-picker__chip-chevron">
                          <img src={chevron_right_black} alt="" />
                        </span>
                      )}
                      {chip.role}
                    </span>
                  )}
                  <img
                    className="job-role-picker__chip-close"
                    onClick={() => removeChip(chip)}
                    style={{ cursor: "pointer" }}
                    src={ic_close_gray500_20}
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="job-posting">
        {resumeReco && (
          <div className="job-posting__ai-recommend">
            이력서를 기반으로 AI가 {jobs.length.toLocaleString()}개의 추천 공고를 찾았어요!
          </div>
        )}

        <div className="job-posting__container">
          <div className="job-posting__content">
            <div className="job-posting__header">
              <span className="job-posting__count">
                총{" "}
                <p className="point-text-black">{(resumeReco ? jobs.length : totalCount).toLocaleString()}개</p>{" "}
                전체공고
              </span>

              <div className="job-posting__controls">
                <SortDropdown value={sort} options={sortOptions} onChange={setSort} className="job-posting__sort" />
                <SortDropdown
                  value={sizeSort}
                  options={sizeSortOptions}
                  onChange={setSizeSort}
                  className="job-posting__sort"
                />

                <div className="job-posting__view-toggle" role="group" aria-label="보기 전환">
                  <span
                    className="job-posting__view-btn job-posting__view-btn--card"
                    onClick={() => setView(1)}
                    role="button"
                    tabIndex={0}
                  >
                    {view === 1 ? <img src={grid_black} alt="" /> : <img src={grid_gray} alt="" />}
                  </span>
                  <span
                    className="job-posting__view-btn job-posting__view-btn--list job-posting__view-btn--active"
                    onClick={() => setView(0)}
                    role="button"
                    tabIndex={0}
                  >
                    {view === 0 ? <img src={row_black} alt="" /> : <img src={row_white} alt="" />}
                  </span>
                </div>
              </div>
            </div>

            {jobs.length === 0 ? (
              <JobEmptyResult />
            ) : view === 1 ? (
              <JobPostingCard jobs={jobs} loading={jobsLoading} isResumeBased={resumeReco} />
            ) : (
              <JobPostingRow jobs={jobs} loading={jobsLoading} isResumeBased={resumeReco} />
            )}

            {jobsError && (
              <div className="job-posting__error">
                공고를 불러오는 중 오류가 발생했습니다.
                <br />
                {jobsError}
              </div>
            )}
          </div>

          <div className="job-posting__pagination">
            <Pagination
              current={page}
              total={totalPages}
              onChange={setPage}
              pageWindow={5}
              prevIcon={<img src={arrow_left} alt="" aria-hidden="true" />}
              nextIcon={<img src={arrow_right} alt="" aria-hidden="true" />}
            />
          </div>
        </div>
      </div>
    </>
  );
}
