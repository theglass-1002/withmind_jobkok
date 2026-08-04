import React, { useMemo, useState, useRef, useEffect } from "react";
import "./DesiredRoleSection.css";
import { toast } from "react-toastify";

import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";

import AISuggestArea from "@/pages/Resume/ResumeAISuggest";
import SearchField from "@/shared/components/search/SearchField";
import Modal from "@/shared/components/modal/Modal";
import { Icons } from "@/assets/icons";

import { fetchJobTree } from "@/api/job/job.api";
import { JobNode } from "@/api/job/job.types";

type RoleItem = { group: string; role: string };

const MAX_SELECTED = 30;

interface DesiredRoleSectionProps {
  value: string[];
  onChange: (roles: string[]) => void;
  error?: string;
  isEdit?: boolean;
  aiShow?: boolean;
  aiTags?: string[];
  onClickAISuggest?: () => void;
  onCloseAISuggest?: () => void;
}

type JobTreeLikeResponse = JobNode[] | { code?: number; list?: JobNode[] };

export default function M_DesiredRoleSection({
  value = [],
  onChange,
  error,
  isEdit = false,
  aiShow = false,
  aiTags = [],
  onClickAISuggest,
  onCloseAISuggest,
}: DesiredRoleSectionProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [jobTree, setJobTree] = useState<JobNode[]>([]);
  const [isTreeLoading, setIsTreeLoading] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const hasAnySelected = () => selected.size > 0;

  useEffect(() => {
    let mounted = true;

    const normalizeJobTree = (raw: JobTreeLikeResponse): JobNode[] => {
      if (Array.isArray(raw)) return raw;
      if (raw && Array.isArray(raw.list)) return raw.list;
      return [];
    };

    (async () => {
      try {
        setIsTreeLoading(true);

        const raw = (await fetchJobTree()) as unknown as JobTreeLikeResponse;
        const normalized = normalizeJobTree(raw);

        if (!mounted) return;
        setJobTree(normalized);
      } catch (e) {
        console.error("fetchJobTree error:", e);
        if (mounted) setJobTree([]);
      } finally {
        if (mounted) setIsTreeLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const flat: RoleItem[] = useMemo(() => {
    const out: RoleItem[] = [];
    if (!Array.isArray(jobTree)) return out;

    const topSorted = [...jobTree].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );

    for (const parent of topSorted) {
      if (!parent?.isActive) continue;

      const parentName = parent.name ?? "";
      if (!parentName) continue;

      out.push({ group: parentName, role: `${parentName} 전체` });

      const childrenSorted = Array.isArray(parent.children)
        ? [...parent.children].sort(
            (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
          )
        : [];

      for (const child of childrenSorted) {
        if (!child?.isActive) continue;
        if (!child.name) continue;

        out.push({ group: parentName, role: child.name });
      }
    }

    return out;
  }, [jobTree]);

  const findRoleKey = (roleName: string) => {
    const matched = flat.find((item) => item.role === roleName);

    if (matched) {
      return `${matched.group}|${matched.role}`;
    }

    return `직접 입력|${roleName}`;
  };

  useEffect(() => {
    if (!isEdit) return;

    if (!value || value.length === 0) {
      setSelected(new Set());
      return;
    }

    setSelected(new Set(value.map(findRoleKey)));
  }, [isEdit, value, flat]);

  // role 기준으로만 검색
  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();

    if (!keyword) {
      return flat.slice(0, 20);
    }

    return flat
      .filter((item) => item.role.toLowerCase().includes(keyword))
      .slice(0, 50);
  }, [q, flat]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const highlight = (text: string, keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return text;

    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "ig");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === trimmed.toLowerCase() ? (
        <span className="desired-role__highlight" key={index}>
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const chips = useMemo(() => {
    return Array.from(selected)
      .filter(key => key && typeof key === 'string' && key.includes("|"))
      .map((key) => {
        const [group, role] = key.split("|");
        return { key, group, role };
      });
  }, [selected]);

  const addRole = (item: RoleItem | string) => {
    const roleText = typeof item === "string" ? item.trim() : item.role;
    if (!roleText) return;

    const group = typeof item === "string" ? "직접 입력" : item.group;
    const key = `${group}|${roleText}`;

    setSelected((prev) => {
      if (prev.has(key)) return prev;

      if (prev.size >= MAX_SELECTED) {
        toast.error("최대 30개까지 추가 가능합니다.", {
          toastId: "role-limit",
        });
        return prev;
      }

      const next = new Set(prev);
      next.add(key);
      return next;
    });

    setQ("");
    setOpen(false);
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
      setSelected(new Set(value.map(findRoleKey)));
    }
    setIsEditing(true);
  };

  const handleClosePopup = () => {
    if (!hasAnySelected()) {
      setIsEditing(false);
      setOpen(false);
      setQ("");
      return;
    }

    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (isEdit) {
      setSelected(new Set(value.map(findRoleKey)));
    } else {
      setSelected(new Set());
    }

    setQ("");
    setOpen(false);
    setShowCancelModal(false);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (!hasAnySelected()) {
      setSelected(new Set());
      setQ("");
      setOpen(false);
      return;
    }

    setShowResetModal(true);
  };

  const confirmReset = () => {
    setSelected(new Set());
    setQ("");
    setOpen(false);
    setShowResetModal(false);
  };

  const handleSave = () => {
    if (selected.size === 0) {
      toast.error("1개 이상 추가해 주세요.");
      return;
    }

    const nextRoles = Array.from(selected)
      .filter(key => key && typeof key === 'string')
      .map((key) => key.split("|")[1])
      .filter(Boolean);
    onChange(nextRoles);

    setIsEditing(false);
    setOpen(false);
    setQ("");
  };

  return (
    <div
      id="resume__create-section--desiredRole"
      className="resume-create-page__section resume-create-page__section--desired-role"
    >
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          희망 직무<em className="resume-create-page__required">*</em>
        </div>
        {error && <span className="resume-create-page__error">{error}</span>}
      </div>

      {chips.length > 0 && (
        <div className="resume-create-page__section-body desired-role-section">
          <div className="resume-field__value resume-desired-roles">
            {chips.map((chip) => (
              <span className="location-picker__chip" key={chip.key}>
                <span className="desired-role-chip__label">{chip.role}</span>
              </span>
            ))}
          </div>
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
        <div className="basic-info-form-overlay desired-section">
          <div className="basic-info-form-container">
            <header className="resume-create-form__header">
              <img
                src={ic_close_gray900_24}
                alt=""
                className="resume-create-form__close-icon"
                onClick={handleClosePopup}
                style={{ cursor: "pointer" }}
              />
              <span className="resume-create-form__title">희망 직무</span>
              <span />
            </header>

            <div className="resume-create-form__content desired-role-form">
              <div className="desired-role-form-hint">
                ※ 최대 30개까지 추가 가능합니다.
              </div>

              <div className="desired-role__search-wrapper">
                <SearchField
                  className="resume-search"
                  id="desired-role-search"
                  placeholder="희망 직무 키워드를 입력해 주세요."
                  value={q}
                  onChange={(value) => {
                    setQ(value);
                    if (!open) setOpen(true);
                  }}
                  onSubmit={() => {}}
                  onFocus={() => setOpen(true)}
                  leftIconSrc={Icons.ic_search_gray900_20}
                  clearIconSrc={Icons.ic_cancel_gray400_20}
                  showSubmitButton={false}
                />

                {open && (
                  <div className="desired-role__dropdown" ref={menuRef}>
                    <div className="desired-role__menu" role="listbox">
                      <ul className="desired-role__list">
                        {isTreeLoading && (
                          <li
                            className="desired-role__option"
                            aria-disabled="true"
                          >
                            불러오는 중...
                          </li>
                        )}

                        {!isTreeLoading &&
                          filtered.map((item, idx) => (
                            <li
                              key={`${item.group}-${item.role}-${idx}`}
                              className="desired-role__option"
                              role="option"
                              onClick={() => addRole(item)}
                            >
                              <span className="desired-role__option-role">
                                {highlight(item.role, q)}
                              </span>
                            </li>
                          ))}

                        {!isTreeLoading && q.trim() && filtered.length === 0 && (
                          <li
                            className="desired-role__option"
                            aria-disabled="true"
                          >
                            추천 결과가 없습니다.
                          </li>
                        )}
                      </ul>
                    </div>

                    {q && (
                      <div
                        className="desired-role__menu-footer"
                        onClick={() => addRole(q)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            addRole(q);
                          }
                        }}
                      >
                        <span className="desired-role__highlight">"{q}"</span>
                        <span className="desired-role__create-suffix">
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
                  wrapperClassName="resume-suggest__role"
                  variant="chips"
                  hintText="더 정확한 직무 추천을 위해 (학력과 경력) 항목을 먼저 입력해 주세요."
                  triggerLabel="AI 직무 추천"
                  suggestResultTitle="경력 및 학력 기반의 AI 추천 직무입니다."
                />
              </div>
            </div>

            <div className="resume-create-page__form-action">
              {chips.length > 0 && (
                <div className="resume-create-page__selected desired">
                  {chips.map((chip) => (
                    <span className="location-picker__chip" key={chip.key}>
                      <span className="desired-role-chip__label">
                        {chip.role}
                      </span>
                      <img
                        className="desired-role-chip__remove-btn"
                        onClick={() => removeRole(chip.key)}
                        src={ic_close_gray500_20}
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