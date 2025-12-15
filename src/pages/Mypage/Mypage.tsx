import { Link, NavLink,useNavigate } from "react-router-dom";
import bookmark_active from '@/assets/icons/bookmark_active_purple.png';
import bookmark_inactive from '@/assets/icons/bookmark_inactive.png';
import mp_banner from '@/assets/illustrations/mp_banner.png';
import mp_test_logo from '@/assets/icons/mp_test_logo.png';
import file from '@/assets/icons/file.png';
import done_file from '@/assets/icons/done_file.png';
import test_profile from '@/assets/icons/interview_test_profile.png';
import arrow_up_black from '@/assets/icons/arrow-up-right_black.png';
import "./MyPage.css";
import RecommendedJobCard from "@/shared/components/job-posting-item/RecommendedJobCard";



export default function MyPage() {
  const navigate = useNavigate();

    return (
    <div className="mypage_main no-bg-flag">
      <section className="mp-section">
        <header className="mypage__content-header row">
        <span>
        <h1 className="title">저장한 공고</h1>
        </span>
        <span onClick={()=>{navigate('/saved-jobs');}} className="mp-more">
          더보기
        </span>
      </header>
      <ul className="job-list saved">
      <RecommendedJobCard/>
      </ul>
      </section>    
      <div className="job_submission_banner">
      <img className="job_submission_banner__image" src={mp_banner} alt="" />
      <span className="job_submission_banner__headline">아직 등록되지 않은 공고가 있다면 알려주세요!</span>
      <div className="job_submission_banner__content_wrap">
      <span className="job_submission_banner__description">제보해 주신 공고는 확인 후 빠르게 반영하겠습니다.</span>
      <span className="job_submission_banner__action">공고 제보하기</span>
      </div>
      </div>
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
      <RecommendedJobCard/>
      </ul>
      </section>  
      <section className="mp-section">
      <header className="mypage__content-header row">
        <span>
        <h1 className="title">기본 이력서</h1>
        </span>
        <span 
        onClick={()=>{navigate('/resumes');}}
        className="mp-more">
          더보기
        </span>
      </header>
      <div className="resume-card">
        <span className="resume-card__logo">
          <img src={file} alt="" />
        </span>

        <div className="resume-card__body">
          <span className="resume-card__headline">
            성장하는 기획자 정유리입니다.
          </span>
          <div className="resume-card__meta">
            <span className="resume-card__date">2025.02.01</span>
            <span className="resume-card__role">프로젝트 기획자</span>
          </div>
        </div>
      </div>
      </section>
      <section className="mp-section">
      <header className="mypage__content-header row">
        <span>
        <h1 className="title">최근 진행한 모의면접</h1>
        </span>
        <span className="mp-more" onClick={()=>{navigate('/mock-interview-report?tab=history');}}>
          더보기
        </span>
      </header>
      <div className="interview-list">
        <div className="interview-item">
          <div className="item-content">
            <div className="content-left">
              <div className="interview-info">
                <span className="score">82점</span>
                <span className="job-type">프로젝트 기획자</span>
                <div className="status-info">
                  <span className="status">진행완료</span>
                  <span className="date">2025.00.00</span>
                </div>
              </div>
              <div className="description">
                <span>  <img src={done_file} alt="" /></span>
              
              성장하는 기획자 정유리입니다.
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
                <span className="job-type">프로젝트 기획자</span>
                <div className="status-info">
                  <span className="status">진행 중</span>
                  <span className="date">2025.00.00</span>
                </div>
              </div>
              <div className="description">
              <span>  <img src={done_file} alt="" /></span>
             
                성장하는 기획자 정유리 입니다.
              </div>
            </div>
            <div className="content-right">
              <div className="profile-image">
               <img src={test_profile} alt="" />
              </div>
            </div>
          </div>
          <button className="btn_w_full default_btn_white">
            <span>

            <img src={arrow_up_black} alt="" />
            </span>
            이어서 진행하기</button>
        </div>
      </div>
      </section>
    </div>
    );
  }