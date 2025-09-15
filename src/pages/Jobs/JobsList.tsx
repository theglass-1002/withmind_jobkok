import { NavLink } from "react-router-dom";
import keyboard_arrow_right from '@/assets/icons/chevron_right_white.png';
import "./Jobs.css";


export default function JobsList() {

  
  return (
    <>
      <div className="jobs-top-padding"> {/* 헤더(고정 72px) 아래 공간 확보 */}
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

          <div className="jobs-search-header">
            <div className="jobs-search">
              <input type="text" name="" id="" placeholder="직무,기업명,지역 등을 입력해 주세요."/>
              <div className="filter"></div>
            </div>

            <div className="jobs-tabs" role="tablist" aria-label="공고 탭">
              <button type="button" className="jobs-tab is-active" role="tab" aria-selected="true">
                전체공고
              </button>
              <button type="button" className="jobs-tab" role="tab" aria-selected="false">
                저장공고
              </button>
            </div>
          </div>
   
      </div>
    </>


  );
}
