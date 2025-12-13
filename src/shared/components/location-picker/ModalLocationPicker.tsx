// src/shared/components/location-picker/ModalLocationPicker.tsx
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

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

type SelectedLocation = {
  code: string;         // "11-230" or "11"
  regionName: string;   // "서울"
  districtName: string; // "강남구" or "전체"
};

type ModalLocationPickerProps = {
  onApply?: (selected: SelectedLocation[]) => void;

  // ✅ 복원용
  initialSelected?: SelectedLocation[];
};

// JSON → Region[] 변환
const RAW_REGIONS = locationsData as RawRegionV2[];

const REGIONS: Region[] = RAW_REGIONS.map((r) => {
  const cityName = r.name.replace(/\s*전체$/, ""); // "서울 전체" -> "서울"
  return {
    key: r.code,
    name: cityName,
    all: r.name,
    districts: r.children.map((d) => ({
      key: d.code,
      name: d.name,
    })),
  };
});

const MAX_LOCATION_COUNT = 5;

export default function ModalLocationPicker({
  onApply,
  initialSelected = [],
}: ModalLocationPickerProps) {
  // ✅ 개별 구/군 선택
  const [checkedDistricts, setCheckedDistricts] = useState<Set<string>>(new Set());

  // ✅ “지역 전체” 선택은 1개만 허용
  const [allSelectedRegionKey, setAllSelectedRegionKey] = useState<string | null>(null);

  const [activeRegionKey, setActiveRegionKey] = useState<string | null>(
    REGIONS[0]?.key ?? null
  );

  const activeRegion =
    REGIONS.find((r) => r.key === activeRegionKey) ?? REGIONS[0] ?? null;

  const isOn = (key: string) => activeRegionKey === key;

  const toggleCategory = (key: string) => {
    setActiveRegionKey(key);
  };

  // ✅ 복원 로직 (모달 재오픈 시)
  useEffect(() => {
    if (!REGIONS.length) return;

    // 전체 선택이 있으면 그걸로 복원
    const allPick = initialSelected.find(
      (x) => x.districtName === "전체" || (!x.code.includes("-") && x.code.length === 2)
    );

    if (allPick) {
      const regionKey = allPick.code; // "11"
      setAllSelectedRegionKey(regionKey);
      setCheckedDistricts(new Set()); // 전체 선택이면 개별 비움
      setActiveRegionKey(regionKey);
      return;
    }

    // 개별 선택 복원
    const nextSet = new Set<string>();
    let firstRegionKey: string | null = null;

    for (const s of initialSelected) {
      if (s.code.includes("-")) {
        nextSet.add(s.code);
        if (!firstRegionKey) firstRegionKey = s.code.split("-")[0];
      }
    }

    setAllSelectedRegionKey(null);
    setCheckedDistricts(nextSet);
    setActiveRegionKey(firstRegionKey ?? REGIONS[0]?.key ?? null);
  }, [initialSelected]);

  // ✅ 현재 활성 지역이 “전체 선택” 상태인지
  const isAllCheckedForActiveRegion =
    !!activeRegion && allSelectedRegionKey === activeRegion.key;

  // ✅ 선택 개수(전체는 1개, 개별은 체크된 개수)
  const selectedCount = (allSelectedRegionKey ? 1 : 0) + checkedDistricts.size;

  const onClickAll = () => {
    if (!activeRegion) return;

    const regionKey = activeRegion.key;
    const isAlreadyOn = allSelectedRegionKey === regionKey;

    // 이미 전체 선택이면 해제
    if (isAlreadyOn) {
      setAllSelectedRegionKey(null);
      return;
    }

    // ✅ 최대 5개 제한 (전체도 1개)
    if (checkedDistricts.size >= MAX_LOCATION_COUNT) {
      toast("최대 5개까지 선택 가능합니다.");
      return;
    }

    // ✅ 전체 선택하면 개별 선택은 비움(서울 전체 칩 1개만 보이게)
    setCheckedDistricts(new Set());

    // ✅ 전체는 항상 1개만: 기존 전체 해제하고 현재만 선택
    setAllSelectedRegionKey(regionKey);
  };

  const onClickDistrict = (districtKey: string) => {
    // ✅ “서울 전체” 켜져 있는데 다른 지역(경기 등) 클릭하면 전체 해제
    if (allSelectedRegionKey) {
      setAllSelectedRegionKey(null);
    }

    const isAlreadyChecked = checkedDistricts.has(districtKey);

    // ✅ 새로 추가하려는 경우만 5개 제한
    if (!isAlreadyChecked && checkedDistricts.size >= MAX_LOCATION_COUNT) {
      toast("최대 5개까지 선택 가능합니다.");
      return;
    }

    setCheckedDistricts((prev) => {
      const next = new Set(prev);
      if (next.has(districtKey)) next.delete(districtKey);
      else next.add(districtKey);
      return next;
    });
  };

  const handleReset = () => {
    setAllSelectedRegionKey(null);
    setCheckedDistricts(new Set());
    setActiveRegionKey(REGIONS[0]?.key ?? null);
  };

  // ✅ 칩 데이터 (UI용 & onApply용)
  const selectedChips = useMemo(() => {
    // 1) 전체 선택이면 칩 1개만
    if (allSelectedRegionKey) {
      const r = REGIONS.find((x) => x.key === allSelectedRegionKey);
      if (!r) return [];
      return [
        {
          key: `all-${r.key}`,
          code: r.key,               // "11"
          regionName: r.name,        // "서울"
          districtName: "전체",      // payload
          displayLabel: r.all,       // "서울 전체"
          isAll: true as const,
        },
      ];
    }

    // 2) 개별 선택 칩들
    return REGIONS.flatMap((region) =>
      region.districts
        .filter((d) => checkedDistricts.has(d.key))
        .map((d) => ({
          key: d.key,                // "11-230"
          code: d.key,
          regionName: region.name,   // "서울"
          districtName: d.name,      // "강남구"
          displayLabel: d.name,
          isAll: false as const,
        }))
    );
  }, [allSelectedRegionKey, checkedDistricts]);

  const handleApply = () => {
    if (!onApply) return;

    onApply(
      selectedChips.map((chip) => ({
        code: chip.code,
        regionName: chip.regionName,
        districtName: chip.districtName,
      }))
    );
  };

  const renderLeftColumn = () => (
    <div className="location-picker__column location-picker__column--left">
      <div className="location-picker__category_group">
        {REGIONS.map((region) => {
          const countInRegion = region.districts.filter((d) =>
            checkedDistricts.has(d.key)
          ).length;

          const displayCount =
            allSelectedRegionKey === region.key ? 1 : countInRegion;

          return (
            <div
              key={region.key}
              className={`location-picker__category ${isOn(region.key) ? "on" : ""}`}
              onClick={() => toggleCategory(region.key)}
            >
              <div className="location-picker__category-meta">
                <span className="location-picker__category-title">{region.name}</span>
                <span className="location-picker__category-count">
                  {displayCount > 0 ? displayCount : ""}
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
            <span className="location-picker__role-label">{activeRegion.all}</span>
          </div>

          {/* 개별 구/군 */}
          {activeRegion.districts.map((d) => (
            <div
              key={d.key}
              className={`location-picker__role ${checkedDistricts.has(d.key) ? "on" : ""}`}
              onClick={() => onClickDistrict(d.key)}
            >
              <span className="location-picker__checkbox-wrap">
                <img
                  src={
                    checkedDistricts.has(d.key)
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
            {chip.isAll ? (
              // ✅ 전체 선택이면 "서울 전체" 단독 표시
              <span className="location-picker__chip-group">{chip.displayLabel}</span>
            ) : (
              <>
                <span className="location-picker__chip-group">{chip.regionName}</span>
                <span className="location-picker__chip-role">
                  <span className="location-picker__chip-chevron">
                    <img src={chevron_right_black} alt="" />
                  </span>
                  {chip.districtName}
                </span>
              </>
            )}
          </div>

          <span
            className="location-picker__chip-close"
            onClick={() => {
              if (chip.isAll) {
                setAllSelectedRegionKey(null);
              } else {
                onClickDistrict(chip.code);
              }
            }}
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
          ※ 지역 옵션은 최대 5개까지 선택 가능합니다. ({selectedCount}/{MAX_LOCATION_COUNT})
        </span>
        <div className="location-picker__body">
          {renderLeftColumn()}
          {renderRightColumn()}
        </div>
      </div>
    </>
  );
}
