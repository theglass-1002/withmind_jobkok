import "./DetailPage.css";
import DetailCompetenceSection from "./sections/DetailCompetenceSection";
// import DetailAttitudeSection from "./sections/DetailAttitudeSection";
// import DetailVoiceSection from "./sections/DetailVoiceSection";
// import DetailTensionSection from "./sections/DetailTensionSection";
import ic_hammer_24 from "@/assets/icons/size24/ic_hammer_24.png";


type Props = {
  competence_score: number;
  attitude_score: number;
};

export default function DetailPage({ 
  competence_score = 80,
  attitude_score}: Props) {
  
  return (
    <div className="mock-analysis-report__content mock-analysis--detail">
        <DetailCompetenceSection
          title="역량 분석"
          titleIconSrc={ic_hammer_24}
          score={competence_score}
          description="면접 과정에서 보인 의사소통 능력과 문제해결 능력은 매우 우수한 것으로 평가됩니다. 잘 이해하고 뛰어난 의사소통 기술을 보였으며, 문제의 핵심을 파악하고 해결책을 제시하는 등 전화 상담원으로서의 역량이 뛰어나다고 판단됩니다."
        />

      <div className="analysis-section detail-analysis__attitude">
        <span className="analysis-section__title">태도분석 섹션</span>
      
      </div>

      <div className="analysis-section detail-analysis__voice">
        <span className="analysis-section__title">목소리분석 섹션</span>
        
      </div>

      <div className="analysis-section detail-analysis__tension">
        <span className="analysis-section__title">긴장도분석 섹션</span>
        
      </div>
    </div>
  );
}
