// BasicInfoSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import FormField from '@/shared/components/form/FormField';
import FormInput from '@/shared/components/form/FormInput';
import DateInline from '@/shared/components/form/DateInline';
import GenderChoice from '@/shared/components/form/GenderChoice';

// ▼ 월 피커 대신 일 피커 사용
import InlineDayPicker from '@/shared/components/calendar/InlineDayPicker';

import ic_error_red100_20 from '@/assets/icons/size20/ic_error_red100_20.png';
import ic_calendar_gray900_20 from '@/assets/icons/size20/ic_calendar_gray900_20.png';
import icon_calendar_red_20 from '@/assets/icons/size20/icon_calendar_red_20.png';
import ic_add_btn_gray700_20 from '@/assets/icons/size20/ic_add_btn_gray700_20.png';
import "./BasicInfoSection.css";

type Gender = 'male' | 'female' | null;

export type BasicInfo = {
  name: string;
  birth: string;      // "YYYY.MM.DD"
  gender: Gender;
  email: string;
  phone: string;
  photoUrl?: string;
};
export type BasicErrors = Partial<Record<keyof BasicInfo, string>>;

// YYYY.MM.DD ⇄ { year, month(0~11), day }
const parseYMD = (s: string) => {
  const m = /^(\d{4})\.(\d{2})\.(\d{2})$/.exec((s || '').trim());
  if (!m) return null;
  return { year: +m[1], month: +m[2] - 1, day: +m[3] };
};
const fmtYMD = (d: { year: number; month: number; day: number }) =>
  `${d.year}.${String(d.month + 1).padStart(2, '0')}.${String(d.day).padStart(2, '0')}`;

// 미래 날짜 비활성화
const disableFutureDay = (y: number, m: number, dd: number) => {
  const now = new Date();
  const cur = new Date(y, m, dd, 23, 59, 59, 999);
  return cur.getTime() > now.getTime();
};

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

  // 생년월일 달력 제어
  const [openBirth, setOpenBirth] = useState(false);
  const birthRef = useRef<HTMLDivElement | null>(null);

  // 바깥 클릭 시 달력 닫기
  useEffect(() => {
    const onDocClick = (e: MouseEvent | TouchEvent) => {
      if (!openBirth) return;
      const t = e.target as Node;
      if (birthRef.current && !birthRef.current.contains(t)) {
        setOpenBirth(false);
      }
    };
    document.addEventListener('mousedown', onDocClick, true);
    document.addEventListener('touchstart', onDocClick, true);
    return () => {
      document.removeEventListener('mousedown', onDocClick, true);
      document.removeEventListener('touchstart', onDocClick, true);
    };
  }, [openBirth]);

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
            {/* 생년월일 */}
            <div className="birth section-period__start-wrap" ref={birthRef}>
              <FormField label={<>생년월일 <em>*</em></>} className="">
                <DateInline
                  id="birth"
                  iconSrc={errors?.birth ? icon_calendar_red_20 : ic_calendar_gray900_20}
                  value={birth || 'YYYY.MM.DD'}
                  onClick={() => setOpenBirth(true)}
                  invalid={!!errors?.birth}
                  errorMessage={errors?.birth}
                  isOpen={openBirth} 
                />
              </FormField>

              {openBirth && (
                <div className="calendar-popover" onClick={(e) => e.stopPropagation()}>
                  <div className="calendar-popover__panel">
                    <InlineDayPicker
                      className="cal--day"
                      value={parseYMD(birth || '') || undefined}
                      minYear={1950}
                      onChange={() => {}}
                      onApply={(d) => {
                        onChange({ birth: fmtYMD(d) }); // YYYY.MM.DD 저장
                        setOpenBirth(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 성별 */}
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
