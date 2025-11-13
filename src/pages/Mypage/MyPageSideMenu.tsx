import { Link, NavLink } from "react-router-dom";
import calendar_today from '@/assets/icons/calendar_today.png';
import "./MyPage.css";


const GROUPS = [
  {
    id: "plan",
    label: "이용권",
    items: [
      { to: "plan/history",  label: "이용권 내역" },
      { to: "/purchase", label: "이용권 구매" }, 
    ],
  },
  {
    id: "support",
    label: "고객 지원",
    items: [
      { to: "support/faq",        label: "자주 묻는 질문" },
      { to: "support/inquiry",    label: "1:1 문의" },
      { to: "support/notices",    label: "공지사항" },
      { to: "support/report-job", label: "공고 제보하기" },
    ],
  },
  
];


export default function MyPageSideMenu() {
    return (
     <>
      <aside className="mypage__sidebar" aria-label="마이페이지 메뉴">
              <nav className="sidemenu">
                <div className="user_info">
                    <span className="user_name">홍길동 님</span>
                    <div className="user_contact">
                    <span>hong1234@withmind.net</span>
                    <span>010-1234-5678</span>
                    </div>
                    <p className="usercard__plan">7일 이용권</p>
                    <span className="user_info_edit">
                    <NavLink to="edit-profile"className="default_btn_black">회원 정보 수정</NavLink>         
                </span>
                </div>
                <ul className="sidemenu__list">
                  {GROUPS.map(g=>(
                    <li key={g.id} className="sidemenu__group">
                    <span className="sidemenu__group-label">{g.label}</span>
                     <ul className="sidemenu__sublist">
                      {g.items.map(it => (
                        <li key={it.to}>
                            <NavLink
                          to={it.to}
                          className={({isActive}) => `sidemenu__link ${isActive ? "is-active" : ""}`}
                        >
                          {it.label}
                          </NavLink>
                        </li>
                      ))
                      }
                     </ul>
                    </li>
                  ))}
                 </ul>
                 <span className="sidemenu__item--logout">
                <button type="button" className="sidemenu__link sidemenu_logout_btn">로그아웃</button>
               </span>
              </nav>
            </aside>
            </>
    );
  }