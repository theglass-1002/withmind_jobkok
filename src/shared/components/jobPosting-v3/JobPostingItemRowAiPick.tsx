import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import bookmark_active_purple from "@/assets/icons/bookmark_active_purple.png";
import bookmark_inactive from "@/assets/icons/bookmark_inactive.png";
import mp_test_logo from "@/assets/icons/mp_test_logo.png";
import fire from "@/assets/icons/fire.png";
import seed from "@/assets/icons/seed.png";
import ic_check_circle_purple_20 from "@/assets/icons/size20/ic_check_circle_purple_20.png";
import ai_pick from "@/assets/icons/ai_pick.png";
import green_star16x16 from "@/assets/icons/green_star16x16.png";

import {
  formatDueDate,
  getCareerLabel,
  getEducationLabel,
  getEmploymentTypeLabel,
  getLocationLabel,
  type JobItem,
} from "@/api/job/job.types";
import { toggleJobFavorite } from "@/api/job/job.api";
import { logout } from "@/api/auth/auth.api";
import { Icons } from "@/assets/icons";

const DEFAULT_SUCCESS_MESSAGE = "지원 정보가 반영되었습니다.";
const DEFAULT_INFO_MESSAGE = "기록을 해제했어요.";

interface JobPostingItemRowAiPickProps {
  appliedSuccessMessage?: string;
  unappliedInfoMessage?: string;
  showAppliedSection?: boolean;
  job?: JobItem;
}

export default function JobPostingItemRowAiPick({
  appliedSuccessMessage = DEFAULT_SUCCESS_MESSAGE,
  unappliedInfoMessage = DEFAULT_INFO_MESSAGE,
  showAppliedSection = true,
  job,
}: JobPostingItemRowAiPickProps) {
  const navigate = useNavigate();

  const [bookMark, setBookMark] = useState<0 | 1>(
    ((job?.favorite as 0 | 1) ?? 0)
  );
  const [recordAsApplied, setRecordAsApplied] = useState<0 | 1>(
    ((job?.applied as 0 | 1) ?? 0)
  );

  const sourcePlatform = job?.sourcePlatform?.toLowerCase?.() ?? null;

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
    navigate(
      `/jobs/${job.jobIdx}?title=${encodeURIComponent(job.companyName ?? "")}`
    );
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job) return;

    const prev = bookMark;
    const isFavorite = prev === 1;
    const next: 0 | 1 = isFavorite ? 0 : 1;

    try {
      setBookMark(next);
      await toggleJobFavorite(job.jobIdx, isFavorite);
      toast.success(
        next === 1 ? "즐겨찾기에 추가되었습니다." : "즐겨찾기가 해제되었습니다."
      );
    } catch (e: any) {
      setBookMark(prev);

      if (e?.code === 999) {
        logout();
        navigate("/login");
        return;
      }

      toast.error("즐겨찾기 처리 중 오류가 발생했습니다.");
    }
  };

  const handleRecordAsApplied = (e: React.MouseEvent, next: 0 | 1) => {
    e.stopPropagation();
    setRecordAsApplied(next);

    if (next === 1) toast.success(appliedSuccessMessage);
    else toast.info(unappliedInfoMessage);
  };

  if (!job) {
    return (
      <div className="job-posting__card">
        <div className="job-posting__row job-posting__row--top">
          <div className="job-posting__left">
            <img className="job-posting__logo" src={mp_test_logo} alt="" />
            <div className="job-posting__details">
              <div className="job-posting__title">
                <span className="job-posting__company">-</span>
                <span className="job-posting__role">-</span>
              </div>
            </div>
          </div>
          <div className="job-posting__right job-posting__favorite">
            <img src={bookmark_inactive} alt="" />
          </div>
        </div>
      </div>
    );
  }

  const loc = getLocationLabel(job.locationCode);
  const career = getCareerLabel(job.annualFrom, job.annualTo);
  const edu = getEducationLabel(job.educationCode);
  const employmentType = getEmploymentTypeLabel(job.employmentType);
  const due = formatDueDate(job.dueTime);

  return (
    <>
      <div className="job-posting__card" onClick={handleGoToJobPost}>
        <div className="job-posting__row job-posting__row--top">
          <div className="job-posting__left">
            <img
              className="job-posting__logo"
              src={job.companyLogoUrl || mp_test_logo}
              alt={job.companyName ?? ""}
            />
            <div className="job-posting__details">
              <div className="job-posting__title">
                <span className="job-posting__company">
                  {job.companyName}
                  <span className="job-posting__source-logo">
                    {sourceMeta.logo && (
                      <img src={sourceMeta.logo} alt={sourceMeta.label} />
                    )}
                  </span>
                </span>
                <span className="job-posting__role">{job.name}</span>
              </div>

              <div className="job-posting__meta">
              <span className="job-posting__match job-posting__match--level">
            AI 적합도 {job.matchPercent ? job.matchPercent : 0}%
          </span>
                <div className="job-posting__meta-items">
                  <span className="job-posting__meta-item">
                    {loc}ㆍ{career}ㆍ{edu}
                  </span>
                  <span className="job-posting__meta-item">{employmentType}</span>
                  <span className="job-posting__meta-item">{due}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="job-posting__right job-posting__favorite"
            onClick={handleBookmark}
            style={{ cursor: "pointer" }}
          >
            <img
              src={bookMark === 1 ? bookmark_active_purple : bookmark_inactive}
              alt=""
            />
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
          <div className="job-posting__ai-pick">
            <img src={ai_pick} alt="" />
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
                src={ic_check_circle_purple_20}
                alt=""
              />
              지원한 포지션으로 기록하기
            </div>
          ))}
      </div>

      <div className="job-posting__card mobile" onClick={handleGoToJobPost}>
        <div className="job-posting__row job-posting__row--top">
          <div className="job-posting__left">
            <img
              className="job-posting__logo"
              src={job.companyLogoUrl || mp_test_logo}
              alt={job.companyName ?? ""}
            />
            <div className="job-posting__details">
              <div className="job-posting__title">
                <span className="job-posting__company">
                  {job.companyName}
                  <span className="job-posting__source-logo">
                    {sourceMeta.logo && (
                      <img src={sourceMeta.logo} alt={sourceMeta.label} />
                    )}
                  </span>
                </span>
                <span className="job-posting__role">{job.name}</span>
              </div>
            </div>
          </div>

          <div
            className="job-posting__right job-posting__favorite"
            onClick={handleBookmark}
            style={{ cursor: "pointer" }}
          >
            <img
              src={bookMark === 1 ? bookmark_active_purple : bookmark_inactive}
              alt=""
            />
          </div>
        </div>

        <span className="job-posting__match job-posting__match--level">
            AI 적합도 {job.matchPercent ? job.matchPercent : 0}%
          </span>

        <div className="job-posting__meta">
          <div className="job-posting__meta-items">
            <span className="job-posting__meta-item">
              {loc}ㆍ{career}ㆍ{edu}
            </span>
            <span className="job-posting__meta-item">{employmentType}</span>
          </div>
          <span className="job-posting__meta-item">{due}</span>
        </div>

        <div className="job-posting__row job-posting__row--bottom">
          <div className="job-posting__badges">
            <div className="job-posting__ai-pick">
              <img src={ai_pick} alt="" />
            </div>
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
              />
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

      {/* 
      <div className="job-posting__card mobile" onClick={handleGoToJobPost}>
        <div className="job-posting__row job-posting__row--top">
          <div className="job-posting__left">
            <img
              className="job-posting__logo"
              src={job.companyLogoUrl || mp_test_logo}
              alt={job.companyName ?? ""}
            />
            <div className="job-posting__details">
              <div className="job-posting__title">
                <span className="job-posting__company">
                  {job.companyName}
                  <span className="job-posting__source-logo">
                    {sourceMeta.logo && (
                      <img src={sourceMeta.logo} alt={sourceMeta.label} />
                    )}
                  </span>
                </span>
                <span className="job-posting__role">{job.name}</span>
              </div>

              <div className="job-posting__meta">
                <div className="job-posting__match job-posting__match--level">
                  <img src={green_star16x16} alt="" /> AI 적합도 90%
                </div>
                <div className="job-posting__meta-items">
                  <span className="job-posting__meta-item">
                    {loc}ㆍ{career}ㆍ{edu}
                  </span>
                  <span className="job-posting__meta-item">{employmentType}</span>
                </div>
                <span className="job-posting__meta-item">{due}</span>
              </div>
            </div>
          </div>

          <div
            className="job-posting__right job-posting__favorite"
            onClick={handleBookmark}
            style={{ cursor: "pointer" }}
          >
            <img
              src={bookMark === 1 ? bookmark_active_purple : bookmark_inactive}
              alt=""
            />
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
          <div className="job-posting__ai-pick">
            <img src={ai_pick} alt="" />
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
                src={ic_check_circle_purple_20}
                alt=""
              />
              지원한 포지션으로 기록하기
            </div>
          ))}
      </div>
      */}
    </>
  );
}