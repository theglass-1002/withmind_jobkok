import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./MyPage.css";

import MyPageSideMenu from "./MyPageSideMenu";
import M_MyPageMain from "./mobile/M_MyPageMain";

import { fetchMyInfo, logout } from "@/api/auth/auth.api";
import { MyInfo } from "@/api/auth/auth.types";

export default function MyPageLayout() {
  const navigate = useNavigate();
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);

  useEffect(() => {
    const loadMyInfo = async () => {
      try {
        const res = await fetchMyInfo();
        setMyInfo(res.user);
      } catch (e) {
        console.error("[MyPageLayout] 내 정보 가져오기 실패", e);
        if (e.code === 999) {
          console.log("로그인만료");
          logout();
          navigate("/login");
        }
      }
    };

    loadMyInfo();
  }, []);

  return (
    <main className="mypage">
      <div className="container mypage__container">
        <header className="mypage__header">
          <h1 className="mypage__title">마이페이지</h1>
        </header>

        <div className="mypage__body">
          <MyPageSideMenu
            userName={myInfo?.userName}
            userId={myInfo?.userId}
            phone={myInfo?.phone}
          />

          <section className="mypage__content" aria-labelledby="account-title">
            <Outlet />
          </section>
        </div>
      </div>

      <M_MyPageMain />
    </main>
  );
}
