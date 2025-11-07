import React, { useState } from "react";
import ic_star_white_20 from "@/assets/icons/size20/ic_star_white_20.png";
import ic_star_gray900_20 from "@/assets/icons/size20/ic_star_gray900_20.png";






export default function MyReportEmpty() {
  const [activeTab, setActiveTab] = useState("report");

  const handleStart = () => {
    console.log("start mock interview");
  };

  return (
    <div className="my-report-empty my-report-empty--centered">
    <div className="my-report-empty__texts">
      <span className="my-report-empty__title">아직 진행한 모의면접이 없습니다.</span>
      <span className="my-report-empty__subtitle">
        모의면접을 진행하고 분석 리포트와 결과 기반 피드백을 받아보세요.
      </span>
    </div>
    <button type="button" className="default_btn_white" onClick={handleStart}>
      <img src={ic_star_gray900_20} alt="" aria-hidden="true" />
      모의면접 시작
    </button>
  </div>
  );
}
