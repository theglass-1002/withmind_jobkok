import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import bookmark_active_purple from "@/assets/icons/bookmark_active_purple.png";
import bookmark_inactive from "@/assets/icons/bookmark_inactive.png";
import mp_test_logo from "@/assets/icons/mp_test_logo.png";
import jobkorea from "@/assets/icons/company_logos/jobkorea.png";
import fire from "@/assets/icons/fire.png";
import seed from "@/assets/icons/seed.png";
import ai_pick from "@/assets/icons/ai_pick.png";
import green_star16x16 from "@/assets/icons/green_star16x16.png";
import check_circle_purple from "@/assets/icons/check_circle_purple.png";

import "./JobPostingItem.css";
import type { JobItem } from "@/api/job/job.types";
import JobPostingItemRowNoAiPick from "@/shared/components/jobPosting-v3/JobPostingItemRowNoAiPick";
import JobPostingItemRowAiPick from "@/shared/components/jobPosting-v3/JobPostingItemRowAiPick";



type Props = {
  jobs: JobItem[];
  loading?: boolean;
  isResumeBased?: boolean; // 🔥 이력서 기반 추천 여부
};

type ToggleState = Record<number, 0 | 1>;

export default function JobPostingRow({
  jobs,
  loading,
  isResumeBased = false,
}: Props) {
  const [bookmarks, setBookmarks] = useState<ToggleState>({});
  const [applied, setApplied] = useState<ToggleState>({});

  // jobs 변경될 때 초기 상태 세팅 (favorite / applied 반영 가능)
  useEffect(() => {
    const bm: ToggleState = {};
    const ap: ToggleState = {};

    jobs.forEach((job) => {
      bm[job.id] = (job.favorite as 0 | 1) ?? 0;
      ap[job.id] = (job.applied as 0 | 1) ?? 0;
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
    // 경력 필드가 없어서 일단 경력 무관으로 표시
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

  if (!isResumeBased) {
    return (
      <div className="job-posting__list job-posting__list--row">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="job-posting__item job-posting__item--row"
          >
            <JobPostingItemRowNoAiPick
              job={job}
              showAppliedSection={false} // 필요하면 true로
            />
          </div>
        ))}
      </div>
    );
  }

  //  이력서 기반 추천인 경우 → 기존 AI Pick 있는 리스트 UI 유지
  return (
    <>
   <div className="job-posting__list job-posting__list--row">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="job-posting__item job-posting__item--row"
          >
            <JobPostingItemRowAiPick
              job={job}
              showAppliedSection={false} // 필요하면 true로
            />
          </div>
        ))}
      </div>
    </>
  );
}
