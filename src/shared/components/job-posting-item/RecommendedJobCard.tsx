import React, { useState } from "react";
import { Link } from 'react-router-dom';
import bookmark_active_purple from '@/assets/icons/size24/ic_bookmark_active_purple24.png';
import bookmark_inactive from '@/assets/icons/size24/ic_blank_bookmark_gray400_24.png';
import mp_test_logo from '@/assets/icons/mp_test_logo.png';
import "./RecommendedJobCard.css";

type Job = {
  id: number;
  isBookmarked: boolean;
};

export default function RecommendedJobCard() {
  // 각 카드마다 개별 북마크 상태 관리
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, isBookmarked: false },
    { id: 2, isBookmarked: false },
    { id: 3, isBookmarked: false },
    { id: 4, isBookmarked: false },
    { id: 5, isBookmarked: false },
    { id: 6, isBookmarked: false },
    { id: 7, isBookmarked: false },
    { id: 8, isBookmarked: false },
    { id: 9, isBookmarked: false },
    // { id: 4, isBookmarked: false },
    // { id: 5, isBookmarked: false },
    // { id: 6, isBookmarked: false },
    // { id: 7, isBookmarked: false },
    // { id: 8, isBookmarked: false },
  ]);

  const handleBookmark = (e: React.MouseEvent, jobId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
      )
    );
  };

  return (
    <>
      <ul className="job-list recommend">
        {jobs.map((job) => (
          <li key={job.id} className="job-card">
            <div className="job-head">
              <span className="job-logo"><img src={mp_test_logo} alt="" /></span>
              <span 
                className="job-bookmark" 
                onClick={(e) => handleBookmark(e, job.id)}
                style={{cursor: 'pointer'}}
              >
                <img 
                  src={job.isBookmarked ? bookmark_active_purple : bookmark_inactive} 
                  alt="" 
                />
              </span>
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
                  <span className="job-tag job-tag--education">학력 무관</span>
                </div>
                <div className="job-type">정규직 · 계약직</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}