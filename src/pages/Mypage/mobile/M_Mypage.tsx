import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import mp_banner from "@/assets/illustrations/mp_banner.png";
import file from "@/assets/icons/file.png";
import MypageJobCard from "@/shared/components/mypage-job-card/MypageJobCard";
import M_MockInterviewHistoryRow from "@/pages/InterviewReport/history/mobile/M_MockInterviewHistoryRow";
import { type M_InterviewReportHistoryItemData } from "@/pages/InterviewReport/history/mobile/M_MockInterviewHistoryList";
import ic_arrow_up_right_gray900_20 from "@/assets/icons/size20/ic_arrow_up_right_gray900_20.png";
import ic_task_gray900_18 from "@/assets/icons/size18/ic_task_gray900_18.png";
import test_profile_img2 from "@/assets/testImg/test_profile_img.jpg";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { fetchJobList } from "@/api/job/job.api";
import type { JobItem } from "@/api/job/job.types";
import { fetchResumeList } from "@/api/resume/resume.api";
import type { ResumeItem } from "@/api/resume/resume.types";
import { logout } from "@/api/auth/auth.api";
import { formatDate } from "@/shared/utils/util";

export default function M_Mypage() {
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
        // 1) 저장한 공고
        try {
          const favoritesRes = await fetchJobList(1, 3, { tabs: "favorites" });
          console.log("[M_Mypage] favoritesRes:", favoritesRes);

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
          console.error("[M_Mypage] 저장한 공고 조회 실패", e);
        }

        // 2) 최근 본 공고
        try {
          const recentRes = await fetchJobList(1, 3, { tabs: "recent" });
          console.log("[M_Mypage] recentRes:", recentRes);

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
          console.error("[M_Mypage] 최근 본 공고 조회 실패", e);
        }

        // 3) 기본 이력서 (첫 번째)
        try {
          const resumeRes = await fetchResumeList(1, 1);
          console.log("[M_Mypage] resumeRes:", resumeRes);

          if (!isMounted) return;
          setDefaultResume((resumeRes.list ?? [])[0] ?? null);
          successCount += 1;
        } catch (e: any) {
          if (e?.code === 999) {
            logout();
            navigate("/login");
            return;
          }
          if (!isMounted) return;
          setDefaultResume(null);
          console.error("[M_Mypage] 기본 이력서 조회 실패", e);
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

  const HISTORY_ITEMS: M_InterviewReportHistoryItemData[] = [
    {
      id: 1,
      title: "",
      no: 1,
      avatarSrc: test_profile_img2,
      scoreText: "82점",
      roleText: "프론트개발자",
      dateText: "2025.12.10",
      statusText: "진행완료",
      statusState: "done",
      resumeLabelIconSrc: ic_task_gray900_18,
      resumeText: "개발자 준비된 정유리입니다.",
      resumeDate: "2025.12.10",
      onClickView: () => navigate(`/mock-interview/analysis/${1}`),
    },
    {
      id: 2,
      title: "",
      no: 2,
      avatarSrc: test_profile_img2,
      scoreText: "82점",
      roleText: "프론트개발자",
      dateText: "2025.12.10",
      statusText: "진행 중",
      statusState: "doing",
      resumeLabelIconSrc: ic_task_gray900_18,
      resumeText: "개발자 준비된 정유리입니다.",
      resumeDate: "2025.12.10",
      onClickView: () => navigate(`/mock-interview/analysis/${2}`),
    },
  ];

  return (
    <>
      {isLoading && <LoadingOverlay />}

      <div className="mypage_main no-bg-flag mobile">
        {isAllFailed && (
          <div className="mypage__error-banner">
            데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </div>
        )}

        {/* 저장한 공고 */}
        <section className="mp-section saved">
          <header className="mypage__content-header row">
            <span className="mypage__section__title">저장한 공고</span>
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

        {/* 공고 제보 배너 */}
        <div className="job_submission_banner">
          <img className="job_submission_banner__image" src={mp_banner} alt="" />
          <span className="job_submission_banner__headline">
            아직 등록되지 않은 공고가 있다면 알려주세요!
          </span>
          <div className="job_submission_banner__content_wrap">
            <span className="job_submission_banner__description">
              제보해 주신 공고는 확인 후 빠르게 반영하겠습니다.
            </span>
            <span
              className="job_submission_banner__action"
              onClick={() => navigate("/mypage/m-support/report-job")}
            >
              공고 제보하기
            </span>
          </div>
        </div>

        {/* 최근 본 공고 */}
        <section className="mp-section">
          <header className="mypage__content-header row">
            <span className="mypage__section__title">최근 본 공고</span>
            <span className="mp-more" onClick={() => navigate("/recent-jobs")}>
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

        {/* 기본 이력서 */}
        <section className="mp-section">
          <header className="mypage__content-header row">
            <span className="mypage__section__title">기본 이력서</span>
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
                  {defaultResume?.createdAt ? formatDate(defaultResume.createdAt) : "—"}
                </span>
                <span className="resume-card__role">{defaultResume?.hopeJobs ?? ""}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 최근 진행한 모의면접 */}
        <section className="mp-section">
          <header className="mypage__content-header row">
            <span className="mypage__section__title">최근 진행한 모의면접</span>
            <span
              className="mp-more"
              onClick={() => navigate("/mock-interview-report?tab=history")}
            >
              더보기
            </span>
          </header>

          <div className="mock-history__body data-list__body">
            {HISTORY_ITEMS.map((it) => (
              <M_MockInterviewHistoryRow
                key={it.id}
                item={it}
                viewIconSrc={ic_arrow_up_right_gray900_20}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
