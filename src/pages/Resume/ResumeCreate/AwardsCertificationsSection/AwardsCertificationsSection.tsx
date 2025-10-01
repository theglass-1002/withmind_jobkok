import React, { useEffect, useRef, useState } from "react";
import "./AwardsCertificationsSection.css";


import FormInput from "@/shared/components/form/FormInput";

import DateInline from "@/shared/components/form/DateInline";
import icon_calendar_red_20 from '@/assets/icons/size20/icon_calendar_red_20.png';
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_calendar_gray900_20 from '@/assets/icons/size20/ic_calendar_gray900_20.png';
import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import ic_key_arrow_down_gray500_20 from "@/assets/icons/size20/ic_key_arrow_down_gray500_20.png";
import ic_key_arrow_up_gray500_20 from "@/assets/icons/size20/ic_key_arrow_up_gray500_20.png";
import ic_trash_gray900_20 from "@/assets/icons/size20/ic_trash_gray900_20.png";
import ic_star_gray700_20 from '@/assets/icons/size20/ic_star_gray700_20.png';

export type AwardsCertItem = {
    id: string;
    kind: "Award" | "Certification" | "License" | null; // 구분
    title: string;             // 수상ㆍ자격증명
    dateValue?: string;        // YYYY.MM
    score?: string;            // 성적/점수
    issuer?: string;           // 발행처/기관
    credentialId?: string;     // (선택) 자격번호
    expiresOn?: string;        // (선택) 만료일 YYYY.MM
    noExpiry?: boolean;        // (선택) 만료없음
  };
const makeId = () => Math.random().toString(36).slice(2, 10);

export default function AwardsCertificationsSection() {
   
  const [isAdding, setIsAdding] = useState(false);
  const [items, setItems] = useState<AwardsCertItem[]>([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  // 드롭다운 바깥 클릭 감지용 refs
  const selectRefs = useRef<(HTMLDivElement | null)[]>([]);

  const startAdd = () => {
    setIsAdding(true);
    if (items.length === 0) {
      setItems([{ id: makeId(), activityType: null, activityName: "" }]);
    }
  };

  const stopAdd = () => {
    setIsAdding(false);
    setItems([]);
    setOpenDropdownIndex(null);
  };

  const addItem = () => {
    setItems(prev => [...prev, { id: makeId(), activityType: null, activityName: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    setOpenDropdownIndex(cur => (cur === index ? null : cur));
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

  const selectType = (index: number, val: string) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], activityType: val };
      return next;
    });
    setOpenDropdownIndex(null);
  };

  const changeName = (index: number, v: any) => {
    const value = typeof v === "string" ? v : v?.target ? v.target.value : "";
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], activityName: value };
      return next;
    });
  };



  // 바깥 클릭 시 열려있는 드롭다운 닫기
  useEffect(() => {
    if (openDropdownIndex === null) return;

    const onDocClick = (e: MouseEvent) => {
      const ref = selectRefs.current[openDropdownIndex];
      if (!ref) return;
      if (!ref.contains(e.target as Node)) setOpenDropdownIndex(null);
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openDropdownIndex]);

  // 모든 아이템 제거되면 섹션 닫기
  useEffect(() => {
    if (isAdding && items.length === 0) setIsAdding(false);
  }, [items.length, isAdding]);

  return (
    <div className="resume-create-page__section resume-create-page__section--awards-certifications">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">수상ㆍ자격증</div>
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

      <div
        className={`resume-create-page__section-body ${
          isAdding ? "awards-certifications-section" : "empty"
        }`}
      >
        {isAdding ? (
          <>
            {items.map((item, index) => (
              <div className="awards-certifications-section__item" key={item.id}>
                <div className="awards-certifications-section__fields">
                  <div className="awards-certifications-section__group">
                    <div className="awards-certifications-section__control">
                      <label className="small_labe_black-14">
                        수상ㆍ자격증명 <em className="error_text_red">*</em>
                      </label>

                      {/* 드롭다운 */}
                      <div
                        className="ui-select"
                        ref={el => (selectRefs.current[index] = el)}
                        role="combobox"
                        aria-expanded={openDropdownIndex === index}
                        tabIndex={0}
                        onClick={() =>
                          setOpenDropdownIndex(cur => (cur === index ? null : index))
                        }
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setOpenDropdownIndex(cur => (cur === index ? null : index));
                          }
                          if (e.key === "Escape") setOpenDropdownIndex(null);
                        }}
                      >
                        {item.activityType ?? (
                          <span className="ui-select-none-default">구분</span>
                        )}
                        <img src={ic_arrow_drop_down_gray900_24} alt="" />

                        {openDropdownIndex === index && (
                          <div
                            className="ui-select__menu"
                            role="listbox"
                            onClick={e => e.stopPropagation()}
                          >
                            {["교내활동", "인턴", "자원봉사", "동아리","사회활동","수행과제","해외연수","교육이수내역"].map(opt => (
                              <div
                                key={opt}
                                className="ui-select__option"
                                role="option"
                                onClick={e => {
                                  e.stopPropagation(); 
                                  selectType(index, opt);
                                }}
                                onKeyDown={e => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    selectType(index, opt);
                                  }
                                }}
                                tabIndex={0}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 활동명 입력 */}
                    <FormInput
                      placeholder="수상ㆍ자격증명을 입력해 주세요."
                      inputClassName="awards-certifications_name"
                      id={`awards-certifications_name${item.id}`}
                      value={item.credentialId??""}
                      onChange={(v: any) => changeName(index, v)}
                    />
                  </div>
                  <div className="awards-certifications-period">
                    <label className="awards-certifications-period__label small_labe_black-14">
                        수상ㆍ취득 정보 
                    </label>

                    <div className="awards-certifications-period__fields">
                        <div className="awards-certifications-period__field">
                            <DateInline
                            id="awards-certifications"
                            iconSrc={ic_calendar_gray900_20}
                            value={"YYYY.MM"}
                            onClick={() => {/* date picker open */}}
                            invalid={false}
                        
        
                            />
                        </div>
                        <FormInput
                            placeholder="성적을 입력해 주세요."
                            inputClassName="awards-certifications__score"
                            id={`awards_score_${item.id}`}
                            value={item.score ?? ""}
                            onChange={(v: any) => {
                                const val = typeof v === "string" ? v : v?.target?.value ?? "";
                                setItems(prev => {
                                const next = [...prev];
                                next[index] = { ...next[index], score: val };
                                return next;
                                });
                            }}
                            />
                      <FormInput
                        placeholder="발행처ㆍ기관을 입력해 주세요."
                        inputClassName="awards-certifications__issuer"
                        id={`awards_issuer_${item.id}`}
                        value={item.issuer ?? ""}
                        onChange={(v: any) => {
                            const val = typeof v === "string" ? v : v?.target?.value ?? "";
                            setItems(prev => {
                            const next = [...prev];
                            next[index] = { ...next[index], issuer: val };
                            return next;
                            });
                        }}
                        />
                    </div>
                    
                    </div>
                    
                </div>

                {/* 아이템 컨트롤 */}
                <div className="awards-certifications-section__controls">
                  <span
                    className="awards-certifications-section__control_btn awards-certifications-section__control--up"
                    onClick={() => moveUp(index)}
                    aria-label="위로"
                    role="button"
                    tabIndex={0}
                  >
                    <img src={ic_key_arrow_up_gray500_20} alt="" />
                  </span>
                  <span
                    className="awards-certifications-section__control_btn awards-certifications-section__control--down"
                    onClick={() => moveDown(index)}
                    aria-label="아래로"
                    role="button"
                    tabIndex={0}
                  >
                    <img src={ic_key_arrow_down_gray500_20} alt="" />
                  </span>
                  <span
                    className="awards-certifications-section__control_btn awards-certifications-section__control--remove"
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
          <>수상ㆍ자격증을 추가해 주세요..</>
        )}
      </div>
    </div>
  );
}
