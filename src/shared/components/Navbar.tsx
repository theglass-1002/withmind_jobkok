import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import jobkokLogo from '@/assets/icons/jobkok_logo.png';
import searchIcon from '@/assets/icons/search.png';
import bookmarkIcon from '@/assets/icons/bookmark.png';
import accountIcon from '@/assets/icons/account_circle.png';

export default function Navbar() {

  const [open, setOpen] = useState(false);

  return (
    <header className="masthead">
      <div className="masthead__inner">
        <h1 className="masthead__brand">
        <Link to="/" aria-label="">
            <img src={jobkokLogo}  />
          </Link>
        </h1>
        <nav className="masthead__nav" >
          <ul className="masthead__menu">
            <li>
              <NavLink to="/jobs"  className={({isActive}) => isActive ? "on" : undefined}>채용공고</NavLink>
            </li>
            <li>
              <NavLink to="/resume"  className={({isActive}) => isActive ? "on" : undefined}>이력서</NavLink>
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
        <NavLink to="/"><img src={searchIcon}  /></NavLink>
        <NavLink to="/"><img src={bookmarkIcon}  /></NavLink>
        <NavLink to="/mypage"><img src={accountIcon}/></NavLink>
      </div>
      </div>
    </header>
  );
}
