import React, { useState, useEffect } from "react";


import check_box_purple from '@/assets/icons/check_box_purple.png';
import check_box_outline_blank_gray from '@/assets/icons/check_box_outline_blank_gray.png';


import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import chevron_right_gray_light from '@/assets/icons/chevron_right_gray_light.png';
import refresh_black from '@/assets/icons/refresh_black.png';
import ic_close_gray500_20 from '@/assets/icons/size20/ic_close_gray500_20.png';

import "./ModalLocationPicker.css";




export default function ModalLocationPicker() {
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
  <div className="location-picker location-picker--popup">
  <div className="location-picker__body">
    <div className="location-picker__column location-picker__column--left">
      <div className="location-picker__category_group">
        <div
          className={`location-picker__category ${isOn('dev') ? 'on' : ''}`}
          onClick={() => toggleCategory('dev')}
        >
          <div className="location-picker__category-meta">
            <span className="location-picker__category-title">서울</span>
            <span className="location-picker__category-count">3</span>
          </div>
          <span className="location-picker__category-toggle">
            <img src={chevron_right_gray_light} alt="" />
          </span>
        </div>

        <div
          className={`location-picker__category ${isOn('mkt') ? 'on' : ''}`}
          onClick={() => toggleCategory('mkt')}
        >
          <div className="location-picker__category-meta">
            <span className="location-picker__category-title">부산</span>
            <span className="location-picker__category-count">3</span>
          </div>
          <span className="location-picker__category-toggle">
            <img src={chevron_right_gray_light} alt="" />
          </span>
        </div>

        <div
          className={`location-picker__category ${isOn('biz') ? 'on' : ''}`}
          onClick={() => toggleCategory('biz')}
        >
          <div className="location-picker__category-meta">
            <span className="location-picker__category-title">대구</span>
            <span className="location-picker__category-count">3</span>
          </div>
          <span className="location-picker__category-toggle">
            <img src={chevron_right_gray_light} alt="" />
          </span>
        </div>

        <div
          className={`location-picker__category ${isOn('biz') ? 'on' : ''}`}
          onClick={() => toggleCategory('biz')}
        >
          <div className="location-picker__category-meta">
            <span className="location-picker__category-title">인천</span>
            <span className="location-picker__category-count">3</span>
          </div>
          <span className="location-picker__category-toggle">
            <img src={chevron_right_gray_light} alt="" />
          </span>
        </div>

        <div
          className={`location-picker__category ${isOn('biz') ? 'on' : ''}`}
          onClick={() => toggleCategory('biz')}
        >
          <div className="location-picker__category-meta">
            <span className="location-picker__category-title">광주</span>
            <span className="location-picker__category-count">3</span>
          </div>
          <span className="location-picker__category-toggle">
            <img src={chevron_right_gray_light} alt="" />
          </span>
        </div>

        <div
          className={`location-picker__category ${isOn('biz') ? 'on' : ''}`}
          onClick={() => toggleCategory('biz')}
        >
          <div className="location-picker__category-meta">
            <span className="location-picker__category-title">대전</span>
            <span className="location-picker__category-count">3</span>
          </div>
          <span className="location-picker__category-toggle">
            <img src={chevron_right_gray_light} alt="" />
          </span>
        </div>

        <div
          className={`location-picker__category ${isOn('biz') ? 'on' : ''}`}
          onClick={() => toggleCategory('biz')}
        >
          <div className="location-picker__category-meta">
            <span className="location-picker__category-title">경영ㆍ비즈니스</span>
            <span className="location-picker__category-count">3</span>
          </div>
          <span className="location-picker__category-toggle">
            <img src={chevron_right_gray_light} alt="" />
          </span>
        </div>
      </div>
    </div>

    <div className="location-picker__column location-picker__column--right">
      <div className="location-picker__group location-picker__group--right">
        <div
          className={`location-picker__role location-picker__role--all ${allChecked ? 'on' : ''}`}
          onClick={onClickAll}
        >
          <span className="location-picker__checkbox-wrap">
            <img src={`${allChecked ? check_box_purple : check_box_outline_blank_gray}`} alt="" />
          </span>
          <span className="location-picker__role-label">서울 전체</span>
        </div>

        <div
          className={`location-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
          onClick={() => onClickRole('server_dev')}
        >
          <span className="location-picker__checkbox-wrap">
            <img src={`${checkedRoles.has('server_dev') ? check_box_purple : check_box_outline_blank_gray}`} alt="" />
          </span>
          <span className="location-picker__role-label">강남구</span>
        </div>

        <div
          className={`location-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
          onClick={() => onClickRole('software_engineer')}
        >
          <span className="location-picker__checkbox-wrap">
            <img src={`${checkedRoles.has('software_engineer') ? check_box_purple : check_box_outline_blank_gray}`} alt="" />
          </span>
          <span className="location-picker__role-label">강동구</span>
        </div>

        <div
          className={`location-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
          onClick={() => onClickRole('software_engineer')}
        >
          <span className="location-picker__checkbox-wrap">
            <img src={`${checkedRoles.has('software_engineer') ? check_box_purple : check_box_outline_blank_gray}`} alt="" />
          </span>
          <span className="location-picker__role-label">강북구</span>
        </div>

        <div
          className={`location-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
          onClick={() => onClickRole('software_engineer')}
        >
          <span className="location-picker__checkbox-wrap">
            <img src={`${checkedRoles.has('software_engineer') ? check_box_purple : check_box_outline_blank_gray}`} alt="" />
          </span>
          <span className="location-picker__role-label">관악구</span>
        </div>

        <div
          className={`location-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
          onClick={() => onClickRole('software_engineer')}
        >
          <span className="location-picker__checkbox-wrap">
            <img src={`${checkedRoles.has('software_engineer') ? check_box_purple : check_box_outline_blank_gray}`} alt="" />
          </span>
          <span className="location-picker__role-label">관악구</span>
        </div>

        <div
          className={`location-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
          onClick={() => onClickRole('software_engineer')}
        >
          <span className="location-picker__checkbox-wrap">
            <img src={`${checkedRoles.has('software_engineer') ? check_box_purple : check_box_outline_blank_gray}`} alt="" />
          </span>
          <span className="location-picker__role-label">관악구</span>
        </div>
      </div>
    </div>
  </div>

  <div className="location-picker__options">
    <span className="location-picker__options-note">※ 옵션은 최대 5개까지 선택 가능합니다.</span>
    <div className="location-picker__selected">
      <div className="location-picker__chip">
        <div className="location-picker__chip-body">
          <span className="location-picker__chip-group">서울</span>
          <span className="location-picker__chip-role">
            <span className="location-picker__chip-chevron"><img src={chevron_right_black} alt="" /></span>
             강남구
          </span>
        </div>
        <span className="location-picker__chip-close"><img src={ic_close_gray500_20} alt="" /></span>
      </div>

      <div className="location-picker__chip">
        <div className="location-picker__chip-body">
          <span className="location-picker__chip-group">서울</span>
          <span className="location-picker__chip-role">
            <span className="location-picker__chip-chevron"><img src={chevron_right_black} alt="" /></span>
            관악구
          </span>
        </div>
        <span className="location-picker__chip-close"><img src={ic_close_gray500_20} alt="" /></span>
      </div>
    </div>
  </div>

  <div className="location-picker__actions">
    <div className="default_btn_white" onClick={handleReset}>
      <span className="location-picker__reset-icon">
        <img src={refresh_black} alt="" />
      </span>
      <span className="location-picker__reset-text">초기화</span>
    </div>
    <span className="default_btn_black">적용</span>
  </div>
</div>

    </>
  );
}

