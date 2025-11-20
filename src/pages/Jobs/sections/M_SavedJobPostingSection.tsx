import React, { useState } from 'react'; // useState import 추가

import UiFilter from "@/shared/components/ui-filter/UiFilter";
import AllSavedJobsList from "@/pages/Mypage/Postings/AllSavedJobs/AllSavedJobsList";
import BeforeJobsList from "@/pages/Mypage/Postings/BeforeJobs/BeforeJobsList";
import CompletedJobsList from "@/pages/Mypage/Postings/CompletedJobs/CompletedJobsList";
import SortDropdown from "@/shared/components/sort-dropdown/SortDropdown";

import ic_grid_view_gray900_20 from '@/assets/icons/size20/ic_grid_view_gray900_20.png';
import ic_grid_view_gray400_20 from '@/assets/icons/size20/ic_grid_view_gray400_20.png';
import ic_list_view_gray400_20 from '@/assets/icons/size20/ic_list_view_gray400_20.png';
import ic_list_view_gray900_20 from '@/assets/icons/size20/ic_list_view_gray900_20.png';
import ic_arrow_drop_down_gray500_24 from '@/assets/icons/size24/ic_arrow_drop_down_gray500_24.png';
import "@/pages/Mypage/Postings/SavedPostings.css";
import "@/shared/components/job-posting-item/JobPostingItem.css"


const filters = [
    { label: "전체", value: "all" },
    { label: "지원 완료", value: "done" },
    { label: "지원 전", value: "before" },
];

type FilterValue = 'all' | 'done' | 'before';
type ViewType = 'row' | 'card';
  

export default function M_SavedJobPostingSection() {
    const [currentFilter, setCurrentFilter] = useState<FilterValue>('all'); 
    const [currentView, setCurrentView] = useState<ViewType>('card');
    const [sort, setSort] = useState("적합도순");
    const sortOptions = ["적합도순", "최신순", "인기순", "마감임박순"];
    const totalCount = 0; 
    const isListEmpty = totalCount === 0;
    

  const handleFilterChange = (newValue: string) => {
    setCurrentFilter(newValue as FilterValue); 
  };

  const handleViewToggle = (type: ViewType) => {
    setCurrentView(type);
}
  return (
    <div className="saved-jobs__main-container">
    <div className="saved-jobs__toolbar">
        <div className="toolbar__stats">
           <span className="stats__label">총</span>
           <div className="stats__count-wrap">
              <span className="stats__count">{totalCount}개</span>
              <span className="stats__unit">의 공고</span>
            </div> 
        </div>
        <div className="toolbar__controls">

        <div className="control__sort-by">
          
        <SortDropdown
                      value={sort}
                      options={sortOptions}
                      onChange={setSort}
                      className="job-posting__sort"
                    />
            </div>
        

        <div className="control__page-size">
            <span className="control__label">15개씩</span>
            <img src={ic_arrow_drop_down_gray500_24} alt="개수 변경 아이콘" className="control__icon" />
        </div>

        <div className="control__view-toggle">
            <img src={currentView=="card"?ic_grid_view_gray900_20:ic_grid_view_gray400_20} 
            onClick={() => handleViewToggle('card')}
            alt="그리드 보기" className="toggle__icon toggle__grid" />
             <img src={currentView=="row"?ic_list_view_gray900_20:ic_list_view_gray400_20} 
            onClick={() => handleViewToggle('row')}
            alt="리스트 보기" className="toggle__icon toggle__list" />
        </div>
    </div>
    </div>

    <div className="saved-jobs__filter-tab">
        <UiFilter
            options={filters}
            value={currentFilter} 
            onChange={handleFilterChange}
            className="jobs-filter"
        />
    </div>
    {currentFilter=="all"
    ?<AllSavedJobsList
     viewType={currentView}
    />:
    currentFilter=="done"?
    <CompletedJobsList/>:<BeforeJobsList/>
    }
  </div>
  )
}
