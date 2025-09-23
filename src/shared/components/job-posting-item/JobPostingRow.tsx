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
import "./JobPostingItem.css";



export default function JobPostingRow() {
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
      <div className="job-posting__list job-posting__list--row">
        <div className="job-posting__item job-posting__item--row">
        <Link to="/jobs/3">
          <div className="job-posting__card">
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
                     <div className="job-posting__match job-posting__match--level">
                       <img src={green_star16x16} alt="" />
                              AI 적합도 90%</div>
                            <div className="job-posting__meta-items">
                              <span className="job-posting__meta-item">서울 마포구ㆍ5~10년ㆍ학력 무관</span>
                              <span className="job-posting__meta-item">정규직ㆍ계약직</span>
                              <span className="job-posting__meta-item">상시 채용</span>
                            </div>
                          </div>
                          </div>
                        </div>
                        <div className="job-posting__right job-posting__favorite">
                            {bookMark===0?<img onClick={()=>setBookMark(1)} src={bookmark_inactive} alt="" />
                            :<img onClick={()=>setBookMark(0)} src={bookmark_active_purple} alt="" />}
                         
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
                                    <div className="job-posting__ai-pick">
                                    <img src={ai_pick} alt="" />
                                    </div>
                        </div>
                        {recordAsApplied===0?
                          <div className="job-card__control job-card__control--radio">
                          <div className="radio_check_blank_gray" onClick={()=>handleRecordAsApplied(1)}></div> 
                          지원한 포지션으로 기록하기</div>:
                          <div className="job-card__control job-card__control--radio on">
                            <img onClick={()=>setRecordAsApplied(0)} src={check_circle_purple} alt="" />
                        지원한 포지션으로 기록하기
                      </div>    
                    }
                       
                </div>
                </Link>     
            </div>
          </div>
         </>
      );
    }

