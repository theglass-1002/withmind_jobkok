import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ic_bell_gray900_24 from "@/assets/icons/size24/ic_bell_gray900_24.png";
import ic_search_white_20 from "@/assets/icons/size20/ic_search_white_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import "./AIMatching.css";
import AIMatchingResult from "./AIMatchingResult";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay"; // ✅ 경로 맞게

export default function AIMatching() {
  const navigate = useNavigate();

  const [jobUrl, setJobUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleSearch = () => {
    const trimmed = jobUrl.trim();

    // ✅ 글자 없으면 검색 안됨
    if (!trimmed) {
      setShowResult(false);
      return;
    }

    // ✅ 로딩 시작 + 결과 숨김
    setShowResult(false);
    setIsLoading(true);

    // ✅ 5초 로딩 후 결과 노출
    timerRef.current = window.setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
    }, 5000);
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading}  isLogo />

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
              <span className="company-dashboard-header__company-name">위드마인드</span>
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

            <button className="default_btn_gray_800" onClick={handleSearch} disabled={isLoading}>
              <img
                src={ic_search_white_20}
                alt="검색 아이콘"
                className="ai-matching-search-box__icon"
              />
              검색
            </button>
          </div>

          {/* ✅ 5초 후에만 보여줌 */}
          {showResult && <AIMatchingResult />}
        </div>
      </div>
    </>
  );
}
