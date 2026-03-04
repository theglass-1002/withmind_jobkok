import { NavLink, useNavigate } from "react-router-dom";
import "./MyPage.css";
import { formatPhoneNumber } from "@/shared/utils/util";
import type { MyInfo } from "@/api/auth/auth.types";
import { logout } from "@/api/auth/auth.api";

type MyPageSideMenuProps = {
  myInfo: MyInfo | null;
};

const GROUPS = [
  {
    id: "plan",
    label: "이용권",
    items: [
      { to: "plan/history", label: "이용권 내역" },
      { to: "/purchase", label: "이용권 구매" },
    ],
  },
  {
    id: "support",
    label: "고객 지원",
    items: [
      { to: "support/faq", label: "자주 묻는 질문" },
      { to: "support/inquiry", label: "1:1 문의" },
      { to: "support/notices", label: "공지사항" },
      { to: "support/report-job", label: "공고 제보하기" },
    ],
  },
];

export default function MyPageSideMenu({ myInfo }: MyPageSideMenuProps) {
  const navigate = useNavigate();
  const userName = myInfo?.userName;
  const userId = myInfo?.userId;
  const phone = myInfo?.phone;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };


  return (
    <aside className="mypage__sidebar" aria-label="마이페이지 메뉴">
      <nav className="sidemenu">
        {/* 유저 정보 */}
        <div className="user_info">
          <span className="user_name">
            {userName ? `${userName} 님` : "사용자 님"}
          </span>

          <div className="user_contact">
            <span>{userId ?? "-"}</span>
            <span>{formatPhoneNumber(phone) || "-"}</span>
          </div>

          <p className="usercard__plan">7일 이용권</p>

          <span className="user_info_edit">
              <NavLink
                to="edit-profile"
                state={{ myInfo }}
                className="default_btn_black"
              >
                회원 정보 수정
              </NavLink>
            </span>
        </div>

        {/* 메뉴 */}
        <ul className="sidemenu__list">
          {GROUPS.map((g) => (
            <li key={g.id} className={`sidemenu__group ${g.id}`}>
              <span className="sidemenu__group-label">{g.label}</span>
              <ul className="sidemenu__sublist">
                {g.items.map((it) => (
                  <li key={it.to}>
                    <NavLink
                      to={it.to}
                      className={({ isActive }) =>
                        `sidemenu__link ${isActive ? "is-active" : ""}`
                      }
                    >
                      {it.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <span className="sidemenu__item--logout">
          <button type="button" 
          onClick={handleLogout}
          className="sidemenu__link sidemenu_logout_btn">
            로그아웃
          </button>
        </span>
      </nav>
    </aside>
  );
}
