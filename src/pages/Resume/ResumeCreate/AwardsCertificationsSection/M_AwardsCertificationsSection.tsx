// src/pages/.../AwardsCertificationsSection/M_AwardsCertificationsSection.tsx
import React, { useState } from "react";
import "./AwardsCertificationsSection.css";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";

import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import M_AwardsCertificationsForm from "./Form/M_AwardsCertificationsForm";

export type AwardsCertItem = {
  id: string;
  kind: "Award" | "Certification" | "License" | null;
  end?:string;
  title: string;
  dateValue?: string; // YYYY.MM
  score?: string;
  issuer?: string;
};

const makeId = () => Math.random().toString(36).slice(2, 10);

const blankItem = (): AwardsCertItem => ({
  id: makeId(),
  kind: null,
  end:"",
  title: "",
  dateValue: "",
  score: "",
  issuer: "",
});

const kindLabelMap: Record<NonNullable<AwardsCertItem["kind"]>, string> = {
  Award: "[수상]",
  Certification: "[자격증]",
  License: "[면허]",
};

const getKindLabel = (kind: AwardsCertItem["kind"]) =>
  kind ? kindLabelMap[kind] : "";

export default function M_AwardsCertificationsSection() {
  const [items, setItems] = useState<AwardsCertItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddOrEdit = () => {
    setIsEditing(true);
    if (items.length === 0) {
      setItems([blankItem()]);
    }
  };

  const handleSave = (nextItems: AwardsCertItem[]) => {
    setItems(nextItems);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="resume-create-page__section resume-create-page__section--awards-certifications">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              수상ㆍ자격증
            </div>
          </div>
        </div>
      </div>


      {items.length > 0 && (
        <div className="resume-awards-list resume-career-list">
          {items.map((it) => (
            console.log(it),
               <div className="resume-award-item resume-career-item" key={it.id}>
               <div className="resume-award-item__header resume-career-item__header">
                
                <span className="resume-award-item__title resume-career-item__company">
                {getKindLabel(it.kind)}   {it.title}
                 </span>
               
            
            
   
                 <div className="resume-award-item__meta resume-career-item__meta">
                   <span className="resume-award-item__period resume-career-item__period resume-career-item__period--stack">
                     <div className="resume-award-item__period-range resume-career-item__period-range">
                       {it.dateValue&&(
                          <span className="resume-award-item__period-start resume-career-item__period-start">
                          {it.dateValue}
                        </span>
                       )}
                     
                       {it.end && (
                         <>
                           <span className="resume-award-item__period-sep resume-career-item__period-sep">
                             {" "}
                             ~{" "}
                           </span>
                           <span className="resume-award-item__period-end resume-career-item__period-end">
                             {it.end}
                           </span>
                         </>
                       )}
                     </div>
                   </span>
                   {it.score && (
                     <span className="resume-award-item__score">{it.score}</span>
                   )}
                   {it.issuer && (
                     <span className="resume-award-item__issuer">{it.issuer}</span>
                   )}
                 </div>
               </div>
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
          {items.length>0?
          <>
          <img src={ic_edit_gray900_20} alt="" />
          수정
          </>:<>
          <img src={ic_add_btn_gray900_20} alt="" />
          추가
          </>}
          {/* <img src={ic_add_btn_gray900_20} alt="" />
          {items.length > 0 ? "수정" : "추가"} */}
        </button>
      </div>

      {/* 오버레이 폼 */}
      {isEditing && (
        <div className="basic-info-form-overlay">
          <div className="basic-info-form-container">
            <M_AwardsCertificationsForm
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
