import React, { useRef, useState, useEffect } from 'react';
import FormField from '@/shared/components/form/FormField';
import FormInput from '@/shared/components/form/FormInput';
import DateInline from '@/shared/components/form/DateInline';
import Modal from '@/shared/components/modal/Modal';

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

const initialItems = (values?: Education[]): Education[] =>
  values && values.length > 0 ? values : [blankItem()];

// 필수 입력값 기준으로 비어있는지 체크
const isItemEmpty = (item: Education): boolean => {
  return (
    !item.school_name?.trim() &&
    !item.startDate?.trim() &&
    !item.endDate?.trim()
  );
};

interface EducationSectionProps {
  values?: Education[];
  onChange: (list: Education[]) => void;
  onFocusAny?: () => void;
  errors?: EducationErrors[];
  isEdit?: boolean; // 🔥 추가: 수정 모드 여부
}

export default function EducationSection({
  values = [],
  onChange,
  onFocusAny,
  errors = [],
  isEdit = false, // 🔥 기본값: create 모드
}: EducationSectionProps) {
  const [items, setItems] = useState<Education[]>(() => initialItems(values));

  // status(졸업 여부)를 표시용 gradType과 연결
  const [gradType, setGradType] = useState<(string | null)[]>(() =>
    values && values.length > 0 ? values.map((v) => v.status ?? null) : [null]
  );

  const [openedSelectIdx, setOpenedSelectIdx] = useState<number | null>(null);

  // 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);

  const didSyncRef = useRef(false);

  // 🔥 edit 모드일 때만, 부모 values(서버 데이터) → 내부 items/gradType 으로 한 번만 동기화
  useEffect(() => {
    if (!isEdit) return;              // create 모드면 그냥 패스
    if (didSyncRef.current) return;

    if (!values || values.length === 0) {
      didSyncRef.current = true;
      return;
    }

    // 내부가 "처음 1줄 + 완전 비어있는 상태"일 때만 덮어씀
    const isInitialEmpty = items.length === 1 && isItemEmpty(items[0]);
    if (!isInitialEmpty && didSyncRef.current) return;

    console.log('✅ EducationSection(edit): values 동기화', values);
    setItems(values);
    setGradType(values.map((v) => v.status ?? null));
    didSyncRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, values]);

  const swap = <T,>(arr: T[], i: number, j: number) => {
    const next = arr.slice();
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  };

  const addItem = () => {
    setItems((prev) => {
      const next = [blankItem(), ...prev];
      onChange(next);
      return next;
    });
    setGradType((prev) => [null, ...prev]);
  };

  const handleRemoveClick = (idx: number) => {
    if (items.length <= 1) return;

    const item = items[idx];
    const isEmpty = isItemEmpty(item);

    if (isEmpty) {
      removeItem(idx);
    } else {
      setDeleteTargetIndex(idx);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTargetIndex !== null) {
      removeItem(deleteTargetIndex);
    }
    setShowDeleteModal(false);
    setDeleteTargetIndex(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTargetIndex(null);
  };

  const removeItem = (idx: number) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      const normalized = next.length === 0 ? [blankItem()] : next;
      onChange(normalized);
      return normalized;
    });
    setGradType((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx)
    );
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    setItems((prev) => {
      const next = swap(prev, idx, idx - 1);
      onChange(next);
      return next;
    });
    setGradType((prev) => swap(prev, idx, idx - 1));
  };

  const moveDown = (idx: number) => {
    if (idx >= items.length - 1) return;
    setItems((prev) => {
      const next = swap(prev, idx, idx + 1);
      onChange(next);
      return next;
    });
    setGradType((prev) => swap(prev, idx, idx + 1));
  };

  const patchItem = (idx: number, patch: Partial<Education>) => {
    setItems((prev) => {
      const next = prev.map((it, i) => (i === idx ? { ...it, ...patch } : it));
      onChange(next);
      return next;
    });
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
            errors={errors[idx]}
            gradLabel={gradType[idx]}
            selectOpen={openedSelectIdx === idx}
            onToggleSelect={() =>
              setOpenedSelectIdx((o) => (o === idx ? null : idx))
            }
            onSelectGrad={(label) => {
              setGradType((prev) =>
                prev.map((v, i) => (i === idx ? label : v))
              );
              setOpenedSelectIdx(null);
              patchItem(idx, { status: label });
            }}
            onChange={(patch) => patchItem(idx, patch)}
            onMoveUp={() => moveUp(idx)}
            onMoveDown={() => moveDown(idx)}
            onRemove={() => handleRemoveClick(idx)}
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

  const hasStatusError = !!errors?.status;

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
              className={[
                'ui-select',
                hasStatusError ? 'error' : '',
              ]
                .join(' ')
                .trim()}
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
            src={
              canMoveUp ? ic_key_arrow_up_gray900_20 : ic_key_arrow_up_gray500_20
            }
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
