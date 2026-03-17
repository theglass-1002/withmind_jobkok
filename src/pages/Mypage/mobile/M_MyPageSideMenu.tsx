import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import ic_setting_gray700_20 from "@/assets/icons/size20/ic_setting_gray700_20.png";
import ic_plan_green_20 from "@/assets/icons/size20/ic_plan_green_20.png";
import ic_arrow_right_gray500_18 from "@/assets/icons/size18/ic_arrow_right_gray500_18.png";
import { logout } from "@/api/auth/auth.api";

import "@/pages/Mypage/Mypage.css";
import { formatPhoneNumber } from "@/shared/utils/util";
import { MyInfo } from "@/api/auth/auth.types";

const GROUPS = [
  {
    id: "support",
    label: "고객 지원",
    items: [
      { to: "m-support/faq", label: "자주 묻는 질문" },
      { to: "m-support/inquiry", label: "1:1 문의" },
      { to: "m-support/notices", label: "공지사항" },
      { to: "m-support/report-job", label: "공고 제보하기" },
    ],
  },
];

type Props = {
  myInfo: MyInfo | null;
  planName?: string;
  planExpireAt?: string;
};

export default function M_MyPageSideMenu({ myInfo, planName, planExpireAt }: Props) {
  const navigate = useNavigate();


  useEffect(() => {
 
  }, [myInfo]);

  const handleNavigation = (to: string) => {

    navigate(to);
  };

  const handleLogout = () => {
  
    logout();
    navigate("/login", { replace: true });
  };

  const userName = myInfo?.userName;
  const email = myInfo?.userId;
  const phone = myInfo?.phone;



  return (
    <aside className="mypage__sidebar" aria-label="마이페이지 메뉴">
      <nav className="sidemenu">
        <div className="user_info">
          <div className="sidebar-user__header">
            <div className="sidebar-user__details">
              <span className="user_name">
                {userName ? `${userName} 님` : "사용자 님"}
              </span>

              <div className="user_contact">
                <span>{email ?? ""}</span>
                <span>{formatPhoneNumber(phone) || ""}</span>
              </div>
            </div>

            <span
              className="setting-icon_contaitner"
              onClick={() => {
                 navigate("m-edit-profile", {
                  state: { myInfo },
                });
              }}
              role="button"
              tabIndex={0}
            >
              <img src={ic_setting_gray700_20} alt="설정" />
            </span>
          </div>

          <div className="usercard__plan">
            <span className="plan-status__detail">
              <img src={ic_plan_green_20} alt="" />
              {planName ?? "이용권 정보 없음"}
            </span>
            <span className="plan-status__expiry">{planExpireAt ?? "-"}</span>
          </div>
        </div>

        <ul className="sidemenu__list">
          {GROUPS.map((g) => (
            <li key={g.id} className="sidemenu__group">
              <ul className="sidemenu__sublist">
                {g.items.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    className={({ isActive }) =>
                      `sidemenu__link ${isActive ? "is-active" : ""}`
                    }
                    onClick={() =>
                      console.log("[M_MyPageSideMenu] menu click:", it.to, "myInfo:", myInfo)
                    }
                  >
                    {it.label}
                    <img src={ic_arrow_right_gray500_18} alt="" />
                  </NavLink>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <span className="sidemenu__item--logout" onClick={handleLogout}>
          로그아웃
        </span>
      </nav>
    </aside>
  );
}