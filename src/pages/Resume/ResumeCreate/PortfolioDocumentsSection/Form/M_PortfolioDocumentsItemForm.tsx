// src/pages/.../PortfolioDocumentsSection/Form/M_PortfolioDocumentsItemForm.tsx
import React, { useRef } from "react";
import "../PortfolioDocumentsSection.css";

import FormInput from "@/shared/components/form/FormInput";

import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_radio_checked_purple_20 from "@/assets/icons/size20/ic_radio_checked_purple_20.png";
import ic_radio_unchecked_gray400_20 from "@/assets/icons/size20/ic_radio_unchecked_gray400_20.png";
import ic_key_arrow_down_gray500_20 from "@/assets/icons/size20/ic_key_arrow_down_gray500_20.png";
import ic_key_arrow_up_gray500_20 from "@/assets/icons/size20/ic_key_arrow_up_gray500_20.png";
import ic_trash_gray900_20 from "@/assets/icons/size20/ic_trash_gray900_20.png";
import ic_key_arrow_up_gray900_20 from "@/assets/icons/size20/ic_key_arrow_up_gray900_20.png";
import ic_key_arrow_down_gray900_20 from "@/assets/icons/size20/ic_key_arrow_down_gray900_20.png";
import ic_folder_gray900_20 from "@/assets/icons/size20/ic_folder_gray900_20.png";
import ic_link_gray900_20 from "@/assets/icons/size20/ic_link_gray900_20.png";

import type { PortfolioDocItem, SourceType } from "../M_PortfolioDocumentsSection";

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB

interface Props {
  index: number;
  total: number;
  value: PortfolioDocItem;
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
  canMoveUp,
  canMoveDown,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: Props) {
  const { source, file, url } = value;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canRemove = total >= 1;

  const setSource = (src: SourceType) => {
    onChange(
      src === "file"
        ? { source: "file", url: "" }
        : { source: "url", file: null }
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
    onChange({ file: f });
  };

  const changeUrl = (v: any) => {
    const value = typeof v === "string" ? v : v?.target?.value ?? "";
    onChange({ url: value });
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="portfolio-documents-section__item">
      <div className="portfolio-documents__fields">
        <div
          className="portfolio-documents__source"
          role="radiogroup"
          aria-label="업로드 방식 선택"
        >
          {/* 파일 선택 */}
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

          {/* URL 선택 */}
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
                  file ? "" : "portfolio-documents__file-name--empty"
                }`}
              >
                <img src={ic_folder_gray900_20} alt="" />
                {file ? (
                  <>
                    <span className="portfolio-documents__file-text">
                      {file.name}
                    </span>
                    <span className="portfolio-documents__file-size">
                      {formatBytes(file.size)}
                    </span>
                  </>
                ) : (
                  <>선택된 파일이 없습니다</>
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
                       {/* 컨트롤: 위/아래/삭제 */}
    <div className="portfolio-documents__controls">
        {/* 위로 */}
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

        {/* 아래로 */}
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

        {/* 삭제 */}
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
              inputClassName="portfolio-documents__url-input"
              id={`portfolio_doc_url_${value.id}`}
              value={url}
              onChange={(v: any) => changeUrl(v)}
            />
          </div>
        )}
  
      </div>

 
    </div>
  );
}
