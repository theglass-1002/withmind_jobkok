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

import { fetchJobList } from "@/api/job/job.api";
import type { JobItem } from "@/api/job/job.types";
import { fetchResumeList } from "@/api/resume/resume.api";
import type { ResumeItem } from "@/api/resume/resume.types";
import { logout } from "@/api/auth/auth.api";
import { formatDate } from "@/shared/utils/util";
import { fetchInterviewReportList } from "@/api/interview/interview.api";

const formatDateToDot = (date?: string) => {
  if (!date) return "";
  return date.replaceAll("-", ".");
};

export default function M_Mypage() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState<JobItem[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobItem[]>([]);
  const [defaultResume, setDefaultResume] = useState<ResumeItem | null>(null);
  const [interviewItems, setInterviewItems] = useState<
    M_InterviewReportHistoryItemData[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
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

        try {
          const interviewRes = await fetchInterviewReportList({
            page: 1,
            size: 10,
          });
          console.log("[M_Mypage] interviewRes:", interviewRes);

          const baseList = (interviewRes.list ?? []).slice(0, 2);
          const mapped: M_InterviewReportHistoryItemData[] = await Promise.all(
            baseList.map(async (item, idx) => {
              let avatarSrc = "";
              if (item.photoUrl) {
                try {
                  const r = await fetch(item.photoUrl);
                  const data = await r.json();
                  avatarSrc = data?.signedUrl ?? "";
                } catch (err) {
                  console.error("❌ photoUrl 해석 실패:", item.qzGroup, err);
                }
              }

              const isDone = item.interviewAllYn === "Y";
              return {
                id: item.qzGroup ?? idx + 1,
                title: "",
                no: idx + 1,
                avatarSrc: avatarSrc || test_profile_img2,
                scoreText: isDone ? `${item.totalScore ?? 0}점` : "진행 중",
                roleText: item.jobGroup || item.job || "",
                dateText: formatDateToDot(item.regdate),
                statusText: isDone ? "진행완료" : "진행 중",
                statusState: isDone ? "done" : "doing",
                resumeLabelIconSrc: ic_task_gray900_18,
                resumeText: item.resumeTitle || "",
                resumeDate: formatDateToDot(item.resumeDate),
                onClickView: () =>
                  navigate(`/mock-interview/analysis/${item.qzGroup}`),
              };
            })
          );

          if (!isMounted) return;
          setInterviewItems(mapped);
          successCount += 1;
        } catch (e: any) {
          if (e?.code === 999) {
            logout();
            navigate("/login");
            return;
          }
          if (!isMounted) return;
          setInterviewItems([]);
          console.error("[M_Mypage] 모의면접 내역 조회 실패", e);
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

  const handleUnfavorite = (jobIdx: number) => {
    setSavedJobs((prev) => prev.filter((job) => job.jobIdx !== jobIdx));

    setRecentJobs((prev) =>
      prev.map((job) =>
        job.jobIdx === jobIdx ? { ...job, favorite: 0 as 0 | 1 } : job
      )
    );
  };

  const handleFavorite = (job: JobItem) => {
    setSavedJobs((prev) => {
      const exists = prev.some((item) => item.jobIdx === job.jobIdx);
      if (exists) return prev;

      return [{ ...job, favorite: 1 as 0 | 1 }, ...prev].slice(0, 3);
    });

    setRecentJobs((prev) =>
      prev.map((item) =>
        item.jobIdx === job.jobIdx ? { ...item, favorite: 1 as 0 | 1 } : item
      )
    );
  };

  const visibleSavedJobs = useMemo(() => savedJobs.slice(0, 3), [savedJobs]);
  const visibleRecentJobs = useMemo(() => recentJobs.slice(0, 3), [recentJobs]);

  return (
    <>
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
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <li key={`m-skel-saved-${i}`} className="job-posting__card" aria-hidden="true">
                    <div className="job-card__header">
                      <span className="mp-skel mp-skel--jobcard-logo" />
                      <span className="mp-skel mp-skel--jobcard-bookmark" />
                    </div>
                    <div className="job-card__body">
                      <div className="job-card__content">
                        <div className="job-card__title-group">
                          <span className="mp-skel block mp-skel--jobcard-company" />
                          <span className="mp-skel block mp-skel--jobcard-role" />
                        </div>
                        <div className="job-card__info-group">
                          <span className="mp-skel block mp-skel--jobcard-meta" />
                          <span className="mp-skel block mp-skel--jobcard-deadline" />
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              : visibleSavedJobs.length === 0
              ? <li className="empty">저장한 공고가 없습니다.</li>
              : visibleSavedJobs.map((job) => (
                  <MypageJobCard
                    key={job.jobIdx}
                    job={job}
                    appliedSuccessMessage="지원 정보가 반영되었습니다."
                    showAppliedSection={false}
                    onUnfavorite={handleUnfavorite}
                    onFavorite={handleFavorite}
                  />
                ))}
          </ul>
        </section>

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
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <li key={`m-skel-recent-${i}`} className="job-posting__card" aria-hidden="true">
                    <div className="job-card__header">
                      <span className="mp-skel mp-skel--jobcard-logo" />
                      <span className="mp-skel mp-skel--jobcard-bookmark" />
                    </div>
                    <div className="job-card__body">
                      <div className="job-card__content">
                        <div className="job-card__title-group">
                          <span className="mp-skel block mp-skel--jobcard-company" />
                          <span className="mp-skel block mp-skel--jobcard-role" />
                        </div>
                        <div className="job-card__info-group">
                          <span className="mp-skel block mp-skel--jobcard-meta" />
                          <span className="mp-skel block mp-skel--jobcard-deadline" />
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              : visibleRecentJobs.length === 0
              ? <li className="empty">최근 본 공고가 없습니다.</li>
              : visibleRecentJobs.map((job) => (
                  <MypageJobCard
                    key={job.jobIdx}
                    job={job}
                    appliedSuccessMessage="지원 정보가 반영되었습니다."
                    showAppliedSection={false}
                    onFavorite={handleFavorite}
                    onUnfavorite={handleUnfavorite}
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
              {isLoading ? (
                <>
                  <span className="resume-card__headline mp-skel mp-skel--resume-headline" aria-hidden="true" />
                  <div className="resume-card__meta">
                    <span className="mp-skel mp-skel--resume-date" aria-hidden="true" />
                    <span className="mp-skel mp-skel--resume-role" aria-hidden="true" />
                  </div>
                </>
              ) : (
                <>
                  <span className="resume-card__headline">
                    {defaultResume?.title ?? "기본 이력서가 없습니다."}
                  </span>
                  <div className="resume-card__meta">
                    <span className="resume-card__date">
                      {defaultResume?.createdAt ? formatDate(defaultResume.createdAt) : "—"}
                    </span>
                    <span className="resume-card__role">{defaultResume?.hopeJobs ?? ""}</span>
                  </div>
                </>
              )}
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
            {isLoading &&
              Array.from({ length: 2 }).map((_, i) => (
                <div key={`m-skel-interview-${i}`} className="mock-history__row" aria-hidden="true">
                  <div className="mock-history__avatar">
                    <span className="mp-skel circle mp-skel--iv-avatar-m" />
                  </div>
                  <div className="mock-history__content">
                    <div className="mock-history__info">
                      <div className="mock-history__primary">
                        <span className="mp-skel mp-skel--iv-score-m" />
                        <span className="mp-skel mp-skel--iv-role-m" />
                      </div>
                      <div className="mock-history__meta">
                        <span className="mp-skel mp-skel--iv-status-m" />
                        <span className="mp-skel mp-skel--iv-date-m" />
                      </div>
                    </div>
                    <div className="mock-history__resume-title">
                      <span className="mp-skel mp-skel--iv-resume-icon-m" />
                      <span className="mp-skel mp-skel--iv-resume-m" />
                    </div>
                  </div>
                  <div className="mock-history__btn_wrap">
                    <span className="mp-skel block mp-skel--iv-button-m" />
                  </div>
                </div>
              ))}

            {!isLoading && interviewItems.length === 0 && (
              <div className="empty">최근 진행한 모의면접이 없습니다.</div>
            )}

            {!isLoading &&
              interviewItems.map((it) => (
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