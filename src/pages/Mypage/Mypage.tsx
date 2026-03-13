import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import mp_banner from "@/assets/illustrations/mp_banner.png";
import file from "@/assets/icons/file.png";
import done_file from "@/assets/icons/done_file.png";
import test_profile from "@/assets/icons/interview_test_profile.png";
import arrow_up_black from "@/assets/icons/arrow-up-right_black.png";

import "./MyPage.css";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { fetchJobList } from "@/api/job/job.api";
import { JobItem } from "@/api/job/job.types";

import MypageJobCard from "@/shared/components/mypage-job-card/MypageJobCard";
import { logout } from "@/api/auth/auth.api";

import { fetchResumeList } from "@/api/resume/resume.api";
import type { ResumeItem } from "@/api/resume/resume.types";
import { formatDate } from "@/shared/utils/util";

export default function MyPage() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState<JobItem[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobItem[]>([]);
  const [defaultResume, setDefaultResume] = useState<ResumeItem | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isAllFailed, setIsAllFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      setIsLoading(true);
      setIsAllFailed(false);

      let successCount = 0;

      try {
        try {
          const favoritesRes = await fetchJobList(1, 3, { tabs: "favorites" });
          if (!isMounted) return;
          setSavedJobs((favoritesRes.jobs ?? []).slice(0, 3));
          successCount += 1;
        } catch (e: any) {
          if (e?.code === 999) {
            logout();
            navigate("/login");
            return;
          }
          if (!isMounted) return;
          setSavedJobs([]);
          console.error("[MyPage] 저장한 공고 조회 실패", e);
        }

        try {
          const recentRes = await fetchJobList(1, 3, { tabs: "recent" });
          if (!isMounted) return;
          setRecentJobs((recentRes.jobs ?? []).slice(0, 3));
          successCount += 1;
        } catch (e: any) {
          if (e?.code === 999) {
            logout();
            navigate("/login");
            return;
          }
          if (!isMounted) return;
          setRecentJobs([]);
          console.error("[MyPage] 최근 본 공고 조회 실패", e);
        }

        try {
          const resumeRes = await fetchResumeList(1, 1);
          if (!isMounted) return;
          setDefaultResume((resumeRes.list ?? [])[0] ?? null);
          successCount += 1;
          console.log(resumeRes);
        } catch (e: any) {
          if (e?.code === 999) {
            logout();
            navigate("/login");
            return;
          }
          if (!isMounted) return;
          setDefaultResume(null);
          console.error("[MyPage] 기본 이력서 조회 실패", e);
        }
      } finally {
        if (!isMounted) return;
        setIsAllFailed(successCount === 0);
        setIsLoading(false);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const visibleSavedJobs = useMemo(() => savedJobs.slice(0, 3), [savedJobs]);
  const visibleRecentJobs = useMemo(() => recentJobs.slice(0, 3), [recentJobs]);

  return (
    <>
      {isLoading && <LoadingOverlay />}

      <div className="mypage_main no-bg-flag">
        {isAllFailed && (
          <div className="mypage__error-banner">
            데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </div>
        )}

        <section className="mp-section">
          <header className="mypage__content-header row">
            <span>
              <h1 className="title">저장한 공고</h1>
            </span>
            <span onClick={() => navigate("/saved-jobs")} className="mp-more">
              더보기
            </span>
          </header>

          <ul className="job-list saved job-posting__list--grid">
            {!isLoading && visibleSavedJobs.length === 0 && (
              <li className="empty">저장한 공고가 없습니다.</li>
            )}

            {!isLoading &&
              visibleSavedJobs.map((job) => (
                <MypageJobCard
                  key={job.jobIdx}
                  job={job}
                  appliedSuccessMessage="지원 정보가 반영되었습니다."
                  showAppliedSection={false}
                />
              ))}
          </ul>
        </section>

        <div
          className="job_submission_banner"
          onClick={() => navigate("support/report-job")}
        >
          <img className="job_submission_banner__image" src={mp_banner} alt="" />
          <span className="job_submission_banner__headline">
            아직 등록되지 않은 공고가 있다면 알려주세요!
          </span>
          <div className="job_submission_banner__content_wrap">
            <span className="job_submission_banner__description">
              제보해 주신 공고는 확인 후 빠르게 반영하겠습니다.
            </span>
            <span className="job_submission_banner__action">공고 제보하기</span>
          </div>
        </div>

        <section className="mp-section">
          <header className="mypage__content-header row">
            <span>
              <h1 className="title">최근 본 공고</h1>
            </span>
            <span onClick={() => navigate("/recent-jobs")} className="mp-more">
              더보기
            </span>
          </header>

          <ul className="job-list recent job-posting__list--grid">
            {!isLoading && visibleRecentJobs.length === 0 && (
              <li className="empty">최근 본 공고가 없습니다.</li>
            )}

            {!isLoading &&
              visibleRecentJobs.map((job) => (
                <MypageJobCard
                  key={job.jobIdx}
                  job={job}
                  appliedSuccessMessage="지원 정보가 반영되었습니다."
                  showAppliedSection={false}
                />
              ))}
          </ul>
        </section>

        <section className="mp-section">
          <header className="mypage__content-header row">
            <span>
              <h1 className="title">기본 이력서</h1>
            </span>
            <span onClick={() => navigate("/resumes")} className="mp-more">
              더보기
            </span>
          </header>

          <div className="resume-card">
            <span className="resume-card__logo">
              <img src={file} alt="" />
            </span>

            <div className="resume-card__body">
              <span className="resume-card__headline">
                {defaultResume?.title ?? "기본 이력서가 없습니다."}
              </span>
              <div className="resume-card__meta">
                <span className="resume-card__date">
                {formatDate(defaultResume?.createdAt)}
                </span>
                <span className="resume-card__role">
                  {defaultResume?.hopeJobs ?? ""}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mp-section">
          <header className="mypage__content-header row">
            <span>
              <h1 className="title">최근 진행한 모의면접</h1>
            </span>
            <span
              className="mp-more"
              onClick={() => navigate("/mock-interview-report?tab=history")}
            >
              더보기
            </span>
          </header>

          <div className="interview-list">
            <div className="interview-item">
              <div className="item-content">
                <div className="content-left">
                  <div className="interview-info">
                    <span className="score">82점</span>
                    <span className="job-type">프로젝트 기획자</span>
                    <div className="status-info">
                      <span className="status">진행완료</span>
                      <span className="date">2025.00.00</span>
                    </div>
                  </div>
                  <div className="description">
                    <span>
                      <img src={done_file} alt="" />
                    </span>
                    성장하는 기획자 정유리입니다.
                  </div>
                </div>
                <div className="content-right">
                  <div className="profile-image">
                    <img src={test_profile} alt="" />
                  </div>
                </div>
              </div>
              <button className="btn_w_full default_btn_white">
                결과 리포트 보기
              </button>
            </div>

            <div className="interview-item">
              <div className="item-content">
                <div className="content-left">
                  <div className="interview-info">
                    <span className="score pending">진행 중</span>
                    <span className="job-type">프로젝트 기획자</span>
                    <div className="status-info">
                      <span className="status">진행 중</span>
                      <span className="date">2025.00.00</span>
                    </div>
                  </div>
                  <div className="description">
                    <span>
                      <img src={done_file} alt="" />
                    </span>
                    성장하는 기획자 정유리 입니다.
                  </div>
                </div>
                <div className="content-right">
                  <div className="profile-image">
                    <img src={test_profile} alt="" />
                  </div>
                </div>
              </div>
              <button className="btn_w_full default_btn_white">
                <span>
                  <img src={arrow_up_black} alt="" />
                </span>
                이어서 진행하기
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
