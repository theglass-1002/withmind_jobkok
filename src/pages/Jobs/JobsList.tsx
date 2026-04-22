import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "rc-slider/assets/index.css";
import Tabs from "@/shared/components/tabs/Tabs";
import { useStickyTabs } from "@/shared/utils/util";
import keyboard_arrow_right from "@/assets/icons/chevron_right_white.png";
import AllJobPostingSection from "@/pages/Jobs/sections/AllJobPostingSection";
import M_AllJobPostingSection from "@/pages/Jobs/sections/M_AllJobPostingSection";
import SavedJobPostingSection from "@/pages/Jobs/sections/SavedJobPostingSection";
import M_SavedJobPostingSection from "@/pages/Jobs/sections/M_SavedJobPostingSection";
import { fetchResumeCheck } from "@/api/resume/resume.api";

import "./Jobs.css";

type JobsLocationState = {
  activeTab?: "all" | "saved";
  keyword?: string;
  categoryIdx?: number | string;
  jobId?: number | string;
  childrenCount?: number;
  children?: any[];
};

export default function JobsList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");
  const [resumeExists, setResumeExists] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

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
    const token = localStorage.getItem("accessToken");
    const isLoggedIn = !!token;

    setLoggedIn(isLoggedIn);

    console.log("[JobsList] 로그인 여부:", isLoggedIn);
  }, []);

  useEffect(() => {
    const state = (location.state as JobsLocationState) || null;

    console.log("[JobsList] location.state:", state);
    console.log("[JobsList] 전달받은 keyword:", state?.keyword);

    const incomingTab = state?.activeTab;

    if (incomingTab === "all" || incomingTab === "saved") {
      setActiveTab(incomingTab);
    }
  }, [location.state]);

  useEffect(() => {

    if (!loggedIn) {
  
      setResumeExists(false);
      return;
    }

    const checkResume = async () => {
      try {
        const resumeCheck = await fetchResumeCheck();
        console.log("[JobsList] resumeCheck.exists:", resumeCheck.exists);
        setResumeExists(!!resumeCheck.exists);
      } catch (e) {
        console.log("[JobsList] resumeCheck API 에러:", e);
        setResumeExists(false);
      }
    };

    checkResume();
  }, [loggedIn]);

  useEffect(() => {
    const masthead = document.querySelector(".masthead");
    const searchToolbar = document.querySelector(".jobs-toolbar__search");
    if (!masthead || !searchToolbar) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;

      if (scrollTop > 50) {
        masthead.classList.add("masthead-static");
        searchToolbar.classList.add("search-toolbar-fixed");
      } else {
        masthead.classList.remove("masthead-static");
        searchToolbar.classList.remove("search-toolbar-fixed");
      }

      if (scrollTop > 165) {
        searchToolbar.classList.add("search-toolbar-fixed");
      } else {
        searchToolbar.classList.remove("search-toolbar-fixed");
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      masthead?.classList.remove("masthead-static");
      searchToolbar?.classList.remove("search-toolbar-fixed");
    };
  }, []);

  return (
    <>
      <div className="jobs">
        {resumeExists === false && (
          <div className="resume-promo-container" id="sticky-trigger">
            <div className="resume-promo">
              <span className="resume-promo__text">
                기본 이력서 작성하고 나에게 맞는 AI 공고 추천을 받아보세요.
              </span>
              <a className="resume-promo__action" href="/resumes/create">
                <span className="resume-promo__label">이력서 작성하기</span>
                <span className="resume-promo__icon">
                  <img src={keyboard_arrow_right} alt="" />
                </span>
              </a>
            </div>
          </div>
        )}

        <div className="job-tabs-container">
          <Tabs
            tabs={tabItems}
            active={activeTab}
            onChange={handleTabClick}
            className="jobs-tabs default_tabs"
            itemClassName="jobs-tab"
            activeClassName="on"
          />
        </div>

        {activeTab === "all" ? (
          <AllJobPostingSection
            loggedIn={loggedIn}
            resumeExists={resumeExists}
          />
        ) : (
          <SavedJobPostingSection />
        )}
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
        {resumeExists === false && (
          <div className="resume-promo-container">
            <div className="resume-promo">
              <span className="resume-promo__text">
                이력서 작성하고 나에게 맞는 AI 공고 추천을 받아보세요.
              </span>
              <a className="resume-promo__action" href="/resumes/m-create">
                <span className="resume-promo__label">이력서 작성하기</span>
                <span className="resume-promo__icon">
                  <img src={keyboard_arrow_right} alt="" />
                </span>
              </a>
            </div>
          </div>
        )}
        {activeTab === "all" ? (
          <M_AllJobPostingSection
            loggedIn={loggedIn}
            resumeExists={resumeExists}
          />
        ) : (
          <M_SavedJobPostingSection />
        )}
      </div>
    </>
  );
}