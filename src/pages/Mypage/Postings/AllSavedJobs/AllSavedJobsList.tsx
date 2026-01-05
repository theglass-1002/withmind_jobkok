import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import JobPostingItemCardNoAiPick from "@/shared/components/jobPosting-v3/JobPostingItemCardNoAiPick";
import JobPostingItemRowNoAiPick from "@/shared/components/jobPosting-v3/JobPostingItemRowNoAiPick";
import Pagination from "@/shared/components/Pagination";

import ic_keyboard_arrow_left_gray700_20 from "@/assets/icons/size20/ic_keyboard_arrow_left_gray700_20.png";
import ic_keyboard_arrow_right_gray700_20 from "@/assets/icons/size20/ic_keyboard_arrow_right_gray700_20.png";

import type { JobItem } from "@/api/job/job.types";

interface AllSavedJobsListProps {
  viewType: "row" | "card";
  jobs?: JobItem[];

  page?: number;
  totalPages?: number;
  onChangePage?: (p: number) => void;
}

export default function AllSavedJobsList({
  viewType,
  jobs = [],            // ✅ 기본값: undefined면 빈 배열
  page = 1,             // ✅ 기본값
  totalPages = 1,       // ✅ 기본값
  onChangePage = () => {}, // ✅ 기본값
}: AllSavedJobsListProps) {
  const navigate = useNavigate();

  useEffect(() => {
  }, [jobs]);

  const handleGoToJobs = () => {
    navigate("/jobs");
  };

  return (
    <>
      {viewType === "card" ? (
        <div className={`saved-jobs__content-area ${viewType} job-posting__list--grid`}>
          {jobs.map((job, idx) => (
            <JobPostingItemCardNoAiPick
              key={(job as any).jobId ?? (job as any).id ?? `${idx}`}
              job={job}
              appliedSuccessMessage="지원 정보가 반영되었습니다."
            />
          ))}
        </div>
      ) : (
        <div className={`saved-jobs__content-area ${viewType} job-posting__item job-posting__item--row`}>
          {jobs.map((job, idx) => (
            <JobPostingItemRowNoAiPick
              key={(job as any).jobId ?? (job as any).id ?? `${idx}`}
              job={job}
              appliedSuccessMessage="지원 정보가 반영되었습니다."
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
