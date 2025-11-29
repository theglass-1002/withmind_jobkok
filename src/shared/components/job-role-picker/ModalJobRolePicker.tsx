import React, { useState } from "react";

import desiredRolesJson from "@/data/desired_roles.json";

import check_box_purple from "@/assets/icons/check_box_purple.png";
import check_box_outline_blank_gray from "@/assets/icons/check_box_outline_blank_gray.png";

import chevron_right_black from "@/assets/icons/chevron_right_black.png";
import chevron_right_gray_light from "@/assets/icons/chevron_right_gray_light.png";
import refresh_black from "@/assets/icons/refresh_black.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";

import "./ModalJobRolePicker.css";

// ---------------- 타입 & JSON 매핑 ----------------

type Role = {
  key: string;
  label: string;
};

type Category = {
  key: string;
  title: string;
  all: string;
  roles: Role[];
};

// JSON 원본 타입 (추정)
type RawCategory = {
  name: string;      // "개발", "디자인", "마케팅ㆍ광고" ...
  all: string;       // "개발 전체" ...
  roles: string[];   // ["서버 개발자", "프론트엔드 개발자", ...]
};

type DesiredRolesJson = {
  categories: RawCategory[];
};

const toKey = (str: string) =>
  str
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_가-힣]/g, "");

// JSON → Category[] 로 변환
const raw = desiredRolesJson as DesiredRolesJson;

const CATEGORIES: Category[] = raw.categories.map((cat) => ({
  key: toKey(cat.name),
  title: cat.name,
  all: cat.all,
  roles: cat.roles.map((roleLabel, index) => ({
    key: `${toKey(cat.name)}_${index}`,
    label: roleLabel,
  })),
}));

export default function ModalJobRolePicker() {
  const [allChecked, setAllChecked] = useState(false); // "카테고리 전체" 모드
  const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(
    CATEGORIES[0]?.key ?? null
  );

  const activeCategory =
    CATEGORIES.find((c) => c.key === activeCategoryKey) ?? CATEGORIES[0] ?? null;

  const isOn = (key: string) => activeCategoryKey === key;

  const toggleCategory = (key: string) => {
    setActiveCategoryKey(key);
  };

  const onClickAll = () => {
    // 기존 로직처럼: 전체 모드 켜면 개별 직무 선택은 클리어
    setAllChecked((prev) => {
      const next = !prev;
      if (next) setCheckedRoles(new Set());
      return next;
    });
  };

  const onClickRole = (key: string) => {
    setAllChecked(false); // 개별 선택 시 전체 모드는 해제
    setCheckedRoles((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleReset = () => {
    setAllChecked(false);
    setCheckedRoles(new Set());
    setActiveCategoryKey(CATEGORIES[0]?.key ?? null);
  };

  // 카테고리별 선택된 직무 개수
  const getSelectedCount = (category: Category) =>
    category.roles.filter((r) => checkedRoles.has(r.key)).length;

  // 칩 데이터
  const selectedChips = CATEGORIES.flatMap((category) =>
    category.roles
      .filter((r) => checkedRoles.has(r.key))
      .map((r) => ({
        key: r.key,
        categoryTitle: category.title,
        roleLabel: r.label,
      }))
  );

  return (
    <>
      <div className="job-role-picker job-role-picker--popup">
        <div className="job-role-picker__body">
          {/* 왼쪽: 카테고리 리스트 */}
          <div className="job-role-picker__column job-role-picker__column--left">
            <div className="job-role-picker__category_group">
              {CATEGORIES.map((category) => {
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
                  {activeCategory?.all ?? "전체"}
                </span>
              </div>

              {/* 개별 직무 */}
              {activeCategory?.roles.map((role) => (
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
                  src={ic_close_gray500_20} alt="" />
            
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
          <span className="default_btn_black">적용</span>
        </div>
      </div>
    </>
  );
}
