import React, { useEffect, useRef, useState } from "react";
import FormField from "@/shared/components/form/FormField";
import FormInput from "@/shared/components/form/FormInput";
import DateInline from "@/shared/components/form/DateInline";
import Switch from "react-switch";

import ic_error_red100_20 from "@/assets/icons/size20/ic_error_red100_20.png";
import ic_star_gray700_20 from "@/assets/icons/size20/ic_star_gray700_20.png";
import ic_trash_gray500_20 from "@/assets/icons/size20/ic_trash_gray500_20.png";
import icon_calendar_red_20 from "@/assets/icons/size20/icon_calendar_red_20.png";
import ic_calendar_gray900_20 from "@/assets/icons/size20/ic_calendar_gray900_20.png";
import ic_add_btn_gray700_20 from "@/assets/icons/size20/ic_calendar_gray700_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_key_arrow_down_gray500_20 from "@/assets/icons/size20/ic_key_arrow_down_gray500_20.png";
import ic_key_arrow_up_gray500_20 from "@/assets/icons/size20/ic_key_arrow_up_gray500_20.png";

import "./CareerSection.css";

import InlineMonthPicker from "@/shared/components/calendar/InlineMonthPicker";
import { parseMonth, fmtMonth } from "@/shared/utils/util";

// ===== 타입 =====
export type CareerInfo = {
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

// 공백 아이템
const blankItem = (): CareerInfo => ({
  company_name: "",
  role: "",
  position: "",
  summary: "",
  employmentType: null,
  isCurrent: false,
  startDate: "",
  endDate: "",
});

// 배열 swap
const swap = <T,>(arr: T[], i: number, j: number) => {
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

export default function CareerSection() {
  // 리스트(내부 상태에서 전부 관리)
  const [items, setItems] = useState<CareerInfo[]>([blankItem()]);
  const [itemErrors] = useState<CareerErrors[]>([]); // 필요 시 유효성 바인딩

  // “경력 불러오기” (예시: 실제로는 API 연동)
  const importCareers = async () => {
    const fetched: CareerInfo[] = [
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
    setItems(fetched.length ? fetched : [blankItem()]);
  };

  // CRUD & 이동
  // 새 아이템을 "맨 위"에 추가 (prepend)
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
        {items.map((it, idx) => (
          <CareerItem
            key={idx}
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
      </div>
    </div>
  );
}

// ===== 단일 아이템 =====
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

  // 재직 형태 드롭다운(열림 상태만 로컬)
  const [openEmp, setOpenEmp] = useState(false);

  // 달력(아이템별)
  const [openStartCal, setOpenStartCal] = useState(false);
  const [openEndCal, setOpenEndCal] = useState(false);
  const startCalRef = useRef<HTMLDivElement | null>(null);
  const endCalRef = useRef<HTMLDivElement | null>(null);

  // "담당 업무" 편집 토글(아이템별)
  const MAX_SUMMARY = 2000;
  const [editing, setEditing] = useState(false);
  const count = (summary ?? "").length;
  const startEditing = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e) {
      // 한글 조합 중 키이벤트 무시
      // @ts-ignore
      if (e.nativeEvent?.isComposing) return;
      // @ts-ignore
      if (e.key && e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault?.();
    }
    setEditing(true);
  };

  // 팝오버 바깥 클릭 닫기
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
    document.addEventListener("mousedown", onOutside, true);
    document.addEventListener("touchstart", onOutside, true);
    return () => {
      document.removeEventListener("mousedown", onOutside, true);
      document.removeEventListener("touchstart", onOutside, true);
    };
  }, [openStartCal, openEndCal]);

  // end 달력 비활성 규칙: start 이전 + 오늘 이후
  const startMV = parseMonth(startDate) ?? null;
  const disableEndMonth = (y: number, m: number) => {
    const now = new Date();
    const afterToday =
      y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth());
    const beforeStart =
      !!startMV && (y < startMV.year || (y === startMV.year && m < startMV.month));
    return beforeStart || afterToday;
  };

  // 이동/삭제 버튼 활성도
  const canMoveUp = total > 1 && index > 0;
  const canMoveDown = total > 1 && index < total - 1;
  const canRemove = total > 1;

  return (

    <div className="career-section__item">
      <div className="career-section__fields">
        {/* 회사명 */}
        <FormField label={<>회사명 <em>*</em></>} className="in_icon">
          <FormInput
            id={`company_name_${index}`}
            required
            value={company_name}
            onChange={(v) => onChange({ company_name: v })}
            invalid={!!errors?.company_name}
            rightIconSrc={errors?.company_name ? ic_error_red100_20 : undefined}
          />
        </FormField>

        {/* 재직 형태 + 기간 */}
        <div className="career-section__group career-section__group--employment">
          {/* 재직 형태 */}
          <div className="career-section__control career-section__control--employment">
            <label className="small_labe_black-14">
              재직 기간 <em className="error_text_red">*</em>
            </label>
            <div className="ui-select" 
              onClick={(e) => {
                e.stopPropagation();
                setOpenEmp((o) => !o);
              }}
            >
            
              {employmentType ?? <span className="ui-select-none-default">재직 형태</span>}
              <img src={ic_arrow_drop_down_gray900_24} alt="" />
              {openEmp && (
                <div className="ui-select__menu" role="listbox">
                  <div
                    className="ui-select__option"
                    role="option"
                    onClick={(e) => {
                      e.stopPropagation();         
                      onChange({ employmentType: "정규직" });
                      setOpenEmp(false);
                    }}
                  >
                    정규직
                  </div>
                  <div
                    className="ui-select__option"
                    role="option"
                    onClick={(e) => {
                      e.stopPropagation();   
                      onChange({ employmentType: "계약직" });
                      setOpenEmp(false);
                    }}
                  >
                    계약직
                  </div>
                  <div
                    className="ui-select__option"
                    role="option"
                    onClick={(e) => {
                      e.stopPropagation();   
                      onChange({ employmentType: "인턴" });
                      setOpenEmp(false);
                    }}
                  >
                    인턴
                  </div>
                  <div
                    className="ui-select__option"
                    role="option"
                    onClick={(e) => {
                      e.stopPropagation();   
                      onChange({ employmentType: "프리랜서" });
                      setOpenEmp(false);
                    }}
                  >
                    프리랜서
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 시작/종료 기간 */}
          <div className="career-section__period">
            {/* 시작 */}
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
                        // 시작이 변경되면 종료가 시작 이전인 경우 보정
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

            {/* 종료 */}
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

        // ✅ 토글(재직중) 노출 & 부모 상태와 동기화
        showCurrentToggle
        currentChecked={!!isCurrent}
        onCurrentChange={(next) => {
          // 토글만 눌렀을 때도 부모 상태 갱신하고 싶으면 사용
          onChange({ isCurrent: next, ...(next ? { endDate: "" } : {}) });
        }}

        // ✅ 적용(Apply) 눌렀을 때 month + isCurrent 둘 다 받기
        onApplyEx={(pickedMonth, current) => {
          if (current) {
            // 재직중이면 종료일 비우고 재직중 true
            onChange({ isCurrent: true, endDate: "" });
          } else {
            // 재직중이 아니면 종료일 저장, 재직중 false
            onChange({ isCurrent: false, endDate: fmtMonth(pickedMonth) });
          }
          setOpenEndCal(false);
        }}

        // (선택) 기존 onChange 미리보기 안쓰면 지워도 됨
        onChange={() => {}}
        // (선택) onApply는 하위호환용. onApplyEx 쓰면 생략 가능
        // onApply={(d) => {...}}
      />
    </div>
  </div>
)}

              </div>
            )}
          </div>

          {/* 재직중 토글 */}
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

        {/* 직무/직책 */}
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
              />
            </FormField>
          </div>
        </div>

        {/* 담당 업무 (토글형) */}
        <div className="field career-section__control career-section__control--summary">
          <div className="small_labe_black-14">담당 업무 및 주요 성과</div>

          {editing ? (
            <div className="career-section__summary-input">
              <textarea
                id={`summary_${index}`}
                value={summary ?? ""}
                onChange={(e) =>
                  onChange({ summary: e.target.value.slice(0, MAX_SUMMARY) })
                }
                maxLength={MAX_SUMMARY}
              />
              <span className="career-section__char-count">
                <span>{count}</span>
                <span className="max"> / {MAX_SUMMARY}</span>
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
          )}

          <div className="resume-create-page__assist">
            <span className="resume-create-page__assist-text">
              <img src={ic_star_gray700_20} alt="" />
              더 적합한 문장을 추천을 위해 아래 항목들을 먼저 채워주세요.
            </span>
            <span className="career-section__summary-ai-btn">AI 문장 추천</span>
          </div>
        </div>
      </div>

      {/* 아이템 컨트롤 */}
      <div className="career-section__controls">
        <span
          className={`career-section__control_btn career-section__control--up ${
            !canMoveUp ? "first" : ""
          }`}
          role="button"
          tabIndex={0}
          onClick={() => canMoveUp && onMoveUp()}
          aria-disabled={!canMoveUp}
        >
          <img src={ic_key_arrow_up_gray500_20} alt="" />
        </span>
        <span
          className={`career-section__control_btn career-section__control--down ${
            !canMoveDown ? "last" : ""
          }`}
          role="button"
          tabIndex={0}
          onClick={() => canMoveDown && onMoveDown()}
          aria-disabled={!canMoveDown}
        >
          <img src={ic_key_arrow_down_gray500_20} alt="" />
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
          <img src={ic_trash_gray500_20} alt="" />
        </span>
      </div>
    </div>
  );
}
