// src/pages/InterviewReport/analysis/detail/sections/part/GestureTabContent.tsx
import React from "react";
import DetailMetric from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetric";
import DetailMetricTable from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetricTable";

import ic_posture_body from "@/assets/illustrations/ic_posture_body.png";
import ic_arrow_horizontal from "@/assets/illustrations/ic_arrow_horizontal.png";
import ic_arrow_vertical from "@/assets/illustrations/ic_arrow_vertical.png";

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

function formatCount(value?: number | null) {
  return `${value ?? 0}회`;
}

function formatSeconds(value?: number | null) {
  return `${value ?? 0}초`;
}

export default function GestureTabContent({ reportDetail }: Props) {
  const gesture = reportDetail?.tab2?.detailAttitude?.gesture;
  const gestureDataList = gesture?.gestureData?.gesture?.dataList ?? [];

  const meData = gestureDataList[0];
  const totalAverageData = gestureDataList[1];
  const jobAverageData = gestureDataList[2];

  const headers = ["", "평균 횟수", "평균 시간"];

  const rows: TableRow[] = [
    {
      label: "전체 평균",
      values: [
        formatCount(totalAverageData?.handMoveCount),
        formatSeconds(totalAverageData?.handTime),
      ],
    },
    {
      label: "직군 평균",
      values: [
        formatCount(jobAverageData?.handMoveCount),
        formatSeconds(jobAverageData?.handTime),
      ],
    },
  ];

  return (
    <>
      <div className="detail-analysis__attitude-content">
        <div className="detail-analysis__attitude-left">
          <div className="attitude-control">
            <img
              className="attitude-control__image"
              src={ic_posture_body}
              alt="제스처 이미지"
            />

            {/* 좌 / 우 동일하게 handMoveCount 사용 */}
            <div className="attitude-control__overlay_gesture left">
              <span>{formatCount(meData?.handMoveCount)}</span>
            </div>

            <div className="attitude-control__overlay_gesture right">
              <span>{formatCount(meData?.handMoveCount)}</span>
            </div>

            <div className="attitude-control__label-horizontal">
              <span className="attitude-control__label">L</span>
              <span className="attitude-control__label">R</span>
            </div>

            <img
              className="attitude-control__arrows-horizontal"
              src={ic_arrow_horizontal}
              alt=""
            />
            <img
              className="attitude-control__arrows-vertical"
              src={ic_arrow_vertical}
              alt=""
            />
          </div>
        </div>

        <div className="detail-analysis__attitude-right">
          <DetailMetric
            type="gesture"
            gradeLabel="제스처 등급"
            gradeIconSrc={ic_stars_gray600_20}
            gradeOptions={["우수", "보통", "미흡"]}
            className="gesture"
            analysisTitle="제스처 분석"
            analysisIconSrc={ic_conditions_gray600_20}
            reportDetail={reportDetail}
          />
        </div>
      </div>

      <DetailMetricTable headers={headers} rows={rows} type="gesture" />
    </>
  );
}