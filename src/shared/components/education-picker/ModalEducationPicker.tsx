import React, { useState, useEffect } from "react";


import check_box_purple from '@/assets/icons/check_box_purple.png';
import check_box_outline_blank_gray from '@/assets/icons/check_box_outline_blank_gray.png';


import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import chevron_right_gray_light from '@/assets/icons/chevron_right_gray_light.png';
import refresh_black from '@/assets/icons/refresh_black.png';
import ic_close_gray500_20 from '@/assets/icons/size20/ic_close_gray500_20.png';

import "./ModalEducationPicker.css";




export default function ModalEducationPicker() {
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
    <div className="education-picker education-picker--popup">
      <div className="education-picker__body">
        <div className="education-picker__column education-picker__column--left">
         <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">학력 무관</span>
            </div>  
            <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">고교 졸업 이하</span>
            </div>  
            <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">고등학교 졸업</span>
            </div>  
            <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">대학 졸업(2, 3년제)</span>
            </div>  
        </div>

        <div className="education-picker__column education-picker__column--right">
        <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">대학 졸업(4년제)</span>
            </div>  
            <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">대학원 석사 졸업</span>
            </div>  
            <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">대학원 박사 졸업</span>
            </div> 
        </div>
      </div>

      <div className="education-picker__options">
        <span className="education-picker__options-note">※ 옵션은 최대 5개까지 선택 가능합니다.</span>
        <div className="education-picker__selected">
          <div className="education-picker__chip">
            <div className="education-picker__chip-body">
              <span className="education-picker__chip-group">대학교(4년)</span>
              <span className="education-picker__chip-role">
                <span className="education-picker__chip-chevron">
                  <img src={chevron_right_black} alt="" />
                </span>
                졸업
              </span>
            </div>
            <span className="education-picker__chip-close">
              <img src={ic_close_gray500_20} alt="" />
            </span>
          </div>

          <div className="education-picker__chip">
            <div className="education-picker__chip-body">
              <span className="education-picker__chip-group">대학원(석사)</span>
              <span className="education-picker__chip-role">
                <span className="education-picker__chip-chevron">
                  <img src={chevron_right_black} alt="" />
                </span>
                재학
              </span>
            </div>
            <span className="education-picker__chip-close">
              <img src={ic_close_gray500_20} alt="" />
            </span>
          </div>

          <div className="education-picker__chip">
            <div className="education-picker__chip-body">
              <span className="education-picker__chip-group">고등학교</span>
              <span className="education-picker__chip-role">
                <span className="education-picker__chip-chevron">
                  <img src={chevron_right_black} alt="" />
                </span>
                졸업
              </span>
            </div>
            <span className="education-picker__chip-close">
              <img src={ic_close_gray500_20} alt="" />
            </span>
          </div>
        </div>
      </div>

      <div className="education-picker__actions">
        <div className="default_btn_white" onClick={handleReset}>
          <span className="education-picker__reset-icon">
            <img src={refresh_black} alt="" />
          </span>
          <span className="education-picker__reset-text">초기화</span>
        </div>
        <span className="default_btn_black">적용</span>
      </div>
    </div>

    <div className="education-picker education-picker--popup mobile">
      <div className="education-picker__body">
      <span className="education-picker__options-note">※ 옵션은 최대 5개까지 선택 가능합니다.</span>
        <div className="education-picker__column education-picker__column--left">
         <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">학력 무관</span>
            </div>  
            <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">고교 졸업 이하</span>
            </div>  
            <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">고등학교 졸업</span>
            </div>  
            <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">대학 졸업(2, 3년제)</span>
            </div>  
        </div>

        <div className="education-picker__column education-picker__column--right">
        <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">대학 졸업(4년제)</span>
            </div>  
            <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">대학원 석사 졸업</span>
            </div>  
            <div 
            className={`job-role-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
             onClick={() => onClickRole('server_dev')}>
              <span className="job-role-picker__checkbox-wrap">
             <img src={`${checkedRoles.has('server_dev')?check_box_purple:check_box_outline_blank_gray}`} alt="" />
              </span>
            <span className="job-role-picker__role-label">대학원 박사 졸업</span>
            </div> 
        </div>
      </div>

    </div>
  </>
);
}