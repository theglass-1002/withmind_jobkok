// src/pages/Mypage/Plan/components/PlanEmpty.tsx
import { Link } from "react-router-dom";

export default function PlanEmpty() {
  return (
     <>
         <section className="plan plan--empty" aria-labelledby="plan-empty-title">
                <div className="plan-empty">
                <h2 id="plan-empty-title" className="plan-empty__title">이용권 내역이 없습니다.</h2>
                <p className="plan-empty__desc">
                    지금 바로 이용권을 구매하고 AI 모의면접, 공고 무제한 매칭 등의 서비스를 경험해 보세요.
                </p>
                </div>
               
                <div className="plan-info">
                    <span>※ 사용 이력이 없는 이용권의 경우, 구매일 기준 7일 이내 결제 취소가 가능합니다. (결제 취소는 고객센터로 문의 바랍니다.)</span>
                    <span> ※ 구매일 기준 7일이 지났거나, 일부 사용한 이용권의 환불은 고객센터로 문의 바랍니다.</span>
                </div>
         </section>
     </>
  );
}
