import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import defaultCompanyLogo from "@/assets/images/default-company-logo.svg";
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
import { Icons } from "@/assets/icons";

const DEFAULT_SUCCESS_MESSAGE = "지원 정보가 반영되었습니다.";
const DEFAULT_INFO_MESSAGE = "기록을 해제했어요.";

interface MypageJobCardProps {
  appliedSuccessMessage?: string;
  unappliedInfoMessage?: string;
  showAppliedSection?: boolean;
  job?: JobItem;
  onUnfavorite?: (jobIdx: number) => void;
  onFavorite?: (job: JobItem) => void;
}

export default function MypageJobCard({
  appliedSuccessMessage = DEFAULT_SUCCESS_MESSAGE,
  unappliedInfoMessage = DEFAULT_INFO_MESSAGE,
  showAppliedSection = true,
  job,
  onUnfavorite,
  onFavorite,
}: MypageJobCardProps) {
  const navigate = useNavigate();

  const [bookMark, setBookMark] = useState<0 | 1>((job?.favorite as 0 | 1) ?? 0);
  const [recordAsApplied, setRecordAsApplied] = useState<0 | 1>((job?.applied as 0 | 1) ?? 0);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  useEffect(() => {
    setBookMark((job?.favorite as 0 | 1) ?? 0);
  }, [job?.favorite]);

  useEffect(() => {
    setRecordAsApplied((job?.applied as 0 | 1) ?? 0);
  }, [job?.applied]);

  const handleGoToJobPost = () => {
    if (!job) return;
    navigate(`/jobs/${job.jobIdx}`, {
      state: { title: job.companyName ?? "" },
    });
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job || isBookmarkLoading) return;

    const prev = bookMark;
    const isFavorite = prev === 1;
    const next: 0 | 1 = isFavorite ? 0 : 1;

    try {
      setIsBookmarkLoading(true);
      setBookMark(next);

      await toggleJobFavorite(job.jobIdx, isFavorite);

      if (next === 1) {
        toast.success("즐겨찾기에 추가되었습니다.");
        onFavorite?.({ ...job, favorite: 1 as 0 | 1 });
      } else {
        toast.success("즐겨찾기가 해제되었습니다.");
        onUnfavorite?.(job.jobIdx);
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
    } finally {
      setIsBookmarkLoading(false);
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
      } else {
        await unmarkJobApplied(job.jobIdx);
        toast.info(unappliedInfoMessage);
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
            <img className="job-posting__logo" src={defaultCompanyLogo} alt="" />
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
          src={job.companyLogoUrl || defaultCompanyLogo}
          alt={job.companyName ?? ""}
        
              onError={(e) => {
                e.currentTarget.src = defaultCompanyLogo;
              }}
            />

        <img
          className="job-card__favorite"
          src={
            bookMark === 0
              ? Icons.ic_bookmark_gray400_24
              : Icons.ic_bookmark_active_purple24
          }
          onClick={handleBookmarkToggle}
          alt="즐겨찾기"
        />
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
            <div
              className="job-card__control job-card__control--radio"
              onClick={(e) => handleRecordAsApplied(e, 1)}
            >
              <div className="radio_check_blank_gray" />
              지원한 포지션으로 기록하기
            </div>
          ) : (
            <div
              className="job-card__control job-card__control--radio on"
              onClick={(e) => handleRecordAsApplied(e, 0)}
            >
              <img src={check_circle_purple} alt="" />
              지원한 포지션으로 기록하기
            </div>
          ))}
      </div>
    </div>
  );
}