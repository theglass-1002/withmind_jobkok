// src/pages/InterviewReport/my-report/MyReportResult.tsx
import React, { useEffect, useMemo, useState } from "react";

import ic_event_available_gray700_20 from "@/assets/icons/size20/ic_event_available_gray700_20.png";
import ic_open_book_24 from "@/assets/icons/size24/ic_open_book_24.png";
import ic_rocket_24 from "@/assets/icons/size24/ic_rocket_24.png";
import test_company_logo from "@/assets/testImg/company_logo/test_company_logo.png";
import ic_saramin_18 from "@/assets/icons/size18/ic_saramin_18.png";
import ic_star_green_18 from "@/assets/icons/size18/ic_star_green_18.png";
import ic_fire_16 from "@/assets/icons/size16/ic_fire_16.png";
import ic_seed_16 from "@/assets/icons/size16/ic_seed_16.png";
import ic_arrow_up_right_gray900_20 from "@/assets/icons/size20/ic_arrow_up_right_gray900_20.png";

import { fetchMyReport } from "@/api/report/report.api";
import type { MyReportResponse } from "@/api/report/report.types";

import MyReportKPIs from "@/pages/InterviewReport/my-report/part/MyReportKPIs";
import AverageScoreCard from "@/pages/InterviewReport/my-report/part/AverageScoreCard";
import ScoreTrendCard from "@/pages/InterviewReport/my-report/part/ScoreTrendCard";
import ScoreTrendBarChart from "@/pages/InterviewReport/my-report/part/ScoreTrendBarChart";
import CategoryTrendPanel from "@/pages/InterviewReport/my-report/part/CategoryTrendPanel";
import { type KeywordPoint } from "@/pages/InterviewReport/my-report/part/KeywordsBubbleChart";
import MockInterviewKeywordsPanel from "@/pages/InterviewReport/my-report/part/MockInterviewKeywordsPanel";
import JobMatchHistoryPanel from "@/pages/InterviewReport/my-report/part/JobMatchHistoryPanel";
import type { JobCardV2Item } from "@/pages/InterviewReport/my-report/part/JobCardV2List";
import SortDropdown from "@/shared/components/sort-dropdown/SortDropdown";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
// 실제 경로가 다르면 여기만 네 프로젝트 경로에 맞게 수정

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

const sortOptions = ["최근 10일", "최근 30일", "최근 1년"] as const;

const SORT_PERIOD_MAP: Record<(typeof sortOptions)[number], number> = {
  "최근 10일": 10,
  "최근 30일": 30,
  "최근 1년": 365,
};

function formatDateToDot(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function getDateRangeText(period: number) {
  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(endDate.getDate() - period);

  return `${formatDateToDot(startDate)}~${formatDateToDot(endDate)}`;
}

function formatDuration(minutes?: number) {
  if (!minutes || minutes <= 0) return "-";

  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  if (hour > 0) {
    return `${hour}시간 ${minute}분`;
  }

  return `${minute}분`;
}

export default function MyReportResult() {
  const [jobs, setJobs] = useState<JobCardV2Item[]>(mockJobs);
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("최근 10일");
  const [myReport, setMyReport] = useState<MyReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const handleToggleFavorite = (id: string | number) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.jobIdx === id ? { ...j, isBookmarked: !j.isBookmarked } : j
      )
    );
  };

  const period = useMemo(() => SORT_PERIOD_MAP[sort], [sort]);
  const dateRangeText = useMemo(() => getDateRangeText(period), [period]);

  useEffect(() => {
    const loadMyReport = async () => {
      try {
        setLoading(true);
        const data = await fetchMyReport(period);
        console.log("[MyReport API response]", data);
        setMyReport(data);
      } catch (err) {
        console.error("[MyReport API error]", err);
        setMyReport(null);
      } finally {
        setLoading(false);
      }
    };

    loadMyReport();
  }, [period]);

  const keywords: KeywordPoint[] =
    myReport?.frequentWords?.slice(0, 5).map((item, index) => {
      const preset = [
        { x: 30, y: 50, r: 90, group: "green" as const },
        { x: 45, y: 35, r: 72, group: "teal" as const },
        { x: 15, y: 60, r: 64, group: "teal" as const },
        { x: 20, y: 35, r: 52, group: "gray" as const },
        { x: 80, y: 30, r: 48, group: "gray" as const },
      ][index];

      return {
        label: item.word,
        x: preset?.x ?? 50,
        y: preset?.y ?? 50,
        r: preset?.r ?? 50,
        group: preset?.group ?? "gray",
      };
    }) ?? [];

  const rankItems =
    myReport?.frequentWords?.slice(0, 5).map((item) => ({
      rank: item.rank,
      label: item.word,
      count: item.count,
    })) ?? [];

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!myReport) {
    return (
      <div className="mock-interview-summary__empty">
       
      </div>
    );
  }

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
          <span className="mock-interview-summary__daterange">
            {dateRangeText}
          </span>
        </div>

        <SortDropdown
          value={sort}
          options={[...sortOptions]}
          onChange={(value) => setSort(value as (typeof sortOptions)[number])}
          className="job-posting__sort"
        />
      </div>

      <div className="mock-interview-summary__content">
        <MyReportKPIs
          recentInterviewDate={myReport.summaryCards.lastInterviewDate ?? "-"}
          totalCount={myReport.summaryCards.totalCount}
          averageDuration={formatDuration(myReport.summaryCards.avgDuration)}
          bestDate={myReport.summaryCards.bestScoreDate ?? "-"}
          bestScore={
            myReport.summaryCards.bestScore != null
              ? `${myReport.summaryCards.bestScore}점`
              : "-"
          }
          data={myReport}
        />

        <div className="mock-interview-summary__charts">
          <AverageScoreCard
            score={myReport.myAvgScore.avgScore}
            average={myReport.myAvgScore.globalAvg}
            max={100}
            markLabel={myReport.myAvgScore.gradeText}
            desc={myReport.myAvgFeedback.overallFeedback}
            topBadgeText={`상위 ${myReport.myAvgScore.topPercent}%`}
            secondaryBadges={[
              myReport.myAvgScore.basicLevel,
              myReport.myAvgScore.readiness,
            ]}
            data={myReport}
          />

          <ScoreTrendCard bestScore={`${myReport.bestScore}점`}>
            <ScoreTrendBarChart
              dates={myReport.scoreTrend.map((item) => item.date)}
              values={myReport.scoreTrend.map((item) => item.score)}
              max={100}
            />
          </ScoreTrendCard>
        </div>

        <div className="mock-interview-summary__panel mock-interview-category-trend">
          <CategoryTrendPanel
            labels={myReport.categoryTrend.map((item) => item.date)}
            series={{
              stress: myReport.categoryTrend.map((item) => item.tensionScore),
              competency: myReport.categoryTrend.map(
                (item) => item.abilityScore
              ),
              attitude: myReport.categoryTrend.map(
                (item) => item.attitudeScore
              ),
              voice: myReport.categoryTrend.map((item) => item.voiceScore),
            }}
            tension={0}
            height={260}
            legendItems={[
              {
                variant: "competency",
                description: myReport.myAvgFeedback.abilityFeedback,
                rating: 2,
                ratingText: myReport.categorySummary.abilityGrade,
              },
              {
                variant: "attitude",
                description: myReport.myAvgFeedback.attitudeFeedback,
                rating: 2,
                ratingText: myReport.categorySummary.attitudeGrade,
              },
              {
                variant: "voice",
                description: myReport.myAvgFeedback.voiceFeedback,
                rating: 2,
                ratingText: myReport.categorySummary.voiceGrade,
              },
              {
                variant: "stress",
                description: myReport.myAvgFeedback.tensionFeedback,
                rating: 2,
                ratingText: myReport.categorySummary.tensionGrade,
              },
            ]}
          />
        </div>

        <div className="mock-interview-summary__panel mock-interview-summary__panel--keywords">
          <MockInterviewKeywordsPanel
            iconSrc={ic_open_book_24}
            title="내가 자주 사용하는 단어"
            keywords={keywords}
            rankItems={rankItems}
          />
        </div>

        {/* <div className="mock-interview-summary__panel mock-interview-summary__panel--jobs">
          <JobMatchHistoryPanel
            titleIconSrc={ic_rocket_24}
            title="채용 공고 매칭 히스트리 TOP 5"
            items={jobs}
            viewAllIconSrc={ic_arrow_up_right_gray900_20}
            onClickViewAll={() => {}}
            onToggleFavorite={handleToggleFavorite}
          />
        </div> */}
      </div>
    </>
  );
}