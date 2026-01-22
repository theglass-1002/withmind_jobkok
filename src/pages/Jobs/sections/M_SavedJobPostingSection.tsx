import React, { useEffect, useState } from "react";

import UiFilter from "@/shared/components/ui-filter/UiFilter";
import AllSavedJobsList from "@/pages/Mypage/Postings/AllSavedJobs/AllSavedJobsList";
import BeforeJobsList from "@/pages/Mypage/Postings/BeforeJobs/BeforeJobsList";
import CompletedJobsList from "@/pages/Mypage/Postings/CompletedJobs/CompletedJobsList";
import SortDropdown from "@/shared/components/sort-dropdown/SortDropdown";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import { fetchJobList } from "@/api/job/job.api";
import type { JobItem } from "@/api/job/job.types";

import ic_grid_view_gray900_20 from "@/assets/icons/size20/ic_grid_view_gray900_20.png";
import ic_grid_view_gray400_20 from "@/assets/icons/size20/ic_grid_view_gray400_20.png";
import ic_list_view_gray400_20 from "@/assets/icons/size20/ic_list_view_gray400_20.png";
import ic_list_view_gray900_20 from "@/assets/icons/size20/ic_list_view_gray900_20.png";

import "@/pages/Mypage/Postings/SavedPostings.css";
import "@/shared/components/job-posting-item/JobPostingItem.css";

const filters = [
  { label: "전체", value: "all" },
  { label: "지원 완료", value: "done" },
  { label: "지원 전", value: "before" },
];

type FilterValue = "all" | "done" | "before";
type ViewType = "row" | "card";

const SORT_CODE_MAP: Record<string, string> = {
  오래된순: "oldest",
  적합도순: "maching",
  최신순: "latest",
  인기순: "popular",
  마감임박순: "closing",
};

const SIZE_MAP: Record<string, number> = {
  "15개씩": 15,
  "30개씩": 30,
  "45개씩": 45,
};

export default function M_SavedJobPostingSection() {
  const [currentFilter, setCurrentFilter] = useState<FilterValue>("all");
  const [currentView, setCurrentView] = useState<ViewType>("card");

  const [sortLabel, setSortLabel] = useState("인기순");
  const [sizeLabel, setSizeLabel] = useState("15개씩");

  const sortOptions = ["오래된순", "적합도순", "최신순", "인기순", "마감임박순"];
  const sizeOptions = ["15개씩", "30개씩", "45개씩"];

  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (newValue: string) => {
    setCurrentFilter(newValue as FilterValue);
    setPage(1);
  };

  const handleViewToggle = (type: ViewType) => {
    setCurrentView(type);
  };

  const handleUnfavorite = (jobId: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    setTotalCount((prev) => Math.max(0, prev - 1));
  };

  const handleUnapplied = (jobId: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    setTotalCount((prev) => Math.max(0, prev - 1));
  };

  const handleAppliedChanged = (jobId: number, nextApplied: 0 | 1) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? ({ ...j, applied: nextApplied } as JobItem) : j))
    );
  };

  const handleFavoriteChanged = (jobId: number, nextFavorite: 0 | 1) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? ({ ...j, favorite: nextFavorite } as JobItem) : j))
    );
  };

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);

        const sortCode = SORT_CODE_MAP[sortLabel] ?? "popular";
        const size = SIZE_MAP[sizeLabel] ?? 15;

        const tabs = "favorites";

        const applied =
          currentFilter === "done"
            ? 1
            : currentFilter === "before"
            ? 0
            : undefined;

        const params =
          applied === undefined
            ? { sort: sortCode, tabs }
            : { sort: sortCode, tabs, applied };

        const result = await fetchJobList(page, size, params);

        setJobs(result.jobs ?? []);
        setTotalPages(result.totalPages ?? 1);
        setTotalCount(result.totalCount ?? 0);
      } catch (err) {
        console.error("[M_SavedJobPostingSection] fetch failed:", err);
        setJobs([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [currentFilter, page, sortLabel, sizeLabel]);

  return (
    <div className="saved-jobs__main-container">
      <LoadingOverlay isLoading={isLoading} />

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
              onChange={(val) => {
                setSortLabel(val);
                setPage(1);
              }}
              className="job-posting__sort"
            />
          </div>

          <div className="control__page-size">
            <SortDropdown
              value={sizeLabel}
              options={sizeOptions}
              onChange={(val) => {
                setSizeLabel(val);
                setPage(1);
              }}
              className="job-posting__sort"
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
          onUnfavorite={handleUnfavorite}
          onAppliedChanged={handleAppliedChanged}
          onFavoriteChanged={handleFavoriteChanged}
        />
      ) : currentFilter === "done" ? (
        <CompletedJobsList
          viewType={currentView}
          jobs={jobs}
          page={page}
          totalPages={totalPages}
          onChangePage={setPage}
          onUnapplied={handleUnapplied}
          onUnfavorite={handleUnfavorite}
          onAppliedChanged={handleAppliedChanged}
          onFavoriteChanged={handleFavoriteChanged}
        />
      ) : (
        <BeforeJobsList
          viewType={currentView}
          jobs={jobs}
          page={page}
          totalPages={totalPages}
          onChangePage={setPage}
          onUnfavorite={handleUnfavorite}
          onUnapplied={handleUnapplied}
          onAppliedChanged={(jobId, nextApplied) => {
            handleAppliedChanged(jobId, nextApplied);
            if (nextApplied === 1) {
              setJobs((prev) => prev.filter((j) => j.id !== jobId));
              setTotalCount((prev) => Math.max(0, prev - 1));
            }
          }}
          onFavoriteChanged={handleFavoriteChanged}
        />
      )}
    </div>
  );
}
