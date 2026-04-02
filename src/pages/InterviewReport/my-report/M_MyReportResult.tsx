// src/pages/InterviewReport/my-report/MyReportResult.tsx
import React, { useState } from "react";

import ic_event_available_gray700_20 from "@/assets/icons/size20/ic_event_available_gray700_20.png";
import ic_arrow_drop_down_gray500_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray500_24.png";
import ic_open_book_24 from "@/assets/icons/size24/ic_open_book_24.png";
import ic_rocket_24 from "@/assets/icons/size24/ic_rocket_24.png";
import test_company_logo from "@/assets/testImg/company_logo/test_company_logo.png";
import ic_saramin_18 from "@/assets/icons/size18/ic_saramin_18.png";
import ic_star_green_18 from "@/assets/icons/size18/ic_star_green_18.png";
import ic_fire_16 from "@/assets/icons/size16/ic_fire_16.png";
import ic_seed_16 from "@/assets/icons/size16/ic_seed_16.png";
import ic_arrow_up_right_gray900_20 from "@/assets/icons/size20/ic_arrow_up_right_gray900_20.png";

import M_MyReportKPIs from "@/pages/InterviewReport/my-report/part/mobile/M_MyReportKPIs";
import AverageScoreCard from "@/pages/InterviewReport/my-report/part/AverageScoreCard";
import ScoreTrendCard from "@/pages/InterviewReport/my-report/part/ScoreTrendCard";
import ScoreTrendBarChart from "@/pages/InterviewReport/my-report/part/ScoreTrendBarChart";
import CategoryTrendPanel from "@/pages/InterviewReport/my-report/part/CategoryTrendPanel";
import { type KeywordPoint } from "@/pages/InterviewReport/my-report/part/KeywordsBubbleChart";
import MockInterviewKeywordsPanel from "@/pages/InterviewReport/my-report/part/MockInterviewKeywordsPanel";
import JobMatchHistoryPanel from "@/pages/InterviewReport/my-report/part/JobMatchHistoryPanel";
import type { JobCardV2Item } from "@/pages/InterviewReport/my-report/part/JobCardV2List";
import SortDropdown from "@/shared/components/sort-dropdown/SortDropdown";



const mockJobs: JobCardV2Item[] = [
  {
    jobIdx: 101,
    logoSrc: test_company_logo,
    company: "위드마인드",
    sourceLogoSrc: ic_saramin_18,
    role: "프로젝트 기획자",
    isBookmarked: true,
    matchPercent: 70,
    matchIconSrc: ic_star_green_18,
    locationMeta: "서울 마포구ㆍ신입 이상ㆍ대졸 이상",
    employmentMeta: "정규직ㆍ계약직",
    deadline: "~2025.08.31(일)",
    badges: [
      { text: "재택근무ㆍ유연근무제", iconSrc: ic_seed_16 },
      { text: "인기있는ㆍ마감임박", iconSrc: ic_fire_16 },
    ],
  },
  {
    jobIdx: 102,
    logoSrc: test_company_logo,
    company: "에이프로소프트",
    sourceLogoSrc: ic_saramin_18,
    role: "프론트엔드 엔지니어",
    isBookmarked: false,
    matchPercent: 84,
    matchIconSrc: ic_star_green_18,
    locationMeta: "서울 서초구ㆍ1~3년ㆍ학력무관",
    employmentMeta: "정규직",
    deadline: "~2025.09.10(수)",
    badges: [
      { text: "재택 선택 가능", iconSrc: ic_seed_16 },
      { text: "마감임박", iconSrc: ic_fire_16 },
    ],
  },
  {
    jobIdx: 103,
    logoSrc: test_company_logo,
    company: "넥스트웨이브",
    sourceLogoSrc: ic_saramin_18,
    role: "웹 프로젝트 기획자",
    isBookmarked: false,
    matchPercent: 62,
    matchIconSrc: ic_star_green_18,
    locationMeta: "경기 성남시ㆍ신입~2년ㆍ대졸 이상",
    employmentMeta: "정규직",
    deadline: "~2025.09.05(금)",
    badges: [
      { text: "유연근무제", iconSrc: ic_seed_16 },
      { text: "인기 공고", iconSrc: ic_fire_16 },
    ],
  },
  {
    jobIdx: 104,
    logoSrc: test_company_logo,
    company: "스프린트랩",
    sourceLogoSrc: ic_saramin_18,
    role: "React 개발자",
    isBookmarked: true,
    matchPercent: 91,
    matchIconSrc: ic_star_green_18,
    locationMeta: "서울 강남구ㆍ3~5년ㆍ대졸 이상",
    employmentMeta: "정규직",
    deadline: "~2025.09.20(토)",
    badges: [
      { text: "재택/하이브리드", iconSrc: ic_seed_16 },
      { text: "마감임박", iconSrc: ic_fire_16 },
    ],
  },
  {
    jobIdx: 105,
    logoSrc: test_company_logo,
    company: "코어브릿지",
    sourceLogoSrc: ic_saramin_18,
    role: "프론트엔드 주니어",
    isBookmarked: false,
    matchPercent: 76,
    matchIconSrc: ic_star_green_18,
    locationMeta: "서울 종로구ㆍ신입ㆍ학력무관",
    employmentMeta: "계약직",
    deadline: "~2025.08.28(목)",
    badges: [
      { text: "유연근무제", iconSrc: ic_seed_16 },
      { text: "인기 공고", iconSrc: ic_fire_16 },
    ],
  },
];

export default function M_MyReportResult() {
  const [jobs, setJobs] = useState<JobCardV2Item[]>(mockJobs);
  const [sort, setSort] = useState("최근 10일");

  const handleToggleFavorite = (id: string | number) => {
    setJobs((prev) =>
      prev.map((j) => (j.jobIdx === id ? { ...j, isBookmarked: !j.isBookmarked } : j))
    );
  };


  const sortOptions = ["최근 10일", "최근 한달", "최근 1년"];


  const keywords: KeywordPoint[] = [
    { label: "기회", x: 30, y: 50, r: 90, group: "green" },
    { label: "앱", x: 45, y: 35, r: 72, group: "teal" },
    { label: "이용자", x: 15, y: 60, r: 64, group: "teal" },
    { label: "단어", x: 20, y: 35, r: 52, group: "gray" },
    { label: "인공지능", x: 80, y: 30, r: 48, group: "gray" },
  ];

  const rankItems = [
    { rank: 1, label: "기회", count: 55 },
    { rank: 2, label: "앱", count: 45 },
    { rank: 3, label: "이용자", count: 35 },
    { rank: 4, label: "단어", count: 25 },
    { rank: 5, label: "인공지능", count: 15 },
  ];

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
          <span className="mock-interview-summary__daterange">2025.12.10~2025.01.10</span>
        </div>
        <SortDropdown
             value={sort}
            options={sortOptions}
            onChange={setSort}
            className="job-posting__sort"
          />
      </div>

      <div className="mock-interview-summary__content">
        <M_MyReportKPIs
          recentInterviewDate="2025.12.10"
          totalCount={81}
          averageDuration="8분 24초"
          bestDate="2025.12.10"
          bestScore="100점"
        />
        <div className="mock-interview-summary__charts">
          <AverageScoreCard
            // score={82}
            // average={72}
            // max={100}
         
            // markLabel="면접우수 마크"
            // topBadgeText="상위10%"
            // secondaryBadges={["기본기 충실", "준비도 높음"]}
          />
          <ScoreTrendCard bestScore="92점">
            <ScoreTrendBarChart
             className="score_trend_bar_chart-mobile"
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

        <div className="mock-interview-summary__panel mock-interview-category-trend">
          <CategoryTrendPanel
            title="나의 모의면접 항목별 종합 분석 추이"
            multiLineLabels={true}
            labels={[
              "2025.01.02",
              "2025.01.04",
              "2025.01.06",
              "2025.01.08",
              "2025.01.10",
              "2025.01.12",
              "2025.01.14",
              "2025.01.16",
              "2025.01.18",
              "2025.01.20",
            ]}
            series={{
              stress: [88, 62, 63, 58, 56, 54, 50, 48, 46, 44],
              competency: [50, 70, 57, 60, 75, 67, 69, 72, 74, 78],
              attitude: [28, 60, 63, 62, 35, 66, 68, 70, 71, 73],
              voice: [48, 50, 54, 56, 59, 61, 64, 66, 69, 71],
            }}
            tension={0}
            height={260}
            legendItems={[
              {
                variant: "competency",
                description:
                  "지원한 직무와 연관된 지식, 혹은 경험 및 역량의 내용 전달이 다소 부족했습니다. 지원한 직무와 연관된 지식, 혹은 경험 및 역량의 내용 전달이 다소 부족했습니다.",
                rating: 2,
                ratingText: "중",
              },
              {
                variant: "attitude",
                description:
                  "지원한 직무와 연관된 지식, 혹은 경험 및 역량의 내용 전달이 다소 부족했습니다. 지원한 직무와 연관된 지식, 혹은 경험 및 역량의 내용 전달이 다소 부족했습니다.",
                rating: 2,
                ratingText: "중",
              },
              {
                variant: "voice",
                description:
                  "지원한 직무와 연관된 지식, 혹은 경험 및 역량의 내용 전달이 다소 부족했습니다. 지원한 직무와 연관된 지식, 혹은 경험 및 역량의 내용 전달이 다소 부족했습니다.",
                rating: 2,
                ratingText: "중",
              },
              {
                variant: "stress",
                description:
                  "지원한 직무와 연관된 지식, 혹은 경험 및 역량의 내용 전달이 다소 부족했습니다. 지원한 직무와 연관된 지식, 혹은 경험 및 역량의 내용 전달이 다소 부족했습니다.",
                rating: 2,
                ratingText: "중",
              },
            ]}
          />
        </div>

        <div className="mock-interview-summary__panel mock-interview-summary__panel--keywords">
          <MockInterviewKeywordsPanel
            scale={0.5}
            iconSrc={ic_open_book_24}
            title="내가 자주 사용하는 단어"
            // keywords={keywords}
            // rankItems={rankItems}
          />
        </div>

        <div className="mock-interview-summary__panel mock-interview-summary__panel--jobs">
          <JobMatchHistoryPanel
            titleIconSrc={ic_rocket_24}
            title="채용 공고 매칭 히스트리 TOP 5"
            items={jobs}
            viewAllIconSrc={ic_arrow_up_right_gray900_20}
            onClickViewAll={() => {}}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>
    </>
  );
}
