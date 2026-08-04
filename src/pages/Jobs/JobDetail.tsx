import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import chevron_left from "@/assets/icons/chevron_left.png";
import text_jobkorea_logo from "@/assets/icons/company_logos/text_jobkorea_logo.png";
import arrow_up_right from "@/assets/icons/arrow-up-right.png";
import { logout } from "@/api/auth/auth.api";
import defaultCompanyLogo from "@/assets/images/default-company-logo.svg";
import withmind_logo80 from "@/assets/icons/company_logos/withmind_logo80.png";
import blank_bookmark_black from "@/assets/icons/size24/ic_bookmark_gray900_24.png";
import bookmark_active_purple from "@/assets/icons/size24/ic_bookmark_active_purple24.png";
import copy_icon_blck_24x24 from "@/assets/icons/copy_icon_blck_24x24.png";
import green_star20x20 from "@/assets/icons/green_star20x20.png";
import ic_document_search_purple_20 from "@/assets/icons/size20/ic_document_search_purple_20.png";
import ic_chevron_forward_right_purple_20 from "@/assets/icons/size20/ic_chevron_forward_right_purple_20.png";

import icon_career_gray from "@/assets/icons/aside_item_logo/icon-career-gray.png";
import icon_deadline_gray from "@/assets/icons/aside_item_logo/icon-deadline-gray.png";
import icon_education_gray from "@/assets/icons/aside_item_logo/icon-education-gray.png";
import icon_employment_gray from "@/assets/icons/aside_item_logo/icon-employment-gray.png";
import icon_location_gray from "@/assets/icons/aside_item_logo/icon-location-gray.png";
import icon_role_gray from "@/assets/icons/aside_item_logo/icon-role-gray.png";

import RecommendedJobCard from "@/shared/components/job-posting-item/RecommendedJobCard";
import M_JobDetail from "./M_JobDetail";
import Modal from "@/shared/components/modal/Modal";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import {
  fetchJobDetail,
  fetchJobList,
  toggleJobFavorite,
} from "@/api/job/job.api";
import {
  JobItem,
  getLocationLabel,
  getCareerLabel,
  getEducationLabel,
  getEmploymentTypeLabel,
} from "@/api/job/job.types";
import { fetchResumeCheck, fetchResumeList } from "@/api/resume/resume.api";

import "./JobDetail.css";
import { REAL_BASE_URL } from "@/config/config";

export default function JobDetail() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [bookMark, setBookMark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [job, setJob] = useState<JobItem | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resumeExists, setResumeExists] = useState<boolean | null>(null);
  const [hasDefaultResume, setHasDefaultResume] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadDetail = async () => {
      if (!jobId) return;

      const idNum = Number(jobId);
      if (Number.isNaN(idNum)) return;

      try {
        setLoading(true);
        setError(null);

        const { job } = await fetchJobDetail(idNum);

        if (!isMounted) return;

        setJob(job);
        setBookMark(job.favorite === 1);
        console.log("job detail:", job);

        // 이력서 목록 가져와서 확인
        const { list } = await fetchResumeList(1, 100);
        console.log('이력서 목록 조회 결과:', list);

        if (!isMounted) return;

        // 임시저장(temp='Y') 제외
        const validResumes = list.filter(r => r.temp === 'N');
        console.log('임시저장 제외한 이력서:', validResumes);

        const hasResumes = validResumes.length > 0;
        const hasDefault = validResumes.some(r => r.isDefault === 1);
        console.log('유효한 이력서 있음:', hasResumes, '/ 기본 이력서:', hasDefault);

        setResumeExists(hasResumes);
        setHasDefaultResume(hasResumes); // 임시저장 아닌 이력서가 있으면 OK

        if (hasResumes === true) {
          const page = 1;
          const size = 8;
          const params = { resumeBased: true } as any;

          const { jobs } = await fetchJobList(page, size, params);

          if (!isMounted) return;

          setRecommendedJobs(Array.isArray(jobs) ? jobs : []);
        } else {
          setRecommendedJobs([]);
        }
      } catch (e: any) {
        console.error(e);

        if (!isMounted) return;

        if (e?.code === 999) {
          console.log("로그인만료");
          logout();
          navigate("/login");
          return;
        }

        setError(
          e?.message || "채용 공고 상세를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [jobId, navigate]);

  const handleBookmark = async () => {
    if (!job?.jobIdx) return;

    const next = !bookMark;

    try {
      setBookMark(next);
      await toggleJobFavorite(job.jobIdx, bookMark);

      toast.success(
        next ? "즐겨찾기에 추가되었습니다." : "즐겨찾기가 해제되었습니다."
      );
    } catch (e: any) {
      console.error("즐겨찾기 처리 오류:", e);

      setBookMark((prev) => !prev);

      if (e?.code === 999) {
        logout();
        navigate("/login");
        return;
      }

      toast.error("즐겨찾기 처리 중 오류가 발생했습니다.");
    }
  };

  const handleCopyLink = () => {
    if (!window.location.pathname) {
      toast.error("복사할 링크가 없습니다.");
      return;
    }

    const cleanUrl = REAL_BASE_URL + window.location.pathname;

    console.log(cleanUrl);

    navigator.clipboard
      .writeText(cleanUrl)
      .then(() => {
        toast.success("공고 링크가 복사되었습니다.");
      })
      .catch(() => {
        toast.error("링크 복사에 실패했습니다.");
      });
  };

  const handleMockInterviewClick = () => {
    const cleanUrl = REAL_BASE_URL + window.location.pathname;
    console.log(cleanUrl);
    sessionStorage.setItem("mockInterviewJobUrl", cleanUrl);

    if (hasDefaultResume === true) {
      navigate(`/mock-interview/guide`);
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleApplyClick = () => {
    if (!job?.url) {
      toast.error("지원 링크가 없습니다.");
      return;
    }

    window.open(job.url, "_blank", "noopener,noreferrer");
  };

  const splitLines = (text?: string | null) =>
    text ? text.split("\n").filter((line) => line.trim().length > 0) : [];

  const title = job?.name || "채용 공고";
  const companyName = job?.companyName || "";
  const companyLogo = job?.companyLogoUrl?.trim() || defaultCompanyLogo;
  const locationLabel = job?.location || (job ? getLocationLabel(job.locationCode) : "");
  const careerLabel = job ? getCareerLabel(job.annualFrom, job.annualTo) : "";
  const educationLabel = job?.educationText || (job ? getEducationLabel(job.educationCode) : "");
  const employmentLabel = job
    ? getEmploymentTypeLabel(job.employmentType)
    : "";

  const mainTasksLines = splitLines(job?.mainTasks);
  const requirementsLines = splitLines(job?.requirements);
  const preferredPointsLines = splitLines(job?.preferredPoints);
  const benefitsLines = splitLines(job?.benefits);
  const hireRoundsLines = splitLines(job?.hireRounds);
  const deadlineText = job?.dueTime ? job.dueTime : "상시 채용";

  const hasAiMatch =
    typeof job?.matchPercent === "number" &&
    !!job?.recommendReason?.trim();

  if (loading && !job) {
    return <LoadingOverlay />;
  }

  if (error && !job) {
    return (
      <div className="job-detail__container">
        <div className="job-detail__error">
          채용 공고 상세를 불러오는 중 오류가 발생했습니다.
          <br />
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      {loading && <LoadingOverlay />}

      <div className="job-detail__container">
        <article className="job-detail">
          <section className="job-detail__main">
            <div className="job-detail__header">
              <div className="job-detail__company">
                <div className="job-detail__company-left">
                  <div className="job-detail__company-logo">
                    <img
                      className="job-detail__company-logo_img"
                      src={companyLogo}
                      alt={companyName}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultCompanyLogo;
                      }}
                    />
                  </div>
                  <div className="job-detail__company-desc">
                    <span className="job-detail__title">{title}</span>
                    <span className="job-detail__company-meta">
                      {companyName}
                      {locationLabel && `ㆍ${locationLabel}`}
                    </span>
                  </div>
                </div>
                <div className="job-detail__header-actions">
                  <span
                    className="job-detail__action job-detail__action--copy"
                    onClick={handleCopyLink}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="job-detail__action-icon">
                      <img src={copy_icon_blck_24x24} alt="" />
                    </span>
                  </span>
                  <span
                    className="job-detail__action job-detail__action--bookmark"
                    onClick={handleBookmark}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="job-detail__action-icon">
                      <img
                        src={
                          bookMark
                            ? bookmark_active_purple
                            : blank_bookmark_black
                        }
                        alt=""
                      />
                    </span>
                  </span>
                </div>
              </div>

              {hasAiMatch && (
                <div className="job-detail__ai">
                  <div className="job-detail__ai-header">
                    <span className="job-detail__ai-icon">
                      <img src={green_star20x20} alt="" />
                    </span>
                    <span className="job-detail__ai-title">
                      AI 적합도 {job?.matchPercent}%
                    </span>
                  </div>

                  <div className="job-detail__ai-summary">
                    <div className="job-detail__ai-item">
                      <span className="job-detail__ai-term">분석 요약</span>
                      <span className="job-detail__ai-desc">
                        등록된 이력서를 기준으로 공고와의 적합도를 AI가 분석한
                        결과예요.
                      </span>
                    </div>

                    <div className="job-detail__ai-item">
                      <span className="job-detail__ai-term">추천 이유</span>
                      <span className="job-detail__ai-desc">
                        {job?.recommendReason}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {resumeExists === false && (
                <div className="job-detail__resume">
                  <div className="job-detail__resume-info">
                    <img src={ic_document_search_purple_20} alt="" />
                    <span className="job-detail__resume-text">
                      이력서 작성하고 나에게 맞는 AI 공고 추천을 받아보세요.
                    </span>
                  </div>
                  <div
                    className="job-detail__resume-cta"
                    onClick={() => {
                      navigate(`/resumes`);
                    }}
                  >
                    <span className="job-detail__resume-button">
                      이력서 작성하기
                    </span>
                    <img src={ic_chevron_forward_right_purple_20} alt="" />
                  </div>
                </div>
              )}
            </div>

            <div className="job-detail__divider"></div>

            <div className="job-detail__body">
              {mainTasksLines.length > 0 && (
                <div className="job-detail__section job-detail__section--responsibilities">
                  <span className="job-detail__section-title">주요 업무</span>
                  <ul className="job-detail__list">
                    {mainTasksLines.map((line, idx) => (
                      <li key={idx} className="job-detail__list-item">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {requirementsLines.length > 0 && (
                <div className="job-detail__section job-detail__section--requirements">
                  <span className="job-detail__section-title">자격 요건</span>
                  <ul className="job-detail__list">
                    {requirementsLines.map((line, idx) => (
                      <li key={idx} className="job-detail__list-item">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {preferredPointsLines.length > 0 && (
                <div className="job-detail__section job-detail__section--preferred">
                  <span className="job-detail__section-title">우대 사항</span>
                  <ul className="job-detail__list">
                    {preferredPointsLines.map((line, idx) => (
                      <li key={idx} className="job-detail__list-item">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {benefitsLines.length > 0 && (
                <div className="job-detail__section job-detail__section--benefits">
                  <span className="job-detail__section-title">복지 및 혜택</span>
                  <ul className="job-detail__list">
                    {benefitsLines.map((line, idx) => (
                      <li key={idx} className="job-detail__list-item">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hireRoundsLines.length > 0 && (
                <div className="job-detail__section job-detail__section--benefits">
                  <span className="job-detail__section-title">채용 전형</span>
                  <ul className="job-detail__list">
                    {hireRoundsLines.map((line, idx) => (
                      <li key={idx} className="job-detail__list-item">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="job-detail__divider"></div>
            <div
              className="default_btn_white"
              onClick={() => {
                navigate(`/jobs`);
              }}
            >
              <span>
                <img src={chevron_left} alt="" />
              </span>
              목록으로
            </div>
          </section>

          <aside className="job-detail__aside">
            <section className="job-detail__aside-card job-detail__aside-card--info">
              <div className="job-detail__aside-list">
                <div className="job-detail__aside-item job-detail__aside-item--role">
                  <div className="job-detail__aside-term">
                    <span className="job-detail__aside-icon">
                      <img src={icon_role_gray} alt="" />
                    </span>
                    <span className="job-detail__aside-label">직무</span>
                  </div>
                  <span className="job-detail__aside-value">
                    {job?.categoryName || "-"}
                  </span>
                </div>

                <div className="job-detail__aside-item job-detail__aside-item--career">
                  <div className="job-detail__aside-term">
                    <span className="job-detail__aside-icon">
                      <img src={icon_career_gray} alt="" />
                    </span>
                    <span className="job-detail__aside-label">경력</span>
                  </div>
                  <span className="job-detail__aside-value">
                    {careerLabel || "경력 무관"}
                  </span>
                </div>

                <div className="job-detail__aside-item job-detail__aside-item--education">
                  <div className="job-detail__aside-term">
                    <span className="job-detail__aside-icon">
                      <img src={icon_education_gray} alt="" />
                    </span>
                    <span className="job-detail__aside-label">학력</span>
                  </div>
                  <span className="job-detail__aside-value">
                    {educationLabel || "학력 무관"}
                  </span>
                </div>

                <div className="job-detail__aside-item job-detail__aside-item--location">
                  <div className="job-detail__aside-term">
                    <span className="job-detail__aside-icon">
                      <img src={icon_location_gray} alt="" />
                    </span>
                    <span className="job-detail__aside-label">근무 지역</span>
                  </div>
                  <span className="job-detail__aside-value">
                    {locationLabel || "-"}
                  </span>
                </div>

                <div className="job-detail__aside-item job-detail__aside-item--employment">
                  <div className="job-detail__aside-term">
                    <span className="job-detail__aside-icon">
                      <img src={icon_employment_gray} alt="" />
                    </span>
                    <span className="job-detail__aside-label">고용 형태</span>
                  </div>
                  <span className="job-detail__aside-value">
                    {employmentLabel || "-"}
                  </span>
                </div>

                <div className="job-detail__aside-item job-detail__aside-item--deadline">
                  <div className="job-detail__aside-term">
                    <span className="job-detail__aside-icon">
                      <img src={icon_deadline_gray} alt="" />
                    </span>
                    <span className="job-detail__aside-label">마감일</span>
                  </div>
                  <span className="job-detail__aside-value">
                    {deadlineText}
                  </span>
                </div>

                <span
                  className="job-detail__apply-cta default_btn_black"
                  onClick={handleApplyClick}
                  style={{ cursor: "pointer" }}
                >
                  <span className="job-detail__apply-cta-text">지원하기</span>
                </span>
              </div>
            </section>

            <section className="job-detail__aside-card job-detail__aside-card--mock">
              <div className="job-detail__mock-copy">
                <span className="job-detail__mock-headline">
                  면접 합격률을 높이고 싶다면?
                </span>
                <span className="job-detail__mock-subtext">
                  잡콕만의 이력서 기반 AI 모의면접을 경험해 보세요.
                </span>
              </div>
              <div
                className="job-detail__mock-cta"
                onClick={handleMockInterviewClick}
                style={{ cursor: "pointer" }}
              >
                <span>
                  <img src={arrow_up_right} alt="" />
                </span>
                해당공고로 모의면접 보기
              </div>
            </section>
          </aside>
        </article>

        {resumeExists === true && (
          <section className="job-recos">
            <div className="job-recos__title">추천 채용공고</div>
            <RecommendedJobCard jobs={recommendedJobs} />
          </section>
        )}
      </div>

      <M_JobDetail
        recommendedJobs={recommendedJobs}
        hasAiMatch={hasAiMatch}
        matchPercent={job?.matchPercent}
        recommendReason={job?.recommendReason}
        jobUrl={job?.url}
        companyLogoUrl={job?.companyLogoUrl}
        title={title}
        companyName={companyName}
        categoryName={job?.categoryName}
        careerLabel={careerLabel}
        educationLabel={educationLabel}
        locationLabel={locationLabel}
        employmentLabel={employmentLabel}
        deadlineText={deadlineText}
        mainTasksLines={mainTasksLines}
        requirementsLines={requirementsLines}
        preferredPointsLines={preferredPointsLines}
        benefitsLines={benefitsLines}
        hireRoundsLines={hireRoundsLines}
      />

      <Modal
        open={isModalOpen}
        title="이력서가 등록되어 있지 않습니다."
        desc="모의면접을 진행하기 위해 먼저 이력서를 작성해 주세요."
        confirmText="이력서 작성하기"
        cancelText="취소"
        cancelClassName="btn_w_full default_btn_white"
        confirmClassName="btn_w_full default_btn_black"
        onConfirm={() => {
          navigate(`/resumes`);
        }}
        onClose={handleModalClose}
      />
    </>
  );
}