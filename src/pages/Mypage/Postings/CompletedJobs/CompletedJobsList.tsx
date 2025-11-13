import React from 'react'

export default function CompletedJobsList() {
  return (
    <div className="saved-jobs__content-empty-area completed">
    <div className="jobs-empty-state">
                 <span className="empty-state__title">아직 지원한 공고가 없습니다.</span>
                   <span className="empty-state__desc">지원한 공고가 있다면, ‘지원한 포지션으로 기록하기’를 눌러 기록해 보세요.</span>
           </div>
   </div>
  )
}
