import React from "react";
import ic_magnifier_24 from "@/assets/icons/size24/ic_magnifier_24.png";
import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";
import KpiOverview from "./part/KpiOverview";
import MockAnalysisKpiFit from "./part/MockAnalysisKpiFit";

type Props = {
  score: number;
  totalCandidates: number;
  percentile: number;
  fit: number;
};

export default function KpiOverviewSection({
  score,
  totalCandidates,
  percentile,
  fit,
}: Props) {
  return (
    <div className="mock-analysis-overview__kpi ">
      <KpiOverview
        score={score}
        totalCandidates={totalCandidates}
        percentile={percentile}
      />
      <MockAnalysisKpiFit
        value={fit}
        headIconSrc={ic_magnifier_24}
        noteIconSrc={ic_error_gray500_20}
        description="응답은 직무 핵심 키워드와 역할을 잘 반영해 이력서와 높은 일치도를 보였습니다. 이력서에서 강조한 프로젝트 경험과 협업 역량도 답변에 드러났으나, 정량적 성과와 최신 기술 활용 사례는 충분히 연결되지 않아 구체성과 최신성이 다소 부족했습니다."
      />
    </div>
  );
}
