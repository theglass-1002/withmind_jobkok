import { useState, useRef,useMemo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Pagination from "@/shared/components/Pagination";
import arrow_left from '@/assets/icons/keyboard_arrow_left.png';
import arrow_right from '@/assets/icons/keyboard_arrow_right.png';
import search from '@/assets/icons/search.png';


type InquiryCategory = "howto" | "account" | "payment" | "etc";



type FaqItem = {
  id: string;
  cat: InquiryCategory;     // 카테고리 추가
  title: string;
  date: string;             // "2025.00.00"
  status: "pending" | "answered" | "hold";
};

const ITEMS: FaqItem[] = [
  { id: "1", cat: "howto",   title: "2025년 상반기부터 서비스 가격 정상화 안내", date: "2025.00.00",status:"pending" },
  { id: "2", cat: "payment", title: "2결제 영수증은 어디에서 확인하나요?",                     date: "2025.00.00",status:"pending" },
  { id: "3", cat: "etc",     title: "3문의는 어디로 하면 되나요?",                           date: "2025.00.00",status:"answered" },
  { id: "4", cat: "account", title: "4이메일을 변경할 수 있나요?",                             date: "2025.00.00",status:"answered"},
  { id: "5", cat: "howto",   title: "5모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?",  date: "2025.00.00",status:"answered" },
  { id: "6", cat: "payment", title: "6결제 영수증은 어디에서 확인하나요?",                       date: "2025.00.00",status:"answered" },
  { id: "7", cat: "etc",     title: "7문의는 어디로 하면 되나요?",                              date: "2025.00.00",status:"answered"},
  { id: "8", cat: "account", title: "8이메일을 변경할 수 있나요?",                               date: "2025.00.00",status:"answered" },
  { id: "9", cat: "howto",   title: "9모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?", date: "2025.00.00",status:"hold" },
  { id: "10", cat: "payment", title: "10결제 영수증은 어디에서 확인하나요?",                    date: "2025.00.00",status:"hold" },
  { id: "11", cat: "etc",     title: "11문의는 어디로 하면 되나요?",                             date: "2025.00.00",status:"hold" },

];


const PAGE_SIZE = 10;


function labelOfStatus(s: FaqItem["status"]) {
  return s === "pending" ? "문의접수" : s === "answered" ? "답변완료" : "보류";
}
function statusClass(s: FaqItem["status"]) {
  return s === "pending" ? "is-pending" : s === "answered" ? "is-answered" : "is-hold";
}

function labelOfCat(c: InquiryCategory) {
  return c === "howto" ? "이용 방법"
       : c === "account" ? "회원 정보"
       : c === "payment" ? "결제"
       : "기타";
}
function catClass(c: InquiryCategory) {
  return `is-${c}`; // 예: is-howto, is-account...
}



export default function NoticeList() {
  const [page, setPage] = useState(1);

  // 페이징 (필터링 없이 전체 ITEMS 기준)
  const totalPages = Math.max(1, Math.ceil(ITEMS.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = ITEMS.slice(start, start + PAGE_SIZE);;



    return (
        <div className="notice">
        <header className="mypage__content-header">
             <h2 className="title">공지사항</h2>
           </header> 
        <section className="mypage__content-main notice-container" >
        <div className="mypage__top_search_field"> 
                <span className="icon-container"><img src={search} alt="" /></span>
                <input 
                type="search"
         
                onChange={(e)=> setSearchText(e.target.value)}
                placeholder="검색어를 입력해 주세요."
                onKeyDown={(e) => {
                  const isIme = (e.nativeEvent as any)?.isComposing;
                  if (e.key === "Enter" && !isIme) applySearch();
                }}
                /> 
            </div>
           <div className="mypage__table">
           <div className="head">
           <span className="cell--num">NO</span>
            <span className="cell--title">제목</span>
            <span className="cell--date">작성일</span>
          </div>
          <div className="body">
           <ul className="body-list">
            {pageItems.map((r)=>(
              <NavLink to='2'  key={r.id} className="cell__item">
              <li className="">
              <span className="cell--num">00</span>
              <span className="cell--title start">
                  <span>[공지]</span>
                  {r.title}
                  </span>
               <span className="cell--date">{r.date}</span>
               </li>
              </NavLink> 
            ))}
      
           </ul>
          </div>
           </div>
           <Pagination 
            current={page}
            total={totalPages}
            onChange={setPage}
            pageWindow={5}
            prevIcon={<img src={arrow_left} alt="" aria-hidden="true" />}
            nextIcon={<img src={arrow_right} alt="" aria-hidden="true" />}
            />
           </section>  
         
      
         </div>
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