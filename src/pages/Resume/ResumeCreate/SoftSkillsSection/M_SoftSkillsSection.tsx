import React, { useMemo, useState, useRef, useEffect } from "react";
import "./SoftSkillsSection.css";
import { toast } from "react-toastify";
import Tooltip from "@/shared/components/tooltip/Tooltip";

import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";

import SearchField from "@/shared/components/search/SearchField";
import AISuggestArea from "@/pages/Resume/ResumeAISuggest";
import Modal from "@/shared/components/modal/Modal";
import { Icons } from "@/assets/icons";

import { fetchSoftSkillAutoComplete } from "@/api/resume/resume.api";
import type { SkillAutoCompleteItem } from "@/api/resume/resume.types";

const MAX_SELECTED = 30;
const MIN_LENGTH = 1;

interface SoftSkillsSectionProps {
  value: string[];
  onChange: (skills: string[]) => void;
  error?: string;
  isEdit?: boolean;
  aiShow?: boolean;
  aiTags?: string[];
  onClickAISuggest?: () => void;
  onCloseAISuggest?: () => void;
}

export default function M_SoftSkillsSection({
  value = [],
  onChange,
  error,
  isEdit = false,
  aiShow = false,
  aiTags = [],
  onClickAISuggest,
  onCloseAISuggest,
}: SoftSkillsSectionProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [items, setItems] = useState<SkillAutoCompleteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const hasAnySelected = () => selected.size > 0;

  useEffect(() => {
    if (!isEdit) return;

    if (!value || value.length === 0) {
      setSelected(new Set());
      return;
    }

    setSelected(new Set(value.map((skill) => `직접 입력|${skill}`)));
  }, [isEdit, value]);

  useEffect(() => {
    const keyword = q.trim();

    if (!open) return;

    if (keyword.length < MIN_LENGTH) {
      setItems([]);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchSoftSkillAutoComplete(keyword);

        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("soft auto-complete error:", e);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [q, open]);

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const highlight = (text: string, keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return text;

    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "ig");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === trimmed.toLowerCase() ? (
        <span className="soft-skills__highlight" key={index}>
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const chips = useMemo(() => {
    return Array.from(selected).map((key) => {
      const [, role] = key.split("|");
      return { key, role };
    });
  }, [selected]);

  const addRole = (item: SkillAutoCompleteItem | string) => {
    const roleText = typeof item === "string" ? item.trim() : item.name;
    if (!roleText) return;

    const key = `직접 입력|${roleText}`;

    setSelected((prev) => {
      if (prev.has(key)) return prev;

      if (prev.size >= MAX_SELECTED) {
        toast.error("최대 30개까지 추가 가능합니다.", {
          toastId: "soft-skill-limit",
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

  const removeRole = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleOpenPopup = () => {
    if (isEdit) {
      setSelected(new Set(value.map((skill) => `직접 입력|${skill}`)));
    }
    setIsEditing(true);
  };

  const handleClosePopup = () => {
    if (!hasAnySelected()) {
      setIsEditing(false);
      setOpen(false);
      setQ("");
      setItems([]);
      return;
    }

    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (isEdit) {
      setSelected(new Set(value.map((skill) => `직접 입력|${skill}`)));
    } else {
      setSelected(new Set());
    }

    setQ("");
    setOpen(false);
    setItems([]);
    setShowCancelModal(false);
    setIsEditing(false);
  };

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
      id="resume__create-section--softSkills"
      className="resume-create-page__section resume-create-page__section--soft-skills"
    >
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              소프트 스킬
              <Tooltip
                title="소프트 스킬이란?"
                desc="업무를 효과적으로 수행하고 다른 사람들과 협력하는 데 필요한 개인의 역량, 특성, 태도 등을 의미합니다."
                position="top"
              />
            </div>
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="resume-create-page__selected">
          {chips.map((chip) => (
            <div key={chip.key} className="location-picker__chip">
              <div className="location-picker__chip-body">{chip.role}</div>
            </div>
          ))}
        </div>
      )}

      <div className="resume-create-page__section-action">
        <button
          type="button"
          className="btn_w_full default_btn_white"
          onClick={handleOpenPopup}
        >
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
        <div className="basic-info-form-overlay soft-skills-section">
          <div className="basic-info-form-container">
            <header className="resume-create-form__header">
              <img
                src={ic_close_gray900_24}
                alt=""
                className="resume-create-form__close-icon"
                onClick={handleClosePopup}
                style={{ cursor: "pointer" }}
              />
              <span className="resume-create-form__title">소프트 스킬</span>
              <Tooltip
                title="소프트 스킬이란?"
                desc="업무를 효과적으로 수행하고 다른 사람들과 협력하는 데 필요한 개인의 역량, 특성, 태도 등을 의미합니다."
                position="top"
              />
            </header>

            <div className="resume-create-form__content soft-skills-form">
              <div className="soft-skills-form-hint">
                ※ 최대 {MAX_SELECTED}개까지 추가 가능합니다.
              </div>

              <div className="soft-skills__search-wrapper">
                <SearchField
                  className="resume-search"
                  id="soft-skill-search"
                  placeholder="보유 소프트 스킬을 입력해 주세요."
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
                  <div className="soft-skills__dropdown" ref={menuRef}>
                    <div className="soft-skills__menu">
                      <ul className="soft-skills__list">
                        {isLoading && (
                          <li className="soft-skills__option" aria-disabled="true">
                            불러오는 중...
                          </li>
                        )}

                        {!isLoading &&
                          items.map((item) => (
                            <li
                              key={item.id}
                              className="soft-skills__option"
                              onClick={() => addRole(item)}
                            >
                              {highlight(item.name, q)}
                            </li>
                          ))}

                        {!isLoading &&
                          q.trim().length >= MIN_LENGTH &&
                          items.length === 0 && (
                            <li className="soft-skills__option" aria-disabled="true">
                              추천 결과가 없습니다.
                            </li>
                          )}
                      </ul>
                    </div>

                    {q && (
                      <div
                        className="soft-skills__menu-footer"
                        onClick={() => addRole(q)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            addRole(q);
                          }
                        }}
                      >
                        <span className="soft-skills__highlight">“{q}”</span>
                        <span className="soft-skills__create-suffix">
                          (으)로 직접 등록하기
                        </span>
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
                  triggerLabel="AI 소프트 스킬 추천"
                  suggestResultTitle="희망 직무와 경력 기반의 AI 추천 소프트 스킬입니다."
                />
              </div>

              {error && <div className="resume-create-form__error">{error}</div>}
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
                <button
                  type="button"
                  className="btn-reset default_btn_white"
                  onClick={handleReset}
                >
                  <img src={ic_replay_gray900_20} alt="" />
                  초기화
                </button>

                <button
                  type="button"
                  className="btn_w_full default_btn_black"
                  onClick={handleSave}
                >
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