// src/pages/.../ActivitiesSection/M_ActivitiesSection.tsx
import React, { useState } from "react";
import "./ActivitiesSection.css";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import M_ActivitiesForm from "./Form/M_ActivitiesForm";

export type ActivityItem = {
  id: string;
  activityType: string | null;
  activityName: string;
  startDate?: string; // "YYYY.MM"
  endDate?: string;
  summary?: string;
};

const makeId = () => Math.random().toString(36).slice(2, 10);

export default function M_ActivitiesSection() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddOrEdit = () => {
    setIsEditing(true);
    if (items.length === 0) {
      setItems([{ id: makeId(), activityType: null, activityName: "", summary: "" }]);
    }
  };

  const handleSave = (nextItems: ActivityItem[]) => {
    setItems(nextItems);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div
    id='resume__create-section--activities'
    className="resume-create-page__section resume-create-page__section--activities">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">활동ㆍ경험</div>
          </div>
        </div>
      </div>

      {/* 미리보기 카드 */}
      {items.length > 0 && (
        <div className="resume-activity-list resume-career-list">
        {items.map((it) => (
            <div className="resume-activity-item resume-career-item" key={it.id}>
            <div className="resume-activity-item__header resume-career-item__header">
              <span className="resume-activity-item__title resume-career-item__company">
                {it.activityName}
              </span>

              <div className="resume-activity-item__meta resume-career-item__meta">
                <span className="resume-activity-item__period resume-career-item__period resume-career-item__period--stack">
                  <div className="resume-activity-item__period-range resume-career-item__period-range">
                    <span className="resume-activity-item__period-start resume-career-item__period-start">
                      {it.startDate}
                    </span>
                    {it.endDate && (
                      <>
                        <span className="resume-activity-item__period-sep resume-career-item__period-sep">
                          {" "}
                          ~{" "}
                        </span>
                        <span className="resume-activity-item__period-end resume-career-item__period-end">
                          {it.endDate}
                        </span>
                      </>
                    )}
                  </div>
                </span>
              </div>
            </div>

            {it.summary && it.summary.length > 0 && (
              <ul className="resume-activity-item__bullets resume-career-item__bullets">
               {it.summary}
              </ul>
            )}
          </div>
        ))}
      </div>
      // <div className="resume-create-page__section-body activities-preview">
        //   {items.map((item) => (
        //     <div className="resume-field__value resume-activities" key={item.id}>
        //       <div className="resume-activities__header">
        //         {item.activityType && (
        //           <span className="resume-activities__type">{item.activityType}</span>
        //         )}
        //         <span className="resume-activities__name">
        //           {item.activityName || "활동ㆍ경험명 미입력"}
        //         </span>
        //       </div>
        //       <div className="resume-activities__meta">
        //         <span className="resume-activities__period">
        //           {item.startDate || "YYYY.MM"} ~ {item.endDate || "YYYY.MM"}
        //         </span>
        //       </div>
        //       {item.summary && item.summary.trim().length > 0 && (
        //         <div className="resume-activities__summary">
        //           {item.summary.length > 100
        //             ? `${item.summary.slice(0, 100)}...`
        //             : item.summary}
        //         </div>
        //       )}
        //     </div>
        //   ))}
        // </div>
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
            <M_ActivitiesForm
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
