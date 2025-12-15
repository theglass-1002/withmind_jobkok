import "./DetailPage.css";
import DetailCompetenceSection from "./sections/DetailCompetenceSection";
import DetailAttitudeSection from "./sections/DetailAttitudeSection";
import DetailVoiceSection from "./sections/DetailVoiceSection";
import DetailTensionSection from "./sections/DetailTensionSection";
import ic_hammer_24 from "@/assets/icons/size24/ic_hammer_24.png";
import ic_technologist_24 from "@/assets/icons/size24/ic_technologist_24.png";
import ic_speaker_24 from "@/assets/icons/size24/ic_speaker_24.png";
import ic_heart_24 from "@/assets/icons/size24/ic_heart_24.png";





type Props = {
  competence_score: number;
  attitude_score: number;
  voice_score:number;
  tension_score:number;
};

export default function DetailPage({ 
  competence_score = 80,
  attitude_score =10,
  voice_score =45,
  tension_score =45


}: Props) {
  
  return (
    <div className="mock-analysis-report__content mock-analysis--detail">
        <DetailCompetenceSection
          title="역량 분석"
          titleIconSrc={ic_hammer_24}
          score={competence_score}
          description="면접 과정에서 보인 의사소통 능력과 문제해결 능력은 매우 우수한 것으로 평가됩니다. 잘 이해하고 뛰어난 의사소통 기술을 보였으며, 문제의 핵심을 파악하고 해결책을 제시하는 등 전화 상담원으로서의 역량이 뛰어나다고 판단됩니다."
        />

      <DetailAttitudeSection
         title="태도 분석"
         titleIconSrc={ic_technologist_24}
         score={attitude_score}
         description="정유리님은 답변 과정에서 눈 맞춤과 고른 발성으로 자신감과 안정감을 전달하였습니다. 불필요한 군더더기 표현이 적어, 면접관에게 집중력 있는 인상을 주었습니다. 이러한 태도는 직무 적합성과 더불어 조직 내 협업에서도 긍정적으로 작용할 수 있습니다."

    
    />
    <span className="print-page-break"></span>
      <DetailVoiceSection
            title="목소리 분석"
            className="voice"
            titleIconSrc={ic_speaker_24}
            score={voice_score}
            description="정유리님은 답변 과정에서 눈 맞춤과 고른 발성으로 자신감과 안정감을 전달하였습니다. 불필요한 군더더기 표현이 적어, 면접관에게 집중력 있는 인상을 주었습니다. 이러한 태도는 직무 적합성과 더불어 조직 내 협업에서도 긍정적으로 작용할 수 있습니다."
        />
     <span className="print-page-break"></span>
    <DetailTensionSection
            title="긴장도 분석"
            className="tension"
            titleIconSrc={ic_heart_24}
            score={tension_score}
            description="정유리님은 면접 내내 안정적이고 편안한 모습을 보여 긴장감이 낮은 것으로 평가되어, 이는 안정적이고 편안한 모습으로 면접에 매우 긍정적인 영향을 미칠 것으로 판단됩니다. 안정적이고 편안한 모습으로 면접에 매우 긍정적인 영향을 미칠 것으로 판단됩니다."
        />
    </div>
  );
}
