// src/pages/InterviewReport/my-report/MyReportResult.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ic_event_available_gray700_20 from "@/assets/icons/size20/ic_event_available_gray700_20.png";
import ic_open_book_24 from "@/assets/icons/size24/ic_open_book_24.png";

import { fetchMyReport } from "@/api/report/report.api";
import type { MyReportResponse } from "@/api/report/report.types";

import MyReportKPIs from "@/pages/InterviewReport/my-report/part/MyReportKPIs";
import AverageScoreCard from "@/pages/InterviewReport/my-report/part/AverageScoreCard";
import ScoreTrendCard from "@/pages/InterviewReport/my-report/part/ScoreTrendCard";
import ScoreTrendBarChart from "@/pages/InterviewReport/my-report/part/ScoreTrendBarChart";
import CategoryTrendPanel from "@/pages/InterviewReport/my-report/part/CategoryTrendPanel";
import MockInterviewKeywordsPanel from "@/pages/InterviewReport/my-report/part/MockInterviewKeywordsPanel";
import SortDropdown from "@/shared/components/sort-dropdown/SortDropdown";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { logout } from "@/api/auth/auth.api";

const sortOptions = ["최근 10일 기준", "최근 30일 기준", "최근 1년 기준"] as const;

const SORT_PERIOD_MAP: Record<(typeof sortOptions)[number], number> = {
  "최근 10일 기준": 10,
  "최근 30일 기준": 30,
  "최근 1년 기준": 365,
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

export default function MyReportResult() {
  const navigate = useNavigate();
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("최근 10일 기준");
  const [myReport, setMyReport] = useState<MyReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const period = useMemo(() => SORT_PERIOD_MAP[sort], [sort]);
  const dateRangeText = useMemo(() => getDateRangeText(period), [period]);

  useEffect(() => {
    const loadMyReport = async () => {
      try {
        setLoading(true);
        const data = await fetchMyReport(period);
        console.log(data);
        setMyReport(data);
      } catch (err) {
        if (err?.code === 999) {
          logout();
          navigate("/login");
          return;
        }
        console.error("[MyReport API error]", err);
        setMyReport(null);
      } finally {
        setLoading(false);
      }
    };

    loadMyReport();
  }, [period]);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!myReport) {
    return <div className="mock-interview-summary__empty"></div>;
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
        <MyReportKPIs data={myReport} />

        <div className="mock-interview-summary__charts">
          <AverageScoreCard data={myReport} />

          <ScoreTrendCard bestScore={`${myReport.bestScore ?? 0}점`}>
            <ScoreTrendBarChart data={myReport} />
          </ScoreTrendCard>
        </div>

        <div className="mock-interview-summary__panel mock-interview-category-trend">
          <CategoryTrendPanel data={myReport} />
        </div>

        <div className="mock-interview-summary__panel mock-interview-summary__panel--keywords">
          <MockInterviewKeywordsPanel
            iconSrc={ic_open_book_24}
            title="내가 자주 사용하는 단어"
            data={myReport}
          />
        </div>

        {/* 
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
        */}
      </div>
      
    </>
  );
}