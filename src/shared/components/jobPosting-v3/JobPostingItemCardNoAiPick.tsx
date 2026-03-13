import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import bookmark_active_purple from "@/assets/icons/bookmark_active_purple.png";
import bookmark_inactive from "@/assets/icons/bookmark_inactive.png";
import mp_test_logo from "@/assets/icons/mp_test_logo.png";
import jobkorea from "@/assets/icons/company_logos/jobkorea.png";
import fire from "@/assets/icons/fire.png";
import seed from "@/assets/icons/seed.png";
import check_circle_purple from "@/assets/icons/check_circle_purple.png";

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

interface JobPostingItemCardNoAiPickProps {
  appliedSuccessMessage?: string;
  unappliedInfoMessage?: string;
  showAppliedSection?: boolean;
  job?: JobItem;
  onUnfavorite?: (jobId: number) => void;
  onUnapplied?: (jobId: number) => void;
  onAppliedChanged?: (jobId: number, nextApplied: 0 | 1) => void;
  onFavoriteChanged?: (jobId: number, nextFavorite: 0 | 1) => void;
}

export default function JobPostingItemCardNoAiPick({
  appliedSuccessMessage = DEFAULT_SUCCESS_MESSAGE,
  unappliedInfoMessage = DEFAULT_INFO_MESSAGE,
  showAppliedSection = true,
  job,
  onUnfavorite = () => {},
  onUnapplied = () => {},
  onAppliedChanged = () => {},
  onFavoriteChanged = () => {},
}: JobPostingItemCardNoAiPickProps) {
  const navigate = useNavigate();

  const [bookMark, setBookMark] = useState<0 | 1>(((job?.favorite as 0 | 1) ?? 0));
  const [recordAsApplied, setRecordAsApplied] = useState<0 | 1>(((job?.applied as 0 | 1) ?? 0));

  useEffect(() => {
    setBookMark(((job?.favorite as 0 | 1) ?? 0));
  }, [job?.favorite, job?.jobIdx]);

  useEffect(() => {
    setRecordAsApplied(((job?.applied as 0 | 1) ?? 0));
  }, [job?.applied, job?.jobIdx]);

  const handleGoToJobPost = () => {
    if (!job) return;
    navigate(`/jobs/${job.jobIdx}?title=${encodeURIComponent(job.companyName ?? "")}`);
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job) return;

    const prev = bookMark;
    const isFavorite = prev === 1;
    const next: 0 | 1 = isFavorite ? 0 : 1;

    try {
      setBookMark(next);

      await toggleJobFavorite(job.jobIdx, isFavorite);

      toast.success(next === 1 ? "즐겨찾기에 추가되었습니다." : "즐겨찾기가 해제되었습니다.");

      onFavoriteChanged(job.jobIdx, next);

      if (next === 0) {
        onUnfavorite(job.jobIdx);
      }
    } catch (err: any) {
      console.error(err);

      setBookMark(prev);

      if (err?.code === 999) {
        logout();
        navigate("/login");
        return;
      }

      toast.error("즐겨찾기 처리 중 오류가 발생했습니다.");
    }
  };

  const handleRecordAsApplied = async (e: React.MouseEvent, next: 0 | 1) => {
    e.stopPropagation();
    if (!job) return;

    const prev = recordAsApplied;
    if (prev === next) return;

    setRecordAsApplied(next);

    try {
      if (next === 1) {
        await markJobApplied(job.jobIdx);
        toast.success(appliedSuccessMessage);
        onAppliedChanged(job.jobIdx, 1);
      } else {
        await unmarkJobApplied(job.jobIdx);
        toast.info(unappliedInfoMessage);
        onAppliedChanged(job.jobIdx, 0);
        onUnapplied(job.jobIdx);
      }
    } catch (err: any) {
      console.error(err);

      setRecordAsApplied(prev);

      if (err?.code === 999) {
        logout();
        navigate("/login");
        return;
      }

      toast.error("지원 기록 처리 중 오류가 발생했습니다.");
    }
  };

  if (!job) {
    return (
      <div className="job-posting__card">
        <div className="job-card__header">
          <div className="job-posting__left">
            <img className="job-posting__logo" src={mp_test_logo} alt="" />
            <div className="job-card__identity">
              <div className="job-card__byline">
                <span className="job-posting__company">-</span>
                <span className="job-posting__source-logo">
                  <img src={jobkorea} alt="" />
                </span>
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
        <div className="job-posting__left">
          <img
            className="job-posting__logo"
            src={job.companyLogoUrl || mp_test_logo}
            alt={job.companyName ?? ""}
          />
          <div className="job-card__identity">
            <div className="job-card__byline">
              <span className="job-posting__company">{job.companyName}</span>
              <span className="job-posting__source-logo">
              <img src={job.companyLogoUrl} alt="" />
              </span>
            </div>
            <span className="job-posting__role">{job.name}</span>
          </div>
        </div>

        <span className="job-card__favorite">
          <img
            src={bookMark === 0 ? bookmark_inactive : bookmark_active_purple}
            onClick={handleBookmarkToggle}
            alt=""
          />
        </span>
      </div>

      <div className="job-card__divider" />

      <div className="job-card__body">
        <div className="job-card__content">
          <div className="job-card__facts">
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
