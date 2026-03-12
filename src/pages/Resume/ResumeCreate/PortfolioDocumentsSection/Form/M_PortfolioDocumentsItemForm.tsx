import React, { useMemo, useRef } from "react";
import "../PortfolioDocumentsSection.css";

import FormInput from "@/shared/components/form/FormInput";

import ic_radio_checked_purple_20 from "@/assets/icons/size20/ic_radio_checked_purple_20.png";
import ic_radio_unchecked_gray400_20 from "@/assets/icons/size20/ic_radio_unchecked_gray400_20.png";
import ic_key_arrow_down_gray500_20 from "@/assets/icons/size20/ic_key_arrow_down_gray500_20.png";
import ic_key_arrow_up_gray500_20 from "@/assets/icons/size20/ic_key_arrow_up_gray500_20.png";
import ic_trash_gray900_20 from "@/assets/icons/size20/ic_trash_gray900_20.png";
import ic_key_arrow_up_gray900_20 from "@/assets/icons/size20/ic_key_arrow_up_gray900_20.png";
import ic_key_arrow_down_gray900_20 from "@/assets/icons/size20/ic_key_arrow_down_gray900_20.png";
import ic_folder_gray900_20 from "@/assets/icons/size20/ic_folder_gray900_20.png";
import ic_link_gray900_20 from "@/assets/icons/size20/ic_link_gray900_20.png";
import ic_error_red100_20 from "@/assets/icons/size20/ic_error_red100_20.png";

import type { PortfolioDocItem, SourceType } from "../M_PortfolioDocumentsSection";

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB

type PortfolioErrors = {
  fileMissing?: boolean;
  urlMissing?: boolean;
};

interface Props {
  index: number;
  total: number;
  value: PortfolioDocItem;
  errors?: PortfolioErrors;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onChange: (patch: Partial<PortfolioDocItem>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export default function M_PortfolioDocumentsItemForm({
  index,
  total,
  value,
  errors = {},
  canMoveUp,
  canMoveDown,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: Props) {
  const { source, file, url, title, filePath } = value;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canRemove = total >= 1;

  const setSource = (src: SourceType) => {
    onChange(
      src === "file"
        ? { source: "file", url: "" }
        : {
            source: "url",
            file: null,
            filePath: "",
            fileIdx: undefined,
            title: "",
          }
    );
  };

  const openFilePicker = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;

    if (f.size > MAX_FILE_BYTES) {
      alert("50MB 이하의 파일만 등록 가능합니다.");
      e.target.value = "";
      return;
    }

    onChange({
      file: f,
      title: f.name,
      filePath: "",
      fileIdx: undefined,
      url: "",
      source: "file",
    });
  };

  const changeUrl = (v: any) => {
    const nextUrl = typeof v === "string" ? v : v?.target?.value ?? "";
    onChange({ url: nextUrl });
  };

  const displayFileName = useMemo(() => {
    if (file?.name) return file.name;
    if (title?.trim()) return title;

    if (filePath?.trim()) {
      try {
        const last = filePath.split("/").pop() ?? "";
        return decodeURIComponent(last);
      } catch {
        return filePath.split("/").pop() ?? "";
      }
    }

    return "";
  }, [file, title, filePath]);

  const hasFileValue = source === "file" && !!displayFileName;

  return (
    <div className="portfolio-documents-section__item">
      <div className="portfolio-documents__fields">
        <div
          className="portfolio-documents__source"
          role="radiogroup"
          aria-label="업로드 방식 선택"
        >
          <div
            className={`portfolio-documents__source-option portfolio-documents__source-option--file ${
              source === "file" ? "is-active" : ""
            }`}
            role="radio"
            aria-checked={source === "file"}
            tabIndex={0}
            onClick={() => setSource("file")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSource("file");
              }
            }}
          >
            <img
              className="portfolio-documents__source-icon"
              src={
                source === "file"
                  ? ic_radio_checked_purple_20
                  : ic_radio_unchecked_gray400_20
              }
              alt=""
            />
            <span className="portfolio-documents__source-label">파일</span>
          </div>

          <div
            className={`portfolio-documents__source-option portfolio-documents__source-option--url ${
              source === "url" ? "is-active" : ""
            }`}
            role="radio"
            aria-checked={source === "url"}
            tabIndex={0}
            onClick={() => setSource("url")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSource("url");
              }
            }}
          >
            <img
              className="portfolio-documents__source-icon"
              src={
                source === "url"
                  ? ic_radio_checked_purple_20
                  : ic_radio_unchecked_gray400_20
              }
              alt=""
            />
            <span className="portfolio-documents__source-label">URL</span>
          </div>
        </div>

        {source === "file" ? (
          <div className="portfolio-documents__uploader">
            <label className="portfolio-documents__label small_labe_black-14">
              파일 <em className="error_text_red">*</em>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.png,.jpg,.jpeg,.gif"
              onChange={onFileChange}
            />

            <div className="portfolio-documents__file">
              <div
                className={`portfolio-documents__file-name ${
                  hasFileValue ? "" : "portfolio-documents__file-name--empty"
                } ${errors.fileMissing ? "error_box" : ""}`}
              >
                <img src={ic_folder_gray900_20} alt="" />

                {hasFileValue ? (
                  <span className="portfolio-documents__file-text">
                    {displayFileName}
                  </span>
                ) : (
                  <div className="portfolio-documents__file-empty">
                    선택된 파일이 없습니다
                    {errors.fileMissing && (
                      <img src={ic_error_red100_20} alt="" />
                    )}
                  </div>
                )}
              </div>

              <span
                className="default_btn_white btn_w_full"
                role="button"
                tabIndex={0}
                onClick={openFilePicker}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openFilePicker();
                  }
                }}
              >
                파일 선택
              </span>
            </div>

            <span className="portfolio-documents__hint">
              ※ 50MB 이하의 파일만 등록 가능합니다.
            </span>

            <div className="portfolio-documents__controls">
              <span
                className={[
                  "portfolio-documents__control-btn",
                  "portfolio-documents__control--up",
                  !canMoveUp ? "is-disabled" : "",
                ]
                  .join(" ")
                  .trim()}
                role="button"
                tabIndex={canMoveUp ? 0 : -1}
                onClick={() => canMoveUp && onMoveUp()}
                aria-disabled={!canMoveUp}
              >
                <img
                  src={
                    canMoveUp
                      ? ic_key_arrow_up_gray900_20
                      : ic_key_arrow_up_gray500_20
                  }
                  alt=""
                />
              </span>

              <span
                className={[
                  "portfolio-documents__control-btn",
                  "portfolio-documents__control--down",
                  !canMoveDown ? "is-disabled" : "",
                ]
                  .join(" ")
                  .trim()}
                role="button"
                tabIndex={canMoveDown ? 0 : -1}
                onClick={() => canMoveDown && onMoveDown()}
                aria-disabled={!canMoveDown}
              >
                <img
                  src={
                    canMoveDown
                      ? ic_key_arrow_down_gray900_20
                      : ic_key_arrow_down_gray500_20
                  }
                  alt=""
                />
              </span>

              <span
                className="portfolio-documents__control-btn portfolio-documents__control--remove"
                onClick={() => canRemove && onRemove()}
                aria-label="삭제"
                role="button"
                tabIndex={0}
              >
                <img src={ic_trash_gray900_20} alt="" />
              </span>
            </div>
          </div>
        ) : (
          <div className="portfolio-documents__uploader">
            <label className="portfolio-documents__label small_labe_black-14">
              URL <em className="error_text_red">*</em>
            </label>

            <FormInput
              placeholder="https://"
              leftIconSrc={ic_link_gray900_20}
              id={`portfolio_doc_url_${value.id}`}
              value={url}
              onChange={(v: any) => changeUrl(v)}
              invalid={!!errors.urlMissing}
              rightIconSrc={errors.urlMissing ? ic_error_red100_20 : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}