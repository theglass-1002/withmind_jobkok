import React,{useState}from 'react'
import { Link, NavLink } from "react-router-dom";
import "./ResumeCreate.css";

import Switch from "react-switch";

import resume_banner1200x218 from '@/assets/icons/resume_banner1200x218.png';
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


import BasicInfoSection from "./ResumeCreate/BasicInfoSection/BasicInfoSection";
import LocationSection from "./ResumeCreate/LocationSection/LocationSection";



import Pagination from "@/shared/components/Pagination";


import ModalLocationPicker from "@/shared/components/location-picker/ModalLocationPicker";

import check_box_purple from '@/assets/icons/check_box_purple.png';
import check_box_outline_blank_gray from '@/assets/icons/check_box_outline_blank_gray.png';


import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import chevron_right_gray_light from '@/assets/icons/chevron_right_gray_light.png';


import ic_arrow_drop_down from '@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png';
import ic_calendar_gray900_20 from '@/assets/icons/size20/ic_calendar_gray900_20.png';
import ic_error_red100_20 from '@/assets/icons/size20/ic_error_red100_20.png';
import ic_star_gray700_20 from '@/assets/icons/size20/ic_star_gray700_20.png';
import ic_trash_gray500_20 from '@/assets/icons/size20/ic_trash_gray500_20.png';
import icon_calendar_red_20 from '@/assets/icons/size20/icon_calendar_red_20.png';

import ic_add_purple_20 from '@/assets/icons/size20/ic_add_purple_20.png';
import ic_add_btn_gray700_20 from '@/assets/icons/size20/ic_add_btn_gray700_20.png';


import ic_key_arrow_down_gray500_20 from '@/assets/icons/size20/ic_key_arrow_down_gray500_20.png';
import ic_key_arrow_up_gray500_20 from '@/assets/icons/size20/ic_key_arrow_up_gray500_20.png';










import refresh_black from '@/assets/icons/refresh_black.png';
import close_gray from '@/assets/icons/close_gray.png';


type FormState = { basic: BasicInfo };
const initial: FormState = {
  basic: { name:'', birth:'', gender:null, email:'', phone:'', photoUrl:'' },
};


export default function ResumeCreate() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<{ basic: BasicErrors }>({ basic: {} });

    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<0|1|2>(0);
    const [resumeReco, setResumeReco] = useState(true); // 이력서 기반 추천 토글
    const [allChecked, setAllChecked] = useState(false);
    const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const isOn = (key: string) => activeCategory === key;
  

    const updateBasic = (patch: Partial<BasicInfo>) =>
      setForm(prev => ({ ...prev, basic: { ...prev.basic, ...patch } }));
  
    const resetBasicErrors = () => setErrors(prev => ({ ...prev, basic: {} }));
  
    const validateBasic = (b: BasicInfo): BasicErrors => {
      const e: BasicErrors = {};
      if (!b.name.trim()) e.name = '이름을 입력해 주세요.';
      if (!b.birth.trim()) e.birth = '생년월일을 입력해 주세요.';
      if (!b.gender) e.gender = '성별을 선택해 주세요.';
      if (!b.email.trim()) e.email = '이메일을 입력해 주세요.';
      if (!b.phone.trim()) e.phone = '연락처를 입력해 주세요.';
      return e;
    };
  

    const onSubmit = () => {
      const be = validateBasic(form.basic);
      setErrors({ basic: be });
      if (Object.keys(be).length) return; // 에러 있으면 중단
      // ✅ 서버 전송
    };

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
      <div className="resume-create-page">
      <div className="resume-create-page__status">
        <span className="default_btn_white">임시저장</span>
        <span className="default_btn_black">작성 완료</span>
      </div>
    
      <div className="resume-create-page__container">
        <div className="resume-create-page__main">
        <div className="resume-create-page__section resume-create-page__section--title">
        <div className="resume-create-page__field">
            <span className="resume-create-page__label">이력서 제목을 입력해 주세요. *</span>
            <span className="resume-create-page__error">이력서 제목을 입력해 주세요.</span>
            </div>
            <div className="resume-create-page__assist">
            <span className="resume-create-page__assist-text">
              <img src={ic_star_gray700_20} alt="" />
                더 적합한 문장을 추천을 위해 아래 항목들을 먼저 채워주세요.</span>
                <span className="career-section__summary-ai-btn">
                AI 문장 추천</span>
            </div>
          </div>
          <BasicInfoSection
              values={form.basic}
              errors={errors.basic}
              onChange={updateBasic}
              onFocusAny={resetBasicErrors}
           />
            <LocationSection
             
           />
{/*          
            <div className="resume-create-page__section resume-create-page__section--location">
            <div className="resume-create-page__section-title">
              <div className="resume-create-page__section-title-main">
                <span className='section-title'>희망 근무 지역 <em className='required-mark'>*</em></span>
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
                    강남구
                  </span>
                </div>
                <span className="location-picker__chip-close"><img src={close_gray} alt="" /></span>
              </div>
              <div className='location-picker__chip'>서울</div>
              </div>
            <div className="resume-create-page__location">
              <div className="location-picker">
             
                <div className="location-picker__header">
                  <label className="location-picker__select-all">
                    <input type="checkbox" />
                    <span className="location-picker__select-all-label">전체지역</span>
                  </label>
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
          </div> */}
          <div className="resume-create-page__section resume-create-page__section--career">
          <div className="resume-create-page__section-title">
              <div className="resume-section-title">
              <div className='section-title'>
              경력 <em className='required-mark'>*</em>
              </div>
                <div className="resume-section-title__actions">
                  <label className="resume-section-title__control resume-section-title__control--fresh">
                    <input type="checkbox" className="resume-section-title__checkbox" />
                    <span className="resume-section-title__control-label">신입</span>
                  </label>
                  <span className="resume-section-title__action--import">
                   <img src={ic_add_purple_20} alt="" />
                    경력 불러오기
                  </span>
                </div>

              </div>
            </div>

            <div className="resume-create-page__section-body career-section">
              <div className="career-section__item">
              <div className="career-section__fields">
              
                  <div className="field in_icon">
                      <label className="label" >
                        회사명 <em>*</em>
                      </label>
                      <div className="input-group">
                        <input id="password" className="form-input" type="text" required />
                          <span>
                          <img src={ic_error_red100_20} alt="" />
                          </span>
                      </div>
                     </div>
                  <div className="career-section__group career-section__group--employment">
                    <div className="career-section__control career-section__control--employment">
                    <label className="labe_black">
                      재직 기간 <em className="error_text_red">*</em>
                    </label>
                    <div className="career-section__select">재직 형태</div>
                    </div>

                    <div className="career-section__period">
                    <div className="career-section date career-section__date--start">
                      <div className="career-section__date-inner">
                        <span className="career-section__date-input">
                          <img src={icon_calendar_red_20} alt="" />
                          <span className="career-section__date-value">YYYY.MM</span>
                        </span>
                          <img src={ic_error_red100_20} alt="" />
                        </div>
                    </div>
                      <span className="career-section__tilde">~</span>
                      <div className="career-section date career-section__date--end">
                      <div className="career-section__date-inner">
                        <span className="career-section__date-input">
                          <img src={icon_calendar_red_20} alt="" />
                          <span className="career-section__date-value">YYYY.MM</span>
                        </span>
                          <img src={ic_error_red100_20} alt="" />
                        </div>
                      </div>
                    </div>

                    {/* 재직중 토글 */}
                    <div className="career-section__toggle career-section__toggle--current error_box">
                      <span className="career-section__toggle-label">재직중</span>
                      <Switch
                        checked={resumeReco}
                        onChange={setResumeReco}
                        onColor="#000000"
                        offColor="#E5E7EB"
                        onHandleColor="#FFFFFF"
                        offHandleColor="#FFFFFF"
                        handleDiameter={18}
                        height={20}
                        width={42}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        aria-label="재직중"
                      />
                    </div>

                  </div>

                  {/* 직무/직책 입력칸  */}
                  <div className="career-section__row">
                    <div className="career-section__control career-section__control--role">
                    <div className="field in_icon">
                      <label className="label" >
                      직무 <em>*</em>
                      </label>
                      <div className="input-group">
                        <input id="text" className="form-input" 
                        placeholder='직무를 입력해 주세요.'
                        type="text" required />
                          <span>
                          <img src={ic_error_red100_20} alt="" />
                          </span>
                      </div>
                      </div>

                    </div>
                    <div className="career-section__control career-section__control--position">
                    <div className="field in_icon">
                      <label className="label" >
                      직책 <em>*</em>
                      </label>
                      <div className="input-group">
                        <input id="text"
                           placeholder='직무를 입력해 주세요.'
                        className="form-input" type="text" required />
                          <span>
                          <img src={ic_error_red100_20} alt="" />
                          </span>
                      </div>
                      </div>
                      </div>
                  </div>

                  {/* 담당 업무 */}
                  <div className="career-section__control career-section__control--summary">
                  <div className="labe_black">담당 업무 및 주요 성과</div>

                  <div className="career-section__summary-input">
                      <ul className="career-section__summary-tips">
                        <li className="career-section__summary-tip">
                         - 프로젝트 경험은 역할ㆍ기여도ㆍ성과 중심으로 정리하면 좋습니다.
                        </li>
                        <li className="career-section__summary-tip">
                         - 작성 후 [AI 문장 추천]을 눌러 추천 내용을 참고해 보세요.
                        </li>
                      </ul>
                      <span className="career-section__char-count">글자수:100개</span>
                    </div>

                    <div className="resume-create-page__assist">
            <span className="resume-create-page__assist-text">
              <img src={ic_star_gray700_20} alt="" />
                더 적합한 문장을 추천을 위해 아래 항목들을 먼저 채워주세요.</span>
                <span className="career-section__summary-ai-btn">
                AI 문장 추천</span>
            </div>
                </div>

                </div>


                <div className="career-section__controls">
                  <span className="career-section__control_btn career-section__control--up">
                    <img src={ic_key_arrow_up_gray500_20} alt="" />
                  </span>
                  <span  className="career-section__control_btn career-section__control--down">
                  <img src={ic_key_arrow_down_gray500_20} alt="" /></span>
                  <span  className="career-section__control_btn career-section__control--remove">
                    <img src={ic_trash_gray500_20} alt="" />
                  </span>
                </div>
              </div>

              <span className="default_btn_white">추가</span>
            </div>
          </div>

        <div className="resume-create-page__section resume-create-page__section--education">학력 칸</div>
          <div>희망직무 칸</div>
          <div>하드스킬 칸</div>
          <div>소프트스킬 칸</div>
          <div>활동경력 칸</div>
          <div>수상자격증 칸</div>
          <div>포트폴리오 기타문서 칸</div>
          <div>자기소개서 칸</div>
          <div>모의면접 분석 결과 칸</div>
        </div>
        <div className="resume-create-page__aside">왼쪽: 이력서 관리 사이드바</div>
      </div>
    </div>    
    );
}
