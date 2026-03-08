// src/pages/.../PortfolioDocumentsSection/M_PortfolioDocumentsSection.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./PortfolioDocumentsSection.css";

import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";
import ic_folder_gray900_20 from "@/assets/icons/size20/ic_folder_gray900_20.png";
import ic_link_gray900_20 from "@/assets/icons/size20/ic_link_gray900_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import M_PortfolioDocumentsForm from "./Form/M_PortfolioDocumentsForm";

export type SourceType = "file" | "url";

export type PortfolioDocItem = {
  id: string;
  source: SourceType;
  title: string;
  file: File | null;
  url: string;
  note?: string;
};

export type PortfolioDocErrors = Partial<Record<keyof PortfolioDocItem, string>>;

interface M_PortfolioDocumentsSectionProps {
  value?: PortfolioDocItem[];
  onChange?: (items: PortfolioDocItem[]) => void;
  errors?: PortfolioDocErrors[];
  isEdit?: boolean;
}

const makeId = () => Math.random().toString(36).slice(2, 10);

const blankItem = (): PortfolioDocItem => ({
  id: makeId(),
  source: "file",
  title: "",
  file: null,
  url: "",
  note: "",
});

const normalizeItemsFromValue = (value: PortfolioDocItem[]): PortfolioDocItem[] => {
  if (!value || value.length === 0) return [];
  return value.map((it) => ({
    ...it,
    id: it.id ?? makeId(),
  }));
};

export default function M_PortfolioDocumentsSection({
  value = [],
  onChange,
  errors = [],
  isEdit = false,
}: M_PortfolioDocumentsSectionProps) {
  const [items, setItems] = useState<PortfolioDocItem[]>(() =>
    normalizeItemsFromValue(value)
  );
  const [isEditing, setIsEditing] = useState(false);

  const didSyncFromValueRef = useRef(false);

  useEffect(() => {
    if (!isEdit) return;
    if (!value || value.length === 0) return;
    if (didSyncFromValueRef.current) return;

    setItems(normalizeItemsFromValue(value));
    didSyncFromValueRef.current = true;
  }, [isEdit, value]);

  const previewItems = useMemo(() => {
    return items.filter(
      (it) =>
        !!it.title?.trim() ||
        !!it.file ||
        !!it.url?.trim() ||
        !!it.note?.trim()
    );
  }, [items]);

  const handleAddOrEdit = () => {
    setIsEditing(true);
    if (items.length === 0) {
      setItems([blankItem()]);
    }
  };

  const handleSave = (nextItems: PortfolioDocItem[]) => {
    const filtered = nextItems
      .filter(
        (it) =>
          !!it.title?.trim() ||
          !!it.file ||
          !!it.url?.trim() ||
          !!it.note?.trim()
      )
      .map((it) => ({
        ...it,
        id: it.id ?? makeId(),
      }));

    setItems(filtered);
    onChange?.(filtered);
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
    <div
      id="resume__create-section--portfolio"
      className="resume-create-page__section resume-create-page__section--portfolio-documents"
    >
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              포트폴리오ㆍ기타 문서
            </div>
          </div>
        </div>
      </div>

      {previewItems.length > 0 && (
        <div className="resume-portfolio-list">
          {previewItems.map((it) => (
            <div className="resume-portfolio-item" key={it.id}>
              <div className="resume-portfolio-item__main">
                <span className="resume-portfolio-item__source">
                  {it.source === "file" ? (
                    <img src={ic_folder_gray900_20} alt="" />
                  ) : (
                    <img src={ic_link_gray900_20} alt="" />
                  )}
                </span>

                <span className="resume-portfolio-item__label">
                  {it.source === "file"
                    ? it.file?.name || "파일 미선택"
                    : it.url || "URL 미입력"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="resume-create-page__section-action">
        <button
          className="btn_w_full default_btn_white"
          onClick={handleAddOrEdit}
          disabled={isEditing}
          type="button"
        >
          {previewItems.length > 0 ? (
            <>
              <img src={ic_edit_gray900_20} alt="" />
              수정
            </>
          ) : (
            <>
              <img src={ic_add_btn_gray900_20} alt="" />
              추가
            </>
          )}
        </button>
      </div>

      {isEditing && (
        <div className="basic-info-form-overlay">
          <div className="basic-info-form-container">
            <M_PortfolioDocumentsForm
              initialItems={items}
              onSave={handleSave}
              onCancel={handleCancel}
              errors={errors}
            />
          </div>
        </div>
      )}
    </div>
  );
}