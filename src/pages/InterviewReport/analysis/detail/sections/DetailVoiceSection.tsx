// src/pages/InterviewReport/analysis/detail/sections/DetailVoiceSection.tsx
import React, { useState } from "react";
import LevelGraph from "@/pages/InterviewReport/analysis/chart/LevelGraph";
import VoiceTabContent from "@/pages/InterviewReport/analysis/detail/sections/part/VoiceTabContent";
import SpeechSpeedTabContent from "@/pages/InterviewReport/analysis/detail/sections/part/SpeechSpeedTabContent";
import UiFilter, { type UiFilterOption } from "@/shared/components/ui-filter/UiFilter";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  score: number;
  title?: string;
  className?: string;
  titleIconSrc?: string;
  description?: string;
  reportDetail?: InterviewReportDetailResponse| null;

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

const SPEECH_SPEED_HEADERS = ["느림", "다소 느림", "보통", "다소 빠름", "빠름"];
const SPEECH_SPEED_ROWS = [
  { 
    label: "3.5 SPS 이하",
    values: ["3.5~4.5 SPS", "4.5~5.5 SPS", "5.5~6.5 SPS", "6.5 SPS 이상"] 
  },
];

export default function DetailVoiceSection({
  score,
  title,
  className,
  titleIconSrc,
  description,
  reportDetail
}: Props) {
  const [selectedQuestion, setSelectedQuestion] = useState<string>(DEFAULT_FILTERS[0].value);

  return (
    <div className={`analysis-section detail-analysis__attitude ${className ?? ""}`}>
      <span className="analysis-section__title">
        {titleIconSrc && <img src={titleIconSrc} alt="" />} {title}
      </span>
      <div className="analysis-section__body">
        <LevelGraph 
        reportDetail={reportDetail}
        score={score} 
        description={description} 
        type="voice"
        />
        
        <div className="detail-analysis__attitude">
          <UiFilter
            options={DEFAULT_FILTERS}
            value={selectedQuestion}
            onChange={setSelectedQuestion}
            className="detail-analysis__attitude-filters"
          />
          {selectedQuestion === "voiceTone" ? (
            <VoiceTabContent
              className="voice_tone"
              gradeLabel="목소리 톤 등급"
              analysisTitle="목소리 톤 분석"
              selectedGrade="보통"
              analysisText="전체 평균과 비교했을 때, 정유리님의 목소리 톤은 적절합니다"
              highlight="평균 톤 '205 Hz', 변동폭 '중간', 안정성 '우수'"
              headers={VOICE_TONE_HEADERS}
              rows={VOICE_TONE_ROWS}
              reportDetail={reportDetail}
            />
          ) : selectedQuestion === "speechSpeed" ? (
            <SpeechSpeedTabContent
              className="speech_speed"
              gradeLabel="말하는 속도 등급"
              analysisTitle="말하는 속도 분석"
              selectedGrade="미흡"
              headers={SPEECH_SPEED_HEADERS}
              rows={SPEECH_SPEED_ROWS}
              reportDetail={reportDetail}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}