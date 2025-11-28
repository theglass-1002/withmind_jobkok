// src/pages/.../EducationSection/Form/M_EducationItemForm.tsx
import React, { useEffect, useRef, useState } from 'react';
import FormField from '@/shared/components/form/FormField';
import FormInput from '@/shared/components/form/FormInput';
import DateInline from '@/shared/components/form/DateInline';

import ic_error_red100_20 from '@/assets/icons/size20/ic_error_red100_20.png';
import icon_calendar_red_20 from '@/assets/icons/size20/icon_calendar_red_20.png';
import ic_calendar_gray900_20 from '@/assets/icons/size20/ic_calendar_gray900_20.png';
import ic_arrow_drop_down_gray900_24 from '@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png';

import ic_key_arrow_down_gray500_20 from '@/assets/icons/size20/ic_key_arrow_down_gray500_20.png';
import ic_key_arrow_up_gray500_20 from '@/assets/icons/size20/ic_key_arrow_up_gray500_20.png';
import ic_trash_gray500_20 from '@/assets/icons/size20/ic_trash_gray500_20.png';

import ic_key_arrow_up_gray900_20 from '@/assets/icons/size20/ic_key_arrow_up_gray900_20.png';
import ic_key_arrow_down_gray900_20 from '@/assets/icons/size20/ic_key_arrow_down_gray900_20.png';
import ic_trash_gray900_20 from '@/assets/icons/size20/ic_trash_gray900_20.png';

import InlineMonthPicker from '@/shared/components/calendar/InlineMonthPicker';
import { parseMonth, fmtMonth } from '@/shared/utils/util';

import '../EducationSection.css';
import type { Education, EducationErrors } from '../M_EducationSection';

interface M_EducationItemFormProps {
  index: number;
  total: number;
  value: Education;
  errors?: EducationErrors;
  gradLabel: string | null;
  selectOpen: boolean;
  onToggleSelect: () => void;
  onSelectGrad: (label: string) => void;
  onChange: (patch: Partial<Education>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onFocusAny?: () => void;
  gradError?: boolean; // 🔹 졸업 여부 에러 상태
}

export default function M_EducationItemForm({
  index,
  total,
  value,
  errors,
  gradLabel,
  selectOpen,
  onToggleSelect,
  onSelectGrad,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  onFocusAny,
  gradError,
}: M_EducationItemFormProps) {
  const { school_name, major_degree, startDate, endDate } = value;

  const [openStartCal, setOpenStartCal] = useState(false);
  const [openEndCal, setOpenEndCal] = useState(false);
  const startCalRef = useRef<HTMLDivElement | null>(null);
  const endCalRef = useRef<HTMLDivElement | null>(null);

  const startMV = parseMonth(startDate) ?? null;
  const disableEndMonth = (y: number, m: number) => {
    const now = new Date();
    const afterToday =
      y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth());
    const beforeStart =
      !!startMV && (y < startMV.year || (y === startMV.year && m < startMV.month));
    return beforeStart || afterToday;
  };

  useEffect(() => {
    if (!openStartCal && !openEndCal) return;
    const onOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (openStartCal) {
        const root = startCalRef.current;
        if (root && !root.contains(target)) setOpenStartCal(false);
      }
      if (openEndCal) {
        const root = endCalRef.current;
        if (root && !root.contains(target)) setOpenEndCal(false);
      }
    };
    document.addEventListener('mousedown', onOutside, true);
    document.addEventListener('touchstart', onOutside, true);
    return () => {
      document.removeEventListener('mousedown', onOutside, true);
      document.removeEventListener('touchstart', onOutside, true);
    };
  }, [openStartCal, openEndCal]);

  const canMoveUp = total > 1 && index > 0;
  const canMoveDown = total > 1 && index < total - 1;
  const canRemove = total > 1;

  return (
    <div className="education-section__item">
      <div className="education-section__fields">
        <div className="education-section__row">
          <div className="education-section__control education-section__control--role">
            <FormField label={<>학교명 <em>*</em></>} className="in_icon">
              <FormInput
                id={`school_name_${index}`}
                required
                value={school_name ?? ''}
                onChange={(v) => onChange({ school_name: v })}
                onFocus={onFocusAny}
                invalid={!!errors?.school_name}
                rightIconSrc={errors?.school_name ? ic_error_red100_20 : undefined}
                placeholder="학교명을 입력해 주세요."
              />
            </FormField>
          </div>

          <div className="education-section__control education-section__control--position">
            <FormField label={<>전공 및 학위</>} className="in_icon">
              <FormInput
                id={`major_degree_${index}`}
                value={major_degree ?? ''}
                onChange={(v) => onChange({ major_degree: v })}
                onFocus={onFocusAny}
                invalid={!!errors?.major_degree}
                rightIconSrc={errors?.major_degree ? ic_error_red100_20 : undefined}
                placeholder="전공 및 학위를 입력해 주세요."
              />
            </FormField>
          </div>
        </div>

        <div className="education-section__group education-section__group--employment">
          <div className="education-section__period">
            <div className="section-period__start-wrap" ref={startCalRef}>
              <FormField
                label={<>재학 기간 <em>*</em></>}
                className="education-section date education-section__date--start"
              >
                <DateInline
                  id={`education-start_${index}`}
                  iconSrc={
                    errors?.startDate ? icon_calendar_red_20 : ic_calendar_gray900_20
                  }
                  value={startDate ?? ''}
                  onClick={() => setOpenStartCal(true)}
                  invalid={!!errors?.startDate}
                  errorMessage={errors?.startDate}
                  isOpen={openStartCal}
                />
              </FormField>

              {openStartCal && (
                <div className="calendar-popover">
                  <div className="calendar-popover__panel">
                    <InlineMonthPicker
                      pickerType="educationStart"
                      value={parseMonth(startDate) ?? undefined}
                      minYear={1970}
                      onChange={() => {}}
                      onApply={(d) => {
                        onChange({ startDate: fmtMonth(d) });
                        const endMV = parseMonth(endDate);
                        if (
                          endMV &&
                          (endMV.year < d.year ||
                            (endMV.year === d.year && endMV.month < d.month))
                        ) {
                          onChange({ endDate: fmtMonth(d) });
                        }
                        setOpenStartCal(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <span className="education-section__tilde">~</span>

            <div className="section-period__end-wrap" ref={endCalRef}>
              <FormField
                label=""
                className="education-section date education-section__date--end"
              >
                <DateInline
                  id={`education-end_${index}`}
                  iconSrc={
                    errors?.endDate ? icon_calendar_red_20 : ic_calendar_gray900_20
                  }
                  value={endDate ?? ''}
                  onClick={() => setOpenEndCal(true)}
                  invalid={!!errors?.endDate}
                  errorMessage={errors?.endDate}
                  isOpen={openEndCal}
                />
              </FormField>
              {openEndCal && (
                <div className="calendar-popover">
                  <div className="calendar-popover__panel">
                    <InlineMonthPicker
                      pickerType="educationEnd"
                      value={parseMonth(endDate) ?? undefined}
                      defaultValue={parseMonth(startDate) ?? undefined}
                      minYear={parseMonth(startDate)?.year ?? 1970}
                      isDisabledMonth={disableEndMonth}
                      onApplyEx={(pickedMonth) => {
                        onChange({ endDate: fmtMonth(pickedMonth) });
                        setOpenEndCal(false);
                      }}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🔹 졸업 여부: gradError가 true면 error_box 클래스 추가 */}
          <div
            className={
              'education-section__control education-section__control--employment' +
              (gradError ? ' error_box' : '')
            }
          >
            <div
              className="ui-select"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect();
              }}
            >
              {gradLabel ?? (
                <span className="ui-select-none-default">졸업 여부 형태</span>
              )}
              <img src={ic_arrow_drop_down_gray900_24} alt="" />
              {selectOpen && (
                <div
                  className="ui-select__menu"
                  role="listbox"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="ui-select__option"
                    role="option"
                    onClick={() => onSelectGrad('졸업')}
                  >
                    졸업
                  </div>
                  <div
                    className="ui-select__option"
                    role="option"
                    onClick={() => onSelectGrad('졸업 예정')}
                  >
                    졸업 예정
                  </div>
                  <div
                    className="ui-select__option"
                    role="option"
                    onClick={() => onSelectGrad('재학중')}
                  >
                    재학중
                  </div>
                  <div
                    className="ui-select__option"
                    role="option"
                    onClick={() => onSelectGrad('중퇴')}
                  >
                    중퇴
                  </div>
                  <div
                    className="ui-select__option"
                    role="option"
                    onClick={() => onSelectGrad('수료')}
                  >
                    수료
                  </div>
                  <div
                    className="ui-select__option"
                    role="option"
                    onClick={() => onSelectGrad('휴학')}
                  >
                    휴학
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="education-section__controls">
        <span
          className={[
            'education-section__control_btn',
            'education-section__control--up',
            !canMoveUp ? 'is-disabled' : '',
            !canMoveUp ? 'first' : '',
          ]
            .join(' ')
            .trim()}
          role="button"
          tabIndex={canMoveUp ? 0 : -1}
          onClick={() => canMoveUp && onMoveUp()}
          aria-disabled={!canMoveUp}
        >
          <img
            src={canMoveUp ? ic_key_arrow_up_gray900_20 : ic_key_arrow_up_gray500_20}
            alt=""
          />
        </span>

        <span
          className={[
            'education-section__control_btn',
            'education-section__control--down',
            !canMoveDown ? 'is-disabled' : '',
            !canMoveDown ? 'last' : '',
          ]
            .join(' ')
            .trim()}
          role="button"
          tabIndex={canMoveDown ? 0 : -1}
          onClick={() => canMoveDown && onMoveDown()}
          aria-disabled={!canMoveDown}
        >
          <img
            src={
              canMoveDown
                ? ic_key_arrow_down_gray900_20
                : ic_key_arrow_down_gray500_20
            }
            alt=""
          />
        </span>

        <span
          className={[
            'education-section__control_btn',
            'education-section__control--remove',
            !canRemove ? 'is-disabled' : '',
          ]
            .join(' ')
            .trim()}
          role="button"
          tabIndex={canRemove ? 0 : -1}
          onClick={() => canRemove && onRemove()}
          aria-disabled={!canRemove}
        >
          <img
            src={canRemove ? ic_trash_gray900_20 : ic_trash_gray500_20}
            alt=""
          />
        </span>
      </div>
      </div>

      
    </div>
  );
}
