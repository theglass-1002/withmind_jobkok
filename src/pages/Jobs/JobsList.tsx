import React, { useState } from "react";
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
import bookmark_active_purple from '@/assets/icons/bookmark_active_purple.png';
import bookmark_inactive from '@/assets/icons/bookmark_inactive.png';
import mp_test_logo from '@/assets/icons/mp_test_logo.png';
import jobkorea from '@/assets/icons/company_logos/jobkorea.png';
import fire from '@/assets/icons/fire.png';
import seed from '@/assets/icons/seed.png';
import ai_pick from '@/assets/icons/ai_pick.png';
import arrow_left from '@/assets/icons/keyboard_arrow_left.png';
import arrow_right from '@/assets/icons/keyboard_arrow_right.png';
import green_star from '@/assets/icons/green_star.png';
import "./Jobs.css";
import Pagination from "@/shared/components/Pagination";



export default function JobsList() {
  const [page, setPage] = useState(1);
  const [resumeReco, setResumeReco] = useState(true); // 이력서 기반 추천 토글
  const [view, setView] = useState(0);
  

  return (
    <>
    {console.log(view)}
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
                <div className={`job-posting__list job-posting__list--${view === 1 ? 'grid' : 'row'}`}>
                   <div className="job-posting__card">
                   <div className="job-card__header">
                    <div className="job-posting__left">
                      <span className="job-card__logo">로고</span>
                      <div>
                        <div>
                          <span className="job-card__company">위드마인드</span>
                          <span className="job-card__brand">사람인로고</span>
                        </div>
                        <span className="job-card__title">프론트앤드 개발자</span>
                      </div>
                    </div>
                    <span className="job-card__favorite">즐겨찾기벼튼</span>
                    </div>

                    <div className="job-card__divider"></div>

                    <div className="job-card__body">
                      <div>
                        <span className="job-card__fit">ai 적합도 70%</span>
                        <div>
                          <div>
                            <span className="job-card__location">서울 마포구</span>
                            <span className="job-card__type">정규직</span>
                          </div>
                          <span className="job-card__deadline">~2025.08.31</span>
                        </div>
                      </div>

                      <div className="job-card__badges">
                        <span className="job-card__badge">재택근무</span>
                        <span className="job-card__badge">유연근무제</span>
                      </div>
                    </div>

                    <div className="job-card__sticker">ai pick</div>
                   </div>

                </div>
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


// <div className={`job-posting__list job-posting__list--${view === 1 ? 'grid' : 'row'}`}>
// <div className={`job-posting__item job-posting__item--${view === 1 ? 'card' : 'row'}`}>
//     <div className="job-posting__card">
//       <div className="job-posting__row job-posting__row--top">
//         <div className="job-posting__left">
        
//             <img className="job-posting__logo" src={mp_test_logo} alt="" />
    
//           <div className="job-posting__details">
//             <div className="job-posting__title">
//               <span className="job-posting__company">케이티밀리의서재
//               <span className="job-posting__source-logo"><img src={jobkorea} alt="" /></span>

//               </span>
//               <span className="job-posting__role">프론트</span>
//             </div>
//             <div className="job-posting__meta">
//             <div className="job-posting__match job-posting__match--level">
//               <img src={green_star} alt="" />
//               AI 적합도 90%</div>
//             <div className="job-posting__meta-items">
//               <span className="job-posting__meta-item">서울 마포구ㆍ5~10년ㆍ학력 무관</span>
//               <span className="job-posting__meta-item">정규직ㆍ계약직</span>
//               <span className="job-posting__meta-item">상시 채용</span>
//             </div>
//           </div>
//           </div>
//         </div>
//         <div className="job-posting__right job-posting__favorite">
//           <img src={bookmark_active_purple} alt="" />
//         </div>
//       </div>

//       <div className="job-posting__row job-posting__row--bottom">
//         <div className="job-posting__badges">
//           <span className="job-posting__badge">
//             <span><img src={seed} alt="" /></span>
//             여유있는근무제!</span>
//           <span className="job-posting__badge job-posting__badge--urgent">
//             <img src={fire} alt="" />
//             마감임박!</span>
//         </div>
//         <div className="job-posting__ai-pick">
//           <img src={ai_pick} alt="" />
//         </div>
//       </div>
//     </div>
//   </div>
// </div>