import React from "react";
import Pagination from "@/shared/components/Pagination";
import MockInterviewHistoryRow from "./MockInterviewHistoryRow";

export type InterviewReportHistoryItemData = {
  id: string | number;
  no: string | number;
  title: string;
  avatarSrc: string;
  scoreText: string;
  roleText: string;
  dateText: string;
  statusText: string;
  statusState?: "done" | "doing" | "analyzing";
  resumeLabelIconSrc: string;
  resumeText: string;
  resumeDate: string;
  onClickView?: () => void;
};

interface InterviewReportHistoryListProps {
  sortIconSrc: string;
  viewIconSrc: string;
  items: InterviewReportHistoryItemData[];
  page: number;
  totalPages: number;
  onChangePage: (p: number) => void;
  pageWindow?: number;
  prevIcon: React.ReactNode;
  nextIcon: React.ReactNode;
}

export default function InterviewReportHistoryList({
  sortIconSrc,
  viewIconSrc,
  items,
  page,
  totalPages,
  onChangePage,
  pageWindow = 5,
  prevIcon,
  nextIcon,
}: InterviewReportHistoryListProps) {
  return (
    <div className="mock-history data-list">
      <div className="mock-history__wrap">
        <div className="mock-history__head data-list__head">
          <span className="mock-history__col mock-history__col--no     data-list__col u-col--w100">NO</span>
          <span className="mock-history__col mock-history__col--spacer data-list__col u-col--w120" />
          <span className="mock-history__col mock-history__col--score  data-list__col u-col--w160">
            <div className="mock-history__head-in">
              <span className="mock-history__head-label">종합점수</span>
              <img className="mock-history__sort-icon" src={sortIconSrc} alt="" />
            </div>
          </span>
          <span className="mock-history__col mock-history__col--role   data-list__col u-col--w231">
            <div className="mock-history__head-in">
              <span className="mock-history__head-label">희망직무</span>
              <img className="mock-history__sort-icon" src={sortIconSrc} alt="" />
            </div>
          </span>
          <span className="mock-history__col mock-history__col--date   data-list__col u-col--w220">
            <div className="mock-history__head-in">
              <span className="mock-history__head-label">면접일자</span>
              <img className="mock-history__sort-icon" src={sortIconSrc} alt="" />
            </div>
          </span>
          <span className="mock-history__col mock-history__col--status data-list__col u-col--w160">
            <div className="mock-history__head-in">
              <span className="mock-history__head-label">상태</span>
              <img className="mock-history__sort-icon" src={sortIconSrc} alt="" />
            </div>
          </span>
          <span className="mock-history__col mock-history__col--action data-list__col u-col--w210" />
        </div>

        <div className="mock-history__body data-list__body">
          {items.map((it) => (
            <MockInterviewHistoryRow key={it.id} item={it} viewIconSrc={viewIconSrc} />
          ))}
        </div>
      </div>

      <Pagination
        current={page}
        total={totalPages}
        onChange={onChangePage}
        pageWindow={pageWindow}
        prevIcon={prevIcon}
        nextIcon={nextIcon}
      />
    </div>
  );
}
