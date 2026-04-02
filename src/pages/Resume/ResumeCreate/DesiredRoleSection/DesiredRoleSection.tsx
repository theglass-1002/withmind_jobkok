import React, { useMemo, useState, useRef, useEffect } from "react";
import "./DesiredRoleSection.css";
import { toast } from "react-toastify";

import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import AISuggestArea from "@/pages/Resume/ResumeAISuggest";
import SearchField from "@/shared/components/search/SearchField";
import { fetchJobTree } from "@/api/job/job.api";
import { JobNode } from "@/api/job/job.types";
import { Icons } from "@/assets/icons";

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

export default function DesiredRoleSection({
  value,
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

  const [jobTree, setJobTree] = useState<JobNode[]>([]);
  const [isTreeLoading, setIsTreeLoading] = useState(false);

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set((value ?? []).map((r) => `직접 입력|${r}`))
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const didSyncFromValueRef = useRef(false);

  useEffect(() => {
    if (!isEdit) return;
    if (!value || value.length === 0) return;
    if (didSyncFromValueRef.current) return;

    setSelected(new Set(value.map((r) => `직접 입력|${r}`)));
    didSyncFromValueRef.current = true;
  }, [isEdit, value]);

  useEffect(() => {
    const rolesArr = Array.from(selected).map((key) => key.split("|")[1]);
    onChange(rolesArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

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

  // role 기준으로만 검색
  const filtered = useMemo(() => {
    const keyword = (q ?? "").trim().toLowerCase();

    if (!keyword) {
      return flat.slice(0, 20);
    }

    return flat
      .filter((item) => item.role.toLowerCase().includes(keyword))
      .slice(0, 50);
  }, [q, flat]);

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
    const k = keyword.trim();
    if (!k) return text;

    const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(${escaped})`, "ig");

    return text.split(re).map((part, i) =>
      part.toLowerCase() === k.toLowerCase() ? (
        <span className="desired-role__highlight" key={i}>
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const chips = useMemo(() => {
    return Array.from(selected).map((key) => {
      const [group, role] = key.split("|");
      return { key, group, role };
    });
  }, [selected]);

  const removeRole = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const addRole = (item: RoleItem | string) => {
    const roleText = typeof item === "string" ? item.trim() : item.role;
    if (!roleText) return;

    const group = typeof item === "string" ? "직접 입력" : item.group;
    const key = `${group}|${roleText}`;

    setSelected((prev) => {
      if (prev.has(key)) return prev;

      if (prev.size >= MAX_SELECTED) {
        toast.success("최대 30개까지 선택가능합니다.", {
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

  return (
    <div className="resume-create-page__section resume-create-page__section--desired-role">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          희망 직무 <em className="resume-create-page__required">*</em>
        </div>

        <div className="resume-create-page__section-title__right">
          <span className="resume-create-page__hint">
            최대 {MAX_SELECTED}개까지 추가 가능합니다.
          </span>
        </div>

        {error && <span className="resume-create-page__error">{error}</span>}
      </div>

      {chips.length > 0 && (
        <div className="resume-create-page__selected">
          {chips.map((chip) => (
            <div key={chip.key} className="location-picker__chip">
              <div className="location-picker__chip-body">{chip.role}</div>
              <span
                className="location-picker__chip-close"
                onClick={() => removeRole(chip.key)}
              >
                <img src={ic_close_gray500_20} alt="" />
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="resume-create-page__section-body">
        <SearchField
          className="resume-search"
          id="desired-role-search"
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
                  <li className="desired-role__option" aria-disabled="true">
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
                  <li className="desired-role__option" aria-disabled="true">
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
          wrapperClassName="resume-suggest__role"
          variant="chips"
          hintText="더 정확한 직무 추천을 위해 (학력과 경력) 항목을 먼저 입력해 주세요."
          triggerLabel="AI 직무 추천"
          suggestResultTitle="경력 및 학력 기반의 AI 추천 직무입니다."
        />
      </div>
    </div>
  );
}