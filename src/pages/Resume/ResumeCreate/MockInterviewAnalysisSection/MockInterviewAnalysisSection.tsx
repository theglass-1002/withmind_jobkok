import React, { useState } from "react";
import "./MockInterviewAnalysisSection.css";
import FormInput from "@/shared/components/form/FormInput";

import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import ic_star_gray700_20 from "@/assets/icons/size20/ic_star_gray700_20.png";
import ic_content_paste_gray900_20 from "@/assets/icons/size20/ic_content_paste_gray900_20.png";



export default function MockInterviewAnalysisSection() {
  const MAX_SUMMARY = 2000;

  const [isAdding, setIsAdding] = useState(false);
  const [summary, setSummary] = useState("");
  const [editing, setEditing] = useState(false);

  const startAdd = () => setIsAdding(true);
  const stopAdd = () => {
    setIsAdding(false);
    setSummary("");
    setEditing(false);
  };

  const startEditing = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e) {
      // IME 조합키/스페이스/엔터 처리
      // @ts-ignore
      if (e.nativeEvent?.isComposing) return;
      const key = (e as React.KeyboardEvent).key;
      if (key !== "Enter" && key !== " ") return;
      e.preventDefault();
    }
    setEditing(true);
  };

  const onChangeSummary = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value.slice(0, MAX_SUMMARY);
    setSummary(v);
  };

  const count = summary.length;

  return (
    <div className="resume-create-page__section resume-create-page__section--mock-interview-analysis">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">모의면접 분석 결과</div>
          </div>
          <div className="section-title__right">
            {isAdding ? (
              <img src={ic_close_gray500_20} alt="닫기" onClick={stopAdd} />
            ) : (
              <span className="resume-section-title__action--import" onClick={startAdd}>
                <img src={ic_add_purple_20} alt="" />
                추가
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={`resume-create-page__section-body ${isAdding ? "personal-statement-section" : "empty"}`}>
        {isAdding ? (
                 <>
                 <label className="portfolio-documents__label small_labe_black-14">
                 분석 결과 <em className="error_text_red">*</em>
                 </label>
                 <div className="portfolio-documents__file">
                   <div className={`portfolio-documents__file-name`}>
                     <img src={ic_content_paste_gray900_20} alt="" />
                     <>선택된 모의면접 분석 결과가 없습니다.</>
                   </div>

                   <span
                     className="default_btn_white"
                     role="button"
                     tabIndex={0}
                     onClick={() => {}}
                   >
                     분석 결과 선택
                   </span>
                 </div>
                 </>
        ) : (
          <>모의면접 결과를 추가해 주세요.</>
        )}
      </div>
    </div>
  );
}
