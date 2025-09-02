import { useState, useRef, UseEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlanEmpty from "./PlanEmpty";
import PlanHistroyBody from "./PlanHistroyBody";



export default function PlanHistory() {
    const navigate = useNavigate();

    return (
         <>
         <header className="mypage__content-header">
              <h2 className="title">이용권 내역</h2>
              <nav className="tabs" aria-label="계정 탭">
                <ul className="tabs__list" role="tablist">
                    
                </ul>
              </nav>
            </header> 
            <div className="mypage__content-main plan">
            {/* <PlanEmpty/>
          */}
            <section className="plan" >
            <div className="plan-current--active">
                <span className="plan-current__label">현재 사용 중 이용권</span>
                <span className="plan-current__until">7일 이용권 (2025.00.00 00:00까지)</span>
            </div>
            <div className="plan-history">
            <div className="plan-history__head plan-history__row">
                <span className="cell">NO</span>
                <span className="cell">이용권</span>
                <span className="cell">결제 금액</span>
                <span className="cell">결제 수단</span>
                <span className="cell">상태</span>
                <span className="cell">결제일시</span>
                <span className="cell cell--validity">유효기간/횟수</span>
            </div>
            <PlanHistroyBody/>
            </div>
            <div className="plan-info">
                    <span>※ 사용 이력이 없는 이용권의 경우, 구매일 기준 7일 이내 결제 취소가 가능합니다. (결제 취소는 고객센터로 문의 바랍니다.)</span>
                    <span> ※ 구매일 기준 7일이 지났거나, 일부 사용한 이용권의 환불은 고객센터로 문의 바랍니다.</span>
                </div>
            </section>
                <div className="btn_wrap">
                <button className="default_btn_black"
                 onClick={() => navigate("/purchase", { replace: true })}
                >이용권 구매</button>
                </div>
            </div>
          </>
    );
  }