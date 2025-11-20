import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookmark_active_purple from '@/assets/icons/bookmark_active_purple.png';
import bookmark_inactive from '@/assets/icons/bookmark_inactive.png';
import mp_test_logo from '@/assets/icons/mp_test_logo.png';
import jobkorea from '@/assets/icons/company_logos/jobkorea.png';
import fire from '@/assets/icons/fire.png';
import seed from '@/assets/icons/seed.png';
import check_circle_purple from '@/assets/icons/check_circle_purple.png';


const DEFAULT_SUCCESS_MESSAGE = '지원 정보가 반영되었습니다.';
const DEFAULT_INFO_MESSAGE = '기록을 해제했어요.';

interface M_JobPostingItemCardNoAiProps {
  appliedSuccessMessage?: string; // 지원 기록 시 성공 메시지
  unappliedInfoMessage?: string;  // 기록 해제 시 알림 메시지
  // job: JobPosting; // 실제 데이터를 받을 job prop을 추가할 수 있습니다.
}


export default function M_JobPostingItemCardNoAi({
  // Props를 구조 분해 할당하고 기본 메시지를 설정합니다.
  appliedSuccessMessage = DEFAULT_SUCCESS_MESSAGE,
  unappliedInfoMessage = DEFAULT_INFO_MESSAGE,
}: M_JobPostingItemCardNoAiProps) {
  const navigate = useNavigate();
  const [bookMark, setBookMark] = useState(0);
  const [recordAsApplied, setRecordAsApplied] = useState(0);

  const handleGoToJobPost = () => {
    navigate('/jobs/13');
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
               <div className="job-card__header">
                <div className="job-posting__left">
                <img className="job-posting__logo" src={mp_test_logo} alt="" />
                <div className="job-card__identity">
                <div className="job-card__byline">
                <span className="job-posting__company">위드마인드</span>
                    <span className="job-posting__source-logo"><img src={jobkorea} alt="" /></span>
                    </div>
                    <span className="job-posting__role">프론트앤드 개발자</span>
                      </div>
                    </div>
                    <span className="job-card__favorite">  
                      {bookMark===0?<img src={bookmark_inactive}
                      onClick={handleBookmarkToggle} // 수정: 함수 연결
                      />:<img src={bookmark_active_purple}
                      onClick={handleBookmarkToggle} // 수정: 함수 연결
                       />}
                      </span>
                    </div>
                    <div className="job-card__divider"></div>
                    <div className="job-card__body">
                      <div className="job-card__content">
                  
                        <div className="job-card__facts">
                          <div className="job-posting__meta-items">
                            <span className="job-posting__meta-item">서울 마포구ㆍ신입 이상ㆍ대졸 이상</span>
                            <span className="job-posting__meta-item">정규직ㆍ계약직</span>
                          </div>
                          <span className="job-card__deadline">~2025.08.31(일)</span>
                        </div>
                      </div>
                      <div className="job-posting__badges">
                        <span className="job-posting__badge">
                          <span><img src={seed} alt="" /></span>여유있는근무제!</span>
                        <span className="job-posting__badge job-posting__badge--urgent">
                          <img src={fire} alt="" />마감임박!</span>
                      </div>
                      {recordAsApplied===0?
                          <div className="job-card__control job-card__control--radio">
                          <div className="radio_check_blank_gray" onClick={(e)=> handleRecordAsApplied(e, 1)}></div> 
                          지원한 포지션으로 기록하기</div>:
                          <div className="job-card__control job-card__control--radio on">
                            <img onClick={(e)=>handleRecordAsApplied(e, 0)} src={check_circle_purple} alt="" />
                        지원한 포지션으로 기록하기
                      </div>    
                    }

                    </div>
                 </div>
  )
}