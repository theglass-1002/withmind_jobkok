import React, { useMemo, useState } from "react";
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
  const DEFAULT_FILTERS: UiFilterOption[] = [
    { label: "자세", value: "attitude" },
    { label: "시선", value: "gaze" },
    { label: "제스처", value: "gesture" },
    { label: "표정", value: "expression" },
  ];

  const [selectedQuestion, setSelectedQuestion] = useState<string>(
    DEFAULT_FILTERS[0].value
  );

  const detailAttitude = reportDetail?.tab2?.detailAttitude;
  const posture = detailAttitude?.posture;
  const gaze = detailAttitude?.gaze;
  const gesture = detailAttitude?.gesture;
  const emotion = detailAttitude?.emotion;

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

  const gestureHeaders = ["", "평균 횟수", "평균 시간"];
  const gestureRows = [
    {
      label: "전체 횟수",
      values: [
        `${gesture?.gestureData?.gesture?.dataList?.[0]?.handMoveCount ?? 0}회`,
        `${gesture?.gestureData?.gesture?.dataList?.[0]?.handTime ?? 0}초`,
      ],
    },
  ];

  const expressionHeaders = ["", "긍정", "부정", "무표정"];
  const expressionRows = [
    {
      label: reportDetail?.userInfo?.name
        ? `${reportDetail.userInfo.name} 님`
        : "사용자",
      values: [
        `${emotion?.emotionData?.positive ?? 0}%`,
        `${emotion?.emotionData?.negative ?? 0}%`,
        `${emotion?.emotionData?.neutral ?? 0}%`,
      ],
    },
  ];

  const selectedGradeText = useMemo<GradeText>(() => {
    switch (selectedQuestion) {
      case "attitude":
        return normalizeGrade(posture?.postureGrade);
      case "gaze":
        return normalizeGrade(gaze?.gazeGrade);
      case "gesture":
        return normalizeGrade(gesture?.gestureGrade);
      case "expression":
        return normalizeGrade(emotion?.emotionGrade);
      default:
        return "보통";
    }
  }, [selectedQuestion, posture, gaze, gesture, emotion]);

  return (
    <div className="analysis-section detail-analysis__attitude ">
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
            options={DEFAULT_FILTERS}
            value={selectedQuestion}
            onChange={(v) => setSelectedQuestion(v)}
            className="detail-analysis__attitude-filters"
          />

          {selectedQuestion === "attitude" ? (
            <AttitudeTabContent
              faceAngle={resolvedFaceAngle}
              bodyAngle={resolvedBodyAngle}
              analysisTitle="자세 분석"
              selectedGrade={selectedGradeText}
              analysisText={
                posture?.analysisText ??
                "전체 평균과 비교했을 때, 자세는 양호합니다."
              }
              highlight={
                posture?.detailText ??
                `머리 ‘${avgFaceAngle.toFixed(2)}도’, 어깨 ‘${avgShoulderAngle.toFixed(
                  2
                )}도’, 좌우 움직임 ‘${totalMovementCount}회’`
              }
              headers={attitudeHeaders}
              rows={attitudeRows}
              reportDetail={reportDetail}
            />
          ) : selectedQuestion === "gaze" ? (
            <GazeTabContent
              gazeAngle={gaze?.gazeData?.geze?.pointValue ?? 0}
              gazeX={gaze?.gazeData?.geze?.pointList?.[0]?.x ?? 0}
              gazeY={gaze?.gazeData?.geze?.pointList?.[0]?.y ?? 0}
              analysisTitle="시선 분석"
              selectedGrade={selectedGradeText}
              analysisText={
                gaze?.analysisText ??
                "시선 분포와 카메라 응시 안정성이 전반적으로 양호합니다."
              }
              highlight={gaze?.detailText ?? "시선의 위치 변화가 적습니다."}
            />
          ) : selectedQuestion === "gesture" ? (
            <GestureTabContent
              gradeLabel="제스처 등급"
              analysisTitle="제스처 분석"
              selectedGrade={selectedGradeText}
              analysisText={
                gesture?.analysisText ??
                "제스처 사용이 전반적으로 안정적입니다."
              }
              headers={gestureHeaders}
              rows={gestureRows}
            />
          ) : selectedQuestion === "expression" ? (
            <ExpressionTabContent
              faceAngle={emotion?.emotionData?.positive ?? 0}
              bodyAngle={emotion?.emotionData?.negative ?? 0}
              analysisTitle="표정 분석"
              selectedGrade={selectedGradeText}
              analysisText={
                emotion?.analysisText ?? "표정 변화는 전반적으로 안정적입니다."
              }
              highlight={
                emotion?.detailText ??
                `긍정 ‘${emotion?.emotionData?.positive ?? 0}%’, 부정 ‘${
                  emotion?.emotionData?.negative ?? 0
                }%’, 무표정 ‘${emotion?.emotionData?.neutral ?? 0}%’`
              }
              headers={expressionHeaders}
              rows={expressionRows}
            />
          ) : (
            <AttitudeTabContent
              faceAngle={resolvedFaceAngle}
              bodyAngle={resolvedBodyAngle}
              analysisTitle="자세 분석"
              selectedGrade={selectedGradeText}
              headers={attitudeHeaders}
              rows={attitudeRows}
              reportDetail={reportDetail}
            />
          )}
        </div>
      </div>
    </div>
  );
}