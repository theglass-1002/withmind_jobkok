import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import JobPostingItemCardNoAiPick from "@/shared/components/jobPosting-v3/JobPostingItemCardNoAiPick";

import { fetchJobList } from "@/api/job/job.api";
import type { JobItem } from "@/api/job/job.types";

import "./RecentJobs.css";
import "@/shared/components/job-posting-item/JobPostingItem.css";

export default function RecentJobsList() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoToJobs = () => {
    navigate("/jobs", { state: { activeTab: "all" } });
  };

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);
        const result = await fetchJobList(1, 15, { tabs: "recent" });
        setJobs(result.jobs ?? []);
      } catch (err) {
         setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div className="mypage__content-area saved-jobs-page">
      <LoadingOverlay isLoading={isLoading} />

      <span className="saved-jobs-page_title">최근 본 공고</span>

      <div className="saved-jobs__main-container">
        <div className="saved-jobs__toolbar">
          <div className="toolbar__stats">
            <span className="stats__label">최대 15개까지 보관됩니다.</span>
          </div>
        </div>

        {!jobs || jobs.length === 0 ? (
          <div className="saved-jobs__content-empty-area completed">
            <div className="jobs-empty-state">
              <span className="empty-state__title">최근 본 공고가 없습니다.</span>
              <span className="empty-state__desc">
                채용 공고를 둘러보고 최근 본 공고를 확인해 보세요.
              </span>
            </div>
            <button className="default_btn_white" onClick={handleGoToJobs}>
              채용 공고 보러 가기
            </button>
          </div>
        ) : (
          <div className="saved-jobs__content-area card job-posting__list--grid">
            {jobs.map((job) => (
              <JobPostingItemCardNoAiPick
                key={job.jobIdx}
                job={job}
                showAppliedSection={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
