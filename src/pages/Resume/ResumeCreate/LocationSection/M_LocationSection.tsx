// src/pages/.../LocationSection/M_LocationSection.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./LocationSection.css";
import M_LocationForm from "./Form/M_LocationForm";

import data from "@/data/locationsV2.json";

import chevron_right_black from "@/assets/icons/chevron_right_black.png";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";

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

interface M_LocationSectionProps {
  defaultValue?: LocationValue;
  errors?: string;
  onChange: (v: LocationValue) => void;
  sectionRef?: (el: HTMLDivElement | null) => void;
  isEdit?: boolean;
}

export default function M_LocationSection({
  defaultValue = { nationwide: false, selectedCodes: [] },
  errors,
  onChange,
  sectionRef,
  isEdit = false,
}: M_LocationSectionProps) {
  const regions = data as Region[];
  const NATIONWIDE_LABEL = "지역 전체";

  const [isAdding, setIsAdding] = useState(false);
  const [locationData, setLocationData] = useState<LocationValue>(defaultValue);
  const didSyncRef = useRef(false);

  useEffect(() => {
    if (!isEdit) return;
    if (didSyncRef.current) return;

    const hasValue =
      defaultValue.nationwide ||
      (defaultValue.selectedCodes?.length ?? 0) > 0;

    if (!hasValue) return;

    setLocationData(defaultValue);
    didSyncRef.current = true;
  }, [isEdit, defaultValue.nationwide, defaultValue.selectedCodes]);

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleSave = () => {
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
  };

  const handleLocationChange = (v: LocationValue) => {
    setLocationData(v);
    onChange(v);
  };

  const chips = useMemo(() => {
    if (locationData.nationwide) {
      return [
        {
          key: "NATIONWIDE",
          regionName: "전국",
          label: NATIONWIDE_LABEL,
        },
      ];
    }

    return locationData.selectedCodes
      .filter(code => code && typeof code === 'string')
      .map((code) => {
        const region = regions.find((r) => r.code === code);
        if (region) {
          return {
            key: code,
            regionName: region.name.replace(" 전체", ""),
            label: "전체",
          };
        }

        const regionCode = code.split("-")[0];
        const parentRegion = regions.find((r) => r.code === regionCode);
        const district = parentRegion?.children.find((d) => d.code === code);

        if (!district || !parentRegion) return null;

        return {
          key: code,
          regionName: parentRegion.name.replace(" 전체", ""),
          label: district.name,
        };
      })
      .filter(Boolean) as Array<{
      key: string;
      regionName: string;
      label: string;
    }>;
  }, [locationData, regions]);

  return (
    <div
      id="resume__create-section--location"
      ref={sectionRef}
      className="resume-create-page__section resume-create-page__section--location"
    >
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          희망 근무 지역<em className="resume-create-page__required">*</em>
        </div>
        {errors && (
          <div className="resume-create-page__error">
            희망 근무 지역을 추가해 주세요.
          </div>
        )}
      </div>

      {(locationData.selectedCodes.length > 0 || locationData.nationwide) && (
        <div className="resume-create-page__location">
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
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="resume-create-page__section-action">
        {chips.length > 0 ? (
          <button className="btn_w_full default_btn_white" onClick={handleAdd}>
            <img src={ic_edit_gray900_20} alt="" /> 수정
          </button>
        ) : (
          <button className="btn_w_full default_btn_white" onClick={handleAdd}>
            <img src={ic_add_btn_gray900_20} alt="" /> 추가
          </button>
        )}
      </div>

      {isAdding && (
        <div className="basic-info-form-overlay location-section">
          <div className="basic-info-form-container">
            <M_LocationForm
              defaultValue={locationData}
              onChange={handleLocationChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}