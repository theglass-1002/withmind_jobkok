// src/pages/.../AwardsCertificationsSection/Form/M_AwardsCertificationsItemForm.tsx
import React, { useEffect, useRef, useState } from "react";
import "../AwardsCertificationsSection.css";

import FormInput from "@/shared/components/form/FormInput";
import DateInline from "@/shared/components/form/DateInline";
import InlineMonthPicker from "@/shared/components/calendar/InlineMonthPicker";
import { parseMonth, fmtMonth, formatMonthStringToDisplay } from "@/shared/utils/util";
import SelectDropdown from "@/shared/components/select-dropdown/SelectDropdown";
import ic_error_red100_20 from "@/assets/icons/size20/ic_error_red100_20.png";
import ic_calendar_gray900_20 from "@/assets/icons/size20/ic_calendar_gray900_20.png";
import ic_key_arrow_down_gray500_20 from "@/assets/icons/size20/ic_key_arrow_down_gray500_20.png";
import ic_key_arrow_up_gray500_20 from "@/assets/icons/size20/ic_key_arrow_up_gray500_20.png";
import ic_trash_gray900_20 from "@/assets/icons/size20/ic_trash_gray900_20.png";
import ic_key_arrow_up_gray900_20 from "@/assets/icons/size20/ic_key_arrow_up_gray900_20.png";
import ic_key_arrow_down_gray900_20 from "@/assets/icons/size20/ic_key_arrow_down_gray900_20.png";

import type { AwardsCertItem } from "../M_AwardsCertificationsSection";

type AwardsErrors = Partial<Record<keyof AwardsCertItem, string>>;

interface Props {
  index: number;
  total: number;
  value: AwardsCertItem;
  errors?: AwardsErrors;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onChange: (patch: Partial<AwardsCertItem>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export default function M_AwardsCertificationsItemForm({
  index,
  total,
  value,
  errors = {},
  canMoveUp,
  canMoveDown,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: Props) {
  const { kind, title, dateValue, score, issuer } = value;
  const [openDate, setOpenDate] = useState(false);
  const dateRef = useRef<HTMLDivElement | null>(null);

  const disableFutureMonth = (y: number, m: number) => {
    const now = new Date();
    return y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth());
  };

  useEffect(() => {
    if (!openDate) return;

    const onDocClick = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (dateRef.current && !dateRef.current.contains(t)) {
        setOpenDate(false);
      }
    };

    document.addEventListener("mousedown", onDocClick, true);
    document.addEventListener("touchstart", onDocClick, true);

    return () => {
      document.removeEventListener("mousedown", onDocClick, true);
      document.removeEventListener("touchstart", onDocClick, true);
    };
  }, [openDate]);

  return (
    <div className="awards-certifications-section__item">
      <div className="awards-certifications-section__fields">
        <div className="awards-certifications-section__group">
          <div className="awards-certifications-section__control">
            <SelectDropdown
              label="수상ㆍ자격증명"
              required
              placeholder="구분"
              options={[
                { value: "Certification", label: "자격증" },
                { value: "LanguageTest", label: "어학시험" },
                { value: "Award", label: "수상" },
                { value: "Etc", label: "기타" },
              ]}
              value={kind ?? ""}
              onChange={(val) =>
                onChange({
                  kind:
                    val === "Certification"
                      ? "Certification"
                      : val === "LanguageTest"
                      ? "LanguageTest"
                      : val === "Award"
                      ? "Award"
                      : "Etc",
                })
              }
              errorIconSrc={errors.kind ? ic_error_red100_20 : undefined}
              className="awards-certifications-section__select"
            />
          </div>

          <FormInput
            placeholder="수상ㆍ자격증명을 입력해 주세요."
            inputClassName="awards-certifications_name"
            id={`awards-certifications_name_${value.id}`}
            value={title}
            onChange={(v: any) => {
              const val = typeof v === "string" ? v : v?.target?.value ?? "";
              onChange({ title: val });
            }}
            invalid={!!errors.title}
            rightIconSrc={errors.title ? ic_error_red100_20 : undefined}
          />
        </div>

        <div className="awards-certifications-period">
          <label className="awards-certifications-period__label small_labe_black-14">
            수상ㆍ취득 정보
          </label>

          <div className="awards-certifications-period__fields">
            <div
              className="awards-certifications-period__field section-period__start-wrap"
              ref={dateRef}
            >
              <DateInline
                id={`awards-certifications_${index}`}
                iconSrc={ic_calendar_gray900_20}
                value={formatMonthStringToDisplay(dateValue) || "YYYY.MM"}
                onClick={() => setOpenDate(true)}
                invalid={false}
                isOpen={openDate}
              />
              {openDate && (
                <div
                  className="calendar-popover"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="calendar-popover__panel">
                    <InlineMonthPicker
                      value={parseMonth(dateValue || "") || undefined}
                      minYear={1970}
                      isDisabledMonth={disableFutureMonth}
                      onChange={() => {}}
                      onApply={(d) => {
                        onChange({ dateValue: fmtMonth(d) });
                        setOpenDate(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <FormInput
              placeholder="성적을 입력해 주세요."
              inputClassName="awards-certifications__score"
              id={`awards_score_${value.id}`}
              value={score ?? ""}
              onChange={(v: any) => {
                const val = typeof v === "string" ? v : v?.target?.value ?? "";
                onChange({ score: val });
              }}
            />

            <FormInput
              placeholder="발행처ㆍ기관을 입력해 주세요."
              inputClassName="awards-certifications__issuer"
              id={`awards_issuer_${value.id}`}
              value={issuer ?? ""}
              onChange={(v: any) => {
                const val = typeof v === "string" ? v : v?.target?.value ?? "";
                onChange({ issuer: val });
              }}
            />
          </div>
        </div>

        <div className="awards-certifications-section__controls">
          <span
            className={[
              "awards-certifications-section__control_btn",
              "awards-certifications-section__control--up",
              !canMoveUp ? "is-disabled" : "",
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
              "awards-certifications-section__control_btn",
              "awards-certifications-section__control--down",
              !canMoveDown ? "is-disabled" : "",
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
            className="awards-certifications-section__control_btn awards-certifications-section__control--remove"
            onClick={onRemove}
            aria-label="삭제"
            role="button"
            tabIndex={0}
          >
            <img src={ic_trash_gray900_20} alt="" />
          </span>
        </div>
      </div>
    </div>
  );
}