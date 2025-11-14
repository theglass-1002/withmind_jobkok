// src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

import jobkokLogo from "@/assets/icons/logo/ic_jobkok_logo_nav.png";
import searchIcon from "@/assets/icons/size24/ic_search_gray900_24.png";
import bookmarkIcon from "@/assets/icons/size24/ic_bookmark_gray900_24.png";
import accountIcon from "@/assets/icons/size24/ic_account_circle_gray900_24.png";
import cancel from "@/assets/icons/size20/ic_cancel_gray400_20.png";

export default function Navbar() {
  const [SearchOpen, setSearchOpen] = useState(false);
  const [mypageMenuOpen, setMypageMenuOpen] = useState(false);

  const mypageRef = useRef<HTMLDivElement | null>(null);
  const searchPanelRef = useRef<HTMLDivElement | null>(null); // searchRef 대신 searchPanelRef 사용

  const toggleSearch = () => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (next) setMypageMenuOpen(false);
      return next;
    });
  };

  const toggleMypage = () => {
    setMypageMenuOpen((prev) => {
      const next = !prev;
      if (next) setSearchOpen(false);
      return next;
    });
  };
  // 외부 클릭 감지 로직
  // 외부 클릭 감지 로직
  useEffect(() => {
    if (!mypageMenuOpen && !SearchOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // 💡 수정: event.target을 HTMLElement로 캐스팅하여 closest() 메서드를 사용할 수 있게 합니다.
      const target = event.target as HTMLElement; 

      // target이 유효하고 closest 메서드가 존재할 때만 계속 진행합니다.
      if (!target || typeof target.closest !== 'function') return;

      // 마이페이지 메뉴 닫기
      if (mypageMenuOpen && mypageRef.current && !mypageRef.current.contains(target)) {
        // 검색 버튼을 클릭해서 닫히는 경우는 제외
        if (!(target.closest('.icon-btn') && target.closest('.login_on'))) {
            setMypageMenuOpen(false);
        }
      }

      // 검색 패널 닫기 (searchPanelRef에 ref를 적용하여 사용)
      if (SearchOpen && searchPanelRef.current && !searchPanelRef.current.contains(target)) {
        // 검색 버튼을 클릭해서 닫히는 경우는 제외
        if (!(target.closest('.icon-btn') && target.closest('.login_on'))) {
            setSearchOpen(false);
        }
      }
      
      // 참고: backdrop 클릭 시 이미 setSearchOpen(false)가 호출되므로 이 로직은 searchPanel의 콘텐츠 바깥 클릭을 주로 처리합니다.
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mypageMenuOpen, SearchOpen]); // 의존성 배열에 상태 추가

  return (
    <>
      <header className="masthead">
        <div className="masthead__inner">
          <h1 className="masthead__brand">
            <Link to="/">
              <img src={jobkokLogo} alt="" />
            </Link>
          </h1>

          <ul className="masthead__menu">
            <li>
              <NavLink to="/jobs" className={({ isActive }) => (isActive ? "on" : undefined)}>
                채용공고
              </NavLink>
            </li>
            <li>
              <NavLink to="/resumes" className={({ isActive }) => (isActive ? "on" : undefined)}>
                이력서
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/mock-interview-report"
                className={({ isActive }) => (isActive ? "on" : undefined)}
              >
                모의면접
              </NavLink>
            </li>
          </ul>

          <div className="login_on">
            <span
              className="icon-btn"
              aria-expanded={SearchOpen}
              aria-controls="searchPanel"
              onClick={toggleSearch}
            >
              <img src={searchIcon} alt="" />
            </span>

            <NavLink to="/saved-jobs">
              <img src={bookmarkIcon} alt="" />
            </NavLink>

            <div className="mypage" ref={mypageRef}>
              <span
                className="icon-btn"
                onClick={toggleMypage}
                aria-haspopup="menu"
                aria-expanded={mypageMenuOpen}
              >
                <img src={accountIcon} alt="" />
              </span>

              <div className={`mypage-menu ${mypageMenuOpen ? "is-open" : ""}`} role="menu">
                <NavLink to="/mypage" onClick={() => setMypageMenuOpen(false)}>
                  마이페이지
                </NavLink>
                <NavLink to="/mypage/plan/history" onClick={() => setMypageMenuOpen(false)}>
                  이용권
                </NavLink>
                <NavLink to="/mypage/support/faq" onClick={() => setMypageMenuOpen(false)}>
                  고객 지원
                </NavLink>
                <NavLink to="/mypage/support/report-job" onClick={() => setMypageMenuOpen(false)}>
                  공고 제보하기
                </NavLink>
                <NavLink to="/settings" onClick={() => setMypageMenuOpen(false)}>
                  로그아웃
                </NavLink>
              </div>
            </div>
          </div>

          <div className="login_off">
            <span
              className="icon-btn"
              aria-expanded={SearchOpen}
              aria-controls="searchPanel"
              onClick={toggleSearch}
            >
              <img src={searchIcon} alt="" />
            </span>
            <NavLink to="/login">
              <div className="auth-cta">
                <span>로그인 / 회원가입</span>
              </div>
            </NavLink>
          </div>
        </div>
      </header>

      <div
        className={`backdrop ${SearchOpen ? "is-open" : ""}`}
        onClick={() => setSearchOpen(false)}
      />

      <div id="searchPanel" className={`search-panel ${SearchOpen ? "is-open" : ""}`}>
        <div className="panel-body" ref={searchPanelRef}>
          <div className="panel-search">
            <span className="jobs-search__icon">
              <img src={searchIcon} alt="" />
            </span>
            <input type="text" placeholder="직무, 기업명, 지역등을 입력해주세요" />
            <img className="jobs-search__clear_icon" src={cancel} alt="" />
          </div>

          <section className="panel-section">
            <header className="section-head">
              <span className="section-title">최근 검색어</span>
              <button className="section-action">전체 삭제</button>
            </header>
            <div className="chip-list">
              <button className="chip">프론트엔드</button>
              <button className="chip">프론트엔드 개발자</button>
            </div>
          </section>

          <section className="panel-section">
            <header className="section-head">
              <span className="section-title">인기 키워드</span>
            </header>
            <div className="chip-list">
              <button className="chip">프론트엔드</button>
              <button className="chip">프론트엔드 개발자</button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
