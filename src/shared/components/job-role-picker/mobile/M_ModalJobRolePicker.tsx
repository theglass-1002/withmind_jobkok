import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";

import check_box_purple from "@/assets/icons/check_box_purple.png";
import check_box_outline_blank_gray from "@/assets/icons/check_box_outline_blank_gray.png";
import chevron_right_gray_light from "@/assets/icons/chevron_right_gray_light.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import ic_arrow_back_ios_gray900_20 from "@/assets/icons/size20/ic_arrow_back_ios_gray900_20.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import chevron_right_black from "@/assets/icons/chevron_right_black.png";

import type { JobNode } from "@/api/job/job.types";

import "../ModalJobRolePicker.css";
import LoadingOverlay from "../../loading/LoadingOverlay";

type Role = {
  key: string;
  label: string;
};

type Category = {
  key: string;
  title: string;
  roles: Role[];
};

export type SelectedRole = {
  categoryKey: string;
  categoryTitle: string;
  roleKey: string;   // 전체면 categoryKey와 동일하게 사용
  roleLabel: string; // "개발 전체" 또는 "서버 개발자"
};

type JobTreeLike = JobNode[] | { code?: number; list?: JobNode[] } | null | undefined;

interface M_ModalJobRolePickerProps {
  jobTree: JobTreeLike;
  loading?: boolean;
  error?: string | null;
  value?: SelectedRole[];
  onChange?: (selected: SelectedRole[]) => void;
  onApply?: (selected: SelectedRole[]) => void;
  onReset?: () => void;
}

const EMPTY_ARRAY: SelectedRole[] = [];

export default function M_ModalJobRolePicker({
  jobTree,
  loading,
  error,
  value,
  onChange,
  onApply,
  onReset,
}: M_ModalJobRolePickerProps) {
  const [currentView, setCurrentView] = useState<"category" | "detail">("category");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [allCheckedCategories, setAllCheckedCategories] = useState<Set<string>>(new Set());

  const safeValue = value ?? EMPTY_ARRAY;

  const normalizedJobTree: JobNode[] = useMemo(() => {
    if (Array.isArray(jobTree)) {
      return jobTree;
    }

    if (jobTree && Array.isArray(jobTree.list)) {
      return jobTree.list;
    }

    return [];
  }, [jobTree]);

  const categories: Category[] = useMemo(() => {
    if (!normalizedJobTree.length) return [];

    return normalizedJobTree
      .filter((node) => node.depth === 0 && node.isActive)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((cat) => ({
        key: String(cat.idx),
        title: cat.name,
        roles: (cat.children ?? [])
          .filter((child) => child.isActive)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((child) => ({
            key: String(child.idx),
            label: child.name,
          })),
      }));
  }, [normalizedJobTree]);

  const getSelectedRoleDetailsFromSets = (
    rolesSet: Set<string>,
    allSet: Set<string>
  ): SelectedRole[] => {
    const result: SelectedRole[] = [];

    categories.forEach((category) => {
      if (allSet.has(category.key)) {
        result.push({
          categoryKey: category.key,
          categoryTitle: category.title,
          roleKey: category.key,
          roleLabel: `${category.title} 전체`,
        });
      } else {
        category.roles.forEach((role) => {
          if (rolesSet.has(role.key)) {
            result.push({
              categoryKey: category.key,
              categoryTitle: category.title,
              roleKey: role.key,
              roleLabel: role.label,
            });
          }
        });
      }
    });

    return result;
  };

  const getSelectedRoleDetails = (): SelectedRole[] => {
    return getSelectedRoleDetailsFromSets(selectedRoles, allCheckedCategories);
  };

  useEffect(() => {
    if (safeValue.length === 0) {
      setAllCheckedCategories(new Set());
      setSelectedRoles(new Set());
      return;
    }

    const nextAll = new Set<string>();
    const nextRoles = new Set<string>();

    safeValue.forEach((item) => {
      if (item.roleLabel.endsWith(" 전체") || item.roleKey === item.categoryKey) {
        nextAll.add(item.categoryKey);
      } else {
        nextRoles.add(item.roleKey);
      }
    });

    setAllCheckedCategories(nextAll);
    setSelectedRoles(nextRoles);
  }, [safeValue]);

  useEffect(() => {
    if (currentView === "detail" && selectedCategory) return;
    if (!categories.length) return;

    if (!selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, currentView, selectedCategory]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setCurrentView("detail");
  };

  const handleBack = () => {
    setCurrentView("category");
    setSelectedCategory(null);
  };

  const handleAllToggle = () => {
    if (!selectedCategory) return;

    const categoryKey = selectedCategory.key;
    const isAlreadyOn = allCheckedCategories.has(categoryKey);

    let nextAll: Set<string>;
    let nextRoles: Set<string>;

    if (isAlreadyOn) {
      nextAll = new Set(allCheckedCategories);
      nextAll.delete(categoryKey);
      nextRoles = new Set(selectedRoles);
    } else {
      const totalCount = allCheckedCategories.size + selectedRoles.size;
      if (totalCount >= 5) {
        toast("최대 5개까지 선택 가능합니다.");
        return;
      }

      // 전체는 1개만 유지
      nextAll = new Set([categoryKey]);
      nextRoles = new Set<string>();
    }

    setAllCheckedCategories(nextAll);
    setSelectedRoles(nextRoles);

    onChange?.(getSelectedRoleDetailsFromSets(nextRoles, nextAll));
  };

  const handleRoleToggle = (role: Role) => {
    if (!selectedCategory) return;

    let nextAll = new Set(allCheckedCategories);
    const nextRoles = new Set(selectedRoles);

    if (nextRoles.has(role.key)) {
      nextRoles.delete(role.key);
    } else {
      // 개별 선택하면 전체 해제
      if (nextAll.size > 0) {
        nextAll = new Set<string>();
      }

      const totalCount = nextAll.size + nextRoles.size;
      if (totalCount >= 5) {
        toast("최대 5개까지 선택 가능합니다.");
        return;
      }

      nextRoles.add(role.key);
    }

    setAllCheckedCategories(nextAll);
    setSelectedRoles(nextRoles);

    onChange?.(getSelectedRoleDetailsFromSets(nextRoles, nextAll));
  };

  const handleRemoveChip = (roleKey: string) => {
    const nextAll = new Set(allCheckedCategories);
    const nextRoles = new Set(selectedRoles);

    const isCategoryKey = categories.some((c) => c.key === roleKey);

    if (isCategoryKey) {
      nextAll.delete(roleKey);
      setAllCheckedCategories(nextAll);
      setSelectedRoles(nextRoles);
      onChange?.(getSelectedRoleDetailsFromSets(nextRoles, nextAll));
      return;
    }

    nextRoles.delete(roleKey);
    setSelectedRoles(nextRoles);
    setAllCheckedCategories(nextAll);
    onChange?.(getSelectedRoleDetailsFromSets(nextRoles, nextAll));
  };

  const handleReset = () => {
    setSelectedRoles(new Set());
    setAllCheckedCategories(new Set());
    setCurrentView("category");
    setSelectedCategory(null);

    onChange?.([]);
    onReset?.();
  };

  const handleApply = () => {
    const details = getSelectedRoleDetails();

    onApply?.(details);
    setCurrentView("category");
    setSelectedCategory(null);
  };

  const getSelectedCount = (category: Category) => {
    if (allCheckedCategories.has(category.key)) return category.roles.length;
    return category.roles.filter((role) => selectedRoles.has(role.key)).length;
  };

  const selectedRoleDetails = getSelectedRoleDetails();

  if (loading) {
    return (
      
      <LoadingOverlay/>
      // <div className="job-role-picker job-role-picker--popup">
      //   <div className="job-role-picker__loading"></div>
      // </div>
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

  if (categories.length === 0) {
    return (
      <div className="job-role-picker job-role-picker--popup">
        <div className="job-role-picker__empty">표시할 직무 정보가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="job-role-picker job-role-picker--popup">
      <span className="job-role-picker__options-note">
        ※ 직군ㆍ직무 옵션은 최대 5개까지 선택 가능합니다.
      </span>

      <div className="job-role-picker__body">
        {currentView === "category" ? (
          <div className="job-role-picker__column job-role-picker__column--left">
            <div className="job-role-picker__category_group">
              {categories.map((category) => {
                const selectedCount = getSelectedCount(category);

                return (
                  <div
                    key={category.key}
                    className="job-role-picker__category"
                    onClick={() => handleCategoryClick(category)}
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
        ) : (
          <div className="job-role-picker__column job-role-picker__column--right">
            <div className="job-role-picker__detail-header">
              <img
                src={ic_arrow_back_ios_gray900_20}
                alt="뒤로"
                className="job-role-picker__back-icon"
                onClick={handleBack}
                style={{ cursor: "pointer" }}
              />
              <span className="job-role-picker__detail-title">
                {selectedCategory?.title}
              </span>
              <span></span>
            </div>

            <div className="job-role-picker__group job-role-picker__group--right">
              <div
                className={`job-role-picker__role job-role-picker__role--all ${
                  allCheckedCategories.has(selectedCategory?.key ?? "") ? "on" : ""
                }`}
                onClick={handleAllToggle}
              >
                <span className="job-role-picker__checkbox-wrap">
                  <img
                    src={
                      allCheckedCategories.has(selectedCategory?.key ?? "")
                        ? check_box_purple
                        : check_box_outline_blank_gray
                    }
                    alt=""
                  />
                </span>
                <span className="job-role-picker__role-label">
                  {selectedCategory?.title} 전체
                </span>
              </div>

              {selectedCategory?.roles.map((role) => (
                <div
                  key={role.key}
                  className={`job-role-picker__role ${
                    selectedRoles.has(role.key) ? "on" : ""
                  }`}
                  onClick={() => handleRoleToggle(role)}
                >
                  <span className="job-role-picker__checkbox-wrap">
                    <img
                      src={
                        selectedRoles.has(role.key)
                          ? check_box_purple
                          : check_box_outline_blank_gray
                      }
                      alt=""
                    />
                  </span>
                  <span className="job-role-picker__role-label">{role.label}</span>
                </div>
              ))}
            </div>

            <div className="job-filter-panel__footer">
              <div className="job-filter-panel__selected-chips">
                {selectedRoleDetails.length > 0 && (
                  <div className="jobs-chips">
                    {selectedRoleDetails.map((role) => (
                      <div key={role.roleKey} className="jobs-chips__item">
                        <span className="job-role-picker__chip-group">
                          {role.categoryTitle}
                        </span>
                        <span className="job-role-picker__chip-role">
                          <span className="job-role-picker__chip-chevron">
                            <img src={chevron_right_black} alt="" />
                          </span>
                          {role.roleLabel}
                        </span>
                        <img
                          onClick={() => handleRemoveChip(role.roleKey)}
                          style={{ cursor: "pointer" }}
                          src={ic_close_gray500_20}
                          alt=""
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="btn_wrap">
                <button
                  className="btn_w_full default_btn_white"
                  type="button"
                  onClick={handleReset}
                >
                  <img src={ic_replay_gray900_20} alt="" /> 초기화
                </button>
                <button
                  className="btn_w_full default_btn_black"
                  type="button"
                  onClick={handleApply}
                >
                  적용하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}