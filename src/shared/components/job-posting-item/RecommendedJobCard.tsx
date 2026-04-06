import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import mp_test_logo from "@/assets/icons/mp_test_logo.png";
import "./RecommendedJobCard.css";

import {
  type JobItem,
  getCareerLabel,
  getEducationLabel,
  getEmploymentTypeLabel,
  getLocationLabel,
} from "@/api/job/job.types";
import { toggleJobFavorite } from "@/api/job/job.api";
import { logout } from "@/api/auth/auth.api";
import { Icons } from "@/assets/icons";

type RecommendedJobCardProps = {
  jobs?: JobItem[];
};

type BookmarkMap = Record<number, boolean>;

export default function RecommendedJobCard({
  jobs = [],
}: RecommendedJobCardProps) {
  const navigate = useNavigate();
  const [bookmarkOverrides, setBookmarkOverrides] = useState<BookmarkMap>({});

  const getBookmarked = (job: JobItem) => {
    return bookmarkOverrides[job.jobIdx] ?? (job.favorite === 1);
  };

  const handleBookmark = async (e: React.MouseEvent, targetJob: JobItem) => {
    e.preventDefault();
    e.stopPropagation();

    const prev = getBookmarked(targetJob);
    const next = !prev;

    try {
      setBookmarkOverrides((prevMap) => ({
        ...prevMap,
        [targetJob.jobIdx]: next,
      }));

      await toggleJobFavorite(targetJob.jobIdx, prev);

      toast.success(
        next ? "즐겨찾기에 추가되었습니다." : "즐겨찾기가 해제되었습니다."
      );
    } catch (e: any) {
      console.error("즐겨찾기 처리 오류:", e);

      setBookmarkOverrides((prevMap) => ({
        ...prevMap,
        [targetJob.jobIdx]: prev,
      }));

      if (e?.code === 999) {
        logout();
        navigate("/login");
        return;
      }

      toast.error("즐겨찾기 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <ul className="job-list recommend">
      {jobs.map((job) => {
        const loc = getLocationLabel(job.locationCode);
        const career = getCareerLabel(job.annualFrom, job.annualTo);
        const edu = getEducationLabel(job.educationCode);
        const employmentType = getEmploymentTypeLabel(job.employmentType);
        const isBookmarked = getBookmarked(job);

        return (
          <li
            key={job.jobIdx}
            className="job-card"
            onClick={() =>
              navigate(
                `/jobs/${job.jobIdx}?title=${encodeURIComponent(
                  job.companyName ?? ""
                )}`
              )
            }
            style={{ cursor: "pointer" }}
          >
            <div className="job-head">
              <span className="job-logo">
                <img src={job.companyLogoUrl || mp_test_logo} alt="" />
              </span>

              <span
                className="job-bookmark"
                onClick={(e) => handleBookmark(e, job)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={isBookmarked ? Icons.ic_bookmark_active_purple24 : Icons.ic_bookmark_gray400_24}
                  alt=""
                />
              </span>
            </div>

            <div className="job-main">
              <div className="job-company">
                <span className="company-name">{job.companyName}</span>
                <span className="job-role">{job.name}</span>
              </div>

              <div className="job-meta">
                <div className="job-meta__tags">
                  <span className="job-tag job-tag--location">{loc}</span>
                  <span className="job-tag job-tag--experience">{career}</span>
                  <span className="job-tag job-tag--education">
                    {job.educationText ?? edu}
                  </span>
                </div>
                <div className="job-type">{employmentType}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}