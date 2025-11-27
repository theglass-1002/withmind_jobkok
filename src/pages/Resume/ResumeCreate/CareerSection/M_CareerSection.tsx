

import React, { useEffect, useRef, useState } from "react";
import FormField from "@/shared/components/form/FormField";
import FormInput from "@/shared/components/form/FormInput";
import DateInline from "@/shared/components/form/DateInline";
import Switch from "react-switch";

import ic_error_red100_20 from "@/assets/icons/size20/ic_error_red100_20.png";
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

const makeId = () => Math.random().toString(36).slice(2, 10);

export type CareerInfo = {
  id: string;
  company_name: string;
  role: string;
  position: string;
  summary: string;
  employmentType: string | null;
  isCurrent: boolean;
  startDate: string; // "YYYY.MM"
  endDate: string;   // "YYYY.MM"
};
type CareerErrors = Partial<Record<keyof CareerInfo, string>>;

// 상위 컴포넌트(ResumeCreate)에서 전달하는 Props 타입을 정의합니다.
// 이 타입은 ResumeCreate의 BasicInfo 타입과 일치해야 합니다. (여기서는 any로 처리)
interface CareerSectionProps {
  values: any;
  errors: any;
  onChange: (patch: any) => void;
  onFocusAny: () => void;
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

export default function M_CareerSection(props: CareerSectionProps) {
  const [items, setItems] = useState<CareerInfo[]>([blankItem()]);
  const [itemErrors] = useState<CareerErrors[]>([]);

  const importCareers = async () => {
    const fetched: Omit<CareerInfo, "id">[] = [
      {
        company_name: "위드마인드",
        role: "",
        position: "",
        summary: "",
        employmentType: "정규직",
        isCurrent: false,
        startDate: "2022.03",
        endDate: "2023.01",
      },
      {
        company_name: "케이티밀리의서재",
        role: "",
        position: "",
        summary: "",
        employmentType: "계약직",
        isCurrent: false,
        startDate: "2023.02",
        endDate: "2024.11",
      },
    ];
    setItems((fetched.length ? fetched : [blankItem()]).map(it => ({ id: makeId(), ...it })));
  };

  const addItem = () => setItems((prev) => [blankItem(), ...prev]);

  const removeItem = (idx: number) =>
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx)));

  const moveUp = (idx: number) =>
    setItems((prev) => (idx <= 0 ? prev : swap(prev, idx, idx - 1)));

  const moveDown = (idx: number) =>
    setItems((prev) => (idx >= prev.length - 1 ? prev : swap(prev, idx, idx + 1)));

  const patchItem = (idx: number, patch: Partial<CareerInfo>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

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
      </div>
      
      <div className="resume-create-page__section-action">
        <button className="btn_w_full default_btn_white"><img src={ic_add_btn_gray900_20} alt="" /> 추가</button>
      </div>
      {/* <div className="resume-create-page__section-body career-section">
        {items.map((it, idx) => (
          <CareerItem
            key={it.id}
            index={idx}
            total={items.length}
            value={it}
            errors={itemErrors[idx]}
            onChange={(patch) => patchItem(idx, patch)}
            onMoveUp={() => moveUp(idx)}
            onMoveDown={() => moveDown(idx)}
            onRemove={() => removeItem(idx)}
          />
        ))}

        <span className="default_btn_white" role="button" tabIndex={0} onClick={addItem}>
          <img src={ic_add_btn_gray900_20} alt="" />
          추가
        </span>
      </div> */}
    </div>
  );
}

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
      !!startMV && (y < startMV.year || (y === startMV.year && m < startMV.month));
    return beforeStart || afterToday;
  };

  const canMoveUp = total > 1 && index > 0;
  const canMoveDown = total > 1 && index < total - 1;
  const canRemove = total > 1;

  const [showAISuggest, setShowAISuggest] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);

  const handleClickAISuggest = () => {
    setAISuggestions([
      "면접 분석 서비스 API 설계 및 FastAPI 기반 서버 구축",
      "RabbitMQ, Redis 기반 비동기 영상 처리 파이프라인 설계",
      "GCP Cloud Run + Cloud Tasks 구조 전환으로 처리 시간 35% 개선",
      "서비스 응답 속도 1.2s → 0.6s 단축",
      "GPU 서버 병목 제거로 모델 동시 실행 성능 2배 향상",
    ]);
    setShowAISuggest(true);
  };
  const handleCloseAISuggest = () => setShowAISuggest(false);
  const handlePickSuggestion = (text: string) => {
    const prefix = (summary ?? "").trim().length > 0 ? "\n" : "";
    const next = `${summary ?? ""}${prefix}• ${text}`;
    onChange({ summary: next.slice(0, MAX_SUMMARY) });
  };

  return (
    <div className="career-section__item">
      <div className="career-section__fields">
        <FormField label={<>회사명 <em>*</em></>} className="in_icon">
          <FormInput
            id={`company_name_${index}`}
            required
            value={company_name}
            onChange={(v) => onChange({ company_name: v })}
            invalid={!!errors?.company_name}
            rightIconSrc={errors?.company_name ? ic_error_red100_20 : undefined}
            placeholder="회사명을 입력해 주세요."
          />
        </FormField>

        <div className="career-section__group career-section__group--employment">
          <div className="career-section__control career-section__control--employment">
            <label className="small_labe_black-14">
              재직 기간 <em className="error_text_red">*</em>
            </label>
            <div
              className="ui-select"
              ref={empRef}
              onClick={(e) => {
                e.stopPropagation();
                setOpenEmp((o) => !o);
              }}
            >
              {employmentType ?? <span className="ui-select-none-default">재직 형태</span>}
              <img src={ic_arrow_drop_down_gray900_24} alt="" />
              {openEmp && (
                <div className="ui-select__menu" role="listbox">
                  <div className="ui-select__option" role="option" onClick={(e) => { e.stopPropagation(); onChange({ employmentType: "정규직" }); setOpenEmp(false); }}>정규직</div>
                  <div className="ui-select__option" role="option" onClick={(e) => { e.stopPropagation(); onChange({ employmentType: "계약직" }); setOpenEmp(false); }}>계약직</div>
                  <div className="ui-select__option" role="option" onClick={(e) => { e.stopPropagation(); onChange({ employmentType: "인턴" }); setOpenEmp(false); }}>인턴</div>
                  <div className="ui-select__option" role="option" onClick={(e) => { e.stopPropagation(); onChange({ employmentType: "프리랜서" }); setOpenEmp(false); }}>프리랜서</div>
                </div>
              )}
            </div>
          </div>

          <div className="career-section__period">
            <div className="career-section__date-wrapper" ref={startCalRef}>
              <FormField label="" className="career-section date career-section__date--start">
                <DateInline
                  id={`career-start_${index}`}
                  iconSrc={errors?.startDate ? icon_calendar_red_20 : ic_calendar_gray900_20}
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
                      pickerType="employmentStart"
                      value={parseMonth(startDate) ?? undefined}
                      minYear={1970}
                      onChange={() => {}}
                      onApply={(d) => {
                        onChange({ startDate: fmtMonth(d) });
                        const endMV = parseMonth(endDate);
                        if (endMV && (endMV.year < d.year || (endMV.year === d.year && endMV.month < d.month))) {
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
                <label className="label">{}</label>
                <div className="date-section">
                  <div className="section__date-inner disabled">
                    <img src={ic_add_btn_gray700_20} alt="" />
                    재직 중
                  </div>
                </div>
              </div>
            ) : (
              <div className="career-section__date-wrapper" ref={endCalRef}>
                <FormField label="" className="career-section date career-section__date--end">
                  <DateInline
                    id={`career-end_${index}`}
                    iconSrc={errors?.endDate ? icon_calendar_red_20 : ic_calendar_gray900_20}
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
                        pickerType="employmentEnd"
                        value={parseMonth(endDate) ?? undefined}
                        defaultValue={startMV ?? undefined}
                        minYear={startMV?.year ?? 1970}
                        isDisabledMonth={disableEndMonth}
                        showCurrentToggle
                        currentChecked={!!isCurrent}
                        onCurrentChange={(next) => {
                          onChange({ isCurrent: next, ...(next ? { endDate: "" } : {}) });
                        }}
                        onApplyEx={(pickedMonth, current) => {
                          if (current) {
                            onChange({ isCurrent: true, endDate: "" });
                          } else {
                            onChange({ isCurrent: false, endDate: fmtMonth(pickedMonth) });
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

          <div className="career-section__toggle career-section__toggle--current error_box">
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

        <div className="career-section__row">
          <div className="career-section__control career-section__control--role">
            <FormField label={<>직무 <em>*</em></>} className="in_icon">
              <FormInput
                id={`role_${index}`}
                required
                value={role}
                onChange={(v) => onChange({ role: v })}
                invalid={!!errors?.role}
                rightIconSrc={errors?.role ? ic_error_red100_20 : undefined}
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
                rightIconSrc={errors?.position ? ic_error_red100_20 : undefined}
                placeholder="직책을 입력해 주세요."
              />
            </FormField>
          </div>
        </div>

        <div className="field career-section__control career-section__control--summary">
          <div className="small_labe_black-14">담당 업무 및 주요 성과</div>

          {editing ? (
            <div className="career-section__summary-input">
              <textarea
                id={`summary_${index}`}
                value={summary ?? ""}
                onChange={(e) => onChange({ summary: e.target.value.slice(0, 2000) })}
                maxLength={2000}
              />
              <span className="career-section__char-count">
                <span>{(summary ?? "").length}</span>
                <span className="max"> / 2000</span>
              </span>
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
                <div className="career-section__summary-read">
                  {summary}
                </div>
              ) : (
                <ul className="career-section__summary-tips">
                  <li className="career-section__summary-tip">세부 내용을 입력해 주세요.</li>
                  <li className="career-section__summary-tip">프로젝트 경험은 역할ㆍ기여도ㆍ성과 중심으로 정리하면 좋습니다.</li>
                </ul>
              )}
              <span className="career-section__char-count">
                <span>{(summary ?? "").length}</span>
                <span className="max"> / 2000</span>
              </span>
            </div>
          )}

<AISuggestArea
            show={showAISuggest}
            items={aiSuggestions}
            onOpen={handleClickAISuggest}
            onClose={handleCloseAISuggest}
            onPick={handlePickSuggestion}
            starIconGray={ic_star_gray700_20}
            starIconGreen={ic_star_green_20}
            closeIcon={ic_close_gray500_20}
          />
        </div>
      </div>

      <div className="career-section__controls">
        <span
          className={`career-section__control_btn career-section__control--up ${!canMoveUp ? 'is-disabled first' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => canMoveUp && onMoveUp()}
          aria-disabled={!canMoveUp}
        >
          <img src={canMoveUp ? ic_key_arrow_up_gray900_20 : ic_key_arrow_up_gray500_20} alt="" />
        </span>

        <span
          className={`career-section__control_btn career-section__control--down ${!canMoveDown ? 'is-disabled last' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => canMoveDown && onMoveDown()}
          aria-disabled={!canMoveDown}
        >
          <img src={canMoveDown ? ic_key_arrow_down_gray900_20 : ic_key_arrow_down_gray500_20} alt="" />
        </span>

        <span
          className={`career-section__control_btn career-section__control--remove ${!canRemove ? 'is-disabled' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => canRemove && onRemove()}
          aria-disabled={!canRemove}
        >
          <img src={canRemove ? ic_trash_gray900_20 : ic_trash_gray500_20} alt="" />
        </span>
      </div>
    </div>
  );
}