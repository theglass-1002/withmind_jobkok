import { Link, NavLink } from "react-router-dom";
import calendar_today from '@/assets/icons/calendar_today.png';
import { Outlet } from "react-router-dom";
import "./MyPage.css";



export default function MyPage() {
    return (
      <header className="mypage__content-header">
              <h2 className="title">지원한 공고</h2>
            </header>

    );
  }