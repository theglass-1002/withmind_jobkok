import React from "react";
import ic_event_available_gray700_20 from "@/assets/icons/size20/ic_event_available_gray700_20.png";
import ic_arrow_drop_down_gray500_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray500_24.png";
import ic_page_facing_up_24 from "@/assets/icons/size24/ic_page-facing-up_24.png";
import ic_info_white80_20 from "@/assets/icons/size20/ic_info_white80_20.png";
import ic_yellow_flag20 from "@/assets/icons/size20/ic_yellow_flag20.png";
import ic_check_circle_white_100_20 from "@/assets/icons/size20/ic_check_circle_white_100_20.png";
import ic_bar_chart_24 from "@/assets/icons/size24/ic_bar_chart_24.png";
import ic_crown_white_20 from "@/assets/icons/size20/ic_crown_white_20.png";

import MyReportKPIs from "@/pages/MockInterview/my-report/part/MyReportKPIs";
import ScoreBarChartJS from "@/pages/MockInterview/my-report/part/ScoreBarChartJS";
import AverageScoreCard from "@/pages/MockInterview/my-report/part/AverageScoreCard";
import ScoreTrendCard from "@/pages/MockInterview/my-report/part/ScoreTrendCard";
import ScoreTrendBarChart from "@/pages/MockInterview/my-report/part/ScoreTrendBarChart";


export default function MyReportResult() {
  const SCORE = 82;
  const AVERAGE = 72;
  const MAX = 100;

  return (
    <>
      <div className="mock-interview-summary__header">
        <div className="mock-interview-summary__header-left">
          <img
            className="mock-interview-summary__date-icon"
            src={ic_event_available_gray700_20}
            alt=""
            aria-hidden="true"
          />
          <span className="mock-interview-summary__daterange">2025.01.01~2025.01.10</span>
        </div>

        <div className="mock-interview-summary__header-right">
          <span className="mock-interview-summary__window">최근 10일 기준</span>
          <img
            className="mock-interview-summary__window-icon"
            src={ic_arrow_drop_down_gray500_24}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="mock-interview-summary__content">
        <MyReportKPIs
            recentInterviewDate="2025.01.01"
            totalCount={81}
            averageDuration="8분 24초"
            bestDate="2025.01.01"
            bestScore="100점"
        />
        <div className="mock-interview-summary__charts">
            <AverageScoreCard
                score={82}
                average={72}
                max={100}
                userName="홍길동님"
                markLabel="면접우수 마크"
                topBadgeText="상위10%"
                secondaryBadges={["기본기 충실", "준비도 높음"]}
            />

          <ScoreTrendCard bestScore="92점">
            <ScoreTrendBarChart
              dates={[
                "2025-01-01",
                "2025-01-03",
                "2025-01-08",
                "2025-01-10",
                "2025-01-12",
                "2025-01-15",
                "2025-01-18",
                "2025-01-20",
              ]}
              values={[50, 30, 20, 60, 92, 80, 70, 80]}
              max={100}
            />
          </ScoreTrendCard>

        </div>

        <div className="mock-interview-summary__panel mock-interview-summary__panel--trend">
          <span className="mock-interview-summary__panel-title">항목별 종합 분석 추이</span>
        </div>

        <div className="mock-interview-summary__panel mock-interview-summary__panel--keywords">
          <span className="mock-interview-summary__panel-title">자주 사용한 단어</span>
        </div>

        <div className="mock-interview-summary__panel mock-interview-summary__panel--jobs">
          <span className="mock-interview-summary__panel-title">채용공고 매칭 top5</span>
        </div>
      </div>
    </>
  );
}
