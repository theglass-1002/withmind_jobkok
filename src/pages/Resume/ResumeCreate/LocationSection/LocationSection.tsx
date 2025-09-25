import React,{useState}from 'react'
import { Link, NavLink } from "react-router-dom";
import "./LocationSection.css";

import check_box_purple from '@/assets/icons/check_box_purple.png';
import check_box_outline_blank_gray from '@/assets/icons/size24/ic_check_box_blank_gray400_24.png';

import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import chevron_right_gray_light from '@/assets/icons/chevron_right_gray_light.png';

import close_gray from '@/assets/icons/close_gray.png';



export default function LocationSection() {
    const [allChecked, setAllChecked] = useState(false);
    const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const isOn = (key: string) => activeCategory === key;

    const toggleCategory = (key: string) =>
      setActiveCategory(prev => (prev === key ? null : key));
    
    const onClickRole = (key: string) => {
        setAllChecked(false);
        setCheckedRoles(prev => {
          const next = new Set(prev);
          next.has(key) ? next.delete(key) : next.add(key);
          return next;
        });
      };
  
  const onClickAll = () => {
    setAllChecked(prev => {
      const next = !prev;
      if (next) setCheckedRoles(new Set()); 
      return next;
    });
  };
  
    return (
      <div className="resume-create-page__section resume-create-page__section--location">
           <div className="resume-create-page__section-title resume-create-page__section-title--simple">
                <div className="resume-create-page__section-title__heading">
                희망 근무 지역 <em className="resume-create-page__required">*</em>
                </div>
                <span className="resume-create-page__hint">최대 5개까지 추가 가능합니다.</span>
                <span className="resume-create-page__error">1개 이상 추가해 주세요.</span>
            </div>
            <div className='resume-create-page__selected'>
            <div className="location-picker__chip">
                <div className="location-picker__chip-body">
                  <span className="location-picker__chip-group">서울</span>
                  <span className="location-picker__chip-role">
                    <span className="location-picker__chip-chevron"><img src={chevron_right_black} alt="" /></span>
                    지역 전체
                  </span>
                </div>
                <span className="location-picker__chip-close"><img src={close_gray} alt="" /></span>
              </div>
              <div className='location-picker__chip'>서울</div>
              </div>
            <div className="resume-create-page__location">
              <div className="location-picker">
                <div className="location-picker__header">
                <div
                    className={`location-picker__role total ${checkedRoles.has('server_dev') ? 'on' : ''}`}
                          onClick={() => onClickRole('server_dev')}>
                            <img src={checkedRoles.has('server_dev') ? check_box_purple : check_box_outline_blank_gray} alt="" />
                          <span className="location-picker__option-label">지역 전체</span>
                    </div>
                </div>
                <div className="location-picker__body">
                <div className="location-picker__column location-picker__column--left">
                      <div className="location-picker__category-group">
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
                      <div className="location-picker__category-group location-picker__group--right">
                        <div
                          className={`location-picker__role location-picker__option--all ${allChecked ? 'on' : ''}`}
                          onClick={onClickAll}
                        >
                          <span className="location-picker__checkbox">
                            <img src={allChecked ? check_box_purple : check_box_outline_blank_gray} alt="" />
                          </span>
                          <span className="location-picker__option-label">서울 전체</span>
                        </div>

                        <div
                          className={`location-picker__role ${checkedRoles.has('server_dev') ? 'on' : ''}`}
                          onClick={() => onClickRole('server_dev')}
                        >
                          <span className="location-picker__checkbox">
                            <img src={checkedRoles.has('server_dev') ? check_box_purple : check_box_outline_blank_gray} alt="" />
                          </span>
                          <span className="location-picker__option-label">강남구</span>
                        </div>

                        <div
                          className={`location-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
                          onClick={() => onClickRole('software_engineer')}
                        >
                          <span className="location-picker__checkbox">
                            <img src={checkedRoles.has('software_engineer') ? check_box_purple : check_box_outline_blank_gray} alt="" />
                          </span>
                          <span className="location-picker__option-label">강동구</span>
                        </div>

                        <div
                          className={`location-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
                          onClick={() => onClickRole('software_engineer')}
                        >
                          <span className="location-picker__checkbox">
                            <img src={checkedRoles.has('software_engineer') ? check_box_purple : check_box_outline_blank_gray} alt="" />
                          </span>
                          <span className="location-picker__option-label">강북구</span>
                        </div>

                        <div
                          className={`location-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
                          onClick={() => onClickRole('software_engineer')}
                        >
                          <span className="location-picker__checkbox">
                            <img src={checkedRoles.has('software_engineer') ? check_box_purple : check_box_outline_blank_gray} alt="" />
                          </span>
                          <span className="location-picker__option-label">관악구</span>
                        </div>

                        <div
                          className={`location-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
                          onClick={() => onClickRole('software_engineer')}
                        >
                          <span className="location-picker__checkbox">
                            <img src={checkedRoles.has('software_engineer') ? check_box_purple : check_box_outline_blank_gray} alt="" />
                          </span>
                          <span className="location-picker__option-label">관악구</span>
                        </div>

                        <div
                          className={`location-picker__role ${checkedRoles.has('software_engineer') ? 'on' : ''}`}
                          onClick={() => onClickRole('software_engineer')}
                        >
                          <span className="location-picker__checkbox">
                            <img src={checkedRoles.has('software_engineer') ? check_box_purple : check_box_outline_blank_gray} alt="" />
                          </span>
                          <span className="location-picker__option-label">관악구</span>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>  
    );
}
