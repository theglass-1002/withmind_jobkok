// src/pages/.../ActivitiesSection/Form/M_ActivitiesItemForm.tsx
import React, { useEffect, useRef, useState } from "react";
import "../ActivitiesSection.css";

import FormInput from "@/shared/components/form/FormInput";
import DateInline from "@/shared/components/form/DateInline";
import InlineMonthPicker from "@/shared/components/calendar/InlineMonthPicker";
import SelectDropdown from '@/shared/components/select-dropdown/SelectDropdown';

import ic_key_arrow_down_gray500_20 from "@/assets/icons/size20/ic_key_arrow_down_gray500_20.png";
import ic_key_arrow_up_gray500_20 from "@/assets/icons/size20/ic_key_arrow_up_gray500_20.png";
import ic_trash_gray500_20 from "@/assets/icons/size20/ic_trash_gray500_20.png";
import ic_key_arrow_up_gray900_20 from "@/assets/icons/size20/ic_key_arrow_up_gray900_20.png";
import ic_key_arrow_down_gray900_20 from "@/assets/icons/size20/ic_key_arrow_down_gray900_20.png";
import ic_trash_gray900_20 from "@/assets/icons/size20/ic_trash_gray900_20.png";

import { parseMonth, fmtMonth, formatMonthStringToDisplay } from "@/shared/utils/util";
import type { ActivityItem } from "../M_ActivitiesSection";
import { Icons } from "@/assets/icons";

type ActivityErrors = Partial<Record<keyof ActivityItem, string>>;

interface M_ActivitiesItemFormProps {
  index: number;
  total: number;
  value: ActivityItem;
  errors?: ActivityErrors;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isEditingSummary: boolean;
  onChange: (patch: Partial<ActivityItem>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onStartEditSummary: () => void;
  onChangeSummary: (value: string) => void;
}

const MAX_SUMMARY = 2000;

export default function M_ActivitiesItemForm({
  index,
  total,
  value,
  errors = {},
  canMoveUp,
  canMoveDown,
  isEditingSummary,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  onStartEditSummary,
  onChangeSummary,
}: M_ActivitiesItemFormProps) {
  const { category, activityName, startDate, endDate, summary } = value;

  const [openType, setOpenType] = useState(false);
  const [openStartCal, setOpenStartCal] = useState(false);
  const [openEndCal, setOpenEndCal] = useState(false);

  const selectRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const startMV = parseMonth(startDate || "") ?? undefined;

  const makeDisableEnd = (start?: string) => {
    const startM = parseMonth(start || "") ?? null;
    return (y: number, m: number) => {
      const now = new Date();
      const afterToday =
        y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth());
      const beforeStart =
        !!startM && (y < startM.year || (y === startM.year && m < startM.month));
      return beforeStart || afterToday;
    };
  };

  // 외부 클릭으로 select / 캘린더 닫기
  useEffect(() => {
    if (!openType && !openStartCal && !openEndCal) return;
    const onDocClick = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (openType && selectRef.current && !selectRef.current.contains(t)) {
        setOpenType(false);
      }
      if (openStartCal && startRef.current && !startRef.current.contains(t)) {
        setOpenStartCal(false);
      }
      if (openEndCal && endRef.current && !endRef.current.contains(t)) {
        setOpenEndCal(false);
      }
    };
    document.addEventListener("mousedown", onDocClick, true);
    document.addEventListener("touchstart", onDocClick, true);
    return () => {
      document.removeEventListener("mousedown", onDocClick, true);
      document.removeEventListener("touchstart", onDocClick, true);
    };
  }, [openType, openStartCal, openEndCal]);

  const canRemove = total >= 1; // 1개일 때도 클릭 → 상위에서 모달 처리

  return (
    <div className="activities-section__item">
      <div className="activities-section__fields">
        <div className="activities-section__group">
          <div className="activities-section__control">
      
          <SelectDropdown
            label="활동ㆍ경험명"
            required
            placeholder="구분"
            options={[
              { value: "교내활동", label: "교내활동" },
              { value: "인턴", label: "인턴" },
              { value: "자원봉사", label: "자원봉사" },
              { value: "동아리", label: "동아리" },
              { value: "사회활동", label: "사회활동" },
              { value: "수행과제", label: "수행과제" },
              { value: "해외연수", label: "해외연수" },
              { value: "교육 이수", label: "교육이수" },
            ]}
            value={category ?? ""}
            onChange={(val) => onChange({ category: val })}
            className="activities-section__select"
            errorIconSrc={errors.category ? Icons.ic_error_red100_20 : undefined}
          />
          </div>

          <FormInput
            placeholder="활동ㆍ경험명을 입력해 주세요."
            inputClassName="activity_name"
            id={`activity_name_${value.id}`}
            value={activityName}
            onChange={(v: any) =>
              onChange({
                activityName: typeof v === "string" ? v : v?.target?.value ?? "",
              })
            }
            invalid={!!errors.activityName}
            rightIconSrc={errors?.activityName ? Icons.ic_error_red100_20 : undefined}
          />
        </div>

        <div className="activities-period">
          <label className="activities-period__label small_labe_black-14">
            활동ㆍ경험 기간 <em className="error_text_red">*</em>
          </label>

          <div className="activities-period__fields">
            <div
              className="activities-period__field activities-period__field--start"
              ref={startRef}
            >
              <DateInline
                id={`activities-start_${index}`}
                // iconSrc={ic_calendar_gray900_20}
                iconSrc={
                  errors?.startDate ? Icons.ic_calendar_red_20 : Icons.ic_calendar_gray900_20
                }
                value={formatMonthStringToDisplay(startDate) || "YYYY.MM"}
                onClick={() => setOpenStartCal(true)}
                invalid={!!errors.startDate}
                isOpen={openStartCal}
              
              />
              {openStartCal && (
                <div className="calendar-popover">
                  <div className="calendar-popover__panel">
                    <InlineMonthPicker
                      value={parseMonth(startDate || "") || undefined}
                      minYear={1970}
                      onChange={() => {}}
                      onApply={(d) => {
                        const endMV = endDate ? parseMonth(endDate) : null;
                        const needFix =
                          !!endMV &&
                          (endMV.year < d.year ||
                            (endMV.year === d.year && endMV.month < d.month));
                        onChange({
                          startDate: fmtMonth(d),
                          ...(needFix ? { endDate: fmtMonth(d) } : {}),
                        });
                        setOpenStartCal(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="activities-period__divider">~</div>

            <div
              className="activities-period__field activities-period__field--end"
              ref={endRef}
            >
              <DateInline
                id={`activities-end_${index}`}
                iconSrc={
                  errors?.endDate ? Icons.ic_calendar_red_20 : Icons.ic_calendar_gray900_20
                }
                value={formatMonthStringToDisplay(endDate) || "YYYY.MM"}
                onClick={() => setOpenEndCal(true)}
                invalid={!!errors.endDate}
                isOpen={openEndCal}
              />
              {openEndCal && (
                <div className="calendar-popover">
                  <div className="calendar-popover__panel">
                    <InlineMonthPicker
                      value={parseMonth(endDate || "") || undefined}
                      defaultValue={startMV}
                      minYear={startMV?.year ?? 1970}
                      isDisabledMonth={makeDisableEnd(startDate)}
                      onChange={() => {}}
                      onApply={(d) => {
                        onChange({ endDate: fmtMonth(d) });
                        setOpenEndCal(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
          </div>
          
        </div>

        {/* 세부 내용 */}
        <div className="field activities-section__control--summary">
          <div className="small_labe_black-14">세부 내용</div>
          {isEditingSummary ? (
            <div className="activities-section__summary-input">
              <textarea
                value={summary ?? ""}
                onChange={(e) => onChangeSummary(e.target.value)}
                maxLength={MAX_SUMMARY}
              />
              <span className="activities-section__char-count">
                <span>{(summary ?? "").length}</span>
                <span className="max"> / {MAX_SUMMARY}</span>
              </span>
            </div>
          ) : (
            <div
              className="activities-section__summary-input"
              onClick={onStartEditSummary}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onStartEditSummary();
                }
              }}
              role="button"
              tabIndex={0}
            >
              {(summary ?? "").trim().length > 0 ? (
                <div className="activities-section__summary-read">
                  {summary}
                </div>
              ) : (
                <ul className="activities-section__summary-tips">
                  <li className="activities-section__summary-tip">
                    세부 내용을 입력해 주세요.
                  </li>
                </ul>
              )}
              <span className="activities-section__char-count">
                <span>{(summary ?? "").length}</span>
                <span className="max"> / {MAX_SUMMARY}</span>
              </span>
            </div>
          )}
        </div>
        <div className="activities-section__controls">
        <span
          className={[
            "activities-section__control_btn",
            "activities-section__control--up",
            !canMoveUp ? "is-disabled" : "",
            !canMoveUp ? "first" : "",
          ]
            .join(" ")
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
            "activities-section__control_btn",
            "activities-section__control--down",
            !canMoveDown ? "is-disabled" : "",
            !canMoveDown ? "last" : "",
          ]
            .join(" ")
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
            "activities-section__control_btn",
            "activities-section__control--remove",
            !canRemove ? "is-disabled" : "",
          ]
            .join(" ")
            .trim()}
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
    </div>
  );
}
