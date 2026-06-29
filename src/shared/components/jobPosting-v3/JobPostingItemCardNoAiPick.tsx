import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import bookmark_active_purple from "@/assets/icons/bookmark_active_purple.png";
import bookmark_inactive from "@/assets/icons/bookmark_inactive.png";
import defaultCompanyLogo from "@/assets/images/default-company-logo.svg";
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
import { Icons } from "@/assets/icons";

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

  const [bookMark, setBookMark] = useState<0 | 1>(
    ((job?.favorite as 0 | 1) ?? 0)
  );
  const [recordAsApplied, setRecordAsApplied] = useState<0 | 1>(
    ((job?.applied as 0 | 1) ?? 0)
  );

  useEffect(() => {
    setBookMark((job?.favorite as 0 | 1) ?? 0);
  }, [job?.favorite, job?.jobIdx]);

  useEffect(() => {
    setRecordAsApplied((job?.applied as 0 | 1) ?? 0);
  }, [job?.applied, job?.jobIdx]);

  // ✅ sourcePlatform 안전 처리
  const sourcePlatform = job?.sourcePlatform?.toLowerCase?.() ?? null;

  // ✅ 로고 매핑
  const sourceMeta = useMemo(() => {
    const sourceMap: Record<
      string,
      {
        label: string;
        logo: string | null;
      }
    > = {
      jobkorea: {
        label: "jobkorea",
        logo: Icons.jobkorea_provider_logo18,
      },
      wanted: {
        label: "wanted",
        logo: Icons.wanted_provider_logo18,
      },
      saramin: {
        label: "saramin",
        logo: Icons.saramin_provider_logo18,
      },
    };

    if (!sourcePlatform || !sourceMap[sourcePlatform]) {
      return {
        label: "internal",
        logo: Icons.jobkok_provider_logo18,
      };
    }

    return sourceMap[sourcePlatform];
  }, [sourcePlatform]);

  const handleGoToJobPost = () => {
    if (!job) return;
    navigate(`/jobs/${job.jobIdx}`, {
      state: { title: job.companyName ?? "" },
    });
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

      toast.success(
        next === 1
          ? "즐겨찾기에 추가되었습니다."
          : "즐겨찾기가 해제되었습니다."
      );

      onFavoriteChanged(job.jobIdx, next);

      if (next === 0) {
        onUnfavorite(job.jobIdx);
      }
    } catch (err: any) {
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
                <span className="job-posting__source-logo">
                  <img
                    src={Icons.jobkok_provider_logo18}
                    alt="internal"
                  />
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
            src={job.companyLogoUrl || defaultCompanyLogo}
            alt={job.companyName ?? ""}
          
              onError={(e) => {
                e.currentTarget.src = defaultCompanyLogo;
              }}
            />

          <div className="job-card__identity">
            <div className="job-card__byline">
              <span className="job-posting__company">
                {job.companyName}
              </span>

              <span className="job-posting__source-logo">
                {sourceMeta.logo && (
                  <img src={sourceMeta.logo} alt={sourceMeta.label} />
                )}
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

        {/* <div className="job-posting__badges">
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
        </div> */}

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