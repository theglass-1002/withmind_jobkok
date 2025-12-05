import React, { useEffect, useRef, useState } from "react";
import FormField from "@/shared/components/form/FormField";
import FormInput from "@/shared/components/form/FormInput";
import DateInline from "@/shared/components/form/DateInline";
import GenderChoice from "@/shared/components/form/GenderChoice";
import InlineDayPicker from "@/shared/components/calendar/InlineDayPicker";
import PhotoModal from "@/shared/components/photo/PhotoModal";
import type { PhotoErrorState } from "@/shared/components/photo/PhotoModal";

import ic_error_red100_20 from "@/assets/icons/size20/ic_error_red100_20.png";
import ic_calendar_gray900_20 from "@/assets/icons/size20/ic_calendar_gray900_20.png";
import icon_calendar_red_20 from "@/assets/icons/size20/icon_calendar_red_20.png";
import ic_add_btn_gray700_20 from "@/assets/icons/size20/ic_add_btn_gray700_20.png";
import ic_close_white_20 from "@/assets/icons/size20/ic_close_white_20.png";
import "./BasicInfoSection.css";
import { formatPhone, isValidPhone } from "@/shared/utils/validators";

type Gender = "male" | "female" | null;

export type BasicInfo = {
  name: string;
  birth: string;
  gender: Gender;
  email: string;
  phone: string;
  photoUrl?: string;
};

export type BasicErrors = Partial<Record<keyof BasicInfo, string>>;

const parseYMD = (s: string) => {
  const trimmed = (s || "").trim();
  if (!trimmed) return null;

  // 새 형식: YYYY-MM-DD
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

  // 예전 형식: YYYY.MM.DD 도 fallback
  if (!m) {
    m = /^(\d{4})\.(\d{2})\.(\d{2})$/.exec(trimmed);
  }

  if (!m) return null;
  return { year: +m[1], month: +m[2] - 1, day: +m[3] };
};

const fmtYMD = (d: { year: number; month: number; day: number }) =>
  `${d.year}-${String(d.month + 1).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;

export default function BasicInfoSection({
  values,
  errors,
  onChange,
  onFocusAny,
  onPhotoFileChange,
}: {
  values: BasicInfo;
  errors?: BasicErrors;
  onChange: (patch: Partial<BasicInfo>) => void;
  onFocusAny?: () => void;
  onPhotoFileChange?: (file: File | null) => void;
}) {
  const { name, birth, gender, email, phone, photoUrl } = values;

  const [openBirth, setOpenBirth] = useState(false);
  const birthRef = useRef<HTMLDivElement | null>(null);

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>();
  const [photoFilename, setPhotoFilename] = useState<string | undefined>();
  const [photoErrState, setPhotoErrState] = useState<PhotoErrorState>("none");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openPhotoModal = () => {
    setPhotoErrState("none");
    setShowPhotoModal(true);
  };
  const closePhotoModal = () => setShowPhotoModal(false);
  const onPickFile = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!/\.(jpe?g|png|gif)$/i.test(f.name)) {
      setPhotoFile(null);
      setPhotoPreview(undefined);
      setPhotoFilename(undefined);
      setPhotoErrState("invalid");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onPhotoFileChange?.(null);
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setPhotoFile(null);
      setPhotoPreview(undefined);
      setPhotoFilename(undefined);
      setPhotoErrState("tooLarge");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onPhotoFileChange?.(null);
      return;
    }

    setPhotoErrState("none");
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
    setPhotoFilename(f.name);
    onPhotoFileChange?.(f);
  };

  const onApplyPhoto = () => {
    if (!photoFile) {
      setPhotoErrState("missing");
      return;
    }
    onChange({ photoUrl: photoPreview || "" });
    closePhotoModal();
  };

  const removePhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoFile(null);
    setPhotoPreview(undefined);
    setPhotoFilename(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange({ photoUrl: undefined });
    onPhotoFileChange?.(null);
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent | TouchEvent) => {
      if (!openBirth) return;
      const t = e.target as Node;
      if (birthRef.current && !birthRef.current.contains(t)) {
        setOpenBirth(false);
      }
    };
    document.addEventListener("mousedown", onDocClick, true);
    document.addEventListener("touchstart", onDocClick, true);
    return () => {
      document.removeEventListener("mousedown", onDocClick, true);
      document.removeEventListener("touchstart", onDocClick, true);
    };
  }, [openBirth]);

  const hasPhoto = !!(photoUrl || photoFile);

  return (
    <div className="resume-create-page__section resume-create-page__section--basic">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="resume-create-page__section-title__heading">
          기본정보 <em className="resume-create-page__required">*</em>
        </div>
      </div>

      <div className="resume-create-page__section-body">
        <div className="resume-create-page__col resume-create-page__col--left">
          {/* 이름 */}
          <FormField label={<>이름 <em>*</em></>} className="in_icon">
            <FormInput
              id="name"
              required
              value={name}
              onChange={(v) => onChange({ name: v })}
              onFocus={onFocusAny}
              invalid={!!errors?.name}
             
              rightIconSrc={errors?.name ? ic_error_red100_20 : undefined}
            />
          </FormField>

          {/* 생년월일 + 성별 */}
          <div className="resume-create-page__field-row">
            <div className="birth section-period__start-wrap" ref={birthRef}>
              <FormField label={<>생년월일 <em>*</em></>} className="">
                <DateInline
                  id="birth"
                  iconSrc={errors?.birth ? icon_calendar_red_20 : ic_calendar_gray900_20}
                  value={birth || "YYYY-MM-DD"}
                  onClick={() => setOpenBirth(true)}
                  invalid={!!errors?.birth}
                  isOpen={openBirth}
                />
              </FormField>

              {openBirth && (
                <div className="calendar-popover" onClick={(e) => e.stopPropagation()}>
                  <div className="calendar-popover__panel">
                    <InlineDayPicker
                      className="cal--day"
                      value={parseYMD(birth || "") || undefined}
                      minYear={1950}
                      onChange={() => {}}
                      onApply={(d) => {
                        onChange({ birth: fmtYMD(d) });
                        setOpenBirth(false);
                      }}
                    />
                  </div>
                </div>
              )}
              {errors?.birth && (
                <p className="form-error-text">{errors.birth}</p>
              )}
            </div>

            <FormField label={<>성별 <em>*</em></>} className="gender">
              <GenderChoice value={gender} onChange={(g) => onChange({ gender: g })} />
              {errors?.gender && (
                <p className="form-error-text">{errors.gender}</p>
              )}
            </FormField>
          </div>

          {/* 이메일 + 연락처 */}
          <div className="resume-create-page__field-row">
            <FormField label={<>이메일 <em>*</em></>} className="in_icon email">
              <FormInput
                id="email"
                type="email"
                required
                value={email}
                onChange={(v) => onChange({ email: v })}
                onFocus={onFocusAny}
                invalid={!!errors?.email}
                rightIconSrc={errors?.email ? ic_error_red100_20 : undefined}
              />
            </FormField>

            <FormField label={<>연락처 <em>*</em></>} className="in_icon phone">
              <FormInput
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(v) => {
                  const formatted = formatPhone(v);
                  onChange({ phone: formatted });
                }}
                onBlur={() => {
                  if (!isValidPhone(phone)) {
                    onChange({ phone }); // 포맷은 유지
                  }
                }}
                onFocus={onFocusAny}
                invalid={!!errors?.phone}
                rightIconSrc={errors?.phone ? ic_error_red100_20 : undefined}
              />
            </FormField>


          </div>
        </div>

        {/* 사진 */}
        <div className="resume-create-page__col resume-create-page__col--right">
          <span className="small_labe_black-14">사진</span>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.gif"
            style={{ display: "none" }}
            onChange={onFileChange}
          />

          <div
            className="resume-create-page__photo"
            role="button"
            tabIndex={0}
            onClick={() => {
              if (!photoUrl) openPhotoModal();
            }}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !photoUrl) {
                e.preventDefault();
                openPhotoModal();
              }
            }}
          >
            {photoUrl ? (
              <>
                <img
                  className="resume-create-page__photo-img"
                  src={photoUrl}
                  alt="증명사진 미리보기"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  style={{ pointerEvents: "none" }}
                />
                <span
                  className="resume-create-page__photo-close"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={removePhoto}
                >
                  <img src={ic_close_white_20} alt="" />
                </span>
                <span
                  className="resume-create-page__photo-change-btn"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openPhotoModal();
                  }}
                >
                  사진 변경
                </span>
              </>
            ) : (
              <>
                <img src={ic_add_btn_gray700_20} alt="" />
                <span>{hasPhoto ? "사진 변경" : "사진 추가"}</span>
              </>
            )}

            {showPhotoModal && (
              <div
                className="photo-modal__overlay"
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.target === e.currentTarget) closePhotoModal();
                }}
              >
                <PhotoModal
                  hasFile={!!photoFile}
                  filename={photoFilename}
                  onPick={onPickFile}
                  onApply={onApplyPhoto}
                  errorState={photoErrState}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
