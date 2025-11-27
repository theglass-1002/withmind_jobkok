import React, { useState } from "react";
import { BasicInfo, BasicErrors } from "@/shared/utils/util";
import M_BasicInfoForm from "./Form/M_BasicInfoForm";

import ic_mail_gray500_20 from "@/assets/icons/size20/ic_mail_gray500_20.png";
import ic_mobile_gray_20 from "@/assets/icons/size20/ic_mobile_gray_20.png";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";
import "./BasicInfoSection.css";

export default function M_BasicInfoSection({
  values,
  errors,
  onChange,
  onFocusAny,
  sectionRef,
}: {
  values: BasicInfo;
  errors?: BasicErrors;
  onChange: (patch: Partial<BasicInfo>) => void;
  onFocusAny?: () => void;
  sectionRef?: (el: HTMLDivElement | null) => void;
}) {
  const { name, birth, gender, email, phone } = values;
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    console.log("✏️ 수정 버튼 클릭! 편집 모드로 전환");
    console.log("📋 현재 데이터:", values);
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log("✅ 저장 완료! 미리보기 모드로 전환");
    console.log("💾 최종 저장된 데이터:", values);
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log("🚫 취소! 미리보기 모드로 복귀");
    setIsEditing(false);
  };

  const calculateAge = (birthStr: string) => {
    if (!birthStr) return "";
    const birthDate = new Date(birthStr.replace(/\./g, "-"));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const birthYear = birth ? birth.split(".")[0] : "";
  const age = calculateAge(birth);
  const genderText = gender === "male" ? "남성" : gender === "female" ? "여성" : "";

  return (
    <div
      id="resume__create-section--basic"
      ref={sectionRef}
      className="resume-create-page__section resume-create-page__section--basic"
    >
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          기본정보<em className="resume-create-page__required">*</em>
        </div>
      </div>

      <div className="resume-basic-preview">
        <div className="resume-basic-preview__row">
          <span className="resume-basic-preview__name">{name || "이름 없음"}</span>
          <span className="resume-basic-preview__value info">
            {birthYear ? `${birthYear}년생` : ""}
            {age ? `(만 ${age}세)` : ""}
            {genderText ? `, ${genderText}` : ""}
            {!birthYear && !age && !genderText && "정보 없음"}
          </span>
        </div>

        <div className="resume-basic-preview__row">
          <div className="resume-basic-preview__group">
            <img className="resume-basic-preview__label_icon" src={ic_mail_gray500_20} alt="" />
            <span className="resume-basic-preview__value">{email || "이메일 없음"}</span>
          </div>
          <div className="resume-basic-preview__group">
            <img className="resume-basic-preview__label_icon" src={ic_mobile_gray_20} alt="" />
            <span className="resume-basic-preview__value">{phone || "연락처 없음"}</span>
          </div>
        </div>
      </div>

      <div className="resume-create-page__section-action">
        <button className="btn_w_full default_btn_white" onClick={handleEdit}>
          <img src={ic_edit_gray900_20} alt="" /> 수정
        </button>
      </div>

      {isEditing && (
        <div className="basic-info-form-overlay">
          <div className="basic-info-form-container">
            <M_BasicInfoForm
              values={values}
              errors={errors}
              onChange={onChange}
              onFocusAny={onFocusAny}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}