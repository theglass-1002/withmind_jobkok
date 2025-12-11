import React, { useMemo, useState, useEffect } from "react";

import type { JobNode } from "@/api/job/job.types";

import check_box_purple from "@/assets/icons/check_box_purple.png";
import check_box_outline_blank_gray from "@/assets/icons/check_box_outline_blank_gray.png";

import chevron_right_black from "@/assets/icons/chevron_right_black.png";
import chevron_right_gray_light from "@/assets/icons/chevron_right_gray_light.png";
import refresh_black from "@/assets/icons/refresh_black.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";

import "./ModalJobRolePicker.css";

// ---------------- 타입 ----------------

type Role = {
  key: string; // roleId를 string으로
  label: string;
};

type Category = {
  key: string;   // categoryId를 string으로
  title: string; // ex) "개발"
  all: string;   // ex) "개발 전체"
  roles: Role[];
};

type Props = {
  jobTree: JobNode[];  // API에서 받은 전체 직무 트리
  loading?: boolean;
  error?: string | null;
  onApply?: (
    selected: {
      categoryId: number;
      categoryName: string;
      roleId: number;
      roleName: string;
    }[]
  ) => void;
};

export default function ModalJobRolePicker({
  jobTree,
  loading,
  error,
  onApply,
}: Props) {
  const [allChecked, setAllChecked] = useState(false);
  const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);

  // JobNode[] -> Category[] 변환
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

  // activeCategory 기본값 세팅
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

  const onClickAll = () => {
    setAllChecked((prev) => {
      const next = !prev;
      if (next) {
        setCheckedRoles(new Set());
      }
      return next;
    });
  };

  const onClickRole = (key: string) => {
    setAllChecked(false);
    setCheckedRoles((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleReset = () => {
    setAllChecked(false);
    setCheckedRoles(new Set());
    setActiveCategoryKey(categories[0]?.key ?? null);
  };

  // 카테고리별 선택 개수
  const getSelectedCount = (category: Category) =>
    category.roles.filter((r) => checkedRoles.has(r.key)).length;

  // 칩 데이터
  const selectedChips =
    categories.flatMap((category) =>
      category.roles
        .filter((r) => checkedRoles.has(r.key))
        .map((r) => ({
          key: r.key,
          categoryId: Number(category.key),
          categoryTitle: category.title,
          roleId: Number(r.key),
          roleLabel: r.label,
        }))
    ) ?? [];

  // "적용" 버튼 클릭
  const handleApply = () => {
    if (!onApply) return;
    onApply(
      selectedChips.map((chip) => ({
        categoryId: chip.categoryId,
        categoryName: chip.categoryTitle,
        roleId: chip.roleId,
        roleName: chip.roleLabel,
      }))
    );
  };

  // 로딩/에러/빈 상태 처리
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
        <div className="job-role-picker__empty">표시할 직무 정보가 없습니다.</div>
      </div>
    );
  }

  return (
    <>
      <div className="job-role-picker job-role-picker--popup">
        <div className="job-role-picker__body">
          {/* 왼쪽: 카테고리 리스트 */}
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

          {/* 오른쪽: 직무 리스트 */}
          <div className="job-role-picker__column job-role-picker__column--right">
            <div className="job-role-picker__group job-role-picker__group--right">
              {/* 카테고리 전체 */}
              <div
                className={`job-role-picker__role job-role-picker__role--all ${
                  allChecked ? "on" : ""
                }`}
                onClick={onClickAll}
              >
                <span className="job-role-picker__checkbox-wrap">
                  <img
                    src={
                      allChecked
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

              {/* 개별 직무 */}
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

        {/* 선택된 직무 칩 영역 */}
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
                  onClick={() => onClickRole(chip.key)}
                  src={ic_close_gray500_20}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
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
