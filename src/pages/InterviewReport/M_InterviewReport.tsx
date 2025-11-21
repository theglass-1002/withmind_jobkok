import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "./InterviewReport.css";
import ic_star_white_20 from "@/assets/icons/size20/ic_star_white_20.png";
import ic_star_gray900_20 from "@/assets/icons/size20/ic_star_gray900_20.png";
import MyReportEmpty from "@/pages/InterviewReport/my-report/MyReportEmpty";
import M_MyReportResult from "@/pages/InterviewReport/my-report/M_MyReportResult";
import UiFilter, { type UiFilterOption } from "@/shared/components/ui-filter/UiFilter";
import InterviewReportHistory from "@/pages/InterviewReport/history/MockInterviewHistory";
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

  const handleTabClick = (key: "report" | "history" ) => {
    setActiveTab(key);
    console.log("선택된 탭:", key);  // 필요하면
    const targetId = `section-${key}`;
    const targetElement = document.getElementById(targetId);
    console.log(targetElement);
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


  const handleStart = () => {
    console.log("start mock interview");
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

    const handleScroll = () => {
      const descriptionSection = document.getElementById('section-description');
      const tabsElement = document.querySelector('.mock-interview-tabs-wrapper');
      const pageHeaderElement = document.querySelector('.masthead');
      if (descriptionSection && tabsElement) {
        const descriptionTop = descriptionSection.offsetTop;        
        const tabsHeight = (tabsElement as HTMLElement).offsetHeight; 
        const scrollPosition = window.scrollY;
        const shouldBeSticky = scrollPosition + tabsHeight > descriptionTop;
        if(shouldBeSticky){
          setIsTabsSticky(true);
          console.log(tabsElement);
          if (pageHeaderElement) {
            tabsElement.classList.add('sticky-active');
        }
        }else{
          setIsTabsSticky(false);
          if (pageHeaderElement) {
            tabsElement.classList.remove('sticky-active');
        }
        }
      }
    
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };


  }, []);


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
    
      <section id="section-description" className="mock-interview-page__section">
      {activeTab === "report" && (
          // <MyReportEmpty/>
          <M_MyReportResult/>
        )}
          {activeTab === "history" && (
            <InterviewReportHistory
              totalCount={0}
              doneCount={0}
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
