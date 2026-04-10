import React from 'react'
import { useNavigate } from "react-router-dom";
import ic_bell_gray900_24 from "@/assets/icons/size24/ic_bell_gray900_24.png";
import ic_search_white_20 from "@/assets/icons/size20/ic_search_white_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import ic_arrow_up_right_gray900_20 from "@/assets/icons/size20/ic_arrow_up_right_gray900_20.png";

import "./MatchHistory.css";
export default function MatchHistory() {
  const navigate = useNavigate();
  return (
    <>
    <div className="company-dashboard-page">
      <div className="company-dashboard-header">
        <span className="company-dashboard-header__title">매칭 히스토리</span>
        
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
        <div className='history-controls-bar'>
              <div className='history-controls-bar__filter'>
                  <div className='history-controls-bar__filter-label'>전체공고
                      <img src={ic_arrow_drop_down_gray900_24} alt="드롭다운 아이콘" className='history-controls-bar__dropdown-icon' />
                  </div>
              </div>
              
              {/* 검색 입력 및 버튼 */}
              <div className='history-controls-bar__search'>
                  <input type="text" placeholder='검색어 입력' name="" id="" className='history-controls-bar__search-input' />
                  <button className='history-controls-bar__search-button default_btn_gray_800'>
                    <img 
                      src={ic_search_white_20} 
                      alt="검색 아이콘" 
                      className="history-controls-bar__search-icon" 
                    />
                    검색
                  </button>
              </div>
          </div>
          <div className= 'match-historyt-list'>
          <div className='match-history-table__header match-history-table__row'>
            <div className='match-history-table__col match-history-table__col--name'>이름</div>          
            <div className='match-history-table__col match-history-table__col--job'>채용공고</div>
            <div className='match-history-table__col match-history-table__col--rate'>적합률</div>
            <div className='match-history-table__col match-history-table__col--ai-status'>AI 면접</div>
            <div className='match-history-table__col match-history-table__col--date'>등록일</div>
            <div className='match-history-table__col match-history-table__col--action'></div>                             
          </div>
          <div className='match-history-table__item match-history-table__row'>
            <div className='match-history-table__col match-history-table__col--name'>위위</div>          
            <div className='match-history-table__col match-history-table__col--job'>직방 Development Manager</div>
            <div className='match-history-table__col match-history-table__col--rate'>92%</div>
            <div className='match-history-table__col match-history-table__col--ai-status on'>
              <span>공개</span>
            </div>
            <div className='match-history-table__col match-history-table__col--date'>2025.12.10</div>
            <div className='match-history-table__col match-history-table__col--action'>
              <button className='match-history-table__action-button default_btn_white'
                   onClick={()=>{navigate('/company/ai-matching/report/1')}}
              >자세히 보기
              <img src={ic_arrow_up_right_gray900_20} alt="" />
              </button>
            </div>                             
          </div>
          <div className='match-history-table__item match-history-table__row'>
            <div className='match-history-table__col match-history-table__col--name'>이택진</div>          
            <div className='match-history-table__col match-history-table__col--job'>직방 backend developer</div>
            <div className='match-history-table__col match-history-table__col--rate'>60%</div>
            <div className='match-history-table__col match-history-table__col--ai-status on'>
              <span>공개</span>
            </div>
            <div className='match-history-table__col match-history-table__col--date'>2025.11.13</div>
            <div className='match-history-table__col match-history-table__col--action'>
              <button className='match-history-table__action-button default_btn_white'
                   onClick={()=>{navigate('/company/ai-matching/report/2')}}
              >자세히 보기
              <img src={ic_arrow_up_right_gray900_20} alt="" />
              </button>
            </div>                             
          </div>
          <div className='match-history-table__item match-history-table__row'>
            <div className='match-history-table__col match-history-table__col--name'>임서하</div>          
            <div className='match-history-table__col match-history-table__col--job'>직방 full stack developer/퍼블리셔</div>
            <div className='match-history-table__col match-history-table__col--rate'>80%</div>
            <div className='match-history-table__col match-history-table__col--ai-status on'>
              <span>공개</span>
            </div>
            <div className='match-history-table__col match-history-table__col--date'>2025.12.05</div>
            <div className='match-history-table__col match-history-table__col--action'>
              <button className='match-history-table__action-button default_btn_white'
                   onClick={()=>{navigate('/company/ai-matching/report/3')}}
              >자세히 보기
              <img src={ic_arrow_up_right_gray900_20} alt="" />
              </button>
            </div>                             
          </div>
          </div>
        
      </div>

    </div>
    </>
  )
}
