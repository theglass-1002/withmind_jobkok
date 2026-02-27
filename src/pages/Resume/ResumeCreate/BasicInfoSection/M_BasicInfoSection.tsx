import React, { useEffect, useState } from "react";
import { BasicErrors, formatPhoneNumber } from "@/shared/utils/util";
import M_BasicInfoForm from "./Form/M_BasicInfoForm";

import ic_mail_gray500_20 from "@/assets/icons/size20/ic_mail_gray500_20.png";
import ic_mobile_gray_20 from "@/assets/icons/size20/ic_mobile_gray_20.png";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";
import "./BasicInfoSection.css";

type Gender = "male" | "female" | null;

export type BasicInfo = {
  name: string;
  birth: string;
  gender: Gender;
  email: string;
  phone: string;
  photoUrl?: string;
};

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
  const [draft, setDraft] = useState<BasicInfo>(values);

  useEffect(() => {
    if (!isEditing) setDraft(values);
  }, [values, isEditing]);

  const handleEdit = () => {
    setDraft(values);
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(values);
    setIsEditing(false);
  };

  const calculateAge = (birthStr: string) => {
    if (!birthStr) return "";
    const birthDate = new Date(birthStr.replace(/\./g, "-"));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const birthYear = birth ? birth.split(".")[0] : "";
  const age = calculateAge(birth);
  const genderText =
    gender === "male" ? "남성" : gender === "female" ? "여성" : "";

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
          <span className="resume-basic-preview__name">
            {name || "이름 없음"}
          </span>
          <span className="resume-basic-preview__value info">
            {birthYear ? `${birthYear}년생` : ""}
            {age ? `(만 ${age}세)` : ""}
            {genderText ? `, ${genderText}` : ""}
            {!birthYear && !age && !genderText && "정보 없음"}
          </span>
        </div>

        <div className="resume-basic-preview__row">
          <div className="resume-basic-preview__group">
            <img
              className="resume-basic-preview__label_icon"
              src={ic_mail_gray500_20}
              alt=""
            />
            <span className="resume-basic-preview__value">
              {email || "이메일 없음"}
            </span>
            
          </div>

          <div className="resume-basic-preview__group">
            <img
              className="resume-basic-preview__label_icon"
              src={ic_mobile_gray_20}
              alt=""
            />
            <span className="resume-basic-preview__value">
              {formatPhoneNumber(phone) || "연락처 없음"}
            </span>
          </div>
        </div> 
         {draft.photoUrl?(<div className="resume-basic-preview__row photo">
        <img className="resume-basic-preview__photo" src={draft.photoUrl} alt="미리보기" />  
        </div> ):<></>}
        {/* */}
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
              values={draft}
              errors={errors}
              onChange={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  ...patch,
                }))
              }
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
