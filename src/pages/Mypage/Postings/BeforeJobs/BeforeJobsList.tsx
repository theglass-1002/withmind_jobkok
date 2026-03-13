import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import JobPostingItemCardNoAiPick from "@/shared/components/jobPosting-v3/JobPostingItemCardNoAiPick";
import JobPostingItemRowNoAiPick from "@/shared/components/jobPosting-v3/JobPostingItemRowNoAiPick";
import Pagination from "@/shared/components/Pagination";

import ic_keyboard_arrow_left_gray700_20 from "@/assets/icons/size20/ic_keyboard_arrow_left_gray700_20.png";
import ic_keyboard_arrow_right_gray700_20 from "@/assets/icons/size20/ic_keyboard_arrow_right_gray700_20.png";

import type { JobItem } from "@/api/job/job.types";

interface BeforeJobsListProps {
  viewType: "row" | "card";
  jobs?: JobItem[];
  page?: number;
  totalPages?: number;
  onChangePage?: (p: number) => void;
  onAppliedChanged?: (jobId: number, nextApplied: 0 | 1) => void;
  onFavoriteChanged?: (jobId: number, nextFavorite: 0 | 1) => void;
  onUnfavorite?: (jobId: number) => void;
  onUnapplied?: (jobId: number) => void;
}

export default function BeforeJobsList({
  viewType,
  jobs = [],
  page = 1,
  totalPages = 1,
  onChangePage = () => {},
  onAppliedChanged = () => {},
  onFavoriteChanged = () => {},
  onUnfavorite = () => {},
  onUnapplied = () => {},
}: BeforeJobsListProps) {
  const navigate = useNavigate();

  useEffect(() => {}, [jobs]);

  const handleGoToJobs = () => {
    navigate("/jobs", { state: { activeTab: "all" } });
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className="saved-jobs__content-empty-area before">
        <div className="jobs-empty-state">
          <span className="empty-state__title">아직 지원한 공고가 없습니다.</span>
          <span className="empty-state__desc">
            지원한 공고가 있다면, ‘지원한 포지션으로 기록하기’를 눌러 기록해 보세요.
          </span>
        </div>
        <button className="default_btn_white" onClick={handleGoToJobs}>
          채용 공고 보러 가기
        </button>
      </div>
    );
  }

  return (
    <>
      {viewType === "card" ? (
        <div className={`saved-jobs__content-area ${viewType} job-posting__list--grid`}>
          {jobs.map((job) => (
            <JobPostingItemCardNoAiPick
              key={job.jobIdx}
              job={job}
              appliedSuccessMessage="지원 정보가 반영되었습니다."
              onAppliedChanged={onAppliedChanged}
              onFavoriteChanged={onFavoriteChanged}
              onUnfavorite={onUnfavorite}
              onUnapplied={onUnapplied}
            />
          ))}
        </div>
      ) : (
        <div className={`saved-jobs__content-area ${viewType} job-posting__item job-posting__item--row`}>
          {jobs.map((job) => (
            <JobPostingItemRowNoAiPick
              key={job.jobIdx}
              job={job}
              appliedSuccessMessage="지원 정보가 반영되었습니다."
              onAppliedChanged={onAppliedChanged}
              onFavoriteChanged={onFavoriteChanged}
              onUnfavorite={onUnfavorite}
              onUnapplied={onUnapplied}
            />
          ))}
        </div>
      )}

      <Pagination
        current={page}
        total={totalPages}
        onChange={onChangePage}
        pageWindow={5}
        prevIcon={<img src={ic_keyboard_arrow_left_gray700_20} alt="" aria-hidden="true" />}
        nextIcon={<img src={ic_keyboard_arrow_right_gray700_20} alt="" aria-hidden="true" />}
      />
    </>
  );
}
