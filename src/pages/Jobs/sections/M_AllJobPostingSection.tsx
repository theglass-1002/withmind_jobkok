import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";

import search from "@/assets/icons/search.png";
import cancel from "@/assets/icons/cancel.png";
import refresh_gray from "@/assets/icons/refresh_gray.png";
import chevron_right_black from "@/assets/icons/chevron_right_black.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import arrow_left from "@/assets/icons/keyboard_arrow_left.png";
import arrow_right from "@/assets/icons/keyboard_arrow_right.png";

import JobFilterPanel, { AppliedFilters } from "@/shared/components/mobile/JobFilterPanel";
import SortDropdown from "@/shared/components/sort-dropdown/SortDropdown";
import Tooltip from "@/shared/components/tooltip/Tooltip";
import Pagination from "@/shared/components/Pagination";
import JobPostingRow from "@/shared/components/job-posting-item/JobPostingRow";
import JobEmptyResult from "@/shared/components/empty/job/JobEmptyResult";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import { Icons } from "@/assets/icons";
import {
  fetchJobTree,
  fetchJobList,
  toCareerParam,
  toEducationCodeParam,
  toLocationCodeParam,
  EMPLOYMENT_TYPE_KEYS,
  EMPLOYMENT_ETC_KEYS,
} from "@/api/job/job.api";
import { JobNode, JobItem, SORT_CODE_MAP } from "@/api/job/job.types";
import { logout } from "@/api/auth/auth.api";

type Chip = {
  id: string;
  group: string;
  role?: string;
};

type FilterKey = "role" | "career" | "education" | "location" | "employment";

export default function M_AllJobPostingSection() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("최신순");
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [resumeReco, setResumeReco] = useState(false);

  const sortOptions = ["최신순", "인기순", "마감임박순"];

  const [chips, setChips] = useState<Chip[]>([]);

  const [jobTree, setJobTree] = useState<JobNode[]>([]);
  const [jobLoading, setJobLoading] = useState(false);

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [initialized, setInitialized] = useState(false);
  const [jobsFetched, setJobsFetched] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    roles: [],
    career: { min: 0, max: 10 },
    education: [],
    location: [],
    employment: [],
  });

  const eduLabelMap: Record<string, string> = {
    ANY: "학력 무관",
    HS_OR_LESS: "고교 졸업 이하",
    HS: "고등학교 졸업",
    COLLEGE_2_3: "대학 졸업(2, 3년제)",
    UNIV_4: "대학 졸업(4년제)",
    MASTER: "대학원 석사 졸업",
    PHD: "대학원 박사 졸업",
  };

  const empLabelMap: Record<string, string> = {
    fullTime: "정규직",
    contract: "계약직",
    intern: "인턴",
    militaryService: "병역특례",
    foreigner: "외국인",
    disability: "장애인",
  };

  const roleCount = appliedFilters.roles.length;
  const careerSelected = appliedFilters.career.min !== 0 || appliedFilters.career.max !== 10;
  const educationCount = appliedFilters.education.length;
  const locationCount = appliedFilters.location.length;
  const employmentCount = appliedFilters.employment.length;

  const defaultFilters: AppliedFilters = useMemo(
    () => ({
      roles: [],
      career: { min: 0, max: 10 },
      education: [],
      location: [],
      employment: [],
    }),
    []
  );

  useEffect(() => {
    const init = async () => {
      try {
        setJobLoading(true);
        const tree = await fetchJobTree();
        setJobTree(tree);
        setInitialized(true);
      } catch (e: any) {
        console.error("[M_AllJobPostingSection] fetchJobTree 에러:", e);
        if (e?.code === 999) {
          logout();
          navigate("/login");
        }
      } finally {
        setJobLoading(false);
      }
    };

    init();
  }, [navigate]);

  const buildParamsFromFilters = (filters: AppliedFilters, sortLabel: string) => {
    const roleIds = filters.roles.map((r) =>
      r.roleKey === r.categoryKey ? Number(r.categoryKey) : Number(r.roleKey)
    );

    const career = toCareerParam(filters.career);
    const educationCode = toEducationCodeParam(filters.education);
    const locationCode = toLocationCodeParam(filters.location);

    const employmentType = filters.employment
      .filter((k) => EMPLOYMENT_TYPE_KEYS.includes(k))
      .join(",");

    const employmentEtc = filters.employment
      .filter((k) => EMPLOYMENT_ETC_KEYS.includes(k))
      .join(",");

    const hasFilters =
      filters.roles.length > 0 ||
      filters.career.min !== 0 ||
      filters.career.max !== 10 ||
      filters.education.length > 0 ||
      filters.location.length > 0 ||
      filters.employment.length > 0;

    const sortCode = SORT_CODE_MAP[sortLabel] ?? "latest";

    const params: any = { sort: sortCode };

    if (hasFilters) {
      params.categoryId = roleIds.length ? roleIds : undefined;
      params.career = career;
      params.educationCode = educationCode;
      params.locationCode = locationCode;
      params.employmentType = employmentType || undefined;
      params.employmentEtc = employmentEtc || undefined;
    }

    return {
      params,
      meta: {
        hasFilters,
        roleIds,
        career,
        educationCode,
        locationCode,
        employmentType,
        employmentEtc,
        sortCode,
      },
    };
  };

  const careerChipText = useMemo(() => {
    const { min, max } = appliedFilters.career;
    if (min === 0 && max === 10) return null;
    if (min === 0 && max === 1) return "신입";
    if (min === 0) return `신입~${max}년`;
    if (max === 10) return `${min}년 이상`;
    return `${min}~${max}년`;
  }, [appliedFilters.career]);

  const makeChipsFromFilters = (filters: AppliedFilters) => {
    const next: Chip[] = [];

    filters.roles.forEach((role) => {
      next.push({
        id: `role:${role.roleKey}`,
        group: role.categoryTitle,
        role: role.roleLabel,
      });
    });

    const { min, max } = filters.career;
    const isCareerSelected = min !== 0 || max !== 10;
    if (isCareerSelected) {
      let label = "";
      if (min === 0 && max === 1) label = "신입";
      else if (min === 0 && max === 10) label = "경력전체";
      else if (min === 0) label = `~${max}년`;
      else if (max === 10) label = `${min}년 이상`;
      else label = `${min}~${max}년`;

      next.push({
        id: `career:${min}-${max}`,
        group: "경력",
        role: label,
      });
    }

    filters.education.forEach((key) => {
      next.push({
        id: `education:${key}`,
        group: "학력",
        role: eduLabelMap[key] || key,
      });
    });

    filters.location.forEach((loc) => {
      if (loc.districtName === "전체") {
        next.push({
          id: `location:${loc.code}`,
          group: `${loc.regionName} 전체`,
        });
      } else {
        next.push({
          id: `location:${loc.code}`,
          group: loc.regionName,
          role: loc.districtName,
        });
      }
    });

    filters.employment.forEach((key: any) => {
      next.push({
        id: `employment:${key}`,
        group: "채용 유형",
        role: empLabelMap[key] || String(key),
      });
    });

    return next;
  };

  useEffect(() => {
    console.log("[M_AllJobPostingSection] appliedFilters:", appliedFilters);
  }, [appliedFilters]);

  useEffect(() => {
    if (!initialized) return;

    const loadJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsFetched(false);

        const size = 15;
        const { params, meta } = buildParamsFromFilters(appliedFilters, sort);

        console.log("[M_AllJobPostingSection] fetch params:", params);
        console.log("[M_AllJobPostingSection] fetch meta:", meta);

        const { jobs, totalPages, totalCount } = await fetchJobList(page, size, params);

        setJobs(resumeReco ? jobs.filter((j) => j.aiPick === true) : jobs);
        setTotalPages(totalPages);
        setTotalCount(totalCount);
      } catch (e: any) {
        console.error("[M_AllJobPostingSection] fetchJobList 에러:", e);
      } finally {
        setJobsLoading(false);
        setJobsFetched(true);
      }
    };

    loadJobs();
  }, [initialized, navigate, page, sort, resumeReco, appliedFilters]);

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
  };

  const toggleFilter = (key: FilterKey) => {
    setOpenFilter((prev) => (prev === key ? null : key));
  };

  const removeChip = (id: string) => {
    const [type, value] = id.split(":");

    setAppliedFilters((prev) => {
      if (type === "role") {
        return {
          ...prev,
          roles: prev.roles.filter((role) => String(role.roleKey) !== value),
        };
      }

      if (type === "career") {
        return {
          ...prev,
          career: { min: 0, max: 10 },
        };
      }

      if (type === "education") {
        return {
          ...prev,
          education: prev.education.filter((item) => item !== value),
        };
      }

      if (type === "location") {
        return {
          ...prev,
          location: prev.location.filter((loc) => String(loc.code) !== value),
        };
      }

      if (type === "employment") {
        return {
          ...prev,
          employment: prev.employment.filter((item) => String(item) !== value),
        };
      }

      return prev;
    });

    setChips((prev) => prev.filter((chip) => chip.id !== id));
    setPage(1);
  };

  const resetFilters = () => {
    setAppliedFilters(defaultFilters);
    setChips([]);
    setOpenFilter(null);
    setPage(1);
  };

  const handleCloseFilter = () => {
    setOpenFilter(null);
  };

  const handleApplyFilter = (filters: AppliedFilters) => {
    console.log("[M_AllJobPostingSection] onApply filters:", filters);
    setAppliedFilters(filters);
    setChips(makeChipsFromFilters(filters));
    setPage(1);
    setOpenFilter(null);
  };

  const handleResetFilter = () => {
    console.log("[M_AllJobPostingSection] onReset filters");
    setAppliedFilters(defaultFilters);
    setChips([]);
    setPage(1);
    setOpenFilter(null);
  };

  const handleRefreshClick = () => {
    setAppliedFilters(defaultFilters);
    setChips([]);
    setPage(1);
    setOpenFilter(null);
  };

  const handleFilterButtonClick = () => {
    setOpenFilter((prev) => (prev ? null : "role"));
  };

  const showJobPostingLoading = !initialized || !jobsFetched || jobsLoading;

  return (
    <>
      <div className="jobs-toolbar">
        <div className="jobs-toolbar__search">
          <div className="panel-search">
            <img className="jobs-search__icon" src={search} alt="" />
            <input type="text" placeholder="직무, 기업명, 지역등을 입력해주세요" />
            <img className="jobs-search__clear_icon" src={cancel} alt="" />
          </div>

          <div className="job-search-filters">
            <button className="job-list-action__refresh" onClick={handleRefreshClick}>
              <img src={Icons.ic_refresh_gray900_16} alt="새로고침" />
            </button>

            <span className="job-list-separator"></span>

            <button className="job-list-action__filter" onClick={handleFilterButtonClick}>
              <img src={Icons.ic_filter_gray900_20} alt="" />
            </button>

            <ul className="job-search-filter-menu">
              <li
                className={`job-search-filter-menu__item ${openFilter === "role" ? "is-open" : ""} ${
                  roleCount > 0 ? "selected" : ""
                }`}
                onClick={() => toggleFilter("role")}
              >
                <span className="job-search-filter-menu__label">
                  직군ㆍ직무
                  {roleCount > 0 && (
                    <span className="job-search-filter-menu__count">{roleCount}</span>
                  )}
                </span>
              </li>

              <li
                className={`job-search-filter-menu__item ${openFilter === "career" ? "is-open" : ""} ${
                  careerSelected ? "selected" : ""
                }`}
                onClick={() => toggleFilter("career")}
              >
                <span className="job-search-filter-menu__label">
                  경력
                  {careerSelected && (
                    <span className="job-search-filter-menu__count">1</span>
                  )}
                </span>
              </li>

              <li
                className={`job-search-filter-menu__item ${openFilter === "education" ? "is-open" : ""} ${
                  educationCount > 0 ? "selected" : ""
                }`}
                onClick={() => toggleFilter("education")}
              >
                <span className="job-search-filter-menu__label">
                  학력
                  {educationCount > 0 && (
                    <span className="job-search-filter-menu__count">{educationCount}</span>
                  )}
                </span>
              </li>

              <li
                className={`job-search-filter-menu__item ${openFilter === "location" ? "is-open" : ""} ${
                  locationCount > 0 ? "selected" : ""
                }`}
                onClick={() => toggleFilter("location")}
              >
                <span className="job-search-filter-menu__label">
                  지역
                  {locationCount > 0 && (
                    <span className="job-search-filter-menu__count">{locationCount}</span>
                  )}
                </span>
              </li>

              <li
                className={`job-search-filter-menu__item ${openFilter === "employment" ? "is-open" : ""} ${
                  employmentCount > 0 ? "selected" : ""
                }`}
                onClick={() => toggleFilter("employment")}
              >
                <span className="job-search-filter-menu__label">
                  채용 유형
                  {employmentCount > 0 && (
                    <span className="job-search-filter-menu__count">{employmentCount}</span>
                  )}
                </span>
              </li>
            </ul>
          </div>

          <div className="jobs-toolbar__actions">
            <div className="jobs-actions__reset" onClick={resetFilters} style={{ cursor: "pointer" }}>
              <span>
                <img src={refresh_gray} alt="" />
              </span>
              초기화
            </div>

            <div className="jobs-chips">
              {chips.map((chip) => (
                <div key={chip.id} className="jobs-chips__item">
                  <span className="job-role-picker__chip-group">{chip.group}</span>
                  {chip.role && (
                    <span className="job-role-picker__chip-role">
                      <span className="job-role-picker__chip-chevron">
                        <img src={chevron_right_black} alt="" />
                      </span>
                      {chip.role}
                    </span>
                  )}
                  <span
                    className="job-role-picker__chip-close"
                    onClick={() => removeChip(chip.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={ic_close_gray500_20} alt="" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
          onChange={(checked) => {
            setResumeReco(checked);
            setPage(1);
          }}
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

      {openFilter && (
        <JobFilterPanel
          filterType={openFilter}
          totalCount={totalCount}
          initialFilters={appliedFilters}
          onClose={handleCloseFilter}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />
      )}

      <div className="job-posting">
        <div className="job-posting__container">
          <div
            className="job-posting__content"
            style={{ position: "relative", minHeight: "320px" }}
          >
            {showJobPostingLoading ? (
              <LoadingOverlay isLoading={showJobPostingLoading} />
            ) : (
              <>
                <div className="job-posting__header">
                  <span className="job-posting__count">
                    총{" "}
                    <p className="point-text-black">
                      {(resumeReco ? jobs.length : totalCount).toLocaleString()}개
                    </p>{" "}
                    전체공고
                  </span>

                  <div className="job-posting__controls">
                    <SortDropdown
                      value={sort}
                      options={sortOptions}
                      onChange={handleSortChange}
                      className="job-posting__sort"
                    />
                  </div>
                </div>

                {jobs.length === 0 ? (
                  <JobEmptyResult />
                ) : (
                  <JobPostingRow
                    jobs={jobs}
                    loading={jobsLoading}
                    isResumeBased={resumeReco}
                  />
                )}
              </>
            )}
          </div>

          {!showJobPostingLoading && (
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
          )}
        </div>
      </div>
    </>
  );
}