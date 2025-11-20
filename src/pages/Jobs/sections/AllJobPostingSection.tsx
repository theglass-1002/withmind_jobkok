import React, { useState } from "react";
import Switch from "react-switch";
import search from '@/assets/icons/size20/ic_search_gray900_20.png';
import cancel from '@/assets/icons/size20/ic_cancel_gray400_20.png';
import arrow_drop_up_black from '@/assets/icons/arrow_drop_up_black.png';
import arrow_drop_down from '@/assets/icons/arrow_drop_down.png';
import ic_close_gray500_20 from '@/assets/icons/size20/ic_close_gray500_20.png';
import refresh_gray from '@/assets/icons/refresh_gray.png';
import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import grid_gray from '@/assets/icons/grid_gray.png';
import grid_black from '@/assets/icons/grid_black.png';
import row_white from '@/assets/icons/row_gray.png';
import row_black from '@/assets/icons/row_black.png';
import arrow_left from '@/assets/icons/keyboard_arrow_left.png';
import arrow_right from '@/assets/icons/keyboard_arrow_right.png';


import ModalJobRolePicker from "@/shared/components/job-role-picker/ModalJobRolePicker";
import ModalCareerRangePicker from "@/shared/components/career-range-picker/ModalCareerRangePicker";
import ModalEducationPicker from "@/shared/components/education-picker/ModalEducationPicker";
import ModalLocationPicker from "@/shared/components/location-picker/ModalLocationPicker";
import ModalEmploymentTypePicker from "@/shared/components/employment-type-picker/ModalEmploymentTypePicker";
import SortDropdown from "@/shared/components/sort-dropdown/SortDropdown";

import JobPostingRow from "@/shared/components/job-posting-item/JobPostingRow";
import JobPostingCard from "@/shared/components/job-posting-item/JobPostingCard";


import Tooltip from "@/shared/components/tooltip/Tooltip";
import Pagination from "@/shared/components/Pagination";


type Chip = {
    id: string;
    group: string;
    role?: string;
  };

type FilterKey = 'role' | 'career' | 'education' | 'location' | 'employment';


export default function AllJobPostingSection() {
    const [page, setPage] = useState(1);
    const [resumeReco, setResumeReco] = useState(true); // 이력서 기반 추천 토글
    const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
    const [sort, setSort] = useState("적합도순");
    const [sizeSort, setSizeSort] = useState("15개씩"); 
  
    const [view, setView] = useState(0);
  
    const sortOptions = ["적합도순", "최신순", "인기순", "마감임박순"];
    const sizeSortOptions = ["15개씩", "30개씩", "45개씩"];

    const [chips, setChips] = useState<Chip[]>([
        { id: '1', group: '개발', role: '프론트엔드 개발자' },
        { id: '2', group: '개발', role: '웹 개발자' },
        { id: '3', group: '1~3년' },
        { id: '4', group: '정규직' }
      ]);
    
      

    const toggleFilter = (key: FilterKey) =>
        setOpenFilter(prev => (prev === key ? null : key));

    const resetFilters = () => {
        setChips([]);
      };

      const removeChip = (id: string) => {
        setChips(prev => prev.filter(chip => chip.id !== id));
      };  

    return (
        <>
           <div className="jobs-toolbar">
            <div className="jobs-toolbar__search">
            <div className="panel-search">
            <img className="jobs-search__icon" src={search} alt="" />
                  <input type="text" placeholder="직무, 기업명, 지역등을 입력해주세요" />
               <span className="jobs-search__clear_icon">
               <img src={cancel} alt="" />
               </span>
            </div>
            <div className="job-search-filters">
                <div className="job-search-filter job-search-filter--toggle">
                  <div className="job-search-filter__label">
                    <span className="job-search-filter__text">이력서 기반 추천</span>
                    <Tooltip
                        title="이력서 기반 추천이란?"
                        desc="등록된 기본 이력서를 기반으로, 적합한 채용 공고를 찾아주는 잡콕만의 AI 추천 서비스입니다. 적합도가 높은 공고에는 [AI Pick] 태그가 표시됩니다."
                        position="top"
                        className="job-posting__tooltip"
                      />

                   </div>
                  <Switch
                      checked={resumeReco}
                      onChange={setResumeReco}
                      onColor="#000000"
                      offColor="#E5E7EB"
                      onHandleColor="#FFFFFF"
                      offHandleColor="#FFFFFF"
                      handleDiameter={18}
                      height={22}
                      width={42}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      aria-label="이력서 기반 추천"
                    />
                </div>
                <ul className="job-search-filter-menu">
                      <li
                        className={`job-search-filter-menu__item ${openFilter==='role' ? 'on' : ''}`}
                        onClick={() => toggleFilter('role')}
                      >
                      <span className="job-search-filter-menu__label">직군ㆍ직무</span>
                      <span className="job-search-filter-menu__icon">
                        <img src={openFilter==='role'?arrow_drop_up_black:arrow_drop_down} alt="" />
                      </span>
                      {openFilter==='role'?<div
                          onMouseDown={(e) => e.stopPropagation()}  
                          onClick={(e) => e.stopPropagation()}     
                          onTouchStart={(e) => e.stopPropagation()} >
                          <ModalJobRolePicker/>
                          </div>
                          :<></>}
                  </li>       
                  <li 
                    className={`job-search-filter-menu__item ${openFilter==='career' ? 'on' : ''}`}
                    onClick={() => toggleFilter('career')}>
                      <span className="job-search-filter-menu__label">경력</span>
                      <span className="job-search-filter-menu__icon">
                      <img src={openFilter==='career'?arrow_drop_up_black:arrow_drop_down} alt="" />
                      </span>
                      {openFilter==='career'?<div
                          onMouseDown={(e) => e.stopPropagation()}  
                          onClick={(e) => e.stopPropagation()}     
                          onTouchStart={(e) => e.stopPropagation()} >
                          <ModalCareerRangePicker/>
                          </div>
                          :<></>}
                  </li>
                  <li 
                      className={`job-search-filter-menu__item ${openFilter==='education' ? 'on' : ''}`}
                      onClick={() => toggleFilter('education')}
                    >
                      <span className="job-search-filter-menu__label">학력</span>
                      <span className="job-search-filter-menu__icon">
                      <img src={openFilter==='education'?arrow_drop_up_black:arrow_drop_down} alt="" />
                      </span>
                      {openFilter==='education'?<div
                          onMouseDown={(e) => e.stopPropagation()}  
                          onClick={(e) => e.stopPropagation()}     
                          onTouchStart={(e) => e.stopPropagation()} >
                          <ModalEducationPicker/>
                          </div>
                          :<></>}   
                  </li>
                  <li
                      className={`job-search-filter-menu__item ${openFilter==='location' ? 'on' : ''}`}
                      onClick={() => toggleFilter('location')}
                    >
                      <span className="job-search-filter-menu__label">지역</span>
                      <span className="job-search-filter-menu__icon">
                      <img src={openFilter==='location'?arrow_drop_up_black:arrow_drop_down} alt="" />
                      </span>
                      {openFilter==='location'?<div
                          onMouseDown={(e) => e.stopPropagation()}  
                          onClick={(e) => e.stopPropagation()}     
                          onTouchStart={(e) => e.stopPropagation()} >
                          <ModalLocationPicker/>
                          </div>
                          :<></>}   
                  </li>
                  <li 
                    className={`job-search-filter-menu__item ${openFilter==='employment' ? 'on' : ''}`}
                    onClick={() => toggleFilter('employment')}
                  >
                      <span className="job-search-filter-menu__label">채용 유형</span>
                      <span className="job-search-filter-menu__icon">
                      <img src={openFilter==='employment'?arrow_drop_up_black:arrow_drop_down} alt="" />
                      </span>
                      {openFilter==='employment'?<div
                          onMouseDown={(e) => e.stopPropagation()}  
                          onClick={(e) => e.stopPropagation()}     
                          onTouchStart={(e) => e.stopPropagation()} >
                          <ModalEmploymentTypePicker/>
                          </div>
                          :<></>}   
                  </li>
                </ul>
            </div>
            <div className="jobs-toolbar-container">
            <div className="jobs-toolbar__actions">
            <div className="jobs-actions__reset" onClick={resetFilters} style={{cursor: 'pointer'}}>
             <span><img src={refresh_gray} alt="" /></span>초기화</div>
             <div className="jobs-chips">
              {chips.map((chip) => (
                <div key={chip.id} className="jobs-chips__item">
                  <span className="job-role-picker__chip-group">{chip.group}</span>
                  {chip.role && (
                    <span className="job-role-picker__chip-role">
                      <span className="job-role-picker__chip-chevron">
                        <img src={chevron_right_black} alt="" />
                      </span> 
                      {chip.role}
                    </span>
                  )}
                  <span 
                    className="job-role-picker__chip-close" 
                    onClick={() => removeChip(chip.id)}
                    style={{cursor: 'pointer'}}
                  >
                    <img src={ic_close_gray500_20} alt="" />
                  </span>
                </div>
              ))}
              </div>
            </div>
            </div>
        
            </div>
              </div>
              <div className="job-posting">
              <div className="job-posting__ai-recommend">이력서를 기반으로 AI가 103개의 추천 공고를 찾았어요!</div>
              <div className="job-posting__container">
              <div className="job-posting__content">
                <div className="job-posting__header">
                  <span className="job-posting__count">총 <p className="point-text-black">365개</p>전체공고</span>
                  <div className="job-posting__controls">
                 
                    <SortDropdown
                      value={sort}
                      options={sortOptions}
                      onChange={setSort}
                      className="job-posting__sort"
                    />
               
                  <SortDropdown
                      value={sizeSort}
                      options={sizeSortOptions}
                      onChange={setSizeSort}
                      className="job-posting__sort"
                    />
                    <div className="job-posting__view-toggle" role="group" aria-label="보기 전환">
                    <span className="job-posting__view-btn job-posting__view-btn--card" onClick={()=>{setView(1)}} role="button" tabIndex={0}>
                       {view===1?(<img src={grid_black}/>):(<img src={grid_gray}/>)} 
                      </span>
                      <span className="job-posting__view-btn job-posting__view-btn--list job-posting__view-btn--active" onClick={()=>{setView(0)}} role="button" tabIndex={0}>
                      {view===0?(<img src={row_black}/>):(<img src={row_white}/>)} 
                      </span>
                    </div>
                  </div>
                </div>
                {view===1?<JobPostingCard/>:<JobPostingRow/>}
              </div>
              <div className="job-posting__pagination">
                <Pagination 
                current={1}
                total={10}
                onChange={setPage}
                pageWindow={5}
                prevIcon={<img src={arrow_left} alt="" aria-hidden="true" />}
                nextIcon={<img src={arrow_right} alt="" aria-hidden="true" />}
                />
            </div>
              </div>
          </div>
        </>
  )
}
