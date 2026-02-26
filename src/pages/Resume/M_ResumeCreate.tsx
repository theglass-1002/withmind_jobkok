import React, { useState, useEffect, useRef ,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ResumeCreate.css";
import Switch from "react-switch";
import Tabs from "@/shared/components/tabs/Tabs";
import {useStickyTabs, tabItems ,ALL_SECTIONS ,
  BasicErrors,SectionId} from '@/shared/utils/util';
import { toast } from "react-toastify";
import Modal from "@/shared/components/modal/Modal";
import M_BasicInfoSection,{
  type BasicInfo,
} from "./ResumeCreate/BasicInfoSection/M_BasicInfoSection";
import M_LocationSection,{
  LocationValue
} from "./ResumeCreate/LocationSection/M_LocationSection";
import M_CareerSection,{
  CareerInfo,
  CareerErrors,
} from "./ResumeCreate/CareerSection/M_CareerSection";
import M_EducationSection,{
  type Education,
  type EducationErrors
} from "./ResumeCreate/EducationSection/M_EducationSection";
import M_DesiredRoleSection from "./ResumeCreate/DesiredRoleSection/M_DesiredRoleSection";
import M_HardSkillSection from "./ResumeCreate/HardSkillSection/M_HardSkillSection";
import M_SoftSkillsSection from "./ResumeCreate/SoftSkillsSection/M_SoftSkillsSection";
import M_ActivitiesSection,{
  ActivityItem
} from "./ResumeCreate/ActivitiesSection/M_ActivitiesSection";
import M_AwardsCertificationsSection,
{AwardsCertItem} from "./ResumeCreate/AwardsCertificationsSection/M_AwardsCertificationsSection";
import M_PortfolioDocumentsSection,
{PortfolioDocItem} from "./ResumeCreate/PortfolioDocumentsSection/M_PortfolioDocumentsSection";
import M_SelfIntroductionSection from "./ResumeCreate/SelfIntroductionSection/M_SelfIntroductionSection";
import M_MockInterviewAnalysisSection from "./ResumeCreate/MockInterviewAnalysisSection/M_MockInterviewAnalysisSection";
import ResumeSidebar, {
  type Status,
} from "./ResumeSidebar/ResumeSidebar";

import ic_star_gray700_20 from "@/assets/icons/size20/ic_star_gray700_20.png";
import "react-toastify/dist/ReactToastify.css";
import { fetchMyInfo, logout } from "@/api/auth/auth.api";
import AISuggestArea from "@/pages/Resume/ResumeAISuggest";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { ResumePositionRequest } from "@/api/resume/resume.types";
import { fetchResumePositionSuggestions } from "@/api/resume/resume.api";

type FormState = {
  title: string;
  basic: BasicInfo;
  location: LocationValue;
  careers: CareerInfo[];
  isFreshGraduate: boolean;
  education: Education[];
  photoFile?: File | null;
  desiredRoles: string[];
  hardSkills: string[];
  softSkills: string[];
  activities: ActivityItem[];
  awardCerts: AwardsCertItem[];
  portfolios: PortfolioDocItem[];
  selfIntro: string;
};

export type ActivityErrors = {
  activityType?: string;
  activityName?: string;
  startDate?: string;
  endDate?: string;
};

export type AwardsCertErrors = {
  kind?: string;
  title?: string;
};

export type PortfolioErrors = {
  file?: string;
  url?: string;
};

const initial: FormState = {
  title: "",
  basic: {
    name: "",
    birth: "",
    gender: null,
    email: "",
    phone: "",
    photoUrl: "",
  },
  location: { nationwide: false, selectedCodes: [] },
  careers: [],
  isFreshGraduate: false,
  education: [],
  photoFile: null,
  desiredRoles: [],
  hardSkills: [],
  softSkills: [],
  activities: [],
  awardCerts: [],
  portfolios: [],
  selfIntro: "",
};


export default function M_ResumeCreate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(false);

  const [form, setForm] = useState<FormState>(initial);
  const [showDefaultModal, setShowDefaultModal] = useState(false); // 기본 이력서 설정 모달
  const [errors, setErrors] = useState<{
    basic: BasicErrors;
    title?: string;
    location?: string;
    careers?: CareerErrors[];
    education?: EducationErrors[];
    desiredRoles?: string;
    activities?: ActivityErrors[];
    awardCerts?: AwardsCertErrors[];
    portfolios?: PortfolioErrors[];
  }>({
    basic: {},
    education: [],
    activities: [],
    awardCerts: [],
    portfolios: [],
  });
  const [showTitleSuggest, setShowTitleSuggest] = useState(false);
  
  const [isDefaultResume, setIsDefaultResume] = useState(false);
  const [showRoleSuggest, setShowRoleSuggest] = useState(false);
  const [roleSuggestions, setRoleSuggestions] = useState<string[]>([]);
  const [sidebarStatus, setSidebarStatus] = useState<Partial<Record<SectionId, Status>>>({});
  const [activeTab, setActiveTab] = useState("title");

  const isTabsSticky = useStickyTabs(
    "resume__create-section--title",
    ".default_tabs",
    ".page-header"
  );

  useEffect(() => {
    const initMyInfo = async () => {
      try {
        const res = await fetchMyInfo();
        console.log("[M_ResumeCreate] fetchMyInfo:", res);
  
        const u = res.user;
  
        const birth =
          typeof u.birthdate === "string" && u.birthdate.length === 8
            ? `${u.birthdate.slice(0, 4)}.${u.birthdate.slice(4, 6)}.${u.birthdate.slice(6, 8)}`
            : "";
  
        const gender =
          u.gender === "M" ? "male" : u.gender === "W" ? "female" : null;
  
        setForm((prev) => ({
          ...prev,
          basic: {
            ...prev.basic,
            name: u.userName ?? "",
            email: u.userId ?? "",
            phone: u.phone ?? "",
            birth,
            gender,
          },
        }));
      } catch (e: any) {
        console.error("[M_ResumeCreate] fetchMyInfo error:", e);
        if (e?.code === 999) {
          logout();
          navigate("/login");
        }
      }
    };
  
    initMyInfo();
  }, [navigate]);
  

  const handleClickTitleSuggest = ()=>{
    console.log('ai 제목 추천');
    setShowTitleSuggest(true);
  }

  const handleCloseAISuggest = () => setShowTitleSuggest(false);

  const handleClickRoleSuggest = async () => {
    console.log('ai 희망직무 추천 클릭',form);
 
    try {
      if (isRoleLoading) return;

      if (!form.careers || form.careers.length === 0) {
        toast.info("경력 항목을 1개 이상 입력해 주세요.");
        return;
      }

      if (!form.education || form.education.length === 0) {
        toast.info("학력 항목을 1개 이상 입력해 주세요.");
        return;
      }

      setIsRoleLoading(true);

      const experiences = form.careers
        .map((c) => {
          const period = c.isCurrent
            ? `${c.startDate} ~ 현재`
            : `${c.startDate} ~ ${c.endDate || ""}`;
          return `${c.company_name} / ${c.role} (${c.position}) / ${period}`;
        })
        .join("\n");

      const educations = form.education
        .map((e) => {
          const period = `${e.startDate} ~ ${e.endDate}`;
          return `${e.school_name} / ${e.major_degree ?? ""} / ${period}`;
        })
        .join("\n");


      const payload: ResumePositionRequest = {
        experiences,
        educations,
      };
      console.log("AI 직무 추천 payload:", payload);
      const positions = await fetchResumePositionSuggestions(payload);
      if (!positions || positions.length === 0) {
        toast.info("추천할 직무가 없습니다. 내용을 조금 더 채워보세요.");
        return;
      }

      console.log("AI 직무 추천 결과:", positions);
      setRoleSuggestions(positions);
      setShowRoleSuggest(true);
    } catch (error) {
      console.error("AI 직무 추천 실패:", error);
      toast.error("AI 직무 추천 중 오류가 발생했습니다.");
    } finally {
      setIsRoleLoading(false);
    }
  };

  const handleCloseRoleSuggest = () => setShowRoleSuggest(false);


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


  const updateCareer = (newList: CareerInfo[]) =>
    setForm((prev) => ({ ...prev, careers: newList }));


  const updateLocation = (patch: Partial<LocationValue>) =>
    setForm((prev) => ({ ...prev, location: { ...prev.location, ...patch } }));

  const updateEducation = (newList: Education[]) =>
    setForm((prev) => ({ ...prev, education: newList }));
  
  const updateDesiredRoles = (roles: string[]) => {
    setForm((prev) => ({ ...prev, desiredRoles: roles }));
    if (roles.length > 0) {
      setErrors((prev) => ({ ...prev, desiredRoles: undefined }));
    }
  };

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
    console.log('작성 완료');
    console.log(form);
    // if (!validate()) {
    //   toast.error("필수 항목을 확인해주세요.");
    //   return;
    // }
    // const next: Partial<Record<SectionId, Status>> = {};
    // ALL_SECTIONS.forEach((id) => {
    //   next[id] = "completed";
    // });
    // setSidebarStatus(next);
  };

  const isSubmitDisabled =
    !form.title.trim() ||
    (!form.location.nationwide && form.location.selectedCodes.length === 0);


  return (
    <div className="resume-create-page mobile">
       <LoadingOverlay
        isLoading={
          isLoading ||
          isRoleLoading 
        }
      />
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
            <AISuggestArea
              show={showTitleSuggest}
              items={["titleSuggestions"]}
              hintText="더 정확한 문장 추천을 위해 (경력과 활동·경험) 항목을 먼저 입력해주세요."
              onClickSuggest={handleClickTitleSuggest}
              onClose={handleCloseAISuggest}
              wrapperClassName="resume-suggest__title"
            />
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
            values={form.careers}
            errors={errors.careers ?? []}
            onChange={updateCareer}
            onFocusAny={resetBasicErrors}
          />
          <M_EducationSection
            values={form.education}
            errors={errors.education??[]}
            onChange={updateEducation}
            onFocusAny={resetBasicErrors}
          />
         <M_DesiredRoleSection 
              value={form.desiredRoles}
              onChange={updateDesiredRoles}
              error={errors.desiredRoles}
              aiShow={showRoleSuggest}
              aiTags={roleSuggestions}
              onClickAISuggest={handleClickRoleSuggest}
              onCloseAISuggest={handleCloseRoleSuggest}
         />
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