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

type District = {
  key: string;
  name: string;
};

type Region = {
  key: string;
  name: string;
  all: string;
  districts: District[];
};

type RawRegionV2 = {
  code: string;
  name: string;
  children: {
    code: string;
    name: string;
  }[];
};

export type SelectedLocation = {
  code: string;
  regionName: string;
  districtName: string;
};

type ModalLocationPickerProps = {
  onApply?: (selected: SelectedLocation[]) => void;
  onChange?: (selected: SelectedLocation[]) => void;
  initialSelected?: SelectedLocation[];
};

const RAW_REGIONS = locationsData as RawRegionV2[];

const REGIONS: Region[] = RAW_REGIONS.map((r) => {
  const cityName = r.name.replace(/\s*전체$/, "");
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

const areSetsEqual = (a: Set<string>, b: Set<string>) => {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
};

export default function ModalLocationPicker({
  onApply,
  onChange,
  initialSelected = [],
}: ModalLocationPickerProps) {
  const [checkedDistricts, setCheckedDistricts] = useState<Set<string>>(new Set());
  const [allSelectedRegionKey, setAllSelectedRegionKey] = useState<string | null>(null);
  const [activeRegionKey, setActiveRegionKey] = useState<string | null>(REGIONS[0]?.key ?? null);

  const initialSelectedKey = useMemo(() => {
    return (initialSelected ?? [])
      .map((x) => `${x.code}|${x.regionName}|${x.districtName}`)
      .sort()
      .join("||");
  }, [initialSelected]);

  const activeRegion = REGIONS.find((r) => r.key === activeRegionKey) ?? REGIONS[0] ?? null;

  const isOn = (key: string) => activeRegionKey === key;

  const toggleCategory = (key: string) => {
    setActiveRegionKey(key);
  };

  useEffect(() => {
    if (!REGIONS.length) return;

    const allPick = initialSelected.find(
      (x) => x.districtName === "전체" || (!x.code.includes("-") && x.code.length === 2)
    );

    if (allPick) {
      const regionKey = allPick.code;
      setAllSelectedRegionKey((prev) => (prev === regionKey ? prev : regionKey));
      setCheckedDistricts((prev) => (prev.size === 0 ? prev : new Set()));
      setActiveRegionKey((prev) => (prev === regionKey ? prev : regionKey));
      return;
    }

    const nextSet = new Set<string>();
    let firstRegionKey: string | null = null;

    for (const s of initialSelected) {
      if (s.code.includes("-")) {
        nextSet.add(s.code);
        if (!firstRegionKey) firstRegionKey = s.code.split("-")[0];
      }
    }

    setAllSelectedRegionKey((prev) => (prev === null ? prev : null));
    setCheckedDistricts((prev) => (areSetsEqual(prev, nextSet) ? prev : nextSet));

    const nextActive = firstRegionKey ?? REGIONS[0]?.key ?? null;
    setActiveRegionKey((prev) => (prev === nextActive ? prev : nextActive));
  }, [initialSelectedKey]);

  const isAllCheckedForActiveRegion = !!activeRegion && allSelectedRegionKey === activeRegion.key;

  const selectedCount = (allSelectedRegionKey ? 1 : 0) + checkedDistricts.size;

  const selectedChips = useMemo(() => {
    if (allSelectedRegionKey) {
      const r = REGIONS.find((x) => x.key === allSelectedRegionKey);
      if (!r) return [];
      return [
        {
          key: `all-${r.key}`,
          code: r.key,
          regionName: r.name,
          districtName: "전체",
          displayLabel: r.all,
          isAll: true as const,
        },
      ];
    }

    return REGIONS.flatMap((region) =>
      region.districts
        .filter((d) => checkedDistricts.has(d.key))
        .map((d) => ({
          key: d.key,
          code: d.key,
          regionName: region.name,
          districtName: d.name,
          displayLabel: d.name,
          isAll: false as const,
        }))
    );
  }, [allSelectedRegionKey, checkedDistricts]);

  const emitChange = (nextAllKey: string | null, nextDistricts: Set<string>) => {
    if (!onChange) return;

    if (nextAllKey) {
      const r = REGIONS.find((x) => x.key === nextAllKey);
      if (!r) return;
      onChange([
        {
          code: r.key,
          regionName: r.name,
          districtName: "전체",
        },
      ]);
      return;
    }

    const next = REGIONS.flatMap((region) =>
      region.districts
        .filter((d) => nextDistricts.has(d.key))
        .map((d) => ({
          code: d.key,
          regionName: region.name,
          districtName: d.name,
        }))
    );

    onChange(next);
  };

  const onClickAll = () => {
    if (!activeRegion) return;

    const regionKey = activeRegion.key;
    const isAlreadyOn = allSelectedRegionKey === regionKey;

    if (isAlreadyOn) {
      setAllSelectedRegionKey(null);
      emitChange(null, checkedDistricts);
      return;
    }

    if (checkedDistricts.size >= MAX_LOCATION_COUNT) {
      toast("최대 5개까지 선택 가능합니다.");
      return;
    }

    const nextDistricts = new Set<string>();
    setCheckedDistricts(nextDistricts);
    setAllSelectedRegionKey(regionKey);
    emitChange(regionKey, nextDistricts);
  };

  const onClickDistrict = (districtKey: string) => {
    const nextAllKey = null;

    const nextDistricts = new Set(checkedDistricts);
    const isAlreadyChecked = nextDistricts.has(districtKey);

    if (!isAlreadyChecked && nextDistricts.size >= MAX_LOCATION_COUNT) {
      toast("최대 5개까지 선택 가능합니다.");
      return;
    }

    if (isAlreadyChecked) nextDistricts.delete(districtKey);
    else nextDistricts.add(districtKey);

    setAllSelectedRegionKey(nextAllKey);
    setCheckedDistricts(nextDistricts);
    emitChange(nextAllKey, nextDistricts);
  };

  const handleReset = () => {
    const nextAllKey = null;
    const nextDistricts = new Set<string>();
    setAllSelectedRegionKey(nextAllKey);
    setCheckedDistricts(nextDistricts);
    setActiveRegionKey(REGIONS[0]?.key ?? null);
    emitChange(nextAllKey, nextDistricts);
  };

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
          const countInRegion = region.districts.filter((d) => checkedDistricts.has(d.key)).length;
          const displayCount = allSelectedRegionKey === region.key ? 1 : countInRegion;

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
          <div
            className={`location-picker__role location-picker__role--all ${
              isAllCheckedForActiveRegion ? "on" : ""
            }`}
            onClick={onClickAll}
          >
            <span className="location-picker__checkbox-wrap">
              <img
                src={isAllCheckedForActiveRegion ? check_box_purple : check_box_outline_blank_gray}
                alt=""
              />
            </span>
            <span className="location-picker__role-label">{activeRegion.all}</span>
          </div>

          {activeRegion.districts.map((d) => (
            <div
              key={d.key}
              className={`location-picker__role ${checkedDistricts.has(d.key) ? "on" : ""}`}
              onClick={() => onClickDistrict(d.key)}
            >
              <span className="location-picker__checkbox-wrap">
                <img
                  src={checkedDistricts.has(d.key) ? check_box_purple : check_box_outline_blank_gray}
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
                const nextAllKey = null;
                const nextDistricts = new Set<string>();
                setAllSelectedRegionKey(nextAllKey);
                setCheckedDistricts(nextDistricts);
                emitChange(nextAllKey, nextDistricts);
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
      <div className="location-picker location-picker--popup">
        <div className="location-picker__body">
          {renderLeftColumn()}
          {renderRightColumn()}
        </div>

        <div className="location-picker__options">
          <span className="location-picker__options-note">※ 옵션은 최대 5개까지 선택 가능합니다.</span>
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
