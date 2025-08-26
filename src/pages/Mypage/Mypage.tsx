import { Link, NavLink } from "react-router-dom";
import "./MyPage.css";

export default function MyPage() {
    return (
      <main className="mypage">
        <div className="container mypage__container">
          <header className="mypage__header">
            <h1 className="mypage__title">마이페이지</h1>
          </header>
  
          <div className="mypage__body">
            <aside className="mypage__sidebar" aria-label="마이페이지 메뉴">
              <nav className="sidemenu">
                <div className="user_info">
                    <span className="user_name">홍길동 님</span>
                    <div className="user_contact">
                    <span>hong1234@withmind.net</span>
                    <span>010-1234-5678</span>
                    </div>
                    <span className="usercard__plan">

                    <p>7일 이용권</p>
                    </span>
                    <span>회원 정보 수정 </span>
                </div>
                <ul className="sidemenu__list">
                  <li className="sidemenu__item">
                    
                  </li>
                  <li className="sidemenu__item">
                    <Link className="sidemenu__link" to="/support">고객지원</Link>
                  </li>
                  <li className="sidemenu__item">
                    <button type="button" className="sidemenu__link sidemenu__logout">로그아웃</button>
                  </li>
                </ul>
              </nav>
            </aside>
  
            <section className="mypage__content" aria-labelledby="mypage-main">
              <h2 id="mypage-main" className="vh">메인 콘텐츠</h2>
              내용
            </section>
          </div>
        </div>
      </main>
    );
  }