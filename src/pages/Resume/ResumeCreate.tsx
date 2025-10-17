import React, { useState } from "react";
import "./ResumeCreate.css";

import BasicInfoSection, {
  type BasicInfo,
  type BasicErrors,
} from "./ResumeCreate/BasicInfoSection/BasicInfoSection";
import LocationSection from "./ResumeCreate/LocationSection/LocationSection";
import CareerSection from "./ResumeCreate/CareerSection/CareerSection";
import EducationSection from "./ResumeCreate/EducationSection/EducationSection";
import DesiredRoleSection from "./ResumeCreate/DesiredRoleSection/DesiredRoleSection";
import HardSkillSection from "./ResumeCreate/HardSkillSection/HardSkillSection";
import SoftSkillsSection from "./ResumeCreate/SoftSkillsSection/SoftSkillsSection";
import ActivitiesSection from "./ResumeCreate/ActivitiesSection/ActivitiesSection";
import AwardsCertificationsSection from "./ResumeCreate/AwardsCertificationsSection/AwardsCertificationsSection";
import PortfolioDocumentsSection from "./ResumeCreate/PortfolioDocumentsSection/PortfolioDocumentsSection";
import SelfIntroductionSection from "./ResumeCreate/SelfIntroductionSection/SelfIntroductionSection";
import MockInterviewAnalysisSection from "./ResumeCreate/MockInterviewAnalysisSection/MockInterviewAnalysisSection";
import ResumeSidebar, {
  type SectionId,
  type Status,
} from "./ResumeSidebar/ResumeSidebar";

import ic_star_gray700_20 from "@/assets/icons/size20/ic_star_gray700_20.png";

import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormState = { basic: BasicInfo };

const initial: FormState = {
  basic: { name: "", birth: "", gender: null, email: "", phone: "", photoUrl: "" },
};

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

export default function ResumeCreate() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<{ basic: BasicErrors }>({ basic: {} });
  const [isDefaultResume, setIsDefaultResume] = useState(false);

  const [sidebarStatus, setSidebarStatus] = useState<Partial<Record<SectionId, Status>>>({});

  const updateBasic = (patch: Partial<BasicInfo>) =>
    setForm((prev) => ({ ...prev, basic: { ...prev.basic, ...patch } }));

  const resetBasicErrors = () => setErrors((prev) => ({ ...prev, basic: {} }));

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
    <div className="resume-create-page">
      <div className="resume-create-page__status">
        <span className="default_btn_white" onClick={handleTempSave}>
          임시저장
        </span>
        <span className="default_btn_black" onClick={handleSubmit}>
          작성 완료
        </span>
      </div>

      <div className="resume-create-page__container">
        <div className="resume-create-page__main">
          <div className="resume-create-page__section resume-create-page__section--title">
            <div className="resume-create-page__field">
              <span className="resume-create-page__label">이력서 제목을 입력해 주세요. *</span>
              <span className="resume-create-page__error">이력서 제목을 입력해 주세요.</span>
            </div>
            <div className="resume-create-page__assist">
              <span className="resume-create-page__assist-text">
                <img src={ic_star_gray700_20} alt="" />
                더 적합한 문장을 추천을 위해 아래 항목들을 먼저 채워주세요.
              </span>
              <span className="ai-suggest-btn career-section__summary-ai-btn">AI 문장 추천</span>
            </div>
          </div>

          <BasicInfoSection
            values={form.basic}
            errors={errors.basic}
            onChange={updateBasic}
            onFocusAny={resetBasicErrors}
          />

          <LocationSection />

          <CareerSection
            values={form.basic}
            errors={errors.basic}
            onChange={updateBasic}
            onFocusAny={resetBasicErrors}
          />

          <EducationSection
            values={form.basic}
            errors={errors.basic}
            onChange={updateBasic}
            onFocusAny={resetBasicErrors}
          />

          <DesiredRoleSection />
          <HardSkillSection />
          <SoftSkillsSection />
          <ActivitiesSection />
          <AwardsCertificationsSection />
          <PortfolioDocumentsSection />
          <SelfIntroductionSection />
          <MockInterviewAnalysisSection />
        </div>

        <ResumeSidebar
          statusMap={sidebarStatus}
          isDefault={isDefaultResume}
          onToggleDefault={setIsDefaultResume}
        />
      </div>

       </div>
  );
}
