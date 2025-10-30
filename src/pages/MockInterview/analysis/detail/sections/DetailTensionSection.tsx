// src/pages/MockInterview/analysis/detail/sections/DetailVoiceSection.tsx
import React, { useState } from "react";
import TensionContent from "@/pages/MockInterview/analysis/detail/sections/part/TensionContent";
import TensionLevelGraph from "@/pages/MockInterview/analysis/chart/TensionLevelGraph";
import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";




type Props = {
  score: number;
  title?: string;
  className?: string;
  titleIconSrc?: string;
  description?: string;
};

const DEFAULT_FILTERS: UiFilterOption[] = [
  { label: "목소리 톤", value: "voiceTone" },
  { label: "말하는 속도", value: "speechSpeed" },
];

const VOICE_TONE_HEADERS = ["낮은 저음", "저음", "중간", "고음", "높은 고음"];
const VOICE_TONE_ROWS = [
  { 
    label: "여자: 180 Hz 이하\n남자: 100 Hz 이하",
    values: [
      "여자: 180~200 Hz\n남자: 100~120 Hz", 
      "여자: 201~230 Hz\n남자: 121~150 Hz",
      "여자: 231~270 Hz\n남자: 151~180 Hz",
      "여자: 270 Hz 이상\n남자: 180 Hz 이상"
    ] 
  },
];

const SPEECH_SPEED_HEADERS = ["느림", "다소 느림", "보통", "빠름", "다소 빠름"];
const SPEECH_SPEED_ROWS = [
  { 
    label: "3.5 SPS 이하",
    values: ["3.5~4.5 SPS", "4.5~5.5 SPS", "5.5~6.5 SPS", "6.5 SPS 이상"] 
  },
];

export default function DetailTensionSection({
  score,
  title,
  className,
  titleIconSrc,
  description,
}: Props) {
  const [selectedQuestion, setSelectedQuestion] = useState<string>(DEFAULT_FILTERS[0].value);

  return (
    <div className={`analysis-section detail-analysis__attitude ${className ?? ""}`}>
      <span className="analysis-section__title">
        {titleIconSrc && <img src={titleIconSrc} alt="" />} {title}
        <span className="tooltip tooltip--top">
          <img
            className="tooltip-icon"
            src={ic_error_gray500_20}
            alt=""
            aria-hidden="true"
            tabIndex={0}  // 키보드 포커스로도 열리게(선택)
          />
          <div className="tooltip__content" role="tooltip">
            <span className="tooltip__title">긴장도</span>
            <span className="tooltip__desc">
            긴장도는 심박 분석 결과에 따라 3단계(높음, 보통, 낮음)로 나누어져 있습니다. 긴장도 상태를 직관적으로 확인할 수 있습니다.
            </span>
          </div>
        </span>


      </span>
      <div className="analysis-section__body">
        <TensionLevelGraph score={score} description={description} />
 
        <TensionContent
              className={className}
              gradeLabel="목소리 톤 등급"
              analysisTitle="목소리 톤 분석"
              selectedGrade="보통"
              analysisText="전체 평균과 비교했을 때, 홍길동님의 목소리 톤은 적절합니다"
              highlight="평균 톤 '205 Hz', 변동폭 '중간', 안정성 '우수'"
              headers={VOICE_TONE_HEADERS}
              rows={VOICE_TONE_ROWS}
            />
   
      </div>
    </div>
  );
}