// src/pages/MockInterview/my-report/part/JobMatchHistoryPanel.tsx
import React from "react";
import JobCardV2List, { type JobCardV2Item } from "./JobCardV2List";

interface JobMatchHistoryPanelProps {
  titleIconSrc: string;
  title: string;
  items: JobCardV2Item[];
  viewAllIconSrc: string;
  onClickViewAll?: () => void;
  onToggleFavorite?: (id: string | number) => void; // ← 추가
}
export default function JobMatchHistoryPanel({
  titleIconSrc,
  title,
  items,
  viewAllIconSrc,
  onClickViewAll,
  onToggleFavorite, // ← 추가
}: JobMatchHistoryPanelProps) {
  return (
    <>
      <span className="mock-interview__title mock-interview-summary__panel-title">
        <img src={titleIconSrc} alt="" />
        {title}
      </span>

      <JobCardV2List
        items={items}
        viewAllIconSrc={viewAllIconSrc}
        onClickViewAll={onClickViewAll}
        onToggleFavorite={onToggleFavorite} //  전달
      />
    </>
  );
}
