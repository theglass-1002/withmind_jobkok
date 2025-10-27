import React from "react";

type MetaItem = { key: string; value: string };
type MetaRow = MetaItem[];

/**
 * MockAnalysisHeader
 * 분석 결과 상단 영역 (제목, 상태, 메타 정보)
 */
interface MockAnalysisHeaderProps {
  /** 상단 타이틀 (ex: "분석결과") */
  title: string;
  /** 날짜 텍스트 */
  date: string;
  /** 상태 텍스트 (ex: "진행 완료") */
  status: string;
  /** 메타 정보 행 배열 (각 행은 2개의 key-value 쌍) */
  metaRows: MetaRow[];
}

export default function MockAnalysisHeader({ title, date, status, metaRows }: MockAnalysisHeaderProps) {
  return (
    <div className="mock-analysis__header">
      <div className="mock-analysis__title">
        {title}
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
  );
}
