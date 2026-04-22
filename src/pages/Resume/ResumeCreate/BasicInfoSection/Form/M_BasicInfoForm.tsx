// src/pages/.../BasicInfoSection/M_BasicInfoForm.tsx
import React, { useEffect, useRef, useState } from "react";
import Modal from "@/shared/components/modal/Modal";

import FormField from "@/shared/components/form/FormField";
import FormInput from "@/shared/components/form/FormInput";
import DateInline from "@/shared/components/form/DateInline";
import GenderChoice from "@/shared/components/form/GenderChoice";
import InlineDayPicker from "@/shared/components/calendar/InlineDayPicker";
import PhotoModal from "@/shared/components/photo/PhotoModal";
import type { PhotoErrorState } from "@/shared/components/photo/PhotoModal";
import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_error_red100_20 from "@/assets/icons/size20/ic_error_red100_20.png";
import ic_calendar_gray900_20 from "@/assets/icons/size20/ic_calendar_gray900_20.png";
import icon_calendar_red_20 from "@/assets/icons/size20/icon_calendar_red_20.png";
import ic_add_btn_gray700_20 from "@/assets/icons/size20/ic_add_btn_gray700_20.png";
import ic_close_white_20 from "@/assets/icons/size20/ic_close_white_20.png";
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";

import { BasicInfo, BasicErrors, parseYMD, fmtYMD } from "@/shared/utils/util";
import { formatPhone } from "@/shared/utils/validators";

interface M_BasicInfoFormProps {
  values: BasicInfo;
  errors?: BasicErrors;
  onChange: (patch: Partial<BasicInfo>) => void;
  onPhotoFileChange?: (file: File | null) => void;
  onFocusAny?: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function M_BasicInfoForm({
  values,
  errors,
  onChange,
  onPhotoFileChange,
  onFocusAny,
  onSave,
  onCancel,
}: M_BasicInfoFormProps) {
  const { name, birth, gender, email, phone, photoUrl } = values;

  const [openBirth, setOpenBirth] = useState(false);
  const birthRef = useRef<HTMLDivElement | null>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [localErrors, setLocalErrors] = useState<BasicErrors>({});

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(photoUrl);
  const [photoFilename, setPhotoFilename] = useState<string | undefined>();
  const [photoErrState, setPhotoErrState] = useState<PhotoErrorState>("none");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoModalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPhotoPreview(photoUrl);
  }, [photoUrl]);

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

    const previewUrl = URL.createObjectURL(f);

    setPhotoErrState("none");
    setPhotoFile(f);
    setPhotoPreview(previewUrl);
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

  useEffect(() => {
    if (!showPhotoModal) return;
    const onDocClick = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (photoModalRef.current && !photoModalRef.current.contains(t)) {
        closePhotoModal();
      }
    };
    document.addEventListener("mousedown", onDocClick, true);
    document.addEventListener("touchstart", onDocClick, true);
    return () => {
      document.removeEventListener("mousedown", onDocClick, true);
      document.removeEventListener("touchstart", onDocClick, true);
    };
  }, [showPhotoModal]);

  const hasPhoto = !!(photoUrl || photoFile);

  const hasAnyInput = () => {
    return !!(name || birth || gender || email || phone || photoUrl);
  };

  const handleClose = () => {
    if (hasAnyInput()) {
      setShowCancelModal(true);
    } else {
      onCancel();
    }
  };

  const handleReset = () => {
    if (hasAnyInput()) {
      setShowResetModal(true);
    }
  };

  const confirmReset = () => {
    onChange({
      name: "",
      birth: "",
      gender: null,
      email: "",
      phone: "",
      photoUrl: undefined,
    });

    setPhotoFile(null);
    setPhotoPreview(undefined);
    setPhotoFilename(undefined);

    if (fileInputRef.current) fileInputRef.current.value = "";

    onPhotoFileChange?.(null);
    setLocalErrors({});
    setShowResetModal(false);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    onCancel();
  };

  const handleSave = () => {
    const missingFields: string[] = [];
    const newErrors: BasicErrors = {};

    if (!name || !name.trim()) {
      missingFields.push("이름");
      newErrors.name = "이름을 입력해주세요.";
    }
    if (!birth || !birth.trim()) {
      missingFields.push("생년월일");
      newErrors.birth = "생년월일을 선택해주세요.";
    }
    if (!email || !email.trim()) {
      missingFields.push("이메일");
      newErrors.email = "이메일을 입력해주세요.";
    }
    if (!phone || !phone.trim()) {
      missingFields.push("연락처");
      newErrors.phone = "연락처를 입력해주세요.";
    }

    if (missingFields.length > 0) {
      setLocalErrors(newErrors);
      return;
    }

    setLocalErrors({});
    onSave();
  };

  const displayErrors = { ...errors, ...localErrors };

  return (
    <>
      <header className="resume-create-form__header">
        <img
          src={ic_close_gray900_24}
          alt=""
          className="resume-create-form__close-icon"
          onClick={handleClose}
          style={{ cursor: "pointer" }}
        />
        <span className="resume-create-form__title">기본 정보</span>
        <span></span>
      </header>

      <div className="resume-create-page__section-body">
        <div className="resume-create-page__col resume-create-page__col--left">
          <FormField label={<>이름 <em>*</em></>} className="in_icon">
            <FormInput
              id="name"
              required
              value={name}
              placeholder={displayErrors?.name}
              onChange={(v) => {
                onChange({ name: v });
                if (displayErrors.name) {
                  setLocalErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              onFocus={() => {
                onFocusAny?.();
                if (displayErrors.name) {
                  setLocalErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              invalid={!!displayErrors?.name}
              rightIconSrc={displayErrors?.name ? ic_error_red100_20 : undefined}
            />
          </FormField>

          <div className="resume-create-page__field-row">
            <div className="birth section-period__start-wrap" ref={birthRef}>
              <FormField label={<>생년월일 <em>*</em></>} className="">
                <DateInline
                  id="birth"
                  iconSrc={
                    displayErrors?.birth
                      ? icon_calendar_red_20
                      : ic_calendar_gray900_20
                  }
                  value={birth || "YYYY.MM.DD"}
                  onClick={() => setOpenBirth(true)}
                  invalid={!!displayErrors?.birth}
                  errorMessage={displayErrors?.birth}
                  rightIconSrc={
                    displayErrors?.birth ? ic_error_red100_20 : undefined
                  }
                  isOpen={openBirth}
                />
              </FormField>

              {openBirth && (
                <div
                  className="calendar-popover"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="calendar-popover__panel">
                    <InlineDayPicker
                      className="cal--day"
                      value={parseYMD(birth || "") || undefined}
                      minYear={1950}
                      onChange={() => {}}
                      onApply={(d) => {
                        onChange({ birth: fmtYMD(d) });
                        setOpenBirth(false);
                        if (displayErrors.birth) {
                          setLocalErrors((prev) => ({
                            ...prev,
                            birth: undefined,
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <FormField label={<>성별 <em>*</em></>} className="gender">
              <GenderChoice
                value={gender}
                onChange={(g) => {
                  onChange({ gender: g });
                }}
              />
            </FormField>
          </div>

          <div className="resume-create-page__field-row">
            <FormField label={<>이메일 <em>*</em></>} className="in_icon email">
              <FormInput
                id="email"
                type="email"
                required
                value={email}
                placeholder={displayErrors?.email}
                onChange={(v) => {
                  onChange({ email: v });
                  if (displayErrors.email) {
                    setLocalErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                onFocus={() => {
                  onFocusAny?.();
                  if (displayErrors.email) {
                    setLocalErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                invalid={!!displayErrors?.email}
                rightIconSrc={displayErrors?.email ? ic_error_red100_20 : undefined}
              />
            </FormField>

            <FormField label={<>연락처 <em>*</em></>} className="in_icon phone">
              <FormInput
                placeholder={displayErrors?.phone}
                id="phone"
                type="tel"
                required
                value={formatPhone(phone)}
                onChange={(v) => {
                  onChange({ phone: v });
                  if (displayErrors.phone) {
                    setLocalErrors((prev) => ({ ...prev, phone: undefined }));
                  }
                }}
                onFocus={() => {
                  onFocusAny?.();
                  if (displayErrors.phone) {
                    setLocalErrors((prev) => ({ ...prev, phone: undefined }));
                  }
                }}
                invalid={!!displayErrors?.phone}
                rightIconSrc={displayErrors?.phone ? ic_error_red100_20 : undefined}
              />
            </FormField>
          </div>
        </div>

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
                ref={photoModalRef}
                className="photo-modal__overlay"
                onClick={(e) => e.stopPropagation()}
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

      <div className="resume-create-page__form-action">
        <button className="default_btn_white btn-reset" onClick={handleReset}>
          <img src={ic_replay_gray900_20} alt="" /> 초기화
        </button>
        <button className="btn_w_full default_btn_black" onClick={handleSave}>
          저장
        </button>
      </div>

      <Modal
        open={showResetModal}
        title="입력된 내용을 전부 삭제하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="계속 작성"
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