import React, { useEffect, useState } from "react";
import UiFilter from "@/shared/components/ui-filter/UiFilter";
import AllSavedJobsList from "./AllSavedJobs/AllSavedJobsList";
import BeforeJobsList from "./BeforeJobs/BeforeJobsList";
import CompletedJobsList from "./CompletedJobs/CompletedJobsList";
import SortDropdown from "@/shared/components/sort-dropdown/SortDropdown";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import { fetchJobList } from "@/api/job/job.api";
import type { JobItem } from "@/api/job/job.types";

import ic_grid_view_gray900_20 from "@/assets/icons/size20/ic_grid_view_gray900_20.png";
import ic_grid_view_gray400_20 from "@/assets/icons/size20/ic_grid_view_gray400_20.png";
import ic_list_view_gray400_20 from "@/assets/icons/size20/ic_list_view_gray400_20.png";
import ic_list_view_gray900_20 from "@/assets/icons/size20/ic_list_view_gray900_20.png";
import ic_arrow_drop_down_gray500_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray500_24.png";

import "./SavedPostings.css";
import "@/shared/components/job-posting-item/JobPostingItem.css";

const filters = [
  { label: "전체", value: "all" },
  { label: "지원 완료", value: "done" },
  { label: "지원 전", value: "before" },
];

type FilterValue = "all" | "done" | "before";
type ViewType = "row" | "card";

export default function SavedPostings() {
  const [currentFilter, setCurrentFilter] = useState<FilterValue>("all");
  const [currentView, setCurrentView] = useState<ViewType>("card");

  // 정렬 UI는 유지하되, 서버 파라미터 매핑은 일단 인기순으로 고정(원하면 매핑도 붙여줄게)
  const [sortLabel, setSortLabel] = useState("인기순");
  const sortOptions = ["적합도순", "최신순", "인기순", "마감임박순"];

  // 페이징
  const [page, setPage] = useState(1);
  const size = 15;

  // 데이터
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 로딩
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (newValue: string) => {
    setCurrentFilter(newValue as FilterValue);
    setPage(1);
  };

  const handleViewToggle = (type: ViewType) => {
    setCurrentView(type);
  };

  // 저장한 공고: favorites (현재는 all에서만 호출)
  useEffect(() => {
    if (currentFilter !== "all") return;

    const run = async () => {
      try {
        setIsLoading(true);

        const result = await fetchJobList(page, size, {
          sort: "popular",
          tabs: "favorites",
        });

        console.log("[SavedPostings] favorites jobs:", result.jobs);
        console.log("[SavedPostings] meta:", {
          page: result.page,
          size: result.size,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          hasNext: result.hasNext,
        });

        setJobs(result.jobs ?? []);
        setTotalPages(result.totalPages ?? 1);
        setTotalCount(result.totalCount ?? 0);
      } catch (err) {
        console.error("[SavedPostings] favorites fetch failed:", err);
        setJobs([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [currentFilter, page]);

  return (
    <div className="mypage__content-area saved-jobs-page">
      <LoadingOverlay isLoading={isLoading} />

      <span className="saved-jobs-page_title">저장한 공고</span>

      <div className="saved-jobs__main-container">
        <div className="saved-jobs__toolbar">
          <div className="toolbar__stats">
            <span className="stats__label">총</span>
            <div className="stats__count-wrap">
              <span className="stats__count">{totalCount}개</span>
              <span className="stats__unit">의 공고</span>
            </div>
          </div>

          <div className="toolbar__controls">
            <div className="control__sort-by">
              <SortDropdown
                value={sortLabel}
                options={sortOptions}
                onChange={setSortLabel}
                className="job-posting__sort"
              />
            </div>

            <div className="control__page-size">
              <span className="control__label">15개씩</span>
              <img
                src={ic_arrow_drop_down_gray500_24}
                alt="개수 변경 아이콘"
                className="control__icon"
              />
            </div>

            <div className="control__view-toggle">
              <img
                src={currentView === "card" ? ic_grid_view_gray900_20 : ic_grid_view_gray400_20}
                onClick={() => handleViewToggle("card")}
                alt="그리드 보기"
                className="toggle__icon toggle__grid"
              />
              <img
                src={currentView === "row" ? ic_list_view_gray900_20 : ic_list_view_gray400_20}
                onClick={() => handleViewToggle("row")}
                alt="리스트 보기"
                className="toggle__icon toggle__list"
              />
            </div>
          </div>
        </div>

        <div className="saved-jobs__filter-tab">
          <UiFilter
            options={filters}
            value={currentFilter}
            onChange={handleFilterChange}
            className="jobs-filter"
          />
        </div>

        {currentFilter === "all" ? (
          <AllSavedJobsList
            viewType={currentView}
            jobs={jobs}
            page={page}
            totalPages={totalPages}
            onChangePage={setPage}
          />
        ) : currentFilter === "done" ? (
          <CompletedJobsList />
        ) : (
          <BeforeJobsList />
        )}
      </div>
    </div>
  );
}
