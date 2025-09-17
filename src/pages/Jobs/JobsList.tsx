import React, { useState, useEffect } from "react";
import Switch from "react-switch";
import { NavLink } from "react-router-dom";
import keyboard_arrow_right from '@/assets/icons/chevron_right_white.png';
import search from '@/assets/icons/search.png';
import arrow_drop_down from '@/assets/icons/arrow_drop_down.png';
import arrow_drop_down_gray from '@/assets/icons/arrow_drop_down_gray.png';
import help from '@/assets/icons/help.png';
import cancel from '@/assets/icons/cancel.png';
import grid_gray from '@/assets/icons/grid_gray.png';
import grid_black from '@/assets/icons/grid_black.png';
import row_black from '@/assets/icons/row_black.png';
import row_white from '@/assets/icons/row_gray.png';
import arrow_left from '@/assets/icons/keyboard_arrow_left.png';
import arrow_right from '@/assets/icons/keyboard_arrow_right.png';
import JobPostingRow from "@/shared/components/job-posting-item/JobPostingRow";
import JobPostingCard from "@/shared/components/job-posting-item/JobPostingCard";
import Pagination from "@/shared/components/Pagination";
import "./Jobs.css";




export default function JobsList() {
  const [page, setPage] = useState(1);
  const [resumeReco, setResumeReco] = useState(true); // 이력서 기반 추천 토글
  const [view, setView] = useState(0);
  

  useEffect(() => {
    const masthead = document.querySelector(".masthead");
    const searchToolbar = document.querySelector(".jobs-toolbar__search");
    if (!masthead || !searchToolbar) return;
    
    const onScroll = () => {
      const scrollTop = window.scrollY;
      console.log(scrollTop);
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
      <div className="jobs jobs-top-padding"> {/* 헤더(고정 72px) 아래 공간 확보 */}
          <div className="resume-promo">
            <span className="resume-promo__text">
              이력서 작성하고 나에게 맞는 AI 공고 추천을 받아보세요.
            </span>
            <a className="resume-promo__action" href="/resume">
              <span className="resume-promo__label">이력서 작성하기</span>
              <span className="resume-promo__icon">
              <img  src={keyboard_arrow_right} alt="" />
              </span>
           </a>
          </div>
          <div className="jobs-toolbar">
            <div className="jobs-toolbar__search">
            <div className="panel-search">
                <img src={search} alt="" />
                  <input type="text" placeholder="직무, 기업명, 지역등을 입력해주세요" />
                  <img src={cancel} alt="" />
                </div>
                <div className="job-search-filters">
                <div className="job-search-filter job-search-filter--toggle">
                  <div className="job-search-filter__label">
                    <span className="job-search-filter__text">이력서 기반 추천</span>
                    <img className="job-search-filter__help" src={help} alt="" />
                  </div>
                  <Switch
                      checked={resumeReco}
                      onChange={setResumeReco}
                      onColor="#000000"
                      offColor="#E5E7EB"
                      onHandleColor="#FFFFFF"
                      offHandleColor="#FFFFFF"
                      handleDiameter={18}
                      height={22}
                      width={42}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      aria-label="이력서 기반 추천"
                    />
                </div>
                <ul className="job-search-filter-menu">
                  <li className="job-search-filter-menu__item">
                      <span className="job-search-filter-menu__label">직군ㆍ직무</span>
                      <span className="job-search-filter-menu__icon">
                        <img src={arrow_drop_down} alt="" />
                      </span>
                  </li>
                  <div className="voxs">
                    <div>직군전체</div>
                    <div>바디</div>
                    <div>옵션</div>
                    <div>버튼</div>
                  </div>
                  <li className="job-search-filter-menu__item">
                      <span className="job-search-filter-menu__label">경력</span>
                      <span className="job-search-filter-menu__icon">
                        <img src={arrow_drop_down} alt="" />
                      </span>
                  </li>
                  <li className="job-search-filter-menu__item">
                      <span className="job-search-filter-menu__label">학력</span>
                      <span className="job-search-filter-menu__icon">
                        <img src={arrow_drop_down} alt="" />
                      </span>
                  </li>
                  <li className="job-search-filter-menu__item">
                      <span className="job-search-filter-menu__label">지역</span>
                      <span className="job-search-filter-menu__icon">
                        <img src={arrow_drop_down} alt="" />
                      </span>
                  </li>
                  <li className="job-search-filter-menu__item">
                      <span className="job-search-filter-menu__label">채용 유형</span>
                      <span className="job-search-filter-menu__icon">
                        <img src={arrow_drop_down} alt="" />
                      </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="jobs-tabs" role="tablist" aria-label="공고 탭">
              <span className="jobs-tab on">
              전체공고
              </span>
              <span className="jobs-tab">
                저장공고
              </span>
            </div>
              </div>
              <div className="job-posting">
              <div className="job-posting__ai-recommend">이력서를 기반으로 AI가 103개의 추천 공고를 찾았어요!</div>
              <div className="job-posting__container">
              <div className="job-posting__content">
                <div className="job-posting__header">
                  <span className="job-posting__count">총 <p className="point-text-black">365개</p>전체공고</span>
                  <div className="job-posting__controls">
                    <div className="job-posting__select job-posting__sort">
                      <span className="job-posting__select-label">적합도순</span>
                      <span className="job-posting__icon">
                        <img src={arrow_drop_down_gray} alt="" />
                      </span>
                    </div>
                    <div className="job-posting__select job-posting__page-size">
                      <span className="job-posting__select-label">15개씩</span>
                      <span className="job-posting__icon">
                        <img src={arrow_drop_down_gray} alt="" />
                      </span>
                    </div>

                    <div className="job-posting__view-toggle" role="group" aria-label="보기 전환">
                    <span className="job-posting__view-btn job-posting__view-btn--card" onClick={()=>{setView(1)}} role="button" tabIndex={0}>
                       {view===1?(<img src={grid_black}/>):(<img src={grid_gray}/>)} 
                      </span>
                      <span className="job-posting__view-btn job-posting__view-btn--list job-posting__view-btn--active" onClick={()=>{setView(0)}} role="button" tabIndex={0}>
                      {view===0?(<img src={row_black}/>):(<img src={row_white}/>)} 
                      </span>
                    </div>
                  </div>
                </div>
                {view===1?<JobPostingCard/>:<JobPostingRow/>}
              </div>
              <div className="job-posting__pagination">
                <Pagination 
                current={1}
                total={10}
                onChange={setPage}
                pageWindow={5}
                prevIcon={<img src={arrow_left} alt="" aria-hidden="true" />}
                nextIcon={<img src={arrow_right} alt="" aria-hidden="true" />}
                />
            </div>
              </div>
          </div>
      </div>
    </>
  );
}

