import React, { useState } from "react";
import "./ResumeCreate.css";

import BasicInfoSection, {
  type BasicInfo,
  type BasicErrors,
} from "./ResumeCreate/BasicInfoSection/BasicInfoSection";
import LocationSection, {
  type LocationValue, // ← 추가: Location 섹션 값 타입
} from "./ResumeCreate/LocationSection/LocationSection";
import CareerSection from "./ResumeCreate/CareerSection/CareerSection";
import EducationSection,{
  type Education,
  type EducationErrors
} from "./ResumeCreate/EducationSection/EducationSection";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 폼 상태에 title/location 추가
type FormState = {
  title: string;
  basic: BasicInfo;
  location: LocationValue;
  education: Education[];
};

const initial: FormState = {
  title: "",
  basic: { name: "", birth: "", gender: null, email: "", phone: "", photoUrl: "" },
  location: { nationwide: false, selectedKeys: [] },
  education:[]
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
  const [errors, setErrors] = useState<{ 
    education? :EducationErrors;
    basic: BasicErrors; title?: string; location?: string }>({
    basic: {},
    education:{},
    
  });
  const [isDefaultResume, setIsDefaultResume] = useState(false);
  const [sidebarStatus, setSidebarStatus] = useState<Partial<Record<SectionId, Status>>>({});

  const updateBasic = (patch: Partial<BasicInfo>) =>
    setForm((prev) => ({ ...prev, basic: { ...prev.basic, ...patch } }));

  const updateEducation = (newList: Education[]) =>
    setForm((prev) => ({ ...prev, education: newList }));
  
  const resetBasicErrors = () => setErrors((prev) => ({ ...prev, basic: {} }));

  const handleTempSave = () => {
    toast.success("임시 저장되었습니다.");
  };

  // 간단한 필수검증
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

    // TODO: 실제 전송
    // fetch("/api/resumes", { method:"POST", body: JSON.stringify(form) })
  };

  const isSubmitDisabled =
    !form.title.trim() ||
    (!form.location.nationwide && form.location.selectedKeys.length === 0);

  return (
    <div className="resume-create-page">
      <div className="resume-create-page__status">
        <span className="default_btn_white" onClick={handleTempSave}>
          임시저장
        </span>
        <span
          className={`default_btn_black ${isSubmitDisabled ? "disabled" : ""}`}
          onClick={handleSubmit}
          aria-disabled={isSubmitDisabled}
        >
          작성 완료
        </span>
      </div>

      <div className="resume-create-page__container">
        <div className="resume-create-page__main">
          {/* 제목 */}
          <div className="resume-create-page__section resume-create-page__section--title">
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
                <img src={ic_star_gray700_20} alt="" />
                더 적합한 문장을 추천을 위해 아래 항목들을 먼저 채워주세요.
              </span>
              <span className="ai-suggest-btn career-section__summary-ai-btn">
                AI 문장 추천
              </span>
            </div>
          </div>

          {/* 기본정보 */}
          <BasicInfoSection
            values={form.basic}
            errors={errors.basic}
            onChange={updateBasic}
            onFocusAny={resetBasicErrors}
          />

          {/* 희망 근무 지역: defaultValue/onChange 바인딩 */}
          <LocationSection
            defaultValue={initial.location}
            onChange={(v) => {
              setForm((prev) => ({ ...prev, location: v }));
              // 에러 클리어
              if (v.nationwide || v.selectedKeys.length > 0) {
                setErrors((prev) => ({ ...prev, location: undefined }));
              }
            }}
          />
          {errors.location && (
            <div className="resume-create-page__error" style={{ marginTop: 8 }}>
              {errors.location}
            </div>
          )}

          {/* 이하 섹션들은 처음 작성 시 초기값 불필요 → 그대로 */}
          <CareerSection
            values={form.basic}
            errors={errors.basic}
            onChange={updateBasic}
            onFocusAny={resetBasicErrors}
          />
          <EducationSection
            values={form.education}
            errors={errors.education}
            onChange={updateEducation}
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
