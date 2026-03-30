import React from "react";
import ic_light_bulb_24 from "@/assets/icons/size24/ic_light_bulb_24.png";
import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";
import { InterviewReportDetailResponse } from "@/api/report/report.types";
import { Icons } from "@/assets/icons";

type Props = {
  reportDetail?: InterviewReportDetailResponse | null;
};

function renderExpectedEffect(text: string) {
  return text.split(/(\d+%)/g).map((part, index) => {
    if (/^\d+%$/.test(part)) {
      return (
        <span key={index} className="percent-highlight">
          {part}
        </span>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export default function SuggestionSection({ reportDetail }: Props) {
  const suggestions =
    reportDetail?.tab3?.resumeAnalysis?.supplementSuggestions ?? [];

  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="report-section report-section--suggest">
      <span className="report-section__title">
        <img
          src={ic_light_bulb_24}
          alt="Light Icon"
          className="analysis__icon"
        />
        이력서 보완 제안
      </span>

      <div className="suggest-analysis__container">
        <div className="analysis-table__header">
          <span className="analysis-table__col-title">누락된 역량/경험</span>
          <span className="analysis-table__col-title">제안 내용</span>
          <span className="analysis-table__col-title">기대 효과</span>
        </div>

        {suggestions.map((item, index) => (
          <div
            className="analysis-table__row"
            key={`${item.missingSkill}-${index}`}
          >
            <div className="analysis-table__cell analysis-table__cell--label">
              {item.missingSkill}
            </div>

            <div className="analysis-table__cell analysis-table__cell--suggestion">
              <span className="guide__description">{item.suggestion}</span>
              <span className="guide__example">예 : {item.ex}</span>
            </div>

            <div className="analysis-table__cell analysis-table__cell--effect">
            <span className="effect-text">
              {renderExpectedEffect(item.expectedEffect)}
            </span>
          </div>
          </div>
        ))}
      </div>

      <span className="btn_w_full center">
        <button className="default_btn_white radius" type="button">
          <img src={Icons.ic_arrow_up_right_gray900_20} alt="" />
          이력서 수정하기
        </button>
      </span>

      <div className="analysis__note">
        <img
          src={ic_error_gray500_20}
          alt="Error Icon"
          className="note__icon"
        />
        이력서에는 드러나지 않았지만, 실제 면접 응답에서 강하게 나타난 주요
        역량/경험들을 기반으로 추가 기재가 필요한 항목을 제안드립니다.
      </div>
    </div>
  );
}