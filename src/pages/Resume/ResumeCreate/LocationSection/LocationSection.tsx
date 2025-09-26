import React, { useMemo, useState } from 'react';
import './LocationSection.css';
import data from '@/data/locations.json';
import { toast } from 'react-toastify';

import check_box_purple from '@/assets/icons/size24/ic_check_box_purple24.png';
import check_box_outline_blank_gray from '@/assets/icons/size24/ic_check_box_blank_gray400_24.png';
import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import chevron_right_gray_light from '@/assets/icons/chevron_right_gray_light.png';
import close_gray from '@/assets/icons/close_gray.png';

type District = { id?: string; name: string };
type Region = {
  id?: string;
  name: string;
  all?: string | { id?: string; label: string };
  districts: (string | District)[];
};

const regionKeyOf = (r: Region) => r.id ?? r.name;
const districtKeyOf = (r: Region, d: District) => d.id ?? `${r.name}|${d.name}`;
const regionAllKeyOf = (r: Region) => `${regionKeyOf(r)}|ALL`;

export default function LocationSection() {
  const { regions } = data as unknown as { regions: Region[] };
  const NATIONWIDE_LABEL =
    (data as unknown as { nationwide?: { label: string } }).nationwide?.label ?? '지역 전체';
  const MAX_SELECTED = 5;

  const [globalAllOnly, setGlobalAllOnly] = useState(false); // 전국 모드
  const [activeRegionKey, setActiveRegionKey] = useState<string>(() => {
    const seoul = regions.find(r => r.name === '서울') ?? regions[0];
    return seoul ? regionKeyOf(seoul) : '';
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
    if (selected.has(allKey)) return true; // |ALL 직접 선택된 경우 우선
    const dKeys = currentDistricts.map(d => districtKeyOf(activeRegion, d));
    return dKeys.length > 0 && dKeys.every(k => selected.has(k));
  }, [globalAllOnly, activeRegion, currentDistricts, selected]);

  const anyRegionAllOn = useMemo(
    () => Array.from(selected).some(k => k.endsWith('|ALL')),
    [selected]
  );

  const districtKeysOfRegion = (r: Region) =>
    (r.districts ?? []).map(d => districtKeyOf(r, typeof d === 'string' ? { name: d } : d));

  // 좌측 리스트에 표시할 “지역별 선택 개수” 집계
  const selectedCountByRegion = useMemo(() => {
    const m = new Map<string, number>();
    if (globalAllOnly) return m; // 전국 모드면 개별 카운트는 0으로
    selected.forEach(k => {
      const [rName] = k.split('|'); // "서울|강남구" or "서울|ALL"
      m.set(rName, (m.get(rName) ?? 0) + 1);
    });
    return m;
  }, [selected, globalAllOnly]);

  // 좌측 지역 전환
  const toggleCategory = (key: string) => {
    setActiveRegionKey(key);
  };

  // 현재 지역 '전체' 클릭
  const toggleRegionAllSelection = () => {
    if (!activeRegion) return;
    const allKey = regionAllKeyOf(activeRegion);

    // 전국 모드였다면 전국 해제하고 현재 지역 전체만 선택
    if (globalAllOnly) {
      setGlobalAllOnly(false);
      setSelected(new Set([allKey]));
      return;
    }
    // 다른 지역의 ALL이 켜져 있으면 전부 해제하고 현재 지역 ALL만 선택
    if (anyRegionAllOn && !selected.has(allKey)) {
      setSelected(new Set([allKey]));
      return;
    }
    // 일반 토글
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(allKey)) {
        next.delete(allKey);
        return next;
      }
      // 개별 선택 제거 + ALL 1개로 대체 (5개 제한 체크)
      const rDKeys = districtKeysOfRegion(activeRegion);
      const removed = rDKeys.filter(k => next.has(k)).length;
      const newSize = next.size - removed + 1;
      if (newSize > MAX_SELECTED) {
        toast.success('최대 5개까지 선택가능합니다.', { toastId: 'limit' });
        return prev;
      }
      rDKeys.forEach(k => next.delete(k));
      next.add(allKey);
      return next;
    });
  };

  // 개별 시/군/구 클릭
  const toggleDistrictSelection = (dKey: string) => {
    const [rName] = dKey.split('|');
    const region = regions.find(r => r.name === rName || regionKeyOf(r) === rName);
    if (!region) return;

    // 전국 모드였다면 전국 해제 + 지금 클릭한 것만 선택
    if (globalAllOnly) {
      setGlobalAllOnly(false);
      setSelected(new Set([dKey]));
      return;
    }
    // 어떤 지역-전체가 켜져 있으면 전부 해제하고 지금 것만 선택
    if (anyRegionAllOn) {
      setSelected(new Set([dKey]));
      return;
    }
    // 일반 토글 (+ 5개 제한)
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(dKey)) {
        next.delete(dKey);
      } else {
        if (next.size + 1 > MAX_SELECTED) {
          toast.success('최대 5개까지 선택가능합니다.', { toastId: 'limit' });
          return prev;
        }
        next.add(dKey);
      }
      // 이 지역의 시군구가 모두 선택되면 자동으로 “지역 전체”로 압축
      const rDKeys = districtKeysOfRegion(region);
      const allSelected = rDKeys.length > 0 && rDKeys.every(k => next.has(k));
      if (allSelected) {
        rDKeys.forEach(k => next.delete(k));
        next.add(regionAllKeyOf(region));
      }
      return next;
    });
  };

  // 전국 토글
  const toggleNationwideSelection = () => {
    setGlobalAllOnly(prev => {
      const next = !prev;
      if (next) setSelected(new Set()); // 전국 켜질 때는 모두 해제
      return next;
    });
  };

  // 칩 표시
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
        {selected.size>0?<></>: <span className="resume-create-page__error">1개 이상 추가해 주세요.</span>}
      </div>

      {/* 선택 칩 */}
      {selected.size>0?<div className="resume-create-page__selected">
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
              <img src={close_gray} alt="" />
            </span>
          </div>
        ))}
      </div>:<></>} 

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
            {/* 왼쪽: 지역 목록 */}
            <div className={`location-picker__column location-picker__column--left ${globalAllOnly ? 'disabled' : ''}`}>
              <div className="location-picker__category-group">
                {regions.map(r => {
                  const key = regionKeyOf(r);
                  const on = activeRegionKey === key;
                  const count = selectedCountByRegion.get(r.name) ?? 0; // ★ 선택 개수 표시

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

            {/* 오른쪽: 현재 지역의 전체/시군구 */}
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
