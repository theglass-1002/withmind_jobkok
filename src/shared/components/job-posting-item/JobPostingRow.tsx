import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import "./JobPostingItem.css";
import type { JobItem } from "@/api/job/job.types";
import JobPostingItemRowNoAiPick from "@/shared/components/jobPosting-v3/JobPostingItemRowNoAiPick";
import JobPostingItemRowAiPick from "@/shared/components/jobPosting-v3/JobPostingItemRowAiPick";

type Props = {
  jobs: JobItem[];
  loading?: boolean;
  isResumeBased?: boolean;
};

type ToggleState = Record<number, 0 | 1>;

export default function JobPostingRow({
  jobs,
  loading,
  isResumeBased = false,
}: Props) {
  const [bookmarks, setBookmarks] = useState<ToggleState>({});
  const [applied, setApplied] = useState<ToggleState>({});

  useEffect(() => {
    const bm: ToggleState = {};
    const ap: ToggleState = {};

    jobs.forEach((job) => {
      if (typeof job.jobIdx === "number") {
        bm[job.jobIdx] = (job.favorite as 0 | 1) ?? 0;
        ap[job.jobIdx] = (job.applied as 0 | 1) ?? 0;
      }
    });

    setBookmarks(bm);
    setApplied(ap);
  }, [jobs]);

  const handleRecordAsApplied = (
    e: React.MouseEvent,
    jobId: number,
    next: 0 | 1
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setApplied((prev) => ({ ...prev, [jobId]: next }));

    if (next === 1) {
      toast.success("지원한 포지션으로 기록했어요.");
    } else {
      toast.info("기록을 해제했어요.");
    }
  };

  const handleBookmark = (
    e: React.MouseEvent,
    jobId: number,
    next: 0 | 1
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarks((prev) => ({ ...prev, [jobId]: next }));
  };

  const formatMetaText = (job: JobItem) => {
    const location = job.location || "지역 무관";
    const edu = job.educationText || "학력 무관";
    return `${location}ㆍ경력 무관ㆍ${edu}`;
  };

  const formatEmploymentType = (type?: string | null) => {
    switch (type) {
      case "regular":
        return "정규직";
      case "contract":
        return "계약직";
      case "intern":
        return "인턴";
      case "parttime":
        return "파트타임";
      default:
        return "고용형태 무관";
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="job-posting__list job-posting__list--row">
        <div className="job-posting__loading">공고를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="job-posting__list job-posting__list--row">
        <div className="job-posting__empty">표시할 공고가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="job-posting__list job-posting__list--row">
      {jobs.map((job, index) => {
        const itemKey = `job-row-${job.jobIdx ?? "no-id"}-${index}`;
        const showAiPickMark = isResumeBased && index < 3;

        return (
          <div key={itemKey} className="job-posting__item job-posting__item--row">
            {isResumeBased ? (
              <JobPostingItemRowAiPick
                job={job}
                showAppliedSection={false}
                showAiPickMark={showAiPickMark}
              />
            ) : (
              <JobPostingItemRowNoAiPick
                job={job}
                showAppliedSection={false}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}