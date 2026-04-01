import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "./InterviewReport.css";
import ic_star_white_20 from "@/assets/icons/size20/ic_star_white_20.png";
import ic_star_gray900_20 from "@/assets/icons/size20/ic_star_gray900_20.png";
import MyReportEmpty from "@/pages/InterviewReport/my-report/MyReportEmpty";
import MyReportResult from "@/pages/InterviewReport/my-report/MyReportResult";
import UiFilter, { type UiFilterOption } from "@/shared/components/ui-filter/UiFilter";
import InterviewReportHistory from "@/pages/InterviewReport/history/MockInterviewHistory";
import Modal from "@/shared/components/modal/Modal";
import M_InterviewReport from "@/pages/InterviewReport/M_InterviewReport";

const FILTERS: UiFilterOption[] = [
  { label: "전체", value: "all" },
  { label: "진행 완료", value: "done" },
  { label: "진행 중", value: "ongoing" },
];


export default function InterviewReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("report");
  const [filter, setFilter] = useState("all");
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleStart = () => {
    navigate(`/mock-interview/guide`);
  };

  const handleCloseConfirm = () => setShowConfirm(false);

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    navigate(`/resumes/create`);
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'history') {
      setActiveTab('history');
    }
  }, [searchParams]);


  return (
    <>
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
      <div className="mock-interview-tabs-wrapper">
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
      </div>
      <section className="mock-interview-page__section">
      {activeTab === "report" && (
          <MyReportResult/>
        )}
          {activeTab === "history" && (
            <InterviewReportHistory
              totalCount={1}
              doneCount={1}
              filter={filter}
              onChangeFilter={setFilter}
              onStart={handleStart}
              emptyIconSrc={ic_star_gray900_20}
            />
          )}
      </section>
      <Modal
        open={showConfirm}
        title="이력서가 등록되어 있지 않습니다."
        desc="모의면접을 진행하기 위해 먼저 이력서를 작성해 주세요."
        confirmText="이력서 작성하기"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="취소"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleConfirmCancel}
        onClose={handleCloseConfirm}
      />
    </div>
    <div className="mock-interview-page mobile">
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
      <div className="mock-interview-tabs-wrapper">
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
      </div>
      <section className="mock-interview-page__section">
      {activeTab === "report" && (
          <MyReportResult/>
        )}
          {activeTab === "history" && (
            <InterviewReportHistory
              totalCount={1}
              doneCount={1}
              filter={filter}
              onChangeFilter={setFilter}
              onStart={handleStart}
              emptyIconSrc={ic_star_gray900_20}
            />
          )}
      </section>
      <Modal
        open={showConfirm}
        title="이력서가 등록되어 있지 않습니다."
        desc="모의면접을 진행하기 위해 먼저 이력서를 작성해 주세요."
        confirmText="이력서 작성하기"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="취소"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleConfirmCancel}
        onClose={handleCloseConfirm}
      />
    </div>
    {/* <M_InterviewReport/> */}
    </>
  );
}
