import { Link, NavLink, useNavigate } from "react-router-dom";

import calendar_today from '@/assets/icons/calendar_today.png';
import ic_setting_gray700_20 from '@/assets/icons/size20/ic_setting_gray700_20.png';
import ic_plan_green_20 from '@/assets/icons/size20/ic_plan_green_20.png';
import ic_arrow_right_gray500_18 from '@/assets/icons/size18/ic_arrow_right_gray500_18.png';

import "@/pages/Mypage/Mypage.css";



const GROUPS = [
  {
    id: "plan",
    label: "이용권",
    items: [
      { to: "m-plan/history",  label: "이용권 내역" },
      { to: "/purchase", label: "이용권 구매" }, 
    ],
  },
  {
    id: "support",
    label: "고객 지원",
    items: [ 
      { to: "m-support/faq",        label: "자주 묻는 질문" },
      { to: "m-support/inquiry",    label: "1:1 문의" },
      { to: "m-support/notices",    label: "공지사항" },
      { to: "m-support/report-job", label: "공고 제보하기" },
    ],
  },
  
];


export default function M_MyPageSideMenu() {

  const navigate = useNavigate();

  const handleNavigation = (to) => {
    // 'to' 경로로 이동
    console.log('경로이동');
    navigate(to);
};

    return (
     <>
      <aside className="mypage__sidebar" aria-label="마이페이지 메뉴">
              <nav className="sidemenu">
                <div className="user_info">
                  <div className="sidebar-user__header">
                  <div className="sidebar-user__details">
                      <span className="user_name">정유리 님(모바일)</span>
                        <div className="user_contact">
                        <span>hong1234@withmind.net</span>
                        <span>010-1234-5678</span>
                        </div>
                        </div>
                       <span className="setting-icon_contaitner"   onClick={() => handleNavigation('m-edit-profile')}>
                       <img src={ic_setting_gray700_20} alt="" />
                       </span>
                          
                    </div>
                    <div className="usercard__plan">
                    <span className="plan-status__detail">
                      <img src={ic_plan_green_20} alt="" />
                      7일 이용권
                      </span>
                      <span className="plan-status__expiry">~2025.00.00 00:00</span>
                    </div>
                </div>
                <ul className="sidemenu__list">
                  {GROUPS.map(g=>(
                    <li key={g.id} className="sidemenu__group">
                     <ul className="sidemenu__sublist">
                      {g.items.map(it => (
                       
                            <NavLink
                            key={it.to}
                          to={it.to}
                          className={({isActive}) => `sidemenu__link ${isActive ? "is-active" : ""}`}
                        >
                          {it.label}
                          <img src={ic_arrow_right_gray500_18} alt="" />
                          </NavLink>
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