import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import './LocationSection.css';
import data from '@/data/locationsV2.json';
import { toast } from 'react-toastify';


import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import chevron_right_gray_light from '@/assets/icons/chevron_right_gray_light.png';
import ic_close_gray500_20 from '@/assets/icons/size20/ic_close_gray500_20.png';
import { Icons } from '@/assets/icons';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 타입 정의
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type District = {
  code: string;
  name: string;
};

type Region = {
  code: string;
  name: string;
  children: District[];
};

export type LocationValue = {
  nationwide: boolean;
  selectedCodes: string[];
};

interface LocationSectionProps {
  defaultValue?: LocationValue;
  onChange: (v: LocationValue) => void;
  error?: string;
  isEdit?: boolean; // 🔥 추가: edit 모드 여부
}

export default function LocationSection({
  defaultValue = { nationwide: false, selectedCodes: [] },
  onChange,
  error,
  isEdit = false, // 🔥 기본값: create 모드
}: LocationSectionProps) {
  const regions = data as Region[];
  const NATIONWIDE_LABEL = '지역 전체';
  const MAX_SELECTED = 5;

  const [globalAllOnly, setGlobalAllOnly] = useState(defaultValue.nationwide);
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(
    () => new Set(defaultValue.selectedCodes)
  );

  // 초기 동기화 완료 플래그
  const didSyncRef = useRef(false);

  // 🔥 edit 모드일 때만, 서버에서 넘어온 defaultValue로 한 번만 동기화
  useEffect(() => {
    if (!isEdit) return;                 // create 모드는 여기 안 들어옴
    if (didSyncRef.current) return;

    const hasValue =
      defaultValue.nationwide ||
      (defaultValue.selectedCodes && defaultValue.selectedCodes.length > 0);

    if (!hasValue) return;

    console.log('✅ LocationSection(edit): defaultValue 동기화', defaultValue);
    setGlobalAllOnly(defaultValue.nationwide);
    setSelectedCodes(new Set(defaultValue.selectedCodes ?? []));
    didSyncRef.current = true;
  }, [isEdit, defaultValue.nationwide, defaultValue.selectedCodes]);

  const [activeRegionCode, setActiveRegionCode] = useState<string>(() => {
    const seoul = regions.find((r) => r.code === '11') ?? regions[0];
    return seoul ? seoul.code : '';
  });

  // 선택값 변경 → 부모로 전달
  useEffect(() => {
    onChange({
      nationwide: globalAllOnly,
      selectedCodes: Array.from(selectedCodes),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalAllOnly, selectedCodes]);

  const activeRegion = useMemo(
    () => regions.find((r) => r.code === activeRegionCode),
    [regions, activeRegionCode]
  );

  const currentDistricts: District[] = useMemo(
    () => activeRegion?.children ?? [],
    [activeRegion]
  );

  const isRegionAllSelected = useMemo(() => {
    if (globalAllOnly || !activeRegion) return false;

    if (selectedCodes.has(activeRegion.code)) return true;

    const districtCodes = currentDistricts.map((d) => d.code);
    return (
      districtCodes.length > 0 &&
      districtCodes.every((c) => selectedCodes.has(c))
    );
  }, [globalAllOnly, activeRegion, currentDistricts, selectedCodes]);

  const anyRegionAllOn = useMemo(
    () => regions.some((r) => selectedCodes.has(r.code)),
    [regions, selectedCodes]
  );

  const districtCodesOfRegion = (r: Region) => r.children.map((d) => d.code);

  const selectedCountByRegion = useMemo(() => {
    const m = new Map<string, number>();
    if (globalAllOnly) return m;

    selectedCodes.forEach((code) => {
      if (!code || typeof code !== 'string') return;

      const region = regions.find((r) => r.code === code);
      if (region) {
        m.set(region.code, region.children.length);
        return;
      }

      const regionCode = code.split('-')[0];
      m.set(regionCode, (m.get(regionCode) ?? 0) + 1);
    });

    return m;
  }, [selectedCodes, globalAllOnly, regions]);

  const toggleCategory = (code: string) => {
    setActiveRegionCode(code);
  };

  const toggleRegionAllSelection = useCallback(() => {
    if (!activeRegion) return;

    if (globalAllOnly) {
      setGlobalAllOnly(false);
      setSelectedCodes(new Set([activeRegion.code]));
      return;
    }

    if (anyRegionAllOn && !selectedCodes.has(activeRegion.code)) {
      setSelectedCodes(new Set([activeRegion.code]));
      return;
    }

    setSelectedCodes((prev) => {
      const next = new Set(prev);

      if (next.has(activeRegion.code)) {
        next.delete(activeRegion.code);
        return next;
      }

      const districtCodes = districtCodesOfRegion(activeRegion);
      const removed = districtCodes.filter((c) => next.has(c)).length;
      const newSize = next.size - removed + 1;

      if (newSize > MAX_SELECTED) {
        toast.success(`최대 ${MAX_SELECTED}개까지 선택가능합니다.`, {
          toastId: 'limit',
        });
        return prev;
      }

      districtCodes.forEach((c) => next.delete(c));
      next.add(activeRegion.code);
      return next;
    });
  }, [activeRegion, globalAllOnly, anyRegionAllOn, selectedCodes, MAX_SELECTED]);

  const toggleDistrictSelection = useCallback(
    (districtCode: string) => {
      if (!districtCode || typeof districtCode !== 'string') return;

      const regionCode = districtCode.split('-')[0];
      const region = regions.find((r) => r.code === regionCode);
      if (!region) return;

      if (globalAllOnly) {
        setGlobalAllOnly(false);
        setSelectedCodes(new Set([districtCode]));
        return;
      }

      if (anyRegionAllOn) {
        setSelectedCodes(new Set([districtCode]));
        return;
      }

      setSelectedCodes((prev) => {
        const next = new Set(prev);

        if (next.has(districtCode)) {
          next.delete(districtCode);
        } else {
          if (next.size + 1 > MAX_SELECTED) {
            toast.success(`최대 ${MAX_SELECTED}개까지 선택가능합니다.`, {
              toastId: 'limit',
            });
            return prev;
          }
          next.add(districtCode);
        }

        const districtCodes = districtCodesOfRegion(region);
        const allSelected =
          districtCodes.length > 0 &&
          districtCodes.every((c) => next.has(c));

        if (allSelected) {
          districtCodes.forEach((c) => next.delete(c));
          next.add(region.code);
        }

        return next;
      });
    },
    [regions, globalAllOnly, anyRegionAllOn, MAX_SELECTED]
  );

  const toggleNationwideSelection = useCallback(() => {
    setGlobalAllOnly((prev) => {
      const next = !prev;
      if (next) setSelectedCodes(new Set());
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

    return Array.from(selectedCodes)
      .filter(code => code && typeof code === 'string')
      .map((code) => {
        const region = regions.find((r) => r.code === code);
        if (region) {
          return {
            key: code,
            regionName: region.name.replace(' 전체', ''),
            label: region.name,
            remove: () =>
              setSelectedCodes((prev) => {
                const next = new Set(prev);
                next.delete(code);
                return next;
              }),
          };
        }

        const regionCode = code.split('-')[0];
        const parentRegion = regions.find((r) => r.code === regionCode);
        const district = parentRegion?.children.find((d) => d.code === code);

        if (!district || !parentRegion) return null;

        return {
          key: code,
          regionName: parentRegion.name.replace(' 전체', ''),
          label: district.name,
          remove: () =>
            setSelectedCodes((prev) => {
              const next = new Set(prev);
              next.delete(code);
              return next;
            }),
        };
      })
      .filter(Boolean) as Array<{
      key: string;
      regionName: string;
      label: string;
      remove: () => void;
    }>;
  }, [globalAllOnly, selectedCodes, regions, NATIONWIDE_LABEL]);

  return (
    <div className="resume-create-page__section resume-create-page__section--location">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          희망 근무 지역 <em className="resume-create-page__required">*</em>
        </div>
        <span className="resume-create-page__hint">
          최대 {MAX_SELECTED}개까지 추가 가능합니다.
        </span>
        {error && (
          <span className="resume-create-page__error">{error}</span>
        )}
      </div>

      {(selectedCodes.size > 0 || globalAllOnly) && (
        <div className="resume-create-page__selected">
          {chips.map((chip) => (
            <div key={chip.key} className="location-picker__chip">
              <div className="location-picker__chip-body">
                <span className="location-picker__chip-group">
                  {chip.regionName}
                </span>
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
      )}

      <div className="resume-create-page__location">
        <div className="location-picker">
          <div className="location-picker__header">
            <div
              className={`location-picker__role total ${
                globalAllOnly ? 'on' : ''
              }`}
              onClick={toggleNationwideSelection}
              role="button"
              aria-pressed={globalAllOnly}
            >
             
              <img className="location-picker__checkbox"
                  src={
                    globalAllOnly
                      ? Icons.ic_check_box_purple24
                      : Icons.ic_check_box_blank_gray400_24
                  }
                  alt=""
                />
         
              <span className="location-picker__option-label">
                {NATIONWIDE_LABEL}
              </span>
            </div>
          </div>

          <div className="location-picker__body">
            <div
              className={`location-picker__column location-picker__column--left ${
                globalAllOnly ? 'disabled' : ''
              }`}
            >
              <div className="location-picker__category-group">
                {regions.map((r) => {
                  const on = activeRegionCode === r.code;
                  const count = selectedCountByRegion.get(r.code) ?? 0;

                  return (
                    <div
                      key={r.code}
                      className={`location-picker__category ${
                        on ? 'on' : ''
                      }`}
                      onClick={() => toggleCategory(r.code)}
                      role="button"
                      aria-pressed={on}
                      aria-disabled={globalAllOnly}
                    >
                      <div className="location-picker__category-meta">
                        <span className="location-picker__category-title">
                          {r.name.replace(' 전체', '')}
                        </span>
                        {count > 0 && (
                          <span className="location-picker__category-count">
                            {count}
                          </span>
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

            <div
              className={`location-picker__column location-picker__column--right ${
                globalAllOnly ? 'disabled' : ''
              }`}
            >
              <div className="location-picker__category-group location-picker__group--right">
                {activeRegion && (
                  <div
                    className={`location-picker__role location-picker__option--all ${
                      isRegionAllSelected ? 'on' : ''
                    }`}
                    onClick={toggleRegionAllSelection}
                    role="button"
                    aria-pressed={isRegionAllSelected}
                    aria-disabled={globalAllOnly}
                  >
              
                      <img className="location-picker__checkbox"
                        src={
                          isRegionAllSelected
                          ? Icons.ic_check_box_purple24
                          : Icons.ic_check_box_blank_gray400_24
                        }
                        alt=""
                      />
                   
                    <span className="location-picker__option-label">
                      {activeRegion.name}
                    </span>
                  </div>
                )}

                {currentDistricts.map((d) => {
                  const on = selectedCodes.has(d.code);
                  return (
                    <div
                      key={d.code}
                      className={`location-picker__role ${
                        on ? 'on' : ''
                      }`}
                      onClick={() => toggleDistrictSelection(d.code)}
                      role="button"
                      aria-pressed={on}
                      aria-disabled={globalAllOnly}
                    >
                   
                        <img className="location-picker__checkbox"
                          src={
                            on
                            ? Icons.ic_check_box_purple24
                            : Icons.ic_check_box_blank_gray400_24
                          }
                          alt=""
                        />
                
                      <span className="location-picker__option-label">
                        {d.name}
                      </span>
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
