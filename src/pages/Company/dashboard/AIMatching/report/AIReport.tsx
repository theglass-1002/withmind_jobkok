// AIReport.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Storage } from "@/shared/utils/StorageManager";

import ic_bell_gray900_24 from "@/assets/icons/size24/ic_bell_gray900_24.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";

import AIAnalysisSection from "./AIAnalysisSection";
import ResumeSection from "./ResumeSection";
import { getCompanyRecommendationDetail } from "@/api/company/job/companyJob.api";

type ReportTab = "RESUME" | "AI_ANALYSIS";

type RecommendationItem = {
  idx?: number;
  name?: string;
  age?: string;
  career?: string;
  education?: string;
  desiredJobs?: string[];
  aiInterview?: string;
  aiMatchPercent?: number;
  resumeUpdatedAt?: string;
  resumeIdx?: number;
  displayOrder?: number;
};

type RecommendationDetailData = {
  recommendationIdx?: number;
  resumeIdx?: number;
  reportIdx?: number;
  aiMatchPercent?: number;
  technicalFitReason?: string;
  experienceAchievementReason?: string;
  problemSolvingReason?: string;
  teamworkCollaborationReason?: string;
};

type AIReportLocationState = {
  recommendationItem?: RecommendationItem;
  analysisResult?: unknown;
  activeTab?: ReportTab;
};

export default function AIReport() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const reportId = id ? Number(id) : undefined;
  const companyName = Storage.getCompanyName();
  const routeState = (location.state as AIReportLocationState | null) ?? null;

  const isAiInterviewPublic =
    routeState?.recommendationItem?.aiInterview === "공개";

  const [activeTab, setActiveTab] = useState<ReportTab>(
    isAiInterviewPublic ? routeState?.activeTab ?? "RESUME" : "RESUME"
  );
  const [recommendationDetail, setRecommendationDetail] =
    useState<RecommendationDetailData | null>(null);

  useEffect(() => {
    console.log("AIReport location.state:", routeState);
    console.log("AIReport recommendationItem:", routeState?.recommendationItem);
    console.log("AIReport analysisResult:", routeState?.analysisResult);
    console.log("AIReport activeTab:", routeState?.activeTab);
    console.log("AIReport reportId:", reportId);

    const fetchRecommendationDetail = async () => {
      const recommendationIdx =
        routeState?.recommendationItem?.idx ?? reportId;

      if (!recommendationIdx) {
        console.log("추천상세조회 스킵: recommendationIdx 값이 없습니다.");
        setRecommendationDetail(null);
        return;
      }

      try {
        console.log("추천상세조회 요청 idx:", recommendationIdx);

        const res = await getCompanyRecommendationDetail(recommendationIdx);

        console.log("추천상세조회 응답:", res);
        console.log("추천상세조회 data:", res?.data);

        setRecommendationDetail(res?.data ?? null);
      } catch (error) {
        console.error("추천상세조회 실패:", error);
        setRecommendationDetail(null);
      }
    };

    void fetchRecommendationDetail();
  }, [routeState, reportId]);

  return (
    <div className="ai-report-page">
      <div className="company-dashboard-header">
        <div className="company-dashboard-header__title company-dashboard-header__title-group">
          <span className="page-header-title-group__main-title">AI 인재 매칭</span>
          <span className="page-header-title-group__sub-title">AI 리포트</span>
        </div>

        <div className="company-dashboard-header__actions">
          <div className="company-dashboard-header__notification">
            <img
              src={ic_bell_gray900_24}
              alt="알림"
              className="company-dashboard-header__icon"
            />
          </div>
          <div className="company-dashboard-header__info">
            <span className="company-dashboard-header__company-name">
              {companyName || "-"}
            </span>
            <img src={ic_arrow_drop_down_gray900_24} alt="" />
          </div>
        </div>
      </div>

      <div className="report-main">
        <div className="report-tab-nav">
          <div className="report-tab-nav__container">
            <span
              className={`report-tab-nav__item ${
                activeTab === "RESUME" ? "on" : ""
              }`}
              onClick={() => setActiveTab("RESUME")}
            >
              이력서
            </span>
            {isAiInterviewPublic && (
              <span
                className={`report-tab-nav__item ${
                  activeTab === "AI_ANALYSIS" ? "on" : ""
                }`}
                onClick={() => setActiveTab("AI_ANALYSIS")}
              >
                AI분석
              </span>
            )}
          </div>
        </div>

        {activeTab === "RESUME" ? (
          <ResumeSection recommendationDetail={recommendationDetail} />
        ) : (
          <AIAnalysisSection id={recommendationDetail.reportIdx} />
        )}
      </div>
    </div>
  );
}