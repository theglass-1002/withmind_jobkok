import { useState, useRef,useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "@/shared/components/tabs/Tabs";
import {useStickyTabs} from '@/shared/utils/util'; 
import search from '@/assets/icons/search.png';
import chevronDown from '@/assets/icons/chevron-down.png';
import chevronUp from '@/assets/icons/chevron-up.png';
import arrow_left from '@/assets/icons/keyboard_arrow_left.png';
import arrow_right from '@/assets/icons/keyboard_arrow_right.png';
import Pagination from "@/shared/components/Pagination";
import * as util from "@/shared/utils/util";
import "./Faq.css";


const FAQ_TABS = [
    { key: "all",     label: "전체" },
    { key: "howto",   label: "이용 방법" },
    { key: "account", label: "회원 정보" },
    { key: "payment", label: "결제" },
    { key: "etc",     label: "기타" },
  ];

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


const PAGE_SIZE = 10;

export default function Faq() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState("");
  const [tab, setTab] = useState<FaqTabKey>("all");

  const isTabsSticky = useStickyTabs(
    "sticky-trigger",
    ".default_tabs",
    ".page-header")

  const handleTabClick = (key: "all" | "howto" |"account"|"payment"|"etc") => {
    setTab(key);
  }


  useEffect(() => {
    setPage(1);
    setOpenIds(new Set());
  }, [tab, query]);


  const applySearch = () => {
    if(util.stripAllWhitespace(searchText.trim()).trim()!=""){
      console.log('검색');
      setQuery(util.stripAllWhitespace(searchText.trim()).trim());
    }
  };
  

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
          <div className="mypage__content-main faq-container">
          <header className="my-page_faq_header">
              <h1 className="faq-title">자주 묻는 질문</h1>
              <Tabs
                tabs={FAQ_TABS}
                active={tab}
                onChange={handleTabClick}
                className={`my-page_faq-tabs default_tabs ${isTabsSticky?'is-sticky':''}`}
           
                itemClassName="my-page-tabs__item"
                activeClassName="on"
                />
            </header> 
            <div className="search_field"> 
                <span className="icon-container"><img src={search} alt="" /></span>
                <input 
                type="search"
                value={searchText}
                onChange={(e)=> setSearchText(e.target.value)}
                placeholder="(엔터)검색어를 입력해 주세요."
                onKeyDown={(e) => {
                  const isIme = (e.nativeEvent as any)?.isComposing;
                  if (e.key === "Enter" && !isIme) applySearch();
                }}
                /> 
            </div>
            <div id="sticky-trigger" className="search_container-mobile">
            <div className="search_field"> 
                <span className="icon-container"><img src={search} alt="" /></span>
                <input 
                type="search"
                value={searchText}
                onChange={(e)=> setSearchText(e.target.value)}
                placeholder="(엔터)검색어를 입력해 주세요."
                onKeyDown={(e) => {
                  const isIme = (e.nativeEvent as any)?.isComposing;
                  if (e.key === "Enter" && !isIme) applySearch();
                }}
                /> 
            </div>
            </div>
      
            <div className="faq__list-container">
            {pageItems.length === 0 ? (
              <div className="faq__empty">검색 결과가 없습니다.</div>
            ) : (
              <ul className="faq__list">
                {pageItems.map((it) => {
                  const isOpen = openIds.has(it.id);
                  return (
                    <li className="faq__item" key={it.id}>
                      <div className="faq__question">
                        <em className="q_mark">Q</em>
                        <p className="q_text">[{labelOf(it.cat)}] {it.q}</p>
                        <span
                          className={`icon-container ${isOpen ? "on" : ""}`}
                          role="button"
                          aria-expanded={isOpen}
                          tabIndex={0}
                          onClick={() => toggle(it.id)}
                        >
                          <img src={isOpen ? chevronUp : chevronDown} alt="" />
                        </span>
                      </div>
                      <div className={`faq__answer ${isOpen ? "on" : ""}`}>
                        <em className="a_mark">A</em>
                        <p className="a_text">{it.a}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <Pagination 
            current={page}
            total={totalPages}
            onChange={setPage}
            pageWindow={5}
            prevIcon={<img src={arrow_left} alt="" aria-hidden="true" />}
            nextIcon={<img src={arrow_right} alt="" aria-hidden="true" />}
            />
            </div>
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

    