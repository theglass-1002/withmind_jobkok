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
import { Storage } from "@/shared/utils/StorageManager";

type JobAnalysisErrorResponse = {
  detail?: {
    code?: string;
    message?: string;
  };
};

const POST_TIMEOUT_MS = 10000;
const POLLING_INTERVAL_MS = 3000;
const MAX_POLLING_COUNT = 20;

function isAnalysisResultData(value: unknown): value is CompanyJobAnalysisResultData {
  if (!value || typeof value !== "object") return false;

  const data = value as Record<string, unknown>;

  return (
    typeof data.status === "string" &&
    typeof data.taskId === "number" &&
    typeof data.sections === "object" &&
    data.sections !== null
  );
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error("TIMEOUT"));
    }, ms);

    promise
      .then((result) => {
        window.clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      });
  });
}

export default function AIMatching() {
  const navigate = useNavigate();
  const companyName = Storage.getCompanyName();
  const [jobUrl, setJobUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CompanyJobAnalysisResultData | null>(null);

  const timerRef = useRef<number | null>(null);
  const isUnmountedRef = useRef(false);
  const pollingCountRef = useRef(0);

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

  const resetAnalysisState = () => {
    setShowResult(false);
    setAnalysisResult(null);
  };

  const stopLoadingWithError = (message: React.ReactNode, toastId: string) => {
    clearPollingTimer();

    if (isUnmountedRef.current) return;

    setIsLoading(false);

    toast.error(message, {
      toastId,
    });
  };

  const pollAnalysisResult = async (url: string) => {
    if (pollingCountRef.current >= MAX_POLLING_COUNT) {
      clearPollingTimer();

      if (!isUnmountedRef.current) {
        setIsLoading(false);
        toast.error(
          <>
            분석 응답이 지연되고 있습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </>,
          {
            toastId: "ai-matching-polling-timeout",
          }
        );
      }
      return;
    }

    pollingCountRef.current += 1;

    try {
      console.log("공고분석 GET 요청 횟수:", pollingCountRef.current);

      const result = await getCompanyJobAnalysis(url);

      console.log("공고분석 GET 응답:", result);

      if (isUnmountedRef.current) return;

      if (result?.data && isAnalysisResultData(result.data)) {
        clearPollingTimer();
        console.log(result.data);
        setAnalysisResult(result.data);
        setShowResult(true);
        setIsLoading(false);
        return;
      }

      timerRef.current = window.setTimeout(() => {
        void pollAnalysisResult(url);
      }, POLLING_INTERVAL_MS);
    } catch (error) {
      console.error("공고분석 GET 실패:", error);

      if (isUnmountedRef.current) return;

      const e = error as JobAnalysisErrorResponse;

      if (e?.detail?.code === "JOB_POSTING_NOT_FOUND") {
        clearPollingTimer();
        setIsLoading(false);
        resetAnalysisState();

        toast.info(e.detail.message || "검색하신 url을 찾을 수 없습니다", {
          toastId: "ai-matching-url-not-found",
        });
        return;
      }

      if (pollingCountRef.current >= MAX_POLLING_COUNT) {
        clearPollingTimer();
        setIsLoading(false);

        toast.error(
          <>
            분석 응답이 지연되고 있습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </>,
          {
            toastId: "ai-matching-polling-timeout",
          }
        );
        return;
      }

      timerRef.current = window.setTimeout(() => {
        void pollAnalysisResult(url);
      }, POLLING_INTERVAL_MS);
    }
  };

  const handleSearch = async () => {
    const trimmed = jobUrl.trim();

    if (!trimmed) {
      toast.info("공고 URL을 입력해 주세요.", {
        toastId: "ai-matching-empty-url",
      });
      resetAnalysisState();
      return;
    }

    const companyIdx = localStorage.getItem("companyIdx");

    if (!companyIdx) {
      toast.info("기업 정보가 없습니다. 다시 로그인해 주세요.", {
        toastId: "ai-matching-empty-company-idx",
      });
      resetAnalysisState();
      return;
    }

    clearPollingTimer();
    pollingCountRef.current = 0;
    resetAnalysisState();
    setIsLoading(true);

    try {
      console.log("공고분석 POST 요청 시작:", { url: trimmed, companyIdx });

      const startRes = await withTimeout(
        startCompanyJobAnalysis({ url: trimmed, companyIdx }),
        POST_TIMEOUT_MS
      );

      console.log("공고분석 POST 응답:", startRes);

      if (isUnmountedRef.current) return;

      await pollAnalysisResult(trimmed);
    } catch (error) {
      console.error("공고분석 POST 실패:", error);

      if (isUnmountedRef.current) return;

      resetAnalysisState();
      setIsLoading(false);

      if (error instanceof Error && error.message === "TIMEOUT") {
        toast.error(
          <>
            공고 분석 요청이 지연되고 있습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </>,
          {
            toastId: "ai-matching-start-timeout",
          }
        );
        return;
      }

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
              {companyName || "-"}
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

          {showResult && <AIMatchingResult analysisResult={analysisResult} />}
        </div>
      </div>
    </>
  );
}