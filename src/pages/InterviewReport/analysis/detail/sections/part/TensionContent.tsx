// src/pages/InterviewReport/analysis/detail/sections/part/TensionContent.tsx
import React from "react";
import TensionAnalysisChart from "@/pages/InterviewReport/analysis/chart/TensionAnalysisChart";


import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";
import ic_timeline_gray600_20 from "@/assets/icons/size20/ic_timeline_gray600_20.png";
import ic_cardiology_gray600_20 from "@/assets/icons/size20/ic_cardiology_gray600_20.png";
import ic_favorite_green_20 from "@/assets/icons/size20/ic_favorite_green_20.png";
import ic_favorite_blue_20 from "@/assets/icons/size20/ic_favorite_blue_20.png";
import ic_favorite_red_20 from "@/assets/icons/size20/ic_favorite_red_20.png";



type TableRow = { label: string; values: (string | number)[] };

type Props = {
  gradeLabel?: string;
  analysisTitle?: string;
  selectedGrade?: "우수" | "보통" | "미흡";
  analysisText?: React.ReactNode;
  highlight?: React.ReactNode;
  headers?: string[];
  rows?: TableRow[];
  className?: string;
};

export default function TensionContent({
  gradeLabel = "목소리 톤 등급",
  analysisTitle = "목소리 톤 분석",
  selectedGrade = "보통",
  analysisText = <>전체 평균과 비교했을 때, 홍길동님의 목소리 톤은 적절합니다.</>,
  highlight = <>평균 톤 '205 Hz', 변동폭 '중간', 안정성 '우수'</>,
  headers = ["", "낮은 저음", "저음", "중간", "고음", "높은 고음"],
  rows = [
    { label: "전체 평균", values: ["180 Hz", "190 Hz", "205 Hz", "245 Hz", "280 Hz"] },
    { label: "직군 평균", values: ["175 Hz", "195 Hz", "210 Hz", "240 Hz", "275 Hz"] },
  ],
  className
}: Props) {
  return (
    <>
  
  
      <div className={`detail-analysis__attitude-content ${className ?? ""}`}>
        <div className="detail-analysis__attitude-left">
         <div className="detail-analysis__tension-content">
         <div className="detail-analysis__tension-header">
         <span className="detail-analysis__metric-grade-label">
            <img src={ic_timeline_gray600_20} alt="" />
              홍길동님의 응답 긴장도
            </span>
            <span className="detail-analysis__tension-summary">
            질문 5에서 가장 긴장하였고, 질문 2에서 가장 긴장도가 낮았던 것으로 확인됩니다.</span>
            </div>
           
              <TensionAnalysisChart
                userValues={[45, 78, 52, 65, 48, 72, 82, 68, 65, 63, 58]}
                averageValues={[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]}
                userLineColor="#FF524C"
                averageLineColor="#26A4FF"
                min={0}
                max={100}
              />
            
            </div>   
            <div className="detail-analysis__tension-description">
              <img src={ic_error_gray500_20} alt="" />
          면접 질문당 평균 심박수와 표준편차를 계산하여 응시자의 질문별 긴장도와 답변 도중 동요한 정도를
            파악합니다. 표준편차란 지원자의 심박수가 1분의 답변 시간 동안 평균 심박수에서 얼마나 멀어지며
            요동쳤는지에 대한 수치입니다. 푸른색 그래프는 해당 질문에 대한 지원자의 평균 심박을, 붉은색
            그래프는 평균에서 표준 편차가 더해진 심박 수치를 나타냅니다. 푸른색과 붉은색 그래프 사이의 폭이
            넓을수록 표준편차가 큰 것이며, 해당 지원자의 긴장도와 동요도가 높았다고 해석할 수 있습니다.
            </div>    
        </div>

        <div className="detail-analysis__attitude-right">
        <div className="detail-analysis__tension-stat-item average">
            <span className="detail-analysis__tension-stat-label">
              <img src={ic_cardiology_gray600_20} alt="" />
              평균 심박 수치</span>
            <div className="detail-analysis__tension-stat-content">
              <div className="detail-analysis__tension-stat-value-wrapper">
                <span className="detail-analysis__tension-stat-value">100</span>
                <div className="detail-analysis__tension-stat-unit">
                  <span className="detail-analysis__tension-stat-icon">
                  <img src={ic_favorite_green_20} alt="" />
                  </span>
                  <span className="detail-analysis__tension-stat-unit-text">BPM</span>
                </div>
              </div>
              <span className="detail-analysis__tension-stat-level">높음</span>
            </div>
          </div>
          <div className="detail-analysis__tension-stat-item min">
            <span className="detail-analysis__tension-stat-label">
            <img src={ic_cardiology_gray600_20} alt="" />
              최저 심박 수치</span>
            <div className="detail-analysis__tension-stat-content">
              <div className="detail-analysis__tension-stat-value-wrapper">
                <span className="detail-analysis__tension-stat-value">60</span>
                <div className="detail-analysis__tension-stat-unit">
                  <span className="detail-analysis__tension-stat-icon">
                    <img src={ic_favorite_blue_20} alt="" />
                 </span>
                  <span className="detail-analysis__tension-stat-unit-text">BPM</span>
                </div>
              </div>
              <span className="detail-analysis__tension-stat-level">높음</span>
            </div>
          </div>
          <div className="detail-analysis__tension-stat-item max">
            <span className="detail-analysis__tension-stat-label">
            <img src={ic_cardiology_gray600_20} alt="" />
              최고 심박 수치</span>
            <div className="detail-analysis__tension-stat-content">
              <div className="detail-analysis__tension-stat-value-wrapper">
                <span className="detail-analysis__tension-stat-value">100</span>
                <div className="detail-analysis__tension-stat-unit">
                  <span className="detail-analysis__tension-stat-icon">
                  <img src={ic_favorite_red_20} alt="" />
                  </span>
                  <span className="detail-analysis__tension-stat-unit-text">BPM</span>
                </div>
              </div>
              <span className="detail-analysis__tension-stat-level">낮음</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}