import React, { useState, useEffect, useRef ,useCallback } from "react";
import "./ResumeCreate.css";
import Switch from "react-switch";
import Tabs from "@/shared/components/tabs/Tabs";
import {useStickyTabs, tabItems, BasicInfo ,ALL_SECTIONS ,
  BasicErrors,initial,FormState,SectionId,
  LocationValue} from '@/shared/utils/util';
import { toast } from "react-toastify";
import Modal from "@/shared/components/modal/Modal";


import M_BasicInfoSection from "./ResumeCreate/BasicInfoSection/M_BasicInfoSection";
import M_LocationSection from "./ResumeCreate/LocationSection/M_LocationSection";
import M_CareerSection from "./ResumeCreate/CareerSection/M_CareerSection";
import M_EducationSection,{
  type Education,
  type EducationErrors
} from "./ResumeCreate/EducationSection/M_EducationSection";
import M_DesiredRoleSection from "./ResumeCreate/DesiredRoleSection/M_DesiredRoleSection";
import M_HardSkillSection from "./ResumeCreate/HardSkillSection/M_HardSkillSection";
import M_SoftSkillsSection from "./ResumeCreate/SoftSkillsSection/M_SoftSkillsSection";
import M_ActivitiesSection from "./ResumeCreate/ActivitiesSection/M_ActivitiesSection";
import M_AwardsCertificationsSection from "./ResumeCreate/AwardsCertificationsSection/M_AwardsCertificationsSection";
import M_PortfolioDocumentsSection from "./ResumeCreate/PortfolioDocumentsSection/M_PortfolioDocumentsSection";
import M_SelfIntroductionSection from "./ResumeCreate/SelfIntroductionSection/M_SelfIntroductionSection";
import M_MockInterviewAnalysisSection from "./ResumeCreate/MockInterviewAnalysisSection/M_MockInterviewAnalysisSection";
import ResumeSidebar, {
  type Status,
} from "./ResumeSidebar/ResumeSidebar";

import ic_star_gray700_20 from "@/assets/icons/size20/ic_star_gray700_20.png";
import "react-toastify/dist/ReactToastify.css";


export default function M_ResumeCreate() {
  const [form, setForm] = useState<FormState>(initial);
  const [showDefaultModal, setShowDefaultModal] = useState(false); // 기본 이력서 설정 모달
  const [errors, setErrors] = useState<{ 
    education? :EducationErrors;
    basic: BasicErrors; title?: string; location?: string }>({
    basic: {},
    education:{},
    
  });
  const [isDefaultResume, setIsDefaultResume] = useState(false);
  const [sidebarStatus, setSidebarStatus] = useState<Partial<Record<SectionId, Status>>>({});
  const [activeTab, setActiveTab] = useState("title");

  const isTabsSticky = useStickyTabs(
    "resume__create-section--title",
    ".default_tabs",
    ".page-header"
  );

  const handleTabClick = (key: string) => {
    setActiveTab(key);
    console.log('선택 된 탭', key);
  
    if (key === 'title'||key==='basic') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const targetId = `resume__create-section--${key}`;
    const targetElement = document.getElementById(targetId);
  
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleToggle = (checked: boolean) => {
    if (checked) {
      setShowDefaultModal(true);
    } else {
      // 끄는 건 그냥 끄기
      setIsDefaultResume(false);
    }
  };

  const handleConfirmDefaultResume = () => {
    setIsDefaultResume(true);
    setShowDefaultModal(false);
    toast.success("기본 이력서로 설정되었습니다.");
  };

  const handleCancelDefaultResume = () => {
    setShowDefaultModal(false);
    // 스위치 값은 그대로 false 유지
  };


  const updateBasic = (patch: Partial<BasicInfo>) =>
    setForm((prev) => ({ ...prev, basic: { ...prev.basic, ...patch } }));

  const updateLocation = (patch: Partial<LocationValue>) =>
    setForm((prev) => ({ ...prev, location: { ...prev.location, ...patch } }));

  const updateEducation = (newList: Education[]) =>
    setForm((prev) => ({ ...prev, education: newList }));
  
  const resetBasicErrors = () => setErrors((prev) => ({ ...prev, basic: {} }));

  const handleTempSave = () => {
    toast.success("임시 저장되었습니다.");
  };

  const validate = () => {
    const nextErr: typeof errors = { basic: {} };
    if (!form.title.trim()) nextErr.title = "이력서 제목을 입력해 주세요.";
    if (!form.location.nationwide && form.location.selectedKeys.length === 0) {
      nextErr.location = "희망 근무 지역을 1개 이상 선택해 주세요.";
    }
    setErrors(nextErr);
    return !nextErr.title && !nextErr.location;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error("필수 항목을 확인해주세요.");
      return;
    }
    const next: Partial<Record<SectionId, Status>> = {};
    ALL_SECTIONS.forEach((id) => {
      next[id] = "completed";
    });
    setSidebarStatus(next);
  };

  const isSubmitDisabled =
    !form.title.trim() ||
    (!form.location.nationwide && form.location.selectedKeys.length === 0);


  return (
    <div className="resume-create-page mobile">
      <div className="resume-create-page__container">
        <div className="resume-create-page__main">
        <div className="resume-sidebar__default">
        <span className="resume-sidebar__default-text">기본 이력서로 설정</span>
        <label className="resume-sidebar__default-label" aria-label="기본 이력서로 설정">
            <Switch
              checked={isDefaultResume}
              onChange={handleToggle}
              onColor="#000000"
              offColor="#E5E7EB"
              onHandleColor="#FFFFFF"
              offHandleColor="#FFFFFF"
              handleDiameter={18}
              height={22}
              width={42}
              uncheckedIcon={false}
              checkedIcon={false}
              aria-label="기본 이력서로 설정"
            />
          </label>
        </div>
        <Tabs
            tabs={tabItems}
            active={activeTab}
            onChange={handleTabClick}
            className={`resume-create-tabs default_tabs ${isTabsSticky?'is-sticky':''}`}
            itemClassName="resume-create-tabs__item"
            activeClassName="on"
            />
            
        <div className="resume-create-page__section_container">
          <div id="resume__create-section--title" 
           className="resume-create-page__section resume-create-page__section--title">
            <div className="resume-create-page__field">
              <input
                className="resume-create-page__label"
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="이력서 제목을 입력해 주세요. *"
                onBlur={() => {
                  if (!form.title.trim()) {
                    setErrors((prev) => ({ ...prev, title: "이력서 제목을 입력해 주세요." }));
                  } else {
                    setErrors((prev) => ({ ...prev, title: undefined }));
                  }
                }}
              />
              {errors.title && (
                <span className="resume-create-page__error">{errors.title}</span>
              )}
            </div>
            <div className="resume-create-page__assist">
              <span className="resume-create-page__assist-text">
                <img className="ai-suggest-icon" src={ic_star_gray700_20} alt="" />
                더 적합한 문장을 추천을 위해 아래 항목들을 먼저 채워주세요.
                <span className="ai-suggest-btn career-section__summary-ai-btn">
                AI 문장 추천
              </span>
              </span>
           
            </div>
          </div>
          <M_BasicInfoSection
            values={form.basic}
            errors={errors.basic}
            onChange={updateBasic}
            onFocusAny={resetBasicErrors}
          />
          <M_LocationSection
            defaultValue={initial.location}
            onChange={updateLocation}
          />
          {errors.location && (
            <div className="resume-create-page__error" style={{ marginTop: 8 }}>
              {errors.location}
            </div>
          )}
          <M_CareerSection
            values={form.basic}
            errors={errors.basic}
            onChange={updateBasic}
            onFocusAny={resetBasicErrors}
          />
          <M_EducationSection
            values={form.education}
            errors={errors.education}
            onChange={updateEducation}
            onFocusAny={resetBasicErrors}
          />
         <M_DesiredRoleSection />
         <M_HardSkillSection />
         <M_SoftSkillsSection />
         <M_ActivitiesSection />
         <M_AwardsCertificationsSection />
         <M_PortfolioDocumentsSection />
         <M_SelfIntroductionSection />
         <M_MockInterviewAnalysisSection /> 
        </div>
        </div>
      </div>
      <div className="resume-controls-wrapper">
      <div className="resume-create-page__status">
        <span className="default_btn_white btn_w_full" onClick={handleTempSave}>
          임시저장
        </span>
        <span
          className={`default_btn_black btn_w_full ${isSubmitDisabled ? "disabled" : ""}`}
          onClick={handleSubmit}
          aria-disabled={isSubmitDisabled}
        >
          작성 완료
        </span>
      </div>
      </div>
      <Modal
        open={showDefaultModal}
        title={`해당 이력서를 기본 이력서로\n변경하시겠습니까?`}
        confirmText="확인"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="취소"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleConfirmDefaultResume}
        onClose={handleCancelDefaultResume}
      />
    </div>
    
  );
}