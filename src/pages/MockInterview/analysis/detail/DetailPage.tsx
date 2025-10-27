import "./DetailPage.css";
import DetailCompetenceSection from "./sections/DetailCompetenceSection";
// import DetailAttitudeSection from "./sections/DetailAttitudeSection";
// import DetailVoiceSection from "./sections/DetailVoiceSection";
// import DetailTensionSection from "./sections/DetailTensionSection";


type Props = {
  score: number;
};

export default function DetailPage({ score }: Props) {
  return (
    <div className="mock-analysis-report__content mock-analysis--detail">
        <DetailCompetenceSection
          score={92}
          description="질문 의도를 파악하고 해결책을 제시하는 능력이 돋보였습니다."
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
