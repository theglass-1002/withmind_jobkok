import React,{useState}from 'react'
import { Link, NavLink } from "react-router-dom";
import "./ResumeList.css";
import resume_banner1200x218 from '@/assets/icons/resume_banner1200x218.png';
import resume_illustration_bg from '@/assets/illustrations/resume_illustration_bg.png';
import add_btn_white20x20 from '@/assets/icons/add_btn_white20x20.png';
import ic_more_dot_gray24x24 from '@/assets/icons/ic_more_dot_gray24x24.png';
import icon_career from '@/assets/icons/icon_career_gray700_20.png';
import icon_education from '@/assets/icons/icon_education_gray700_20.png';
import icon_role from '@/assets/icons/icon_role_gray700_20.png';
import icon_copy from '@/assets/icons/icon_content_copy_gray900_20.png';
import icon_download from '@/assets/icons/icon_download_gray900_20.png';
import icon_trash from '@/assets/icons/icon_trash_red_20.png';
import icon_btn_black from '@/assets/icons/ic_add_btn_gray900_20.png';

import arrow_left from '@/assets/icons/keyboard_arrow_left.png';
import arrow_right from '@/assets/icons/keyboard_arrow_right.png';
import Pagination from "@/shared/components/Pagination";


export default function ResumeList() {
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<0|1|2>(0);
    
    
    return (
        <div className="resume-list-page">
        <div className="resume-list-page__banner">
        <img src={resume_banner1200x218} alt="이력서 배너" />
        </div>
        <div className="resume-list-page__banner mobile">
        <img src={resume_illustration_bg} alt="이력서 배너" />
        <span className="resume-cta-banner__subtitle">적합 공고 추천부터 맞춤 예상 질문까지</span>
            <div className="resume-cta-banner__content">
                <span className="resume-cta-banner__heading-line">지금 바로 이력서를 작성하고,</span>
                <span className="resume-cta-banner__heading-line">합격 가능성을</span>
                <span className="resume-cta-banner__heading-line">한층 더 높여보세요!</span>
            </div>
        </div>
        <div className="resume-list-page__body">
        <div className="resume-list-page__header">
        <span className="resume-list-page__stat resume-list-page__stat--total">총 
        <em>12건</em></span>
        <span className="resume-list-page__stat resume-list-page__stat--done">작성 완료 
            <em>10건</em>
        </span>
        </div>

        <div className="resume-list-page__tabs">
            <div className="resume-list-page__tabs-group">
                <span className={`resume-list-page__tab ${activeTab==0?'on':''}`} onClick={()=>setActiveTab(0)}>전체</span>
                <span className={`resume-list-page__tab ${activeTab==1?'on':''}`} onClick={()=>setActiveTab(1)}>작성완료</span>
                <span className={`resume-list-page__tab ${activeTab==2?'on':''}`} onClick={()=>setActiveTab(2)}>작성 중</span>
            </div>
            <NavLink to="/resumes/create" className="create_resumes default_btn_black">
            <img src={add_btn_white20x20} alt="" />
            새 이력서 작성</NavLink>

            <NavLink to="/resumes/m-create" className="create_resumes mobile default_btn_black">
            <img src={add_btn_white20x20} alt="" />
            새 이력서 작성</NavLink>
            </div>
            {activeTab==2?
            <div className="resume-list-page__empty">
            <div className="resume-list-page__empty-copy">
              <span className="resume-list-page__empty-title">아직 작성 중인 이력서가 없습니다.</span>
              <span className="resume-list-page__empty-subtext">
                AI 기반의 문장 및 키워드 추천 기능으로 간편하게 작성해 보세요.
              </span>
            </div>
            <NavLink to="/resumes/create" className="create_resumes default_btn_white">
            <img src={icon_btn_black} alt="" />
            새 이력서 작성</NavLink>
          </div>
            :<div className="resume-list-page__list">
                <ul className="resume-list-page__grid">
                <li className="resume-list-page__item">
                
                    <div className="resume-item__top">
                        <div className="resume-item__meta">
                        <span className="resume-item__id">12</span>
                        <span className="resume-item__tag on">기본이력서</span>
                        </div>
                        <div className="resume-item__actions">
                        <span className='resume-item__edit-btn'>
                        <img  src={ic_more_dot_gray24x24} alt="" 
                        />
                        <ul
                            className={`resume-item__menu`}
                            role="menu">
                            <li className="resume-item__menu-item" role="menuitem">
                                <img src={icon_copy} alt="" />
                                사본 만들기</li>
                            <li className="resume-item__menu-item" role="menuitem">
                                <img src={icon_download} alt="" />
                                PDF로 저장</li>
                            <li className="resume-item__menu-item delete" role="menuitem">
                                <img src={icon_trash} alt="" />
                                삭제</li>
                            </ul>
                        </span>
                        </div>
                    </div>

                    <div className="resume-item__title-row">
                        <span className="resume-item__title">성장하는 개발자 입니다.</span>
                        <span className="resume-item__date">2025.02.01.</span>
                    </div>

                    <div className="resume-item__attrs">
                        <div className="resume-item__attr resume-item__attr--role">
                        <div className="resume-item__attr-term">
                        <img src={icon_role} alt="" />
                        희망직무
                        </div>
                        <span className="resume-item__attr-value">프론트엔드</span>
                        </div>

                        <div className="resume-item__attr resume-item__attr--career">
                        <div className="resume-item__attr-term">
                        <img src={icon_career} alt="" />
                        경력
                        </div>
                        <span className="resume-item__attr-value">5년</span>
                        </div>

                        <div className="resume-item__attr resume-item__attr--education">
                        <div className="resume-item__attr-term">
                        <img src={icon_education} alt="" />
                        학력
                        </div>
                        <span className="resume-item__attr-value">컴공과</span>
                        </div>
                    </div>
                
                </li>
                <li className="resume-list-page__item">
                <div className="resume-item__top">
                    <div className="resume-item__meta">
                    <span className="resume-item__id">12</span>
                    <span className="resume-item__tag"></span>
                    </div>
                    <div className="resume-item__actions">
                    <span className='resume-item__edit-btn'>
                    <img  src={ic_more_dot_gray24x24} alt="" 
                    />
                    <ul
                        className={`resume-item__menu`}
                        role="menu">
                        <li className="resume-item__menu-item" role="menuitem">
                            <img src={icon_copy} alt="" />
                            사본 만들기</li>
                        <li className="resume-item__menu-item" role="menuitem">
                            <img src={icon_download} alt="" />
                            PDF로 저장</li>
                        <li className="resume-item__menu-item delete" role="menuitem">
                            <img src={icon_trash} alt="" />
                            삭제</li>
                        </ul>
                    </span>
                    </div>
                </div>

                <div className="resume-item__title-row">
                    <span className="resume-item__title">성장하는 개발자 입니다.</span>
                    <span className="resume-item__date">2025.02.01.</span>
                </div>

                <div className="resume-item__attrs">
                    <div className="resume-item__attr resume-item__attr--role">
                    <div className="resume-item__attr-term">
                    <img src={icon_role} alt="" />
                    희망직무
                    </div>
                    <span className="resume-item__attr-value">프론트엔드</span>
                    </div>

                    <div className="resume-item__attr resume-item__attr--career">
                    <div className="resume-item__attr-term">
                    <img src={icon_career} alt="" />
                    경력
                    </div>
                    <span className="resume-item__attr-value">5년</span>
                    </div>

                    <div className="resume-item__attr resume-item__attr--education">
                    <div className="resume-item__attr-term">
                    <img src={icon_education} alt="" />
                    학력
                    </div>
                    <span className="resume-item__attr-value">컴공과</span>
                    </div>
                </div>
            
            </li>
            <li className="resume-list-page__item">
                
                <div className="resume-item__top">
                    <div className="resume-item__meta">
                    <span className="resume-item__id">12</span>
                    <span className="resume-item__tag"></span>
                    </div>
                    <div className="resume-item__actions">
                    <span className='resume-item__edit-btn'>
                    <img  src={ic_more_dot_gray24x24} alt="" 
                    />
                    <ul
                        className={`resume-item__menu`}
                        role="menu">
                        <li className="resume-item__menu-item" role="menuitem">
                            <img src={icon_copy} alt="" />
                            사본 만들기</li>
                        <li className="resume-item__menu-item" role="menuitem">
                            <img src={icon_download} alt="" />
                            PDF로 저장</li>
                        <li className="resume-item__menu-item delete" role="menuitem">
                            <img src={icon_trash} alt="" />
                            삭제</li>
                        </ul>
                    </span>
                    </div>
                </div>

                <div className="resume-item__title-row">
                    <span className="resume-item__title">성장하는 개발자 입니다.</span>
                    <span className="resume-item__date">2025.02.01.</span>
                </div>

                <div className="resume-item__attrs">
                    <div className="resume-item__attr resume-item__attr--role">
                    <div className="resume-item__attr-term">
                    <img src={icon_role} alt="" />
                    희망직무
                    </div>
                    <span className="resume-item__attr-value">프론트엔드</span>
                    </div>

                    <div className="resume-item__attr resume-item__attr--career">
                    <div className="resume-item__attr-term">
                    <img src={icon_career} alt="" />
                    경력
                    </div>
                    <span className="resume-item__attr-value">5년</span>
                    </div>

                    <div className="resume-item__attr resume-item__attr--education">
                    <div className="resume-item__attr-term">
                    <img src={icon_education} alt="" />
                    학력
                    </div>
                    <span className="resume-item__attr-value">컴공과</span>
                    </div>
                </div>
            
            </li>
            <li className="resume-list-page__item">
                
                <div className="resume-item__top">
                    <div className="resume-item__meta">
                    <span className="resume-item__id">12</span>
                    <span className="resume-item__tag"></span>
                    </div>
                    <div className="resume-item__actions">
                    <span className='resume-item__edit-btn'>
                    <img  src={ic_more_dot_gray24x24} alt="" 
                    />
                    <ul
                        className={`resume-item__menu`}
                        role="menu">
                        <li className="resume-item__menu-item" role="menuitem">
                            <img src={icon_copy} alt="" />
                            사본 만들기</li>
                        <li className="resume-item__menu-item" role="menuitem">
                            <img src={icon_download} alt="" />
                            PDF로 저장</li>
                        <li className="resume-item__menu-item delete" role="menuitem">
                            <img src={icon_trash} alt="" />
                            삭제</li>
                        </ul>
                    </span>
                    </div>
                </div>

                <div className="resume-item__title-row">
                    <span className="resume-item__title">성장하는 개발자 입니다.</span>
                    <span className="resume-item__date">2025.02.01.</span>
                </div>

                <div className="resume-item__attrs">
                    <div className="resume-item__attr resume-item__attr--role">
                    <div className="resume-item__attr-term">
                    <img src={icon_role} alt="" />
                    희망직무
                    </div>
                    <span className="resume-item__attr-value">프론트엔드</span>
                    </div>

                    <div className="resume-item__attr resume-item__attr--career">
                    <div className="resume-item__attr-term">
                    <img src={icon_career} alt="" />
                    경력
                    </div>
                    <span className="resume-item__attr-value">5년</span>
                    </div>

                    <div className="resume-item__attr resume-item__attr--education">
                    <div className="resume-item__attr-term">
                    <img src={icon_education} alt="" />
                    학력
                    </div>
                    <span className="resume-item__attr-value">컴공과</span>
                    </div>
                </div>
            </li>
        
            </ul>
            </div>}
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
    );
}
