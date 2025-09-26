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

import "./CareerSection.css";


export type CareerInfo = {
    company_name: string;
    birth: string;
  };
  export type CareerErrors = Partial<Record<keyof CareerInfo, string>>;
  


  export default function CareerSection({
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
        <div className="resume-create-page__section resume-create-page__section--career">
         <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          경력 <em className="resume-create-page__required">*</em>
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
          <div className="resume-create-page__section-body career-section">
            <div className="career-section__item">
            <div className="career-section__fields">
                <FormField label={<>회사명 <em>*</em></>} className="in_icon">
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
                <div className="career-section__group career-section__group--employment"> 
                  <div className="career-section__control career-section__control--employment">
                  <label className="small_labe_black-14">
                    재직 기간 <em className="error_text_red">*</em>
                  </label>
                  <div className="ui-select" onClick={()=>{setOpen(!open)}}>
                  {employmentType??<span className='ui-select-none-default'>재직 형태</span>}
                    <img src={ic_arrow_drop_down_gray900_24} alt="" />
                    {open && (
                    <div className="ui-select__menu" role="listbox">
                        <div className="ui-select__option" role="option" onClick={() =>select('정규직')}>정규직</div>
                        <div className="ui-select__option" role="option" onClick={() => select('계약직')}>계약직</div>
                        <div className="ui-select__option" role="option" onClick={() => select('인턴')}>인턴</div>
                        <div className="ui-select__option" role="option" onClick={() => select('프리랜서')}>프리랜서</div>
                    </div>
                    )}
                  </div>
                   </div>



                  <div className="career-section__period">
                  <FormField label={""} className="career-section date career-section__date--start">
                        <DateInline
                        id="career"
                        iconSrc={errors?.birth ? icon_calendar_red_20 : ic_calendar_gray900_20}
                        value={birth}
                        onClick={() => {/* date picker open */}}
                        invalid={false}
                        errorMessage={errors?.birth}
                        rightIconSrc={errors?.company_name ? ic_error_red100_20 : ic_error_red100_20}
                        />
                    </FormField>
                    <span className="career-section__tilde">~</span>
                    {resumeReco?<>
                    <div className="field career-section date career-section__date--end">
                    <label className="label">{}</label>
                        <div className='date-section'>
                            <div className='section__date-inner disabled'>
                                <img src={ic_add_btn_gray700_20} alt="" />
                                재직 중
                            </div>
                        </div>
                    </div>
                    </>:
                      <FormField label={""} className="career-section date career-section__date--end">
                         <DateInline
                           id="career"
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
                  <FormField label={<>직무 <em>*</em></>} className="in_icon">
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
                  <div className="career-section__control career-section__control--position">
                  <FormField label={<>직책 <em>*</em></>} className="in_icon">
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
                {/* 담당 업무 */}
                <div className="field career-section__control career-section__control--summary">
                <div className="small_labe_black-14">담당 업무 및 주요 성과</div>
                {editing?
                <div className='career-section__summary-input'>
                    <textarea className=''
                      value={summary}
                      onChange={onChangeSummary}
                      maxLength={MAX_SUMMARY}
                    ></textarea>
                    <span className="career-section__char-count">
                       <span>{count}</span>
                       <span className="max"> / {MAX_SUMMARY}</span>
                   </span>
                </div>
                :
                   <div className={`career-section__summary-input`} onClick={startEditing} onKeyDown={startEditing}>
                   <ul className="career-section__summary-tips">
                     <li className="career-section__summary-tip">
                      - 프로젝트 경험은 역할ㆍ기여도ㆍ성과 중심으로 정리하면 좋습니다.
                     </li>
                     <li className="career-section__summary-tip">
                      - 작성 후 [AI 문장 추천]을 눌러 추천 내용을 참고해 보세요.
                     </li>
                   </ul>
                   <span className="career-section__char-count">
                       <span>{count}</span>
                       <span className="max"> / {MAX_SUMMARY}</span>
                   </span>
                 </div>
                
                }
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

            <span className="default_btn_white">
                <img src={ic_add_btn_gray900_20} alt="" />
                추가</span>
          </div>
        </div>
    );
}
