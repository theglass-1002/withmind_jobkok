import React from "react";
import Pagination from "@/shared/components/Pagination";
import M_MockInterviewHistoryRow from "./M_MockInterviewHistoryRow";

export type M_InterviewReportHistoryItemData = {
  id: string | number;
  no: string | number;
  title: string;
  avatarSrc: string;
  scoreText: string;
  roleText: string;
  dateText: string;
  statusText: string;
  statusState?: "done" | "doing";
  resumeLabelIconSrc: string;
  resumeText: string;
  resumeDate: string;
  onClickView?: () => void;
};

interface M_InterviewReportHistoryListProps {
  sortIconSrc: string;
  viewIconSrc: string;
  items: M_InterviewReportHistoryItemData[];
  page: number;
  totalPages: number;
  onChangePage: (p: number) => void;
  pageWindow?: number;
  prevIcon: React.ReactNode;
  nextIcon: React.ReactNode;
}

export default function M_InterviewReportHistoryList({
  sortIconSrc,
  viewIconSrc,
  items,
  page,
  totalPages,
  onChangePage,
  pageWindow = 5,
  prevIcon,
  nextIcon,
}: M_InterviewReportHistoryListProps) {
  return (
    <>
        <div className="mock-history__body data-list__body">
          {items.map((it) => (
            <M_MockInterviewHistoryRow key={it.id} item={it} viewIconSrc={viewIconSrc} />
          ))}
        </div>


      <Pagination
        current={page}
        total={totalPages}
        onChange={onChangePage}
        pageWindow={pageWindow}
        prevIcon={prevIcon}
        nextIcon={nextIcon}
      />
    </>
  );
}
