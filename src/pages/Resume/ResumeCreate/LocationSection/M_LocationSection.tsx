// src/pages/.../LocationSection/M_LocationSection.tsx
import React, { useState, useMemo } from "react";
import "./LocationSection.css";
import M_LocationForm from "./Form/M_LocationForm";

import data from "@/data/locationsV2.json";

import chevron_right_black from "@/assets/icons/chevron_right_black.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
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
  onChange: (v: LocationValue) => void;
  sectionRef?: (el: HTMLDivElement | null) => void;
}

export default function M_LocationSection({
  defaultValue = { nationwide: false, selectedCodes: [] },
  onChange,
  sectionRef,
}: M_LocationSectionProps) {
  const regions = data as Region[];
  const NATIONWIDE_LABEL = "지역 전체";

  const [isAdding, setIsAdding] = useState(false);
  const [locationData, setLocationData] = useState<LocationValue>(defaultValue);

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleSave = () => {
    setIsAdding(false);
  };

  const handleCancel = () => {
    console.log("🚫 지역 선택 취소");
    setIsAdding(false);
  };

  const handleLocationChange = (v: LocationValue) => {
    console.log("📌 LocationSection 받은 값(code 유지):", v);
    setLocationData(v);
    onChange(v);
  };

  const removeChip = (code: string) => {
    if (code === "NATIONWIDE") {
      const newData = { ...locationData, nationwide: false };
      setLocationData(newData);
      onChange(newData);
      return;
    }

    const newCodes = locationData.selectedCodes.filter((c) => c !== code);
    const newData = { ...locationData, selectedCodes: newCodes };
    setLocationData(newData);
    onChange(newData);
  };

  const chips = useMemo(() => {
    if (locationData.nationwide) {
      return [
        {
          key: "NATIONWIDE",
          regionName: "전국",
          label: NATIONWIDE_LABEL,
          rawCode: "NATIONWIDE",
        },
      ];
    }

    return locationData.selectedCodes
      .map((code) => {
        const region = regions.find((r) => r.code === code);
        if (region) {
          return {
            key: code,
            regionName: region.name.replace(" 전체", ""),
            label: "전체",
            rawCode: code,
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
          rawCode: code,
        };
      })
      .filter(Boolean) as Array<{
      key: string;
      regionName: string;
      label: string;
      rawCode: string;
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
                {/* <span
                  className="location-picker__chip-close"
                  onClick={() => removeChip(chip.rawCode)}
                  role="button"
                  aria-label="선택 해제"
                >
                  <img src={ic_close_gray500_20} alt="" />
                </span> */}
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
          <div className="basic-info-form-container ">
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