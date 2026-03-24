import "./DetailPage.css";
import { useMemo } from "react";

import DetailCompetenceSection from "./sections/DetailCompetenceSection";
import DetailAttitudeSection from "./sections/DetailAttitudeSection";
import DetailVoiceSection from "./sections/DetailVoiceSection";
import DetailTensionSection from "./sections/DetailTensionSection";

import ic_hammer_24 from "@/assets/icons/size24/ic_hammer_24.png";
import ic_technologist_24 from "@/assets/icons/size24/ic_technologist_24.png";
import ic_speaker_24 from "@/assets/icons/size24/ic_speaker_24.png";
import ic_heart_24 from "@/assets/icons/size24/ic_heart_24.png";

import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  competence_score?: number;
  attitude_score?: number;
  voice_score?: number;
  tension_score?: number;
  videoSrc?: string;
  reportDetail?: InterviewReportDetailResponse | null;
};

export default function DetailPage({
  competence_score = 80,
  attitude_score = 10,
  voice_score = 45,
  tension_score = 45,
  videoSrc,
  reportDetail,
}: Props) {
  const resolvedData = useMemo(() => {
    if (reportDetail?.itemTotalScores && reportDetail?.feedback) {
      return {
        competence_score:
          reportDetail.itemTotalScores.abilityTotalScore ?? competence_score,
        attitude_score:
          reportDetail.itemTotalScores.attitudeTotalScore ?? attitude_score,
        voice_score:
          reportDetail.itemTotalScores.voiceTotalScore ?? voice_score,
        tension_score:
          reportDetail.itemTotalScores.tensionTotalScore ?? tension_score,

        competence_desc: reportDetail.feedback?.competency ?? "-",
        attitude_desc: reportDetail.feedback?.attitude ?? "-",
        voice_desc: reportDetail.feedback?.voice ?? "-",
        tension_desc: reportDetail.feedback?.tension ?? "-",
      };
    }

    // fallback (기존 하드코딩 유지)
    return {
      competence_score,
      attitude_score,
      voice_score,
      tension_score,

      competence_desc:
        "면접 과정에서 보인 의사소통 능력과 문제해결 능력은 매우 우수한 것으로 평가됩니다.",
      attitude_desc:
        "눈 맞춤과 고른 발성으로 자신감과 안정감을 전달하였습니다.",
      voice_desc:
        "발성과 전달력이 안정적이며, 전반적으로 자연스러운 톤을 유지했습니다.",
      tension_desc:
        "전반적으로 안정적인 모습을 보이며 긴장도가 낮은 편으로 평가됩니다.",
    };
  }, [
    reportDetail,
    competence_score,
    attitude_score,
    voice_score,
    tension_score,
  ]);

  return (
    <div className="mock-analysis-report__content mock-analysis--detail">
      <DetailCompetenceSection
        title="역량 분석"
        titleIconSrc={ic_hammer_24}
        score={resolvedData.competence_score}
        videoSrc={videoSrc}
        description={resolvedData.competence_desc}
        reportDetail={reportDetail}
      />

      <DetailAttitudeSection
        title="태도 분석"
        titleIconSrc={ic_technologist_24}
        score={resolvedData.attitude_score}
        description={resolvedData.attitude_desc}
      />

      <span className="print-page-break"></span>

      <DetailVoiceSection
        title="목소리 분석"
        className="voice"
        titleIconSrc={ic_speaker_24}
        score={resolvedData.voice_score}
        description={resolvedData.voice_desc}
      />

      <span className="print-page-break"></span>

      <DetailTensionSection
        title="긴장도 분석"
        className="tension"
        titleIconSrc={ic_heart_24}
        score={resolvedData.tension_score}
        description={resolvedData.tension_desc}
      />
    </div>
  );
}