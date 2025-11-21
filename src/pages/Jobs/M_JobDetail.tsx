import React, { useState, useEffect, useMemo } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Tabs from "@/shared/components/tabs/Tabs";

import chevron_left from '@/assets/icons/chevron_left.png';
import text_jobkorea_logo from '@/assets/icons/company_logos/text_jobkorea_logo.png';
import arrow_up_right from '@/assets/icons/arrow-up-right.png';

import withmind_logo80 from '@/assets/icons/company_logos/withmind_logo80.png';
import blank_bookmark_black from '@/assets/icons/size24/ic_bookmark_gray900_24.png';
import bookmark_active_purple from '@/assets/icons/size24/ic_bookmark_active_purple24.png';
import copy_icon_blck_24x24 from '@/assets/icons/copy_icon_blck_24x24.png';
import green_star20x20 from '@/assets/icons/green_star20x20.png';
import ic_document_search_purple_20 from '@/assets/icons/size20/ic_document_search_purple_20.png';
import ic_chevron_forward_right_purple_20 from '@/assets/icons/size20/ic_chevron_forward_right_purple_20.png';





import duo_candidates_at_monitor from '@/assets/illustrations/duo_candidates_at_monitor.png';
import icon_career_gray from '@/assets/icons/aside_item_logo/icon-career-gray.png';
import icon_deadline_gray from '@/assets/icons/aside_item_logo/icon-deadline-gray.png';
import icon_education_gray from '@/assets/icons/aside_item_logo/icon-education-gray.png';
import icon_employment_gray from '@/assets/icons/aside_item_logo/icon-employment-gray.png';
import icon_location_gray from '@/assets/icons/aside_item_logo/icon-location-gray.png';
import icon_role_gray from '@/assets/icons/aside_item_logo/icon-role-gray.png';

import RecommendedJobCard from "@/shared/components/job-posting-item/RecommendedJobCard";
import Modal from "@/shared/components/modal/Modal";
import "./JobDetail.css";





export default function M_JobDetail() {
  const navigate = useNavigate();
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [bookMark, setBookMark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { jobId } = useParams();
  const [activeTab, setActiveTab] = useState<"description" | "mockInterview" | "recommendation">("description");


  const handleTabClick = (key: "description" | "mockInterview" | "recommendation") => {
    setActiveTab(key);
    console.log("선택된 탭:", key);  // 필요하면
    const targetId = `section-${key}`;
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
     
        const stickyTabElement = document.querySelector('.job-detail__sticky-tabs');
     
        const offset = stickyTabElement 
        ? (stickyTabElement as HTMLElement).offsetHeight + 10 
        : 0; 

        window.scrollTo({
      
          top: targetElement.offsetTop - offset,
          behavior: 'smooth'
        });
      }

  };



  const tabItems = [
    { key: "description", label: "상세 요강" },
    { key: "mockInterview", label: "AI 모의면접" },
    { key: "recommendation", label: "추천 채용 공고" },
  ];

  const handleBookmark = () => {
    setBookMark(prev => !prev);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success("링크가 복사되었습니다.");
      })
      .catch(() => {
        toast.error("링크 복사에 실패했습니다.");
      });
  };

  const handleMockInterviewClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      // 1. 필요한 DOM 요소 가져오기
      const descriptionSection = document.getElementById('section-description');
      const tabsElement = document.querySelector('.job-detail-tabs');
      const pageHeaderElement = document.querySelector('.page-header');
 
      // 2. 핵심 요소가 존재하는지 확인
      if (descriptionSection && tabsElement) {
        const descriptionTop = descriptionSection.offsetTop;
        const tabsHeight = (tabsElement as HTMLElement).offsetHeight; 
        const scrollPosition = window.scrollY;

        // 3. 탭 고정 조건: 스크롤 위치 + 탭 높이가 설명 섹션 시작 지점을 넘었을 때
        const shouldBeSticky = scrollPosition + tabsHeight > descriptionTop;
        
        if (shouldBeSticky) {
            // 고정 상태로 전환
            setIsTabsSticky(true);
            
            // pageHeaderElement가 존재할 때만 클래스 추가 (널 체크)
            if (pageHeaderElement) {
                pageHeaderElement.classList.add('sticky-active');
            }
        } else {
            // 고정 상태 해제
            setIsTabsSticky(false);
            
            // pageHeaderElement가 존재할 때만 클래스 제거 (널 체크)
            if (pageHeaderElement) {
                pageHeaderElement.classList.remove('sticky-active');
            }
        }
      }
    };
  
    // 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);
    
    // 초기 실행: 페이지 로드 시 현재 스크롤 위치에 따라 상태 설정
    handleScroll();
  
    // 클린업 함수: 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="job-detail__container mobile">
      <article className="job-detail">
        <section className="job-detail__main">
          <div className="job-detail__header">
            <div className="job-detail__company">
              <div className="job-detail__company-left">
                <div className="job-detail__company-logo">
                  <img src={withmind_logo80} alt="" /></div>
                <div className="job-detail__company-desc">
                  <span className="job-detail__title">프론트엔드 개발자</span>
                  <span className="job-detail__company-meta">위드마인드ㆍ서울</span>
                </div>
              </div>
        
            </div>
            <div className="job-detail__ai">
            <div className="job-detail__ai-header">
             <img src={green_star20x20} alt="" />
              <span className="job-detail__ai-title">AI 적합도 00%</span>
            </div>

            <div className="job-detail__ai-summary">
              <div className="job-detail__ai-item">
                <span className="job-detail__ai-term">분석 요약</span>
                <span className="job-detail__ai-desc">
                  홍길동 지원자는 Jetpack, Firebase, Kotlin 기술 경험을 보유하고 있으며, 모바일 앱 개발 분야에 대한 높은 이해도를 보여줍니다.
                </span>
              </div>

              <div className="job-detail__ai-item">
                <span className="job-detail__ai-term">추천 이유</span>
                <span className="job-detail__ai-desc">
                  서울 거주로 출퇴근 접근성이 높고, 직무 이해도가 높아 적합한 인재입니다.
                </span>
              </div>
       
            </div>
          </div>
          <div className="job-detail__aside-list">
          <div className="job-detail__aside-item job-detail__aside-item--role">
            <div className="job-detail__aside-term">
              <span className="job-detail__aside-icon"><img src={icon_role_gray} alt="" /></span>
              <span className="job-detail__aside-label">직무</span>
            </div>
            <span className="job-detail__aside-value">프론트엔드 개발</span>
          </div>
          <div className="job-detail__aside-item job-detail__aside-item--career">
            <div className="job-detail__aside-term">
              <span className="job-detail__aside-icon"><img src={icon_career_gray} alt="" /></span>
              <span className="job-detail__aside-label">경력</span>
            </div>
            <span className="job-detail__aside-value">신입 이상</span>
          </div>
          <div className="job-detail__aside-item job-detail__aside-item--education">
            <div className="job-detail__aside-term">
              <span className="job-detail__aside-icon"><img src={icon_education_gray} alt="" /></span>
              <span className="job-detail__aside-label">학력</span>
            </div>
            <span className="job-detail__aside-value">대졸 이상</span>
          </div>

          <div className="job-detail__aside-item job-detail__aside-item--location">
            <div className="job-detail__aside-term">
              <span className="job-detail__aside-icon"><img src={icon_location_gray} alt="" /></span>
              <span className="job-detail__aside-label">근무 지역</span>
            </div>
            <span className="job-detail__aside-value">서울 마포구</span>
          </div>

          <div className="job-detail__aside-item job-detail__aside-item--employment">
            <div className="job-detail__aside-term">
              <span className="job-detail__aside-icon"><img src={icon_employment_gray} alt="" /></span>
              <span className="job-detail__aside-label">고용 형태</span>
            </div>
            <span className="job-detail__aside-value">정규직 · 계약직</span>
          </div>
          <div className="job-detail__aside-item job-detail__aside-item--deadline">
            <div className="job-detail__aside-term">
              <span className="job-detail__aside-icon"><img src={icon_deadline_gray} alt="" /></span>
              <span className="job-detail__aside-label">마감일</span>
            </div>
            <span className="job-detail__aside-value">
              2025.08.31(일)
              <span className="job-detail__aside-badge job-detail__aside-badge--due">D-20</span>
            </span>
          </div>
               </div>
            <div className="job-detail__resume">
              <div className="job-detail__resume-info">
                <img src={ic_document_search_purple_20} alt="" />
                <span className="job-detail__resume-text">
                이력서 작성하고 나에게 맞는 AI 공고 추천을 받아보세요.
                </span>
              </div>
              <div className="job-detail__resume-cta" onClick={()=>{navigate(`/resumes/create`);}}>
                <span className="job-detail__resume-button">이력서 작성하기</span>
                <img src={ic_chevron_forward_right_purple_20} alt="" />
              </div>
            </div>
    
          </div>

          
          <div className="job-detail__divider"></div>
          <div className={`job-detail__sticky-tabs ${isTabsSticky ? 'is-sticky' : ''}`}>
          <Tabs
            tabs={tabItems}
            active={activeTab}
            onChange={handleTabClick}
            className="job-detail-tabs default_tabs"
            itemClassName="job-detail-tabs__item tab"
            activeClassName="on"
            />
            </div>
          <div id="section-description" className="job-detail__body">
            <div className="job-detail__section job-detail__section--responsibilities">
              <span className="job-detail__section-title">주요 업무</span>
              <ul className="job-detail__list">
                <li className="job-detail__list-item">• 면접왕/인터뷰 마스터 등 자사의 다양한 웹 서비스 개발</li>
                <li className="job-detail__list-item">• 최신 프론트엔드 기술을 통한 창의적 개발 제안 및 실현</li>
                <li className="job-detail__list-item">• React, Vue, JSP 등의 환경에서 프론트엔드 업무 담당</li>
              </ul>
            </div>

            <div className="job-detail__section job-detail__section--requirements">
              <span className="job-detail__section-title">자격 요건</span>
              <ul className="job-detail__list">
                <li className="job-detail__list-item">• 면접왕/인터뷰 마스터 등 자사의 다양한 웹 서비스 개발</li>
                <li className="job-detail__list-item">• 최신 프론트엔드 기술을 통한 창의적 개발 제안 및 실현</li>
                <li className="job-detail__list-item">• React, Vue, JSP 등의 환경에서 프론트엔드 업무 담당</li>
              </ul>
            </div>

            <div className="job-detail__section job-detail__section--preferred">
              <span className="job-detail__section-title">우대 사항</span>
              <ul className="job-detail__list">
                <li className="job-detail__list-item">• 면접왕/인터뷰 마스터 등 자사의 다양한 웹 서비스 개발</li>
                <li className="job-detail__list-item">• 최신 프론트엔드 기술을 통한 창의적 개발 제안 및 실현</li>
                <li className="job-detail__list-item">• React, Vue, JSP 등의 환경에서 프론트엔드 업무 담당</li>
              </ul>
            </div>
          </div>

          <div className="job-detail__divider"></div>
          <div id="section-mockInterview" className="job-detail__body">
            <div className="job-detail__section job-detail__section--responsibilities">
              <span className="job-detail__section-title">AI 모의면접</span>
              <div className="job-detail-ai">
               <div className="job-detail-ai__intro">
                    <span className="job-detail-ai__intro-title">
                    <em className="ai-text_color">면접 합격률</em>
                    을 높이고 싶다면?
                    </span>
                    <span className="job-detail-ai__intro-desc">
                    잡콕만의 이력서 기반 AI 모의면접을 경험해 보세요.
                    </span>
                </div>
              
                   <img className="job-detail-ai__character" src={duo_candidates_at_monitor} alt="" />
        
                   <div className="job-detail__mock-cta" onClick={handleMockInterviewClick} style={{cursor: 'pointer'}}>
                    <span><img src={arrow_up_right} alt="" /></span>
                    해당공고로 모의면접 보기</div>
               </div>
            </div>

           
          </div>
          <div className="job-detail__divider"></div>
          <div id="section-recommendation" className="job-detail__body">
            <div className="job-detail__section job-detail__section--responsibilities">
              <span className="job-detail__section-title">추천 채용 공고</span>
              <RecommendedJobCard/>
            </div>  
          </div>
          <div className="job-detail__divider"></div>
     
          <div className="job-detail__header-actions">
             <span 
                  className="job-detail__action job-detail__action--copy"
                  onClick={handleCopyLink}
                  style={{cursor: 'pointer'}}
                >
                  <span className="job-detail__action-icon">
                    <img src={copy_icon_blck_24x24} alt="" />
                  </span>
                </span>
                <span
                  className="job-detail__action job-detail__action--bookmark"
                  onClick={handleBookmark}
                  style={{cursor: 'pointer'}}
                >
                  <span className="job-detail__action-icon">
                    <img src={bookMark ? bookmark_active_purple : blank_bookmark_black} alt="" />
                  </span>
                </span>
                <span className="default_btn_black btn_w_full">
                지원하기
             </span>
              </div>
         </section>
      </article>
      </div>
      <Modal
          open={isModalOpen}
              title="이력서가 등록되어 있지 않습니다."
              desc="모의면접을 진행하기 위해 먼저 이력서를 작성해 주세요."
              confirmText="이력서 작성하기"
              cancelText="취소"
              cancelClassName ="btn_w_full default_btn_white"
              confirmClassName="btn_w_full default_btn_black"
              onConfirm={()=>{navigate(`/resumes/create`);}}
          onClose={handleModalClose}
       />
    </>
  );
}