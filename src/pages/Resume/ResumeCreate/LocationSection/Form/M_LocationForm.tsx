// src/pages/.../LocationSection/Form/M_LocationForm.tsx
import React, { useCallback, useMemo, useState } from 'react';
import '../LocationSection.css';
import data from '@/data/locations.json';
import { toast } from 'react-toastify';
import Modal from "@/shared/components/modal/Modal";

import check_box_purple from '@/assets/icons/size24/ic_check_box_purple24.png';
import check_box_outline_blank_gray from '@/assets/icons/size24/ic_check_box_blank_gray400_24.png';
import chevron_right_black from '@/assets/icons/chevron_right_black.png';
import chevron_right_gray_light from '@/assets/icons/chevron_right_gray_light.png';
import ic_close_gray900_24 from '@/assets/icons/size24/ic_close_gray900_24.png';
import ic_close_gray500_20 from '@/assets/icons/size20/ic_close_gray500_20.png';
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";

type District = { id?: string; name: string };
type Region = {
  id?: string;
  name: string;
  all?: string | { id?: string; label: string };
  districts: (string | District)[];
};

export type LocationValue = {
  nationwide: boolean;
  selectedKeys: string[];
};

interface M_LocationFormProps {
  defaultValue: LocationValue;
  onChange: (v: LocationValue) => void;
  onSave: () => void;
  onCancel: () => void;
  
}

const regionKeyOf = (r: Region) => r.id ?? r.name;
const districtKeyOf = (r: Region, d: District) => d.id ?? `${r.name}|${d.name}`;
const regionAllKeyOf = (r: Region) => `${regionKeyOf(r)}|ALL`;

export default function M_LocationForm({ 
  defaultValue, 
  onChange,
  onSave,
  onCancel 
}: M_LocationFormProps) {
  const { regions } = data as unknown as { regions: Region[] };
  const NATIONWIDE_LABEL =
    (data as unknown as { nationwide?: { label: string } }).nationwide?.label ?? '지역 전체';
  const MAX_SELECTED = 5;
  
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [globalAllOnly, setGlobalAllOnly] = useState(defaultValue.nationwide);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(defaultValue.selectedKeys));

  const [activeRegionKey, setActiveRegionKey] = useState<string>(() => {
    const seoul = regions.find(r => r.name === '서울') ?? regions[0];
    return seoul ? regionKeyOf(seoul) : '';
  });

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

  // 칩 데이터 생성
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
    return Array.from(selected).map(key => {
      const [regionName, tail] = key.split('|');
      const label = tail === 'ALL' ? `${regionName} 전체` : tail;
      return {
        key,
        regionName,
        label,
      };
    });
  }, [globalAllOnly, selected, NATIONWIDE_LABEL]);

  // 칩 개별 삭제
  const removeChip = (key: string) => {
    if (key === 'NATIONWIDE') {
      setGlobalAllOnly(false);
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleClose = () => {
    if (hasAnySelection()) {
        console.log("🔄 선택된 내용이 있어 초기화 모달 표시");
        setShowCancelModal(true);
      } else {
        onCancel();
      }
  };

  const handleSave = () => {
    console.log("💾 지역 선택 저장");
    
    if (selected.size === 0 && !globalAllOnly) {
      toast.error("1개 이상 선택해주세요.");
      return;
    }

    onChange({ 
      nationwide: globalAllOnly, 
      selectedKeys: Array.from(selected) 
    });
    
    onSave();
  };

  // 입력 여부 확인
  const hasAnySelection = () => {
    return globalAllOnly || selected.size > 0;
  };

  // 초기화 버튼 클릭
  const handleReset = () => {
    if (hasAnySelection()) {
      console.log("🔄 선택된 내용이 있어 초기화 모달 표시");
      setShowResetModal(true);
    } else {
      console.log("🔄 선택된 내용 없음 - 초기화 불필요");
    }
  };

  // 초기화 확인
  const confirmReset = () => {
    console.log("🗑️ 초기화 확인 - 모든 선택 삭제");
    setGlobalAllOnly(false);
    setSelected(new Set());
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
            ※ 최대 5개까지 추가 가능합니다.
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
              <div className="location-picker__category-group">
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

      <div className="resume-create-page__form-action">
        {/* 선택된 칩 표시 */}
        {(selected.size > 0 || globalAllOnly) && (
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
        <div className='btn_wrap'>
        <button className="btn_w_full default_btn_white" onClick={handleReset}>
          <img src={ic_replay_gray900_20} alt="" /> 초기화
        </button>
        <button className="btn_w_full default_btn_black" onClick={handleSave}>
          저장
        </button>
        </div>

      </div>

      {/* 초기화 확인 모달 */}
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
        onConfirm={confirmReset}
        onClose={() => setShowCancelModal(false)}
      />
    </>
  );
}