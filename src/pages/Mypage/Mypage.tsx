import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import mp_banner from "@/assets/illustrations/mp_banner.png";
import file from "@/assets/icons/file.png";
import done_file from "@/assets/icons/done_file.png";
import test_profile from "@/assets/icons/interview_test_profile.png";
import arrow_up_black from "@/assets/icons/arrow-up-right_black.png";

import "./MyPage.css";

import { fetchJobList } from "@/api/job/job.api";
import { JobItem } from "@/api/job/job.types";

import JobPostingItemCardNoAiPick from "@/shared/components/jobPosting-v3/JobPostingItemCardNoAiPick";

export default function MyPage() {
  const navigate = useNavigate();

  /** 저장한 공고 */
  const [savedJobs, setSavedJobs] = useState<JobItem[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  /** ✅ 화면 진입 시: 1페이지 호출 + 최대 3개만 화면에 표시 */
  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        setLoadingSaved(true);

        // 1페이지 요청, size는 3으로(어차피 3개만 보여줄 거라)
        const res = await fetchJobList(1, 3, { tabs: "favorites" });

        // 방어적으로 3개만 저장
        setSavedJobs((res.jobs ?? []).slice(0, 3));
      } catch (e) {
        console.error("[MyPage] 저장한 공고 조회 실패", e);
        setSavedJobs([]);
      } finally {
        setLoadingSaved(false);
      }
    };

    loadSavedJobs();
  }, []);

  const visibleSavedJobs = useMemo(() => savedJobs.slice(0, 3), [savedJobs]);

  return (
    <div className="mypage_main no-bg-flag">
      {/* 저장한 공고 */}
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
          {loadingSaved && <li>불러오는 중...</li>}

          {!loadingSaved && visibleSavedJobs.length === 0 && (
            <li className="empty">저장한 공고가 없습니다.</li>
          )}

          {!loadingSaved &&
            visibleSavedJobs.map((job, idx) => (
              <JobPostingItemCardNoAiPick
                key={(job as any).jobId ?? (job as any).id ?? `${idx}`}
                job={job}
                appliedSuccessMessage="지원 정보가 반영되었습니다."
              />
            ))}
        </ul>
      </section>

      {/* 배너 */}
      <div className="job_submission_banner">
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

      {/* 최근 본 공고 (기존 그대로) */}
      <section className="mp-section">
        <header className="mypage__content-header row">
          <span>
            <h1 className="title">최근 본 공고</h1>
          </span>
          <span className="mp-more">더보기</span>
        </header>

        <ul className="job-list recent">
          {/* TODO: 최근 본 공고도 필요하면 같은 방식으로 API 붙이면 됨 */}
        </ul>
      </section>

      {/* 기본 이력서 (기존 그대로) */}
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
            <span className="resume-card__headline">성장하는 기획자 정유리입니다.</span>
            <div className="resume-card__meta">
              <span className="resume-card__date">2025.02.01</span>
              <span className="resume-card__role">프로젝트 기획자</span>
            </div>
          </div>
        </div>
      </section>

      {/* 최근 진행한 모의면접 (기존 그대로) */}
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
            <button className="btn_w_full default_btn_white">결과 리포트 보기</button>
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
  );
}
