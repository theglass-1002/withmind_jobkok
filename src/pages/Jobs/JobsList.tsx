import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "rc-slider/assets/index.css";
import Tabs from "@/shared/components/tabs/Tabs";
import { useStickyTabs } from "@/shared/utils/util";
import keyboard_arrow_right from "@/assets/icons/chevron_right_white.png";
import AllJobPostingSection from "@/pages/Jobs/sections/AllJobPostingSection";
import M_AllJobPostingSection from "@/pages/Jobs/sections/M_AllJobPostingSection";
import SavedJobPostingSection from "@/pages/Jobs/sections/SavedJobPostingSection";
import M_SavedJobPostingSection from "@/pages/Jobs/sections/M_SavedJobPostingSection";
import { logout } from "@/api/auth/auth.api";
import { fetchResumeCheck } from "@/api/resume/resume.api";

import "./Jobs.css";

export default function JobsList() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");

  // 🔥 이력서 존재 여부 상태
  const [resumeExists, setResumeExists] = useState<boolean | null>(null);

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
    const checkResume = async () => {
      try {
        const resumeCheck = await fetchResumeCheck();
        console.log("📝 resumeCheck.exists:", resumeCheck.exists);

        // 존재 여부 저장
        setResumeExists(resumeCheck.exists);
      } catch (e) {
        console.error("이력서 존재 여부 확인 중 오류:", e);

        if (e?.code === 999) {
          console.log("로그인만료");
          logout();
          navigate("/login");
          return;
        }

        setResumeExists(false); // 오류 시 기본값 false
      }
    };

    checkResume();
  }, []);

  // 🔥 스크롤 이벤트
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
                이력서 작성하고 나에게 맞는 AI 공고 추천을 받아보세요.
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
            className={`jobs-tabs default_tabs`}
            itemClassName="jobs-tab"
            activeClassName="on"
          />
        </div>

        {activeTab === "all" ? (
          <AllJobPostingSection />
        ) : (
          <SavedJobPostingSection />
        )}
      </div>

      <div className="jobs mobile">
        <Tabs
          tabs={tabItems}
          active={activeTab}
          onChange={handleTabClick}
          className={`jobs-tabs default_tabs ${
            isTabsSticky ? "is-sticky" : ""
          }`}
          itemClassName="jobs-tab"
          activeClassName="on"
        />

        {activeTab === "all" ? (
          <M_AllJobPostingSection />
        ) : (
          <M_SavedJobPostingSection />
        )}
      </div>
    </>
  );
}
