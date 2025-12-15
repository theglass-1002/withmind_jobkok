import React, { useState, useEffect } from "react";
import desiredRolesJson from "@/data/desired_roles.json";

import check_box_purple from "@/assets/icons/check_box_purple.png";
import check_box_outline_blank_gray from "@/assets/icons/check_box_outline_blank_gray.png";
import chevron_right_gray_light from "@/assets/icons/chevron_right_gray_light.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import ic_arrow_back_ios_gray900_20 from "@/assets/icons/size20/ic_arrow_back_ios_gray900_20.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import chevron_right_black from "@/assets/icons/chevron_right_black.png";

import "../ModalJobRolePicker.css";

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
  roleKey: string;
  roleLabel: string;
};

// JSON 원본 타입 (추정)
type RawCategory = {
  name: string;      // "개발", "디자인", "마케팅·광고" 등
  all: string;       // "개발 전체" 이런 문자열일 수 있음 (지금은 안 씀)
  roles: string[];   // ["서버 개발자", "프로젝트 기획자", ...]
};

type DesiredRolesJson = {
  categories: RawCategory[];
};

// 문자열을 key로 변환하는 유틸 (간단 slug)
const toKey = (str: string) =>
  str
    .trim()
    .replace(/\s+/g, "_") // 공백 → _
    .replace(/[^a-zA-Z0-9_가-힣]/g, ""); // 특수문자 제거 (필요에 따라 조정)

const raw = desiredRolesJson as DesiredRolesJson;

// JSON → 컴포넌트에서 사용할 CATEGORIES로 변환
const CATEGORIES: Category[] = raw.categories.map((cat) => ({
  key: toKey(cat.name), // 카테고리 key (예: "개발" → "개발" or "개발_...")
  title: cat.name,      // 화면에 표시되는 라벨 ("개발", "디자인", "마케팅·광고")
  roles: cat.roles.map((roleLabel, index) => ({
    key: `${toKey(cat.name)}_${index}`, // 각 역할에 대한 고유 key
    label: roleLabel,                   // "서버 개발자" 등
  })),
}));

interface M_ModalJobRolePickerProps {
  onChange?: (selected: SelectedRole[]) => void;
  onReset?: () => void; // 초기화 콜백 추가
}

export default function M_ModalJobRolePicker({
  onChange,
  onReset,
}: M_ModalJobRolePickerProps) {
  // 1단계 (카테고리 리스트) / 2단계 (상세 직무 리스트)
  const [currentView, setCurrentView] = useState<"category" | "detail">(
    "category"
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // 선택된 직무들
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  // 전체 선택 여부 (카테고리별)
  const [allCheckedMap, setAllCheckedMap] = useState<Record<string, boolean>>(
    {}
  );

  // 선택된 직무들을 상세 정보로 변환
  const getSelectedRoleDetails = (): SelectedRole[] => {
    const result: SelectedRole[] = [];

    CATEGORIES.forEach((category) => {
      category.roles.forEach((role) => {
        if (selectedRoles.has(role.key)) {
          result.push({
            categoryKey: category.key,
            categoryTitle: category.title,
            roleKey: role.key,
            roleLabel: role.label,
          });
        }
      });
    });

    return result;
  };

  // selectedRoles가 변경될 때마다 부모에게 알림
  useEffect(() => {
    const details = getSelectedRoleDetails();
    console.log("🎯 선택된 직무:", details);
    if (onChange) {
      onChange(details);
    }
  }, [selectedRoles]);

  // 카테고리 클릭 → 상세 화면으로 이동
  const handleCategoryClick = (category: Category) => {
    console.log("📂 카테고리 클릭:", category.title);
    setSelectedCategory(category);
    setCurrentView("detail");
  };

  // 뒤로 가기 → 카테고리 리스트로 (선택 유지!)
  const handleBack = () => {
    console.log("⬅️ 뒤로 가기 (선택 유지)");
    setCurrentView("category");
    setSelectedCategory(null);
    // 선택된 값은 유지!
  };

  // 전체 선택 토글
  const handleAllToggle = () => {
    if (!selectedCategory) return;

    const categoryKey = selectedCategory.key;
    const isCurrentlyAll = allCheckedMap[categoryKey] ?? false;

    if (isCurrentlyAll) {
      // 전체 해제
      setSelectedRoles((prev) => {
        const next = new Set(prev);
        selectedCategory.roles.forEach((role) => next.delete(role.key));
        return next;
      });
      setAllCheckedMap((prev) => ({ ...prev, [categoryKey]: false }));
    } else {
      // 전체 선택
      setSelectedRoles((prev) => {
        const next = new Set(prev);
        selectedCategory.roles.forEach((role) => next.add(role.key));
        return next;
      });
      setAllCheckedMap((prev) => ({ ...prev, [categoryKey]: true }));
    }
  };

  // 개별 직무 선택/해제
  const handleRoleToggle = (roleKey: string) => {
    if (!selectedCategory) return;

    setSelectedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(roleKey)) {
        next.delete(roleKey);
        // 하나라도 해제하면 전체 선택 해제
        setAllCheckedMap((p) => ({ ...p, [selectedCategory.key]: false }));
      } else {
        next.add(roleKey);
        // 모두 선택되었는지 확인
        const allSelected = selectedCategory.roles.every(
          (r) => r.key === roleKey || next.has(r.key)
        );
        if (allSelected) {
          setAllCheckedMap((p) => ({ ...p, [selectedCategory.key]: true }));
        }
      }
      return next;
    });
  };

  // 칩 삭제 (개별 직무 해제)
  const handleRemoveChip = (roleKey: string) => {
    console.log("🗑️ 칩 삭제:", roleKey);
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      next.delete(roleKey);

      // 해당 카테고리의 전체 선택 해제
      const category = CATEGORIES.find((cat) =>
        cat.roles.some((role) => role.key === roleKey)
      );
      if (category) {
        setAllCheckedMap((p) => ({ ...p, [category.key]: false }));
      }

      return next;
    });
  };

  // 초기화
  const handleReset = () => {
    console.log("🔄 초기화");
    setSelectedRoles(new Set());
    setAllCheckedMap({});
    setCurrentView("category"); // 1단계로 이동
    setSelectedCategory(null);
    if (onReset) onReset(); // 부모에게도 알림
  };

  // 적용하기 → 1단계로 이동 (선택 유지!)
  const handleApply = () => {
    console.log("✅ 적용하기 (1단계로 이동, 선택 유지)");
    setCurrentView("category"); // 1단계로 이동
    setSelectedCategory(null);
    // 선택된 값은 유지!
  };

  // 카테고리에서 선택된 개수 계산
  const getSelectedCount = (category: Category) => {
    return category.roles.filter((role) => selectedRoles.has(role.key)).length;
  };

  // 상세 정보 배열 가져오기 (칩 표시용)
  const selectedRoleDetails = getSelectedRoleDetails();

  return (
    <>
      <div className="job-role-picker job-role-picker--popup">
      <span className="job-role-picker__options-note">
                ※ 직군ㆍ직무 옵션은 최대 5개까지 선택 가능합니다.
                </span>
        <div className="job-role-picker__body">
          {currentView === "category" ? (
            /* 1단계: 카테고리 리스트 */
            <div className="job-role-picker__column job-role-picker__column--left">
              <div className="job-role-picker__category_group">

                {CATEGORIES.map((category) => {
                  const selectedCount = getSelectedCount(category);
                  const defaultCount = category.roles.length;

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
            /* 2단계: 상세 직무 리스트 */
            <div className="job-role-picker__column job-role-picker__column--right">
              {/* 헤더 (뒤로 가기) */}
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

              {/* 직무 리스트 */}
              <div className="job-role-picker__group job-role-picker__group--right">
                {/* 전체 선택 */}
                <div
                  className={`job-role-picker__role job-role-picker__role--all ${
                    allCheckedMap[selectedCategory?.key ?? ""] ? "on" : ""
                  }`}
                  onClick={handleAllToggle}
                >
                  <span className="job-role-picker__checkbox-wrap">
                    <img
                      src={
                        allCheckedMap[selectedCategory?.key ?? ""]
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

                {/* 개별 직무 */}
                {selectedCategory?.roles.map((role) => (
                  <div
                    key={role.key}
                    className={`job-role-picker__role ${
                      selectedRoles.has(role.key) ? "on" : ""
                    }`}
                    onClick={() => handleRoleToggle(role.key)}
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
                    <span className="job-role-picker__role-label">
                      {role.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* 하단 칩 + 버튼 영역 */}
              <div className="job-filter-panel__footer">
                <div className="job-filter-panel__selected-chips">
                  {selectedRoleDetails.length > 0 ? (
                    <div className="jobs-chips">
                      {selectedRoleDetails.map((role) => (
                        <div
                          key={role.roleKey}
                          className="jobs-chips__item"
                        >
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
                  ) : (
                    <></>
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
    </>
  );
}
