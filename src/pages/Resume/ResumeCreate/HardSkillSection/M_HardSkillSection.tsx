// src/pages/.../HardSkillSection/M_HardSkillSection.tsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import "./HardSkillSection.css";
import { toast } from "react-toastify";
import Tooltip from "@/shared/components/tooltip/Tooltip";

import ic_search_gray900_20 from "@/assets/icons/size20/ic_search_gray900_20.png";
import ic_clear_btn_gray400_20 from "@/assets/icons/size20/ic_clear_btn_gray400_20.png";
import ic_close_gray500_24 from "@/assets/icons/size24/ic_close_gray500_24.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";

import SearchField from "@/shared/components/search/SearchField";
import AISuggestArea from "@/pages/Resume/ResumeAISuggest";
import Modal from "@/shared/components/modal/Modal";
import { Icons } from "@/assets/icons";

import { fetchHardSkillAutoComplete } from "@/api/resume/resume.api";
import type { SkillAutoCompleteItem } from "@/api/resume/resume.types";

const MAX_SELECTED = 30;
const MIN_LENGTH = 1;

interface HardSkillSectionProps {
  value: string[];
  onChange: (skills: string[]) => void;
  error?: string;
  isEdit?: boolean;
  aiShow?: boolean;
  aiTags?: string[];
  onClickAISuggest?: () => void;
  onCloseAISuggest?: () => void;
}

export default function M_HardSkillSection({
  value,
  onChange,
  error,
  isEdit = false,
  aiShow = false,
  aiTags = [],
  onClickAISuggest,
  onCloseAISuggest,
}: HardSkillSectionProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [items, setItems] = useState<SkillAutoCompleteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasAnySelected = () => selected.size > 0;

  // ✅ edit / 초기값 동기화 (1회)
  const didSyncFromValueRef = useRef(false);
  useEffect(() => {
    // edit일 때만 1회 동기화하고 싶으면 아래 두 줄을 살려도 됨
    // if (!isEdit) return;

    if (!value) return;
    if (didSyncFromValueRef.current) return;

    if (value.length > 0) {
      setSelected(new Set(value.map((v) => `직접 입력|${v}`)));
    } else {
      setSelected(new Set());
    }

    didSyncFromValueRef.current = true;
  }, [value, isEdit]);

  // ❌ 여기서 onChange 호출하면 무한 루프 생김 → 제거
  // useEffect(() => {
  //   const skills = Array.from(selected).map((key) => key.split("|")[1]);
  //   onChange?.(skills);
  // }, [selected, onChange]);

  // ✅ 자동완성 호출 (PC와 동일)
  useEffect(() => {
    const keyword = (q ?? "").trim();
    if (!open) return;

    if (keyword.length < MIN_LENGTH) {
      setItems([]);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchHardSkillAutoComplete(keyword);
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("❌ hard auto-complete error:", e);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [q, open]);

  // 외부 클릭 닫기
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const highlight = (text: string, keyword: string) => {
    const k = keyword.trim();
    if (!k) return text;
    const re = new RegExp(
      `(${k.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")})`,
      "ig"
    );
    return text.split(re).map((part, i) =>
      part.toLowerCase() === k.toLowerCase() ? (
        <span className="hard-skills__highlight" key={i}>
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const chips = useMemo(() => {
    return Array.from(selected).map((key) => {
      const [, role] = key.split("|");
      return { key, role };
    });
  }, [selected]);

  const removeRole = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const addRole = (item: SkillAutoCompleteItem | string) => {
    const roleText = typeof item === "string" ? item.trim() : item.name;
    if (!roleText) return;

    const key = `직접 입력|${roleText}`;

    setSelected((prev) => {
      if (prev.has(key)) return prev;

      if (prev.size >= MAX_SELECTED) {
        toast.error("최대 30개까지 추가 가능합니다.", {
          toastId: "hard-skill-limit",
        });
        return prev;
      }

      const next = new Set(prev);
      next.add(key);
      return next;
    });

    setQ("");
    setOpen(false);
    setItems([]);
  };

  const handleOpenPopup = () => setIsEditing(true);

  // X 버튼 클릭
  const handleClosePopup = () => {
    if (!hasAnySelected()) {
      setIsEditing(false);
      setOpen(false);
      setQ("");
      setItems([]);
    } else {
      setShowCancelModal(true);
    }
  };

  // 취소 모달에서 "예"
  const confirmCancel = () => {
    setSelected(new Set());
    setQ("");
    setOpen(false);
    setItems([]);
    setShowCancelModal(false);
    setIsEditing(false);
  };

  // 초기화 버튼 클릭
  const handleReset = () => {
    if (!hasAnySelected()) {
      setSelected(new Set());
      setQ("");
      setOpen(false);
      setItems([]);
      return;
    }
    setShowResetModal(true);
  };

  // 초기화 모달에서 "예"
  const confirmReset = () => {
    setSelected(new Set());
    setQ("");
    setOpen(false);
    setItems([]);
    setShowResetModal(false);
  };


  const handleSave = () => {

    const skills = Array.from(selected).map((key) => key.split("|")[1]);
    onChange(skills);

    setIsEditing(false);
    setOpen(false);
    setQ("");
    setItems([]);
  };

  return (
    <div
      id="resume__create-section--hardSkills"
      className="resume-create-page__section resume-create-page__section--hard-skills"
    >
    <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              하드 스킬
              <Tooltip
                title="하드 스킬이란?"
                desc="직무 수행에 필요한 전문 기술이나 지식을 의미합니다."
                position="top"
              />

            </div>
          </div>
        </div>
      </div>
      {chips.length > 0 && (
        <div className="resume-create-page__selected ">
          {chips.map((chip) => (
            <div key={chip.key} className="location-picker__chip">
              <div className="location-picker__chip-body">{chip.role}</div>
            </div>
          ))}
        </div>
      )}

      <div className="resume-create-page__section-action">
        <button className="btn_w_full default_btn_white" onClick={handleOpenPopup}>
          {chips.length > 0 ? (
            <>
              <img src={ic_edit_gray900_20} alt="" />
              수정
            </>
          ) : (
            <>
              <img src={ic_add_btn_gray900_20} alt="" />
              추가
            </>
          )}
        </button>
      </div>

      {isEditing && (
        <div className="basic-info-form-overlay hard-skills-section">
          <div className="basic-info-form-container">
            <header className="resume-create-form__header">
              <img
                src={ic_close_gray900_24}
                alt=""
                className="resume-create-form__close-icon"
                onClick={handleClosePopup}
                style={{ cursor: "pointer" }}
              />
              <span className="resume-create-form__title">하드 스킬</span>
              <Tooltip
                title="하드 스킬이란?"
                desc="직무 수행에 필요한 전문 기술이나 지식을 의미합니다."
                position="top"
              />
            </header>

            <div className="resume-create-form__content hard-skills-form">
              <div className="hard-skills-form-hint">※ 최대 {MAX_SELECTED}개까지 추가 가능합니다.</div>

              <div className="hard-skills__search-wrapper">
                <SearchField
                  className="resume-search"
                  id="hard-skill-search"
                  value={q}
                  onChange={(v) => {
                    setQ(v);
                    setOpen(true);
                  }}
                  onSubmit={() => {}}
                  onFocus={() => setOpen(true)}
                  leftIconSrc={Icons.ic_search_gray900_20}
                  clearIconSrc={Icons.ic_cancel_gray400_20}
                  showSubmitButton={false}
                />

                {open && (
                  <div className="hard-skills__dropdown" ref={menuRef}>
                    <div className="hard-skills__menu">
                      <ul className="hard-skills__list">
                        {isLoading && (
                          <li className="hard-skills__option" aria-disabled="true">
                            불러오는 중...
                          </li>
                        )}

                        {!isLoading &&
                          items.map((item) => (
                            <li
                              key={item.id}
                              className="hard-skills__option"
                              onClick={() => addRole(item)}
                            >
                              {highlight(item.name, q)}
                            </li>
                          ))}

                        {!isLoading &&
                          q.trim().length >= MIN_LENGTH &&
                          items.length === 0 && (
                            <li className="hard-skills__option" aria-disabled="true">
                              추천 결과가 없습니다.
                            </li>
                          )}
                      </ul>
                    </div>

                    {q && (
                      <div className="hard-skills__menu-footer" onClick={() => addRole(q)}>
                        <span className="hard-skills__highlight">“{q}”</span>
                        <span className="hard-skills__create-suffix">(으)로 직접 등록하기</span>
                      </div>
                    )}
                  </div>
                )}

                <AISuggestArea
                  show={aiShow}
                  items={aiTags}
                  onClickSuggest={onClickAISuggest}
                  onClose={onCloseAISuggest}
                  onPick={(tag) => addRole(tag)}
                  starIconGreen={Icons.ic_star_gray700_20}
                  wrapperClassName="resume-suggest__hardskill"
                  variant="chips"
                  hintText="더 정확한 AI 추천을 위해 (희망 직무와 경력) 항목을 먼저 입력해 주세요."
                  triggerLabel="AI 하드 스킬 추천"
                  suggestResultTitle="희망 직무와 경력 기반의 AI 추천 하드 스킬입니다."
                />
              </div>
            </div>

            <div className="resume-create-page__form-action">
              {chips.length > 0 && (
                <div className="resume-create-page__selected skill">
                  {chips.map((chip) => (
                    <span className="location-picker__chip" key={chip.key}>
                      <span className="desired-role-chip__label">{chip.role}</span>
                      <img
                        className="desired-role-chip__remove-btn"
                        onClick={() => removeRole(chip.key)}
                        src={Icons.ic_close_gray500_20}
                        alt="삭제"
                      />
                    </span>
                  ))}
                </div>
              )}

              <div className="btn_wrap">
                <button className="btn-reset default_btn_white" onClick={handleReset} type="button">
                  <img src={ic_replay_gray900_20} alt="" /> 초기화
                </button>
                <button className="btn_w_full default_btn_black" onClick={handleSave} type="button">
                  저장
                </button>
              </div>
            </div>
          </div>

          <Modal
            open={showResetModal}
            title="입력된 내용을 전부 삭제하시겠습니까?"
            confirmText="예"
            confirmClassName="btn_w_full default_btn_black"
            cancelText="아니오"
            cancelClassName="btn_w_full default_btn_white"
            onConfirm={confirmReset}
            onClose={() => setShowResetModal(false)}
          />

          <Modal
            open={showCancelModal}
            title="수정사항을 저장하지 않고 취소하시겠습니까?"
            confirmText="예"
            confirmClassName="btn_w_full default_btn_black"
            cancelText="계속 작성"
            cancelClassName="btn_w_full default_btn_white"
            onConfirm={confirmCancel}
            onClose={() => setShowCancelModal(false)}
          />
        </div>
      )}
    </div>
  );
}