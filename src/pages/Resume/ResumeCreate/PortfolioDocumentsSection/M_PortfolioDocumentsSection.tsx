import React, { useEffect, useMemo, useState } from "react";
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
  filePath?: string;
  fileIdx?: number;
};

export type PortfolioDocErrors = Partial<Record<keyof PortfolioDocItem, string>>;

type PortfolioValueItem = {
  id?: string;
  source?: SourceType;
  title?: string;
  file?: File | null;
  url?: string;
  note?: string;

  itemType?: "FILE" | "URL";
  description?: string;
  filePath?: string;
  fileIdx?: number;
};

interface M_PortfolioDocumentsSectionProps {
  value?: PortfolioValueItem[];
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
  filePath: "",
  fileIdx: undefined,
});

const normalizeItemsFromValue = (
  value: PortfolioValueItem[] = []
): PortfolioDocItem[] => {
  if (!value || value.length === 0) return [];

  return value.map((item) => {
    const source: SourceType =
      item.source ?? (item.itemType === "URL" ? "url" : "file");

    return {
      id: item.id ?? String(item.fileIdx ?? makeId()),
      source,
      title: item.title ?? "",
      file: item.file ?? null,
      url: item.url ?? "",
      note: item.note ?? item.description ?? "",
      filePath: item.filePath ?? "",
      fileIdx: item.fileIdx,
    };
  });
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

  useEffect(() => {
    if (!isEdit) return;
    setItems(normalizeItemsFromValue(value));
  }, [isEdit, value]);

  const previewItems = useMemo(() => {
    return items.filter(
      (item) =>
        !!item.title?.trim() ||
        !!item.file ||
        !!item.url?.trim() ||
        !!item.note?.trim() ||
        !!item.filePath?.trim()
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
        (item) =>
          !!item.title?.trim() ||
          !!item.file ||
          !!item.url?.trim() ||
          !!item.note?.trim() ||
          !!item.filePath?.trim()
      )
      .map((item) => ({
        ...item,
        id: item.id ?? makeId(),
      }));

    setItems(filtered);
    onChange?.(filtered);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (isEdit) {
      setItems(normalizeItemsFromValue(value));
    }
    setIsEditing(false);
  };

  const getPreviewLabel = (item: PortfolioDocItem) => {
    if (item.source === "file") {
      return item.file?.name || item.title || "파일 미선택";
    }

    return item.url || item.title || "URL 미입력";
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
          {previewItems.map((item) => (
            <div className="resume-portfolio-item" key={item.id}>
              <div className="resume-portfolio-item__main">
                <span className="resume-portfolio-item__source">
                  {item.source === "file" ? (
                    <img src={ic_folder_gray900_20} alt="" />
                  ) : (
                    <img src={ic_link_gray900_20} alt="" />
                  )}
                </span>

                <span className="resume-portfolio-item__label">
                  {getPreviewLabel(item)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="resume-create-page__section-action">
        <button
          type="button"
          className="btn_w_full default_btn_white"
          onClick={handleAddOrEdit}
          disabled={isEditing}
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