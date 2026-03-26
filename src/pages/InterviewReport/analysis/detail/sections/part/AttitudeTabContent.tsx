import React from "react";
import DetailMetric from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetric";
import DetailMetricTable from "@/pages/InterviewReport/analysis/detail/sections/part/DetailMetricTable";
import ic_posture_body from "@/assets/illustrations/ic_posture_body.png";
import ic_arrow_horizontal from "@/assets/illustrations/ic_arrow_horizontal.png";
import ic_arrow_vertical from "@/assets/illustrations/ic_arrow_vertical.png";
import body_outline_dotted from "@/assets/illustrations/body_outline_dotted.png";
import face_outline_dotted from "@/assets/illustrations/face_outline_dotted.png";
import ic_stars_gray600_20 from "@/assets/icons/size20/ic_stars_gray600_20.png";
import ic_conditions_gray600_20 from "@/assets/icons/size20/ic_conditions_gray600_20.png";
import ic_refresh_gray500_24 from "@/assets/icons/size24/ic_refresh_gray500_24.png";
import ic_height_gray500_24 from "@/assets/icons/size24/ic_height_gray500_24.png";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type TableRow = {
  label: string;
  values: (string | number)[];
};

type Props = {
  reportDetail?: InterviewReportDetailResponse | null;
};

function formatAngle(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }
  return `${value.toFixed(2)}도`;
}

function formatMoveCount(
  rightMoveCount?: number | null,
  leftMoveCount?: number | null,
  centerMoveCount?: number | null
) {
  const right = rightMoveCount ?? 0;
  const left = leftMoveCount ?? 0;
  const center = centerMoveCount ?? 0;
  return `${right + left + center}회`;
}

function normalizeGrade(value?: string): "우수" | "보통" | "미흡" {
  switch (value) {
    case "우수":
    case "보통":
    case "미흡":
      return value;
    default:
      return "보통";
  }
}

export default function AttitudeTabContent({ reportDetail }: Props) {
  const posture = reportDetail?.tab2?.detailAttitude?.posture;
  const postureShoulderAngleData = posture?.postureShoulderAngleData;

  const postureAngleList = postureShoulderAngleData?.postureAngle?.dataList ?? [];
  const shoulderMovementList =
    postureShoulderAngleData?.shoulderMovement?.dataList ?? [];

  const mePostureAngle = postureAngleList[0];
  const totalAveragePostureAngle = postureAngleList[1];
  const jobAveragePostureAngle = postureAngleList[2];

  const totalAverageShoulderMovement = shoulderMovementList[1];
  const jobAverageShoulderMovement = shoulderMovementList[2];

  const faceAngle = mePostureAngle?.faceAngle ?? 0;
  const bodyAngle = mePostureAngle?.shoulderAngle ?? 0;

  const totalMovementCount = shoulderMovementList.reduce((sum, item) => {
    return (
      sum +
      (item.centerMoveCount ?? 0) +
      (item.leftMoveCount ?? 0) +
      (item.rightMoveCount ?? 0)
    );
  }, 0);

  const avgFaceAngle =
    postureAngleList.length > 0
      ? postureAngleList.reduce((sum, item) => sum + (item.faceAngle ?? 0), 0) /
        postureAngleList.length
      : 0;

  const avgShoulderAngle =
    postureAngleList.length > 0
      ? postureAngleList.reduce((sum, item) => sum + (item.shoulderAngle ?? 0), 0) /
        postureAngleList.length
      : 0;

  const headers = ["", "머리 각도", "어깨 각도", "좌우 움직임"];

  const rows: TableRow[] =
    postureAngleList.length && shoulderMovementList.length
      ? [
          {
            label: "전체 평균",
            values: [
              formatAngle(totalAveragePostureAngle?.faceAngle),
              formatAngle(totalAveragePostureAngle?.shoulderAngle),
              formatMoveCount(
                totalAverageShoulderMovement?.rightMoveCount,
                totalAverageShoulderMovement?.leftMoveCount,
                totalAverageShoulderMovement?.centerMoveCount
              ),
            ],
          },
          {
            label: "직군 평균",
            values: [
              formatAngle(jobAveragePostureAngle?.faceAngle),
              formatAngle(jobAveragePostureAngle?.shoulderAngle),
              formatMoveCount(
                jobAverageShoulderMovement?.rightMoveCount,
                jobAverageShoulderMovement?.leftMoveCount,
                jobAverageShoulderMovement?.centerMoveCount
              ),
            ],
          },
        ]
      : [
          {
            label: "전체 평균",
            values: [
              `${avgFaceAngle.toFixed(2)}도`,
              `${avgShoulderAngle.toFixed(2)}도`,
              `${totalMovementCount}회`,
            ],
          },
        ];

  return (
    <>
      <div className="detail-analysis__attitude-content">
        <div className="detail-analysis__attitude-left">
          <div className="attitude-control">
            <div className="attitude-control__rotation">
              <span className="attitude-control__rotation-btn left">
                <img src={ic_refresh_gray500_24} alt="왼쪽 회전" />
              </span>
              <span className="attitude-control__rotation-btn right">
                <img src={ic_refresh_gray500_24} alt="오른쪽 회전" />
              </span>
            </div>

            <img
              className="attitude-control__image"
              src={ic_posture_body}
              alt="자세 이미지"
            />

            <img
              className="attitude-control__overlay-face"
              style={
                {
                  "--face-angle": `${faceAngle}deg`,
                } as React.CSSProperties
              }
              src={face_outline_dotted}
              alt=""
            />

            <img
              className="attitude-control__overlay-body"
              style={
                {
                  "--body-angle": `${bodyAngle}deg`,
                } as React.CSSProperties
              }
              src={body_outline_dotted}
              alt=""
            />

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

            <div className="attitude-control__height">
              <span className="attitude-control__height-btn">
                <img src={ic_height_gray500_24} alt="높이 증가" />
              </span>
              <span className="attitude-control__height-btn">
                <img src={ic_height_gray500_24} alt="높이 감소" />
              </span>
            </div>
          </div>
        </div>

        <div className="detail-analysis__attitude-right">
          <DetailMetric
            type="posture"
            gradeLabel="자세 등급"
            gradeIconSrc={ic_stars_gray600_20}
            className="attitude"
            analysisTitle="자세 분석"
            analysisIconSrc={ic_conditions_gray600_20}
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
            selectedGrade={normalizeGrade(posture?.postureGrade)}
            reportDetail={reportDetail}
          />
        </div>
      </div>

      <DetailMetricTable headers={headers} rows={rows} type="posture" />
    </>
  );
}