import React from 'react'
import { useNavigate } from "react-router-dom";
import ic_bell_gray900_24 from "@/assets/icons/size24/ic_bell_gray900_24.png";
import ic_search_white_20 from "@/assets/icons/size20/ic_search_white_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";


export default function AIReport() {
  return (
    <>
       <div className="ai-report-page">
       <div className="company-dashboard-header">
        <div className="company-dashboard-header__title company-dashboard-header__title-group">
        <span className="page-header-title-group__main-title">AI 인재 매칭</span>
        <span className="page-header-title-group__sub-title">AI 리포트</span>
        </div>
        
        <div className="company-dashboard-header__actions">
          <div className="company-dashboard-header__notification">
            <img 
              src={ic_bell_gray900_24} 
              alt="알림" 
              className="company-dashboard-header__icon" 
            />
          </div>
          <div className="company-dashboard-header__info">
            <span className="company-dashboard-header__company-name">위드마인드
            </span>
            <img src={ic_arrow_drop_down_gray900_24} alt="" />
          </div>
        </div>       
      </div> 
      <div className='report-main'>
        
        {/* 1. 탭 메뉴 섹션 */}
        <div className='report-tab-nav'>
          <div className='report-tab-nav__container'>
              <span className='report-tab-nav__item on'>이력서</span>
              <span className='report-tab-nav__item'>AI분석</span>
          </div>
      </div>
            
        {/* 2. 리포트 콘텐츠 섹션 */}
        <div className='report-content'>
        
            {/* 상단 요약 제목 */}
            <span className='report-content__main-summary'>성장하는 개발자, 준비된 홍길동입니다.</span>
            
            {/* AI 분석 요약 박스 */}
            <div className='ai-summary-box'>
                <div className='ai-summary-box__score'>
                    <span className='ai-summary-box__score-label'>AI 적합률</span>
                    <span className='ai-summary-box__score-value'>92%</span>
                </div>
                
                <div className='ai-summary-box__details'>
                    <span className='ai-summary-box__detail-title'>분석 요약</span>
                    
                    <div className='ai-summary-box__detail-item'>
                        <span className='ai-summary-box__item-label'>1. 기술적 적합성</span>
                        <span className='ai-summary-box__item-text'>이 후보자는 Python과 JavaScript에 대한 심층적인 지식을 보유하고 있으며, 이는 우리가 찾고 있는 주요 기술 요구사항과 일치합니다.</span>  
                    </div>
                    <div className='ai-summary-box__detail-item'>
                        <span className='ai-summary-box__item-label'>2. 경험과 성과</span>
                        <span className='ai-summary-box__item-text'>이 후보자는 유사한 프로젝트에서 뛰어난 성과를 보였으며, 이는 우리 팀의 혐재 프로젝트에 큰 기여를 할 수 있음을 시사합니다.</span>  
                    </div>
                    <div className='ai-summary-box__detail-item'>
                        <span className='ai-summary-box__item-label'>3. 문제 해결 능력</span>
                        <span className='ai-summary-box__item-text'>이 후보자는 과거 직무에서 복잡한 문제를 해결한 경험이 풍부하며, 우리 팀이 현재 직면한 문제에 대한 해결책을 제공할 수 있을 것으로 예상됩니다.</span>  
                    </div>
                    <div className='ai-summary-box__detail-item'>
                        <span className='ai-summary-box__item-label'>4. 팀워크 및 협업 능력</span>
                        <span className='ai-summary-box__item-text'>이 후보자는 다양한 팀 환경에서 탁월한 협업 능력을 보여주었습니다. 우리의 협업 중심 문화에 잘 어울립니다.</span>  
                    </div>
                </div>
            </div>
            
            {/* 기본 정보 섹션 */}
            <div className='report-info-section report-info-section--profile'>
                <span className='report-info-section__title report-info-section__name'>홍길동</span>
                <span className='report-info-section__detail'>남, 1991(33세)</span>
                <span className='report-info-section__detail'>hong1234@gmail.com</span>
                <span className='report-info-section__detail'>010-1234-5678</span>
                <span className='report-info-section__detail'>서울특별시 마포구 신촌로 4길 14, 4층</span>
            </div>
            
            {/* 자기소개 섹션 */}
            <div className='report-info-section report-info-section--intro'>
                <span className='report-info-section__title'>자기소개</span>
                <span className='divider'></span>
                <div className='report-info-section__content'>
                  <span>안녕하세요. 5년 8개월차 JAVA 개발자 홍길동입니다.</span>
                  <span> 안녕하세요. 5년 8개월차 JAVA 개발자 홍길동입니다.</span>
                  </div>
            </div>
            
            {/* 경력 섹션 */}
            <div className='report-info-section report-info-section--career'>
                <span className='report-info-section__title'>경력</span>
                <div className='report-info-section__career-item career-item'>
                    <span className='career-item__company-name'>(주)위드마인드</span>
                    <div className='career-item__duration-group'>
                        <span className='career-item__start-date'>2019.03 ~ </span>
                        <span className='career-item__status'>재직 중</span>
                    </div>
                    <span className='career-item__role'>JAVA 개발자ㆍ매니저</span>
                    <span className='career-item__description'>Spring Boot와 MySQL을 활용하여 안정적인 백엔드 시스템을 구축하고, API 응답 속도를 30% 향상시킴.
                        모놀리식 구조의 시스템을 MSA로 전환하여 확장성과 유지보수성을 개선하고, 배포 속도를 50% 단축.
                        CI/CD 파이프라인 자동화 구축.</span>
                </div>
                <div className='report-info-section__career-item career-item'>
                    <span className='career-item__company-name'>(주)마인드위드</span>
                    <div className='career-item__duration-group'>
                        <span className='career-item__start-date'>2019.03 ~ 2019.05 </span>
                    </div>
                    <span className='career-item__role'>JAVA 개발자ㆍ인턴</span>
                </div>
            </div>
        </div>

      </div>

    </div>
    </>
  )
}