// src/pages/.../LocationSection/Form/M_LocationForm.tsx
import React, { useCallback, useMemo, useState } from 'react';
import '../LocationSection.css';
import data from '@/data/locationsV2.json';
import { toast } from 'react-toastify';
import Modal from '@/shared/components/modal/Modal';

import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import chevron_right_gray_light from '@/assets/icons/chevron_right_gray_light.png';
import ic_close_gray900_24 from '@/assets/icons/size24/ic_close_gray900_24.png';
import ic_close_gray500_20 from '@/assets/icons/size20/ic_close_gray500_20.png';
import ic_replay_gray900_20 from '@/assets/icons/size20/ic_replay_gray900_20.png';
import { Icons } from '@/assets/icons';

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

interface M_LocationFormProps {
  defaultValue: LocationValue;
  onChange: (v: LocationValue) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function M_LocationForm({
  defaultValue,
  onChange,
  onSave,
  onCancel,
}: M_LocationFormProps) {
  const regions = data as Region[];
  const NATIONWIDE_LABEL = '지역 전체';
  const MAX_SELECTED = 5;

  const [showResetModal, setShowResetModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [globalAllOnly, setGlobalAllOnly] = useState(defaultValue.nationwide);
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(
    () => new Set(defaultValue.selectedCodes)
  );

  const [activeRegionCode, setActiveRegionCode] = useState<string>(() => {
    const seoul = regions.find((r) => r.code === '11') ?? regions[0];
    return seoul ? seoul.code : '';
  });

  const activeRegion = useMemo(
    () => regions.find((r) => r.code === activeRegionCode),
    [regions, activeRegionCode]
  );

  const currentDistricts: District[] = useMemo(
    () => activeRegion?.children ?? [],
    [activeRegion]
  );

  const districtCodesOfRegion = (r: Region) => r.children.map((d) => d.code);

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

  const selectedCountByRegion = useMemo(() => {
    const m = new Map<string, number>();
    if (globalAllOnly) return m;

    selectedCodes.forEach((code) => {
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

  const toggleNationwideSelection = useCallback(() => {
    setGlobalAllOnly((prev) => {
      const next = !prev;
      if (next) setSelectedCodes(new Set());
      console.log('🧾 지역 선택(전국 토글):', {
        nationwide: next,
        selectedCodes: [],
      });
      return next;
    });
  }, []);

  const toggleRegionAllSelection = useCallback(() => {
    if (!activeRegion) return;

    if (globalAllOnly) {
      setGlobalAllOnly(false);
      const nextSet = new Set([activeRegion.code]);
      setSelectedCodes(nextSet);
      console.log('🧾 지역 선택(시/도 전체):', {
        nationwide: false,
        selectedCodes: Array.from(nextSet),
      });
      return;
    }

    if (anyRegionAllOn && !selectedCodes.has(activeRegion.code)) {
      const nextSet = new Set([activeRegion.code]);
      setSelectedCodes(nextSet);
      console.log('🧾 지역 선택(다른 시/도 전체 해제 후 선택):', {
        nationwide: false,
        selectedCodes: Array.from(nextSet),
      });
      return;
    }

    setSelectedCodes((prev) => {
      const next = new Set(prev);

      if (next.has(activeRegion.code)) {
        next.delete(activeRegion.code);
        console.log('🧾 지역 선택(시/도 전체 해제):', {
          nationwide: globalAllOnly,
          selectedCodes: Array.from(next),
        });
        return next;
      }

      const districtCodes = districtCodesOfRegion(activeRegion);
      const removed = districtCodes.filter((c) => next.has(c)).length;
      const newSize = next.size - removed + 1;

      if (newSize > MAX_SELECTED) {
        toast.success(`최대 ${MAX_SELECTED}개까지 추가 가능합니다.`, {
          toastId: 'limit',
        });
        return prev;
      }

      districtCodes.forEach((c) => next.delete(c));
      next.add(activeRegion.code);

      console.log('🧾 지역 선택(시/도 전체 선택):', {
        nationwide: globalAllOnly,
        selectedCodes: Array.from(next),
      });

      return next;
    });
  }, [activeRegion, globalAllOnly, anyRegionAllOn, selectedCodes]);

  const toggleDistrictSelection = useCallback(
    (districtCode: string) => {
      const regionCode = districtCode.split('-')[0];
      const region = regions.find((r) => r.code === regionCode);
      if (!region) return;

      if (globalAllOnly) {
        setGlobalAllOnly(false);
        const nextSet = new Set([districtCode]);
        setSelectedCodes(nextSet);
        console.log('🧾 지역 선택(전국 해제 후 구/군 선택):', {
          nationwide: false,
          selectedCodes: Array.from(nextSet),
        });
        return;
      }

      if (anyRegionAllOn) {
        const nextSet = new Set([districtCode]);
        setSelectedCodes(nextSet);
        console.log('🧾 지역 선택(시/도 전체 해제 후 구/군 선택):', {
          nationwide: false,
          selectedCodes: Array.from(nextSet),
        });
        return;
      }

      setSelectedCodes((prev) => {
        const next = new Set(prev);

        if (next.has(districtCode)) {
          next.delete(districtCode);
        } else {
          if (next.size + 1 > MAX_SELECTED) {
            toast.success(`최대 ${MAX_SELECTED}개까지 추가 가능합니다.`, {
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

        console.log('🧾 지역 선택(구/군 토글):', {
          nationwide: globalAllOnly,
          selectedCodes: Array.from(next),
        });

        return next;
      });
    },
    [regions, globalAllOnly, anyRegionAllOn]
  );

  const chips = useMemo(() => {
    if (globalAllOnly) {
      return [
        {
          key: 'NATIONWIDE',
          regionName: '전국',
          label: NATIONWIDE_LABEL,
        },
      ];
    }

    return Array.from(selectedCodes)
      .map((code) => {
        const region = regions.find((r) => r.code === code);
        if (region) {
          return {
            key: code,
            regionName: region.name.replace(' 전체', ''),
            label: region.name,
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
        };
      })
      .filter(Boolean) as Array<{
      key: string;
      regionName: string;
      label: string;
    }>;
  }, [globalAllOnly, selectedCodes, regions]);

  const removeChip = (key: string) => {
    if (key === 'NATIONWIDE') {
      setGlobalAllOnly(false);
      console.log('🧾 지역 선택(전국 칩 삭제):', {
        nationwide: false,
        selectedCodes: Array.from(selectedCodes),
      });
    } else {
      setSelectedCodes((prev) => {
        const next = new Set(prev);
        next.delete(key);
        console.log('🧾 지역 선택(칩 삭제):', {
          nationwide: globalAllOnly,
          selectedCodes: Array.from(next),
        });
        return next;
      });
    }
  };

  const hasAnySelection = () => {
    return globalAllOnly || selectedCodes.size > 0;
  };

  const handleClose = () => {
    if (hasAnySelection()) {
      setShowCancelModal(true);
    } else {
      onCancel();
    }
  };

  const handleSave = () => {
    if (selectedCodes.size === 0 && !globalAllOnly) {
      toast.error('1개 이상 선택해주세요.');
      return;
    }

    const payload: LocationValue = {
      nationwide: globalAllOnly,
      selectedCodes: Array.from(selectedCodes),
    };

    console.log('✅ 지역 선택 저장 값:', payload);

    onChange(payload);
    onSave();
  };

  const handleReset = () => {
    if (hasAnySelection()) {
      setShowResetModal(true);
    }
  };

  const confirmCancel = () => {
    setGlobalAllOnly(false);
    setSelectedCodes(new Set());
    const payload: LocationValue = { nationwide: false, selectedCodes: [] };
    console.log('🚫 지역 선택 취소(초기화):', payload);
    onChange(payload);
    setShowCancelModal(false);
    onCancel();
  };

  const confirmReset = () => {
    setGlobalAllOnly(false);
    setSelectedCodes(new Set());
    console.log('🗑️ 지역 선택 초기화 완료');
    setShowResetModal(false);
  };

  return (
    <>
      <header className="resume-create-form__header">
        <img
          src={ic_close_gray900_24}
          alt=""
          className="resume-create-form__close-icon"
          onClick={handleClose}
          style={{ cursor: 'pointer' }}
        />
        <span className="resume-create-form__title">희망 근무 지역</span>
        <span></span>
      </header>

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
              <img
                className="location-picker__checkbox"
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
                      className={`location-picker__category ${on ? 'on' : ''}`}
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
              <div className="location-picker__category-group">
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
                    <img
                      className="location-picker__checkbox"
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
                      className={`location-picker__role ${on ? 'on' : ''}`}
                      onClick={() => toggleDistrictSelection(d.code)}
                      role="button"
                      aria-pressed={on}
                      aria-disabled={globalAllOnly}
                    >
                      <img
                        className="location-picker__checkbox"
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

      <div className="resume-create-page__form-action">
        {(selectedCodes.size > 0 || globalAllOnly) && (
          <div className="resume-create-page__selected location">
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
                  onClick={() => removeChip(chip.key)}
                  role="button"
                  aria-label="선택 해제"
                >
                  <img src={ic_close_gray500_20} alt="" />
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="btn_wrap">
          <button className="btn-reset default_btn_white" onClick={handleReset}>
            <img src={ic_replay_gray900_20} alt="" /> 초기화
          </button>
          <button className="btn_w_full default_btn_black" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>

      <Modal
        open={showResetModal}
        title="입력된 내용을 전부 삭제하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="아니오"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={confirmReset}
        onClose={() => setShowResetModal(false)}
      />

      <Modal
        open={showCancelModal}
        title="수정사항을 저장하지 않고 취소하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="계속 작성"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={confirmCancel}
        onClose={() => setShowCancelModal(false)}
      />
    </>
  );
}