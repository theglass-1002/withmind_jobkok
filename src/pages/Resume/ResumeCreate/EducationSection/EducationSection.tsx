import React,{useRef,useState,useEffect}from 'react'
import { Link, NavLink } from "react-router-dom";
import FormField from '@/shared/components/form/FormField';
import FormInput from '@/shared/components/form/FormInput';
import DateInline from '@/shared/components/form/DateInline';
import GenderChoice from '@/shared/components/form/GenderChoice';

import Switch from "react-switch";

import ic_error_red100_20 from '@/assets/icons/size20/ic_error_red100_20.png';
import ic_star_gray700_20 from '@/assets/icons/size20/ic_star_gray700_20.png';
import ic_trash_gray500_20 from '@/assets/icons/size20/ic_trash_gray500_20.png';
import icon_calendar_red_20 from '@/assets/icons/size20/icon_calendar_red_20.png';
import ic_calendar_gray900_20 from '@/assets/icons/size20/ic_calendar_gray900_20.png';
import ic_add_btn_gray700_20 from '@/assets/icons/size20/ic_calendar_gray700_20.png';
import ic_add_btn_gray900_20 from '@/assets/icons/size20/ic_add_btn_gray900_20.png';
import ic_arrow_drop_down_gray900_24 from '@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png';
import ic_arrow_drop_down_up_gray900_24 from '@/assets/icons/size24/ic_arrow_drop_down_up_gray900_24.png';



import ic_add_purple_20 from '@/assets/icons/size20/ic_add_purple_20.png';

import ic_key_arrow_down_gray500_20 from '@/assets/icons/size20/ic_key_arrow_down_gray500_20.png';
import ic_key_arrow_up_gray500_20 from '@/assets/icons/size20/ic_key_arrow_up_gray500_20.png';

import "./EducationSection.css";


export type CareerInfo = {
    company_name: string;
    birth: string;
  };
  export type CareerErrors = Partial<Record<keyof CareerInfo, string>>;
  


  export default function EducationSection({
    values,
    errors,
    onChange,
    onFocusAny, 
  }: {
    values: CareerInfo;
    errors?: CareerErrors;
    onChange: (patch: Partial<CareerInfo>) => void;
    onFocusAny?: () => void;
  }) {
    const MAX_SUMMARY = 2000;
    const {company_name,birth} = values;
    const [resumeReco, setResumeReco] = useState(false); // 이력서 기반 추천 토글
    const [open, setOpen] = useState(false);
    const [employmentType, setEmploymentType] = useState<string | null>(null)
    const [summary, setSummary] = useState('');
    const [editing, setEditing] = useState(false);
  
    const select = (val: string) => {
    setEmploymentType(val); // ← 선택값 저장
    setOpen(false);         // 메뉴 닫기
    };

    const startEditing = (e?: React.KeyboardEvent | React.MouseEvent) => {
        console.log('클릭');
        console.log(editing);
        if (e && "key" in e) {
          if (e.nativeEvent?.isComposing) return;
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
        }
        setEditing(true);
      };

      const onChangeSummary = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // 브라우저가 maxLength로도 막아주지만, 안전하게 한 번 더 잘라줌
        const v = e.target.value.slice(0, MAX_SUMMARY);
        setSummary(v);
      };
      const count = summary.length;
      
    return (
        <div className="resume-create-page__section resume-create-page__section--education">
         <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          학력 <em className="resume-create-page__required">*</em>
        </div>
        
      </div>
          <div className="resume-create-page__section-body education-section">
            <div className="education-section__item">
            <div className="education-section__fields">
            <div className="education-section__row">
                  <div className="education-section__control education-section__control--role">
                  <FormField label={<>학교명 <em>*</em></>} className="in_icon">
                  <FormInput
                    id="company_name"
                    required
                    value={company_name}
                    onChange={(v) => onChange({ company_name: v })}
                    onFocus={onFocusAny}
                    invalid={!!errors?.company_name}
                    rightIconSrc={errors?.company_name ? ic_error_red100_20 : undefined}
                    />
                </FormField>
                  </div>
                  <div className="education-section__control education-section__control--position">
                  <FormField label={<>전공 및 학위</>} className="in_icon">
                  <FormInput
                    id="company_name"
                    required
                    value={company_name}
                    onChange={(v) => onChange({ company_name: v })}
                    onFocus={onFocusAny}
                    invalid={!!errors?.company_name}
                    rightIconSrc={errors?.company_name ? ic_error_red100_20 : undefined}
                    />
                </FormField>
                    </div>
                </div>
                <div className="education-section__group education-section__group--employment"> 
                  <div className="education-section__period">
                  <FormField label={""} className="education-section date education-section__date--start">
                        <DateInline
                        id="education"
                        iconSrc={errors?.birth ? icon_calendar_red_20 : ic_calendar_gray900_20}
                        value={birth}
                        onClick={() => {/* date picker open */}}
                        invalid={false}
                        errorMessage={errors?.birth}
                        rightIconSrc={errors?.company_name ? ic_error_red100_20 : ic_error_red100_20}
                        />
                    </FormField>
                    <span className="education-section__tilde">~</span>
                    {resumeReco?<>
                    <div className="field education-section date education-section__date--end">
                    <label className="label">{}</label>
                        <div className='date-section'>
                            <div className='section__date-inner disabled'>
                                <img src={ic_add_btn_gray700_20} alt="" />
                                재직 중
                            </div>
                        </div>
                    </div>
                    </>:
                      <FormField label={""} className="education-section date education-section__date--end">
                         <DateInline
                           id="education"
                             iconSrc={errors?.birth ? icon_calendar_red_20 : icon_calendar_red_20}
                             value={birth}
                             onClick={() => {/* date picker open */}}
                              invalid={true}
                             errorMessage={errors?.birth}
                             rightIconSrc={errors?.company_name ? ic_error_red100_20 : ic_error_red100_20}
                             />
                           </FormField>
                    }

                  </div>
                  <div className="education-section__control education-section__control--employment">
               
                  <div className="ui-select" onClick={()=>{setOpen(!open)}}>
                  {employmentType??<span className='ui-select-none-default'>졸업 여부</span>}
                    <img src={ic_arrow_drop_down_gray900_24} alt="" />
                    {open && (
                    <div className="ui-select__menu" role="listbox">
                        <div className="ui-select__option" role="option" onClick={() =>select('졸업')}>졸업</div>
                        <div className="ui-select__option" role="option" onClick={() => select('졸업 예정')}>졸업 예정</div>
                        <div className="ui-select__option" role="option" onClick={() => select('재학중')}>재학중</div>
                        <div className="ui-select__option" role="option" onClick={() => select('중퇴')}>중퇴</div>
                        <div className="ui-select__option" role="option" onClick={() => select('수료')}>수료</div>
                        <div className="ui-select__option" role="option" onClick={() => select('휴학')}>휴학</div>
                    </div>
                    )}
                  </div>
                   </div>
                </div>

            
              

                    </div>
              <div className="education-section__controls">
                <span className="education-section__control_btn education-section__control--up">
                  <img src={ic_key_arrow_up_gray500_20} alt="" />
                </span>
                <span  className="education-section__control_btn education-section__control--down">
                <img src={ic_key_arrow_down_gray500_20} alt="" /></span>
                <span  className="education-section__control_btn education-section__control--remove">
                  <img src={ic_trash_gray500_20} alt="" />
                </span>
              </div>
            </div>

            <span className="default_btn_white">
                <img src={ic_add_btn_gray900_20} alt="" />
                추가</span>
          </div>
        </div>
    );
}
