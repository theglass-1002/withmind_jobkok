// src/shared/components/photo/PhotoModal.tsx
import React from "react";
import "./PhotoModal.css";
import ic_folder_gray900_20 from "@/assets/icons/size20/ic_folder_gray900_20.png";
import ic_error_red100_20 from "@/assets/icons/size20/ic_error_red100_20.png";

export type PhotoErrorState = "none" | "missing" | "invalid" | "tooLarge";

export type PhotoModalProps = {
  hasFile: boolean;
  filename?: string;
  onPick: () => void;
  onApply: () => void;
  errorState?: PhotoErrorState;
  errorText?: string;
};

export default function PhotoModal({
  hasFile,
  filename,
  onPick,
  onApply,
  errorState = "none",
  errorText,
}: PhotoModalProps) {
  const isError = errorState !== "none";

  const defaultMsg =
    errorState === "missing"
      ? "사진을 등록해 주세요."
      : errorState === "invalid"
      ? "등록 가능한 파일이 아닙니다."
      : errorState === "tooLarge"
      ? "용량이 너무 큽니다. (10MB 이하만 가능)"
      : "";

  return (
    <>
      <div className="photo-modal__body">
        <div className={`photo-modal__picker ${hasFile ? "on" : ""} ${isError ? "error" : ""}`}>
          <span className={`photo__inner ${isError ? "error" : ""}`}>
            <img src={ic_folder_gray900_20} alt="" />
            {hasFile ? (filename || "파일이 선택되었습니다.") : "선택된 파일이 없습니다."}
            {isError && <img className="photo__error-icon" src={ic_error_red100_20} alt="" />}
          </span>
          <span className="photo-modal__file-btn default_btn_white" onClick={onPick}>
            파일선택
          </span>
        </div>

        {isError && (
          <div className="photo-modal__error" role="alert">
            {errorText || defaultMsg}
          </div>
        )}

        <div className="photo-modal__notes">
          <span className="photo-modal__note">
            ※ 10MB 미만의 JPG, JPEG, PNG, GIF 파일만 등록 가능합니다.
          </span>
          <span className="photo-modal__note">※ 사진은 3:4 비율로 노출됩니다.</span>
        </div>
      </div>

      <div className="photo-modal__footer btn_wrap">
        <span
          className="default_btn_black"
          onClick={(e) => {
            e.stopPropagation();
            onApply();
          }}
        >
          적용
        </span>
      </div>
    </>
  );
}
