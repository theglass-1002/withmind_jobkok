import React, { useState } from "react";
import bookmark_active_purple from '@/assets/icons/bookmark_active_purple.png';
import bookmark_inactive from '@/assets/icons/bookmark_inactive.png';
import mp_test_logo from '@/assets/icons/mp_test_logo.png';
import jobkorea from '@/assets/icons/company_logos/jobkorea.png';
import fire from '@/assets/icons/fire.png';
import seed from '@/assets/icons/seed.png';
import ai_pick from '@/assets/icons/ai_pick.png';
import green_star from '@/assets/icons/green_star.png';
import check_circle_purple from '@/assets/icons/check_circle_purple.png';
import "./JobPostingItem.css";




export default function JobPostingCard() {
  const [bookMark, setBookMark] = useState(0);
  const [recordAsApplied, setRecordAsApplied] = useState(0);


  return (
         <>
          <div className="job-posting__list job-posting__list--grid">
                <div className="job-posting__card">
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
                      onClick={()=>setBookMark(1)}
                      />:<img src={bookmark_active_purple}
                      onClick={()=>setBookMark(0)}
                       />}
                      </span>
                    </div>
                    <div className="job-card__divider"></div>
                    <div className="job-card__body">
                      <div className="job-card__content">
                        <span className="job-posting__match job-posting__match--level">
                        <img src={green_star} alt="" />
                          AI 적합도 70%</span>
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
                          <div className="radio_check_blank_gray" onClick={()=>setRecordAsApplied(1)}></div> 
                          지원한 포지션으로 기록하기</div>:
                          <div className="job-card__control job-card__control--radio on">
                            <img onClick={()=>setRecordAsApplied(0)} src={check_circle_purple} alt="" />
                        지원한 포지션으로 기록하기
                      </div>    
                    }

                    </div>
                    <div className="job-card__sticker">  <img src={ai_pick} alt="" /></div>
                 </div>
                </div>
            </>
            );
        }


// <div className={`job-posting__list job-posting__list--${view === 1 ? 'grid' : 'row'}`}>
// <div className={`job-posting__item job-posting__item--${view === 1 ? 'card' : 'row'}`}>
//     <div className="job-posting__card">
//       <div className="job-posting__row job-posting__row--top">
//         <div className="job-posting__left">
        
//             <img className="job-posting__logo" src={mp_test_logo} alt="" />
    
//           <div className="job-posting__details">
//             <div className="job-posting__title">
//               <span className="job-posting__company">케이티밀리의서재
//               <span className="job-posting__source-logo"><img src={jobkorea} alt="" /></span>

//               </span>
//               <span className="job-posting__role">프론트</span>
//             </div>
//             <div className="job-posting__meta">
//             <div className="job-posting__match job-posting__match--level">
//               <img src={green_star} alt="" />
//               AI 적합도 90%</div>
//             <div className="job-posting__meta-items">
//               <span className="job-posting__meta-item">서울 마포구ㆍ5~10년ㆍ학력 무관</span>
//               <span className="job-posting__meta-item">정규직ㆍ계약직</span>
//               <span className="job-posting__meta-item">상시 채용</span>
//             </div>
//           </div>
//           </div>
//         </div>
//         <div className="job-posting__right job-posting__favorite">
//           <img src={bookmark_active_purple} alt="" />
//         </div>
//       </div>

//       <div className="job-posting__row job-posting__row--bottom">
        // <div className="job-posting__badges">
        //   <span className="job-posting__badge">
        //     <span><img src={seed} alt="" /></span>
        //     여유있는근무제!</span>
        //   <span className="job-posting__badge job-posting__badge--urgent">
        //     <img src={fire} alt="" />
        //     마감임박!</span>
        // </div>
//         <div className="job-posting__ai-pick">
//           <img src={ai_pick} alt="" />
//         </div>
//       </div>
//     </div>
//   </div>
// </div>