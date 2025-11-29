// src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import { Icons } from "@/assets/icons";
import searchIcon from "@/assets/icons/size24/ic_search_gray900_24.png";
import bookmarkIcon from "@/assets/icons/size24/ic_bookmark_gray900_24.png";
import accountIcon from "@/assets/icons/size24/ic_account_circle_gray900_24.png";
import cancel from "@/assets/icons/size20/ic_cancel_gray400_20.png";

import ic_arrow_back_ios_gray900_20 from "@/assets/icons/size20/ic_arrow_back_ios_gray900_20.png";
import ic_search_gray900_20 from "@/assets/icons/size20/ic_search_gray900_20.png";


// ===============================================
// 검색 관련 타입 및 함수 (임시 정의)
// ===============================================
type Opt = { value: string; label: string };

function highlightSubstring(label: string, query: string): React.ReactNode {
  if (!query) return label;
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(q, "ig");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(label)) !== null) {
    const start = m.index,
      end = start + m[0].length;
    if (start > lastIndex)
      parts.push(<span key={lastIndex + "n"}>{label.slice(lastIndex, start)}</span>);
    parts.push(
      <span key={start + "h"} className="select-highlight">
        {label.slice(start, end)}
      </span>
    );
    lastIndex = end;
  }
  if (lastIndex < label.length)
    parts.push(<span key={lastIndex + "t"}>{label.slice(lastIndex)}</span>);
  return <>{parts}</>;
}

const options: Opt[] = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "frontend", label: "프론트엔드 개발자" },
    { value: "backend", label: "백엔드 개발" },
    { value: "mobile", label: "모바일 앱 개발" },
    { value: "designer", label: "웹 디자이너" },
    { value: "pm", label: "프로젝트 매니저" },
];
// ===============================================

interface NavbarProps {
  titleText?: string; // 로고 대신 표시할 텍스트 (선택 사항)
}


export default function Navbar({ titleText }: NavbarProps) {
  const [SearchOpen, setSearchOpen] = useState(false);
  const [mypageMenuOpen, setMypageMenuOpen] = useState(false);
  
  // 모바일 검색 입력 상태
  const [inputValue, setInputValue] = useState("");
  const [isSearchExecuted, setIsSearchExecuted] = useState(false); 

  const mypageRef = useRef<HTMLDivElement | null>(null);
  const searchPanelRef = useRef<HTMLDivElement | null>(null);
  
  // useLocation 훅 호출
  const location = useLocation();

  const toggleSearch = () => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (next) {
          setMypageMenuOpen(false);
          // 검색창 열 때 포커스 초기화
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
  
  // 모바일 검색 실행 핸들러 (Enter 키 처리 등)
  const handleSearch = () => {
    if (inputValue.trim()) {
      setIsSearchExecuted(true); 
      // 실제 검색 결과 페이지로 이동 로직이 여기에 필요함: navigate(`/search?q=${inputValue}`);
      console.log(`Navbar 검색 실행: ${inputValue}`);
    } else {
      setIsSearchExecuted(false);
      console.log('검색어가 없어 드롭다운 닫음');
    }
  };

  // 외부 클릭 감지 및 현재 경로 콘솔 출력 로직
  useEffect(() => {
    // 현재 경로 콘솔에 출력
    // console.log("현재 경로:", location.pathname);
    // /:잡콕로고
    // jobs:채용공고
    // resumes:이력서


    if (!mypageMenuOpen && !SearchOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement; 

      if (!target || typeof target.closest !== 'function') return;

      // 마이페이지 메뉴 닫기
      if (mypageMenuOpen && mypageRef.current && !mypageRef.current.contains(target)) {
        if (!(target.closest('.icon-btn') && target.closest('.login_on'))) {
            setMypageMenuOpen(false);
        }
      }
      if (SearchOpen && searchPanelRef.current && !searchPanelRef.current.contains(target)) {
        if (!(target.closest('.icon-btn') && target.closest('.login_on'))) {
            setSearchOpen(false);
            setInputValue(""); 
            setIsSearchExecuted(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mypageMenuOpen, SearchOpen, location.pathname]);

  return (
    <>
      <header className="masthead">
        <div className="masthead__inner">
            {titleText?(<>{titleText}</>):(<Link 
            className="masthead__brand"
            to="/">
              <img src={Icons.jobkok_logo_purple} alt="" />
              <img src={Icons.jobkok_wordmark_gray900} alt="" />
            </Link>)}
         
          

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

            <div className="mypage_icon" ref={mypageRef}>
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
        onClick={toggleSearch}
      />

      {/* 데스크톱 검색 패널 (search-panel) */}
      <div id="searchPanel" className={`search-panel ${SearchOpen ? "is-open" : ""}`}>
        <div className="panel-body">
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
              <button className="chip">프론트엔드
                <img src={Icons.ic_close_gray500_20} alt="" />
              </button>
              <button className="chip">프론트엔드 개발자
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
              <button className="chip">프론트엔드 개발자</button>
            </div>
          </section>
        </div>
      </div>


      {/* ======================================================= */}
      {/* 모바일 검색 패널 (수정 및 통합) */}
      {/* ======================================================= */}
      <div id="searchPanelMobile" className={`search-panel-mobile ${SearchOpen ? "is-open" : ""}`}>
        <div className="panel-body" ref={searchPanelRef}>
            <div className="panel-search-header">         
                    <img 
                    onClick={() => {
                      toggleSearch(); // 닫기
                      setIsSearchExecuted(false); // 드롭다운도 닫기
                      setInputValue(""); // 입력값 초기화
                  }}
                    src={ic_arrow_back_ios_gray900_20} alt="뒤로가기" className="panel-search-header__back-icon" />
                  <div className="panel-search">
                        <img className="panel-search__icon" src={ic_search_gray900_20} alt="검색" />
                
                    <input 
                        type="text" 
                        placeholder="직무, 기업명, 지역등을 입력해주세요"
                        value={inputValue}
                        onChange={(e) => {
                            const value = e.target.value;
                            setInputValue(value);
                            // 입력 시 드롭다운 펼치기
                            if (value.trim() !== "") {
                                setIsSearchExecuted(true); 
                            } else {
                                setIsSearchExecuted(false);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch(); // Enter 시 검색 실행
                        }}
                        className="panel-search__input"
                    />
                    {/* X 버튼 (입력값 있을 때만 표시) */}
                    {inputValue && (
                  
                            <img 
                            
                            onClick={() => {
                              setInputValue("");
                              setIsSearchExecuted(false);
                          }}
                            className="panel-search__clear-icon" src={cancel} alt="검색어 지우기" />
               
                    )}
                </div>
            </div>

            {/* 검색어 입력 및 실행 시 드롭다운 검색 결과 영역 */}
            {isSearchExecuted && inputValue && (
              <div className="search-results-dropdown-mobile">
                <div className="search-results-dropdown__list">
                  {options
                    .filter(opt => opt.label.toLowerCase().includes(inputValue.toLowerCase()))
                    .slice(0, 10) 
                    .map((option, index) => (
                      <span 
                        key={index} 
                        className="search-results-dropdown__item"
                      >
                        {highlightSubstring(option.label, inputValue)}
                      </span>
                    ))}
                </div>
              </div>
            )}
            
            {/* 검색 결과가 없을 때만 기존 섹션 표시 */}
            {(!isSearchExecuted || !inputValue) && (
                <>
                    <section className="panel-section">
                        <header className="section-head">
                        <span className="section-title">최근 검색어</span>
                        <button className="section-action">전체 삭제</button>
                        </header>
                        <div className="chip-list">
                        <button className="chip recent">프론트엔드
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
                        <button className="chip popular">프론트엔드 개발자</button>
                        </div>
                    </section>
                </>
            )}
        </div>
      </div>

    </>
  );
}