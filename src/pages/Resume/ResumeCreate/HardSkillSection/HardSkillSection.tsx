// src/pages/Resume/ResumeCreate/HardSkillSection/HardSkillSection.tsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import "./HardSkillSection.css";
import { toast } from "react-toastify";

import ic_search_gray900_20 from "@/assets/icons/size20/ic_search_gray900_20.png";
import ic_clear_btn_gray400_20 from "@/assets/icons/size20/ic_clear_btn_gray400_20.png";
import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";
import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_close_gray500_24 from "@/assets/icons/size24/ic_close_gray500_24.png";

import SearchField from "@/shared/components/search/SearchField";
import AISuggestArea from "@/pages/Resume/ResumeAISuggest";

import { fetchHardSkillAutoComplete } from "@/api/resume/resume.api";
import type { SkillAutoCompleteItem } from "@/api/resume/resume.types";

const MAX_SELECTED = 30;
const MIN_LENGTH = 1; // "일단"은 1글자부터(원하면 2로 바꾸면 됨)

// 부모와 값 주고받는 props
interface HardSkillSectionProps {
  value?: string[]; // 초기 하드스킬 목록 (edit에서 내려줌)
  onChange?: (skills: string[]) => void; // 선택된 하드 스킬 텍스트 배열
  isEdit?: boolean; // 수정 모드 여부

  // 🔥 AI 하드스킬 추천 (부모에서 내려줌 - DesiredRoleSection과 동일 패턴)
  aiShow?: boolean;
  aiTags?: string[];
  onClickAISuggest?: () => void;
  onCloseAISuggest?: () => void;
}

export default function HardSkillSection({
  value = [],
  onChange,
  isEdit = false,
  aiShow = false,
  aiTags = [],
  onClickAISuggest,
  onCloseAISuggest,
}: HardSkillSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  // ✅ API 자동완성 리스트
  const [items, setItems] = useState<SkillAutoCompleteItem[]>([]);

  // 내부 선택 상태: "그룹|스킬명" 형태로 저장
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(value.map((s) => `직접 입력|${s}`))
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const didSyncFromValueRef = useRef(false);

  const startAdd = () => setIsAdding(true);

  const stopAdd = () => {
    setIsAdding(false);
    setOpen(false);
    setQ("");
    setItems([]);
    // selected는 유지 (edit에서 값 날아가는 것 방지)
  };

  // 🔥 edit 모드일 때 한 번만 value → selected 동기화
  useEffect(() => {
    if (!isEdit) return;
    if (!value || value.length === 0) return;
    if (didSyncFromValueRef.current) return;

    console.log("✅ HardSkillSection(edit): value 동기화", value);
    setSelected(new Set(value.map((s) => `직접 입력|${s}`)));
    didSyncFromValueRef.current = true;
  }, [isEdit, value]);

  // 선택된 하드 스킬 → 부모로 전달
  useEffect(() => {
    const skills = Array.from(selected).map((key) => key.split("|")[1]);
    onChange?.(skills);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  // ✅ q 바뀌면 자동완성 API 호출 (간단 버전: debounce 없음)
  useEffect(() => {
    const keyword = (q ?? "").trim();
    if (!open) return;

    if (keyword.length < MIN_LENGTH) {
      setItems([]);
      return;
    }

    (async () => {
      try {
        console.log("✅ 검색", keyword);
        const data = await fetchHardSkillAutoComplete(keyword);
        setItems(Array.isArray(data) ? data : []);
        console.log("✅ 검색", keyword, data);
      } catch (e) {
        console.log("에러");
        console.error("❌ hard auto-complete error:", e);
        setItems([]);
      }
    })();
  }, [q, open]);

  // 검색어 하이라이트
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

  // 칩 뷰
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

  // ✅ 자동완성 아이템 / 직접입력 모두 추가
  const addRole = (item: SkillAutoCompleteItem | string) => {
    const roleText = typeof item === "string" ? item.trim() : item.name;
    if (!roleText) return;

    const group = "직접 입력";
    const key = `${group}|${roleText}`;

    setSelected((prev) => {
      if (prev.has(key)) return prev;
      if (prev.size >= MAX_SELECTED) {
        toast.success("최대 30개까지 선택가능합니다.", {
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

  return (
    <div className="resume-create-page__section resume-create-page__section--hard-skills">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              하드 스킬
              <span className="tooltip tooltip--top">
                <img className="tooltip__trigger" src={ic_error_gray500_20} alt="툴팁" />
                <div className="tooltip__content" role="tooltip">
                  <span className="tooltip__title">하드 스킬이란?</span>
                  <span className="tooltip__desc">
                    직무 수행에 필요한 전문 기술이나 지식을 의미합니다.
                  </span>
                </div>
              </span>
            </div>
          </div>

          {isAdding ? (
            <img src={ic_close_gray500_24} alt="닫기" onClick={stopAdd} />
          ) : (
            <span className="resume-section-title__action--import" onClick={startAdd}>
              <img src={ic_add_purple_20} alt="" />
              추가
            </span>
          )}
        </div>

        {isAdding && (
          <span className="resume-create-page__hint">
            최대 {MAX_SELECTED}개까지 추가 가능합니다.
          </span>
        )}
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
                <img src={ic_close_gray500_24} alt="" />
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={`resume-create-page__section-body ${isAdding ? "" : "empty"}`}>
        {isAdding ? (
          <>
            <SearchField
              className="resume-search"
              id="hard-skill-search"
              value={q}
              placeholder="보유 하드 스킬을 입력해 주세요. (ex. Java, React)"
              onChange={(v) => {
                setQ(v);
                setOpen(true);
              }}
              onSubmit={() => {}}
              onFocus={() => setOpen(true)}
              leftIconSrc={ic_search_gray900_20}
              clearIconSrc={ic_clear_btn_gray400_20}
              showSubmitButton={false}
            />

            {open && (
              <div className="hard-skills__dropdown" ref={menuRef}>
                <div className="hard-skills__menu" role="listbox">
                  <ul className="hard-skills__list">
                    {items.length > 0 &&
                      items.map((item) => (
                        <li
                          key={item.id}
                          className="hard-skills__option"
                          role="option"
                          onClick={() => addRole(item)}
                        >
                          <span className="hard-skills__option-role">
                            {highlight(item.name, q)}
                          </span>
                        </li>
                      ))}
                    {q.trim().length >= MIN_LENGTH && items.length === 0 && (
                      <li className="hard-skills__option" aria-disabled="true">
                        추천 결과가 없습니다.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}


            <AISuggestArea
              show={aiShow}
              items={aiTags}
              onClickSuggest={onClickAISuggest}
              onClose={onCloseAISuggest}
              onPick={(tag) => addRole(tag)}
              wrapperClassName="resume-suggest__hardskill"
              variant="chips"
              hintText="더 정확한 하드 스킬 추천을 위해 (희망 직무와 경력) 항목을 먼저 입력해 주세요."
              triggerLabel="AI 하드 스킬 추천"
              suggestResultTitle="경력 및 직무 기반의 AI 추천 하드 스킬입니다."
            />
          </>
        ) : (
          <>하드 스킬을 추가해 주세요.</>
        )}
      </div>
    </div>
  );
}
