import React from "react";
import ic_magnifier_24 from "@/assets/icons/size24/ic_magnifier_24.png";
import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";
import KpiOverview from "./part/KpiOverview";
import MockAnalysisKpiFit from "./part/MockAnalysisKpiFit";

import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  reportDetail: InterviewReportDetailResponse | null;
};

export default function KpiOverviewSection({ reportDetail }: Props) {
  const score = reportDetail?.overallScore?.myScore ?? 0;
  const totalCandidates = reportDetail?.overallScore?.totalCount ?? 0;
  const percentile = reportDetail?.overallScore?.topPercent ?? 0;
  const fit = reportDetail?.jobFitInfo?.jobFitScore ?? 0;
  const fitText =
  reportDetail?.jobFitInfo?.jobFitText ?? "직군";
  const fitDescription =
    reportDetail?.jobFitInfo?.jobFitFeedback ?? "직무 적합도 분석 결과가 없습니다.";


  return (
    <div className="mock-analysis-overview__kpi">
      <KpiOverview
          score={score}
          totalCandidates={totalCandidates}
          percentile={percentile}
          reportDetail={reportDetail}
      />
      <MockAnalysisKpiFit
        value={fit}
        roleLabel={fitText}
        headIconSrc={ic_magnifier_24}
        noteIconSrc={ic_error_gray500_20}
        description={fitDescription}
      />
    </div>
  );
}