import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import jobkokLogo from '@/assets/icons/jobkok_logo.png';
import searchIcon from '@/assets/icons/search.png';
import bookmarkIcon from '@/assets/icons/bookmark.png';
import accountIcon from '@/assets/icons/account_circle.png';
import cancel from '@/assets/icons/cancel.png';



export default function Navbar() {

  const [SearchOpen, setSearchOpen] = useState(false);
  const [mypageMenuOpen, setMypageMenuOpen] = useState(false);


  const toggleSearch = () => {
    setSearchOpen(prev => {
      const next = !prev;
      if (next) setMypageMenuOpen(false); // 검색 열릴 때 마이페이지 닫기
      return next;
    });
  };
  
  const toggleMypage = () => {
    setMypageMenuOpen(prev => {
      const next = !prev;
      if (next) setSearchOpen(false); // 마이페이지 열릴 때 검색 닫기
      return next;
    });
  };

  return (
    <>
      <header className="masthead">
        <div className="masthead__inner">
          <h1 className="masthead__brand">
            <Link to="/" aria-label="홈으로">
              <img src={jobkokLogo} alt="" />
            </Link>
          </h1>

          <ul className="masthead__menu">
              <li><NavLink to="/jobs" className={({isActive}) => isActive ? "on" : undefined}>채용공고</NavLink></li>
              <li><NavLink to="/resumes" className={({isActive}) => isActive ? "on" : undefined}>이력서</NavLink></li>
              <li><NavLink to="/mock-interview" className={({isActive}) => isActive ? "on" : undefined}>모의면접</NavLink></li>
            </ul>
          <div className="login_on">
            <span
              className="icon-btn"
          
              aria-expanded={SearchOpen}
              aria-controls="filterPanel"
              onClick={toggleSearch}
            >
              <img src={searchIcon} alt="" />
            </span>
            <NavLink to="/"><img src={bookmarkIcon} alt="" /></NavLink>
            <div className="mypage" >
              <span
                className="icon-btn"
                onClick={toggleMypage}
                aria-haspopup="menu"
                aria-expanded={mypageMenuOpen}
                aria-controls="mypageMenu"
              >
                <img src={accountIcon} alt="" />
              </span>
              <div
                  id="mypageMenu"
                  className={`mypage-menu ${mypageMenuOpen ? "is-open" : ""}`}
                  role="menu"
                >
                  <NavLink
                    role="menuitem"
                    to="/mypage"
                    className={({ isActive }) => (isActive ? "is-active" : undefined)}
                    onClick={() => setMypageMenuOpen(false)}
                  >
                    마이페이지
                  </NavLink>

                  <NavLink
                    role="menuitem"
                    to="/mypage/plan/history"
                    className={({ isActive }) => (isActive ? "is-active" : undefined)}
                    onClick={() => setMypageMenuOpen(false)}
                  >
                    이용권
                  </NavLink>

                  <NavLink
                    role="menuitem"
                    to="/mypage/support/faq"
                    className={({ isActive }) => (isActive ? "is-active" : undefined)}
                    onClick={() => setMypageMenuOpen(false)}
                  >
                    고객 지원
                  </NavLink>

                  <NavLink
                    role="menuitem"
                    to="/mypage/support/report-job"
                    className={({ isActive }) => (isActive ? "is-active" : undefined)}
                    onClick={() => setMypageMenuOpen(false)}
                  >
                    공고 제보하기
                  </NavLink>

                  <NavLink
                    role="menuitem"
                    to="/settings"
                    className={({ isActive }) => (isActive ? "is-active" : undefined)}
                    onClick={() => setMypageMenuOpen(false)}
                  >
                    로그아웃
                  </NavLink>
                </div>

            </div>

          </div>

          <div className="login_off">
          <span
              className="icon-btn"
          
              aria-expanded={SearchOpen}
              aria-controls="filterPanel"
              onClick={toggleSearch}
            >
              <img src={searchIcon} alt="" />
            </span>
            <NavLink to="/login" >
            <div className="auth-cta">
              <span>로그인 / 회원가입</span>
          </div>   
            </NavLink>
         
          </div>
        </div>
      </header>
     <div className={`backdrop ${SearchOpen ? 'is-open' : ''}`} onClick={() => setSearchOpen(false)} />
      <div
        id="searchPanel"
        className={`search-panel ${SearchOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="panel-body">
          <div className="panel-search">
          <span className="jobs-search__icon">
              <img src={searchIcon} alt="" />
              </span>
            <input type="text" placeholder="직무, 기업명, 지역등을 입력해주세요" />
            <span className="jobs-search__clear_icon">
               <img src={cancel} alt="" />
               </span>
          </div>

          <section className="panel-section">
            <header className="section-head">
              <span className="section-title">최근 검색어</span>
              <button type="button" className="section-action">전체 삭제</button>
            </header>
            <div className="chip-list">
              <button className="chip">프론트엔드</button>
              <button className="chip">프론트엔드 개발자</button>
            </div>
          </section>

          <section className="panel-section">
            <header className="section-head">
              <span className="section-title">인기 검색 키워드</span>
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
