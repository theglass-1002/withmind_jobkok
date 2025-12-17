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

export default function AIMatching() {
  const navigate = useNavigate();

  const [jobUrl, setJobUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const timerRef = useRef<number | null>(null);

  // ✅ 허용되는 URL(정확히 일치해야 함)
  const VALID_URL =
    "https://www.wanted.co.kr/wd/317089?client_id=d2tvri42hzQ8uYOG10D8N1Mh";

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleSearch = () => {
    const trimmed = jobUrl.trim();

    // ✅ 글자 없으면 토스트 + 검색 안됨
    if (!trimmed) {
      toast.info("공고 URL을 입력해 주세요.", {
        toastId: "ai-matching-empty-url",
      });
      setShowResult(false);
      return;
    }

    // ✅ 이전 타이머 정리
    if (timerRef.current) window.clearTimeout(timerRef.current);

    // ✅ 로딩 시작 + 결과 숨김
    setShowResult(false);
    setIsLoading(true);

    // ✅ 3초 뒤 결과 판단
    timerRef.current = window.setTimeout(() => {
      setIsLoading(false);

      if (trimmed === VALID_URL) {
        // ✅ URL 일치 → 결과 표시
        setShowResult(true);
      } else {
        // ✅ URL 불일치 → 토스트 메시지
        setShowResult(false);
        toast.info("검색하신 url을 찾을 수 없습니다", {
          toastId: "ai-matching-url-not-found",
        });
      }
    }, 3000);
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
                placeholder="등록된 공고의 URL을 입력해 주세요."
                id="jobUrlInput"
                className="ai-matching-search-box__input"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </span>

            <button
              className="default_btn_gray_800"
              onClick={handleSearch}
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

          {/* ✅ URL이 정확히 맞을 때만 3초 후 노출 */}
          {showResult && <AIMatchingResult />}
        </div>
      </div>
    </>
  );
}