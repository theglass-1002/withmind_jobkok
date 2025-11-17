import React from 'react'
import { useNavigate } from "react-router-dom";
import ic_bell_gray900_24 from "@/assets/icons/size24/ic_bell_gray900_24.png";
import ic_search_white_20 from "@/assets/icons/size20/ic_search_white_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import "./AIMatching.css";
import AIMatchingResult from "./AIMatchingResult";

export default function AIMatching() {
  const navigate = useNavigate();


  return (
    <>
    <div className="company-dashboard-page">
      <div className="company-dashboard-header">
        <span className="company-dashboard-header__title">AI 인재 매칭</span>
        
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
      <div className='company-dashboard-main'>
      <div className="ai-matching-search-box">
        <span className="ai-matching-search-box__input-wrap">
          <input 
            type="text" 
            name="jobUrl" 
            placeholder='등록된 공고의 URL을 입력해 주세요.' 
            id="jobUrlInput" 
            className="ai-matching-search-box__input"
          />
        </span>
        <button className='default_btn_gray_800'>
          <img 
            src={ic_search_white_20} 
            alt="검색 아이콘" 
            className="ai-matching-search-box__icon" 
          />
          검색
        </button>
      </div>  
      <AIMatchingResult/>
      </div>

    </div>
    </>
  )
}