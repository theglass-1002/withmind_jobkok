import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import bookmark_active_purple from "@/assets/icons/bookmark_active_purple.png";
import bookmark_inactive from "@/assets/icons/bookmark_inactive.png";
import mp_test_logo from "@/assets/icons/mp_test_logo.png";
import jobkorea from "@/assets/icons/company_logos/jobkorea.png";
import fire from "@/assets/icons/fire.png";
import seed from "@/assets/icons/seed.png";
import ic_check_circle_purple_20 from "@/assets/icons/size20/ic_check_circle_purple_20.png";

import {
  getCareerLabel,
  getEducationLabel,
  getEmploymentTypeLabel,
  getLocationLabel,
  type JobItem,
} from "@/api/job/job.types";

const DEFAULT_SUCCESS_MESSAGE = "지원 정보가 반영되었습니다.";
const DEFAULT_INFO_MESSAGE = "기록을 해제했어요.";

interface JobPostingItemRowNoAiPickProps {
  appliedSuccessMessage?: string; // 지원 기록 시 성공 메시지
  unappliedInfoMessage?: string; // 기록 해제 시 알림 메시지

  /** "지원한 포지션으로 기록하기" 영역 노출 여부 (default: true) */
  showAppliedSection?: boolean;

  /** 🔥 실제 공고 데이터 */
  job?: JobItem;
}

export default function JobPostingItemRowNoAiPick({
  appliedSuccessMessage = DEFAULT_SUCCESS_MESSAGE,
  unappliedInfoMessage = DEFAULT_INFO_MESSAGE,
  showAppliedSection = true,
  job,
}: JobPostingItemRowNoAiPickProps) {
  const navigate = useNavigate();
  const [bookMark, setBookMark] = useState<0 | 1>(
    (job.favorite as 0 | 1) ?? 0
  );
  const [recordAsApplied, setRecordAsApplied] = useState<0 | 1>(
    (job.applied as 0 | 1) ?? 0
  );

  const handleGoToJobPost = () => {
    navigate(
      `/jobs/${job.id}?title=${encodeURIComponent(job.companyName ?? "")}`
    );
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 네비게이션 막기
    setBookMark((prev) => (prev === 0 ? 1 : 0));
    // TODO: 북마크 API 호출 자리
  };

  const handleRecordAsApplied = (e: React.MouseEvent, next: 0 | 1) => {
    e.stopPropagation(); // 카드 클릭 네비게이션 막기
    setRecordAsApplied(next);
    if (next === 1) {
      toast.success(appliedSuccessMessage);
    } else {
      toast.info(unappliedInfoMessage);
    }
  };

  // ===== 메타 정보 가공 =====
  const loc = getLocationLabel(job.locationCode);
  const career = getCareerLabel(job.annualFrom, job.annualTo);
  const edu = getEducationLabel(job.educationCode);
  const employmentType = getEmploymentTypeLabel(job.employmentType);
  const due = job.dueTime ?? "상시 채용";

  return (
    <div className="job-posting__card" onClick={handleGoToJobPost}>
      <div className="job-posting__row job-posting__row--top">
        <div className="job-posting__left">
          <img
            className="job-posting__logo"
            src={job.companyLogoUrl || mp_test_logo}
            alt={job.companyName}
          />
          <div className="job-posting__details">
            <div className="job-posting__title">
              <span className="job-posting__company">
                {job.companyName}
                <span className="job-posting__source-logo">
                  <img src={jobkorea} alt="" />
                </span>
              </span>
              <span className="job-posting__role">{job.name}</span>
            </div>
            <div className="job-posting__meta">
              <div className="job-posting__meta-items">
                <span className="job-posting__meta-item">
                  {loc}ㆍ{career}ㆍ{edu}
                </span>
                <span className="job-posting__meta-item">
                  {employmentType}
                </span>
                <span className="job-posting__meta-item">{due}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="job-posting__right job-posting__favorite">
          {bookMark === 0 ? (
            <img onClick={handleBookmarkToggle} src={bookmark_inactive} alt="" />
          ) : (
            <img
              onClick={handleBookmarkToggle}
              src={bookmark_active_purple}
              alt=""
            />
          )}
        </div>
      </div>

      <div className="job-posting__row job-posting__row--bottom">
        <div className="job-posting__badges">
          <span className="job-posting__badge">
            <span>
              <img src={seed} alt="" />
            </span>
            여유있는근무제!
          </span>
          <span className="job-posting__badge job-posting__badge--urgent">
            <img src={fire} alt="" />
            마감임박!
          </span>
        </div>
      </div>

    
      {showAppliedSection &&
        (recordAsApplied === 0 ? (
          <div className="job-card__control job-card__control--radio">
            <div
              className="radio_check_blank_gray"
              onClick={(e) => handleRecordAsApplied(e, 1)}
            ></div>
            지원한 포지션으로 기록하기
          </div>
        ) : (
          <div className="job-card__control job-card__control--radio on">
            <img
              onClick={(e) => handleRecordAsApplied(e, 0)}
              src={ic_check_circle_purple_20}
              alt=""
            />
            지원한 포지션으로 기록하기
          </div>
        ))}
    </div>
  );
}
