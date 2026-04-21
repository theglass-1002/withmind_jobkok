import React from "react";
import { type M_InterviewReportHistoryItemData } from "./M_MockInterviewHistoryList";

interface M_InterviewReportHistoryRowProps {
  item: M_InterviewReportHistoryItemData;
  viewIconSrc: string;
}

export default function M_InterviewReportHistoryRow({ item, viewIconSrc }: M_InterviewReportHistoryRowProps) {
  const statusCls =
    item.statusState === "done" ? " is-done" : item.statusState === "doing" ? " is-doing" : "";

  const handleClickView = () => {
    item.onClickView?.();
  };

    return (
      <div className="mock-history__row">
        <div className="mock-history__avatar">
          <img className="mock-history__avatar-img" src={item.avatarSrc} alt="" />
          <span className="mock-history__item_num">{item.no}</span>
        </div>
        <div className="mock-history__content">
          <div className="mock-history__info">
            <div className="mock-history__primary">
              <span className="mock-history__score">[{item.scoreText}]</span>
              <span className="mock-history__role">{item.roleText}</span>
            </div>
            <div className="mock-history__meta">
              <span className={`mock-history__status${statusCls}`}>{item.statusText}</span>
              <span className="mock-history__date">{item.dateText}</span>
            </div>
          </div>
          <div className="mock-history__resume-title">
          <img src={item.resumeLabelIconSrc} alt="" />
          {item.resumeText}
          </div>
        </div>
        <div className="mock-history__btn_wrap">
        <button className="btn_w_full default_btn_white" onClick={handleClickView}>
            <img src={viewIconSrc} alt="" />
            {item.statusState === "doing" ? "이어서 진행하기" : "분석결과보기"}
          </button>
        </div>
  
      </div>
    );
}


      {/* <div className="mock-history__row-line data-list__row">
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
      </div> */}