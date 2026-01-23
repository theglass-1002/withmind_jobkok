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
import JobPostingItemCardNoAiPick from "@/shared/components/jobPosting-v3/JobPostingItemCardNoAiPick";
import JobPostingItemCardAiPick from "@/shared/components/jobPosting-v3/JobPostingItemCardAiPick";




type Props = {
  jobs: JobItem[];
  loading?: boolean;
  isResumeBased?: boolean; // 🔥 이력서 기반 추천 여부
};

type ToggleState = Record<number, 0 | 1>;

export default function JobPostingCard({
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
    const location = job.location || "서울 마포구"; // 예시 기본값
    const edu = job.educationText || "대졸 이상";
    return `${location}ㆍ신입 이상ㆍ${edu}`;
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
        return "정규직ㆍ계약직";
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="job-posting__list job-posting__list--grid">
        <div className="job-posting__loading">공고를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="job-posting__list job-posting__list--grid">
        <div className="job-posting__empty">표시할 공고가 없습니다.</div>
      </div>
    );
  }

  //  이력서 기반이 아닌 경우 → NoAiPick 카드로 전부 렌더
  if (!isResumeBased) {
    return (
      <div className="job-posting__list job-posting__list--grid">
        {jobs.map((job) => (
          <JobPostingItemCardNoAiPick
            key={job.id}
            job={job}
            showAppliedSection={false}
          />
        ))}
      </div>
    );
  }

  //  이력서 기반 추천인 경우 → AI 카드 + AI PICK
  return (
    <>
       <div className="job-posting__list job-posting__list--grid">
        {jobs.map((job) => (
          <JobPostingItemCardAiPick
            key={job.id}
            job={job}
            showAppliedSection={false}
          />
        ))}
      </div>
    </>
  );
}
