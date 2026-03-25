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
  videoSrc?: string;
  reportDetail?: InterviewReportDetailResponse | null;
};

export default function DetailPage({
  videoSrc,
  reportDetail,
}: Props) {
  const resolvedData = useMemo(() => {
    if (reportDetail?.tab1 && reportDetail?.tab2) {
      const tab1 = reportDetail.tab1;
      const tab2 = reportDetail.tab2;

      return {
        competence_score:
          tab1.itemTotalScores?.abilityTotalScore ?? 0,
        attitude_score:
          tab2.detailAttitude?.attitudeTotalScore ?? 0,
        voice_score:
          tab1.itemTotalScores?.voiceTotalScore ?? 0,
        tension_score:
          tab1.itemTotalScores?.tensionTotalScore ?? 0,

        competence_desc: tab1.feedback?.competency ?? "-",
        attitude_desc:
          tab2.detailAttitude?.attitudeFeedBack ?? "-",
        voice_desc: tab1.feedback?.voice ?? "-",
        tension_desc: tab1.feedback?.tension ?? "-",
      };
    }

    return {
      competence_score: 0,
      attitude_score: 0,
      voice_score: 0,
      tension_score: 0,

      competence_desc:
        "면접 과정에서 보인 의사소통 능력과 문제해결 능력은 매우 우수한 것으로 평가됩니다.",
      attitude_desc:
        "눈 맞춤과 고른 발성으로 자신감과 안정감을 전달하였습니다.",
      voice_desc:
        "발성과 전달력이 안정적이며, 전반적으로 자연스러운 톤을 유지했습니다.",
      tension_desc:
        "전반적으로 안정적인 모습을 보이며 긴장도가 낮은 편으로 평가됩니다.",
    };
  }, [reportDetail]);

  return (
    <div className="mock-analysis-report__content mock-analysis--detail">
      <DetailCompetenceSection
        title="역량 분석"
        titleIconSrc={ic_hammer_24}
        videoSrc={videoSrc}
        reportDetail={reportDetail}
      />

      <DetailAttitudeSection
        title="태도 분석"
        titleIconSrc={ic_technologist_24}
        reportDetail={reportDetail}
      />

      <span className="print-page-break"></span>

      <DetailVoiceSection
        title="목소리 분석"
        className="voice"
        titleIconSrc={ic_speaker_24}
        score={resolvedData.voice_score}
        description={resolvedData.voice_desc}
        reportDetail={reportDetail}
      />

      <span className="print-page-break"></span>

      <DetailTensionSection
        title="긴장도 분석"
        className="tension"
        titleIconSrc={ic_heart_24}
        score={resolvedData.tension_score}
        description={resolvedData.tension_desc}
        reportDetail={reportDetail}
      />
    </div>
  );
}