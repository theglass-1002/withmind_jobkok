// AwardsCertificationsSection.tsx
import React, { useEffect, useRef, useState } from "react";
import "./AwardsCertificationsSection.css";

import FormInput from "@/shared/components/form/FormInput";
import DateInline from "@/shared/components/form/DateInline";
import InlineMonthPicker from "@/shared/components/calendar/InlineMonthPicker";
import { parseMonth, fmtMonth } from "@/shared/utils/util";
import Modal from "@/shared/components/modal/Modal";

import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_calendar_gray900_20 from "@/assets/icons/size20/ic_calendar_gray900_20.png";
import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_close_gray500_24 from "@/assets/icons/size24/ic_close_gray500_24.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import ic_key_arrow_down_gray500_20 from "@/assets/icons/size20/ic_key_arrow_down_gray500_20.png";
import ic_key_arrow_up_gray500_20 from "@/assets/icons/size20/ic_key_arrow_up_gray500_20.png";
import ic_trash_gray900_20 from "@/assets/icons/size20/ic_trash_gray900_20.png";
import ic_key_arrow_up_gray900_20 from "@/assets/icons/size20/ic_key_arrow_up_gray900_20.png";
import ic_key_arrow_down_gray900_20 from "@/assets/icons/size20/ic_key_arrow_down_gray900_20.png";

// kind 타입: 자격증, 어학시험, 수상, 기타
export type AwardsCertItem = {
  id?: string;
  kind: "Certification" | "LanguageTest" | "Award" | "Etc" | null;
  title: string;
  dateValue?: string; // YYYY.MM
  score?: string;
  issuer?: string;
};

// ✅ 수상·자격증 에러 타입 export
export type AwardsCertErrors = {
  kind?: string;
  title?: string;
};

const makeId = () => Math.random().toString(36).slice(2, 10);

const blankItem = (): AwardsCertItem => ({
  id: makeId(),
  kind: null,
  title: "",
  dateValue: "",
  score: "",
  issuer: "",
});

// ✅ 아이템이 비어있는지 체크 (필수값만)
const isItemEmpty = (item: AwardsCertItem): boolean => {
  return !item.kind && !item.title.trim();
};

// 부모 value → 내부 items 로 옮길 때 id 보정
const normalizeItemsFromValue = (value: AwardsCertItem[]): AwardsCertItem[] => {
  if (!value || value.length === 0) return [];
  return value.map((it) => ({
    ...it,
    id: it.id ?? makeId(),
  }));
};

// 🔥 상위와 연동을 위한 props
interface AwardsCertificationsSectionProps {
  value?: AwardsCertItem[];
  onChange?: (items: AwardsCertItem[]) => void;
  errors?: AwardsCertErrors[];
  onFocusAny?: () => void;
  isEdit?: boolean; // 🔥 작성 / 수정 구분
}

export default function AwardsCertificationsSection({
  value = [],
  onChange,
  errors = [],
  onFocusAny,
  isEdit = false,
}: AwardsCertificationsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);

  // 🔥 내부 items: 처음엔 value 기반으로, id 보정해서 세팅
  const [items, setItems] = useState<AwardsCertItem[]>(() =>
    normalizeItemsFromValue(value)
  );

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [openDateIdx, setOpenDateIdx] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);

  // 드롭다운/달력 바깥 클릭 감지용 refs
  const selectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dateRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 🔥 edit 모드일 때만, 부모 value로 한 번만 초기 세팅
  const didSyncFromValueRef = useRef(false);
  useEffect(() => {
    if (!isEdit) return;
    if (!value || value.length === 0) return;
    if (didSyncFromValueRef.current) return;

    console.log("✅ AwardsCertificationsSection(edit): value 동기화", value);
    const normalized = normalizeItemsFromValue(value);
    setItems(normalized);
    setIsAdding(true); // 수정 모드에서는 처음부터 카드 보이도록
    didSyncFromValueRef.current = true;
  }, [isEdit, value]);

  // items가 바뀔 때마다 상위에 전달
  useEffect(() => {
    onChange?.(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const startAdd = () => {
    setIsAdding(true);
    if (items.length === 0) setItems([blankItem()]);
  };

  // 상단 X: 아이템이 있으면 모달, 없으면 즉시 닫기
  const handleClickClose = () => {
    if (items.length > 0) setShowConfirm(true);
    else stopAdd();
  };

  const stopAdd = () => {
    setIsAdding(false);
    setItems([]);
    setOpenDropdownIndex(null);
    setOpenDateIdx(null);
  };

  const handleConfirmDeleteAll = () => {
    setShowConfirm(false);
    stopAdd();
  };
  const handleCancelDelete = () => setShowConfirm(false);

  // 새 아이템을 "위"에 추가
  const addItem = () => setItems((prev) => [blankItem(), ...prev]);

  // 삭제 버튼 클릭
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
    if (openDateIdx === index) setOpenDateIdx(null);
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      return next;
    });
  };

  const selectKind = (index: number, val: AwardsCertItem["kind"]) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], kind: val };
      return next;
    });
    setOpenDropdownIndex(null);
  };

  const changeTitle = (index: number, v: any) => {
    const value = typeof v === "string" ? v : v?.target ? v.target.value : "";
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], title: value };
      return next;
    });
  };

  const patch = (index: number, patchObj: Partial<AwardsCertItem>) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patchObj };
      return next;
    });
  };

  // 바깥 클릭 시 열려있는 드롭다운/달력 닫기
  useEffect(() => {
    const onDocClick = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (openDropdownIndex !== null) {
        const ref = selectRefs.current[openDropdownIndex];
        if (ref && !ref.contains(t)) setOpenDropdownIndex(null);
      }
      if (openDateIdx !== null) {
        const ref = dateRefs.current[openDateIdx];
        if (ref && !ref.contains(t)) setOpenDateIdx(null);
      }
    };
    document.addEventListener("mousedown", onDocClick, true);
    document.addEventListener("touchstart", onDocClick, true);
    return () => {
      document.removeEventListener("mousedown", onDocClick, true);
      document.removeEventListener("touchstart", onDocClick, true);
    };
  }, [openDropdownIndex, openDateIdx]);

  // 모든 아이템 제거되면 섹션 닫기
  useEffect(() => {
    if (isAdding && items.length === 0) setIsAdding(false);
  }, [items.length, isAdding]);

  // 미래 월 비활성화 (수상/취득일은 미래 X)
  const disableFutureMonth = (y: number, m: number) => {
    const now = new Date();
    return y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth());
  };

  // 포커스 핸들러 (에러 리셋)
  const handleAnyFocus = () => {
    onFocusAny?.();
  };

  return (
    <div className="resume-create-page__section resume-create-page__section--awards-certifications">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              수상ㆍ자격증
            </div>
          </div>
          {isAdding ? (
            <img src={ic_close_gray500_24} alt="닫기" onClick={handleClickClose} />
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
          isAdding ? "awards-certifications-section" : "empty"
        }`}
      >
        {isAdding ? (
          <>
            {items.map((item, index) => {
              const canMoveUp = items.length > 1 && index > 0;
              const canMoveDown = items.length > 1 && index < items.length - 1;

              const itemErrors = errors[index] || {};
              const hasKindError = !!itemErrors.kind;
              const hasTitleError = !!itemErrors.title;

              return (
                <div className="awards-certifications-section__item" key={item.id}>
                  <div className="awards-certifications-section__fields">
                    {/* 구분 + 제목 */}
                    <div className="awards-certifications-section__group">
                      <div className="awards-certifications-section__control">
                        <label className="small_labe_black-14">
                          수상ㆍ자격증명{" "}
                          <em className="error_text_red">*</em>
                        </label>

                        <div
                          className={`ui-select ${hasKindError ? "error" : ""}`}
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
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setOpenDropdownIndex((cur) =>
                                cur === index ? null : index
                              );
                              handleAnyFocus();
                            }
                            if (e.key === "Escape") setOpenDropdownIndex(null);
                          }}
                        >
                          {item.kind ? (
                            item.kind === "Certification"
                              ? "자격증"
                              : item.kind === "LanguageTest"
                              ? "어학시험"
                              : item.kind === "Award"
                              ? "수상"
                              : "기타"
                          ) : (
                            <span className="ui-select-none-default">구분</span>
                          )}
                          <img src={ic_arrow_drop_down_gray900_24} alt="" />

                          {openDropdownIndex === index && (
                            <div
                              className="ui-select__menu"
                              role="listbox"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                className="ui-select__option"
                                role="option"
                                tabIndex={0}
                                onClick={() =>
                                  selectKind(index, "Certification")
                                }
                              >
                                자격증
                              </div>
                              <div
                                className="ui-select__option"
                                role="option"
                                tabIndex={0}
                                onClick={() =>
                                  selectKind(index, "LanguageTest")
                                }
                              >
                                어학시험
                              </div>
                              <div
                                className="ui-select__option"
                                role="option"
                                tabIndex={0}
                                onClick={() =>
                                  selectKind(index, "Award")
                                }
                              >
                                수상
                              </div>
                              <div
                                className="ui-select__option"
                                role="option"
                                tabIndex={0}
                                onClick={() =>
                                  selectKind(index, "Etc")
                                }
                              >
                                기타
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <FormInput
                        placeholder="수상ㆍ자격증명을 입력해 주세요."
                        inputClassName={`awards-certifications_name ${
                          hasTitleError ? "error" : ""
                        }`}
                        invalid={hasTitleError}
                        id={`awards-certifications_name_${item.id}`}
                        value={item.title}
                        onChange={(v: any) => changeTitle(index, v)}
                        onFocus={handleAnyFocus}
                      />
                    </div>

                    {/* 수상ㆍ취득 정보 */}
                    <div className="awards-certifications-period">
                      <label className="awards-certifications-period__label small_labe_black-14">
                        수상ㆍ취득 정보
                      </label>

                      <div className="awards-certifications-period__fields">
                        {/* 날짜 */}
                        <div
                          className="awards-certifications-period__field section-period__start-wrap"
                          ref={(el) => {
                            dateRefs.current[index] = el;
                          }}
                        >
                          <DateInline
                            id={`awards-certifications_${index}`}
                            iconSrc={ic_calendar_gray900_20}
                            value={item.dateValue || "YYYY.MM"}
                            onClick={() => {
                              setOpenDateIdx(index);
                              handleAnyFocus();
                            }}
                            invalid={false}
                            isOpen={openDateIdx === index}
                          />
                          {openDateIdx === index && (
                            <div
                              className="calendar-popover"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="calendar-popover__panel">
                                <InlineMonthPicker
                                  value={
                                    parseMonth(item.dateValue || "") ||
                                    undefined
                                  }
                                  minYear={1970}
                                  isDisabledMonth={disableFutureMonth}
                                  onChange={() => {}}
                                  onApply={(d) => {
                                    patch(index, { dateValue: fmtMonth(d) });
                                    setOpenDateIdx(null);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 성적 */}
                        <FormInput
                          placeholder="성적을 입력해 주세요."
                          inputClassName="awards-certifications__score"
                          id={`awards_score_${item.id}`}
                          value={item.score ?? ""}
                          onChange={(v: any) => {
                            const val =
                              typeof v === "string"
                                ? v
                                : v?.target?.value ?? "";
                            patch(index, { score: val });
                          }}
                          onFocus={handleAnyFocus}
                        />

                        {/* 발행처 */}
                        <FormInput
                          placeholder="발행처ㆍ기관을 입력해 주세요."
                          inputClassName="awards-certifications__issuer"
                          id={`awards_issuer_${item.id}`}
                          value={item.issuer ?? ""}
                          onChange={(v: any) => {
                            const val =
                              typeof v === "string"
                                ? v
                                : v?.target?.value ?? "";
                            patch(index, { issuer: val });
                          }}
                          onFocus={handleAnyFocus}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 아이템 컨트롤 */}
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
                        "awards-certifications-section__control_btn",
                        "awards-certifications-section__control--down",
                        !canMoveDown ? "is-disabled" : "",
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
                      className="awards-certifications-section__control_btn awards-certifications-section__control--remove"
                      onClick={() => handleRemoveClick(index)}
                      aria-label="삭제"
                      role="button"
                      tabIndex={0}
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
        ) : (
          <>수상ㆍ자격증을 추가해 주세요.</>
        )}
      </div>

      {/* 전체 삭제 확인 모달 */}
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

      {/* 개별 삭제 확인 모달 */}
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
