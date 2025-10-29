// src/pages/MockInterview/my-report/detail/sections/DetailCompetenceSection.tsx
import React, { useState } from "react";
import UiFilter, { type UiFilterOption } from "@/shared/components/ui-filter/UiFilter";
import LevelGraph from "@/pages/MockInterview/analysis/chart/LevelGraph";

import ic_stars_gray600_20 from "@/assets/icons/size20/ic_stars_gray600_20.png";
import ic_emergency_gray600_20 from "@/assets/icons/size20/ic_emergency_gray600_20.png";
import ic_forum_gray600_20 from "@/assets/icons/size20/ic_forum_gray600_20.png";
import ic_inventory_gray600_20 from "@/assets/icons/size20/ic_inventory_gray600_20.png";
import ic_play_arrow_white_48 from "@/assets/icons/size48/ic_play_arrow_white_48.png";
import ic_info_white_20 from "@/assets/icons/size20/ic_info_white_20.png";
import ic_download_white_20 from "@/assets/icons/size20/ic_download_white_20.png";

import test_profile_img from "@/assets/testImg/test_profile_img.jpg";

type Props = {
  score: number;
  title?: string;
  titleIconSrc?: string;
  description?: string;
};

export default function DetailCompetenceSection({
  score,
  title,
  titleIconSrc,
  description = "면접 과정에서 보인 의사소통 능력과 문제해결 능력은 우수하다고 평가됩니다.",
}: Props) {
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

  const QUESTIONS: Record<
    string,
    { title: string; grade: "상" | "중" | "하"; keywords: string[]; analysis: string }
  > = {
    q1: {
      title: "1분동안 자신을 소개해주세요",
      grade: "상",
      keywords: ["우선순위", "MVP 설정", "협업 구조설계"],
      analysis: "핵심 메시지가 명확하고 사례 제시가 적절합니다.",
    },
    q2: {
      title: "최근 프로젝트에서 본인의 역할은?",
      grade: "중",
      keywords: ["리팩토링", "성능 최적화"],
      analysis: "역할 서술은 구체적이나 임팩트 지표가 부족합니다.",
    },
    q3: {
      title: "가장 어려웠던 문제와 해결 방법은?",
      grade: "하",
      keywords: ["문제 정의", "원인 분석"],
      analysis: "해결 과정의 근거가 약하므로 수치/지표 보완이 필요합니다.",
    },
  };

  const WORDS: Record<string, { common: string[]; habit: string[] }> = {
    q1: { common: ["디자인", "MVP", "협업", "우선순위", "지표"], habit: ["음", "어", "그러니까"] },
    q2: { common: ["리팩토링", "최적화", "번들", "성능", "도입"], habit: ["그", "뭐랄까", "약간"] },
    q3: { common: ["문제정의", "원인분석", "가설", "실험", "회고"], habit: ["아", "어...", "음..."] },
    default: { common: ["키워드", "사례", "성과"], habit: ["음", "어", "아니"] },
  };

  const [selectedQuestion, setSelectedQuestion] = useState<string>(DEFAULT_FILTERS[0].value);
  const current = QUESTIONS[selectedQuestion] ?? {
    title: "질문을 선택해주세요",
    grade: "중" as const,
    keywords: [],
    analysis: "",
  };
  const words = WORDS[selectedQuestion] ?? WORDS.default;

  return (
    <div className="analysis-section detail-analysis__competence">
      <span className="analysis-section__title">
        {titleIconSrc && <img src={titleIconSrc} alt="" />} {title}
      </span>

      <div className="analysis-section__body">
        <LevelGraph score={score} description={description} />

        <div className="detail-analysis__content">
          <div className="detail-analysis__qa-section">
            <UiFilter
              options={DEFAULT_FILTERS}
              value={selectedQuestion}
              onChange={(v) => setSelectedQuestion(v)}
              className="detail-analysis__question__filters"
            />

            <div className="detail-analysis__question-detail">
              <div className="detail-analysis__question-main">
                <div className="detail-analysis__video">
                  <img className="detail-analysis__video-thumbnail" src={test_profile_img} alt="" />

                  <div className="detail-analysis__video-info">
                    <span className="detail-analysis__video-notice">
                      <img src={ic_info_white_20} alt="" />
                      면접 영상은 분석 리포트 생성일로부터 90일간 제공됩니다.
                    </span>
                    <span className="detail-analysis__video-download">
                      영상 다운로드 <img src={ic_download_white_20} alt="" />
                    </span>
                  </div>

                  <img className="detail-analysis__video-play" src={ic_play_arrow_white_48} alt="" />
                </div>

                <div className="detail-analysis__question-info">
                  <div className="detail-analysis__question-text">
                    <span className="detail-analysis__question-label">질문</span>
                    <span className="detail-analysis__question-title">{current.title}</span>
                  </div>

                  <div className="detail-analysis__answer-grade">
                    <div className="detail-analysis__answer-grade-label">
                      <img src={ic_stars_gray600_20} alt="" />
                      답변 등급
                    </div>
                    <div className="detail-analysis__answer-grade-options">
                      <span className={`detail-analysis__grade-option ${current.grade === "상" ? "on" : ""}`}>
                        상
                      </span>
                      <span className={`detail-analysis__grade-option ${current.grade === "중" ? "on" : ""}`}>
                        중
                      </span>
                      <span className={`detail-analysis__grade-option ${current.grade === "하" ? "on" : ""}`}>
                        하
                      </span>
                    </div>
                  </div>

                  <div className="detail-analysis__answer-keywords">
                    <span className="detail-analysis__answer-keywords-label">
                      <img src={ic_emergency_gray600_20} alt="" />
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
                  <img src={ic_forum_gray600_20} alt="" />
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
                <img src={ic_inventory_gray600_20} alt="" />
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
                <img src={ic_inventory_gray600_20} alt="" />
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
      </div>
    </div>
  );
}
