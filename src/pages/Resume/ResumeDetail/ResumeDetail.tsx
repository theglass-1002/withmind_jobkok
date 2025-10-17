// src/pages/.../ResumeDetail.tsx
import React, { useState } from "react";
import "@/pages/Resume/Resume.css";
import "./ResumeDetail.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResumeSidebar, {
  type SectionId,
  type Status,
} from "@/pages/Resume/ResumeSidebar/ResumeSidebar";

import ic_download_gray900_20 from "@/assets/icons/size20/ic_download_gray900_20.png";
import ic_edit_gray900_20 from "@/assets/icons/size20/ic_edit_gray900_20.png";
import ic_mail_gray500_20 from "@/assets/icons/size20/ic_mail_gray500_20.png";
import ic_mobile_gray_20 from "@/assets/icons/size20/ic_mobile_gray_20.png";
import ic_chevron_forward_gray900_20 from "@/assets/icons/size20/ic_chevron_forward_gray900_20.png";
import test_resume_img from "@/assets/testImg/test_resume_img.png";



const ALL_SECTIONS: SectionId[] = [
  "title",
  "basic",
  "location",
  "career",
  "education",
  "desiredRole",
  "hardSkills",
  "softSkills",
  "activities",
  "awards",
  "portfolio",
  "selfIntro",
  "mockInterview",
];

export default function ResumeDetail() {
  const [sidebarStatus, setSidebarStatus] = useState<
    Partial<Record<SectionId, Status>>
  >({});

  const handleTempSave = () => {
    toast.success("임시 저장되었습니다.");
  };

  const handleSubmit = () => {
    const next: Partial<Record<SectionId, Status>> = {};
    ALL_SECTIONS.forEach((id) => {
      next[id] = "completed";
    });
    setSidebarStatus(next);
  };

  return (
      <div className="resume-page resume-page--detail">
        <div className="resume-page__status">
          <div className="resume-detail__actions-left">
            <span className="default_btn_white">
              <img src={ic_download_gray900_20} alt="" />
              PDF로 저장</span>
            <span className="default_btn_white">
            <img src={ic_edit_gray900_20} alt="" />
              수정</span>
          </div>
          <div className="resume-detail__actions-right">
            <span className="default_btn_white" onClick={handleTempSave}>
              임시저장
            </span>
            <span className="default_btn_black" onClick={handleSubmit}>
              작성 완료
            </span>
          </div>
        </div>
        <div className="resume-page__container">
        <div className="resume-page__main">
          <span className="resume-detail__title">성장하는 개발자, 준비된 홍길동입니다.</span>
          <div className="resume-detail__content">
            <div className="resume-basic">
              <div className="resume-basic__text">
                <div className="resume-basic__identity">
                  <span className="resume-basic__name">홍길동</span>
                  <span className="resume-basic__meta">2000년생(만 23세), 남성</span>
                </div>
                <div className="resume-basic__contact">
                  <span className="resume-basic__email">
                    <img src={ic_mail_gray500_20} alt="" />
                    hong1234@withmind.net</span>
                  <span className="resume-basic__phone">
                    <img src={ic_mobile_gray_20} alt="" />
                    010-1234-5678</span>
                </div>
              </div>
              <span className="resume-basic__img">
                <img src={test_resume_img} alt="" />
              </span>
            </div>

            <div className="resume-field resume-field--location">
              <span className="resume-field__label">희망 근무 지역</span>
              <div className="resume-field__value resume-location-list">
                <div className="resume-location">
                  <span className="resume-location__city">서울</span>
                  <img className="resume-location__chevron" src={ic_chevron_forward_gray900_20} alt="" />
                  <span className="resume-location__district">강남구</span>
                </div>

                <div className="resume-location">
                  <span className="resume-location__city">서울</span>
                  <img className="resume-location__chevron" src={ic_chevron_forward_gray900_20} alt="" />
                  <span className="resume-location__district">용산구</span>
                </div>
              </div>
            </div>

            <div className="resume-field resume-field--education">
              <span className="resume-field__label">학력</span>
              <span className="resume-field__value">위드대학교</span>
            </div>
          </div>
        </div>

        <ResumeSidebar statusMap={sidebarStatus} />
      </div>

      </div>
    );
  }
