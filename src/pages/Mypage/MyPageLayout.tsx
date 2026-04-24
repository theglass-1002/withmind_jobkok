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
        console.log(res);
        setMyInfo(res.user);
      } catch (e: any) {
        console.error("[MyPageLayout] 내 정보 가져오기 실패", e);

        if (e?.code === 999) {
          console.log("로그인만료");
          logout();
          navigate("/login");
        }
      }
    };

    loadMyInfo();
  }, [navigate]);

  return (
    <>
      <main className="mypage">
        <div className="container mypage__container">
          <header className="mypage__header">
            <h1 className="mypage__title">마이페이지</h1>
          </header>

          <div className="mypage__body">

            <MyPageSideMenu myInfo={myInfo} />

            <section className="mypage__content" aria-labelledby="account-title">
            <Outlet context={{ myInfo, setMyInfo }} />
            </section>
          </div>
        </div>

        <M_MyPageMain myInfo={myInfo} />
      </main>
    </>
  );
}
