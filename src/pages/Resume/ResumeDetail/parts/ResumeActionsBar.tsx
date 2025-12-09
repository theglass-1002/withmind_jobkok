import React from "react";
import { Link } from "react-router-dom";
import ic_download_gray900_20 from "@/assets/icons/size20/ic_download_gray900_20.png";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";


type Props = {
  postId?:string;
  onTempSave?: () => void;
  onSubmit?: () => void;
  onDownloadPdf?: () => void; 
  onEdit?: () => void;    
  showRightActions?: boolean; 
};

export default function ResumeActionsBar({
  onTempSave,
  onSubmit,
  onDownloadPdf,
  onEdit,
  showRightActions = true, // 기본값 true
}: Props) {
  return (
    <div className="resume-controls-wrapper">
      <div className="resume-create-page__status">
        
        {/* 왼쪽 영역 */}
       
          <span className="default_btn_white" onClick={onEdit}>
          <img src={ic_edit_gray900_20} alt="" />
          수정
          </span>
          <span className="default_btn_white" onClick={onDownloadPdf}>
            <img src={ic_download_gray900_20} alt="" />
            PDF로 저장
          </span>
       

        {/* 오른쪽 영역 - 표시 여부 제어 */}
        {showRightActions && (
          <div className="resume-detail__actions-right">
            <span className="default_btn_white" onClick={onTempSave}>
              임시저장
            </span>
            <span className="default_btn_black" onClick={onSubmit}>
              작성 완료
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
