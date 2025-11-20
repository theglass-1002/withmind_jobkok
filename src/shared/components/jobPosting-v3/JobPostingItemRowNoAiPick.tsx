import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookmark_active_purple from '@/assets/icons/bookmark_active_purple.png';
import bookmark_inactive from '@/assets/icons/bookmark_inactive.png';
import mp_test_logo from '@/assets/icons/mp_test_logo.png';
import jobkorea from '@/assets/icons/company_logos/jobkorea.png';
import fire from '@/assets/icons/fire.png';
import seed from '@/assets/icons/seed.png';
import ic_check_circle_purple_20 from '@/assets/icons/size20/ic_check_circle_purple_20.png';



const DEFAULT_SUCCESS_MESSAGE = '지원 정보가 반영되었습니다.';
const DEFAULT_INFO_MESSAGE = '기록을 해제했어요.';

interface JobPostingItemRowNoAiPickProps {
  appliedSuccessMessage?: string; // 지원 기록 시 성공 메시지
  unappliedInfoMessage?: string;  // 기록 해제 시 알림 메시지
  // job: JobPosting; // 실제 데이터를 받을 job prop을 추가할 수 있습니다.
}

export default function JobPostingItemRowNoAiPick({
  appliedSuccessMessage= DEFAULT_SUCCESS_MESSAGE,
  unappliedInfoMessage = DEFAULT_INFO_MESSAGE
}:JobPostingItemRowNoAiPickProps) {
  const navigate = useNavigate();
  const [bookMark, setBookMark] = useState(0);
  const [recordAsApplied, setRecordAsApplied] = useState(0);

  const handleGoToJobPost = () => {
    navigate('/jobs/13?title=위드마인드');
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setBookMark(bookMark === 0 ? 1 : 0);
    // API 호출 로직 추가 가능
  }

  const handleRecordAsApplied = (e: React.MouseEvent, next: 0 | 1) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setRecordAsApplied(next);
    console.log(next);
    if (next === 1) {
      toast.success(appliedSuccessMessage);
    } else {
      toast.info(unappliedInfoMessage);
    }
  };

  return (
    <div className="job-posting__card" onClick={handleGoToJobPost}>
    <div className="job-posting__row job-posting__row--top">
     <div className="job-posting__left">
        <img className="job-posting__logo" src={mp_test_logo} alt="" />
            <div className="job-posting__details">
             <div className="job-posting__title">
             <span className="job-posting__company">케이티밀리의서재
              <span className="job-posting__source-logo"><img src={jobkorea} alt="" /></span>
              </span>
            <span className="job-posting__role">프론트</span>
            </div>
            <div className="job-posting__meta">
             
                    <div className="job-posting__meta-items">
                      <span className="job-posting__meta-item">서울 마포구ㆍ5~10년ㆍ학력 무관</span>
                      <span className="job-posting__meta-item">정규직ㆍ계약직</span>
                      <span className="job-posting__meta-item">상시 채용</span>
                    </div>
                  </div>
                  </div>
                </div>
                <div className="job-posting__right job-posting__favorite">
                    {bookMark===0?
                    <img onClick={handleBookmarkToggle}
                     src={bookmark_inactive} alt="" />
                    :<img
                     onClick={handleBookmarkToggle}
                    src={bookmark_active_purple} alt="" />}
                 
                </div>
                </div>
                <div className="job-posting__row job-posting__row--bottom">
                            <div className="job-posting__badges">
                            <span className="job-posting__badge">
                                <span><img src={seed} alt="" /></span>
                                여유있는근무제!</span>
                            <span className="job-posting__badge job-posting__badge--urgent">
                                <img src={fire} alt="" />
                                마감임박!</span>
                            </div>
                </div>
                {recordAsApplied===0?
                  <div className="job-card__control job-card__control--radio">
                  <div className="radio_check_blank_gray"  onClick={(e)=> handleRecordAsApplied(e, 1)}></div> 
                  지원한 포지션으로 기록하기</div>:
                  <div className="job-card__control job-card__control--radio on">
                    <img onClick={(e)=>handleRecordAsApplied(e, 0)} src={ic_check_circle_purple_20} alt="" />
                지원한 포지션으로 기록하기
              </div>    
            }
               
        </div>
  )
}
