// BasicInfoSection.tsx
import React from 'react';
import FormField from '@/shared/components/form/FormField';
import FormInput from '@/shared/components/form/FormInput';
import DateInline from '@/shared/components/form/DateInline';
import GenderChoice from '@/shared/components/form/GenderChoice';

import ic_error_red100_20 from '@/assets/icons/size20/ic_error_red100_20.png';
import ic_calendar_gray900_20 from '@/assets/icons/size20/ic_calendar_gray900_20.png';
import icon_calendar_red_20 from '@/assets/icons/size20/icon_calendar_red_20.png';
import ic_add_btn_gray700_20 from '@/assets/icons/size20/ic_add_btn_gray700_20.png';
import "./BasicInfoSection.css";

type Gender = 'male' | 'female' | null;

export type BasicInfo = {
  name: string;
  birth: string;
  gender: Gender;
  email: string;
  phone: string;
  photoUrl?: string;
};
export type BasicErrors = Partial<Record<keyof BasicInfo, string>>;

export default function BasicInfoSection({
  values,
  errors,
  onChange,
  onFocusAny, 
}: {
  values: BasicInfo;
  errors?: BasicErrors;
  onChange: (patch: Partial<BasicInfo>) => void;
  onFocusAny?: () => void;
}) {
  const { name, birth, gender, email, phone } = values;
 
  return (
    <div className="resume-create-page__section resume-create-page__section--basic">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          기본정보 <em className="resume-create-page__required">*</em>
        </div>
      </div>

      <div className="resume-create-page__section-body">
        <div className="resume-create-page__col resume-create-page__col--left">

          <FormField label={<>이름 <em>*</em></>} className="in_icon">
            <FormInput
              id="name"
              required
              value={name}
              onChange={(v) => onChange({ name: v })}
              onFocus={onFocusAny}
              invalid={!!errors?.name}
              rightIconSrc={errors?.name ? ic_error_red100_20 : undefined}
            />
          </FormField>

          <div className="resume-create-page__field-row">
          <FormField label={<>생년월일 <em>*</em></>} className="birth">
            <DateInline
              id="birth"
              iconSrc={errors?.birth ? icon_calendar_red_20 : ic_calendar_gray900_20}
              value={birth}
              onClick={() => {/* date picker open */}}
              invalid={!!errors?.birth}
              errorMessage={errors?.birth}
            />
          </FormField>

            <FormField label={<>성별 <em>*</em></>} className="gender">
              <GenderChoice
                value={gender}
                onChange={(g) => onChange({ gender: g })}
              />
            </FormField>
          </div>

          <div className="resume-create-page__field-row">
            <FormField label={<>이메일 <em>*</em></>} className="in_icon email">
              <FormInput
                id="email"
                type="email"
                required
                value={email}
                onChange={(v) => onChange({ email: v })}
                onFocus={onFocusAny}
                invalid={!!errors?.email}
            
                rightIconSrc={errors?.email ? ic_error_red100_20 : undefined}
              />
            </FormField>

            <FormField label={<>연락처 <em>*</em></>} className="in_icon phone">
              <FormInput
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(v) => onChange({ phone: v })}
                onFocus={onFocusAny}
                invalid={!!errors?.phone}
              
                rightIconSrc={errors?.phone ? ic_error_red100_20 : undefined}
              />
            </FormField>
          </div>
        </div>

        <div className="resume-create-page__col resume-create-page__col--right">
          <span className="small_labe_black-14">사진</span>
          <div className="resume-create-page__photo">
            <img src={ic_add_btn_gray700_20} alt="" />
            <span>사진 추가</span>
          </div>
        </div>
      </div>
    </div>
  );
}
