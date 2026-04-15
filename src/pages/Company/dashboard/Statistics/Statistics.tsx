import React from 'react'
import ic_bell_gray900_24 from "@/assets/icons/size24/ic_bell_gray900_24.png";
import ic_search_white_20 from "@/assets/icons/size20/ic_search_white_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import ic_arrow_up_right_gray900_20 from "@/assets/icons/size20/ic_arrow_up_right_gray900_20.png";
import { Storage } from "@/shared/utils/StorageManager";

import "./Statistics.css";

export default function Statistics() {
  const companyName = Storage.getCompanyName();

  return (
    <>
     <div className="company-dashboard-page">
      <div className="company-dashboard-header">
        <span className="company-dashboard-header__title">통계</span>
        
        <div className="company-dashboard-header__actions">
          <div className="company-dashboard-header__notification">
            <img 
              src={ic_bell_gray900_24} 
              alt="알림" 
              className="company-dashboard-header__icon" 
            />
          </div>
          <div className="company-dashboard-header__info">
            <span className="company-dashboard-header__company-name">
            {companyName || "-"}</span>
            <img src={ic_arrow_drop_down_gray900_24} alt="" />
          </div>
        </div>       
      </div> 
      <div className='company-dashboard-main'>
      <div className='statistics-controls-bar'>
            
              {/* 검색 입력 및 버튼 */}
              <div className='statistics-controls-bar__search'>
                  <input type="text" placeholder='검색어 입력' name="" id="" className='statistics-controls-bar__search-input' />
                  <button className='statistics-controls-bar__search-button default_btn_gray_800'>
                    <img 
                      src={ic_search_white_20} 
                      alt="검색 아이콘" 
                      className="statistics-controls-bar__search-icon" 
                    />
                    검색
                  </button>
              </div>
          </div>
      </div>
    </div>
    </>
  )
}
