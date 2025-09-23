import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookmark_active_purple from '@/assets/icons/bookmark_active_purple.png';
import bookmark_inactive from '@/assets/icons/bookmark_inactive.png';
import mp_test_logo from '@/assets/icons/mp_test_logo.png';
import jobkorea from '@/assets/icons/company_logos/jobkorea.png';
import fire from '@/assets/icons/fire.png';
import seed from '@/assets/icons/seed.png';
import ai_pick from '@/assets/icons/ai_pick.png';
import green_star16x16 from '@/assets/icons/green_star16x16.png';
import check_circle_purple from '@/assets/icons/check_circle_purple.png';
import "./RecommendedJobCard.css";




export default function RecommendedJobCard() {
  const [bookMark, setBookMark] = useState(0);
  const [recordAsApplied, setRecordAsApplied] = useState(0);

  const handleRecordAsApplied = (next: 0 | 1) => {
    setRecordAsApplied(next);
    console.log(next);
    if (next === 1) {
      toast.success('지원한 포지션으로 기록했어요.');
    } else {
      toast.info('기록을 해제했어요.');
    }
  };

  return (
    <>
        <ul className="job-list recommend">
      <li className="job-card">
        <div className="job-head">
          <span className="job-logo"><img src={mp_test_logo} alt="" /></span>
          <span className="job-bookmark"><img src={bookmark_active_purple} alt="" /></span>
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

     </>
    );
}

