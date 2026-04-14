import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ic_bell_gray900_24 from "@/assets/icons/size24/ic_bell_gray900_24.png";
import ic_search_white_20 from "@/assets/icons/size20/ic_search_white_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import "./AIMatching.css";
import AIMatchingResult from "./AIMatchingResult";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import {
  startCompanyJobAnalysis,
  getCompanyJobAnalysis,
} from "@/api/company/job/companyJob.api";
import type { CompanyJobAnalysisResultData } from "@/api/company/job/companyJob.types";

type JobAnalysisErrorResponse = {
  detail?: {
    code?: string;
    message?: string;
  };
};

function isAnalysisResultData(value: unknown): value is CompanyJobAnalysisResultData {
  if (!value || typeof value !== "object") return false;

  const data = value as Record<string, any>;

  return (
    typeof data.status === "string" &&
    typeof data.taskId === "number" &&
    data.job &&
    typeof data.job === "object" &&
    typeof data.job.jobIdx === "number" &&
    typeof data.job.title === "string" &&
    typeof data.job.companyIdx === "number" &&
    typeof data.job.companyName === "string" &&
    typeof data.job.url === "string" &&
    typeof data.job.updatedAt === "string" &&
    data.sections &&
    typeof data.sections === "object"
  );
}

export default function AIMatching() {
  const navigate = useNavigate();

  const [jobUrl, setJobUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CompanyJobAnalysisResultData | null>(null);

  const timerRef = useRef<number | null>(null);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const clearPollingTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const pollAnalysisResult = async (url: string) => {
    try {
      const result = await getCompanyJobAnalysis(url);

      console.log("공고분석 GET 응답:", result);

      if (isUnmountedRef.current) return;

      if (result?.data && isAnalysisResultData(result.data)) {
        clearPollingTimer();
        setAnalysisResult(result.data);
        setShowResult(true);
        setIsLoading(false);
        return;
      }

      timerRef.current = window.setTimeout(() => {
        void pollAnalysisResult(url);
      }, 3000);
    } catch (error) {
      console.error("공고분석 GET 실패:", error);

      if (isUnmountedRef.current) return;

      const e = error as JobAnalysisErrorResponse;

      if (e?.detail?.code === "JOB_POSTING_NOT_FOUND") {
        clearPollingTimer();
        setIsLoading(false);
        setShowResult(false);
        setAnalysisResult(null);

        toast.info(e.detail.message || "검색하신 url을 찾을 수 없습니다", {
          toastId: "ai-matching-url-not-found",
        });
        setIsLoading(false);
        return;
      }

      timerRef.current = window.setTimeout(() => {
        void pollAnalysisResult(url);
      }, 3000);

    }
  };

  const handleSearch = async () => {
    const trimmed = jobUrl.trim();

    if (!trimmed) {
      toast.info("공고 URL을 입력해 주세요.", {
        toastId: "ai-matching-empty-url",
      });
      setShowResult(false);
      setAnalysisResult(null);
      return;
    }

    clearPollingTimer();
    setShowResult(false);
    setAnalysisResult(null);
    setIsLoading(true);

    try {
      const startRes = await startCompanyJobAnalysis({ url: trimmed });

      console.log("공고분석 POST 응답:", startRes);

      if (isUnmountedRef.current) return;

      await pollAnalysisResult(trimmed);
    } catch (error) {
      console.error("공고분석 POST 실패:", error);

      if (isUnmountedRef.current) return;

      setIsLoading(false);
      setShowResult(false);
      setAnalysisResult(null);

      toast.error(
        <>
          공고 분석 시작에 실패했습니다.
          <br />
          url을 확인해 주세요
        </>,
        {
          toastId: "ai-matching-start-fail",
        }
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} isLogo />

      <div className="company-dashboard-page">
        <div className="company-dashboard-header">
          <span className="company-dashboard-header__title">AI 인재 매칭</span>

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
                위드마인드
              </span>
              <img src={ic_arrow_drop_down_gray900_24} alt="" />
            </div>
          </div>
        </div>

        <div className="company-dashboard-main">
          <div className="ai-matching-search-box">
            <span className="ai-matching-search-box__input-wrap">
              <input
                type="text"
                name="jobUrl"
                placeholder="등록된 공고의 URL을 입력해 주세요. 예:https://www.wanted.co.kr/wd/97403"
                id="jobUrlInput"
                className="ai-matching-search-box__input"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    void handleSearch();
                  }
                }}
              />
            </span>

            <button
              className="default_btn_gray_800"
              onClick={() => {
                void handleSearch();
              }}
              disabled={isLoading}
            >
              <img
                src={ic_search_white_20}
                alt="검색 아이콘"
                className="ai-matching-search-box__icon"
              />
              검색
            </button>
          </div>

          {showResult && <AIMatchingResult />}
        </div>
      </div>
    </>
  );
}