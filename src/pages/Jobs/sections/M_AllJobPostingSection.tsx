import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";

import search from '@/assets/icons/search.png';
import cancel from '@/assets/icons/cancel.png';
import arrow_drop_up_black from '@/assets/icons/arrow_drop_up_black.png';
import arrow_drop_down from '@/assets/icons/arrow_drop_down.png';
import ic_star_green_18 from '@/assets/icons/size18/ic_star_green_18.png';
import refresh_gray from '@/assets/icons/refresh_gray.png';
import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import ic_close_gray500_20 from '@/assets/icons/size20/ic_close_gray500_20.png';
import arrow_left from '@/assets/icons/keyboard_arrow_left.png';
import arrow_right from '@/assets/icons/keyboard_arrow_right.png';

import JobFilterPanel from "@/shared/components/mobile/JobFilterPanel";
import SortDropdown from "@/shared/components/sort-dropdown/SortDropdown";
import Tooltip from "@/shared/components/tooltip/Tooltip";
import Pagination from "@/shared/components/Pagination";
import JobPostingRow from "@/shared/components/job-posting-item/JobPostingRow";
import JobEmptyResult from "@/shared/components/empty/job/JobEmptyResult";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import { Icons } from '@/assets/icons';
import { fetchJobTree, fetchJobList } from "@/api/job/job.api";
import { JobNode, JobItem, SORT_CODE_MAP } from "@/api/job/job.types";
import { logout } from "@/api/auth/auth.api";

type Chip = {
    id: string;
    group: string;
    role?: string;
};
  
type FilterKey = 'role' | 'career' | 'education' | 'location' | 'employment';

export default function M_AllJobPostingSection() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("적합도순");
    const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
    const [resumeReco, setResumeReco] = useState(false);

    const sortOptions = ["적합도순", "최신순", "인기순", "마감임박순"];

    const [chips, setChips] = useState<Chip[]>([]);

    const [jobTree, setJobTree] = useState<JobNode[]>([]);
    const [jobLoading, setJobLoading] = useState(false);

    const [jobs, setJobs] = useState<JobItem[]>([]);
    const [jobsLoading, setJobsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                setJobLoading(true);
                const tree = await fetchJobTree();
                setJobTree(tree);
                setInitialized(true);
            } catch (e: any) {
                console.error("[M_AllJobPostingSection] fetchJobTree 에러:", e);
                if (e?.code === 999) {
                    logout();
                    navigate("/login");
                }
            } finally {
                setJobLoading(false);
            }
        };

        init();
    }, [navigate]);

    useEffect(() => {
        if (!initialized) return;

        const loadJobs = async () => {
            try {
                setJobsLoading(true);
                const size = 15;
                const sortCode = SORT_CODE_MAP[sort] ?? "latest";

                const params: any = {
                    sort: sortCode,
                };

                const { jobs, totalPages, totalCount } = await fetchJobList(page, size, params);
                setJobs(resumeReco ? jobs.filter((j) => j.aiPick === true) : jobs);
                setTotalPages(totalPages);
                setTotalCount(totalCount);
            } catch (e: any) {
                console.error("[M_AllJobPostingSection] fetchJobList 에러:", e);
                if (e?.code === 999) {
                    logout();
                    navigate("/login");
                }
            } finally {
                setJobsLoading(false);
            }
        };

        loadJobs();
    }, [initialized, navigate, page, sort, resumeReco]);

    const handleSortChange = (newSort: string) => {
        setSort(newSort);
        setPage(1);
    };

    const toggleFilter = (key: FilterKey) =>
        setOpenFilter(prev => (prev === key ? null : key));
  
    const removeChip = (id: string) => {
        setChips(prev => prev.filter(chip => chip.id !== id));
    };

    const resetFilters = () => {
        setChips([]);
        setOpenFilter(null);
    };

    const handleCloseFilter = () => {
        setOpenFilter(null);
    };

    const handleApplyFilter = (filters: any) => {
        console.log("적용된 필터:", filters);
        setOpenFilter(null);
    };

    const handleResetFilter = () => {
        resetFilters();
    };

    if (jobLoading && jobTree.length === 0 && jobs.length === 0) {
        return <LoadingOverlay />;
    }

    return (
        <>    
            <div className="jobs-toolbar">
                <div className="jobs-toolbar__search">
                    <div className="panel-search">
                        <img className="jobs-search__icon" src={search} alt="" />
                        <input type="text" placeholder="직무, 기업명, 지역등을 입력해주세요" />
                        <img className="jobs-search__clear_icon" src={cancel} alt="" />
                    </div>
                    <div className="job-search-filters">
                        <button className="job-list-action__refresh">
                            <img src={Icons.ic_refresh_gray900_16} alt="새로고침" />
                        </button>
                        <span className="job-list-separator"></span>
                        <button className='job-list-action__filter'>
                            <img src={Icons.ic_filter_gray900_20} alt="" />
                        </button>
                        <ul className="job-search-filter-menu">
                            <li
                                className={`job-search-filter-menu__item ${openFilter === 'role' ? 'on' : ''}`}
                                onClick={() => toggleFilter('role')}>
                                <span className="job-search-filter-menu__label">직군ㆍ직무</span>
                            </li>       
                            <li 
                                className={`job-search-filter-menu__item ${openFilter === 'career' ? 'on' : ''}`}
                                onClick={() => toggleFilter('career')}>
                                <span className="job-search-filter-menu__label">경력</span>
                            </li>
                            <li 
                                className={`job-search-filter-menu__item ${openFilter === 'education' ? 'on' : ''}`}
                                onClick={() => toggleFilter('education')}>
                                <span className="job-search-filter-menu__label">학력</span>
                            </li>
                            <li
                                className={`job-search-filter-menu__item ${openFilter === 'location' ? 'on' : ''}`}
                                onClick={() => toggleFilter('location')}>
                                <span className="job-search-filter-menu__label">지역</span>
                            </li>
                            <li 
                                className={`job-search-filter-menu__item ${openFilter === 'employment' ? 'on' : ''}`}
                                onClick={() => toggleFilter('employment')}>
                                <span className="job-search-filter-menu__label">채용 유형</span>
                            </li>
                        </ul>
                    </div>
                   
                    <div className="jobs-toolbar__actions">
                        <div className="jobs-actions__reset" onClick={resetFilters} style={{cursor: 'pointer'}}>
                            <span><img src={refresh_gray} alt="" /></span>초기화
                        </div>
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
            <div className="job-search-filter job-search-filter--toggle">
                <div className="job-search-filter__label">
                    <span className="job-search-filter__text">
                        이력서 기반 추천
                    </span>
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

            {openFilter && (
                <JobFilterPanel
                    filterType={openFilter}
                    totalCount={totalCount}
                    onClose={handleCloseFilter}
                    onApply={handleApplyFilter}
                    onReset={handleResetFilter}
                />
            )}

            <div className="job-posting">
                <div className="job-posting__container">
                    <div className="job-posting__content">
                        <div className="job-posting__header">
                            <span className="job-posting__count">
                                총 <p className="point-text-black">{(resumeReco ? jobs.length : totalCount).toLocaleString()}개</p> 전체공고
                            </span>
                            <div className="job-posting__controls">
                                <SortDropdown
                                    value={sort}
                                    options={sortOptions}
                                    onChange={handleSortChange}
                                    className="job-posting__sort"
                                />
                            </div>
                        </div>
                        {jobs.length === 0 ? (
                            <JobEmptyResult />
                        ) : (
                            <JobPostingRow jobs={jobs} loading={jobsLoading} isResumeBased={resumeReco} />
                        )}
                    </div>
                    <div className="job-posting__pagination">
                        <Pagination 
                            current={page}
                            total={totalPages}
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