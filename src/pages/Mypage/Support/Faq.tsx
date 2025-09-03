import { useState, useRef, UseEffect } from "react";
import { useNavigate } from "react-router-dom";
import search from '@/assets/icons/search.png';
import chevronDown from '@/assets/icons/chevron-down.png';
import chevronUp from '@/assets/icons/chevron-up.png';

import "./Faq.css";


const FAQ_TABS = [
    { key: "all",     label: "전체" },
    { key: "howto",   label: "이용 방법" },
    { key: "account", label: "회원 정보" },
    { key: "payment", label: "결제" },
    { key: "etc",     label: "기타" },
  ] as const;

type FaqTabKey = typeof FAQ_TABS[number]["key"];
type FaqItem = { q: string; a: string };

const ITEMS: FaqItem[] = [
  { q: "[이용방법] 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?", a: "아니요" },
  { q: "[결제] 결제 영수증을 어디서 확인할 수 있나요?", a: "마이페이지 > 이용권 내역에서 확인하세요." },
  { q: "[기타] 문의는 어디로 하면 되나요?", a: "고객지원 1:1 문의를 이용해 주세요." },
];


export default function Faq() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<FaqTabKey>("all");
    const [open, setOpen] = useState<Record<number, boolean>>({ 0: false }); // 첫 항목 열림

    const toggle = (i: number) =>
        setOpen((s) => ({ ...s, [i]: !s[i] }));
    

    return (
         <>
         <header className="mypage__content-header">
              <h1 className="title">자주 묻는 질문</h1>
              <nav className="tabs" aria-label="계정 탭">
                <ul className="tabs__list" role="tablist">
                  {FAQ_TABS.map(t =>(
                    <li key={t.key}
                    className={`tabs__item${tab===t.key?"-is-active":""}`}
                    role="tab"
                    aria-selected={tab === t.key}
                    tabIndex={tab===t.key?0:-1}
                    onClick={()=> setTab(t.key)}
                    >
                        {t.label}
                   </li>
                ))}
                  {/* <li className={`tabs__item${tab=='profile'?'-is-active':''}`} onClick={()=>handleTabSelect("profile")}>
                    전체
                  </li>
                  <li className={`tabs__item${tab=='password'?'-is-active':''}`} onClick={()=>handleTabSelect("password")}>
                    이용 방법
                  </li>
                  <li className={`tabs__item${tab=='profile'?'-is-active':''}`} onClick={()=>handleTabSelect("profile")}>
                    회원 정보
                  </li>
                  <li className={`tabs__item${tab=='password'?'-is-active':''}`} onClick={()=>handleTabSelect("password")}>
                    결제
                  </li>
                  <li className={`tabs__item${tab=='password'?'-is-active':''}`} onClick={()=>handleTabSelect("password")}>
                    기타
                  </li> */}
                </ul>
              </nav>
            </header> 
        
          <div className="mypage__content-main faq-container">
            <div className="search_field"> 
                <span className="icon-container"><img src={search} alt="" /></span>
                <input placeholder="(엔터)검색어를 입력해 주세요." type="text"/> 
            </div>
           
              <ul className="faq__list">
               {ITEMS.map((it, i)=>{
                const isOpen = !!open[i];
                return (
                    <li className="faq__item" key={i}>
                    <div className="faq__question">
                        <em className="q_mark">Q</em>
                        <p className="q_text">{it.q}</p>
                         <span className={`icon-container ${isOpen ? "on" :""}`} 
                         onClick={()=>toggle(i)}>
                            <img src={isOpen ? chevronUp : chevronDown} alt="" />
                         </span>
                       </div>
                    <div className={`faq__answer ${isOpen ?"on":""}`}>
                    <em className="a_mark">A</em>
                         <p className="a_text">{it.a}</p> 
                    </div>
                   </li>
                );
               })}
               {/* {tab==="all" && <div>전체리스트</div>}
              {tab==="howto" && <div>이용방법 리스트</div>}
              {tab==="account" && <div>회원 정보 리스트 </div>}
              {tab==="payment" && <div>결제 리스트 </div>}
              {tab==="etc" && <div>기타 리스트 </div>} */}
              </ul>
        
          </div>
          </>
    );
  }
