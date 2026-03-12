import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ActivitiesSection.css";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import M_ActivitiesForm from "./Form/M_ActivitiesForm";
import { formatMonthStringToDisplay } from "@/shared/utils/util";

export type ActivityItem = {
  id?: string;
  category: string | null;
  activityName: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
};

export type ActivityErrors = Partial<Record<keyof ActivityItem, string>>;

interface M_ActivitiesSectionProps {
  value?: ActivityItem[];
  onChange?: (activities: ActivityItem[]) => void;
  errors?: ActivityErrors[];
  onFocusAny?: () => void;
  isEdit?: boolean;
}

const makeId = () => Math.random().toString(36).slice(2, 10);

const normalizeItemsFromValue = (value: ActivityItem[]): ActivityItem[] => {
  if (!value || value.length === 0) return [];
  return value.map((it) => ({
    ...it,
    id: it.id ?? makeId(),
  }));
};

export default function M_ActivitiesSection({
  value = [],
  onChange,
  errors = [],
  onFocusAny,
  isEdit = false,
}: M_ActivitiesSectionProps) {
  const [items, setItems] = useState<ActivityItem[]>(() =>
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
        !!it.category ||
        !!it.activityName?.trim() ||
        !!it.startDate?.trim() ||
        !!it.endDate?.trim() ||
        !!it.summary?.trim()
    );
  }, [items]);

  const handleAddOrEdit = () => {
    onFocusAny?.();
    setIsEditing(true);

    if (items.length === 0) {
      setItems([
        {
          id: makeId(),
          category: null,
          activityName: "",
          summary: "",
        },
      ]);
    }
  };

  const handleSave = (nextItems: ActivityItem[]) => {
    const filtered = nextItems
      .filter(
        (it) =>
          !!it.category ||
          !!it.activityName?.trim() ||
          !!it.startDate?.trim() ||
          !!it.endDate?.trim() ||
          !!it.summary?.trim()
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

  return (
   
    <div
      id="resume__create-section--activities"
      className="resume-create-page__section resume-create-page__section--activities"
    >
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">
              활동ㆍ경험
            </div>
          </div>
        </div>
      </div>

      {previewItems.length > 0 && (
        <div className="resume-activity-list resume-career-list">
          {previewItems.map((it) => (
            <div className="resume-activity-item resume-career-item" key={it.id}>
              <div className="resume-activity-item__header resume-career-item__header">
                <span className="resume-activity-item__title resume-career-item__company">
                  {it.category && (
                    <>
                      <span className="resume-activity-item__type">
                        [{it.category}]
                      </span>{" "}
                    </>
                  )}
                  {it.activityName}
                </span>
              </div>

              <div className="resume-activity-item__meta resume-career-item__meta">
                <span className="resume-activity-item__period resume-career-item__period resume-career-item__period--stack">
                  <div className="resume-activity-item__period-range resume-career-item__period-range">
                    <span className="resume-activity-item__period-start resume-career-item__period-start">
                      {formatMonthStringToDisplay(it.startDate)}
                    </span>
                    {it.endDate && (
                      <>
                        <span className="resume-activity-item__period-sep resume-career-item__period-sep">
                          {" "}
                          ~{" "}
                        </span>
                        <span className="resume-activity-item__period-end resume-career-item__period-end">
                          {formatMonthStringToDisplay(it.endDate)}
                        </span>
                      </>
                    )}
                  </div>
                </span>
              </div>

              {it.summary && it.summary.trim().length > 0 && (
                <ul className="resume-activity-item__bullets resume-career-item__bullets">
                  <li>{it.summary}</li>
                </ul>
              )}
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
            <M_ActivitiesForm
              initialItems={items}
              onSave={handleSave}
              onCancel={handleCancel}
              errors={errors}
              onFocusAny={onFocusAny}
            />
          </div>
        </div>
      )}
    </div>
  );
}