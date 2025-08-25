import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {

  const [open, setOpen] = useState(false);

  return (
    <header className="masthead">
      <div className="masthead__inner">
        <h1 className="masthead__brand">
          <Link to="/">jobkok</Link>
        </h1>

        <nav className="masthead__nav" >
          <ul className="masthead__menu">
            <li>
              <NavLink to="/jobs"  className={({isActive}) => isActive ? "on" : undefined}>채용공고</NavLink>
            </li>
            <li>
              <NavLink to="/resume"  className={({isActive}) => isActive ? "on" : undefined}>MY이력서</NavLink>
            </li>
            <li>
              <NavLink to="/mock-interview"  className={({isActive}) => isActive ? "on" : undefined}>모의면접</NavLink>
            </li>
            <li>
              <NavLink to="/post-job"  className={({isActive}) => isActive ? "on" : undefined}>공고등록</NavLink>
            </li>
          
          </ul>
        </nav>

        <div className="login_on">
          <button
            type="button"
            className="user-btn"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            <span className="user-name">홍길동</span>
          </button>

          <ul className={`user-menu${open ? " is-open" : ""}`} role="menu">
            <li role="menuitem"><Link to="/profile">프로필</Link></li>
            <li role="menuitem"><button type="button">로그아웃</button></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
