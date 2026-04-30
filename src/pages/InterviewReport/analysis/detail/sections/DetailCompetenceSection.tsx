import React, { useMemo, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import UiFilter, { type UiFilterOption } from "@/shared/components/ui-filter/UiFilter";
import LevelGraph from "@/pages/InterviewReport/analysis/chart/LevelGraph";

import ic_stars_gray600_20 from "@/assets/icons/size20/ic_stars_gray600_20.png";
import ic_emergency_gray600_20 from "@/assets/icons/size20/ic_emergency_gray600_20.png";
import ic_forum_gray600_20 from "@/assets/icons/size20/ic_forum_gray600_20.png";
import ic_inventory_gray600_20 from "@/assets/icons/size20/ic_inventory_gray600_20.png";
import ic_play_arrow_white_48 from "@/assets/icons/size48/ic_play_arrow_white_48.png";
import ic_info_white_20 from "@/assets/icons/size20/ic_info_white_20.png";
import ic_download_white_20 from "@/assets/icons/size20/ic_download_white_20.png";

import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  score?: number;
  title?: string;
  titleIconSrc?: string;
  description?: string;
  videoSrc?: string;
  reportDetail?: InterviewReportDetailResponse | null;
};

type QuestionGrade = "상" | "중" | "하";

type QuestionItem = {
  title: string;
  grade: QuestionGrade;
  keywords: string[];
  analysis: string;
  category: string;
  fileUrl?: string;
};

type WordItem = {
  common: string[];
  habit: string[];
};

function mapGrade(grade?: number): QuestionGrade {
  switch (grade) {
    case 3:
      return "상";
    case 2:
      return "중";
    case 1:
    default:
      return "하";
  }
}

function normalizeKeyword(value?: string) {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed;
}

export default function DetailCompetenceSection({
  score,
  title = "역량 분석",
  titleIconSrc,
  description,
  videoSrc,
  reportDetail,
}: Props) {
  const location = useLocation();
  const isPrintMode = new URLSearchParams(location.search).has("printViewr");

  const abilityAnalysis = reportDetail?.tab2?.abilityAnalysis;
  const itemTotalScores = reportDetail?.tab1?.itemTotalScores;
  const feedback = reportDetail?.tab1?.feedback;

  const resolvedScore =
    score ?? itemTotalScores?.abilityTotalScore ?? 0;

  const resolvedDescription =
    description ??
    feedback?.competency ??
    "면접 과정에서 보인 의사소통 능력과 문제해결 능력은 우수하다고 평가됩니다.";

  const DEFAULT_FILTERS: UiFilterOption[] = [
    { label: "질문 1", value: "q1" },
    { label: "질문 2", value: "q2" },
    { label: "질문 3", value: "q3" },
    { label: "질문 4", value: "q4" },
    { label: "질문 5", value: "q5" },
    { label: "질문 6", value: "q6" },
    { label: "질문 7", value: "q7" },
    { label: "질문 8", value: "q8" },
    { label: "질문 9", value: "q9" },
    { label: "질문 10", value: "q10" },
    { label: "질문 11", value: "q11" },
  ];

  const QUESTIONS: Record<string, QuestionItem> = {
    q1: {
      title: "1분동안 자신을 소개해주세요",
      grade: "상",
      category: "질문 1",
      keywords: ["우선순위", "MVP 설정", "협업 구조설계"],
      analysis: "핵심 메시지가 명확하고 사례 제시가 적절합니다.",
    },
    q2: {
      title: "최근 프로젝트에서 본인의 역할은?",
      grade: "중",
      category: "질문 2",
      keywords: ["리팩토링", "성능 최적화"],
      analysis: "역할 서술은 구체적이나 임팩트 지표가 부족합니다.",
    },
    q3: {
      title: "가장 어려웠던 문제와 해결 방법은?",
      grade: "하",
      category: "질문 3",
      keywords: ["문제 정의", "원인 분석"],
      analysis: "해결 과정의 근거가 약하므로 수치/지표 보완이 필요합니다.",
    },
    q4: {
      title: "가장 어려웠던 문제와 해결 방법은?",
      grade: "하",
      category: "질문 4",
      keywords: ["문제 정의", "원인 분석"],
      analysis: "해결 과정의 근거가 약하므로 수치/지표 보완이 필요합니다.",
    },
    q5: {
      title: "가장 어려웠던 문제와 해결 방법은?",
      grade: "하",
      category: "질문 5",
      keywords: ["문제 정의", "원인 분석"],
      analysis: "해결 과정의 근거가 약하므로 수치/지표 보완이 필요합니다.",
    },
    q6: {
      title: "가장 어려웠던 문제와 해결 방법은?",
      grade: "하",
      category: "질문 6",
      keywords: ["문제 정의", "분석"],
      analysis: "해결 과정의 근거가 약하므로 수치/지표 보완이 필요합니다.",
    },
    q7: {
      title: "가장 어려웠던 문제와 해결 방법은?",
      grade: "하",
      category: "질문 7",
      keywords: ["문제 정의", "원인 분석"],
      analysis: "해결 과정의 근거가 약하므로 수치/지표 보완이 필요합니다.",
    },
    q8: {
      title: "가장 어려웠던 문제와 해결 방법은?",
      grade: "하",
      category: "질문 8",
      keywords: ["문제 정의", "원인 분석"],
      analysis: "해결 과정의 근거가 약하므로 수치/지표 보완이 필요합니다.",
    },
    q9: {
      title: "가장 어려웠던 문제와 해결 방법은?",
      grade: "하",
      category: "질문 9",
      keywords: ["문제 정의", "원인 분석"],
      analysis: "해결 과정의 근거가 약하므로 수치/지표 보완이 필요합니다.",
    },
    q10: {
      title: "가장 어려웠던 문제와 해결 방법은?",
      grade: "하",
      category: "질문 10",
      keywords: ["문제 정의", "원인 분석"],
      analysis: "해결 과정의 근거가 약하므로 수치/지표 보완이 필요합니다.",
    },
  };

  const WORDS: Record<string, WordItem> = {
    q1: { common: ["디자인", "MVP", "협업", "지표"], habit: ["그러니까"] },
    q2: { common: ["리팩토링", "최적화", "번들", "성능", "도입"], habit: ["뭐랄까", "약간"] },
    q3: { common: ["문제정의", "원인분석", "가설", "실험", "회고"], habit: [] },
    default: { common: ["키워드", "사례", "성과"], habit: ["아니"] },
  };

  const interviewVideo = useMemo(
    () => abilityAnalysis?.interviewVideo ?? [],
    [abilityAnalysis?.interviewVideo]
  );
  const frequentWords = abilityAnalysis?.frequentlyUsedWords ?? [];
  const habitWords = abilityAnalysis?.frequentlyUsedHabitWords ?? [];

  const hasInterviewVideo = interviewVideo.length > 0;

  const uniqueInterviewVideo = useMemo(() => {
    const byQzNum = new Map<number, (typeof interviewVideo)[number]>();
    for (const item of interviewVideo) {
      byQzNum.set(item.qzNum ?? 0, item);
    }
    return Array.from(byQzNum.values()).sort(
      (a, b) => (a.qzNum ?? 0) - (b.qzNum ?? 0)
    );
  }, [interviewVideo]);

  const resolvedFilters = useMemo<UiFilterOption[]>(() => {
    if (!hasInterviewVideo) return DEFAULT_FILTERS;

    return uniqueInterviewVideo.map((item) => ({
      label: `질문 ${item.qzNum}`,
      value: `q${item.qzNum}`,
    }));
  }, [hasInterviewVideo, uniqueInterviewVideo]);

  const resolvedQuestions = useMemo<Record<string, QuestionItem>>(() => {
    if (!hasInterviewVideo) return QUESTIONS;

    return uniqueInterviewVideo.reduce<Record<string, QuestionItem>>(
      (acc, item) => {
        const key = `q${item.qzNum}`;

        const keywords = [
          normalizeKeyword(item.keyAnswerEval1),
          normalizeKeyword(item.keyAnswerEval2),
          normalizeKeyword(item.keyAnswerEval3),
        ].filter(Boolean);

        acc[key] = {
          title: item.qzTxt || `질문 ${item.qzNum}`,
          grade: mapGrade(item.grade),
          category: `질문 ${item.qzNum}`,
          keywords,
          analysis: item.evaluation || "분석 없음",
          fileUrl: item.fileUrl,
        };

        return acc;
      },
      {}
    );
  }, [hasInterviewVideo, uniqueInterviewVideo]);

  const resolvedWords = useMemo<Record<string, WordItem>>(() => {
    if (frequentWords.length > 0 || habitWords.length > 0) {
      return {
        default: {
          common: frequentWords,
          habit: habitWords,
        },
      };
    }

    return WORDS;
  }, [frequentWords, habitWords]);

  const [selectedQuestion, setSelectedQuestion] = useState<string>(
    resolvedFilters[0]?.value ?? "q1"
  );

  useEffect(() => {
    setSelectedQuestion(resolvedFilters[0]?.value ?? "q1");
  }, [resolvedFilters]);

  const current = resolvedQuestions[selectedQuestion] ?? {
    title: "질문을 선택해주세요",
    grade: "중" as const,
    category: "질문",
    keywords: [],
    analysis: "",
    fileUrl: undefined,
  };

  const words =
    resolvedWords[selectedQuestion] ??
    resolvedWords.default ?? {
      common: [],
      habit: [],
    };

  const [signedVideoUrl, setSignedVideoUrl] = useState<string | null>(null);
  const currentVideoSrc = signedVideoUrl || videoSrc;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isBlurred, setIsBlurred] = useState(true);

  const handlePlayClick = async () => {
    setIsBlurred(false);

    const v = videoRef.current;
    if (!v) return;

    try {
      await v.play();
    } catch (e) {
      console.error("video play error:", e);
    }
  };

  const handleVideoEnded = () => {};

  useEffect(() => {
    setIsBlurred(true);
    setSignedVideoUrl(null);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    const fileUrl = current.fileUrl;
    if (!fileUrl) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        
        if (data?.signedUrl) {
          setSignedVideoUrl(data.signedUrl);
        }
      } catch (e) {
        if (!cancelled) console.error("signed video URL 조회 실패:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedQuestion, current.fileUrl]);

  const printItems = useMemo(
    () => Object.entries(resolvedQuestions),
    [resolvedQuestions]
  );

  return (
    <div className="analysis-section detail-analysis__competence">
      <span className="analysis-section__title">
        {titleIconSrc && <img src={titleIconSrc} alt="" />} {title}
      </span>

      <div className="analysis-section__body">
        <LevelGraph
          score={resolvedScore}
          description={resolvedDescription}
          reportDetail={reportDetail}
          type="competence"
        />

        {isPrintMode ? (
          <div className="detail-analysis__content">
            {printItems.map(([key, q]) => (
              <React.Fragment key={key}>
                <div className="detail-analysis__print-item">
                  <div className="detail-analysis__question-text">
                    <span className="detail-analysis__question-label">{q.category}</span>
                    <span className="detail-analysis__question-title">{q.title}</span>
                  </div>

                  <div className="detail-analysis__question-detail">
                    <div className="detail-analysis__question-main">
                      <div className="detail-analysis__question-info">
                        <div className="detail-analysis__answer-grade">
                          <div className="detail-analysis__answer-grade-label">
                            <img
                              className="detail-analysis__answer-grade_icon"
                              src={ic_stars_gray600_20}
                              alt=""
                            />
                            답변 등급
                          </div>
                          <div className="detail-analysis__answer-grade-options">
                            <span className={`detail-analysis__grade-option ${q.grade === "상" ? "on" : ""}`}>상</span>
                            <span className={`detail-analysis__grade-option ${q.grade === "중" ? "on" : ""}`}>중</span>
                            <span className={`detail-analysis__grade-option ${q.grade === "하" ? "on" : ""}`}>하</span>
                          </div>
                        </div>

                        <div className="detail-analysis__answer-keywords">
                          <span className="detail-analysis__answer-keywords-label">
                            <img
                              className="detail-analysis__answer-keywords_icon"
                              src={ic_emergency_gray600_20}
                              alt=""
                            />
                            답변 핵심 표현
                          </span>
                          <div className="detail-analysis__answer-keyword-list">
                            {q.keywords.length > 0 ? (
                              q.keywords.map((k, index) => (
                                <span key={`${key}-kw-${index}`} className="detail-analysis__keyword">
                                  {k}
                                </span>
                              ))
                            ) : (
                              <span className="detail-analysis__keyword">키워드 없음</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="detail-analysis__question-info">
                        <div className="detail-analysis__answer-analysis">
                          <div className="detail-analysis__answer-analysis-title">
                            <img
                              className="detail-analysis__answer-analysis_icon"
                              src={ic_forum_gray600_20}
                              alt=""
                            />
                            답변 분석
                          </div>
                          <span className="detail-analysis__answer-analysis-text">
                            {q.analysis || "분석 없음"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="detail-analysis__content">
            <div className="detail-analysis__qa-section">
              <UiFilter
                options={resolvedFilters}
                value={selectedQuestion}
                onChange={(v) => setSelectedQuestion(v)}
                className="detail-analysis__question__filters"
              />

              <div className="detail-analysis__question-detail">
                <div className="detail-analysis__question-main">
                  <div className="detail-analysis__video" style={{ position: "relative" }}>
                    <video
                      ref={videoRef}
                      className="detail-analysis__video-thumbnail"
                      src={currentVideoSrc}
                      muted
                      playsInline
                      preload="metadata"
                      onEnded={handleVideoEnded}
                      onClick={() => {
                        const v = videoRef.current;
                        if (!v) return;

                        if (v.paused) {
                          v.play();
                        } else {
                          v.pause();
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    />

                    {isBlurred && (
                      <button
                        type="button"
                        onClick={handlePlayClick}
                        aria-label="영상 재생"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 72,
                          height: 72,
                          borderRadius: 999,
                          border: "none",
                          background: "rgba(0,0,0,0.45)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <img src={ic_play_arrow_white_48} alt="" aria-hidden="true" />
                      </button>
                    )}

                    <div className="detail-analysis__video-info">
                      <span className="detail-analysis__video-notice">
                        <img className="video-notice_icon" src={ic_info_white_20} alt="" />
                        <span className="detail-analysis__video-notice_text">
                          면접 영상은 분석 리포트 생성일로부터 90일간 제공됩니다.
                        </span>
                      </span>
                      <span className="detail-analysis__video-download">
                        영상 다운로드{" "}
                        <img
                          className="detail-analysis__video-download_icon"
                          src={ic_download_white_20}
                          alt=""
                        />
                      </span>
                    </div>
                  </div>

                  <div className="detail-analysis__question-info">
                    <div className="detail-analysis__question-text">
                      <span className="detail-analysis__question-label">질문</span>
                      <span className="detail-analysis__question-title">{current.title}</span>
                    </div>

                    <div className="detail-analysis__answer-grade">
                      <div className="detail-analysis__answer-grade-label">
                        <img
                          className="detail-analysis__answer-grade_icon"
                          src={ic_stars_gray600_20}
                          alt=""
                        />
                        답변 등급
                      </div>
                      <div className="detail-analysis__answer-grade-options">
                        <span className={`detail-analysis__grade-option ${current.grade === "상" ? "on" : ""}`}>상</span>
                        <span className={`detail-analysis__grade-option ${current.grade === "중" ? "on" : ""}`}>중</span>
                        <span className={`detail-analysis__grade-option ${current.grade === "하" ? "on" : ""}`}>하</span>
                      </div>
                    </div>

                    <div className="detail-analysis__answer-keywords">
                      <span className="detail-analysis__answer-keywords-label">
                        <img
                          className="detail-analysis__answer-keywords_icon"
                          src={ic_emergency_gray600_20}
                          alt=""
                        />
                        답변 핵심 표현
                      </span>
                      <div className="detail-analysis__answer-keyword-list">
                        {current.keywords.length > 0 ? (
                          current.keywords.map((k, i) => (
                            <span key={`${selectedQuestion}-kw-${i}`} className="detail-analysis__keyword">
                              {k}
                            </span>
                          ))
                        ) : (
                          <span className="detail-analysis__keyword">키워드 없음</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-analysis__answer-analysis">
                  <div className="detail-analysis__answer-analysis-title">
                    <img
                      className="detail-analysis__answer-analysis_icon"
                      src={ic_forum_gray600_20}
                      alt=""
                    />
                    답변 분석
                  </div>
                  <span className="detail-analysis__answer-analysis-text">
                    {current.analysis || "분석 없음"}
                  </span>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="detail-analysis__word-section">
              <div className="detail-analysis__word-common">
                <span className="detail-analysis__word-title">
                  <img
                    className="detail-analysis__word-common_icon"
                    src={ic_inventory_gray600_20}
                    alt=""
                  />
                  자주 사용하는 단어
                </span>
                <div className="detail-analysis__word-list">
                  {words.common.length > 0 ? (
                    words.common.map((w, i) => (
                      <span key={`w-common-${selectedQuestion}-${i}`} className="detail-analysis__word-item">
                        {w}
                      </span>
                    ))
                  ) : (
                    <span className="detail-analysis__word-item">단어 없음</span>
                  )}
                </div>
              </div>

              <div className="detail-analysis__word-habit">
                <span className="detail-analysis__word-title">
                  <img
                    className="detail-analysis__word-habit_icon"
                    src={ic_inventory_gray600_20}
                    alt=""
                  />
                  자주 사용하는 습관어
                </span>
                <div className="detail-analysis__word-list">
                  {words.habit.length > 0 ? (
                    words.habit.map((w, i) => (
                      <span key={`w-habit-${selectedQuestion}-${i}`} className="detail-analysis__word-item">
                        {w}
                      </span>
                    ))
                  ) : (
                    <span className="detail-analysis__word-item">습관어 없음</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}