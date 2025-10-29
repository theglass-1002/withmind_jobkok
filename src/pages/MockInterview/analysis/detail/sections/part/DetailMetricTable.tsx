// src/shared/components/detail-analysis/DetailMetricTable.tsx
import React from "react";

type TableRow = {
  label: string;
  values: (string | number)[];
};

type Props = {
  /** 표의 헤더 목록 (가로 제목들) */
  headers: string[];
  /** 데이터 행 배열 */
  rows: TableRow[];
  /** BEM modifier용 타입 (attitude, gaze, gesture, expression 등) */
  type?: string;
  /** 추가 클래스 */
  className?: string;
};

export default function DetailMetricTable({
  headers,
  rows,
  type = "attitude",
  className,
}: Props) {
  const rootClass = `detail-analysis__metric-table ${type} ${
    className ?? ""
  }`;

  return (
    <div className={rootClass}>
      {/* 헤더 */}
      <div className="detail-analysis__metric-table-header">
        {headers.map((header, i) => (
          <span key={i} className="detail-analysis__metric-table-cell">
            {header}
          </span>
        ))}
      </div>

      {/* 데이터 행 */}
      {rows.map((row, i) => (
        <div key={i} className="detail-analysis__metric-table-row">
          <span className="detail-analysis__metric-table-cell detail-analysis__metric-table-cell--label">
            {row.label}
          </span>
          {row.values.map((v, j) => (
            <span key={j} className="detail-analysis__metric-table-cell">
              {v}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
