import { NavLink } from "react-router-dom";
import "./JobsList.css";


export default function JobsList() {
  type Category = { id: string; title: string };

  const items2: Category[] = [
    { id: "1", title: "개발" },
    { id: "2", title: "마케팅광고" },
    { id: "3", title: "경영 비즈니스 " },
    { id: "4", title: "디자인" },
  ];
  
  return (
   <>
   <div className="center">
    <div className="jobs-head">
        <h1 className="jobs-title">채용 공고</h1>
        <p className="jobs-sub-title">이력서를 등록하고 나에게 맞는 공고만 골라주는 AI추천 시작해보세요!!</p>
    </div>
    <div className="jobs-search">
        <label className="searchbar__toggle sw" htmlFor="ai-switch">
          <span className="toggle__text">이력서 기반 추천</span>
          <input id="ai-switch" className="sw__input" type="checkbox" defaultChecked />
          <span className="sw__trk"><span className="sw__th" /></span>
        </label>
        <form role="search" className="searchbar">
        <input className="search-input" placeholder="검색어 입력" type="search" />
        <button type="submit" className="searchbar__submit" aria-label="검색">
      <img src='/src/assets/icons/search_icon.png' alt="" width="18" height="18" />
    </button>
        </form>
        <div className="jobs-filters" role="group" aria-label="검색 필터">
        <div className="filter">
          <button className="filter-btn" data-key="exp">경력</button>
          <ul className="filter__menu">{/* ... */}</ul>
        </div>
        <div className="filter">
          <button className="filter-btn" data-key="loc">지역</button>
          <ul className="filter__menu">{/* ... */}</ul>
        </div>
        <div className="filter">
          <button className="filter-btn" data-key="role">직무</button>
          <ul className="filter__menu">{/* ... */}</ul>
        </div>
        <div className="filter">
          <button className="filter-btn" data-key="sort">채용유형</button>
          <ul className="filter__menu">{/* ... */}</ul>
        </div>
      </div>
    </div>
    <div className="jobs-results">
      {/* 탭 헤더 (고정) */}
      <div className="jobs-results__tabs">
        <ul className="tabs" role="tablist" >
          <li className="tabs__item">
            <NavLink
              to=""
              end      
              role="tab" className={({ isActive }) => `tabs__link ${isActive ? "on" : ""}`}
              id="tab-all"
            >
              전체공고(179,252)
            </NavLink>
          </li>
          <li className="tabs__item">
            <NavLink
              to="bookmarks"
              role="tab"
              className={({ isActive }) => `tabs__link ${isActive ? "on" : ""}`}
              id="tab-bookmarks"
            >
              북마크(9)
            </NavLink>
          </li>
        </ul>
      </div>
       <div>
       <ul>
        {items2.map(job => (
          <li key={job.id}>{job.title}</li>  
        ))}
      </ul>
    </div>
            {/* <Outlet />  */}
    </div>
    </div>
   </>
  );
}
