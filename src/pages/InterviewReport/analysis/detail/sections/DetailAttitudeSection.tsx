import React, { useState } from "react";
import LevelGraph from "@/pages/InterviewReport/analysis/chart/LevelGraph";

import AttitudeTabContent from "@/pages/InterviewReport/analysis/detail/sections/part/AttitudeTabContent";
import GazeTabContent from "@/pages/InterviewReport/analysis/detail/sections/part/GazeTabContent";
import GestureTabContent from "@/pages/InterviewReport/analysis/detail/sections/part/GestureTabContent";
import ExpressionTabContent from "@/pages/InterviewReport/analysis/detail/sections/part/ExpressionTabContent";

import UiFilter, {
  type UiFilterOption,
} from "@/shared/components/ui-filter/UiFilter";

import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  score?: number;
  title?: string;
  titleIconSrc?: string;
  description?: string;
  faceAngle?: number;
  bodyAngle?: number;
  reportDetail?: InterviewReportDetailResponse | null;
};

type GradeText = "우수" | "보통" | "미흡";

function normalizeGrade(value?: string): GradeText {
  switch (value) {
    case "우수":
    case "보통":
    case "미흡":
      return value;
    default:
      return "보통";
  }
}

export default function DetailAttitudeSection({
  score,
  title = "태도 분석",
  titleIconSrc,
  description,
  faceAngle,
  bodyAngle,
  reportDetail,
}: Props) {
  const FILTERS: UiFilterOption[] = [
    { label: "자세", value: "attitude" },
    { label: "시선", value: "gaze" },
    { label: "제스처", value: "gesture" },
    { label: "표정", value: "expression" },
  ];

  const [selectedQuestion, setSelectedQuestion] = useState<string>(
    FILTERS[0].value
  );

  const detailAttitude = reportDetail?.tab2?.detailAttitude;
  const posture = detailAttitude?.posture;

  const resolvedScore = score ?? detailAttitude?.attitudeTotalScore ?? 0;

  const resolvedDescription =
    description ??
    detailAttitude?.attitudeFeedBack ??
    "눈 맞춤과 고른 발성으로 자신감과 안정감을 전달하였습니다.";

  const postureAngleData =
    posture?.postureShoulderAngleData?.postureAngle?.dataList ?? [];
  const shoulderMovementData =
    posture?.postureShoulderAngleData?.shoulderMovement?.dataList ?? [];

  const resolvedFaceAngle = faceAngle ?? postureAngleData[0]?.faceAngle ?? 0;
  const resolvedBodyAngle =
    bodyAngle ?? postureAngleData[0]?.shoulderAngle ?? 0;

  const totalMovementCount = shoulderMovementData.reduce((sum, item) => {
    return (
      sum +
      (item.centerMoveCount ?? 0) +
      (item.leftMoveCount ?? 0) +
      (item.rightMoveCount ?? 0)
    );
  }, 0);

  const avgFaceAngle =
    postureAngleData.length > 0
      ? postureAngleData.reduce((sum, item) => sum + (item.faceAngle ?? 0), 0) /
        postureAngleData.length
      : 0;

  const avgShoulderAngle =
    postureAngleData.length > 0
      ? postureAngleData.reduce(
          (sum, item) => sum + (item.shoulderAngle ?? 0),
          0
        ) / postureAngleData.length
      : 0;

  const attitudeHeaders = ["", "머리 각도", "어깨 각도", "좌우 움직임"];
  const attitudeRows = [
    {
      label: "전체 평균",
      values: [
        `${avgFaceAngle.toFixed(2)}도`,
        `${avgShoulderAngle.toFixed(2)}도`,
        `${totalMovementCount}회`,
      ],
    },
  ];

  const attitudeSelectedGrade = normalizeGrade(posture?.postureGrade);

  return (
    <div className="analysis-section detail-analysis__attitude">
      <span className="analysis-section__title">
        {titleIconSrc && <img src={titleIconSrc} alt="" />} {title}
      </span>

      <div className="analysis-section__body">
        <LevelGraph
          score={resolvedScore}
          description={resolvedDescription}
          reportDetail={reportDetail}
          type="attitude"
        />

        <div className="detail-analysis__attitude">
          <UiFilter
            options={FILTERS}
            value={selectedQuestion}
            onChange={(v) => setSelectedQuestion(v)}
            className="detail-analysis__attitude-filters"
          />

          {selectedQuestion === "attitude" ? (
          <AttitudeTabContent reportDetail={reportDetail} />
          ) : selectedQuestion === "gaze" ? (
            <GazeTabContent reportDetail={reportDetail} />
          ) : selectedQuestion === "gesture" ? (
            <GestureTabContent reportDetail={reportDetail} />
          ) : selectedQuestion === "expression" ? (
            <ExpressionTabContent reportDetail={reportDetail} />
          ) : (
            <AttitudeTabContent
            
              reportDetail={reportDetail}
            />
          )}
        </div>
      </div>
    </div>
  );
}