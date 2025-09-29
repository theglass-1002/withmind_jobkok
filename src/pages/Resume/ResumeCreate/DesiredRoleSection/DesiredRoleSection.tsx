import React, { useMemo, useState, useRef, useEffect } from 'react';
import './DesiredRoleSection.css';
import roles from '@/data/desired_roles.json';
import { toast } from 'react-toastify';
import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import close_gray from '@/assets/icons/close_gray.png';
import ic_search_gray900_20 from '@/assets/icons/size20/ic_search_gray900_20.png';
import ic_clear_btn_gray400_20 from '@/assets/icons/size20/ic_clear_btn_gray400_20.png';
import SearchField from '@/shared/components/search/SearchField';
import AiSuggestChips from '@/shared/components/ai/AiSuggestChips';




type RoleItem = { group: string; role: string };
const MAX_SELECTED = 30;

export default function DesiredRoleSection() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');        
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);


  const flat: RoleItem[] = useMemo(() => {
    const cats = (roles as any)?.categories as Array<{ name: string; all?: string; roles: string[] }>;
    if (!Array.isArray(cats)) return [];
  
    const out: RoleItem[] = [];
    for (const c of cats) {
      if (c.all) out.push({ group: c.name, role: c.all });
      for (const r of c.roles ?? []) out.push({ group: c.name, role: r });
    }
    return out;
  }, []);

  const filtered = useMemo(() => {
    const k = (q ?? '').trim().toLowerCase();
    if (!k) return flat.slice(0, 20);
  
    const toStr = (v: unknown) => (typeof v === 'string' ? v : String(v ?? ''));
  
    return flat
      .filter((i) => {
        const role = toStr(i.role).toLowerCase();
        const group = toStr(i.group).toLowerCase();
        return role.includes(k) || group.includes(k);
      })
      .slice(0, 50);
  }, [q, flat]);


  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);
  
  const highlight = (text: string, keyword: string) => {
    const k = keyword.trim();
    if (!k) return text;
    const re = new RegExp(`(${k.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')})`, 'ig');
    return text.split(re).map((part, i) =>
      re.test(part)
        ? <span className="desired-role__highlight" key={i}>{part}</span>
        : <span key={i}>{part}</span>
    );
  };
  
  const chips = useMemo(() => {
    return Array.from(selected).map((key) => {
      const [group, role] = key.split('|');
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
    const roleText = typeof item === 'string' ? item.trim() : item.role;
    if (!roleText) return;
    const group = typeof item === 'string' ? '직접 입력' : item.group;
    const key = `${group}|${roleText}`;
  
    setSelected(prev => {
      if (prev.has(key)) return prev;
      if (prev.size >= MAX_SELECTED) {
        toast.success('최대 30개까지 선택가능합니다.', { toastId: 'role-limit' });
        return prev;
      }
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  
    setQ('');       // 인풋도 비워짐 (제어 컴포넌트라서)
    setOpen(false); // 드롭다운 닫기
  };



  return (
    <div className="resume-create-page__section resume-create-page__section--desired-role">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          희망 직무 <em className="resume-create-page__required">*</em>
        </div>
        <span className="resume-create-page__hint">
          최대 {MAX_SELECTED}개까지 추가 가능합니다.
        </span>
        {selected.size === 0 && (
          <span className="resume-create-page__error">1개 이상 추가해 주세요.</span>
        )}
      </div>
        {chips.length > 0 && (
            <div className="resume-create-page__selected">
            {chips.map((chip) => (
                <div key={chip.key} className="location-picker__chip">
                <div className="location-picker__chip-body">
                {chip.role}
                </div>
                <span
                    className="location-picker__chip-close"
                    onClick={() => removeRole(chip.key)}
                >
                    <img src={close_gray} alt="" />
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
        <div
            className="desired-role__dropdown"
            ref={menuRef}>
            <div className="desired-role__menu"
            role="listbox"
            >
            <ul className="desired-role__list">
                {filtered.map((item, idx) => (
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
                </ul>
                </div>

                {q && (
                <div
                    className="desired-role__menu-footer"
                    onClick={() => addRole(q)}  
                    role="button"
                    tabIndex={0}
                >
                    <span className="desired-role__highlight">“{q}”</span>
                    <span className="desired-role__create-suffix">(으)로 직접 등록하기</span>
                </div>
                )}
            </div>
        )}
        <AiSuggestChips
            title="경력 및 학력 기반의 AI 추천 직무입니다."
            tags={['pm', '풀스택 개발자']}
            onTagClick={(tag) => addRole(tag)}
            />
        </div>
    </div>
  );
}
