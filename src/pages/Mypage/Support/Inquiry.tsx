import { useState, useRef,useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import search from '@/assets/icons/search.png';
import chevronDown from '@/assets/icons/chevron-down.png';
import chevronUp from '@/assets/icons/chevron-up.png';
import arrow_left from '@/assets/icons/keyboard_arrow_left.png';
import arrow_right from '@/assets/icons/keyboard_arrow_right.png';
import Pagination from "@/shared/components/Pagination";


import "./Inquiry.css";


const FAQ_TABS = [
    { key: "all",     label: "전체" },
    { key: "howto",   label: "이용 방법" },
    { key: "account", label: "회원 정보" },
    { key: "payment", label: "결제" },
    { key: "etc",     label: "기타" },
  ] as const;

  type FaqTabKey = typeof FAQ_TABS[number]["key"];
  type Category = Exclude<FaqTabKey, "all">;
  

type FaqItem = {
  id: string;          
  cat: Category;       
  q: string;
  a: string;
};

const ITEMS: FaqItem[] = [
  { id: "1", cat: "howto",   q: "1모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?", a: "아니요." },
  { id: "2", cat: "payment", q: "2결제 영수증은 어디에서 확인하나요?",                      a: "마이페이지 > 이용권 내역에서 확인 가능합니다." },
  { id: "3", cat: "etc",     q: "3문의는 어디로 하면 되나요?",                              a: "고객지원 1:1 문의를 이용해 주세요." },
  { id: "4", cat: "account", q: "4이메일을 변경할 수 있나요?",                              a: "보안상 고객센터로 문의해 주세요." },
  { id: "5", cat: "howto",   q: "5모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?", a: "아니요." },
  { id: "6", cat: "payment", q: "6결제 영수증은 어디에서 확인하나요?",                      a: "마이페이지 > 이용권 내역에서 확인 가능합니다." },
  { id: "7", cat: "etc",     q: "7문의는 어디로 하면 되나요?",                              a: "고객지원 1:1 문의를 이용해 주세요." },
  { id: "8", cat: "account", q: "8이메일을 변경할 수 있나요?",                              a: "보안상 고객센터로 문의해 주세요." },
  { id: "9", cat: "howto",   q: "9모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?", a: "아니요." },
  { id: "10", cat: "payment", q: "10결제 영수증은 어디에서 확인하나요?",                      a: "마이페이지 > 이용권 내역에서 확인 가능합니다." },
  { id: "11", cat: "etc",     q: "11문의는 어디로 하면 되나요?",                              a: "고객지원 1:1 문의를 이용해 주세요." },
  { id: "12", cat: "account", q: "12이메일을 변경할 수 있나요?",                              a: "보안상 고객센터로 문의해 주세요." },
  { id: "13", cat: "howto",   q: "13모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?", a: "아니요." },
  { id: "14", cat: "payment", q: "14결제 영수증은 어디에서 확인하나요?",          a: "마이페이지 > 이용권 내역에서 확인 가능합니다." },
  { id: "15", cat: "account", q: "15이메일을 변경할 수 있나요?",                              a: "보안상 고객센터로 문의해 주세요." },
  { id: "16", cat: "howto",   q: "16모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?", a: "아니요." },
  { id: "17", cat: "payment", q: "17결제 영수증은 어디에서 확인하나요?",          a: "마이페이지 > 이용권 내역에서 확인 가능합니다." },
  { id: "18", cat: "howto",   q: "18모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?", a: "아니요." },
  { id: "19", cat: "howto", q: "19결제 영수증은 어디에서 확인하나요?",          a: "마이페이지 > 이용권 내역에서 확인 가능합니다." },
  

];


const PAGE_SIZE = 5;

export default function Inquiry() {
  const [tab, setTab] = useState<FaqTabKey>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setPage(1);
    setOpenIds(new Set());
  }, [tab, query]);

  // 필터링
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ITEMS.filter((it) => {
      const byTab = tab === "all" ? true : it.cat === tab;
      const byQuery = q
        ? it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)
        : true;
      return byTab && byQuery;
    });
  }, [tab, query]);

  // 페이징
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  // 아코디언 토글
  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });


    return (
        <>
        <header className="mypage__content-header">
             <h2 className="title">1:1 문의</h2>
           </header> 
           <section className="mypage__content-main inquiry-container" >
           <div className="inquiry-history">
           <div className="inquiry-history__head">
            <span className="inquiry-history__cell inquiry-history__cell--title">제목</span>
            <span className="inquiry-history__cell inquiry-history__cell--date">작성일</span>
            <span className="inquiry-history__cell inquiry-history__cell--status">답변 상태</span>
          </div>
          <div className="inquiry-history__body">
            <div className="inquiry-history__body-list">
            <span className="inquiry-history__cell inquiry-history__cell--title">
                [이용 방법] 모의면접을 다시 보거나 삭제할 수 있나요?
              </span>
              <span className="inquiry-history__cell inquiry-history__cell--date">2025.00.00</span>
              <span className="inquiry-history__cell inquiry-history__cell--status is-pending">문의접수</span>
            </div>
          </div>
           </div>
           </section>
           <div>
            <button>버튼</button>
           </div>
      
         </>
    );
  }


function labelOf(cat: Category) {
  switch (cat) {
    case "howto":
      return "이용 방법";
    case "account":
      return "회원 정보";
    case "payment":
      return "결제";
    case "etc":
      return "기타";
  }
}

        {/* {tab==="all" && <div>전체리스트</div>}
              {tab==="howto" && <div>이용방법 리스트</div>}
              {tab==="account" && <div>회원 정보 리스트 </div>}
              {tab==="payment" && <div>결제 리스트 </div>}
              {tab==="etc" && <div>기타 리스트 </div>} */}