import React from "react";
import { type MockInterviewHistoryItemData } from "./MockInterviewHistoryList";

interface MockInterviewHistoryRowProps {
  item: MockInterviewHistoryItemData;
  viewIconSrc: string;
}

export default function MockInterviewHistoryRow({ item, viewIconSrc }: MockInterviewHistoryRowProps) {
  const statusCls =
    item.statusState === "done" ? " is-done" : item.statusState === "doing" ? " is-doing" : "";

  return (
    <div className="mock-history__row">
      <div className="mock-history__row-line data-list__row">
        <span className="mock-history__cell mock-history__cell--no     data-list__col u-col--w100">{item.no}</span>
        <span className="mock-history__cell mock-history__cell--avatar data-list__col u-col--w120">
          <span className="mock-history__avatar">
            <img className="mock-history__avatar-img" src={item.avatarSrc} alt="" />
          </span>
        </span>
        <span className="mock-history__cell mock-history__cell--score  data-list__col u-col--w160">{item.scoreText}</span>
        <span className="mock-history__cell mock-history__cell--role   data-list__col u-col--w231">{item.roleText}</span>
        <span className="mock-history__cell mock-history__cell--date   data-list__col u-col--w220">{item.dateText}</span>
        <span className={`mock-history__cell mock-history__cell--status${statusCls} data-list__col u-col--w160`}>
          {item.statusText}
        </span>
        <span className="mock-history__cell mock-history__cell--action data-list__col u-col--w210 ">
          <button className="default_btn_white" onClick={item.onClickView}>
            <img src={viewIconSrc} alt="" />
            분석결과보기
          </button>
        </span>
      </div>

      <div className="mock-history__row-extra">
        <div className="mock-history__extra-label">
          <img className="mock-history__extra-icon" src={item.resumeLabelIconSrc} alt="" />
          선택 이력서
        </div>
        <span className="mock-history__extra-text">{item.resumeText}</span>
        <span className="mock-history__extra-date">{item.resumeDate}</span>
      </div>
    </div>
  );
}
