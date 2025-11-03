// src/pages/MockInterview/analysis/detail/sections/DetailTensionSection.tsx
import React from "react";
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

export default function DetailTensionSection({
  score,
  title,
  className,
  titleIconSrc,
  description,
}: Props) {
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
            tabIndex={0}
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
        <TensionContent className={className} />
      </div>
    </div>
  );
}