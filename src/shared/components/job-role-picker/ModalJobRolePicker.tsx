import React, { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";

import type { JobNode } from "@/api/job/job.types";

import check_box_purple from "@/assets/icons/check_box_purple.png";
import check_box_outline_blank_gray from "@/assets/icons/check_box_outline_blank_gray.png";

import chevron_right_black from "@/assets/icons/chevron_right_black.png";
import chevron_right_gray_light from "@/assets/icons/chevron_right_gray_light.png";
import refresh_black from "@/assets/icons/refresh_black.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";

import "./ModalJobRolePicker.css";

// ---------------- 타입 ----------------

type Role = { key: string; label: string };

type Category = {
  key: string;
  title: string;
  all: string;
  roles: Role[];
};

type SelectedItem = {
  categoryId: number;
  categoryName: string;
  roleId: number; // ✅ 전체 = -1
  roleName: string; // ✅ 전체 = "전체"
};

type Props = {
  jobTree: JobNode[];
  loading?: boolean;
  error?: string | null;
  onApply?: (selected: SelectedItem[]) => void;

  // ✅ 추가: 모달 재오픈 시 선택 복원용
  initialSelected?: SelectedItem[];
};

type ChipView =
  | {
      kind: "all";
      key: string;
      categoryKey: string;
      categoryId: number;
      categoryTitle: string;
      roleLabel: string; // "개발 전체"
    }
  | {
      kind: "role";
      key: string;
      roleKey: string; // roleId string
      categoryId: number;
      categoryTitle: string;
      roleId: number;
      roleLabel: string;
    };

export default function ModalJobRolePicker({
  jobTree,
  loading,
  error,
  onApply,
  initialSelected = [],
}: Props) {
  const [allCheckedCategories, setAllCheckedCategories] = useState<Set<string>>(
    new Set()
  );
  const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);

  const categories: Category[] = useMemo(() => {
    if (!jobTree || jobTree.length === 0) return [];

    return jobTree
      .filter((node) => node.depth === 0 && node.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((cat) => ({
        key: String(cat.id),
        title: cat.name,
        all: `${cat.name} 전체`,
        roles: (cat.children ?? [])
          .filter((child) => child.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((child) => ({
            key: String(child.id),
            label: child.name,
          })),
      }));
  }, [jobTree]);

  const roleToCategoryKey = useMemo(() => {
    const m = new Map<string, string>();
    categories.forEach((cat) => {
      cat.roles.forEach((r) => {
        m.set(r.key, cat.key);
      });
    });
    return m;
  }, [categories]);

  //  초기 선택값 복원 (모달 재오픈 시)
  useEffect(() => {
    if (!categories.length) return;

    const nextAll = new Set<string>();
    const nextRoles = new Set<string>();
    let nextActive: string | null = null;

    const allPick = initialSelected.find((s) => s.roleId === -1);
    if (allPick) {
      const catKey = String(allPick.categoryId);
      nextAll.add(catKey);
      nextActive = catKey;
    } else {
      for (const s of initialSelected) {
        if (s.roleId > 0) nextRoles.add(String(s.roleId));
        if (!nextActive) nextActive = String(s.categoryId);
      }
    }

    setAllCheckedCategories(nextAll);
    setCheckedRoles(nextRoles);
    setActiveCategoryKey(nextActive ?? categories[0].key);
  }, [initialSelected, categories]);

  // activeCategory 기본값 세팅(아무것도 없을 때만)
  useEffect(() => {
    if (!activeCategoryKey && categories.length > 0) {
      setActiveCategoryKey(categories[0].key);
    }
  }, [categories, activeCategoryKey]);

  const activeCategory =
    categories.find((c) => c.key === activeCategoryKey) ?? categories[0] ?? null;

  const isOn = (key: string) => activeCategoryKey === key;

  const toggleCategory = (key: string) => {
    setActiveCategoryKey(key);
  };

  const isActiveCategoryAllChecked =
    !!activeCategoryKey && allCheckedCategories.has(activeCategoryKey);

  // ✅ 전체 선택: 항상 1개만 유지
  const onClickAll = () => {
    if (!activeCategory) return;

    const catKey = activeCategory.key;
    const isAlreadyOn = allCheckedCategories.has(catKey);

    if (isAlreadyOn) {
      const next = new Set(allCheckedCategories);
      next.delete(catKey);
      setAllCheckedCategories(next);
      return;
    }

    const next = new Set<string>();
    next.add(catKey);
    setAllCheckedCategories(next);

    // ✅ 전체 선택 시 개별 직무 선택은 전부 해제
    setCheckedRoles(new Set());
  };

  // ✅ 개별 직무: 최대 5개 제한 (전체 선택은 제한 없음)
  const onClickRole = (roleKey: string) => {
    const isAlreadyChecked = checkedRoles.has(roleKey);

    if (!isAlreadyChecked && checkedRoles.size >= 5) {
      toast("최대 5개까지 선택 가능합니다.");
      return;
    }

    // ✅ role 선택하면 그 role이 속한 카테고리의 "전체"는 해제
    const catKey = roleToCategoryKey.get(roleKey);
    if (catKey && allCheckedCategories.has(catKey)) {
      const nextAll = new Set(allCheckedCategories);
      nextAll.delete(catKey);
      setAllCheckedCategories(nextAll);
    }

    // ✅ role 토글
    const next = new Set(checkedRoles);
    if (isAlreadyChecked) next.delete(roleKey);
    else next.add(roleKey);
    setCheckedRoles(next);
  };

  // ✅ "전체 칩" 삭제
  const removeAllChip = (categoryKey: string) => {
    const next = new Set(allCheckedCategories);
    next.delete(categoryKey);
    setAllCheckedCategories(next);
  };

  const handleReset = () => {
    setAllCheckedCategories(new Set());
    setCheckedRoles(new Set());
    setActiveCategoryKey(categories[0]?.key ?? null);
  };

  const getSelectedCount = (category: Category) => {
    if (allCheckedCategories.has(category.key)) return category.roles.length;
    return category.roles.filter((r) => checkedRoles.has(r.key)).length;
  };

  // ✅ 칩: 전체 선택이면 "개발 전체" 1개, 개별은 선택된 것만
  const selectedChips: ChipView[] = categories.flatMap<ChipView>((category) => {
    if (allCheckedCategories.has(category.key)) {
      return [
        {
          kind: "all",
          key: `all-${category.key}`,
          categoryKey: category.key,
          categoryId: Number(category.key),
          categoryTitle: category.title,
          roleLabel: `${category.title} 전체`,
        },
      ];
    }

    return category.roles
      .filter((r) => checkedRoles.has(r.key))
      .map<ChipView>((r) => ({
        kind: "role",
        key: `role-${r.key}`,
        roleKey: r.key,
        categoryId: Number(category.key),
        categoryTitle: category.title,
        roleId: Number(r.key),
        roleLabel: r.label,
      }));
  });
  // ✅ 적용: "전체 선택"도 부모로 같이 넘김
  const handleApply = () => {
    if (!onApply) return;

    const payload: SelectedItem[] = selectedChips.map((chip) => {
      if (chip.kind === "all") {
        return {
          categoryId: chip.categoryId,
          categoryName: chip.categoryTitle,
          roleId: 0,
          roleName: "전체",
        };
      }
      return {
        categoryId: chip.categoryId,
        categoryName: chip.categoryTitle,
        
        roleId: chip.roleId,
        roleName: chip.roleLabel,
      };
    });

    onApply(payload);
  };

  if (loading) {
    return (
      <div className="job-role-picker job-role-picker--popup">
        <div className="job-role-picker__loading">
          직군·직무 정보를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-role-picker job-role-picker--popup">
        <div className="job-role-picker__error">
          직군·직무 정보를 불러오는 중 오류가 발생했습니다.
          <br />
          {error}
        </div>
      </div>
    );
  }

  if (!activeCategory) {
    return (
      <div className="job-role-picker job-role-picker--popup">
        <div className="job-role-picker__empty">
          표시할 직무 정보가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="job-role-picker job-role-picker--popup">
        <div className="job-role-picker__body">
          <div className="job-role-picker__column job-role-picker__column--left">
            <div className="job-role-picker__category_group">
              {categories.map((category) => {
                const selectedCount = getSelectedCount(category);
                return (
                  <div
                    key={category.key}
                    className={`job-role-picker__category ${
                      isOn(category.key) ? "on" : ""
                    }`}
                    onClick={() => toggleCategory(category.key)}
                  >
                    <div className="job-role-picker__category-meta">
                      <span className="job-role-picker__category-title">
                        {category.title}
                      </span>
                      <span className="job-role-picker__category-count">
                        {selectedCount > 0 ? selectedCount : ""}
                      </span>
                    </div>
                    <span className="job-role-picker__category-toggle">
                      <img src={chevron_right_gray_light} alt="" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="job-role-picker__column job-role-picker__column--right">
            <div className="job-role-picker__group job-role-picker__group--right">
              <div
                className={`job-role-picker__role job-role-picker__role--all ${
                  isActiveCategoryAllChecked ? "on" : ""
                }`}
                onClick={onClickAll}
              >
                <span className="job-role-picker__checkbox-wrap">
                  <img
                    src={
                      isActiveCategoryAllChecked
                        ? check_box_purple
                        : check_box_outline_blank_gray
                    }
                    alt=""
                  />
                </span>
                <span className="job-role-picker__role-label">
                  {activeCategory.all}
                </span>
              </div>

              {activeCategory.roles.map((role) => (
                <div
                  key={role.key}
                  className={`job-role-picker__role ${
                    checkedRoles.has(role.key) ? "on" : ""
                  }`}
                  onClick={() => onClickRole(role.key)}
                >
                  <span className="job-role-picker__checkbox-wrap">
                    <img
                      src={
                        checkedRoles.has(role.key)
                          ? check_box_purple
                          : check_box_outline_blank_gray
                      }
                      alt=""
                    />
                  </span>
                  <span className="job-role-picker__role-label">
                    {role.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="job-role-picker__options">
          <span className="job-role-picker__options-note">
            ※ 옵션은 최대 5개까지 선택 가능합니다.
          </span>
          <div className="job-role-picker__selected">
            {selectedChips.map((chip) => (
              <div key={chip.key} className="job-role-picker__chip">
                <div className="job-role-picker__chip-body">
                  <span className="job-role-picker__chip-group">
                    {chip.categoryTitle}
                  </span>
                  <span className="job-role-picker__chip-role">
                    <span className="job-role-picker__chip-chevron">
                      <img src={chevron_right_black} alt="" />
                    </span>
                    {chip.roleLabel}
                  </span>
                </div>

                <img
                  className="job-role-picker__chip-close"
                  onClick={() => {
                    if (chip.kind === "all") removeAllChip(chip.categoryKey);
                    else onClickRole(chip.roleKey);
                  }}
                  src={ic_close_gray500_20}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>

        <div className="job-role-picker__actions">
          <div className="default_btn_white" onClick={handleReset}>
            <span className="job-role-picker__reset-icon">
              <img src={refresh_black} alt="" />
            </span>
            <span className="job-role-picker__reset-text">초기화</span>
          </div>
          <span className="default_btn_black" onClick={handleApply}>
            적용
          </span>
        </div>
      </div>
    </>
  );
}
