import React, { useState, useEffect } from "react";


import check_box_purple from '@/assets/icons/check_box_purple.png';
import check_box_outline_blank_gray from '@/assets/icons/check_box_outline_blank_gray.png';


import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import chevron_right_gray_light from '@/assets/icons/chevron_right_gray_light.png';
import refresh_black from '@/assets/icons/refresh_black.png';
import ic_close_gray500_20 from '@/assets/icons/size20/ic_close_gray500_20.png';

import "./ModalJobRolePicker.css";




export default function ModalJobRolePicker() {
  const [allChecked, setAllChecked] = useState(false);
  const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const isOn = (key: string) => activeCategory === key;

  const toggleCategory = (key: string) =>
    setActiveCategory(prev => (prev === key ? null : key));
  

const onClickAll = () => {
  setAllChecked(prev => {
    const next = !prev;
    if (next) setCheckedRoles(new Set()); 
    return next;
  });
};


const onClickRole = (key: string) => {
  setAllChecked(false);
  setCheckedRoles(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });
};

const handleReset = () => {
  setAllChecked(false);          
  setCheckedRoles(new Set());    
  setActiveCategory(null);
};

  return (
    <>
      <div className="job-role-picker job-role-picker--popup">
                    <div className="job-role-picker__body">
                      <div className="job-role-picker__column job-role-picker__column--left">
                        <div className="job-role-picker__category_group">
                        <div
                            className={`job-role-picker__category ${isOn('dev') ? 'on' : ''}`}
                            onClick={() => toggleCategory('dev')}
                            >
                              <div className="job-role-picker__category-meta">
                                <span className="job-role-picker__category-title">개발</span>
                                <span className="job-role-picker__category-count">3</span>
                              </div>
                              <span className="job-role-picker__category-toggle">
                                <img src={chevron_right_gray_light} alt="" />
                              </span>
                         </div>
                         <div 
                         className={`job-role-picker__category ${isOn('mkt') ? 'on' : ''}`}
                         onClick={() => toggleCategory('mkt')} >
                              <div className="job-role-picker__category-meta">
                                <span className="job-role-picker__category-title">마케팅ㆍ광고</span>
                                <span className="job-role-picker__category-count">3</span>
                              </div>
                              <span className="job-role-picker__category-toggle">
                              <img src={chevron_right_gray_light} alt="" />
                              </span>
                         </div>
                         <div 
                           className={`job-role-picker__category ${isOn('biz') ? 'on' : ''}`}
                           onClick={() => toggleCategory('biz')}
                         >
                              <div className="job-role-picker__category-meta">
                                <span className="job-role-picker__category-title">경영ㆍ비즈니스</span>
                                <span className="job-role-picker__category-count">3</span>
                              </div>
                              <span className="job-role-picker__category-toggle">
                              <img src={chevron_right_gray_light} alt="" />
                              </span>
                         </div>
                         <div 
                           className={`job-role-picker__category ${isOn('biz') ? 'on' : ''}`}
                           onClick={() => toggleCategory('biz')}
                         >
                              <div className="job-role-picker__category-meta">
                                <span className="job-role-picker__category-title">경영ㆍ비즈니스</span>
                                <span className="job-role-picker__category-count">3</span>
                              </div>
                              <span className="job-role-picker__category-toggle">
                              <img src={chevron_right_gray_light} alt="" />
                              </span>
                         </div>
                         <div 
                           className={`job-role-picker__category ${isOn('biz') ? 'on' : ''}`}
                           onClick={() => toggleCategory('biz')}
                         >
                              <div className="job-role-picker__category-meta">
                                <span className="job-role-picker__category-title">경영ㆍ비즈니스</span>
                                <span className="job-role-picker__category-count">3</span>
                              </div>
                              <span className="job-role-picker__category-toggle">
                              <img src={chevron_right_gray_light} alt="" />
                              </span>
                         </div>
                         <div 
                           className={`job-role-picker__category ${isOn('biz') ? 'on' : ''}`}
                           onClick={() => toggleCategory('biz')}
                         >
                              <div className="job-role-picker__category-meta">
                                <span className="job-role-picker__category-title">경영ㆍ비즈니스</span>
                                <span className="job-role-picker__category-count">3</span>
                              </div>
                              <span className="job-role-picker__category-toggle">
                              <img src={chevron_right_gray_light} alt="" />
                              </span>
                         </div>
                         <div 
                           className={`job-role-picker__category ${isOn('biz') ? 'on' : ''}`}
                           onClick={() => toggleCategory('biz')}
                         >
                              <div className="job-role-picker__category-meta">
                                <span className="job-role-picker__category-title">경영ㆍ비즈니스</span>
                                <span className="job-role-picker__category-count">3</span>
                              </div>
                              <span className="job-role-picker__category-toggle">
                              <img src={chevron_right_gray_light} alt="" />
                              </span>
                         </div>
                      
                        </div>
                      </div>
                      <div className="job-role-picker__column job-role-picker__column--right">
                      <div className="job-role-picker__group job-role-picker__group--right">                 
                        <div className={`job-role-picker__role job-role-picker__role--all ${allChecked?'on':''}`}
                          onClick={onClickAll}>
                          <span className="job-role-picker__checkbox-wrap">
                          <img src={`${allChecked?check_box_purple:check_box_outline_blank_gray}`} alt="" />
                          </span>
                          <span className="job-role-picker__role-label">개발전체</span>
                        </div>
                        <div 
                        className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
                        onClick={() => onClickRole('server_dev')}
                        >
                          <span className="job-role-picker__checkbox-wrap">
                          <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
                           </span>
                          <span className="job-role-picker__role-label">서버 개발자</span>
                        </div>
                        <div 
                        className={`job-role-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
                        onClick={() => onClickRole('software_engineer')}
                        >
                          <span className="job-role-picker__checkbox-wrap">
                          <img src={`${checkedRoles.has('software_engineer')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
                           </span>
                          <span className="job-role-picker__role-label">소프트웨어 엔지니어</span>
                        </div>
                        <div 
                        className={`job-role-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
                        onClick={() => onClickRole('software_engineer')}
                        >
                          <span className="job-role-picker__checkbox-wrap">
                          <img src={`${checkedRoles.has('software_engineer')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
                           </span>
                          <span className="job-role-picker__role-label">소프트웨어 엔지니어</span>
                        </div>
                        <div 
                        className={`job-role-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
                        onClick={() => onClickRole('software_engineer')}
                        >
                          <span className="job-role-picker__checkbox-wrap">
                          <img src={`${checkedRoles.has('software_engineer')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
                           </span>
                          <span className="job-role-picker__role-label">소프트웨어 엔지니어</span>
                        </div>
                        <div 
                        className={`job-role-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
                        onClick={() => onClickRole('software_engineer')}
                        >
                          <span className="job-role-picker__checkbox-wrap">
                          <img src={`${checkedRoles.has('software_engineer')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
                           </span>
                          <span className="job-role-picker__role-label">소프트웨어 엔지니어</span>
                        </div>
                        <div 
                        className={`job-role-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
                        onClick={() => onClickRole('software_engineer')}
                        >
                          <span className="job-role-picker__checkbox-wrap">
                          <img src={`${checkedRoles.has('software_engineer')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
                           </span>
                          <span className="job-role-picker__role-label">소프트웨어 엔지니어</span>
                        </div>
                      </div>
                    </div>

                    </div>

                    <div className="job-role-picker__options">
                      <span className="job-role-picker__options-note">※ 옵션은 최대 5개까지 선택 가능합니다.</span>
                      <div className="job-role-picker__selected">
                        <div className="job-role-picker__chip">
                          <div className="job-role-picker__chip-body">
                            <span className="job-role-picker__chip-group">개발</span>
                       
                            <span className="job-role-picker__chip-role">
                             <span className="job-role-picker__chip-chevron"><img src={chevron_right_black} alt="" /></span> 
                              프론트엔드 개발자</span>
                          </div>
                          <span className="job-role-picker__chip-close"><img src={ic_close_gray500_20} alt="" /></span>
                        </div>
                        <div className="job-role-picker__chip">
                          <div className="job-role-picker__chip-body">
                            <span className="job-role-picker__chip-group">개발</span>
                       
                            <span className="job-role-picker__chip-role">
                             <span className="job-role-picker__chip-chevron"><img src={chevron_right_black} alt="" /></span> 
                              웹 개발자</span>
                          </div>
                          <span className="job-role-picker__chip-close"><img src={ic_close_gray500_20} alt="" /></span>
                        </div>
                        <div className="job-role-picker__chip">
                          <div className="job-role-picker__chip-body">
                            <span className="job-role-picker__chip-group">개발</span>
                       
                            <span className="job-role-picker__chip-role">
                             <span className="job-role-picker__chip-chevron"><img src={chevron_right_black} alt="" /></span> 
                              안드로이드 개발자</span>
                          </div>
                          <span className="job-role-picker__chip-close"><img src={ic_close_gray500_20} alt="" /></span>
                        </div>
                        <div className="job-role-picker__chip">
                          <div className="job-role-picker__chip-body">
                            <span className="job-role-picker__chip-group">마케팅ㆍ광고 전체</span>
                          </div>
                          <span className="job-role-picker__chip-close"><img src={ic_close_gray500_20} alt="" /></span>
                        </div>
                        <div className="job-role-picker__chip">
                          <div className="job-role-picker__chip-body">
                            <span className="job-role-picker__chip-group">디자인</span>
                       
                            <span className="job-role-picker__chip-role">
                             <span className="job-role-picker__chip-chevron"><img src={chevron_right_black} alt="" /></span> 
                              UX 디자이너</span>
                          </div>
                          <span className="job-role-picker__chip-close"><img src={ic_close_gray500_20} alt="" /></span>
                        </div>
                      </div>
                    </div>
                    <div className="job-role-picker__actions">
                      <div className="default_btn_white" onClick={handleReset}>
                        <span className="job-role-picker__reset-icon">
                          <img src={refresh_black} alt="" />
                        </span>
                        <span className="job-role-picker__reset-text">초기화</span>
                      </div>
                      <span className="default_btn_black">적용</span>
                    </div>
                  </div>
    </>
  );
}

