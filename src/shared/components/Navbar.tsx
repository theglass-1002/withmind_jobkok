import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { Icons } from "@/assets/icons";

import ic_arrow_back_ios_gray900_20 from "@/assets/icons/size20/ic_arrow_back_ios_gray900_20.png";
import ic_search_gray900_20 from "@/assets/icons/size20/ic_search_gray900_20.png";

import { isLoggedIn, logout } from "@/api/auth/auth.api";

type Opt = { value: string; label: string };

function highlightSubstring(label: string, query: string): React.ReactNode {
  if (!query) return label;
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(q, "ig");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(label)) !== null) {
    const start = m.index;
    const end = start + m[0].length;
    if (start > lastIndex) {
      parts.push(<span key={lastIndex + "n"}>{label.slice(lastIndex, start)}</span>);
    }
    parts.push(
      <span key={start + "h"} className="select-highlight">
        {label.slice(start, end)}
      </span>
    );
    lastIndex = end;
  }
  if (lastIndex < label.length) {
    parts.push(<span key={lastIndex + "t"}>{label.slice(lastIndex)}</span>);
  }
  return <>{parts}</>;
}

const options: Opt[] = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "frontend", label: "프로젝트 기획자" },
  { value: "backend", label: "백엔드 개발" },
  { value: "mobile", label: "모바일 앱 개발" },
  { value: "designer", label: "웹 디자이너" },
  { value: "pm", label: "프로젝트 매니저" },
];

interface NavbarProps {
  titleText?: string;
}

export default function Navbar({ titleText }: NavbarProps) {
  const [SearchOpen, setSearchOpen] = useState(false);
  const [mypageMenuOpen, setMypageMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [isSearchExecuted, setIsSearchExecuted] = useState(false);

  const mypageRef = useRef<HTMLDivElement | null>(null);
  const searchPanelRef = useRef<HTMLDivElement | null>(null);
  const searchPanelDesktopRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleSearch = () => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        setMypageMenuOpen(false);
        setIsSearchExecuted(false);
        setInputValue("");
      }
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

  const handleSearch = () => {
    if (inputValue.trim()) {
      setIsSearchExecuted(true);
      console.log(`Navbar 검색 실행: ${inputValue}`);
    } else {
      setIsSearchExecuted(false);
      console.log("검색어가 없어 드롭다운 닫음");
    }
  };

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setMypageMenuOpen(false);
  };

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    if (!mypageMenuOpen && !SearchOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target || typeof target.closest !== "function") return;

      if (mypageMenuOpen && mypageRef.current && !mypageRef.current.contains(target)) {
        if (!(target.closest(".icon-btn") && (target.closest(".login_on") || target.closest(".login_off")))) {
          setMypageMenuOpen(false);
        }
      }

      if (SearchOpen) {
        const inMobile = searchPanelRef.current?.contains(target) ?? false;
        const inDesktop = searchPanelDesktopRef.current?.contains(target) ?? false;

        if (!inMobile && !inDesktop) {
          if (!(target.closest(".icon-btn") && (target.closest(".login_on") || target.closest(".login_off")))) {
            setSearchOpen(false);
            setInputValue("");
            setIsSearchExecuted(false);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.pathname, mypageMenuOpen, SearchOpen]);

  return (
    <>
      <header className="masthead">
        <div className="masthead__inner">
          {titleText ? (
            <>{titleText}</>
          ) : (
            <Link className="masthead__brand" to="/">
              <img src={Icons.jobkok_logo_gray900} alt="" />
              <img src={Icons.jobkok_wordmark_gray900} alt="" />
            </Link>
          )}

          <ul className="masthead__menu">
            <li>
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/jobs") ? "on" : undefined
                }
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/jobs", { state: { activeTab: "all" } });
                }}
              >
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

          {loggedIn ? (
            <div className="login_on">
              <img
                className="icon-btn"
                aria-expanded={SearchOpen}
                aria-controls="searchPanel"
                onClick={toggleSearch}
                src={Icons.ic_search_gray900_24}
                alt=""
              />

              <NavLink to="/saved-jobs">
                <img src={Icons.ic_bookmark_gray900_24} alt="" />
              </NavLink>

              <div className="mypage_icon" ref={mypageRef}>
                <img
                  className="icon-btn"
                  onClick={toggleMypage}
                  aria-haspopup="menu"
                  aria-expanded={mypageMenuOpen}
                  src={Icons.ic_account_circle_gray900_24}
                  alt=""
                />

                <div className={`mypage-menu ${mypageMenuOpen ? "is-open" : ""}`} role="menu">
                  <NavLink to="/mypage" onClick={() => setMypageMenuOpen(false)}>
                    마이페이지
                  </NavLink>
                  <NavLink to="/mypage/support/faq" onClick={() => setMypageMenuOpen(false)}>
                    고객 지원
                  </NavLink>
                  <NavLink to="/mypage/support/report-job" onClick={() => setMypageMenuOpen(false)}>
                    공고 제보하기
                  </NavLink>
                  <NavLink to="/login" onClick={handleLogout}>
                    로그아웃
                  </NavLink>
                </div>
              </div>
            </div>
          ) : (
            <div className="login_off">
              <span
                className="icon-btn"
                aria-expanded={SearchOpen}
                aria-controls="searchPanel"
                onClick={toggleSearch}
              >
                <img src={Icons.ic_search_gray900_24} alt="" />
              </span>
              <NavLink to="/login">
                <div className="auth-cta">
                  <span>로그인 / 회원가입</span>
                </div>
              </NavLink>
            </div>
          )}
        </div>
      </header>

      <div className={`backdrop ${SearchOpen ? "is-open" : ""}`} onClick={toggleSearch} />

      <div id="searchPanel" className={`search-panel ${SearchOpen ? "is-open" : ""}`}>
        <div className="panel-body" ref={searchPanelDesktopRef}>
          <div className="panel-search">
            <img className="jobs-search__icon" src={Icons.ic_search_gray900_20} alt="" />
            <input type="text" placeholder="직무, 기업명, 지역등을 입력해주세요" />
            <img className="jobs-search__clear_icon" src={Icons.ic_cancel_gray400_20} alt="" />
          </div>

          <section className="panel-section">
            <header className="section-head">
              <span className="section-title">최근 검색어</span>
              <button className="section-action">전체 삭제</button>
            </header>
            <div className="chip-list">
              <button className="chip">
                프론트엔드
                <img src={Icons.ic_close_gray500_20} alt="" />
              </button>
              <button className="chip">
                프로젝트 기획자
                <img src={Icons.ic_close_gray500_20} alt="" />
              </button>
            </div>
          </section>

          <section className="panel-section">
            <header className="section-head">
              <span className="section-title">인기 키워드</span>
            </header>
            <div className="chip-list">
              <button className="chip">프론트엔드</button>
              <button className="chip">프로젝트 기획자</button>
            </div>
          </section>
        </div>
      </div>

      <div id="searchPanelMobile" className={`search-panel-mobile ${SearchOpen ? "is-open" : ""}`}>
        <div className="panel-body" ref={searchPanelRef}>
          <div className="panel-search-header">
            <img
              onClick={() => {
                toggleSearch();
                setIsSearchExecuted(false);
                setInputValue("");
              }}
              src={ic_arrow_back_ios_gray900_20}
              alt="뒤로가기"
              className="panel-search-header__back-icon"
            />
            <div className="panel-search">
              <img className="panel-search__icon" src={ic_search_gray900_20} alt="검색" />

              <input
                type="text"
                placeholder="직무, 기업명, 지역등을 입력해주세요"
                value={inputValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputValue(value);
                  if (value.trim() !== "") {
                    setIsSearchExecuted(true);
                  } else {
                    setIsSearchExecuted(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="panel-search__input"
              />
              {inputValue && (
                <img
                  onClick={() => {
                    setInputValue("");
                    setIsSearchExecuted(false);
                  }}
                  className="panel-search__clear-icon"
                  src={Icons.ic_cancel_gray400_20}
                  alt="검색어 지우기"
                />
              )}
            </div>
          </div>

          {isSearchExecuted && inputValue && (
            <div className="search-results-dropdown-mobile">
              <div className="search-results-dropdown__list">
                {options
                  .filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase()))
                  .slice(0, 10)
                  .map((option, index) => (
                    <span key={index} className="search-results-dropdown__item">
                      {highlightSubstring(option.label, inputValue)}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {(!isSearchExecuted || !inputValue) && (
            <>
              <section className="panel-section">
                <header className="section-head">
                  <span className="section-title">최근 검색어</span>
                  <button className="section-action">전체 삭제</button>
                </header>
                <div className="chip-list">
                  <button className="chip recent">
                    프론트엔드
                    <img src={Icons.ic_close_gray500_20} alt="" />
                  </button>
                </div>
              </section>

              <section className="panel-section">
                <header className="section-head">
                  <span className="section-title">인기 검색 키워드</span>
                </header>
                <div className="chip-list">
                  <button className="chip popular">프론트엔드</button>
                  <button className="chip popular">프로젝트 기획자</button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
