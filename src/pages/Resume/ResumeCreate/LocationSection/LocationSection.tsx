import React, { useCallback, useMemo, useState, useEffect } from 'react';
import './LocationSection.css';
import data from '@/data/locations.json';
import { toast } from 'react-toastify';

import check_box_purple from '@/assets/icons/size24/ic_check_box_purple24.png';
import check_box_outline_blank_gray from '@/assets/icons/size24/ic_check_box_blank_gray400_24.png';
import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import chevron_right_gray_light from '@/assets/icons/chevron_right_gray_light.png';
import ic_close_gray500_20 from '@/assets/icons/size20/ic_close_gray500_20.png';

type District = { id?: string; name: string };
type Region = {
  id?: string;
  name: string;
  all?: string | { id?: string; label: string };
  districts: (string | District)[];
};

export type LocationValue = {
  nationwide: boolean;
  selectedKeys: string[]; // "RegionName|DistrictName" or "RegionName|ALL"
};

interface LocationSectionProps {
  defaultValue?: LocationValue;
  onChange: (v: LocationValue) => void;
}

const regionKeyOf = (r: Region) => r.id ?? r.name;
const districtKeyOf = (r: Region, d: District) => d.id ?? `${r.name}|${d.name}`;
const regionAllKeyOf = (r: Region) => `${regionKeyOf(r)}|ALL`;

export default function LocationSection({ 
  defaultValue = { nationwide: false, selectedKeys: [] },
  onChange 
}: LocationSectionProps) {
  const { regions } = data as unknown as { regions: Region[] };
  const NATIONWIDE_LABEL =
    (data as unknown as { nationwide?: { label: string } }).nationwide?.label ?? '지역 전체';
  const MAX_SELECTED = 5;

  const [globalAllOnly, setGlobalAllOnly] = useState(defaultValue.nationwide);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(defaultValue.selectedKeys));

  const [activeRegionKey, setActiveRegionKey] = useState<string>(() => {
    const seoul = regions.find(r => r.name === '서울') ?? regions[0];
    return seoul ? regionKeyOf(seoul) : '';
  });

  // ✨ 선택값이 변경될 때마다 부모에게 전달
  useEffect(() => {
    onChange({ nationwide: globalAllOnly, selectedKeys: Array.from(selected) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalAllOnly, selected]); // onChange는 의존성에서 제외 (무한 루프 방지)

  const activeRegion = useMemo(
    () => regions.find(r => regionKeyOf(r) === activeRegionKey),
    [regions, activeRegionKey]
  );

  const currentDistricts: District[] = useMemo(
    () => (activeRegion?.districts ?? []).map((d): District => (typeof d === 'string' ? { name: d } : d)),
    [activeRegion]
  );

  const isRegionAllSelected = useMemo(() => {
    if (globalAllOnly || !activeRegion) return false;
    const allKey = regionAllKeyOf(activeRegion);
    if (selected.has(allKey)) return true;
    const dKeys = currentDistricts.map(d => districtKeyOf(activeRegion, d));
    return dKeys.length > 0 && dKeys.every(k => selected.has(k));
  }, [globalAllOnly, activeRegion, currentDistricts, selected]);

  const anyRegionAllOn = useMemo(
    () => Array.from(selected).some(k => k.endsWith('|ALL')),
    [selected]
  );

  const districtKeysOfRegion = (r: Region) =>
    (r.districts ?? []).map(d => districtKeyOf(r, typeof d === 'string' ? { name: d } : d));

  const selectedCountByRegion = useMemo(() => {
    const m = new Map<string, number>();
    if (globalAllOnly) return m;
    selected.forEach(k => {
      const [rName] = k.split('|');
      m.set(rName, (m.get(rName) ?? 0) + 1);
    });
    return m;
  }, [selected, globalAllOnly]);

  const toggleCategory = (key: string) => {
    setActiveRegionKey(key);
  };

  const toggleRegionAllSelection = useCallback(() => {
    if (!activeRegion) return;
    const allKey = regionAllKeyOf(activeRegion);

    if (globalAllOnly) {
      setGlobalAllOnly(false);
      setSelected(new Set([allKey]));
      return;
    }
    if (anyRegionAllOn && !selected.has(allKey)) {
      setSelected(new Set([allKey]));
      return;
    }
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(allKey)) {
        next.delete(allKey);
        return next;
      }
      const rDKeys = districtKeysOfRegion(activeRegion);
      const removed = rDKeys.filter(k => next.has(k)).length;
      const newSize = next.size - removed + 1;
      if (newSize > MAX_SELECTED) {
        toast.success(`최대 ${MAX_SELECTED}개까지 선택가능합니다.`, { toastId: 'limit' });
        return prev;
      }
      rDKeys.forEach(k => next.delete(k));
      next.add(allKey);
      return next;
    });
  }, [activeRegion, globalAllOnly, anyRegionAllOn, selected, MAX_SELECTED]);

  const toggleDistrictSelection = useCallback((dKey: string) => {
    const [rName] = dKey.split('|');
    const region = regions.find(r => r.name === rName || regionKeyOf(r) === rName);
    if (!region) return;

    if (globalAllOnly) {
      setGlobalAllOnly(false);
      setSelected(new Set([dKey]));
      return;
    }
    if (anyRegionAllOn) {
      setSelected(new Set([dKey]));
      return;
    }
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(dKey)) {
        next.delete(dKey);
      } else {
        if (next.size + 1 > MAX_SELECTED) {
          toast.success(`최대 ${MAX_SELECTED}개까지 선택가능합니다.`, { toastId: 'limit' });
          return prev;
        }
        next.add(dKey);
      }
      const rDKeys = districtKeysOfRegion(region);
      const allSelected = rDKeys.length > 0 && rDKeys.every(k => next.has(k));
      if (allSelected) {
        rDKeys.forEach(k => next.delete(k));
        next.add(regionAllKeyOf(region));
      }
      return next;
    });
  }, [regions, globalAllOnly, anyRegionAllOn, MAX_SELECTED]);

  const toggleNationwideSelection = useCallback(() => {
    setGlobalAllOnly(prev => {
      const next = !prev;
      if (next) setSelected(new Set());
      return next;
    });
  }, []);

  const chips = useMemo(() => {
    if (globalAllOnly) {
      return [
        {
          key: 'NATIONWIDE',
          regionName: '전국',
          label: NATIONWIDE_LABEL,
          remove: () => setGlobalAllOnly(false),
        },
      ];
    }
    return Array.from(selected).map(key => {
      const [regionName, tail] = key.split('|');
      const label = tail === 'ALL' ? `${regionName} 전체` : tail;
      return {
        key,
        regionName,
        label,
        remove: () =>
          setSelected(prev => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          }),
      };
    });
  }, [globalAllOnly, selected, NATIONWIDE_LABEL]);

  return (
    <div className="resume-create-page__section resume-create-page__section--location">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          희망 근무 지역 <em className="resume-create-page__required">*</em>
        </div>
        <span className="resume-create-page__hint">
          최대 {MAX_SELECTED}개까지 추가 가능합니다.
        </span>
        {selected.size === 0 && !globalAllOnly ? <span className="resume-create-page__error">1개 이상 추가해 주세요.</span> : <></>}
      </div>

      {selected.size > 0 || globalAllOnly ? (
        <div className="resume-create-page__selected">
          {chips.map(chip => (
            <div key={chip.key} className="location-picker__chip">
              <div className="location-picker__chip-body">
                <span className="location-picker__chip-group">{chip.regionName}</span>
                <span className="location-picker__chip-role">
                  <span className="location-picker__chip-chevron">
                    <img src={chevron_right_black} alt="" />
                  </span>
                  {chip.label}
                </span>
              </div>
              <span
                className="location-picker__chip-close"
                onClick={chip.remove}
                role="button"
                aria-label="선택 해제"
              >
                <img src={ic_close_gray500_20} alt="" />
              </span>
            </div>
          ))}
        </div>
      ) : <></>}

      <div className="resume-create-page__location">
        <div className="location-picker">
          <div className="location-picker__header">
            <div
              className={`location-picker__role total ${globalAllOnly ? 'on' : ''}`}
              onClick={toggleNationwideSelection}
              role="button"
              aria-pressed={globalAllOnly}
            >
              <span className="location-picker__checkbox">
                <img src={globalAllOnly ? check_box_purple : check_box_outline_blank_gray} alt="" />
              </span>
              <span className="location-picker__option-label">{NATIONWIDE_LABEL}</span>
            </div>
          </div>

          <div className="location-picker__body">
            <div className={`location-picker__column location-picker__column--left ${globalAllOnly ? 'disabled' : ''}`}>
              <div className="location-picker__category-group">
                {regions.map(r => {
                  const key = regionKeyOf(r);
                  const on = activeRegionKey === key;
                  const count = selectedCountByRegion.get(r.name) ?? 0;

                  return (
                    <div
                      key={key}
                      className={`location-picker__category ${on ? 'on' : ''}`}
                      onClick={() => toggleCategory(key)}
                      role="button"
                      aria-pressed={on}
                      aria-disabled={globalAllOnly}
                    >
                      <div className="location-picker__category-meta">
                        <span className="location-picker__category-title">{r.name}</span>
                        {count > 0 && (
                          <span className="location-picker__category-count">{count}</span>
                        )}
                      </div>
                      <span className="location-picker__category-toggle">
                        <img src={chevron_right_gray_light} alt="" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`location-picker__column location-picker__column--right ${globalAllOnly ? 'disabled' : ''}`}>
              <div className="location-picker__category-group location-picker__group--right">
                {activeRegion?.all && (
                  <div
                    className={`location-picker__role location-picker__option--all ${isRegionAllSelected ? 'on' : ''}`}
                    onClick={toggleRegionAllSelection}
                    role="button"
                    aria-pressed={isRegionAllSelected}
                    aria-disabled={globalAllOnly}
                  >
                    <span className="location-picker__checkbox">
                      <img src={isRegionAllSelected ? check_box_purple : check_box_outline_blank_gray} alt="" />
                    </span>
                    <span className="location-picker__option-label">
                      {typeof activeRegion.all === 'string' ? activeRegion.all : activeRegion.all?.label}
                    </span>
                  </div>
                )}

                {currentDistricts.map(d => {
                  const dKey = districtKeyOf(activeRegion!, d);
                  const on = selected.has(dKey);
                  return (
                    <div
                      key={dKey}
                      className={`location-picker__role ${on ? 'on' : ''}`}
                      onClick={() => toggleDistrictSelection(dKey)}
                      role="button"
                      aria-pressed={on}
                      aria-disabled={globalAllOnly}
                    >
                      <span className="location-picker__checkbox">
                        <img src={on ? check_box_purple : check_box_outline_blank_gray} alt="" />
                      </span>
                      <span className="location-picker__option-label">{d.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}