// MockAnalysisHeader.tsx
import React from "react";
import { useLocation } from "react-router-dom";

type MetaItem = { key: string; value: string };
type MetaRow = MetaItem[];
type TabKey = "overview" | "detail" | "match";

interface MockAnalysisHeaderProps {
  title: string;
  date: string;
  status: string;
  metaRows: MetaRow[];
  activeTab?: TabKey;
}

const TAB_LABELS: Record<TabKey, string> = {
  overview: "종합 분석",
  detail: "상세 분석",
  match: "이력서−면접 일치도 분석",
};

export default function MockAnalysisHeader({ 
  title, 
  date, 
  status, 
  metaRows,
  activeTab = "overview"
}: MockAnalysisHeaderProps) {
  const location = useLocation();
  
  // URL에 printViewr가 있는지 확인
  const isPrintMode = new URLSearchParams(location.search).has('printViewr');
  
  // printViewr가 있으면 activeTab 라벨만, 없으면 title 표시
  const displayTitle = isPrintMode ? TAB_LABELS[activeTab] : title;

  return (
    <>
    <div className="mock-analysis__header">
      <div className="mock-analysis__title">
        {isPrintMode?TAB_LABELS[activeTab]:displayTitle}
        
        <div className="mock-analysis__title-meta">
          <span className="mock-analysis__title-date">{date}</span>
          <span className="mock-analysis__title-status mock-analysis__title-status--done">
            {status}
          </span>
        </div>
      </div>

      <div className="mock-analysis__meta">
        {metaRows.map((row, rowIndex) => (
          <div key={rowIndex} className="mock-analysis__meta-row">
            {row.map((item, itemIndex) => (
              <div key={itemIndex} className="mock-analysis__meta-item">
                <span className="mock-analysis__meta-key">{item.key}</span>
                <span className="mock-analysis__meta-value">{item.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

    <div className="mock-analysis__header mobile">
      <div className="mock-analysis__meta">
        <div className="mock-analysis__meta-row">
          <div className="mock-analysis__meta-item">
          <span className="mock-analysis__meta-key">{status}</span>
          <span className="mock-analysis__meta-value">{date}</span>
          </div>
        </div>
        {metaRows.map((row, rowIndex) => (
          <div key={rowIndex} className="mock-analysis__meta-row">
            {row.map((item, itemIndex) => (
              <div key={itemIndex} className="mock-analysis__meta-item">
                <span className="mock-analysis__meta-key">{item.key}</span>
                <span className="mock-analysis__meta-value">{item.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
    </>
  );
}