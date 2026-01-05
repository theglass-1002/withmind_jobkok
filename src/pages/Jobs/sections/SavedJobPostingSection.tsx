import React, { useEffect, useState } from "react";

import UiFilter from "@/shared/components/ui-filter/UiFilter";
import AllSavedJobsList from "@/pages/Mypage/Postings/AllSavedJobs/AllSavedJobsList";
import BeforeJobsList from "@/pages/Mypage/Postings/BeforeJobs/BeforeJobsList";
import CompletedJobsList from "@/pages/Mypage/Postings/CompletedJobs/CompletedJobsList";

import ic_grid_view_gray900_20 from "@/assets/icons/size20/ic_grid_view_gray900_20.png";
import ic_grid_view_gray400_20 from "@/assets/icons/size20/ic_grid_view_gray400_20.png";
import ic_list_view_gray400_20 from "@/assets/icons/size20/ic_list_view_gray400_20.png";
import ic_list_view_gray900_20 from "@/assets/icons/size20/ic_list_view_gray900_20.png";
import ic_arrow_drop_down_gray500_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray500_24.png";

import "@/pages/Mypage/Postings/SavedPostings.css";
import "@/shared/components/job-posting-item/JobPostingItem.css";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

// ✅ jobs api
import { fetchJobList } from "@/api/job/job.api";
import type { JobItem } from "@/api/job/job.types";
import { isLoggedIn } from "@/api/auth/auth.api";

const filters = [
  { label: "전체", value: "all" },
  { label: "지원 완료", value: "done" },
  { label: "지원 전", value: "before" },
];

type FilterValue = "all" | "done" | "before";
type ViewType = "row" | "card";

export default function SavedJobPostingSection() {
  const [currentFilter, setCurrentFilter] = useState<FilterValue>("all");
  const [currentView, setCurrentView] = useState<ViewType>("card");


  const [page, setPage] = useState(1);
  const size = 15;


  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  //
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (newValue: string) => {
    setCurrentFilter(newValue as FilterValue);
    setPage(1); // 필터 바뀌면 1페이지로
  };

  const handleViewToggle = (type: ViewType) => {
    setCurrentView(type);
  };

  // 화면 진입 + page/currentFilter 바뀔 때 즐겨찾기 공고 호출
  useEffect(() => {
  
    console.log(isLoggedIn());

    if (currentFilter !== "all") return;

    const run = async () => {
      try {
        setIsLoading(true);

        const result = await fetchJobList(page, size, {
          sort: "popular",
          tabs: "favorites",
        });


        setJobs(result.jobs);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
      } catch (err) {
        console.error("[SavedJobPostingSection] favorites fetch failed:", err);
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
            <span className="control__label">인기순</span>
            <img src={ic_arrow_drop_down_gray500_24} alt="정렬 변경 아이콘" className="control__icon" />
          </div>

          <div className="control__page-size">
            <span className="control__label">15개씩</span>
            <img src={ic_arrow_drop_down_gray500_24} alt="개수 변경 아이콘" className="control__icon" />
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
        <UiFilter options={filters} value={currentFilter} onChange={handleFilterChange} className="jobs-filter" />
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
  );
}
