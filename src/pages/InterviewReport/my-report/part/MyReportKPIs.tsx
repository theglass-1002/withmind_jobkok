// src/pages/InterviewReport/my-report/part/MyReportKPIs.tsx
import React, { ReactNode } from "react";
import type { MyReportResponse } from "@/api/report/report.types";

type KPICardProps = {
  label: string;
  children: ReactNode;
};

function KPICard({ label, children }: KPICardProps) {
  return (
    <div className="mock-interview-summary__kpi">
      <span className="mock-interview-summary__kpi-label">{label}</span>
      <span className="mock-interview-summary__kpi-value">{children}</span>
    </div>
  );
}

type KPIPairCardProps = {
  label: string;
  date: string;
  score: string;
};

function KPIPairCard({ label, date, score }: KPIPairCardProps) {
  return (
    <div className="mock-interview-summary__kpi">
      <span className="mock-interview-summary__kpi-label">{label}</span>
      <div className="mock-interview-summary__kpi-pair">
        <span className="mock-interview-summary__kpi-date">{date}</span>
        <span className="mock-interview-summary__kpi-score mock-interview-summary__kpi-value--highlight">
          {score}
        </span>
      </div>
    </div>
  );
}

export type MyReportKPIsProps = {
  data?: MyReportResponse | null;
};

function formatDate(value?: string) {
  if (!value) return "-";
  return value.replace(/-/g, ".");
}

function formatDuration(seconds?: number) {
  if (typeof seconds !== "number" || seconds <= 0) return "-";

  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;

  if (minutes === 0) return `${remainSeconds}초`;
  return `${minutes}분 ${remainSeconds}초`;
}

function formatScore(score?: number) {
  if (typeof score !== "number") return "-";
  return `${score}점`;
}

export default function MyReportKPIs({ data }: MyReportKPIsProps) {
  const displayRecentInterviewDate = formatDate(
    data?.summaryCards?.lastInterviewDate
  );

  const displayTotalCount =
    typeof data?.summaryCards?.totalCount === "number"
      ? data.summaryCards.totalCount
      : 0;

  const displayAverageDuration = formatDuration(
    data?.summaryCards?.avgDuration
  );

  const displayBestDate = formatDate(data?.summaryCards?.bestScoreDate);

  const displayBestScore = formatScore(data?.summaryCards?.bestScore);

  return (
    <>
    <div className="mock-interview-summary__kpis">
      <KPICard label="최근 면접 일자">{displayRecentInterviewDate}</KPICard>

      <KPICard label="총 면접 횟수">
        <>
          {displayTotalCount}{" "}
          <span className="mock-interview-summary__kpi-unit">회</span>
        </>
      </KPICard>

      <KPICard label="평균 면접 시간">{displayAverageDuration}</KPICard>

      <KPIPairCard
        label="가장 높은 점수의 면접"
        date={displayBestDate}
        score={displayBestScore}
      />
    </div>
    <div className="mock-interview-summary__kpis mobile">
      <KPICard label="최근 면접 일자">{displayRecentInterviewDate}</KPICard>

      <KPICard label="총 면접 횟수">
        <>
          {displayTotalCount}{" "}
          <span className="mock-interview-summary__kpi-unit">회</span>
        </>
      </KPICard>

      <KPICard label="평균 면접 시간">{displayAverageDuration}</KPICard>

      <KPIPairCard
        label="가장 높은 점수의 면접"
        date={displayBestDate}
        score={displayBestScore}
      />
    </div>
    </>
  );
}