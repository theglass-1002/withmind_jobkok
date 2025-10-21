import React, { useState } from "react";
import "./MockInterview.css";
import ic_star_white_20 from "@/assets/icons/size20/ic_star_white_20.png";
import ic_star_gray900_20 from "@/assets/icons/size20/ic_star_gray900_20.png";
import MyReportEmpty from "@/pages/MockInterview/my-report/MyReportEmpty";
import MyReportResult from "@/pages/MockInterview/my-report/MyReportResult";







export default function MockInterview() {
  const [activeTab, setActiveTab] = useState("report");

  const handleStart = () => {
    console.log("start mock interview");
  };

  return (
    <div className="mock-interview-page">
      <header className="mock-interview-page__hero">
        <div className="mock-interview-page__hero-headings">
          <span className="mock-interview-page__hero-title">AI 모의면접</span>
          <span className="mock-interview-page__hero-subtitle">
            이력서 기반의 맞춤형 질문으로
            <br /> 더욱 실전처럼 연습하세요!
          </span>
        </div>
        <button
          type="button"
          className="mock-interview-page__hero-cta default_btn_black radius"
          onClick={handleStart}
        >
          <img
            className="mock-interview-page__hero-cta-icon"
            src={ic_star_white_20}
            alt=""
            aria-hidden="true"
          />
          <span className="mock-interview-page__hero-cta-label">모의면접 시작</span>
        </button>
      </header>

      <div className="mock-interview-tabs" role="tablist">
        <span
          className={`mock-interview-tabs__item tabs__item ${activeTab === "report" ? "on" : ""}`}
          role="tab"
          aria-selected={activeTab === "report"}
          onClick={() => setActiveTab("report")}
        >
          MY 리포트
        </span>
        <span
          className={`mock-interview-tabs__item tabs__item ${activeTab === "history" ? "on" : ""}`}
          role="tab"
          aria-selected={activeTab === "history"}
          onClick={() => setActiveTab("history")}
        >
          모의면접 내역
        </span>
      </div>

      <section className="mock-interview-page__section">
      {activeTab === "report" && (
          // <MyReportEmpty/>
          <MyReportResult/>
        )}


        {activeTab === "history" && (
          <div className="mock-interview-empty mock-interview-empty--centered">
            <div className="mock-interview-empty__texts">
              <span className="mock-interview-empty__title">모의면접 내역이 없습니다</span>
              <span className="mock-interview-empty__subtitle">
                진행 이력이 여기 표시됩니다. 지금 바로 모의면접을 시작해보세요.
              </span>
            </div>
            <button type="button" className="default_btn_white" onClick={handleStart}>
              <img src={ic_star_gray900_20} alt="" aria-hidden="true" />
              모의면접 시작
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
