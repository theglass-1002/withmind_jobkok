import { Link, NavLink } from "react-router-dom";
import bookmark_active from '@/assets/icons/mp_bookmark_active.png';
import bookmark_inactive from '@/assets/icons/mp_bookmark_inactive.png';
import mp_banner from '@/assets/icons/mp_banner.png';
import mp_test_logo from '@/assets/icons/mp_test_logo.png';
import file from '@/assets/icons/file.png';
import done_file from '@/assets/icons/done_file.png';
import test_profile from '@/assets/icons/interview_test_profile.png';

import arrow_up_black from '@/assets/icons/arrow-up-right_black.png';

import { Outlet } from "react-router-dom";
import "./MyPage.css";



export default function MyPage() {
    return (
    <div className="mypage_main no-bg-flag">
      <section className="mp-section">
        <header className="mypage__content-header row">
        <span>
        <h1 className="title">저장한 공고</h1>
        </span>
        <span className="mp-more">
          더보기
        </span>
      </header>
      <ul className="job-list saved">
      
      <li className="job-card">
        <div className="job-head">
          <span className="job-logo"><img src={mp_test_logo} alt="" /></span>
          <span className="job-bookmark"><img src={bookmark_active} alt="" /></span>
        </div>

        <div className="job-main">
          <div className="job-company">
            <span className="company-name">케이티밀리의서재</span>
            <span className="job-role">프로덕트 디자이너</span>
          </div>

          <div className="job-meta">
            <div className="job-meta__tags">
              <span className="job-tag job-tag--location">서울 마포구</span>
              <span className="job-tag job-tag--experience">5~10년</span>
              <span className="job-tag job-tag--education">학력무관</span>
            </div>
            <div className="job-type">정규직 · 계약직</div>
          </div>
        </div>
      </li>
      <li className="job-card">
        <div className="job-head">
          <span className="job-logo"><img src={mp_test_logo} alt="" /></span>
          <span className="job-bookmark"><img src={bookmark_active} alt="" /></span>
        </div>

        <div className="job-main">
          <div className="job-company">
            <span className="company-name">케이티밀리의서재</span>
            <span className="job-role">프로덕트 디자이너</span>
          </div>

          <div className="job-meta">
            <div className="job-meta__tags">
              <span className="job-tag job-tag--location">서울 마포구</span>
              <span className="job-tag job-tag--experience">5~10년</span>
              <span className="job-tag job-tag--education">학력무관</span>
            </div>
            <div className="job-type">정규직 · 계약직</div>
          </div>
        </div>
      </li>
      <li className="job-card">
        <div className="job-head">
          <span className="job-logo"><img src={mp_test_logo} alt="" /></span>
          <span className="job-bookmark"><img src={bookmark_active} alt="" /></span>
        </div>

        <div className="job-main">
          <div className="job-company">
            <span className="company-name">케이티밀리의서재</span>
            <span className="job-role">프로덕트 디자이너</span>
          </div>

          <div className="job-meta">
            <div className="job-meta__tags">
              <span className="job-tag job-tag--location">서울 마포구</span>
              <span className="job-tag job-tag--experience">5~10년</span>
              <span className="job-tag job-tag--education">학력무관</span>
            </div>
            <div className="job-type">정규직 · 계약직</div>
          </div>
        </div>
      </li>
      </ul>
      </section>    
      <img src={mp_banner} alt="" />
      <section className="mp-section">
        <header className="mypage__content-header row">
        <span>
        <h1 className="title">최근 본 공고</h1>
        </span>
        <span className="mp-more">
          더보기
        </span>
      </header>
      <ul className="job-list recent">
      <li className="job-card">
        <div className="job-head">
          <span className="job-logo"><img src={mp_test_logo} alt="" /></span>
          <span className="job-bookmark"><img src={bookmark_active} alt="" /></span>
        </div>

        <div className="job-main">
          <div className="job-company">
            <span className="company-name">케이티밀리의서재</span>
            <span className="job-role">프로덕트 디자이너</span>
          </div>

          <div className="job-meta">
            <div className="job-meta__tags">
              <span className="job-tag job-tag--location">서울 마포구</span>
              <span className="job-tag job-tag--experience">5~10년</span>
              <span className="job-tag job-tag--education">학력무관</span>
            </div>
            <div className="job-type">정규직 · 계약직</div>
          </div>
        </div>
      </li>
      <li className="job-card">
        <div className="job-head">
          <span className="job-logo"><img src={mp_test_logo} alt="" /></span>
          <span className="job-bookmark"><img src={bookmark_inactive} alt="" /></span>
        </div>

        <div className="job-main">
          <div className="job-company">
            <span className="company-name">케이티밀리의서재</span>
            <span className="job-role">프로덕트 디자이너</span>
          </div>

          <div className="job-meta">
            <div className="job-meta__tags">
              <span className="job-tag job-tag--location">서울 마포구</span>
              <span className="job-tag job-tag--experience">5~10년</span>
              <span className="job-tag job-tag--education">학력무관</span>
            </div>
            <div className="job-type">정규직 · 계약직</div>
          </div>
        </div>
      </li>
      <li className="job-card">
        <div className="job-head">
          <span className="job-logo"><img src={mp_test_logo} alt="" /></span>
          <span className="job-bookmark"><img src={bookmark_inactive} alt="" /></span>
        </div>

        <div className="job-main">
          <div className="job-company">
            <span className="company-name">케이티밀리의서재</span>
            <span className="job-role">프로덕트 디자이너</span>
          </div>

          <div className="job-meta">
            <div className="job-meta__tags">
              <span className="job-tag job-tag--location">서울 마포구</span>
              <span className="job-tag job-tag--experience">5~10년</span>
              <span className="job-tag job-tag--education">학력무관</span>
            </div>
            <div className="job-type">정규직 · 계약직</div>
          </div>
        </div>
      </li>
      </ul>
      </section>  
      <section className="mp-section">
      <header className="mypage__content-header row">
        <span>
        <h1 className="title">기본 이력서</h1>
        </span>
        <span className="mp-more">
          더보기
        </span>
      </header>
      <div className="resume-card">
        <span className="resume-card__logo">
          <img src={file} alt="" />
        </span>

        <div className="resume-card__body">
          <span className="resume-card__headline">
            성장하는 개발자, 준비된 홍길동입니다.
          </span>
          <div className="resume-card__meta">
            <span className="resume-card__date">2025.02.01</span>
            <span className="resume-card__role">프론트엔드 개발자</span>
          </div>
        </div>
      </div>
      </section>
      <section className="mp-section">
      <header className="mypage__content-header row">
        <span>
        <h1 className="title">최근 진행한 모의면접</h1>
        </span>
        <span className="mp-more">
          더보기
        </span>
      </header>
      <div className="interview-list">
        <div className="interview-item">
          <div className="item-content">
            <div className="content-left">
              <div className="interview-info">
                <span className="score">82점</span>
                <span className="job-type">프론트엔드 개발자</span>
                <div className="status-info">
                  <span className="status">진행완료</span>
                  <span className="date">2025.00.00</span>
                </div>
              </div>
              <div className="description">
                <img src={done_file} alt="" />
              성장하는 개발자, 준비된 홍길동입니다.
              </div>
            </div>
            <div className="content-right">
              <div className="profile-image">
               <img src={test_profile} alt="" />
              </div>
            </div>
          </div>
          <button className="btn_w_full default_btn_white">결과 리포트 보기</button>
        </div>
        <div className="interview-item">
          <div className="item-content">
            <div className="content-left">
              <div className="interview-info">
                <span className="score pending">진행 중</span>
                <span className="job-type">프론트엔드 개발자</span>
                <div className="status-info">
                  <span className="status">진행 중</span>
                  <span className="date">2025.00.00</span>
                </div>
              </div>
              <div className="description">
                <img src={done_file} alt="" />
                성장하는 개발자, 준비된 홍길동입니다.성장하는 개발자, 준비된 홍길동입니다.
              </div>
            </div>
            <div className="content-right">
              <div className="profile-image">
               <img src={test_profile} alt="" />
              </div>
            </div>
          </div>
          <button className="btn_w_full default_btn_white">
            <img src={arrow_up_black} alt="" />
            이어서 진행하기</button>
        </div>
      </div>
      </section>
    </div>
    );
  }