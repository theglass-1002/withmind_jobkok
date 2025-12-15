import React, { ReactNode } from "react";

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
  score: string; // "100점" 처럼 단위 포함 문자열
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

export type M_MyReportKPIsProps = {
  recentInterviewDate: string; // 예: "2025.12.10"
  totalCount: number;          // 예: 81
  averageDuration: string;     // 예: "8분 24초"
  bestDate: string;            // 예: "2025.12.10"
  bestScore: string;           // 예: "100점"
};

export default function M_MyReportKPIs({
  recentInterviewDate,
  totalCount,
  averageDuration,
  bestDate,
  bestScore,
}: M_MyReportKPIsProps) {
  return (
    <div className="mock-interview-summary__kpis">
       <div className="mock-interview-summary__kpi-item">
        <span className="mock-interview-summary__kpi-label">최근 면접 일자</span>
        <span className="mock-interview-summary__kpi-value">{recentInterviewDate}</span>
      </div>
        <div className="mock-interview-summary__kpi-item">
        <span className="mock-interview-summary__kpi-label">총 면접 횟수</span>
        <span className="mock-interview-summary__kpi-value">
          {totalCount} <span className="mock-interview-summary__kpi-unit">회</span>
        </span>
      </div>
        <div className="mock-interview-summary__kpi-item">
        <span className="mock-interview-summary__kpi-label">평균 면접 시간</span>
        <span className="mock-interview-summary__kpi-value">{averageDuration}</span>
      </div>
        <div className="mock-interview-summary__kpi-item">
        <span className="mock-interview-summary__kpi-label">가장 높은 점수의 면접</span>
        <div className="mock-interview-summary__kpi-pair">
          <span className="mock-interview-summary__kpi-date">{bestDate}</span>
          <span className="mock-interview-summary__kpi-score mock-interview-summary__kpi-value--highlight">{bestScore}</span>
        </div>
      </div>
    </div>
  );
}
