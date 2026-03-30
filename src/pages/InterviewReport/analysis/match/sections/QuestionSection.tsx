import React, { useMemo } from "react";
import ic_light_bulb_24 from "@/assets/icons/size24/ic_light_bulb_24.png";
import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type Props = {
  reportDetail?: InterviewReportDetailResponse | null;
};

type GroupedQuestion = {
  mainCategory: string;
  items: {
    subCategory: string;
    question: string;
  }[];
};

export default function QuestionSection({ reportDetail }: Props) {
  const expectedQuestions =
    reportDetail?.tab3?.resumeAnalysis?.expectedQuestions ?? [];

  const groupedQuestions = useMemo<GroupedQuestion[]>(() => {
    const map = new Map<string, GroupedQuestion>();

    expectedQuestions.forEach((item) => {
      const key = item.mainCategory;

      if (!map.has(key)) {
        map.set(key, {
          mainCategory: key,
          items: [],
        });
      }

      map.get(key)?.items.push({
        subCategory: item.subCategory,
        question: item.question,
      });
    });

    return Array.from(map.values());
  }, [expectedQuestions]);

  if (!groupedQuestions.length) {
    return null;
  }

  return (
    <div className="report-section report-section--question">
      <span className="report-section__title">
        <img
          src={ic_light_bulb_24}
          alt="Question Icon"
          className="analysis__icon"
        />
        이력서 기반 예상 질문
      </span>

      <div className="question-analysis__container">
        <div className="analysis-table__header">
          <span className="analysis-table__col-title">질문 구분</span>
          <span className="analysis-table__col-title">질문</span>
        </div>

        {groupedQuestions.map((group, index) => (
          <div
            className="analysis-table__row"
            key={`${group.mainCategory}-${index}`}
          >
            <div className="analysis-table__cell analysis-table__cell--label">
              {group.mainCategory}
            </div>

            <div className="analysis-table__cell analysis-table__cell--content">
              {group.items.map((item, itemIndex) => (
                <div
                  className="content__item-wrapper"
                  key={`${group.mainCategory}-${item.subCategory}-${itemIndex}`}
                >
                  <span className="item__label">{item.subCategory}</span>
                  <span className="item__text">{item.question}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="analysis__note">
        <img
          src={ic_error_gray500_20}
          alt="Error Icon"
          className="note__icon"
        />
        이력서에 작성된 경력과 희망 직무를 기반으로, 실제 면접에서 자주
        물어볼 수 있는 예상 질문입니다.
      </div>
    </div>
  );
}