// src/pages/.../ResumeSummarySection.tsx
import React from "react";
import ic_check_mark_24 from "@/assets/icons/size24/ic_check_mark_24.png";
import ic_tooltip_gray600_20 from "@/assets/icons/size20/ic_tooltip_gray600_20.png";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  reportDetail?: InterviewReportDetailResponse | null;
};

export default function ResumeSummarySection({ reportDetail }: Props) {
  const resumeAnalysis = reportDetail?.tab3?.resumeAnalysis;

  const overallComment =
    resumeAnalysis?.overallComment ??
    "이력서 전반에 대한 평가가 표시됩니다.";

  const overallDescription =
    resumeAnalysis?.overallDescription ??
    "이력서 분석 결과가 여기에 표시됩니다.";

  return (
    <div className="report-section report-section--sum">
      <span className="report-section__title">
        <img
          className="report-section--sum_icon"
          src={ic_check_mark_24}
          alt=""
        />
        이력서 종합 평가
      </span>

      <div className="summary__content">
        <span className="summary__key-takeaway">
          {overallComment}
        </span>

        <div className="summary__detail-container">
          <span className="summary__detail-title">
            <img
              className="summary__detail_icon"
              src={ic_tooltip_gray600_20}
              alt=""
            />
            해설
          </span>

          <span className="summary__detail-text">
          {overallDescription}
          </span>
        </div>
      </div>
    </div>
  );
}