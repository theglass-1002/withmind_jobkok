import { useState } from "react";
import { NavLink } from "react-router-dom";
import Pagination from "@/shared/components/Pagination";
import arrow_left from '@/assets/icons/keyboard_arrow_left.png';
import arrow_right from '@/assets/icons/keyboard_arrow_right.png';
import search from '@/assets/icons/search.png';

// 공지사항 항목 타입 정리
type NoticeItem = {
  id: string;
  title: string;
  date: string; // "YYYY.MM.DD"
};

// 불필요한 필터링/문의 관련 필드(cat, status) 제거
const ITEMS: NoticeItem[] = [
  { id: "1", title: "2025년 상반기부터 서비스 가격 정상화 안내", date: "2025.00.00" },
  { id: "2", title: "2결제 영수증은 어디에서 확인하나요?", date: "2025.00.00" },
  { id: "3", title: "3문의는 어디로 하면 되나요?", date: "2025.00.00" },
  { id: "4", title: "4이메일을 변경할 수 있나요?", date: "2025.00.00" },
  { id: "5", title: "5모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?", date: "2025.00.00" },
  { id: "6", title: "6결제 영수증은 어디에서 확인하나요?", date: "2025.00.00" },
  { id: "7", title: "7문의는 어디로 하면 되나요?", date: "2025.00.00" },
  { id: "8", title: "8이메일을 변경할 수 있나요?", date: "2025.00.00" },
  { id: "9", title: "9모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?", date: "2025.00.00" },
  { id: "10", title: "10결제 영수증은 어디에서 확인하나요?", date: "2025.00.00" },
  { id: "11", title: "11문의는 어디로 하면 되나요?", date: "2025.00.00" },
];

const PAGE_SIZE = 10;

export default function NoticeList() {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

   const applySearch = () => {
    // 실제 검색 로직이 여기에 들어갈 수 있음
    console.log(`Searching for: ${searchText}`);

  };

  // 페이징 (현재는 전체 ITEMS 기준)
  const totalPages = Math.max(1, Math.ceil(ITEMS.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = ITEMS.slice(start, start + PAGE_SIZE);

  return (
    <div className="notice">
      <header className="mypage__content-header">
        <h2 className="title">공지사항</h2>
      </header>
      <section className="mypage__content-main notice-container" >
        {/* 검색 필드 */}
        <div className="mypage__top_search_field">
          <span className="icon-container"><img src={search} alt="검색" /></span>
          <input
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="검색어를 입력해 주세요."
            onKeyDown={(e) => {
              const isIme = (e.nativeEvent as any)?.isComposing;
              if (e.key === "Enter" && !isIme) applySearch();
            }}
          />
        </div>
        {/* 테이블 */}
        <div className="mypage__table">
          <div className="head">
            <span className="cell--num">NO</span>
            <span className="cell--title">제목</span>
            <span className="cell--date">작성일</span>
          </div>
          <div className="body">
            <ul className="body-list">
              {pageItems.map((r, index) => (
                // 실제 공지 상세 페이지 경로로 변경 필요. 임시로 '2' 유지.
                <NavLink to={r.id} key={r.id} className="cell__item">
                  <li>
                    <span className="cell--num">{ITEMS.length - start - index}</span> {/* 역순으로 번호 매기기 */}
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
        {/* 페이지네이션 */}
        <Pagination
          current={page}
          total={totalPages}
          onChange={setPage}
          pageWindow={5}
          prevIcon={<img src={arrow_left} alt="이전 페이지" aria-hidden="true" />}
          nextIcon={<img src={arrow_right} alt="다음 페이지" aria-hidden="true" />}
        />
      </section>
    </div>
  );
}