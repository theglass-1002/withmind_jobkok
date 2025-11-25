
import { useState } from "react";
import PlanCard from "./PlanCard";
import PaymentCard from "./PaymentCard";
import "./Purchase.css";
import credit_card from '@/assets/icons/credit_card.png';
import mobile from '@/assets/icons/mobile_2.png';
import money_range from '@/assets/icons/money_range.png';
import redeem from '@/assets/icons/redeem.png';
import naver_pay from '@/assets/icons/naver_pay.png';
import kakao_pay from '@/assets/icons/kakao_pay2.png';
import payco from '@/assets/icons/payco.png';
import samsung_pay from '@/assets/icons/samsung_pay.png';
import { useNavigate } from "react-router-dom";
type Plan = {
  id: string;
  name: string;
  price: number;      
  features: string[];
};

const PLANS: Plan[] = [
  { id: "p7",  name: "7일 이용권",  price: 2900, features:["공고 무제한 매칭","AI 모의면접","무제한 이용"] },
  { id: "p15", name: "15일 이용권", price: 5900, features:["공고 무제한 매칭","AI 모의면접","무제한 이용"] },
  { id: "p3",  name: "3회 이용권",  price: 2900, features:["공고 무제한 매칭","AI 모의면접","무제한 이용"] },
];

const METHODS = [
  { id: "card",    label: "신용/체크카드", icon: credit_card },
  { id: "mobile",  label: "휴대폰 결제",   icon: mobile },
  { id: "transfer",label: "계좌이체",     icon: money_range },
  { id: "gift",    label: "상품권",        icon: redeem },
  { id: "naver",   label: "네이버페이",    icon: naver_pay },
  { id: "kakao",   label: "카카오페이",    icon: kakao_pay },
  { id: "payco",   label: "페이코",        icon: payco },
  { id: "samsung", label: "삼성페이",      icon: samsung_pay },
] as const;

// 2) 단일 아이템 타입
export type Method = typeof METHODS[number];


export default function PurchaseLayout() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[0]);
  const [selectedMethod, setSelectedMethod] = useState<Method>(METHODS[0]);
  const [agreed, setAgreed] = useState(false);
  const [errorAgreed, setErrorAgreed] = useState(true);
  const [submit, setSubmit] = useState(false);
  

  const onSelectMethod = (m: Method) => setSelectedMethod(m);
  
  
  const  handlePaySubmit = async () => {
    setSubmit(true);
    setErrorAgreed(agreed);
    if(agreed&&submit){
      console.log('동의랑 전송 모두 true');
      console.log(`agr:${agreed} --sub:${submit}`);
      navigate("/purchase/result/success", { replace: true })
    } 
  };

  


  return (
    <>
      <div className="purchase purchase__container">
        <header className="header">
          <h1 className="title">이용권 구매</h1>
        </header>
        <div className="body purchase__grid">
          <div className="purchase__main">
            <section className="box plans" aria-labelledby="plans-title">
              <h1 id="plans-title" className="title">이용권 선택</h1>
              <ul className="plans__grid" role="list">
              {PLANS.map(p => (
                <PlanCard
                  key={p.id}
                  plan={p}
                  active={selectedPlan.id === p.id}
                  onSelect={setSelectedPlan}
                />
              ))}
              </ul>
            </section>
            <section className="box payment" aria-labelledby="payment-title">
              <h1 id="payment-title" className="title">결제 수단</h1>
              <ul className="payment__methods" role="list">
              {METHODS.map((m) => (
                <PaymentCard
                  key={m.id}
                  method={m}
                  active={selectedMethod.id === m.id}
                  onSelect={onSelectMethod}
                />
              ))}
              </ul>
            </section>
            <section className="box notice" aria-labelledby="notice-title">
              <h1 id="notice-title" className="title">구매 전 반드시 확인해 주세요.</h1>
              <div className={`notice__agree ${errorAgreed}`}>
                <input className="check-box" checked={agreed} type="checkbox"onChange={(e)=> {
                  setAgreed(e.target.checked)
                  setErrorAgreed(e.target.checked)
               
                }}
                required />
                <span className="notice__agree-text">
                  <em className="badge badge--required">(필수)</em>
                  아래 유의사항 및 결제 진행에 동의합니다.
                </span>
            </div>
            <ul className="notice__list">
            <li>1. 구매하신 이용권은 PC 버전의 MY 정보 &gt; 이용권 내역 &gt; 결제 내역에서 확인할 수 있습니다.</li>
              <li>2. 본 이용권은 부가세 10% 포함가입니다.</li>
             <li>3. 사용 이력이 없는 이용권에 대해서는 구매일 기준 7일 이내 청약철회가 가능합니다.</li> 
              <li> 4. 사용 이력이 없더라도 청약철회 기한 이후에는 환불수수료 차감 후 환불됩니다.</li> 
             <li>5. 구매 후 일부 미사용한 이용권에 대해서는 환불이 가능하며, 환불 시 환불 수수료(10% 또는 1,000원 중 큰 금액)를
                  제외한 나머지 금액이 환불됩니다. 단, 잔액이 1,000원 이하인 경우 환불이 불가합니다.</li> 
              <li>6. 체험 이벤트, 광고성 이벤트 등 회사가 무료로 지급한 이용권은 환불되지 않습니다.</li>    
               <li>7. 미성년자가 법정대리인 동의 없이 체결한 경우, 미성년자 또는 법정대리인이 이를 취소할 수 있습니다.</li>
               <li>8. 자세한 내용은 유료서비스 이용약관에서 확인할 수 있습니다.</li>
            </ul>
            </section>
          </div>
            <aside className="purchase__aside" aria-label="결제 정보">
            <div className="summary__info">
            <h1 id="pay-summary-title" className="title">결제 정보</h1>
              <div className="summary__row">
                <span className="summary__label">선택 이용권</span>
                <span className="summary__value">{selectedPlan.name}</span>
              </div>
              <div className="summary__row">
                  <span className="summary__label">이용권 금액</span>
                  <span className="summary__value">{selectedPlan.price.toLocaleString("ko-KR")}원</span>
                </div>
            </div>
          <div className="summary__total">
            <div className="summary__row">
            <span className="summary__total-label">최종 결제 금액</span>
            <span className="summary__total-value">{selectedPlan.price.toLocaleString("ko-KR")}원</span>
            </div>
            <button type="button" className="summary__submit btn btn--primary" onClick={handlePaySubmit}>결제하기</button>
            </div>
          </aside>
        </div>
      </div>
      <div className="purchase purchase__container mobile">
        <div className="body purchase__grid">
          <div className="purchase__main">
         
            <section className="box plans" aria-labelledby="plans-title">
            <span className="plan_title">이용권 선택</span>    
              <ul className="plans__grid" role="list">
              {PLANS.map(p => (
                <PlanCard
                  key={p.id}
                  plan={p}
                  active={selectedPlan.id === p.id}
                  onSelect={setSelectedPlan}
                />
              ))}
              </ul>
            </section>
            <section className="box payment" aria-labelledby="payment-title">
              <h1 id="payment-title" className="title">결제 수단</h1>
              <ul className="payment__methods" role="list">
              {METHODS.map((m) => (
                <PaymentCard
                  key={m.id}
                  method={m}
                  active={selectedMethod.id === m.id}
                  onSelect={onSelectMethod}
                />
              ))}
              </ul>
            </section>
            <section className="box notice" aria-labelledby="notice-title">
              <h1 id="notice-title" className="title">구매 전 반드시 확인해 주세요.</h1>
              <div className={`notice__agree ${errorAgreed}`}>
                <input className="check-box" checked={agreed} type="checkbox"onChange={(e)=> {
                  setAgreed(e.target.checked)
                  setErrorAgreed(e.target.checked)
               
                }}
                required />
                <span className="notice__agree-text">
                  <em className="badge badge--required">(필수)</em>
                  아래 유의사항 및 결제 진행에 동의합니다.
                </span>
            </div>
            <ul className="notice__list">
            <li>1. 구매하신 이용권은 PC 버전의 MY 정보 &gt; 이용권 내역 &gt; 결제 내역에서 확인할 수 있습니다.</li>
              <li>2. 본 이용권은 부가세 10% 포함가입니다.</li>
             <li>3. 사용 이력이 없는 이용권에 대해서는 구매일 기준 7일 이내 청약철회가 가능합니다.</li> 
              <li> 4. 사용 이력이 없더라도 청약철회 기한 이후에는 환불수수료 차감 후 환불됩니다.</li> 
             <li>5. 구매 후 일부 미사용한 이용권에 대해서는 환불이 가능하며, 환불 시 환불 수수료(10% 또는 1,000원 중 큰 금액)를
                  제외한 나머지 금액이 환불됩니다. 단, 잔액이 1,000원 이하인 경우 환불이 불가합니다.</li> 
              <li>6. 체험 이벤트, 광고성 이벤트 등 회사가 무료로 지급한 이용권은 환불되지 않습니다.</li>    
               <li>7. 미성년자가 법정대리인 동의 없이 체결한 경우, 미성년자 또는 법정대리인이 이를 취소할 수 있습니다.</li>
               <li>8. 자세한 내용은 유료서비스 이용약관에서 확인할 수 있습니다.</li>
            </ul>
            </section>
          </div>
            <aside className="purchase__aside" aria-label="결제 정보">
            <div className="summary__info">
            <h1 id="pay-summary-title" className="title">결제 정보</h1>
              <div className="summary__row">
                <span className="summary__label">선택 이용권</span>
                <span className="summary__value">{selectedPlan.name}</span>
              </div>
              <div className="summary__row">
                  <span className="summary__label">이용권 금액</span>
                  <span className="summary__value">{selectedPlan.price.toLocaleString("ko-KR")}원</span>
                </div>
            </div>
          <div className="summary__total">
            <div className="summary__row">
            <span className="summary__total-label">최종 결제 금액</span>
            <span className="summary__total-value">{selectedPlan.price.toLocaleString("ko-KR")}원</span>
            </div>
             </div>
          </aside>
          <span className="summary__actions">
          <button type="button" className="btn_w_full default_btn_black " onClick={handlePaySubmit}>결제하기</button>
        
          </span>

        </div>
      </div>
      </>
  );
  }
  