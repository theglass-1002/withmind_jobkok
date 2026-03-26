import React from "react";
import DetailMetric from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetric";
import DetailMetricTable from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetricTable";
import ExpressionDonutChart from "@/pages/InterviewReport/analysis/chart/ExpressionDonutChart";

import ic_stars_gray600_20 from "@/assets/icons/size20/ic_stars_gray600_20.png";
import ic_conditions_gray600_20 from "@/assets/icons/size20/ic_conditions_gray600_20.png";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type TableRow = {
  label: string;
  values: (string | number)[];
};

type Props = {
  reportDetail?: InterviewReportDetailResponse | null;
};

export default function ExpressionTabContent({ reportDetail }: Props) {
  const emotion = reportDetail?.tab2?.detailAttitude?.emotion;

  const emotionScore = emotion?.emotionScore ?? 0;
  const emotionGrade = emotion?.emotionGrade ?? "무표정";

  const positive = emotion?.emotionData?.positive ?? 0;
  const negative = emotion?.emotionData?.negative ?? 0;
  const neutral = emotion?.emotionData?.neutral ?? 0;

  const expressionHeaders = ["", "긍정", "부정", "무표정"];

  const expressionRows: TableRow[] = [
    {
      label: reportDetail?.userInfo?.name
        ? `${reportDetail.userInfo.name} 님`
        : "사용자",
      values: [`${positive}%`, `${negative}%`, `${neutral}%`],
    },
  ];

  return (
    <>
      <div className="detail-analysis__attitude-content">
        <div className="detail-analysis__attitude-left expression">
          <ExpressionDonutChart
            value={emotionScore}
            label={emotionGrade}
            size={300}
            stroke={20}
          />
        </div>

        <div className="detail-analysis__attitude-right">
          <DetailMetric
            type="emotion"
            gradeLabel="표정 등급"
            gradeIconSrc={ic_stars_gray600_20}
            gradeOptions={["우수", "보통", "미흡"]}
            className="expression"
            analysisTitle="표정 분석"
            analysisIconSrc={ic_conditions_gray600_20}
            analysisText={
              emotion?.analysisText ?? "표정 변화는 전반적으로 안정적입니다."
            }
            highlight={
              emotion?.detailText ??
              `긍정 ‘${positive}%’, 부정 ‘${negative}%’, 무표정 ‘${neutral}%’`
            }
            reportDetail={reportDetail}
          />
        </div>
      </div>

      <DetailMetricTable
        headers={expressionHeaders}
        rows={expressionRows}
        type="expression"
      />
    </>
  );
}