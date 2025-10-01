import React, { useEffect, useRef, useState } from "react";
import "./PortfolioDocumentsSection.css";

import FormInput from "@/shared/components/form/FormInput";

import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import ic_radio_checked_purple_20 from "@/assets/icons/size20/ic_radio_checked_purple_20.png";
import ic_radio_unchecked_gray400_20 from "@/assets/icons/size20/ic_radio_unchecked_gray400_20.png";
import ic_key_arrow_down_gray500_20 from "@/assets/icons/size20/ic_key_arrow_down_gray500_20.png";
import ic_key_arrow_up_gray500_20 from "@/assets/icons/size20/ic_key_arrow_up_gray500_20.png";
import ic_trash_gray900_20 from "@/assets/icons/size20/ic_trash_gray900_20.png";
import ic_folder_gray900_20 from "@/assets/icons/size20/ic_folder_gray900_20.png";
import ic_link_gray900_20 from "@/assets/icons/size20/ic_link_gray900_20.png";

type SourceType = "file" | "url";

export type PortfolioDocItem = {
  id: string;
  source: SourceType;   // 파일 / URL
  title: string;        // (선택) 문서명 — 현재 UI엔 미노출
  file: File | null;    // 파일 모드일 때
  url: string;          // URL 모드일 때
  note?: string;        // (선택) 설명 — 현재 UI엔 미노출
};

const makeId = () => Math.random().toString(36).slice(2, 10);
const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB

export default function PortfolioDocumentsSection() {
  const [isAdding, setIsAdding] = useState(false);
  const [items, setItems] = useState<PortfolioDocItem[]>([]);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // 섹션 열기/닫기
  const startAdd = () => {
    setIsAdding(true);
    if (items.length === 0) {
      setItems([
        { id: makeId(), source: "file", title: "", file: null, url: "", note: "" },
      ]);
    }
  };
  const stopAdd = () => {
    setIsAdding(false);
    setItems([]);
  };

  // 아이템 조작
  const addItem = () => {
    setItems(prev => [...prev, { id: makeId(), source: "file", title: "", file: null, url: "", note: "" }]);
  };
  const removeItem = (index: number) => {
    setItems(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };
  const moveUp = (index: number) => {
    if (index <= 0) return;
    setItems(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };
  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;
    setItems(prev => {
      const next = [...prev];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      return next;
    });
  };

  // 파일/URL 라디오 전환 (분기처리 핵심)
  const setSource = (index: number, src: SourceType) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = src === "file"
        ? { ...next[index], source: "file", url: "" }   // URL 초기화
        : { ...next[index], source: "url",  file: null }; // 파일 초기화
      return next;
    });
  };

  // 파일 선택
  const openFilePicker = (id: string) => {
    const el = fileInputRefs.current[id];
    if (!el) return;
    el.value = "";  // 같은 파일 다시 선택해도 onChange 발생
    el.click();
  };
  const onFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (f.size > MAX_FILE_BYTES) {
      alert("50MB 이하의 파일만 등록 가능합니다.");
      e.target.value = "";
      return;
    }
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], file: f };
      return next;
    });
  };

  // URL 입력
  const changeUrl = (index: number, v: any) => {
    const value = typeof v === "string" ? v : v?.target?.value ?? "";
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], url: value };
      return next;
    });
  };

  // 섹션 자동 닫힘
  useEffect(() => {
    if (isAdding && items.length === 0) setIsAdding(false);
  }, [items.length, isAdding]);

  // 표시용
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="resume-create-page__section resume-create-page__section--portfolio-documents">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">포트폴리오ㆍ기타 문서</div>
          </div>
          <div className="section-title__right">
            {isAdding ? (
              <img src={ic_close_gray500_20} alt="닫기" onClick={stopAdd} />
            ) : (
              <span className="resume-section-title__action--import" onClick={startAdd}>
                <img src={ic_add_purple_20} alt="" />
                추가
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={`resume-create-page__section-body ${isAdding ? "portfolio-documents-section" : "empty"}`}>
        {isAdding ? (
          <>
            {items.map((item, index) => (
              <div className="portfolio-documents-section__item" key={item.id}>
                <div className="portfolio-documents__fields">

                  <div className="portfolio-documents__source" role="radiogroup" aria-label="업로드 방식 선택">
                    <div
                      className={`portfolio-documents__source-option portfolio-documents__source-option--file ${item.source === "file" ? "is-active" : ""}`}
                      role="radio"
                      aria-checked={item.source === "file"}
                      tabIndex={0}
                      onClick={() => setSource(index, "file")}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSource(index, "file"); } }}
                    >
                      <img
                        className="portfolio-documents__source-icon"
                        src={item.source === "file" ? ic_radio_checked_purple_20 : ic_radio_unchecked_gray400_20}
                        alt=""
                      />
                      <span className="portfolio-documents__source-label">파일</span>
                    </div>

                    <div
                      className={`portfolio-documents__source-option portfolio-documents__source-option--url ${item.source === "url" ? "is-active" : ""}`}
                      role="radio"
                      aria-checked={item.source === "url"}
                      tabIndex={0}
                      onClick={() => setSource(index, "url")}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSource(index, "url"); } }}
                    >
                      <img
                        className="portfolio-documents__source-icon"
                        src={item.source === "url" ? ic_radio_checked_purple_20 : ic_radio_unchecked_gray400_20}
                        alt=""
                      />
                      <span className="portfolio-documents__source-label">URL</span>
                    </div>
                  </div>

                  {item.source === "file" ? (
                    <div className="portfolio-documents__uploader">
                      <label className="portfolio-documents__label small_labe_black-14">
                        파일 <em className="error_text_red">*</em>
                      </label>

                      {/* 숨김 파일 input (아이템별 ref) */}
                      <input
                        type="file"
                        ref={(el) => (fileInputRefs.current[item.id] = el)}
                        style={{ display: "none" }}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.png,.jpg,.jpeg,.gif"
                        onChange={(e) => onFileChange(index, e)}
                      />

                      <div className="portfolio-documents__file">
                        <div className={`portfolio-documents__file-name ${item.file ? "" : "portfolio-documents__file-name--empty"}`}>
                          <img src={ic_folder_gray900_20} alt="" />
                          {item.file ? (
                            <>
                              <span className="portfolio-documents__file-text">{item.file.name}</span>
                              <span className="portfolio-documents__file-size">{formatBytes(item.file.size)}</span>
                            </>
                          ) : (
                            <>선택된 파일이 없습니다</>
                          )}
                        </div>

                        <span
                          className="default_btn_white"
                          role="button"
                          tabIndex={0}
                          onClick={() => openFilePicker(item.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openFilePicker(item.id);
                            }
                          }}
                        >
                          파일 선택
                        </span>
                      </div>

                      <span className="portfolio-documents__hint">※ 50MB 이하의 파일만 등록 가능합니다.</span>
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
                        id={`portfolio_doc_url_${item.id}`}
                        value={item.url}
                        onChange={(v: any) => changeUrl(index, v)}
                      />
                    </div>
                  )}
                </div>
                <div className="portfolio-documents__controls">
                  <span
                    className="portfolio-documents__control-btn portfolio-documents__control--up"
                    onClick={() => moveUp(index)}
                    aria-label="위로"
                    role="button"
                    tabIndex={0}
                  >
                    <img src={ic_key_arrow_up_gray500_20} alt="" />
                  </span>
                  <span
                    className="portfolio-documents__control-btn portfolio-documents__control--down"
                    onClick={() => moveDown(index)}
                    aria-label="아래로"
                    role="button"
                    tabIndex={0}
                  >
                    <img src={ic_key_arrow_down_gray500_20} alt="" />
                  </span>
                  <span
                    className="portfolio-documents__control-btn portfolio-documents__control--remove"
                    onClick={() => removeItem(index)}
                    aria-label="삭제"
                    role="button"
                    tabIndex={0}
                  >
                    <img src={ic_trash_gray900_20} alt="" />
                  </span>
                </div>
              </div>
            ))}

            <span className="default_btn_white" onClick={addItem} role="button" tabIndex={0}>
              <img src={ic_add_btn_gray900_20} alt="" />
              추가
            </span>
          </>
        ) : (
          <>포트폴리오ㆍ기타 문서를 추가해 주세요.</>
        )}
      </div>
    </div>
  );
}
