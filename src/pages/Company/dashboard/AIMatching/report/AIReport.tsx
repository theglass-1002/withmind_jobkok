import React,{useState}from 'react'
import { useNavigate } from "react-router-dom";
import ic_bell_gray900_24 from "@/assets/icons/size24/ic_bell_gray900_24.png";
import ic_search_white_20 from "@/assets/icons/size20/ic_search_white_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import AIAnalysisSection from "./AIAnalysisSection";
import ResumeSection from "./ResumeSection";
import { Tab } from 'react-bootstrap';

type Tab = 'RESUME' | 'AI_ANALYSIS';

export default function AIReport() {

  const [activeTab, setActiveTab] = useState<Tab>('RESUME');
  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };

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
      
        <div className='report-tab-nav'>
          <div className='report-tab-nav__container'>
          <span 
                className={`report-tab-nav__item ${activeTab === 'RESUME' ? 'on' : ''}`}
                onClick={() => handleTabClick('RESUME')}
              >
                이력서
              </span>
              <span 
                className={`report-tab-nav__item ${activeTab === 'AI_ANALYSIS' ? 'on' : ''}`}
                onClick={() => handleTabClick('AI_ANALYSIS')}
              >
                AI분석
              </span>
          </div>
      </div>
        {activeTab=='RESUME'?<ResumeSection/>:<AIAnalysisSection/>}
      </div>
    </div>
    </>
  )
}