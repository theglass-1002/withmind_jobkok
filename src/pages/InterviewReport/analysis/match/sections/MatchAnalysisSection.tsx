import React from "react";
import ic_magnifier_24 from "@/assets/icons/size24/ic_magnifier_24.png";
import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  reportDetail?: InterviewReportDetailResponse | null;
};

const subtitleMap: Record<string, string> = {
  overall: "응답 내용이 이력서 기반 직무 설명과 일치하는 정도",
  job: "응답 내용이 이력서 기반 직무 설명과 일치하는 정도",
  experience: "이력서의 에피소드가 실제 응답에 재현되거나 연계 설명된 비율",
  consistency:
    "응답 내용이 이력서에 기반하여 자연스럽고 논리적인 흐름으로 이어졌는지 여부",
};

const gradeClassMap: Record<string, string> = {
  우수: "analysis-table__cell--grade-excellent",
  보통: "analysis-table__cell--grade-average",
  미흡: "analysis-table__cell--grade-poor",
};

export default function MatchAnalysisSection({ reportDetail }: Props) {
  const matchItems = reportDetail?.tab3?.resumeAnalysis?.matchItems ?? [];

  if (!matchItems.length) {
    return null;
  }

  return (
    <div className="report-section report-section--match">
      <span className="report-section__title">
        <img
          src={ic_magnifier_24}
          alt="Magnifier Icon"
          className="analysis__icon"
        />
        일치도 분석
      </span>

      <div className="match-analysis__container">
        <div className="analysis-table__header">
          <span className="analysis-table__col-title analysis-table__col-title--empty"></span>
          <span className="analysis-table__col-title">일치도</span>
          <span className="analysis-table__col-title">평가</span>
          <span className="analysis-table__col-title analysis-table__col-title--detail">
            세부 분석
          </span>
        </div>

        {matchItems.map((item, index) => {
          const subtitle =
            subtitleMap[item.category] ??
            "응답과 이력서 내용의 일치도를 분석한 결과입니다.";

          const gradeClass =
            gradeClassMap[item.grade] ?? "analysis-table__cell--grade-average";

          return (
            <div className="analysis-table__row" key={`${item.category}-${index}`}>
              <div className="analysis-table__cell analysis-table__cell--label">
                <span className="analysis-table__cell-title">
                  {item.description}
                </span>
                <span className="analysis-table__cell-subtitle">{subtitle}</span>
              </div>

              <div className="analysis-table__cell analysis-table__cell--data">
                {item.matchRate}%
              </div>

              <div className="analysis-table__cell analysis-table__cell--grade">
                <span className={gradeClass}>{item.grade}</span>
              </div>

              <div className="analysis-table__cell analysis-table__cell--detail">
                {item.detail}
              </div>
            </div>
          );
        })}
      </div>

      <div className="analysis__note">
        <img
          src={ic_error_gray500_20}
          alt="Error Icon"
          className="note__icon"
        />
        모의면접에서 실제 응답한 내용과 이력서에 작성된 경험 및 역량이 얼마나
        일치하는지를 분석한 결과입니다.
      </div>
    </div>
  );
}