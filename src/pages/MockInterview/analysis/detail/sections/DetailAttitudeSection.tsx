// src/pages/MockInterview/analysis/detail/sections/DetailAttitudeSection.tsx
import React, { useState } from "react";
import LevelGraph from "@/pages/MockInterview/analysis/chart/LevelGraph";

import AttitudeTabContent from "@/pages/MockInterview/analysis/detail/sections/part/AttitudeTabContent";
import GazeTabContent from "@/pages/MockInterview/analysis/detail/sections/part/GazeTabContent";
import GestureTabContent from "@/pages/MockInterview/analysis/detail/sections/part/GestureTabContent";
import ExpressionTabContent from "@/pages/MockInterview/analysis/detail/sections/part/ExpressionTabContent";

import UiFilter, { type UiFilterOption } from "@/shared/components/ui-filter/UiFilter";

type Props = {
  score: number;
  title?: string;
  titleIconSrc?: string;
  description?: string;
  faceAngle: number;
  bodyAngle: number;
};

export default function DetailAttitudeSection({
  score,
  title,
  titleIconSrc,
  description,
  faceAngle,
  bodyAngle,
}: Props) {
  const DEFAULT_FILTERS: UiFilterOption[] = [
    { label: "자세", value: "attitude" },
    { label: "시선", value: "gaze" },
    { label: "제스처", value: "gesture" },
    { label: "표정", value: "expression" },
  ];

  const [selectedQuestion, setSelectedQuestion] = useState<string>(DEFAULT_FILTERS[0].value);

  const attitudeHeaders = ["", "머리 각도", "어깨 각도", "좌우 움직임"];
  const attitudeRows = [
    { label: "전체 평균", values: ["1.23도", "1.23도", "4회"] },
    { label: "직군 평균", values: ["1.23도", "1.23도", "4회"] },
  ];

  const gestureHeaders = ["", "평균 횟수", "평균 시간"];
  const gestureRows = [
    { label: "전체 횟수", values: ["12회", "3.3초"] },
    { label: "직군 평균", values: ["8회", "4초"] },
  ];

  const expressionHeaders = ["", "긍정", "부정", "무표정"];
  const expressionRows = [
    { label: "홍길동 님", values: ["24%", "8%", "68%"] },
  ];

  return (
    <div className="analysis-section detail-analysis__attitude ">
      <span className="analysis-section__title">
        {titleIconSrc && <img src={titleIconSrc} alt="" />} {title}
      </span>

      <div className="analysis-section__body">
        <LevelGraph score={score} description={description} />

        <div className="detail-analysis__attitude">
          <UiFilter
            options={DEFAULT_FILTERS}
            value={selectedQuestion}
            onChange={(v) => setSelectedQuestion(v)}
            className="detail-analysis__attitude-filters"
          />

          {selectedQuestion === "attitude" ? (
            <AttitudeTabContent
              faceAngle={0}
              bodyAngle={0}
              analysisTitle="자세 분석"
              selectedGrade="보통"
              analysisText="전체 평균과 비교했을 때, 홍길동님의 자세는 양호합니다"
              highlight="머리 ‘-1.234도’, 어깨 ‘-1.234도’, 좌우 움직임 ‘13회"
              headers={attitudeHeaders}
              rows={attitudeRows}
            />
          ) : selectedQuestion === "gaze" ? (
            <GazeTabContent
              gazeAngle={25}
              gazeX={40}
              gazeY={-10}
              analysisTitle="시선 분석"
              selectedGrade="미흡"
              analysisText="대학 평균과 비교했을 때, 홍길동님의 시선 분포 정도는 우수합니다.홍길동님은 답변하는 동안 카메라를 바라보고 있었던"
              highlight="시선의 위치 변화가 적습니다(안정적)."
            />
          ) : selectedQuestion === "gesture" ? (
            <GestureTabContent
              gradeLabel="제스처 등급"
              analysisTitle="제스처 분석"
              selectedGrade="우수"
              analysisText="전체 평균과 비교했을 때, 홍길동님의 제스처는 우수합니다. 홍길동님의 얼굴 주변 제스처를 취한 평균 횟수는 ‘5회’이며, 제스처를 유지한 평균 시간은 ‘64.3초’입니다."
              headers={gestureHeaders}
              rows={gestureRows}
            />
          ) : selectedQuestion === "expression" ? (
            <ExpressionTabContent
            faceAngle={10}
            bodyAngle={10}
            analysisTitle="표정 분석"
            selectedGrade="보통"
            analysisText="전체 평균과 비교했을 때, 홍길동님의 자세는 양호합니다"
            highlight="머리 ‘-1.234도’, 어깨 ‘-1.234도’, 좌우 움직임 ‘13회"
            headers={expressionHeaders}
            rows={expressionRows}
          />
          ) : (
            <AttitudeTabContent
              faceAngle={faceAngle}
              bodyAngle={bodyAngle}
              analysisTitle="자세 분석"
              selectedGrade="보통"
              headers={attitudeHeaders}
              rows={attitudeRows}
            />
          )}
        </div>
      </div>
    </div>
  );
}
