// src/shared/components/location-picker/ModalLocationPicker.tsx
import React, { useState } from "react";

import locationsData from "@/data/locationsV2.json";

import check_box_purple from "@/assets/icons/check_box_purple.png";
import check_box_outline_blank_gray from "@/assets/icons/check_box_outline_blank_gray.png";

import chevron_right_black from "@/assets/icons/chevron_right_black.png";
import chevron_right_gray_light from "@/assets/icons/chevron_right_gray_light.png";
import refresh_black from "@/assets/icons/refresh_black.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";

import "./ModalLocationPicker.css";

// ---------------- 타입 & JSON 매핑 ----------------

type District = {
  key: string;   // ex) "11-230"
  name: string;  // ex) "강남구"
};

type Region = {
  key: string;         // ex) "11"
  name: string;        // ex) "서울"
  all: string;         // ex) "서울 전체"
  districts: District[];
};

// locationsV2.json 원본 타입
type RawRegionV2 = {
  code: string;   // "11"
  name: string;   // "서울 전체"
  children: {
    code: string; // "11-230"
    name: string; // "강남구"
  }[];
};

type ModalLocationPickerProps = {
  // 적용 클릭 시 부모로 넘길 콜백
  onApply?: (
    selected: {
      code: string;         // "11-230"
      regionName: string;   // "서울"
      districtName: string; // "강남구"
    }[]
  ) => void;
};

// JSON → Region[] 변환
const RAW_REGIONS = locationsData as RawRegionV2[];

const REGIONS: Region[] = RAW_REGIONS.map((r) => {
  const cityName = r.name.replace(/\s*전체$/, ""); // "서울 전체" -> "서울"
  return {
    key: r.code,      // 코드 사용
    name: cityName,
    all: r.name,      // 전체 라벨은 그대로 "서울 전체"
    districts: r.children.map((d) => ({
      key: d.code,    // ex) "11-230"
      name: d.name,   // ex) "강남구"
    })),
  };
});

export default function ModalLocationPicker({ onApply }: ModalLocationPickerProps) {
  const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());
  const [activeRegionKey, setActiveRegionKey] = useState<string | null>(
    REGIONS[0]?.key ?? null
  );

  const activeRegion =
    REGIONS.find((r) => r.key === activeRegionKey) ?? REGIONS[0] ?? null;

  const isOn = (key: string) => activeRegionKey === key;

  const toggleCategory = (key: string) => {
    setActiveRegionKey(key);
  };

  // 현재 활성 지역이 전체 선택 상태인지
  const isAllCheckedForActiveRegion =
    !!activeRegion &&
    activeRegion.districts.length > 0 &&
    activeRegion.districts.every((d) => checkedRoles.has(d.key));

  const onClickAll = () => {
    if (!activeRegion) return;

    setCheckedRoles((prev) => {
      const next = new Set(prev);
      const allKeys = activeRegion.districts.map((d) => d.key);
      const allSelected = allKeys.every((k) => next.has(k));

      if (allSelected) {
        // 이 지역의 구들만 해제
        allKeys.forEach((k) => next.delete(k));
      } else {
        // 이 지역의 구들만 선택
        allKeys.forEach((k) => next.add(k));
      }

      return next;
    });
  };

  const onClickRole = (key: string) => {
    setCheckedRoles((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleReset = () => {
    setCheckedRoles(new Set());
    setActiveRegionKey(REGIONS[0]?.key ?? null);
  };

  // 선택된 항목들 → 칩 데이터 (UI용 & onApply용)
  const selectedChips = REGIONS.flatMap((region) =>
    region.districts
      .filter((d) => checkedRoles.has(d.key))
      .map((d) => ({
        key: d.key,              // 코드 ("11-230")
        regionName: region.name, // "서울"
        districtName: d.name,    // "강남구"
      }))
  );

  const handleApply = () => {
    if (onApply) {
      onApply(
        selectedChips.map((chip) => ({
          code: chip.key,
          regionName: chip.regionName,
          districtName: chip.districtName,
        }))
      );
    }
  };

  const renderLeftColumn = () => (
    <div className="location-picker__column location-picker__column--left">
      <div className="location-picker__category_group">
        {REGIONS.map((region) => {
          const selectedCount = region.districts.filter((d) =>
            checkedRoles.has(d.key)
          ).length;

          return (
            <div
              key={region.key}
              className={`location-picker__category ${
                isOn(region.key) ? "on" : ""
              }`}
              onClick={() => toggleCategory(region.key)}
            >
              <div className="location-picker__category-meta">
                <span className="location-picker__category-title">
                  {region.name}
                </span>
                <span className="location-picker__category-count">
                  {selectedCount > 0 ? selectedCount : ""}
                </span>
              </div>
              <span className="location-picker__category-toggle">
                <img src={chevron_right_gray_light} alt="" />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderRightColumn = () => {
    if (!activeRegion) return null;

    return (
      <div className="location-picker__column location-picker__column--right">
        <div className="location-picker__group location-picker__group--right">
          {/* 전체 선택 */}
          <div
            className={`location-picker__role location-picker__role--all ${
              isAllCheckedForActiveRegion ? "on" : ""
            }`}
            onClick={onClickAll}
          >
            <span className="location-picker__checkbox-wrap">
              <img
                src={
                  isAllCheckedForActiveRegion
                    ? check_box_purple
                    : check_box_outline_blank_gray
                }
                alt=""
              />
            </span>
            <span className="location-picker__role-label">
              {activeRegion.all /* ex) "서울 전체" */}
            </span>
          </div>

          {/* 개별 구/군 */}
          {activeRegion.districts.map((d) => (
            <div
              key={d.key}
              className={`location-picker__role ${
                checkedRoles.has(d.key) ? "on" : ""
              }`}
              onClick={() => onClickRole(d.key)}
            >
              <span className="location-picker__checkbox-wrap">
                <img
                  src={
                    checkedRoles.has(d.key)
                      ? check_box_purple
                      : check_box_outline_blank_gray
                  }
                  alt=""
                />
              </span>
              <span className="location-picker__role-label">{d.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSelectedChips = () => (
    <div className="location-picker__selected">
      {selectedChips.map((chip) => (
        <div key={chip.key} className="location-picker__chip">
          <div className="location-picker__chip-body">
            <span className="location-picker__chip-group">
              {chip.regionName}
            </span>
            <span className="location-picker__chip-role">
              <span className="location-picker__chip-chevron">
                <img src={chevron_right_black} alt="" />
              </span>
              {chip.districtName}
            </span>
          </div>
          <span
            className="location-picker__chip-close"
            onClick={() => onClickRole(chip.key)}
          >
            <img src={ic_close_gray500_20} alt="" />
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* 데스크톱 / 기본 */}
      <div className="location-picker location-picker--popup">
        <div className="location-picker__body">
          {renderLeftColumn()}
          {renderRightColumn()}
        </div>

        <div className="location-picker__options">
          <span className="location-picker__options-note">
            ※ 옵션은 최대 5개까지 선택 가능합니다.
          </span>
          {renderSelectedChips()}
        </div>

        <div className="location-picker__actions">
          <div className="default_btn_white" onClick={handleReset}>
            <span className="location-picker__reset-icon">
              <img src={refresh_black} alt="" />
            </span>
            <span className="location-picker__reset-text">초기화</span>
          </div>
          <span className="default_btn_black" onClick={handleApply}>
            적용
          </span>
        </div>
      </div>

      {/* 모바일 */}
      <div className="location-picker location-picker--popup mobile">
        <span className="location-picker__options-note">
          ※ 지역 옵션은 최대 5개까지 선택 가능합니다.
        </span>
        <div className="location-picker__body">
          {renderLeftColumn()}
          {renderRightColumn()}
        </div>
      </div>
    </>
  );
}
