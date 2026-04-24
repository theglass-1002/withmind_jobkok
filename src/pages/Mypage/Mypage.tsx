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

import MypageJobCard from "@/shared/components/mypage-job-card/MypageJobCard";
import { logout } from "@/api/auth/auth.api";

import { fetchResumeList } from "@/api/resume/resume.api";
import type { ResumeItem } from "@/api/resume/resume.types";
import { formatDate } from "@/shared/utils/util";
import {
  fetchEnvTestSpeech,
  fetchInterviewReportList,
  restartInterview,
} from "@/api/interview/interview.api";
import type { InterviewReportItem } from "@/api/interview/interview.types";

type InterviewCardItem = InterviewReportItem & { avatarSrc: string };

const formatDateToDot = (date?: string) => {
  if (!date) return "";
  return date.replaceAll("-", ".");
};

export default function MyPage() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState<JobItem[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobItem[]>([]);
  const [defaultResume, setDefaultResume] = useState<ResumeItem | null>(null);
  const [interviewList, setInterviewList] = useState<InterviewCardItem[]>([]);

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
          const favoritesRes = await fetchJobList(1, 20, { tabs: "favorites" });
          if (!isMounted) return;
          setSavedJobs(favoritesRes.jobs ?? []);
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
          const recentRes = await fetchJobList(1, 20, { tabs: "recent" });
          if (!isMounted) return;
          setRecentJobs(recentRes.jobs ?? []);
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

        try {
          const interviewRes = await fetchInterviewReportList({
            page: 1,
            size: 10,
          });
          if (!isMounted) return;
          console.log("[MyPage] 모의면접 내역 API 응답:", interviewRes);
          console.log("[MyPage] 모의면접 내역 list:", interviewRes.list);

          const baseList = (interviewRes.list ?? []).slice(0, 2);
          const resolved: InterviewCardItem[] = await Promise.all(
            baseList.map(async (item) => {
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
              return { ...item, avatarSrc };
            })
          );
          if (!isMounted) return;
          setInterviewList(resolved);
          successCount += 1;
        } catch (e: any) {
          if (e?.code === 999) {
            logout();
            navigate("/login");
            return;
          }
          if (!isMounted) return;
          setInterviewList([]);
          console.error("[MyPage] 모의면접 내역 조회 실패", e);
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

  const handleRemoveSavedJob = (jobIdx: number) => {
    setSavedJobs((prev) => prev.filter((job) => job.jobIdx !== jobIdx));
  };

  const visibleSavedJobs = useMemo(() => savedJobs.slice(0, 3), [savedJobs]);
  const visibleRecentJobs = useMemo(() => recentJobs.slice(0, 3), [recentJobs]);

  return (
    <>
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
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <li key={`skel-saved-${i}`} className="job-posting__card" aria-hidden="true">
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
                    onUnfavorite={handleRemoveSavedJob}
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
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <li key={`skel-recent-${i}`} className="job-posting__card" aria-hidden="true">
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
                      {formatDate(defaultResume?.createdAt)}
                    </span>
                    <span className="resume-card__role">
                      {defaultResume?.hopeJobs ?? ""}
                    </span>
                  </div>
                </>
              )}
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
            {isLoading &&
              Array.from({ length: 2 }).map((_, i) => (
                <div key={`skel-interview-${i}`} className="interview-item" aria-hidden="true">
                  <div className="item-content">
                    <div className="content-left">
                      <div className="interview-info">
                        <span className="mp-skel mp-skel--iv-score" />
                        <span className="mp-skel mp-skel--iv-jobtype" />
                        <div className="status-info">
                          <span className="mp-skel mp-skel--iv-status" />
                          <span className="mp-skel mp-skel--iv-date" />
                        </div>
                      </div>
                      <div className="description">
                        <span className="mp-skel mp-skel--iv-desc-icon" />
                        <span className="mp-skel mp-skel--iv-desc" />
                      </div>
                    </div>
                    <div className="content-right">
                      <div className="profile-image">
                        <span className="mp-skel circle mp-skel--iv-profile" />
                      </div>
                    </div>
                  </div>
                  <span className="mp-skel block mp-skel--iv-button" />
                </div>
              ))}

            {!isLoading && interviewList.length === 0 && (
              <div className="empty">최근 진행한 모의면접이 없습니다.</div>
            )}

            {!isLoading &&
              interviewList.map((item) => {
                const isDone = item.interviewAllYn === "Y";
                const scoreText = isDone ? `${item.totalScore ?? 0}점` : "진행 중";
                const statusText = isDone ? "진행완료" : "진행 중";
                const roleText = item.jobGroup || item.job || "";
                const dateText = formatDateToDot(item.regdate);

                return (
                  <div key={item.qzGroup} className="interview-item">
                    <div className="item-content">
                      <div className="content-left">
                        <div className="interview-info">
                          <span className={`score${isDone ? "" : " pending"}`}>
                            {scoreText}
                          </span>
                          <span className="job-type">{roleText}</span>
                          <div className="status-info">
                            <span className="status">{statusText}</span>
                            <span className="date">{dateText}</span>
                          </div>
                        </div>
                        <div className="description">
                          <span>
                            <img src={done_file} alt="" />
                          </span>
                          {item.resumeTitle || ""}
                        </div>
                      </div>
                      <div className="content-right">
                        <div className="profile-image">
                          <img src={item.avatarSrc || test_profile} alt="" />
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn_w_full default_btn_white"
                      onClick={async () => {
                        if (!isDone) {
                          try {
                            const [restartRes, envSpeech] = await Promise.all([
                              restartInterview({
                                qzGroup: Number(item.qzGroup),
                              }),
                              fetchEnvTestSpeech(),
                            ]);
                            console.log("이어서 진행하기 클릭 - 넘길 값:", {
                              resumeIdx: item.resumeIdx,
                              resumeTitle: item.resumeTitle,
                              jobPostTitle: item.jobPostTitle,
                              job: item.job,
                              qzGroup: item.qzGroup,
                              qzList: restartRes.qzList,
                              reStartNum: restartRes.reStartNum,
                              envSpeech,
                            });

                            const questions = restartRes.qzList.map((q) => ({
                              order: q.num,
                              text: q.qzTts,
                              type: "ETC",
                              difficulty: "MEDIUM",
                              related_items: [],
                              answer_hint: "",
                            }));

                            const envTestPath =
                              typeof window !== "undefined" &&
                              window.innerWidth <= 760
                                ? "/mock-interview/m-environment-test"
                                : "/mock-interview/environment-test";

                            navigate(envTestPath, {
                              state: {
                                envSpeech,
                                interviewRes: {
                                  success: true,
                                  data: { questions },
                                },
                                jobDetail: {
                                  job: { name: item.jobPostTitle ?? "" },
                                },
                                resumeDetail: {
                                  title: item.resumeTitle,
                                  resumeIdx: item.resumeIdx,
                                },
                                desiredJob: item.job,
                                jobPostingUrl: "",
                                interviewGroupId: Number(item.qzGroup),
                                reStartNum: restartRes.reStartNum,
                                isResume: true,
                              },
                            });
                          } catch (err) {
                            console.error("❌ 이어서 진행하기 실패:", err);
                          }
                          return;
                        }
                        navigate(`/mock-interview/analysis/${item.qzGroup}`);
                      }}
                    >
                      {isDone ? (
                        "결과 리포트 보기"
                      ) : (
                        <>
                          <span>
                            <img src={arrow_up_black} alt="" />
                          </span>
                          이어서 진행하기
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </>
  );
}