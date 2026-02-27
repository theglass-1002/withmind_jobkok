import React, { useMemo, useState, useRef, useEffect } from "react";
import "./DesiredRoleSection.css";
import { toast } from "react-toastify";

import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import ic_search_gray900_20 from "@/assets/icons/size20/ic_search_gray900_20.png";
import ic_clear_btn_gray400_20 from "@/assets/icons/size20/ic_clear_btn_gray400_20.png";

import AISuggestArea from "@/pages/Resume/ResumeAISuggest";
import SearchField from "@/shared/components/search/SearchField";
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

  // ✅ 서버에서 가져온 직군/직무 트리
  const [jobTree, setJobTree] = useState<JobNode[]>([]);
  const [isTreeLoading, setIsTreeLoading] = useState(false);

  // 내부 선택 상태: "그룹|직무명"
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set((value ?? []).map((r) => `직접 입력|${r}`))
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const didSyncFromValueRef = useRef(false);

  // ✅ edit 모드에서 value 한번만 동기화
  useEffect(() => {
    if (!isEdit) return;
    if (!value || value.length === 0) return;
    if (didSyncFromValueRef.current) return;

    console.log("✅ DesiredRoleSection(edit): value 동기화", value);
    setSelected(new Set(value.map((r) => `직접 입력|${r}`)));
    didSyncFromValueRef.current = true;
  }, [isEdit, value]);

  // ✅ selected 바뀌면 부모로 반영
  useEffect(() => {
    const rolesArr = Array.from(selected).map((key) => key.split("|")[1]);
    onChange(rolesArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // ✅ 직무 트리 로드 (최초 1회)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsTreeLoading(true);
        const data = await fetchJobTree();
        if (!mounted) return;
        setJobTree(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("❌ fetchJobTree error:", e);
        setJobTree([]);
      } finally {
        if (mounted) setIsTreeLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ 트리를 roles.json flat 구조로 변환
  // - depth 0: "개발" -> "개발 전체"를 all처럼 생성
  // - depth 1 children: "소프트웨어 엔지니어" 등 roles로 생성
  const flat: RoleItem[] = useMemo(() => {
    const out: RoleItem[] = [];
    if (!Array.isArray(jobTree)) return out;

    const topSorted = [...jobTree].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    for (const parent of topSorted) {
      if (!parent?.isActive) continue;

      const parentName = parent.name ?? "";
      if (!parentName) continue;

      // ✅ "개발 전체" / "마케팅·광고 전체"
      out.push({ group: parentName, role: `${parentName} 전체` });

      const childrenSorted = Array.isArray(parent.children)
        ? [...parent.children].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        : [];

      for (const child of childrenSorted) {
        if (!child?.isActive) continue;
        if (!child.name) continue;

        out.push({ group: parentName, role: child.name });
      }
    }

    return out;
  }, [jobTree]);

  // ✅ 검색 필터
  const filtered = useMemo(() => {
    const k = (q ?? "").trim().toLowerCase();
    if (!k) return flat.slice(0, 20);

    const toStr = (v: unknown) =>
      typeof v === "string" ? v : String(v ?? "");

    return flat
      .filter((i) => {
        const role = toStr(i.role).toLowerCase();
        const group = toStr(i.group).toLowerCase();
        return role.includes(k) || group.includes(k);
      })
      .slice(0, 50);
  }, [q, flat]);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  // 하이라이트
  const highlight = (text: string, keyword: string) => {
    const k = keyword.trim();
    if (!k) return text;
    const re = new RegExp(
      `(${k.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")})`,
      "ig"
    );
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

  // 칩 표시
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
          onChange={setQ}
          onSubmit={() => {}}
          onFocus={() => setOpen(true)}
          leftIconSrc={ic_search_gray900_20}
          clearIconSrc={ic_clear_btn_gray400_20}
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
