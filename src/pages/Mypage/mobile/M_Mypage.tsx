import { Link, NavLink,useNavigate } from "react-router-dom";
import bookmark_active from '@/assets/icons/bookmark_active_purple.png';
import bookmark_inactive from '@/assets/icons/bookmark_inactive.png';
import mp_banner from '@/assets/illustrations/mp_banner.png';
import mp_test_logo from '@/assets/icons/mp_test_logo.png';
import file from '@/assets/icons/file.png';
import done_file from '@/assets/icons/done_file.png';
import test_profile from '@/assets/icons/interview_test_profile.png';
import arrow_up_black from '@/assets/icons/arrow-up-right_black.png';
import RecommendedJobCard from "@/shared/components/job-posting-item/RecommendedJobCard";
import M_MockInterviewHistoryRow from "@/pages/InterviewReport/history/mobile/M_MockInterviewHistoryRow";
import M_MockInterviewHistoryList, { type M_InterviewReportHistoryItemData } from "@/pages/InterviewReport/history/mobile/M_MockInterviewHistoryList";
import ic_arrow_up_right_gray900_20 from "@/assets/icons/size20/ic_arrow_up_right_gray900_20.png";

import ic_task_gray900_18 from "@/assets/icons/size18/ic_task_gray900_18.png";
import test_profile_img2 from "@/assets/testImg/test_profile_img.jpg";



export default function M_MyPage() {
  const navigate = useNavigate();


  
  const HISTORY_ITEMS: M_InterviewReportHistoryItemData[] = [
    {
      id: 1,
      title:"",
      no: 1,
      avatarSrc: test_profile_img2,
      scoreText: "82점",
      roleText: "프론트개발자",
      dateText: "2025.01.01",
      statusText: "진행완료",
      statusState: "done",
      resumeLabelIconSrc: ic_task_gray900_18,
      resumeText: "개발자 준비된 홍길동입니다.",
      resumeDate: "2025.01.01",
      onClickView: () => {
        navigate(`/mock-interview/analysis/${1}`);
      },
    },
    {
      id: 2,
      title:"",
      no: 2,
      avatarSrc: test_profile_img2,
      scoreText: "82점",
      roleText: "프론트개발자",
      dateText: "2025.01.01",
      statusText: "진행 중",
      statusState: "doing",
      resumeLabelIconSrc: ic_task_gray900_18,
      resumeText: "개발자 준비된 홍길동입니다.",
      resumeDate: "2025.01.01",
      onClickView: () => {
        navigate(`/mock-interview/analysis/${2}`);
      },
    },
    {
      id: 3,
      title:"",
      no: 3,
      avatarSrc: test_profile_img2,
      scoreText: "82점",
      roleText: "프론트개발자",
      dateText: "2025.01.01",
      statusText: "진행완료",
      statusState: "done",
      resumeLabelIconSrc: ic_task_gray900_18,
      resumeText: "개발자 준비된 홍길동입니다.",
      resumeDate: "2025.01.01",
      onClickView: () => {
        navigate(`/mock-interview/analysis/${3}`);
      },
    },
    {
        id: 4,
        title:"",
        no: 3,
        avatarSrc: test_profile_img2,
        scoreText: "82점",
        roleText: "프론트개발자",
        dateText: "2025.01.01",
        statusText: "진행 중",
        statusState: "doing",
        resumeLabelIconSrc: ic_task_gray900_18,
        resumeText: "성장하는 개발자, 준비된 홍길동입니다..",
        resumeDate: "2025.01.01",
        onClickView: () => {
          navigate(`/mock-interview/analysis/${4}`);
        },
      },
      
  ];
  

    return (
    <div className="mypage_main no-bg-flag mobile">
      <section className="mp-section">
        <header className="mypage__content-header row">
        <span className="mypage__section__title">
        저장한 공고(모바일)
        </span>
        <span onClick={()=>{navigate('/saved-jobs');}} className="mp-more">
          더보기
        </span>
      </header>
      
      <RecommendedJobCard/>

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
        <span className="mypage__section__title">
        최근 본 공고
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
        <span className="mypage__section__title">
        기본 이력서
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
      <span className="mypage__section__title">
        최근 진행한 모의면접
        </span>
        <span className="mp-more" onClick={()=>{navigate('/mock-interview-report?tab=history');}}>
          더보기
        </span>
      </header>
      <div className="mock-history__body data-list__body">
          {HISTORY_ITEMS.map((it) => (
            <M_MockInterviewHistoryRow key={it.id} item={it} viewIconSrc={ic_arrow_up_right_gray900_20} />
          ))}
        </div>
   
      </section>
    </div>
    );
  }