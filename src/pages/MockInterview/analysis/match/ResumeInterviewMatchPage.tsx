import React from "react";
import "./ResumeInterviewMatchPage.css";
import ResumeSummarySection from "./sections/ResumeSummarySection";
import MatchAnalysisSection from "./sections/MatchAnalysisSection";



export default function ResumeInterviewMatchPage() {
    return (
      <div className="mock-analysis-report__content">
       <ResumeSummarySection />
       <MatchAnalysisSection />
        <div className="report-section report-section--match">
          <span>제목:일치도 분석</span>
          MatchAnalysisSection
        </div>
        <div className="report-section report-section--suggest">
        <span>제목: 이력서 보완 제안</span>
        SuggestionSection
        </div>
        <div className="report-section report-section--q">
        <span>제목:이력서 기반 예상 질문</span>
        QuestionSection
        </div>
        <div className="report-section report-section--job">
        <span>제목:이 이력서와 가장 잘 맞는 공고</span>
        BestJobMatchSection
        </div>
      </div>
    );
  }