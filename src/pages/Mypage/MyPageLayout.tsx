import { Outlet } from "react-router-dom";
import "./MyPage.css";
import MyPageSideMenu from "./MyPageSideMenu";



export default function MyPageLayout() {
    return (
      <main className="mypage">
        <div className="container mypage__container">
          <header className="mypage__header">
            <h1 className="mypage__title">마이페이지</h1>
          </header>
  
          <div className="mypage__body">
            <MyPageSideMenu/>
            <section className="mypage__content" aria-labelledby="account-title">
            <Outlet />         
            </section>

          </div>
        </div>
      </main>
    );
  }