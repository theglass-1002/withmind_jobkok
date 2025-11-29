import React, { useState, useEffect } from "react";
import 'rc-slider/assets/index.css';

import Tabs from "@/shared/components/tabs/Tabs";
import {useStickyTabs} from '@/shared/utils/util';
import keyboard_arrow_right from '@/assets/icons/chevron_right_white.png';
import AllJobPostingSection from "@/pages/Jobs/sections/AllJobPostingSection";
import M_AllJobPostingSection from "@/pages/Jobs/sections/M_AllJobPostingSection";
import SavedJobPostingSection from "@/pages/Jobs/sections/SavedJobPostingSection";
import M_SavedJobPostingSection from "@/pages/Jobs/sections/M_SavedJobPostingSection";



import "./Jobs.css";



export default function JobsList() {
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all'); // 탭 상태
  const isTabsSticky = useStickyTabs(
    "sticky-trigger",
    ".default_tabs",
    ".page-header"
  );
  
  const tabItems = [
    { key: "all", label: "전체공고" },
    { key: "saved", label: "저장공고" },
  ];

  const handleTabClick = (key: string) => {
    setActiveTab(key as "all" | "saved");
  };


  useEffect(() => {
    const masthead = document.querySelector(".masthead");
    const searchToolbar = document.querySelector(".jobs-toolbar__search");
    if (!masthead || !searchToolbar) return;
    
    const onScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        // 스크롤이 50px 이상이면 static으로 변경 (고정 해제)
        masthead.classList.add("masthead-static");
        searchToolbar.classList.add("search-toolbar-fixed");
      } else {
        // 스크롤이 50px 미만이면 fixed 유지 (고정)
        masthead.classList.remove("masthead-static");
        searchToolbar.classList.remove("search-toolbar-fixed");
      }

      if (scrollTop > 165) {
        searchToolbar.classList.add("search-toolbar-fixed");
      } else {
        searchToolbar.classList.remove("search-toolbar-fixed");
      }
    };
    
    // 스크롤 이벤트 등록
    window.addEventListener("scroll", onScroll);
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (masthead) {
        masthead.classList.remove("masthead-static");
      }
      if (searchToolbar) {
        searchToolbar.classList.remove("search-toolbar-fixed");
      }
    };
  }, []);



  return (
    <>
      <div className="jobs">
      <div className="resume-promo-container" id="sticky-trigger">
          <div className="resume-promo">
            <span className="resume-promo__text">
              이력서 작성하고 나에게 맞는 AI 공고 추천을 받아보세요.
            </span>
            <a className="resume-promo__action" href="/resumes/create">
              <span className="resume-promo__label">이력서 작성하기</span>
              <span className="resume-promo__icon">
              <img  src={keyboard_arrow_right} alt="" />
              </span>
           </a>
          </div>
          </div>
          <div className="job-tabs-container">
          <Tabs
            tabs={tabItems}
            active={activeTab}
            onChange={handleTabClick}
            className={`jobs-tabs default_tabs`}
            itemClassName="jobs-tab"
            activeClassName="on"
          />
          </div>
       
          {activeTab==='all'?<AllJobPostingSection/>:<SavedJobPostingSection/>}
      </div>

      <div className="jobs mobile">
      <Tabs
          tabs={tabItems}
          active={activeTab}
          onChange={handleTabClick}
          className={`jobs-tabs default_tabs ${isTabsSticky ? "is-sticky" : ""}`}
          itemClassName="jobs-tab"
          activeClassName="on"
        />
            {activeTab==='all'?
            <M_AllJobPostingSection/>:
             <M_SavedJobPostingSection/>
            }            
      </div>
    </>
  );
}