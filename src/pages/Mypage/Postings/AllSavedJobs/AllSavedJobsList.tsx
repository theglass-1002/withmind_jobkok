import React from 'react'
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import
import JobPostingItemCardNoAiPick from "@/shared/components/jobPosting-v3/JobPostingItemCardNoAiPick";
import JobPostingItemRowNoAiPick from "@/shared/components/jobPosting-v3/JobPostingItemRowNoAiPick";


interface AllSavedJobsListProps {
    viewType: 'row' | 'card';
}

export default function AllSavedJobsList({ viewType }: AllSavedJobsListProps) {


const navigate = useNavigate();


const handleGoToJobs = () => {
  navigate('/jobs'); // '/jobs' 경로로 이동
};

  return (
    <>
    {viewType=='card'?
     <div className={`saved-jobs__content-area ${viewType} job-posting__list--grid`}>
        <JobPostingItemCardNoAiPick
        appliedSuccessMessage='지원 정보가 반영되었습니다.'
        />
    </div>
    :<div className= {`saved-jobs__content-area ${viewType} job-posting__item job-posting__item--row`}>
     <JobPostingItemRowNoAiPick
        appliedSuccessMessage='지원 정보가 반영되었습니다.'
     />
    </div>}
    </>
  )
}


//     <div className="saved-jobs__content-empty-area">
//     <div className="jobs-empty-state">
//      <span className="empty-state__title">저장한 공고가 없습니다.</span>
//       <span className="empty-state__desc">관심 있는 채용 공고를 저장하고, 지원 정보도 함께 관리해 보세요.</span>
//            </div>
//            <button 
//         className="default_btn_white empty-state__cta"
//         onClick={handleGoToJobs} 
//         >
//            채용 공고 보러 가기
//      </button>
//    </div>
