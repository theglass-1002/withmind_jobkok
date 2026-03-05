// ActivitiesSection.tsx
import React, { useEffect, useRef, useState } from "react";
import "./ActivitiesSection.css";

import FormInput from "@/shared/components/form/FormInput";
import DateInline from "@/shared/components/form/DateInline";

import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_calendar_gray900_20 from "@/assets/icons/size20/ic_calendar_gray900_20.png";
import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_close_gray500_24 from "@/assets/icons/size24/ic_close_gray500_24.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";

import ic_key_arrow_down_gray500_20 from "@/assets/icons/size20/ic_key_arrow_down_gray500_20.png";
import ic_key_arrow_up_gray500_20 from "@/assets/icons/size20/ic_key_arrow_up_gray500_20.png";
import ic_trash_gray500_20 from "@/assets/icons/size20/ic_trash_gray500_20.png";
import ic_key_arrow_up_gray900_20 from "@/assets/icons/size20/ic_key_arrow_up_gray900_20.png";
import ic_key_arrow_down_gray900_20 from "@/assets/icons/size20/ic_key_arrow_down_gray900_20.png";
import ic_trash_gray900_20 from "@/assets/icons/size20/ic_trash_gray900_20.png";

import InlineMonthPicker from "@/shared/components/calendar/InlineMonthPicker";
import Modal from "@/shared/components/modal/Modal";
import { parseMonth, fmtMonth } from "@/shared/utils/util";

// 🔥 상위에서 사용할 타입 export
export type Activity = {
  id?: string;
  activityType: string | null;
  activityName: string;
  startDate?: string; // "YYYY-MM"
  endDate?: string;
  summary?: string;
};

// ✅ 활동 에러 타입 export
export type ActivityErrors = {
  activityType?: string;
  activityName?: string;
  startDate?: string;
  endDate?: string;
};

// 내부에서 Activity 그대로 사용
type ActivityItem = Activity;

const makeId = () => Math.random().toString(36).slice(2, 10);

// ✅ 아이템이 비어있는지 체크
const isItemEmpty = (item: ActivityItem): boolean => {
  return (
    !item.activityType &&
    !item.activityName.trim() &&
    !item.startDate &&
    !item.endDate &&
    !item.summary?.trim()
  );
};

// 부모 value → 내부 items 로 옮길 때 id 보정
const normalizeItemsFromValue = (value: Activity[]): ActivityItem[] => {
  if (!value || value.length === 0) return [];
  return value.map((it) => ({
    ...it,
    id: it.id ?? makeId(),
  }));
};

// 부모와 연동을 위한 props
interface ActivitiesSectionProps {
  value?: Activity[];
  onChange?: (activities: Activity[]) => void;
  errors?: ActivityErrors[];
  onFocusAny?: () => void;
  isEdit?: boolean; // 🔥 작성 / 수정 구분
}

export default function ActivitiesSection({
  value = [],
  onChange,
  errors = [],
  onFocusAny,
  isEdit = false,
}: ActivitiesSectionProps) {
  const MAX_SUMMARY = 2000;
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // 🔥 내부 items: 처음엔 value 기반으로, id 보정해서
  const [items, setItems] = useState<ActivityItem[]>(() =>
    normalizeItemsFromValue(value)
  );

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [openStartIdx, setOpenStartIdx] = useState<number | null>(null);
  const [openEndIdx, setOpenEndIdx] = useState<number | null>(null);

  const selectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const startRefs = useRef<(HTMLDivElement | null)[]>([]);
  const endRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 🔥 edit 모드일 때만, 부모 value(activities) 로 한 번만 초기화
  const didSyncFromValueRef = useRef(false);
  useEffect(() => {
    if (!isEdit) return;
    if (!value || value.length === 0) return;
    if (didSyncFromValueRef.current) return;

    console.log("✅ ActivitiesSection(edit): value 동기화", value);
    const normalized = normalizeItemsFromValue(value);
    setItems(normalized);
    setIsAdding(true); // 처음부터 카드가 보이도록
    didSyncFromValueRef.current = true;
  }, [isEdit, value]);

  // items 변경 시 상위로 전달
  useEffect(() => {
    onChange?.(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleClickClose = () => {
    if (items.length > 0) {
      setShowConfirm(true);
    } else {
      stopAdd();
    }
  };

  const handleConfirmDeleteAll = () => {
    setShowConfirm(false);
    stopAdd();
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const stopAdd = () => {
    setIsAdding(false);
    setItems([]);
    setOpenDropdownIndex(null);
    setOpenStartIdx(null);
    setOpenEndIdx(null);
    setEditingIndex(null);
  };

  const startAdd = () => {
    setIsAdding(true);
    if (items.length === 0) {
      setItems([
        {
          id: makeId(),
          activityType: null,
          activityName: "",
          summary: "",
        },
      ]);
    }
  };

  const addItem = () => {
    setItems((prev) => [
      { id: makeId(), activityType: null, activityName: "", summary: "" },
      ...prev,
    ]);
    setEditingIndex((cur) => (cur === null ? null : cur + 1));
  };

  // 삭제 버튼 클릭 핸들러
  const handleRemoveClick = (index: number) => {
    const item = items[index];
    const empty = isItemEmpty(item);

    if (empty) {
      performRemove(index);
    } else {
      setDeleteTargetIndex(index);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmItemDelete = () => {
    if (deleteTargetIndex !== null) {
      performRemove(deleteTargetIndex);
    }
    setShowDeleteModal(false);
    setDeleteTargetIndex(null);
  };

  const handleCancelItemDelete = () => {
    setShowDeleteModal(false);
    setDeleteTargetIndex(null);
  };

  const performRemove = (index: number) => {
    setItems((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });

    setOpenDropdownIndex((cur) => (cur === index ? null : cur));
    if (openStartIdx === index) setOpenStartIdx(null);
    if (openEndIdx === index) setOpenEndIdx(null);

    setEditingIndex((cur) => {
      if (cur === null) return null;
      if (cur === index) return null;
      if (cur > index) return cur - 1;
      return cur;
    });
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setEditingIndex((cur) =>
      cur === index ? index - 1 : cur === index - 1 ? index : cur
    );
  };

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      return next;
    });
    setEditingIndex((cur) =>
      cur === index ? index + 1 : cur === index + 1 ? index : cur
    );
  };

  const selectType = (index: number, val: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], activityType: val };
      return next;
    });
    setOpenDropdownIndex(null);
  };

  const changeName = (index: number, v: any) => {
    const value = typeof v === "string" ? v : v?.target ? v.target.value : "";
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], activityName: value };
      return next;
    });
  };

  const startEditing = (
    index: number,
    e?: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (e && "key" in e) {
      // @ts-ignore
      if (e.nativeEvent?.isComposing) return;
      // @ts-ignore
      if (e.key && e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault?.();
    }
    setEditingIndex(index);
  };

  const onChangeSummary = (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const v = e.target.value.slice(0, MAX_SUMMARY);
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], summary: v };
      return next;
    });
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;

      if (openDropdownIndex !== null) {
        const ref = selectRefs.current[openDropdownIndex];
        if (ref && !ref.contains(t)) setOpenDropdownIndex(null);
      }
      if (openStartIdx !== null) {
        const ref = startRefs.current[openStartIdx];
        if (ref && !ref.contains(t)) setOpenStartIdx(null);
      }
      if (openEndIdx !== null) {
        const ref = endRefs.current[openEndIdx];
        if (ref && !ref.contains(t)) setOpenEndIdx(null);
      }
    };

    document.addEventListener("mousedown", onDocClick, true);
    document.addEventListener("touchstart", onDocClick, true);
    return () => {
      document.removeEventListener("mousedown", onDocClick, true);
      document.removeEventListener("touchstart", onDocClick, true);
    };
  }, [openDropdownIndex, openStartIdx, openEndIdx]);

  useEffect(() => {
    if (isAdding && items.length === 0) setIsAdding(false);
  }, [items.length, isAdding]);

  const makeDisableEnd = (start?: string) => {
    const startMV = parseMonth(start || "") ?? null;
    return (y: number, m: number) => {
      const now = new Date();
      const afterToday =
        y > now.getFullYear() ||
        (y === now.getFullYear() && m > now.getMonth());
      const beforeStart =
        !!startMV &&
        (y < startMV.year || (y === startMV.year && m < startMV.month));
      return beforeStart || afterToday;
    };
  };

  // 포커스 핸들러 (에러 리셋)
  const handleAnyFocus = () => {
    onFocusAny?.();
  };

  return (
    <div className="resume-create-page__section resume-create-page__section--activities">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              활동ㆍ경험
            </div>
          </div>
          {isAdding ? (
            <img
              src={ic_close_gray500_24}
              alt="닫기"
              onClick={handleClickClose}
            />
          ) : (
            <span
              className="resume-section-title__action--import"
              onClick={startAdd}
            >
              <img src={ic_add_purple_20} alt="" />
              추가
            </span>
          )}
        </div>
      </div>

      <div
        className={`resume-create-page__section-body ${
          isAdding ? "activities-section" : "empty"
        }`}
      >
        {isAdding ? (
          <>
            {items.map((item, index) => {
              const startMV = parseMonth(item.startDate || "") ?? undefined;

              const canMoveUp = items.length > 1 && index > 0;
              const canMoveDown = items.length > 1 && index < items.length - 1;

              const itemErrors = errors[index] || {};
              const hasTypeError = !!itemErrors.activityType;
              const hasNameError = !!itemErrors.activityName;
              const hasStartDateError = !!itemErrors.startDate;
              const hasEndDateError = !!itemErrors.endDate;

              return (
                <div className="activities-section__item" key={item.id}>
                  <div className="activities-section__fields">
                    <div className="activities-section__group">
                      <div className="activities-section__control">
                        <label className="small_labe_black-14">
                          활동ㆍ경험명{" "}
                          <em className="error_text_red">*</em>
                        </label>

                        <div
                          className={`ui-select ${
                            hasTypeError ? "error" : ""
                          }`}
                          ref={(el) => {
                            selectRefs.current[index] = el;
                          }}
                          role="combobox"
                          aria-expanded={openDropdownIndex === index}
                          tabIndex={0}
                          onClick={() => {
                            setOpenDropdownIndex((cur) =>
                              cur === index ? null : index
                            );
                            handleAnyFocus();
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" ||
                              e.key === " "
                            ) {
                              e.preventDefault();
                              setOpenDropdownIndex((cur) =>
                                cur === index ? null : index
                              );
                              handleAnyFocus();
                            }
                            if (e.key === "Escape")
                              setOpenDropdownIndex(null);
                          }}
                        >
                          {item.activityType ?? (
                            <span className="ui-select-none-default">
                              구분
                            </span>
                          )}
                          <img
                            src={ic_arrow_drop_down_gray900_24}
                            alt=""
                          />

                          {openDropdownIndex === index && (
                            <div
                              className="ui-select__menu"
                              role="listbox"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {["교내활동", "인턴", "자원봉사", "동아리", "사회활동", "수행과제", "해외연수", "교육"].map(
                                (opt) => (
                                  <div
                                    key={opt}
                                    className="ui-select__option"
                                    role="option"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      selectType(index, opt);
                                    }}
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" ||
                                        e.key === " "
                                      ) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        selectType(index, opt);
                                      }
                                    }}
                                    tabIndex={0}
                                  >
                                    {opt}
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <FormInput
                        placeholder="활동ㆍ경험명을 입력해 주세요."
                        inputClassName={`activity_name`}
                        id={`activity_name_${item.id}`}
                        value={item.activityName}
                        invalid={hasNameError}
                        onChange={(v: any) => changeName(index, v)}
                        onFocus={handleAnyFocus}
                      />
                    </div>

                    <div className="activities-period">
                      <label className="activities-period__label small_labe_black-14">
                        활동ㆍ경험 기간{" "}
                        <em className="error_text_red">*</em>
                      </label>

                      <div className="activities-period__fields">
                        <div
                          className="activities-period__field activities-period__field--start"
                          ref={(el) => {
                            startRefs.current[index] = el;
                          }}
                        >
                          <DateInline
                            id={`activities-start_${index}`}
                            iconSrc={ic_calendar_gray900_20}
                            value={item.startDate || "YYYY.MM"}
                            onClick={() => {
                              setOpenStartIdx(index);
                              handleAnyFocus();
                            }}
                            invalid={hasStartDateError}
                            isOpen={openStartIdx === index}
                          />
                          {openStartIdx === index && (
                            <div className="calendar-popover">
                              <div className="calendar-popover__panel">
                                <InlineMonthPicker
                                  value={
                                    parseMonth(item.startDate || "") ||
                                    undefined
                                  }
                                  minYear={1970}
                                  onChange={() => {}}
                                  onApply={(d) => {
                                    setItems((prev) => {
                                      const next = [...prev];
                                      const endMV = next[index].endDate
                                        ? parseMonth(next[index].endDate!)
                                        : null;
                                      const needFix =
                                        !!endMV &&
                                        (endMV.year < d.year ||
                                          (endMV.year === d.year &&
                                            endMV.month < d.month));
                                      next[index] = {
                                        ...next[index],
                                        startDate: fmtMonth(d),
                                        ...(needFix
                                          ? { endDate: fmtMonth(d) }
                                          : {}),
                                      };
                                      return next;
                                    });
                                    setOpenStartIdx(null);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="activities-period__divider">~</div>

                        <div
                          className="activities-period__field activities-period__field--end"
                          ref={(el) => {
                            endRefs.current[index] = el;
                          }}
                        >
                          <DateInline
                            id={`activities-end_${index}`}
                            iconSrc={ic_calendar_gray900_20}
                            value={item.endDate || "YYYY.MM"}
                            onClick={() => {
                              setOpenEndIdx(index);
                              handleAnyFocus();
                            }}
                            invalid={hasEndDateError}
                            isOpen={openEndIdx === index}
                          />
                          {openEndIdx === index && (
                            <div className="calendar-popover">
                              <div className="calendar-popover__panel">
                                <InlineMonthPicker
                                  value={
                                    parseMonth(item.endDate || "") ||
                                    undefined
                                  }
                                  defaultValue={startMV}
                                  minYear={startMV?.year ?? 1970}
                                  isDisabledMonth={makeDisableEnd(
                                    item.startDate
                                  )}
                                  onChange={() => {}}
                                  onApply={(d) => {
                                    setItems((prev) => {
                                      const next = [...prev];
                                      next[index] = {
                                        ...next[index],
                                        endDate: fmtMonth(d),
                                      };
                                      return next;
                                    });
                                    setOpenEndIdx(null);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="field activities-section__control--summary">
                      <div className="small_labe_black-14">
                        세부 내용
                      </div>
                      {editingIndex === index ? (
                        <div className="activities-section__summary-input">
                          <textarea
                            value={item.summary ?? ""}
                            onChange={(e) =>
                              onChangeSummary(index, e)
                            }
                            maxLength={MAX_SUMMARY}
                            onFocus={handleAnyFocus}
                          />
                          <span className="activities-section__char-count">
                            <span>{(item.summary ?? "").length}</span>
                            <span className="max">
                              {" "}
                              / {MAX_SUMMARY}
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div
                          className="activities-section__summary-input"
                          onClick={(e) => startEditing(index, e)}
                          onKeyDown={(e) => startEditing(index, e)}
                          role="button"
                          tabIndex={0}
                        >
                          {(item.summary ?? "").trim().length > 0 ? (
                            <div className="activities-section__summary-read">
                              {item.summary}
                            </div>
                          ) : (
                            <ul className="activities-section__summary-tips">
                              <li className="activities-section__summary-tip">
                                세부 내용을 입력해 주세요.
                              </li>
                            </ul>
                          )}
                          <span className="activities-section__char-count">
                            <span>{(item.summary ?? "").length}</span>
                            <span className="max">
                              {" "}
                              / {MAX_SUMMARY}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
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
                      onClick={() => canMoveUp && moveUp(index)}
                      aria-disabled={!canMoveUp}
                    >
                      <img
                        src={
                          canMoveUp
                            ? ic_key_arrow_up_gray900_20
                            : ic_key_arrow_up_gray500_20
                        }
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
                      onClick={() => canMoveDown && moveDown(index)}
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
                      ]
                        .join(" ")
                        .trim()}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleRemoveClick(index)}
                      aria-disabled={false}
                    >
                      <img src={ic_trash_gray900_20} alt="" />
                    </span>
                  </div>
                </div>
              );
            })}

            <span
              className="default_btn_white"
              onClick={addItem}
              role="button"
              tabIndex={0}
            >
              <img src={ic_add_btn_gray900_20} alt="" />
              추가
            </span>
          </>
        ) : items.length === 0 ? (
          <>활동ㆍ경험을 추가해 주세요.</>
        ) : null}
      </div>

      {/* 전체 삭제 모달 (닫기 버튼 클릭 시) */}
      <Modal
        open={showConfirm}
        title="입력된 내용을 전부 삭제하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="계속 작성"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleConfirmDeleteAll}
        onClose={handleCancelDelete}
      />

      {/* 개별 아이템 삭제 모달 */}
      <Modal
        open={showDeleteModal}
        title="입력된 내용을 전부 삭제하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="계속 작성"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleConfirmItemDelete}
        onClose={handleCancelItemDelete}
      />
    </div>
  );
}
