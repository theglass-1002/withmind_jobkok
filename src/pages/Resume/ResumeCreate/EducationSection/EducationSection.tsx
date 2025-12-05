import React, { useRef, useState, useEffect } from 'react';
import FormField from '@/shared/components/form/FormField';
import FormInput from '@/shared/components/form/FormInput';
import DateInline from '@/shared/components/form/DateInline';

import ic_error_red100_20 from '@/assets/icons/size20/ic_error_red100_20.png';
import icon_calendar_red_20 from '@/assets/icons/size20/icon_calendar_red_20.png';
import ic_calendar_gray900_20 from '@/assets/icons/size20/ic_calendar_gray900_20.png';
import ic_add_btn_gray900_20 from '@/assets/icons/size20/ic_add_btn_gray900_20.png';
import ic_arrow_drop_down_gray900_24 from '@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png';

import ic_key_arrow_down_gray500_20 from '@/assets/icons/size20/ic_key_arrow_down_gray500_20.png';
import ic_key_arrow_up_gray500_20 from '@/assets/icons/size20/ic_key_arrow_up_gray500_20.png';
import ic_trash_gray500_20 from '@/assets/icons/size20/ic_trash_gray500_20.png';

import ic_key_arrow_up_gray900_20 from '@/assets/icons/size20/ic_key_arrow_up_gray900_20.png';
import ic_key_arrow_down_gray900_20 from '@/assets/icons/size20/ic_key_arrow_down_gray900_20.png';
import ic_trash_gray900_20 from '@/assets/icons/size20/ic_trash_gray900_20.png';

import './EducationSection.css';

import InlineMonthPicker from '@/shared/components/calendar/InlineMonthPicker';
import { parseMonth, fmtMonth } from '@/shared/utils/util';

import Modal from '@/shared/components/modal/Modal';

export type Education = {
  school_name?: string;
  major_degree?: string;
  startDate?: string;
  endDate?: string;
  status?: string; // 졸업 여부
};

export type EducationErrors = Partial<Record<keyof Education, string>>;

const blankItem = (): Education => ({
  school_name: '',
  major_degree: '',
  startDate: '',
  endDate: '',
  status: '',
});

export default function EducationSection({
  values = [],
  onChange,
  onFocusAny,
  errors = {},
}: {
  values?: Education[];
  onChange: (list: Education[]) => void;
  onFocusAny?: () => void;
  errors?: EducationErrors;
}) {
  // 항상 최소 1개의 빈 아이템은 화면에 보여 주되,
  // 실제 form.education 값은 부모에서만 관리
  const items: Education[] =
    values && values.length > 0 ? values : [blankItem()];

  const [openedSelectIdx, setOpenedSelectIdx] = useState<number | null>(null);

  // 삭제 모달 관련 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingRemoveIdx, setPendingRemoveIdx] = useState<number | null>(null);

  const swap = <T,>(arr: T[], i: number, j: number) => {
    const next = arr.slice();
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  };

  const addItem = () => {
    const next = [blankItem(), ...items];
    onChange(next);
  };

  // 실제 삭제 로직 (확인 버튼 눌렀을 때만 호출)
  const removeItem = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    // 값은 그냥 []로 넘기면, 다음 렌더에서 다시 [blankItem()]으로 fallback됨
    onChange(next);
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const next = swap(items, idx, idx - 1);
    onChange(next);
  };

  const moveDown = (idx: number) => {
    if (idx >= items.length - 1) return;
    const next = swap(items, idx, idx + 1);
    onChange(next);
  };

  const patchItem = (idx: number, patch: Partial<Education>) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    onChange(next);
  };

  // 삭제 버튼 클릭 시:
  // - 해당 아이템에 입력된 내용이 하나라도 있으면 모달 띄우기
  // - 전부 비어 있으면 모달 없이 바로 삭제
  const handleClickRemove = (idx: number) => {
    const target = items[idx];
    const isEmpty =
      !target?.school_name &&
      !target?.major_degree &&
      !target?.startDate &&
      !target?.endDate &&
      !target?.status;

    if (isEmpty) {
      // 그냥 삭제
      removeItem(idx);
      return;
    }

    // 내용이 있으면 확인 모달
    setPendingRemoveIdx(idx);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (pendingRemoveIdx === null) {
      setShowDeleteModal(false);
      return;
    }
    removeItem(pendingRemoveIdx);
    setPendingRemoveIdx(null);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setPendingRemoveIdx(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="resume-create-page__section resume-create-page__section--education">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          학력 <em className="resume-create-page__required">*</em>
        </div>
      </div>

      <div className="resume-create-page__section-body education-section">
        {items.map((it, idx) => (
          <EducationItem
            key={idx}
            index={idx}
            total={items.length}
            value={it}
            errors={errors} // 필요하면 여기서 per-index 에러로 바꿔도 됨
            gradLabel={it.status ?? null}
            selectOpen={openedSelectIdx === idx}
            onToggleSelect={() =>
              setOpenedSelectIdx((o) => (o === idx ? null : idx))
            }
            onSelectGrad={(label) => {
              // status 필드에 직접 라벨 저장
              patchItem(idx, { status: label });
              setOpenedSelectIdx(null);
            }}
            onChange={(patch) => patchItem(idx, patch)}
            onMoveUp={() => moveUp(idx)}
            onMoveDown={() => moveDown(idx)}
            onRemove={() => handleClickRemove(idx)}
            onFocusAny={onFocusAny}
          />
        ))}

        <span
          className="default_btn_white"
          role="button"
          tabIndex={0}
          onClick={addItem}
        >
          <img src={ic_add_btn_gray900_20} alt="" />
          추가
        </span>
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        open={showDeleteModal}
        title="입력된 내용을 전부 삭제하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="아니오"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
      />
    </div>
  );
}

function EducationItem({
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
}: {
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
}) {
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
                value={school_name}
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
                value={major_degree}
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
                label={
                  <>
                    재학 기간 <em>*</em>
                  </>
                }
                className="education-section date education-section__date--start"
              >
                <DateInline
                  id={`education-start_${index}`}
                  iconSrc={
                    errors?.startDate ? icon_calendar_red_20 : ic_calendar_gray900_20
                  }
                  value={startDate}
                  onClick={() => setOpenStartCal(true)}
                  invalid={!!errors?.startDate}
                  errorMessage={errors?.startDate}
                  rightIconSrc={errors?.startDate ? ic_error_red100_20 : undefined}
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
                  value={endDate}
                  onClick={() => setOpenEndCal(true)}
                  invalid={!!errors?.endDate}
                  errorMessage={errors?.endDate}
                  rightIconSrc={errors?.endDate ? ic_error_red100_20 : undefined}
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

          <div className="education-section__control education-section__control--employment">
            <div
              className="ui-select"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect();
              }}
            >
              {gradLabel ?? (
                <span className="ui-select-none-default">졸업 여부</span>
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
  );
}
