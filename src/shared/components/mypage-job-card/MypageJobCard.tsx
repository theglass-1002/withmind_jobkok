import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import bookmark_active_purple from "@/assets/icons/bookmark_active_purple.png";
import bookmark_inactive from "@/assets/icons/bookmark_inactive.png";
import mp_test_logo from "@/assets/icons/mp_test_logo.png";
import jobkorea from "@/assets/icons/company_logos/jobkorea.png";
import fire from "@/assets/icons/fire.png";
import seed from "@/assets/icons/seed.png";
import check_circle_purple from "@/assets/icons/check_circle_purple.png";
import "./MypageJobCard.css";


import {
  getCareerLabel,
  getEducationLabel,
  getEmploymentTypeLabel,
  getLocationLabel,
  type JobItem,
} from "@/api/job/job.types";

import {
  toggleJobFavorite,
  markJobApplied,
  unmarkJobApplied,
} from "@/api/job/job.api";

import { logout } from "@/api/auth/auth.api";

const DEFAULT_SUCCESS_MESSAGE = "지원 정보가 반영되었습니다.";
const DEFAULT_INFO_MESSAGE = "기록을 해제했어요.";

interface MypageJobCardProps {
  appliedSuccessMessage?: string;
  unappliedInfoMessage?: string;
  showAppliedSection?: boolean;

  /** 실제 공고 데이터 */
  job?: JobItem;
}

export default function MypageJobCard({
  appliedSuccessMessage = DEFAULT_SUCCESS_MESSAGE,
  unappliedInfoMessage = DEFAULT_INFO_MESSAGE,
  showAppliedSection = true,
  job,
}: MypageJobCardProps) {
  const navigate = useNavigate();

  const [bookMark, setBookMark] = useState<0 | 1>(((job?.favorite as 0 | 1) ?? 0));
  const [recordAsApplied, setRecordAsApplied] = useState<0 | 1>(((job?.applied as 0 | 1) ?? 0));

  const handleGoToJobPost = () => {
    if (!job) return;
    navigate(`/jobs/${job.id}?title=${encodeURIComponent(job.companyName ?? "")}`);
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job) return;

    const prev = bookMark;
    const isFavorite = prev === 1;
    const next: 0 | 1 = isFavorite ? 0 : 1;

    try {
      // optimistic
      setBookMark(next);

      await toggleJobFavorite(job.id, isFavorite);

      toast.success(next === 1 ? "즐겨찾기에 추가되었습니다." : "즐겨찾기가 해제되었습니다.");
    } catch (err: any) {
      console.error(err);

      // rollback
      setBookMark(prev);

      if (err?.code === 999) {
        logout();
        navigate("/login");
        return;
      }

      toast.error("즐겨찾기 처리 중 오류가 발생했습니다.");
    }
  };

  /**
   * ✅ 지원 기록 토글
   * next === 1 → 기록하기(POST)
   * next === 0 → 기록해제(DELETE)
   */
  const handleRecordAsApplied = async (e: React.MouseEvent, next: 0 | 1) => {
    e.stopPropagation();
    if (!job) return;

    const prev = recordAsApplied;
    if (prev === next) return;

    // optimistic
    setRecordAsApplied(next);

    try {
      if (next === 1) {
        await markJobApplied(job.id);
        toast.success(appliedSuccessMessage);
      } else {
        await unmarkJobApplied(job.id);
        toast.info(unappliedInfoMessage);
      }
    } catch (err: any) {
      console.error(err);

      // rollback
      setRecordAsApplied(prev);

      if (err?.code === 999) {
        logout();
        navigate("/login");
        return;
      }

      toast.error("지원 기록 처리 중 오류가 발생했습니다.");
    }
  };

  // job 없으면 최소 렌더(에러 방지)
  if (!job) {
    return (
      <div className="job-posting__card">
        <div className="job-card__header">
          <div className="job-posting__left">
            <img className="job-posting__logo" src={mp_test_logo} alt="" />
            <div className="job-card__identity">
              <div className="job-card__byline">
                <span className="job-posting__company">-</span>
  
              </div>
              <span className="job-posting__role">-</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const loc = getLocationLabel(job.locationCode);
  const career = getCareerLabel(job.annualFrom, job.annualTo);
  const employmentType = getEmploymentTypeLabel(job.employmentType);
  const edu = getEducationLabel(job.educationCode);

  return (
    <div className="job-posting__card" onClick={handleGoToJobPost}>
      <div className="job-card__header">
      <img
            className="job-posting__logo"
            src={job.companyLogoUrl || mp_test_logo}
            alt={job.companyName ?? ""}
          />
            <span className="job-card__favorite">
          <img
            src={bookMark === 0 ? bookmark_inactive : bookmark_active_purple}
            onClick={handleBookmarkToggle}
            alt=""
          />
        </span>
      </div>
      <div className="job-card__body">
        <div className="job-card__content">
        <div className="job-card__title-group">
         <span className="job-posting__company">{job.companyName}</span>
         <span className="job-posting__role">{job.name}</span>
         </div>
         <div className="job-card__info-group">
         <div className="job-posting__meta-items">
              <span className="job-posting__meta-item">
                {loc}ㆍ{career}ㆍ{job.educationText ?? edu}
              </span>
            </div>
            <span className="job-card__deadline">
              {employmentType} ㆍ {job.dueTime ?? "상시채용"}
            </span>
         </div>

        
        </div>

        

        {showAppliedSection &&
          (recordAsApplied === 0 ? (
            <div className="job-card__control job-card__control--radio">
              <div
                className="radio_check_blank_gray"
                onClick={(e) => handleRecordAsApplied(e, 1)}
              />
              지원한 포지션으로 기록하기
            </div>
          ) : (
            <div className="job-card__control job-card__control--radio on">
              <img
                onClick={(e) => handleRecordAsApplied(e, 0)}
                src={check_circle_purple}
                alt=""
              />
              지원한 포지션으로 기록하기
            </div>
          ))}
      </div>
    </div>
  );
}
