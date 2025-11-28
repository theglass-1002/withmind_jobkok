// src/pages/.../PortfolioDocumentsSection/M_PortfolioDocumentsSection.tsx
import React, { useState } from "react";
import "./PortfolioDocumentsSection.css";

import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import M_PortfolioDocumentsForm from "./Form/M_PortfolioDocumentsForm";

export type SourceType = "file" | "url";

export type PortfolioDocItem = {
  id: string;
  source: SourceType;   // 파일 / URL
  title: string;        // (선택) 문서명
  file: File | null;    // 파일 모드일 때
  url: string;          // URL 모드일 때
  note?: string;        // (선택) 설명
};

const makeId = () => Math.random().toString(36).slice(2, 10);

const blankItem = (): PortfolioDocItem => ({
  id: makeId(),
  source: "file",
  title: "",
  file: null,
  url: "",
  note: "",
});

export default function M_PortfolioDocumentsSection() {
  const [items, setItems] = useState<PortfolioDocItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddOrEdit = () => {
    setIsEditing(true);
    if (items.length === 0) {
      setItems([blankItem()]);
    }
  };

  const handleSave = (nextItems: PortfolioDocItem[]) => {
    setItems(nextItems);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const formatBytes = (bytes: number) => {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="resume-create-page__section resume-create-page__section--portfolio-documents">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              포트폴리오ㆍ기타 문서
            </div>
          </div>
        </div>
      </div>

      {/* 미리보기 (간단하게 파일명/URL 리스트) */}
      {items.length > 0 && (
        <div className="resume-portfolio-list">
          {items.map((it) => (
            <div className="resume-portfolio-item" key={it.id}>
              <div className="resume-portfolio-item__main">
                <span className="resume-portfolio-item__source">
                  {it.source === "file" ? "[파일]" : "[URL]"}
                </span>
                <span className="resume-portfolio-item__label">
                  {it.source === "file"
                    ? it.file?.name || "파일 미선택"
                    : it.url || "URL 미입력"}
                </span>
              </div>
              {it.file && (
                <span className="resume-portfolio-item__meta">
                  {formatBytes(it.file.size)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 추가/수정 버튼 */}
      <div className="resume-create-page__section-action">
        <button
          className="btn_w_full default_btn_white"
          onClick={handleAddOrEdit}
          disabled={isEditing}
        >
          <img src={ic_add_btn_gray900_20} alt="" />
          {items.length > 0 ? "수정" : "추가"}
        </button>
      </div>

      {/* 오버레이 폼 */}
      {isEditing && (
        <div className="basic-info-form-overlay">
          <div className="basic-info-form-container">
            <M_PortfolioDocumentsForm
              initialItems={items}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
