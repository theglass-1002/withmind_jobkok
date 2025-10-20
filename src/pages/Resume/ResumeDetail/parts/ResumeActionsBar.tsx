import React from "react";
import { Link } from "react-router-dom";
import ic_download_gray900_20 from "@/assets/icons/size20/ic_download_gray900_20.png";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";

type Props = {
  onTempSave: () => void;
  onSubmit: () => void;
};

export default function ResumeActionsBar({ onTempSave, onSubmit }: Props) {
  return (
    <div className="resume-page__status">
      <div className="resume-detail__actions-left">
        <span className="default_btn_white">
          <img src={ic_download_gray900_20} alt="" />
          PDF로 저장
        </span>
        <Link
          to={`/resumes/13/edit`}
          className="default_btn_white"
          aria-label="이력서 수정 페이지로 이동"
        >
          <img src={ic_edit_gray900_20} alt="" />
          수정
        </Link>
      </div>
      <div className="resume-detail__actions-right">
        <span className="default_btn_white" onClick={onTempSave}>
          임시저장
        </span>
        <span className="default_btn_black" onClick={onSubmit}>
          작성 완료
        </span>
      </div>
    </div>
  );
}
