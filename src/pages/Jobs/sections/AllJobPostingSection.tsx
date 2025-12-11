import React, { useEffect, useState } from "react";
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
import ModalEmploymentTypePicker, {
  EmpOptionKey,
} from "@/shared/components/employment-type-picker/ModalEmploymentTypePicker";
import SortDropdown from "@/shared/components/sort-dropdown/SortDropdown";

import JobPostingRow from "@/shared/components/job-posting-item/JobPostingRow";
import JobPostingCard from "@/shared/components/job-posting-item/JobPostingCard";

import Tooltip from "@/shared/components/tooltip/Tooltip";
import Pagination from "@/shared/components/Pagination";

import { fetchJobTree, fetchJobList } from "@/api/job/job.api";
import { JobNode, JobItem } from "@/api/job/job.types";
import { logout } from "@/api/auth.api";

type ChipKind = "role" | "career" | "education" | "location" | "employment";

type Chip = {
  id: string;
  group?: string;
  role?: string;
  kind?: ChipKind;
};

type FilterKey = "role" | "career" | "education" | "location" | "employment";

export default function AllJobPostingSection() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [resumeReco, setResumeReco] = useState(false); // 이력서 기반 추천 토글
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [sort, setSort] = useState("적합도순");
  const [sizeSort, setSizeSort] = useState("15개씩");
  const [view, setView] = useState(0);

  const sortOptions = ["적합도순", "최신순", "인기순", "마감임박순"];
  const sizeSortOptions = ["15개씩", "30개씩", "45개씩"];

  const [chips, setChips] = useState<Chip[]>([]);

  // 🔥 직군/직무 트리 상태 (API 응답)
  const [jobTree, setJobTree] = useState<JobNode[]>([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);

  // 🔥 공고 리스트 상태 (API 응답)
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 🔥 초기 로딩 완료 여부
  const [initialized, setInitialized] = useState(false);

  // 🔥 화면 최초 진입 시: fetchJobList → fetchJobTree
  useEffect(() => {
    const init = async () => {
      try {
        setJobLoading(true);
        setJobsLoading(true);
        setJobError(null);
        setJobsError(null);

        const size = parseInt(sizeSort, 10) || 15;
        const { jobs, totalPages, totalCount } = await fetchJobList(page, size);
        setJobs(jobs);
        setTotalPages(totalPages);
        setTotalCount(totalCount);

        const tree = await fetchJobTree();
        setJobTree(tree);

        setInitialized(true);
      } catch (e: any) {
        console.error(e);

        if (e?.code === 999) {
          console.log("로그인만료");
          logout();
          navigate("/login");
          return;
        }

        setJobError(
          e?.message ||
            "초기 로딩 중 직군/직무 정보를 불러오는 데 실패했습니다."
        );
        setJobsError(
          e?.message ||
            "초기 로딩 중 채용 공고를 불러오는 데 실패했습니다."
        );
      } finally {
        setJobLoading(false);
        setJobsLoading(false);
      }
    };

    init();
  }, [navigate]);

  // 🔁 페이지/사이즈 변경 시: 공고 리스트만 다시 로딩
  useEffect(() => {
    if (!initialized) return;

    const loadJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);

        const size = parseInt(sizeSort, 10) || 15;
        const { jobs, totalPages, totalCount } = await fetchJobList(page, size);
        setJobs(jobs);
        setTotalPages(totalPages);
        setTotalCount(totalCount);
      } catch (e: any) {
        console.error(e);

        if (e?.code === 999) {
          console.log("로그인만료");
          logout();
          navigate("/login");
          return;
        }

        setJobsError(
          e?.message || "채용 공고를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setJobsLoading(false);
      }
    };

    loadJobs();
  }, [page, sizeSort, initialized, navigate]);

  const toggleFilter = (key: FilterKey) =>
    setOpenFilter((prev) => (prev === key ? null : key));

  const resetFilters = () => {
    setChips([]);
    // TODO: 실제 필터 상태도 여기서 초기화할 수 있음
  };

  const removeChip = (id: string) => {
    setChips((prev) => prev.filter((chip) => chip.id !== id));
  };

  const handleLocationApply = (
    selected: {
      code: string;
      regionName: string;
      districtName: string;
    }[]
  ) => {
    console.log("📍 선택된 지역 목록:", selected);

    const locationChips: Chip[] = selected.map((s) => ({
      id: `loc-${s.code}`,
      group: s.regionName,
      role: s.districtName,
      kind: "location",
    }));

    setChips((prev) => {
      const others = prev.filter((chip) => chip.kind !== "location");
      return [...others, ...locationChips];
    });

    setOpenFilter(null);
  };

const handleCareerApply = (range: { min: number; max: number }) => {
  const { min, max } = range;

  let label = "";
  if (min === 0 && max === 1) label = "신입";
  else if (min === 0 && max === 10) label = "경력전체";
  else if (min === 0) label = `~${max}년`;
  else if (max === 10) label = `${min}년 이상`;
  else label = `${min}~${max}년`;

  const careerChip: Chip = {
    id: "career",
    role: label,        // 🔥 이제 role만 저장
    kind: "career",
  };

  setChips((prev) => {
    const others = prev.filter((chip) => chip.kind !== "career");
    return [...others, careerChip];
  });

  setOpenFilter(null);
};


  // 🔥 학력 피커 적용 콜백
  const handleEducationApply = (selected: string[]) => {
    console.log("🎓 선택된 학력 코드들:", selected);

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
    }));

    setChips((prev) => {
      const others = prev.filter((chip) => chip.kind !== "education");
      return [...others, ...eduChips];
    });

    setOpenFilter(null);
  };

  // 🔥 채용 유형 피커 적용 콜백
  const handleEmploymentApply = (selected: EmpOptionKey[]) => {
    console.log("💼 선택된 채용 유형:", selected);

    const empLabelMap: Record<EmpOptionKey, string> = {
      fullTime: "정규직",
      contract: "계약직",
      intern: "인턴",
      militaryService: "병역특례",
      foreigner: "외국인",
      disability: "장애인",
    };

    const empChips: Chip[] = selected.map((key) => ({
      id: `emp-${key}`,
      group: "채용 유형",
      role: empLabelMap[key],
      kind: "employment",
    }));

    setChips((prev) => {
      const others = prev.filter((chip) => chip.kind !== "employment");
      return [...others, ...empChips];
    });

    setOpenFilter(null);
  };

  // 🔥 직군/직무 모달에서 "적용" 눌렀을 때 콜백
  const handleRoleApply = (
    selected: {
      categoryId: number;
      categoryName: string;
      roleId: number;
      roleName: string;
    }[]
  ) => {
    const roleChips: Chip[] = selected.map((s) => ({
      id: `role-${s.roleId}`,
      group: s.categoryName,
      role: s.roleName,
      kind: "role",
    }));

    setChips((prev) => {
      const others = prev.filter((chip) => chip.kind !== "role");
      return [...others, ...roleChips];
    });

    setOpenFilter(null);
  };

  // ✅ 초기 로딩 전체 오버레이
  if (
    (jobLoading || jobsLoading) &&
    !jobError &&
    !jobsError &&
    jobTree.length === 0 &&
    jobs.length === 0
  ) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <div className="jobs-toolbar">
        <div className="jobs-toolbar__search">
          <div className="panel-search">
            <img className="jobs-search__icon" src={search} alt="" />
            <input
              type="text"
              placeholder="직무, 기업명, 지역등을 입력해주세요"
            />
            <span className="jobs-search__clear_icon">
              <img src={cancel} alt="" />
            </span>
          </div>

          <div className="job-search-filters">
            <div className="job-search-filter job-search-filter--toggle">
              <div className="job-search-filter__label">
                <span className="job-search-filter__text">
                  이력서 기반 추천
                </span>
                <Tooltip
                  title="이력서 기반 추천이란?"
                  desc="등록된 기본 이력서를 기반으로, 적합한 채용 공고를 찾아주는 잡콕만의 AI 추천 서비스입니다. 적합도가 높은 공고에는 [AI Pick] 태그가 표시됩니다."
                  position="top"
                  className="job-posting__tooltip"
                />
              </div>
              <Switch
                checked={resumeReco}
                onChange={setResumeReco}
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
              {/* 직군ㆍ직무 */}
              <li
                className={`job-search-filter-menu__item ${
                  openFilter === "role" ? "on" : ""
                }`}
                onClick={() => toggleFilter("role")}
              >
                <span className="job-search-filter-menu__label">
                  직군ㆍ직무
                </span>
                <span className="job-search-filter-menu__icon">
                  <img
                    src={
                      openFilter === "role"
                        ? arrow_drop_up_black
                        : arrow_drop_down
                    }
                    alt=""
                  />
                </span>
                {openFilter === "role" ? (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <ModalJobRolePicker
                      jobTree={jobTree}
                      loading={jobLoading}
                      error={jobError}
                      onApply={handleRoleApply}
                    />
                  </div>
                ) : null}
              </li>

              {/* 경력 */}
              <li
                className={`job-search-filter-menu__item ${
                  openFilter === "career" ? "on" : ""
                }`}
                onClick={() => toggleFilter("career")}
              >
                <span className="job-search-filter-menu__label">경력</span>
                <span className="job-search-filter-menu__icon">
                  <img
                    src={
                      openFilter === "career"
                        ? arrow_drop_up_black
                        : arrow_drop_down
                    }
                    alt=""
                  />
                </span>
                {openFilter === "career" ? (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <ModalCareerRangePicker onApply={handleCareerApply} />
                  </div>
                ) : null}
              </li>

              {/* 학력 */}
              <li
                className={`job-search-filter-menu__item ${
                  openFilter === "education" ? "on" : ""
                }`}
                onClick={() => toggleFilter("education")}
              >
                <span className="job-search-filter-menu__label">학력</span>
                <span className="job-search-filter-menu__icon">
                  <img
                    src={
                      openFilter === "education"
                        ? arrow_drop_up_black
                        : arrow_drop_down
                    }
                    alt=""
                  />
                </span>
                {openFilter === "education" ? (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <ModalEducationPicker onApply={handleEducationApply} />
                  </div>
                ) : null}
              </li>

              {/* 지역 */}
              <li
                className={`job-search-filter-menu__item ${
                  openFilter === "location" ? "on" : ""
                }`}
                onClick={() => toggleFilter("location")}
              >
                <span className="job-search-filter-menu__label">지역</span>
                <span className="job-search-filter-menu__icon">
                  <img
                    src={
                      openFilter === "location"
                        ? arrow_drop_up_black
                        : arrow_drop_down
                    }
                    alt=""
                  />
                </span>
                {openFilter === "location" ? (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <ModalLocationPicker onApply={handleLocationApply} />
                  </div>
                ) : null}
              </li>

              {/* 채용 유형 */}
              <li
                className={`job-search-filter-menu__item ${
                  openFilter === "employment" ? "on" : ""
                }`}
                onClick={() => toggleFilter("employment")}
              >
                <span className="job-search-filter-menu__label">채용 유형</span>
                <span className="job-search-filter-menu__icon">
                  <img
                    src={
                      openFilter === "employment"
                        ? arrow_drop_up_black
                        : arrow_drop_down
                    }
                    alt=""
                  />
                </span>
                {openFilter === "employment" ? (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <ModalEmploymentTypePicker onApply={handleEmploymentApply} />
                  </div>
                ) : null}
              </li>
            </ul>
          </div>
        </div>
      </div>

        {/* 🔥 필터 칩 영역: chips가 1개 이상일 때만 표시 */}
        {chips.length > 0 && (
          <div className="jobs-toolbar-container">
            <div className="jobs-toolbar__actions">
              <div
                className="jobs-actions__reset"
                onClick={resetFilters}
                style={{ cursor: "pointer" }}
              >
           
                  <img src={refresh_gray} alt="" />
              
                초기화
              </div>

              <div className="jobs-chips">
              {chips.map((chip) => (
                <div key={chip.id} className="jobs-chips__item">

                  {/* group이 있을 때만 group 렌더링 */}
                  {chip.group && (
                    <span className="job-role-picker__chip-group">
                      {chip.group}
                    </span>
                  )}

                  {/* role은 항상 표시됨 */}
                  {chip.role && (
                    <span className="job-role-picker__chip-role">
                      {/* group이 있을 때만 ">" 아이콘 표시 */}
                      {chip.group && (
                        <span className="job-role-picker__chip-chevron">
                          <img src={chevron_right_black} alt="" />
                        </span>
                      )}
                      {chip.role}
                    </span>
                  )}

                  {/* 삭제 버튼 */}
                  <img
                    className="job-role-picker__chip-close"
                    onClick={() => removeChip(chip.id)}
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
            이력서를 기반으로 AI가 {totalCount.toLocaleString()}개의 추천 공고를
            찾았어요!
          </div>
        )}

        <div className="job-posting__container">
          <div className="job-posting__content">
            <div className="job-posting__header">
              <span className="job-posting__count">
                총{" "}
                <p className="point-text-black">
                  {totalCount.toLocaleString()}개
                </p>
                전체공고
              </span>
              <div className="job-posting__controls">
                <SortDropdown
                  value={sort}
                  options={sortOptions}
                  onChange={setSort}
                  className="job-posting__sort"
                />

                <SortDropdown
                  value={sizeSort}
                  options={sizeSortOptions}
                  onChange={setSizeSort}
                  className="job-posting__sort"
                />

                <div
                  className="job-posting__view-toggle"
                  role="group"
                  aria-label="보기 전환"
                >
                  <span
                    className="job-posting__view-btn job-posting__view-btn--card"
                    onClick={() => {
                      setView(1);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {view === 1 ? (
                      <img src={grid_black} alt="" />
                    ) : (
                      <img src={grid_gray} alt="" />
                    )}
                  </span>
                  <span
                    className="job-posting__view-btn job-posting__view-btn--list job-posting__view-btn--active"
                    onClick={() => {
                      setView(0);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {view === 0 ? (
                      <img src={row_black} alt="" />
                    ) : (
                      <img src={row_white} alt="" />
                    )}
                  </span>
                </div>
              </div>
            </div>
            {view === 1 ? (
              <JobPostingCard
                jobs={jobs}
                loading={jobsLoading}
                isResumeBased={resumeReco}
              />
            ) : (
              <JobPostingRow
                jobs={jobs}
                loading={jobsLoading}
                isResumeBased={resumeReco}
              />
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
