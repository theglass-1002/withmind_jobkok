import React from "react";
import KpiOverview from "./part/KpiOverview";
import MockAnalysisKpiFit from "./part/MockAnalysisKpiFit";

import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  reportDetail: InterviewReportDetailResponse | null;
};

export default function KpiOverviewSection({ reportDetail }: Props) {
  return (
    <div className="mock-analysis-overview__kpi">
      <KpiOverview reportDetail={reportDetail} />
      <MockAnalysisKpiFit reportDetail={reportDetail} />
    </div>
  );
}