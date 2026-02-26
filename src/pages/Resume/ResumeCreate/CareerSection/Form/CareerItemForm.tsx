// src/pages/.../CareerSection/Form/CareerItemForm.tsx
import React, { useEffect, useRef, useState } from "react";
import FormField from "@/shared/components/form/FormField";
import FormInput from "@/shared/components/form/FormInput";
import DateInline from "@/shared/components/form/DateInline";
import InlineMonthPicker from "@/shared/components/calendar/InlineMonthPicker";
import AISuggestArea from "@/pages/Resume/ResumeAISuggest";
import ic_error_red100_20 from "@/assets/icons/size20/ic_error_red100_20.png";
import icon_calendar_red_20 from "@/assets/icons/size20/icon_calendar_red_20.png";
import ic_calendar_gray900_20 from "@/assets/icons/size20/ic_calendar_gray900_20.png";
import ic_add_btn_gray700_20 from "@/assets/icons/size20/ic_calendar_gray700_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import ic_key_arrow_down_gray500_20 from "@/assets/icons/size20/ic_key_arrow_down_gray500_20.png";
import ic_key_arrow_up_gray500_20 from "@/assets/icons/size20/ic_key_arrow_up_gray500_20.png";
import ic_key_arrow_up_gray900_20 from "@/assets/icons/size20/ic_key_arrow_up_gray900_20.png";
import ic_key_arrow_down_gray900_20 from "@/assets/icons/size20/ic_key_arrow_down_gray900_20.png";
import ic_trash_gray900_20 from "@/assets/icons/size20/ic_trash_gray900_20.png";
import ic_trash_gray500_20 from "@/assets/icons/size20/ic_trash_gray500_20.png";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { parseMonth, fmtMonth, formatMonthStringToDisplay } from "@/shared/utils/util";
import "../CareerSection.css";
import { Icons } from "@/assets/icons";
import { createExperience } from "@/api/resume/resume.api";


export type CareerInfo = {
  id: string;
  company_name: string;
  role: string;
  position: string;
  summary: string;
  employmentType: string | null;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
};

type CareerErrors = Partial<Record<keyof CareerInfo, string>>;

interface CareerItemFormProps {
  index: number;
  total: number;
  value: CareerInfo;
  errors?: CareerErrors; // 에러 추가!
  onChange: (patch: Partial<CareerInfo>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export default function CareerItemForm({
  index,
  total,
  value,
  errors = {}, // 기본값!
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: CareerItemFormProps) {
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

  const [localErrors, setLocalErrors] = useState<CareerErrors>({});

  // props 에러와 local 에러 병합
  const displayErrors = { ...errors, ...localErrors };

  const [openEmp, setOpenEmp] = useState(false);
  const empRef = useRef<HTMLDivElement | null>(null);

  const [openStartCal, setOpenStartCal] = useState(false);
  const [openEndCal, setOpenEndCal] = useState(false);
  const startCalRef = useRef<HTMLDivElement | null>(null);
  const endCalRef = useRef<HTMLDivElement | null>(null);

  const MAX_SUMMARY = 2000;

  const [showAISuggest, setShowAISuggest] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false); 
  const [editing, setEditing] = useState(false);

  // 외부 클릭 감지
  useEffect(() => {
    const onOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;

      if (openStartCal && startCalRef.current && !startCalRef.current.contains(target)) {
        setOpenStartCal(false);
      }
      if (openEndCal && endCalRef.current && !endCalRef.current.contains(target)) {
        setOpenEndCal(false);
      }
      if (openEmp && empRef.current && !empRef.current.contains(target)) {
        setOpenEmp(false);
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

  // AI 제안
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

  const startEditing = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e) {
      if ((e as React.KeyboardEvent).nativeEvent?.isComposing) return;
      if (e.key && e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault?.();
    }
    setEditing(true);
  };
  // 종료일 비활성화 조건
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

  return (
    <div className="career-section__item">
      <LoadingOverlay
        isLoading={aiLoading}
        isLogo
      />
      <div className="career-section__fields">
        {/* 회사명 */}
        <FormField label={<>회사명 <em>*</em></>} className="in_icon">
          <FormInput
            id={`company_name_${index}`}
            required
            value={company_name}
            onChange={(v) => {
              onChange({ company_name: v });
              if (displayErrors.company_name) {
                setLocalErrors(prev => ({ ...prev, company_name: undefined }));
              }
            }}
            invalid={!!displayErrors?.company_name}
            rightIconSrc={displayErrors?.company_name ? ic_error_red100_20 : undefined}
            placeholder="회사명을 입력해 주세요."
          />
        </FormField>

        {/* 재직 기간 */}
        <div className="career-section__group career-section__group--employment">
          <div className="career-section__control career-section__control--employment">
            <label className="small_labe_black-14">
              재직 형태 <em className="error_text_red">*</em>
            </label>
            <div
              className={`ui-select ${displayErrors.employmentType ? 'error' : ''}`}
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
                  <div
                    className="ui-select__option"
                    role="option"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange({ employmentType: "정규직" });
                      setOpenEmp(false);
                      if (displayErrors.employmentType) {
                        setLocalErrors(prev => ({ ...prev, employmentType: undefined }));
                      }
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
                      if (displayErrors.employmentType) {
                        setLocalErrors(prev => ({ ...prev, employmentType: undefined }));
                      }
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
                      if (displayErrors.employmentType) {
                        setLocalErrors(prev => ({ ...prev, employmentType: undefined }));
                      }
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
                      if (displayErrors.employmentType) {
                        setLocalErrors(prev => ({ ...prev, employmentType: undefined }));
                      }
                    }}
                  >
                    프리랜서
                  </div>
                </div>
              )}
            </div>
          
          </div>

          <div className="career-section__period">
            {/* 시작일 */}
            <div className="career-section__date-wrapper" ref={startCalRef}>
              <DateInline
                className="career-section date career-section__date--start"
                id={`career-start_${index}`}
                iconSrc={displayErrors?.startDate ? icon_calendar_red_20 : ic_calendar_gray900_20}
                value={formatMonthStringToDisplay(startDate)}
                onClick={() => setOpenStartCal(true)}
                invalid={!!displayErrors?.startDate}
                errorMessage={displayErrors?.startDate}
            
                isOpen={openStartCal}
              />

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
                        if (displayErrors.startDate) {
                          setLocalErrors(prev => ({ ...prev, startDate: undefined }));
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <span className="career-section__tilde">~</span>

            {/* 종료일 */}
            {isCurrent ? (
              <div className="field career-section date career-section__date--end">
             
                <div className="date-section">
                  <div className="section__date-inner disabled">
                    <img src={ic_add_btn_gray700_20} alt="" />
                    재직 중
                  </div>
                </div>
              </div>
            ) : (
              <div className="career-section__date-wrapper" ref={endCalRef}>
                <DateInline
                  className="career-section date career-section__date--end"
                  id={`career-end_${index}`}
                  iconSrc={displayErrors?.endDate ? icon_calendar_red_20 : ic_calendar_gray900_20}
                  value={formatMonthStringToDisplay(endDate)}
                  onClick={() => setOpenEndCal(true)}
                  invalid={!!displayErrors?.endDate}
                  errorMessage={displayErrors?.endDate}
             
                  isOpen={openEndCal}
                />
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
                          if (displayErrors.endDate) {
                            setLocalErrors(prev => ({ ...prev, endDate: undefined }));
                          }
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
          <span
              className="career-section__toggle-label"
              onClick={() => onChange({ isCurrent: !isCurrent })}
            >
              <img
                src={
                  isCurrent
                    ? Icons.ic_check_box_purple24
                    : Icons.ic_check_box_blank_gray400_24
                }
                alt=""
              />
              재직중
            </span>

          {/* <div className="career-section__toggle career-section__toggle--current">
            <span className="career-section__toggle-label">
              <img src={Icons.ic_check_box_blank_gray400_24} alt="" />
              재직중</span>
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
          </div> */}
        </div>

        {/* 직무, 직책 */}
        <div className="career-section__row">
          <div className="career-section__control career-section__control--role">
            <FormField label={<>직무 <em>*</em></>} className="in_icon">
              <FormInput
                id={`role_${index}`}
                required
                value={role}
                onChange={(v) => {
                  onChange({ role: v });
                  if (displayErrors.role) {
                    setLocalErrors(prev => ({ ...prev, role: undefined }));
                  }
                }}
                invalid={!!displayErrors?.role}
                rightIconSrc={displayErrors?.role ? ic_error_red100_20 : undefined}
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
                onChange={(v) => {
                  onChange({ position: v });
                  if (displayErrors.position) {
                    setLocalErrors(prev => ({ ...prev, position: undefined }));
                  }
                }}
                invalid={!!displayErrors?.position}
                rightIconSrc={displayErrors?.position ? ic_error_red100_20 : undefined}
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
                  - 프로젝트 경험은 역할ㆍ기여도ㆍ성과 중심으로 정리하면 좋습니다.
                  </li>
                  <li className="career-section__summary-tip">
                  - 작성 후 [AI 문장 추천]을 눌러 추천 내용을 참고해 보세요.
                  </li>
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
            hintText="정확한 문장 추천을 위해 (직무와 담당 업무) 항목을 먼저 입력해주세요."
            onClickSuggest={handleClickAISuggest}
            onClose={handleCloseAISuggest}
            wrapperClassName="resume-suggest__career"
          />
        </div>

        {/* 컨트롤 버튼 */}
        <div className="career-section__controls">
          <span
            className={`career-section__control_btn career-section__control--up ${!canMoveUp ? 'is-disabled first' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => canMoveUp && onMoveUp()}
            aria-disabled={!canMoveUp}
          >
            <img src={canMoveUp ? ic_key_arrow_up_gray900_20 : ic_key_arrow_up_gray500_20} alt="위로" />
          </span>

          <span
            className={`career-section__control_btn career-section__control--down ${!canMoveDown ? 'is-disabled last' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => canMoveDown && onMoveDown()}
            aria-disabled={!canMoveDown}
          >
            <img src={canMoveDown ? ic_key_arrow_down_gray900_20 : ic_key_arrow_down_gray500_20} alt="아래로" />
          </span>

          <span
            className={`career-section__control_btn career-section__control--remove ${!canRemove ? 'is-disabled' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => canRemove && onRemove()}
            aria-disabled={!canRemove}
          >
            <img src={canRemove ? ic_trash_gray900_20 : ic_trash_gray500_20} alt="삭제" />
          </span>
        </div>
      </div>
    </div>
  );
}