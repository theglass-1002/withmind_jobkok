// src/pages/Resume/ResumeCreate/CareerSection/CareerSection.tsx
import React, { useEffect, useRef, useState } from "react";
import FormField from "@/shared/components/form/FormField";
import FormInput from "@/shared/components/form/FormInput";
import DateInline from "@/shared/components/form/DateInline";
import Switch from "react-switch";
import Modal from "@/shared/components/modal/Modal";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import ic_star_gray700_20 from "@/assets/icons/size20/ic_star_gray700_20.png";
import ic_star_green_20 from "@/assets/icons/size20/ic_star_green_20.png";
import ic_trash_gray500_20 from "@/assets/icons/size20/ic_trash_gray500_20.png";
import icon_calendar_red_20 from "@/assets/icons/size20/icon_calendar_red_20.png";
import ic_calendar_gray900_20 from "@/assets/icons/size20/ic_calendar_gray900_20.png";
import ic_add_btn_gray700_20 from "@/assets/icons/size20/ic_calendar_gray700_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_key_arrow_down_gray500_20 from "@/assets/icons/size20/ic_key_arrow_down_gray500_20.png";
import ic_key_arrow_up_gray500_20 from "@/assets/icons/size20/ic_key_arrow_up_gray500_20.png";
import ic_key_arrow_up_gray900_20 from "@/assets/icons/size20/ic_key_arrow_up_gray900_20.png";
import ic_key_arrow_down_gray900_20 from "@/assets/icons/size20/ic_key_arrow_down_gray900_20.png";
import ic_trash_gray900_20 from "@/assets/icons/size20/ic_trash_gray900_20.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import "./CareerSection.css";

import InlineMonthPicker from "@/shared/components/calendar/InlineMonthPicker";
import { parseMonth, fmtMonth } from "@/shared/utils/util";
import AISuggestArea from "@/pages/Resume/ResumeAISuggest";
import { Icons } from "@/assets/icons";
import { createExperience } from "@/api/resume/resume.api";

const makeId = () => Math.random().toString(36).slice(2, 10);

// ===== 타입 정의 =====
export type CareerInfo = {
  id?: string;
  company_name: string;
  role: string;
  position: string;
  summary: string;
  employmentType: string | null;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
};

export type CareerErrors = Partial<Record<keyof CareerInfo, string>>;

interface CareerSectionProps {
  value?: CareerInfo[];
  isFreshGraduate?: boolean;
  onChange: (careers: CareerInfo[], isFresh: boolean) => void;
  errors?: CareerErrors[];
  onClearErrors?: () => void;
  isEdit?: boolean; // 🔥 추가
}

const blankItem = (): CareerInfo => ({
  id: makeId(),
  company_name: "",
  role: "",
  position: "",
  summary: "",
  employmentType: null,
  isCurrent: false,
  startDate: "",
  endDate: "",
});

const swap = <T,>(arr: T[], i: number, j: number) => {
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

const isItemEmpty = (item: CareerInfo): boolean => {
  return (
    !item.company_name.trim() &&
    !item.role.trim() &&
    !item.position.trim() &&
    !item.summary.trim() &&
    !item.employmentType &&
    !item.startDate &&
    !item.endDate
  );
};

const normalizeItemsFromValue = (value: CareerInfo[]): CareerInfo[] => {
  if (!value || value.length === 0) return [blankItem()];
  return value.map((it) => ({
    ...it,
    id: it.id ?? makeId(),
  }));
};

export default function CareerSection({
  value = [],
  isFreshGraduate = false,
  onChange,
  errors,
  onClearErrors,
  isEdit = false, // 🔥 기본값: create 모드
}: CareerSectionProps) {
  const [items, setItems] = useState<CareerInfo[]>(() =>
    normalizeItemsFromValue(value)
  );
  const [isFresh, setIsFresh] = useState(isFreshGraduate);

  const didSyncFromValueRef = useRef(false);

  
  useEffect(() => {
    if (!isEdit) return; // create 모드는 패스
    if (didSyncFromValueRef.current) return;
    if (!value || value.length === 0) return;

    const hasRealContent = value.some((v) => !isItemEmpty(v));
    if (!hasRealContent) return;

    console.log("✅ CareerSection(edit): value 동기화", value);
    setItems(normalizeItemsFromValue(value));
    setIsFresh(isFreshGraduate);
    didSyncFromValueRef.current = true;
  }, [isEdit, value, isFreshGraduate]);

  // items / isFresh 변경 시 부모에 알리기 (공통)
  useEffect(() => {
    onChange(items, isFresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, isFresh]);

  // 이하 나머지 로직은 그대로
  const [showFreshModal, setShowFreshModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(
    null
  );

  const handleFreshCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    if (checked) {
      const hasContent = items.some((item) => !isItemEmpty(item));
      if (hasContent) {
        setShowFreshModal(true);
      } else {
        setIsFresh(true);
        setItems([blankItem()]);
        onClearErrors?.();
      }
    } else {
      setIsFresh(false);
    }
  };

  const handleConfirmFresh = () => {
    setIsFresh(true);
    setItems([blankItem()]);
    setShowFreshModal(false);
    onClearErrors?.();
  };

  const handleCancelFresh = () => {
    setShowFreshModal(false);
  };

  const importCareers = async () => {
    const fetched: Omit<CareerInfo, "id">[] = [
      {
        company_name: "위드마인드",
        role: "백엔드 개발자",
        position: "매니저",
        summary: "API 설계 및 개발",
        employmentType: "정규직",
        isCurrent: false,
        startDate: "2022-03",
        endDate: "2023-01",
      },
      {
        company_name: "케이티밀리의서재",
        role: "프론트엔드 개발자",
        position: "시니어",
        summary: "웹 서비스 개발",
        employmentType: "계약직",
        isCurrent: false,
        startDate: "2023-02",
        endDate: "2024-11",
      },
    ];
    setItems(
      (fetched.length ? fetched : [blankItem()]).map((it) => ({
        id: makeId(),
        ...it,
      }))
    );
    setIsFresh(false);
    onClearErrors?.();
  };

  const addItem = () => {
    setItems((prev) => [blankItem(), ...prev]);
    setIsFresh(false);
  };

  const handleRemoveClick = (idx: number) => {
    if (items.length <= 1) return;

    const item = items[idx];
    const empty = isItemEmpty(item);

    if (empty) {
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
    setItems((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx)
    );
  };

  const moveUp = (idx: number) =>
    setItems((prev) => (idx <= 0 ? prev : swap(prev, idx, idx - 1)));

  const moveDown = (idx: number) =>
    setItems((prev) =>
      idx >= prev.length - 1 ? prev : swap(prev, idx, idx + 1)
    );

  const patchItem = (idx: number, patch: Partial<CareerInfo>) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );
    setIsFresh(false);
  };

  return (
    <div className="resume-create-page__section resume-create-page__section--career">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          경력 <em className="resume-create-page__required">*</em>
        </div>
        <div className="resume-section-title__actions">
          <label className="resume-section-title__control resume-section-title__control--fresh">
            <input
              type="checkbox"
              className="resume-section-title__checkbox"
              checked={isFresh}
              onChange={handleFreshCheckboxChange}
            />
            <span className="resume-section-title__control-label">신입</span>
          </label>
          <span
            className="resume-section-title__action--import"
            role="button"
            tabIndex={0}
            onClick={importCareers}
          >
            <img src={ic_add_purple_20} alt="" />
            경력 불러오기
          </span>
        </div>
      </div>

      <div className="resume-create-page__section-body career-section">
        {items.map((it, idx) => (
          <CareerItem
            key={it.id ?? idx}
            index={idx}
            total={items.length}
            value={it}
            errors={errors?.[idx]}
            onChange={(patch) => patchItem(idx, patch)}
            onMoveUp={() => moveUp(idx)}
            onMoveDown={() => moveDown(idx)}
            onRemove={() => handleRemoveClick(idx)}
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
        open={showFreshModal}
        title="신입으로 변경하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="취소"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleConfirmFresh}
        onClose={handleCancelFresh}
      />

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

// ===== CareerItem 컴포넌트 =====
function CareerItem({
  index,
  total,
  value,
  errors,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  index: number;
  total: number;
  value: CareerInfo;
  errors?: CareerErrors;
  onChange: (patch: Partial<CareerInfo>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const {
    company_name,
    role,
    position,
    summary,
    employmentType,
    isCurrent,
    startDate,
    endDate,
  } = value;

  const [openEmp, setOpenEmp] = useState(false);
  const empRef = useRef<HTMLDivElement | null>(null);

  const [openStartCal, setOpenStartCal] = useState(false);
  const [openEndCal, setOpenEndCal] = useState(false);
  const startCalRef = useRef<HTMLDivElement | null>(null);
  const endCalRef = useRef<HTMLDivElement | null>(null);

  const MAX_SUMMARY = 2000;
  const [editing, setEditing] = useState(false);

  const startEditing = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e) {
      if ((e as React.KeyboardEvent).nativeEvent?.isComposing) return;
      if (e.key && e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault?.();
    }
    setEditing(true);
  };

  useEffect(() => {
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
      if (openEmp) {
        const root = empRef.current;
        if (root && !root.contains(target)) setOpenEmp(false);
      }
    };

    if (openStartCal || openEndCal || openEmp) {
      document.addEventListener("mousedown", onOutside, true);
      document.addEventListener("touchstart", onOutside, true);
      return () => {
        document.removeEventListener("mousedown", onOutside, true);
        document.removeEventListener("touchstart", onOutside, true);
      };
    }
  }, [openStartCal, openEndCal, openEmp]);

  const startMV = parseMonth(startDate) ?? null;
  const disableEndMonth = (y: number, m: number) => {
    const now = new Date();
    const afterToday =
      y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth());
    const beforeStart =
      !!startMV &&
      (y < startMV.year || (y === startMV.year && m < startMV.month));
    return beforeStart || afterToday;
  };

  const canMoveUp = total > 1 && index > 0;
  const canMoveDown = total > 1 && index < total - 1;
  const canRemove = total > 1;

  const [showAISuggest, setShowAISuggest] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false); // 🔥 AI 로딩 상태

  
  const handleClickAISuggest = async () => {
    if (!role && !(summary ?? "").trim()) {
      alert("AI 추천을 받으려면 최소 직무 또는 담당 업무를 입력해 주세요.");
      return;
    }

    try {
      setAiLoading(true);
      console.log('전송값',summary);
      const res = await createExperience({
        role_name:role, 
        user_input: summary ?? "", 
      });
      
      const { mode, bullets, missing_info } = res.data;
      
      if (mode === "NEED_MORE_INPUT") {
        setAISuggestions(missing_info);
        setShowAISuggest(true);
        setEditing(true);
      }

      if (bullets && bullets.length > 0) {
        setAISuggestions(bullets);
         setShowAISuggest(true);
         setEditing(true);
      }
      setAiLoading(false);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "AI 경력 문장 추천 중 오류가 발생했습니다."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleCloseAISuggest = () => setShowAISuggest(false);

  const handlePickSuggestion = (text: string) => {
    const prefix = (summary ?? "").trim().length > 0 ? "\n" : "";
    const next = `${summary ?? ""}${prefix}• ${text}`;
    onChange({ summary: next.slice(0, MAX_SUMMARY) });
  };

  return (
    <div className="career-section__item">
    {aiLoading && (
                 <LoadingOverlay isLoading={aiLoading}/>
              )}
      <div className="career-section__fields">
        {/* 회사명 */}
        <FormField label={<>회사명 <em>*</em></>} className="in_icon">
          <FormInput
            id={`company_name_${index}`}
            required
            value={company_name}
            onChange={(v) => onChange({ company_name: v })}
            invalid={!!errors?.company_name}
            rightIconSrc={
              errors?.company_name ? Icons.ic_error_red100_20 : undefined
            }
            placeholder="회사명을 입력해 주세요."
          />
        </FormField>

        {/* 재직 형태 및 기간 */}
        <div className="career-section__group career-section__group--employment">
          <div className="career-section__control career-section__control--employment">
            <label className="small_labe_black-14">
              재직 기간 <em className="error_text_red">*</em>
            </label>
            <div
              className={`ui-select ${errors?.employmentType ? "error" : ""}`}
              ref={empRef}
              onClick={(e) => {
                e.stopPropagation();
                setOpenEmp((o) => !o);
              }}
            >
              {employmentType ?? (
                <span className="ui-select-none-default">재직 형태</span>
              )}
              <img src={ic_arrow_drop_down_gray900_24} alt="" />
              {openEmp && (
                <div className="ui-select__menu" role="listbox">
                  {["정규직", "계약직", "인턴", "프리랜서"].map((type) => (
                    <div
                      key={type}
                      className="ui-select__option"
                      role="option"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange({ employmentType: type });
                        setOpenEmp(false);
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 시작일~종료일 */}
          <div className="career-section__period">
            <div className="career-section__date-wrapper" ref={startCalRef}>
              <FormField
                label=""
                className="career-section date career-section__date--start"
              >
                <DateInline
                  id={`career-start_${index}`}
                  iconSrc={
                    errors?.startDate ? icon_calendar_red_20 : ic_calendar_gray900_20
                  }
                  value={startDate}
                  onClick={() => setOpenStartCal(true)}
                  invalid={!!errors?.startDate}
                  rightIconSrc={
                    errors?.startDate ? Icons.ic_error_red100_20 : undefined
                  }
                  isOpen={openStartCal}
                />
              </FormField>

              {openStartCal && (
                <div className="calendar-popover">
                  <div className="calendar-popover__panel">
                    <InlineMonthPicker
                      pickerType="employmentStart"
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

            <span className="career-section__tilde">~</span>

            {isCurrent ? (
              <div className="field career-section date career-section__date--end">
                <label className="label" />
                <div className="date-section">
                  <div className="section__date-inner disabled">
                    <img src={ic_add_btn_gray700_20} alt="" />
                    재직 중
                  </div>
                </div>
              </div>
            ) : (
              <div className="career-section__date-wrapper" ref={endCalRef}>
                <FormField
                  label=""
                  className="career-section date career-section__date--end"
                >
                  <DateInline
                    id={`career-end_${index}`}
                    iconSrc={
                      errors?.endDate ? icon_calendar_red_20 : ic_calendar_gray900_20
                    }
                    value={endDate}
                    onClick={() => setOpenEndCal(true)}
                    invalid={!!errors?.endDate}
                    rightIconSrc={
                      errors?.endDate ? Icons.ic_error_red100_20 : undefined
                    }
                    isOpen={openEndCal}
                  />
                </FormField>
                {openEndCal && (
                  <div className="calendar-popover">
                    <div className="calendar-popover__panel">
                      <InlineMonthPicker
                        pickerType="employmentEnd"
                        value={parseMonth(endDate) ?? undefined}
                        defaultValue={startMV ?? undefined}
                        minYear={startMV?.year ?? 1970}
                        isDisabledMonth={disableEndMonth}
                        showCurrentToggle
                        currentChecked={!!isCurrent}
                        onCurrentChange={(next) => {
                          onChange({
                            isCurrent: next,
                            ...(next ? { endDate: "" } : {}),
                          });
                        }}
                        onApplyEx={(pickedMonth, current) => {
                          if (current) {
                            onChange({ isCurrent: true, endDate: "" });
                          } else {
                            onChange({
                              isCurrent: false,
                              endDate: fmtMonth(pickedMonth),
                            });
                          }
                          setOpenEndCal(false);
                        }}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 재직중 토글 */}
          <div className="career-section__toggle career-section__toggle--current">
            <span className="career-section__toggle-label">재직중</span>
            <Switch
              checked={!!isCurrent}
              onChange={(v) => onChange({ isCurrent: v })}
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

        {/* 직무 & 직책 */}
        <div className="career-section__row">
          <div className="career-section__control career-section__control--role">
            <FormField label={<>직무 <em>*</em></>} className="in_icon">
              <FormInput
                id={`role_${index}`}
                required
                value={role}
                onChange={(v) => onChange({ role: v })}
                invalid={!!errors?.role}
                placeholder="직무를 입력해 주세요."
              />
            </FormField>
          </div>
          <div className="career-section__control career-section__control--position">
            <FormField label={<>직책 <em>*</em></>} className="in_icon">
              <FormInput
                id={`position_${index}`}
                required
                value={position}
                onChange={(v) => onChange({ position: v })}
                invalid={!!errors?.position}
                placeholder="직책을 입력해 주세요."
              />
            </FormField>
          </div>
        </div>

        {/* 담당 업무 및 주요 성과 */}
        <div className="field career-section__control career-section__control--summary">
          <div className="small_labe_black-14">담당 업무 및 주요 성과</div>

          {editing ? (
            <div className="career-section__summary-input">
              <textarea
                id={`summary_${index}`}
                value={summary ?? ""}
                onChange={(e) =>
                  onChange({ summary: e.target.value.slice(0, 2000) })
                }
                maxLength={2000}
              />
              <span className="career-section__char-count">
                <span>{(summary ?? "").length}</span>
                <span className="max"> / 2000</span>
              </span>
              {/* {aiLoading && (
                <div className="career-section__ai-loading">
                  AI가 문장을 생성하고 있습니다...
                </div>
              )} */}
            </div>
          ) : (
            <div
              className="career-section__summary-input"
              onClick={startEditing}
              onKeyDown={startEditing}
              role="button"
              tabIndex={0}
            >
              {(summary ?? "").trim().length > 0 ? (
                <div className="career-section__summary-read">{summary}</div>
              ) : (
                <ul className="career-section__summary-tips">
                  <li className="career-section__summary-tip">
                    세부 내용을 입력해 주세요.
                  </li>
                  <li className="career-section__summary-tip">
                    프로젝트 경험은 역할ㆍ기여도ㆍ성과 중심으로 정리하면 좋습니다.
                  </li>
                </ul>
              )}
              <span className="career-section__char-count">
                <span>{(summary ?? "").length}</span>
                <span className="max"> / 2000</span>
              </span>
              {/* {aiLoading && (
                <div className="career-section__ai-loading">
                  AI가 문장을 생성하고 있습니다...
                </div>
              )} */}
            </div>
          )}

          <AISuggestArea
            show={showAISuggest}
            items={aiSuggestions}
            hintText="정확한 문장 추천을 위해 (직무와 담당 업무) 항목을 먼저 입력해주세요."
            onClickSuggest={handleClickAISuggest}
            onClose={handleCloseAISuggest}
            wrapperClassName="resume-suggest__career"
          />
        </div>
      </div>

      {/* 순서 변경 및 삭제 버튼 */}
      <div className="career-section__controls">
        <span
          className={`career-section__control_btn career-section__control--up ${
            !canMoveUp ? "is-disabled first" : ""
          }`}
          role="button"
          tabIndex={0}
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
          className={`career-section__control_btn career-section__control--down ${
            !canMoveDown ? "is-disabled last" : ""
          }`}
          role="button"
          tabIndex={0}
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
          className={`career-section__control_btn career-section__control--remove ${
            !canRemove ? "is-disabled" : ""
          }`}
          role="button"
          tabIndex={0}
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
