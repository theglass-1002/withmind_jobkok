import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "./InterviewReport.css";
import ic_star_white_20 from "@/assets/icons/size20/ic_star_white_20.png";
import ic_star_gray900_20 from "@/assets/icons/size20/ic_star_gray900_20.png";
import MyReportEmpty from "@/pages/InterviewReport/my-report/MyReportEmpty";
import M_MyReportResult from "@/pages/InterviewReport/my-report/M_MyReportResult";
import UiFilter, { type UiFilterOption } from "@/shared/components/ui-filter/UiFilter";

import M_MockInterviewHistory from "@/pages/InterviewReport/history/mobile/M_MockInterviewHistory";





import Modal from "@/shared/components/modal/Modal";
import Tabs from "@/shared/components/tabs/Tabs";

const FILTERS: UiFilterOption[] = [
  { label: "전체", value: "all" },
  { label: "진행 완료", value: "done" },
  { label: "진행 중", value: "ongoing" },
];


export default function M_InterviewReport() {
  const navigate = useNavigate();
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("report");
  const [filter, setFilter] = useState("all");
  const [showConfirm, setShowConfirm] = useState(false);
  
  const tabItems = [
    { key: "report", label: "MY 리포트" },
    { key: "history", label: "모의면접 내역" },
  ];


  const handleStart = () => {
    console.log("start mock interview");
  };

  const handleCloseConfirm = () => setShowConfirm(false);

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    navigate(`/resumes/create`);
  };


  const handleTabClick = (key: "report" | "history") => {
    setActiveTab(key);
    const targetElement = document.getElementById('section-description');

    if (targetElement) {
     
      const stickyTabElement = document.querySelector('.mock-interview__sticky-tabs');
   
      const offset = stickyTabElement 
      ? (stickyTabElement as HTMLElement).offsetHeight + 10 
      : 0; 

      window.scrollTo({
    
        top: targetElement.offsetTop - offset,
        behavior: 'smooth'
      });
    }

  };

  useEffect(() => {
    const handleScroll = () => {
    // 1. 필요한 DOM 요소 가져오기
    const descriptionSection = document.getElementById('section-description');
    const tabsElement = document.querySelector('.mock-interview-tabs');
    
    if (descriptionSection && tabsElement) {
      const descriptionTop = descriptionSection.offsetTop;
      const tabsHeight = (tabsElement as HTMLElement).offsetHeight; 
      const scrollPosition = window.scrollY;
      const shouldBeSticky = scrollPosition + tabsHeight > descriptionTop;
      if(shouldBeSticky){
        setIsTabsSticky(true);
        console.log('고정 ㄱㄱ');
      }else{
        console.log('고정 ㄴㄴ');
        setIsTabsSticky(false);
      }
      }
    };
    
    window.addEventListener('scroll', handleScroll);

    console.log(`=== ${activeTab} 탭 활성화 ===`);
    console.log('스크롤 가능:', document.documentElement.scrollHeight > window.innerHeight);
    
    handleScroll();
  
    return () => {
      console.log(`=== ${activeTab} 탭 이벤트 제거 ===`);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab]);

  return (
    <div className="mock-interview-page mobile">
      <div className={`mock-interview__sticky-tabs ${isTabsSticky ? 'is-sticky' : ''}`}>
      <Tabs
            tabs={tabItems}
            active={activeTab}
            onChange={handleTabClick}
            className="mock-interview-tabs default_tabs"
            itemClassName="mock-interview-tabs__item"
            activeClassName="on"
            />
      </div>
      <header id="section-description" className="mock-interview-page__hero">
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
    
      <section className="mock-interview-page__section">
      {activeTab === "report" && (
          <M_MyReportResult/>
        )}
          {activeTab === "history" && (
            <M_MockInterviewHistory
              totalCount={10}
              doneCount={10}
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
  );
}
