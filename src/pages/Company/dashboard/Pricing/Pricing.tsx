import React from 'react'
import ic_bell_gray900_24 from "@/assets/icons/size24/ic_bell_gray900_24.png";
import ic_search_white_20 from "@/assets/icons/size20/ic_search_white_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import ic_warning_20 from "@/assets/icons/size20/ic_warning_20.png";
import "./Pricing.css";
export default function Pricing() {
  return (
    <>
    <div className="company-dashboard-page">
    <div className="company-dashboard-header">
        <span className="company-dashboard-header__title">이용권</span>
        
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
        <div className='pricing-controls-bar'>
              <div className='pricing-controls-bar__search'>
                  <button className='pricing-controls-bar__search-button default_btn_gray_800'>
                  이용권구매
                  </button>
              </div>
          </div>
          <div className='pricing-current-info'>
            <span className='pricing-current-info__label'>현재 이용중인 이용권 :</span>
            <span className='pricing-current-info__detail'>일주일 이용권 _ 2023년 08월 30일 14시 20분 까지</span>
        </div>
        <div className='pricing-history-table'>
        <div className='pricing-history-table__header pricing-history-table__row'>
            <div className='pricing-history-table__col pricing-history-table__col--no'>NO</div>
            <div className='pricing-history-table__col pricing-history-table__col--name'>이용권</div>
            <div className='pricing-history-table__col pricing-history-table__col--amount'>결제금액</div>
            <div className='pricing-history-table__col pricing-history-table__col--method'>결제수단</div>
            <div className='pricing-history-table__col pricing-history-table__col--status'>현재상태</div>
            <div className='pricing-history-table__col pricing-history-table__col--paid-at'>결제일시</div>
            <div className='pricing-history-table__col pricing-history-table__col--validity'>유효기간/횟수</div>
        </div>
        <div className='pricing-history-table__item pricing-history-table__row'>
            <div className='pricing-history-table__col pricing-history-table__col--no'>4</div>
            <div className='pricing-history-table__col pricing-history-table__col--name'>100명 인재 매칭!</div>
            <div className='pricing-history-table__col pricing-history-table__col--amount'>129,000</div>
            <div className='pricing-history-table__col pricing-history-table__col--method'>신용카드</div>
            <div className='pricing-history-table__col pricing-history-table__col--status'>사용중</div>
            <div className='pricing-history-table__col pricing-history-table__col--paid-at'>2025.02.01</div>
            <div className='pricing-history-table__col pricing-history-table__col--validity'>2025.02.01</div>
        </div>
        <div className='pricing-history-table__item pricing-history-table__row'>
            <div className='pricing-history-table__col pricing-history-table__col--no'>4</div>
            <div className='pricing-history-table__col pricing-history-table__col--name'>100명 인재 매칭!</div>
            <div className='pricing-history-table__col pricing-history-table__col--amount'>129,000</div>
            <div className='pricing-history-table__col pricing-history-table__col--method'>신용카드</div>
            <div className='pricing-history-table__col pricing-history-table__col--status'>사용중</div>
            <div className='pricing-history-table__col pricing-history-table__col--paid-at'>2025.02.01</div>
            <div className='pricing-history-table__col pricing-history-table__col--validity'>2025.02.01</div>
        </div>
        <div className='pricing-history-table__item pricing-history-table__row'>
            <div className='pricing-history-table__col pricing-history-table__col--no'>4</div>
            <div className='pricing-history-table__col pricing-history-table__col--name'>100명 인재 매칭!</div>
            <div className='pricing-history-table__col pricing-history-table__col--amount'>129,000</div>
            <div className='pricing-history-table__col pricing-history-table__col--method'>신용카드</div>
            <div className='pricing-history-table__col pricing-history-table__col--status'>사용중</div>
            <div className='pricing-history-table__col pricing-history-table__col--paid-at'>2025.02.01</div>
            <div className='pricing-history-table__col pricing-history-table__col--validity'>2025.02.01</div>
        </div>
        </div>
        <div className='pricing-notice-section'>
            <div className='pricing-notice-section__title'>
              <img src={ic_warning_20} alt="" />
              유의사항 안내</div>
            <div className='pricing-notice-section__content'>
                <span className='pricing-notice-section__item'>
                1. 사용 이력이 없는 이용권의 경우 구매일 기준 7일 이내 결제취소가 가능합니다. (결제취소는 고객센터로 문의 바랍니다.)
                </span>
                <span className='pricing-notice-section__item'>2. 7일 기한이 지났거나, 일부 사용한 이용권의 환불은 고객센터를 통해 문의 바랍니다.</span>
            </div>
        </div>
      </div> 
    </div>
    </>
  )
}
