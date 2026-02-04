import { useState, useMemo, useEffect } from "react";
import Tabs from "@/shared/components/tabs/Tabs";
import { useStickyTabs } from "@/shared/utils/util";
import arrow_left from "@/assets/icons/keyboard_arrow_left.png";
import arrow_right from "@/assets/icons/keyboard_arrow_right.png";
import Pagination from "@/shared/components/Pagination";
import * as util from "@/shared/utils/util";
import faqData from "@/data/faq.json";
import "./Faq.css";

const FAQ_TABS = [
  { key: "all", label: "전체" },
  { key: "howTo", label: "이용방법" },
  { key: "memberInfo", label: "회원정보" },
  { key: "resume", label: "이력서" },
  { key: "jobPosting", label: "채용공고" },
  { key: "aiMockInterview", label: "AI모의면접" },
  { key: "other", label: "기타" },
] as const;

type FaqTabKey = (typeof FAQ_TABS)[number]["key"];
type Category = Exclude<FaqTabKey, "all">;

type FaqItem = {
  id: string;
  category: Category;
  question: string;
  answer: string;
};

type RawFaqItem = {
  id: number | string;
  category: Category;
  question: string;
  answer: string;
};

const PAGE_SIZE = 10;

// ✅ JSON -> 화면에서 쓸 형태로 변환 (id string 보장)
const ITEMS: FaqItem[] = (faqData as RawFaqItem[]).map((item) => ({
  id: String(item.id),
  category: item.category,
  question: item.question,
  answer: item.answer,
}));

export default function Faq() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState("");
  const [tab, setTab] = useState<FaqTabKey>("all");

  const isTabsSticky = useStickyTabs(
    "sticky-trigger",
    ".default_tabs",
    ".page-header"
  );

  const handleTabClick = (key: FaqTabKey) => {
    setTab(key);
  };

  useEffect(() => {
    setPage(1);
    setOpenIds(new Set());
  }, [tab, query]);

  const applySearch = () => {
    const normalized = util.stripAllWhitespace(searchText.trim()).trim();
    // 기존 코드처럼 "빈 검색어면 적용 안 함" 유지
    if (normalized !== "") setQuery(normalized);
  };

  // 필터링
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return ITEMS.filter((item) => {
      const byTab = tab === "all" ? true : item.category === tab;
      const byQuery = q
        ? item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
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
            tabs={FAQ_TABS as any}
            active={tab}
            onChange={handleTabClick as any}
            className={`my-page_faq-tabs default_tabs ${
              isTabsSticky ? "is-sticky" : ""
            }`}
            itemClassName="my-page-tabs__item"
            activeClassName="on"
          />
        </header>

        <div className="my-page_faq_wrap">
          {/* PC 검색 */}
          <div className="search_field">
            <span className="icon-container" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="검색어를 입력해 주세요."
              onKeyDown={(e) => {
                const isIme = (e.nativeEvent as any)?.isComposing;
                if (e.key === "Enter" && !isIme) applySearch();
              }}
            />
          </div>

          {/* 모바일 sticky 검색 */}
          <div id="sticky-trigger" className="search_container-mobile">
            <div className="search_field">
              <span className="icon-container" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="검색어를 입력해 주세요."
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
                {pageItems.map((item) => {
                  const isOpen = openIds.has(item.id);
                  return (
                    <li className="faq__item" key={item.id}>
                      <div className="faq__question">
                        <em className="q_mark">Q</em>
                        <p className="q_text">
                          [{getCategoryLabel(item.category)}] {item.question}
                        </p>
                        <span
                          className={`icon-container ${isOpen ? "on" : ""}`}
                          role="button"
                          aria-expanded={isOpen}
                          tabIndex={0}
                          onClick={() => toggle(item.id)}
                        />
                      </div>

                      <div className={`faq__answer ${isOpen ? "on" : ""}`}>
                        <em className="a_mark">A</em>
                        <p className="a_text">{item.answer}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
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
      </div>

            
    </>
  );
}

function getCategoryLabel(category: Category) {
  switch (category) {
    case "howTo":
      return "이용방법";
    case "memberInfo":
      return "회원정보";
    case "resume":
      return "이력서";
    case "jobPosting":
      return "채용공고";
    case "aiMockInterview":
      return "AI 모의면접";
    case "other":
      return "기타";
    default:
      return "";
  }
}
