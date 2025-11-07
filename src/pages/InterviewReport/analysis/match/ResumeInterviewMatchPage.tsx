import React from "react";
import "./ResumeInterviewMatchPage.css";
import ResumeSummarySection from "./sections/ResumeSummarySection";
import MatchAnalysisSection from "./sections/MatchAnalysisSection";
import SuggestionSection from "./sections/SuggestionSection";
import QuestionSection from "./sections/QuestionSection";
import ic_rocket_24 from "@/assets/icons/size24/ic_rocket_24.png";
import ResumeRecommendedJobsSection, { type JobCardV2Item } from "@/pages/InterviewReport/analysis/overview/sections/ResumeRecommendedJobsSection";
import ic_keyboard_arrow_left_gray900_24 from "@/assets/icons/size24/ic_keyboard_arrow_left_gray900_24.png";
import ic_keyboard_arrow_right_gray900_24 from "@/assets/icons/size24/ic_keyboard_arrow_right_gray900_24.png";

type Props = {


  jobs: JobCardV2Item[];
  onToggleFavorite: (id: number | string, nextValue?: boolean) => void;

 
};

export default function ResumeInterviewMatchPage({
  jobs,
  onToggleFavorite
}:Props) {

  
    return (
      <div className="mock-analysis-report__content">
       <ResumeSummarySection />
       <MatchAnalysisSection />
       <span className="print-page-break"></span>
       <SuggestionSection />
       <span className="print-page-break"></span>
       <QuestionSection />
       <ResumeRecommendedJobsSection
        title="이 이력서와 가장 잘 맞는 공고"
        titleIconSrc={ic_rocket_24}
        jobs={jobs}
        pageSize={3}
        prevIconSrc={ic_keyboard_arrow_left_gray900_24}
        nextIconSrc={ic_keyboard_arrow_right_gray900_24}
        onToggleFavorite={onToggleFavorite}
      />
      </div>
    );
  }