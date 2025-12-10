// src/pages/Resume/ResumeCreate.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ResumeCreate.css";
import AISuggestArea from "@/pages/Resume/ResumeAISuggest";
import BasicInfoSection, {
  type BasicInfo,
  type BasicErrors,
} from "./ResumeCreate/BasicInfoSection/BasicInfoSection";
import LocationSection, {
  type LocationValue,
} from "./ResumeCreate/LocationSection/LocationSection";
import CareerSection, {
  CareerInfo,
  CareerErrors,
} from "./ResumeCreate/CareerSection/CareerSection";
import EducationSection, {
  type Education,
  type EducationErrors,
} from "./ResumeCreate/EducationSection/EducationSection";
import DesiredRoleSection from "./ResumeCreate/DesiredRoleSection/DesiredRoleSection";
import HardSkillSection from "./ResumeCreate/HardSkillSection/HardSkillSection";
import SoftSkillsSection from "./ResumeCreate/SoftSkillsSection/SoftSkillsSection";
import ActivitiesSection, {
  type Activity as ActivityItem,
} from "./ResumeCreate/ActivitiesSection/ActivitiesSection";
import AwardsCertificationsSection, {
  type AwardsCertItem,
} from "./ResumeCreate/AwardsCertificationsSection/AwardsCertificationsSection";
import PortfolioDocumentsSection, {
  type PortfolioDocItem,
} from "./ResumeCreate/PortfolioDocumentsSection/PortfolioDocumentsSection";
import SelfIntroductionSection from "./ResumeCreate/SelfIntroductionSection/SelfIntroductionSection";
import MockInterviewAnalysisSection from "./ResumeCreate/MockInterviewAnalysisSection/MockInterviewAnalysisSection";
import ResumeSidebar, {
  type SectionId,
  type Status,
} from "./ResumeSidebar/ResumeSidebar";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createResume,
  fetchResumeTitleSuggestions,
  fetchResumePositionSuggestions,
  fetchResumeHardSkillSuggestions,
  fetchResumeSoftSkillSuggestions,
  fetchResumeSelfIntro, // ✅ 자기소개 AI
} from "@/api/resume/resume.api";
import {
  CreateResumeRequest,
  isValidEmail,
  mapAwardsKindToCategoryLabel,
  mapEducationStatusToGraduatedYn,
  normalizeYm,
  ProfilePhotoFile,
  ResumeTitleRequest,
  ResumePositionRequest,
  ResumeHardSkillRequest,
  ResumeSoftSkillRequest,
  ResumeSelfIntroRequest, // ✅ 자기소개 Request 타입
} from "@/api/resume/resume.types";
import { Storage } from "@/shared/utils/StorageManager";
import { uploadPhotoFile } from "@/api/fileUpload.api";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 타입 정의
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

// 활동 에러 타입
export type ActivityErrors = {
  activityType?: string;
  activityName?: string;
  startDate?: string;
  endDate?: string;
};

// 수상·자격증 에러 타입
export type AwardsCertErrors = {
  kind?: string;
  title?: string;
};

// 포트폴리오 에러 타입
export type PortfolioErrors = {
  file?: string;
  url?: string;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 초기값
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 섹션 완료 상태 계산 (Sidebar용)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const calcSectionStatus = (
  form: FormState
): Partial<Record<SectionId, Status>> => {
  const status: Partial<Record<SectionId, Status>> = {};

  // 1) 제목
  status.title = form.title.trim() ? "completed" : "pending";

  // 2) 기본정보
  const { name, birth, gender, email, phone } = form.basic;
  status.basic =
    name.trim() && birth.trim() && gender && email.trim() && phone.trim()
      ? "completed"
      : "pending";

  // 3) 지역
  status.location =
    form.location.nationwide || form.location.selectedCodes.length > 0
      ? "completed"
      : "pending";

  // 4) 경력 (신입이면 자동 completed)
  if (form.isFreshGraduate) {
    status.career = "completed";
  } else {
    const valid =
      form.careers.length > 0 &&
      form.careers.every(
        (c) =>
          c.company_name.trim() &&
          c.employmentType &&
          c.startDate.trim() &&
          (c.isCurrent || c.endDate.trim()) &&
          c.role.trim() &&
          c.position.trim()
      );
    status.career = valid ? "completed" : "pending";
  }

  // 5) 학력
  const validEdu =
    form.education.length > 0 &&
    form.education.every(
      (e) =>
        e.school_name?.trim() &&
        e.startDate?.trim() &&
        e.endDate?.trim() &&
        e.status?.trim()
    );
  status.education = validEdu ? "completed" : "pending";

  // 6) 희망직무
  status.desiredRole = form.desiredRoles.length > 0 ? "completed" : "pending";

  // 7) 하드 스킬
  status.hardSkills = form.hardSkills.length > 0 ? "completed" : "pending";

  // 8) 소프트 스킬
  status.softSkills = form.softSkills.length > 0 ? "completed" : "pending";

  // 9) 활동ㆍ경험
  if (form.activities.length === 0) {
    status.activities = "pending";
  } else {
    const valid =
      form.activities.length > 0 &&
      form.activities.every(
        (a) =>
          a.activityType &&
          a.activityName?.trim() &&
          a.startDate?.trim() &&
          a.endDate?.trim()
      );
    status.activities = valid ? "completed" : "pending";
  }

  // 10) 수상ㆍ자격증
  if (form.awardCerts.length === 0) {
    status.awards = "pending";
  } else {
    const valid = form.awardCerts.every(
      (a) => a.kind && a.title?.trim()
    );
    status.awards = valid ? "completed" : "pending";
  }

  // 11) 포트폴리오
  if (form.portfolios.length === 0) {
    status.portfolio = "pending";
  } else {
    const valid = form.portfolios.every((p) =>
      p.source === "file" ? !!p.file : !!p.url?.trim()
    );
    status.portfolio = valid ? "completed" : "pending";
  }

  // 12) 자기소개
  status.selfIntro = form.selfIntro.trim() ? "completed" : "pending";

  // 13) 모의면접 (백엔드 결과 연동 전까지는 pending)
  status.mockInterview = "pending";

  return status;
};

export default function ResumeCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initial);
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
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);

  // 🔥 희망 직무 AI 추천 상태
  const [showRoleSuggest, setShowRoleSuggest] = useState(false);
  const [roleSuggestions, setRoleSuggestions] = useState<string[]>([]);
  const [isRoleLoading, setIsRoleLoading] = useState(false);

  // 🔥 하드 스킬 AI 추천 상태
  const [showHardSkillSuggest, setShowHardSkillSuggest] = useState(false);
  const [hardSkillSuggestions, setHardSkillSuggestions] = useState<string[]>([]);
  const [isHardSkillLoading, setIsHardSkillLoading] = useState(false);

  // 🔥 소프트 스킬 AI 추천 상태
  const [showSoftSkillSuggest, setShowSoftSkillSuggest] = useState(false);
  const [softSkillSuggestions, setSoftSkillSuggestions] = useState<string[]>([]);
  const [isSoftSkillLoading, setIsSoftSkillLoading] = useState(false);

  // 🔥 자기소개 AI 추천 상태
  const [showSelfIntroSuggest, setShowSelfIntroSuggest] = useState(false);
  const [selfIntroSuggestions, setSelfIntroSuggestions] = useState<string[]>([]);
  const [isSelfIntroLoading, setIsSelfIntroLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isDefaultResume, setIsDefaultResume] = useState(false);
  const [sidebarStatus, setSidebarStatus] =
    useState<Partial<Record<SectionId, Status>>>({});

  // form 이 바뀔 때마다 사이드바 상태 업데이트
  useEffect(() => {
    setSidebarStatus(calcSectionStatus(form));
  }, [form]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AI 제목 추천
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleClickTitleSuggest = async () => {
    try {
      if (isLoading) return;
      if (!form.careers[0] || form.careers.length === 0) {
        toast.info("경력 항목을 1개 이상 입력해 주세요.");
        return;
      }
      if (form.careers[0].role === "" || form.careers[0].position === "") {
        toast.info("경력 항목을 1개 이상 입력해 주세요.");
        return;
      }
      if (form.activities.length === 0) {
        toast.info("활동·경험 항목을 1개 이상 입력해 주세요.");
        return;
      }

      setIsLoading(true);

      const position = form.desiredRoles.slice(0, 2).join(", ");
      const experiences = form.careers
        .map((c) => {
          const period = c.isCurrent
            ? `${c.startDate} ~ 현재`
            : `${c.startDate} ~ ${c.endDate || ""}`;
          return `${c.company_name} / ${c.role} (${c.position}) / ${period}`;
        })
        .join("\n");

      const activities = form.activities
        .map((a) => {
          const period = `${a.startDate} ~ ${a.endDate}`;
          return `${a.activityType ?? ""} / ${a.activityName} / ${period}`;
        })
        .join("\n");

      const awards = form.awardCerts
        .map((aw) => `${aw.kind ?? ""} / ${aw.title}`)
        .join("\n");

      const payload: ResumeTitleRequest = {
        position,
        experiences,
        activities,
        awards,
      };

      const titles = await fetchResumeTitleSuggestions(payload);
      if (!titles || titles.length === 0) {
        toast.info("추천할 제목이 없습니다. 내용을 조금 더 채워보세요.");
        return;
      }

      setTitleSuggestions(titles);
      setShowTitleSuggest(true);
    } catch (error) {
      console.error("AI 제목 추천 실패:", error);
      toast.error("AI 제목 추천 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAISuggest = () => setShowTitleSuggest(false);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AI 희망 직무 추천
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleClickRoleSuggest = async () => {
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

      const activities = form.activities
        .map((a) => {
          const period = `${a.startDate} ~ ${a.endDate}`;
          return `${a.activityType ?? ""} / ${a.activityName} / ${period}`;
        })
        .join("\n");

      const awards = form.awardCerts
        .map((aw) => `${aw.kind ?? ""} / ${aw.title}`)
        .join("\n");

      const payload: ResumePositionRequest = {
        experiences,
        educations,
        activities,
        awards,
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

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AI 하드 스킬 추천
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleClickHardSkillSuggest = async () => {
    try {
      if (isHardSkillLoading) return;

      if (!form.desiredRoles || form.desiredRoles.length === 0) {
        toast.info("희망 직무를 1개 이상 입력해 주세요.");
        return;
      }
      if (!form.careers[0] || form.careers.length === 0) {
        toast.info("경력 항목을 1개 이상 입력해 주세요.");
        return;
      }
      if (form.careers[0].role === "" || form.careers[0].position === "") {
        toast.info("경력 항목을 1개 이상 입력해 주세요.");
        return;
      }

      setIsHardSkillLoading(true);

      const position = form.desiredRoles[0] ?? "";

      const experiences = form.careers
        .map((c) => {
          const base = `${c.company_name} / ${c.role} (${c.position})`;
          const extra = c.summary ? ` / ${c.summary}` : "";
          return base + extra;
        })
        .join("\n");

      const activities = form.activities
        .map((a) => {
          const base = `${a.activityType ?? ""} / ${a.activityName ?? ""}`;
          const extra = a.summary ? ` / ${a.summary}` : "";
          return base + extra;
        })
        .join("\n");

      const awards = form.awardCerts
        .map((aw) => `${aw.kind ?? ""} / ${aw.title ?? ""}`)
        .join("\n");

      const payload: ResumeHardSkillRequest = {
        position,
        experiences,
        activities,
        awards,
      };

      console.log("AI 하드 스킬 추천 payload:", payload);

      const skills = await fetchResumeHardSkillSuggestions(payload);
      console.log("AI 하드 스킬 추천 결과:", skills);

      if (!skills || skills.length === 0) {
        toast.info(
          "추천할 하드 스킬이 없습니다. [경력] 담당 업무 내용을 조금 더 구체적으로 작성해 보세요."
        );
        return;
      }

      setHardSkillSuggestions(skills);
      setShowHardSkillSuggest(true);
    } catch (error: any) {
      console.error("AI 하드 스킬 추천 실패:", error);
      toast.info(
        "추천할 하드 스킬이 없습니다. [경력] 담당 업무 내용을 조금 더 구체적으로 작성해 보세요."
      );
    } finally {
      setIsHardSkillLoading(false);
    }
  };

  const handleCloseHardSkillSuggest = () => setShowHardSkillSuggest(false);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AI 소프트 스킬 추천
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleClickSoftSkillSuggest = async () => {
    try {
      if (isSoftSkillLoading) return;

      if (!form.desiredRoles || form.desiredRoles.length === 0) {
        toast.info("희망 직무를 1개 이상 입력해 주세요.");
        return;
      }
      if (!form.careers[0] || form.careers.length === 0) {
        toast.info("경력 항목을 1개 이상 입력해 주세요.");
        return;
      }

      setIsSoftSkillLoading(true);

      const position = form.desiredRoles[0] ?? "";

      const experiences = form.careers
        .map((c) => {
          const extra = c.summary ? ` / ${c.summary}` : "";
          return extra;
        })
        .join("\n");

      const activities = form.activities
        .map((a) => {
          const extra = a.summary ? ` / ${a.summary}` : "";
          return extra;
        })
        .join("\n");

      const awards = form.awardCerts
        .map((aw) => `${aw.kind ?? ""} / ${aw.title ?? ""}`)
        .join("\n");

      const payload: ResumeSoftSkillRequest = {
        position,
        experiences,
        activities,
        awards,
      };

      console.log("AI 소프트 스킬 추천 payload:", payload);

      const skills = await fetchResumeSoftSkillSuggestions(payload);
      console.log("AI 소프트 스킬 추천 결과:", skills);

      if (!skills || skills.length === 0) {
        toast.info(
          "추천할 소프트 스킬이 없습니다. [경력] 담당 업무 내용을 조금 더 구체적으로 작성해 보세요."
        );
        return;
      }

      setSoftSkillSuggestions(skills);
      setShowSoftSkillSuggest(true);
    } catch (error: any) {
      console.error("AI 소프트 스킬 추천 실패:", error);
      toast.info(
        "추천할 소프트 스킬이 없습니다. [경력] 담당 업무 내용을 조금 더 구체적으로 작성해 보세요."
      );
    } finally {
      setIsSoftSkillLoading(false);
    }
  };

  const handleCloseSoftSkillSuggest = () => setShowSoftSkillSuggest(false);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AI 자기소개 추천
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleClickSelfIntroSuggest = async () => {
    try {
      if (isSelfIntroLoading) return;

      if (!form.desiredRoles || form.desiredRoles.length === 0) {
        toast.info("희망 직무를 1개 이상 입력해 주세요.");
        return;
      }
      if (!form.careers || form.careers.length === 0) {
        toast.info("경력 항목을 1개 이상 입력해 주세요.");
        return;
      }

      setIsSelfIntroLoading(true);

      const position = form.desiredRoles[0] ?? "";

      const experiences = form.careers
        .map((c) => {
          const period = c.isCurrent
            ? `${c.startDate} ~ 현재`
            : `${c.startDate} ~ ${c.endDate || ""}`;
          const summary = c.summary ? ` / ${c.summary}` : "";
          return `${summary}`;
        })
        .join("\n");

      const activities = form.activities
        .map((a) => {
          const period = `${a.startDate} ~ ${a.endDate}`;
          const summary = a.summary ? ` / ${a.summary}` : "";
          return `${a.activityType ?? ""} / ${a.activityName ?? ""} / ${period}${summary}`;
        })
        .join("\n");

      const awards = form.awardCerts
        .map((aw) => `${aw.kind ?? ""} / ${aw.title ?? ""}`)
        .join("\n");

      const payload: ResumeSelfIntroRequest = {
        position,
        experiences,
        activities,
        awards,
      };

      console.log("AI 자기소개 추천 payload:", payload);

      const selfintro = await fetchResumeSelfIntro(payload);
      console.log("AI 자기소개 추천 결과:", selfintro);

      if (!selfintro) {
        toast.info(
           "추천할 자기소개 문장이 없습니다. [경력] 담당 업무 내용을 조금 더 구체적으로 작성해 보세요."

        );
        return;
      }

      setSelfIntroSuggestions([selfintro]);
      setShowSelfIntroSuggest(true);
    } catch (error) {
      
      console.error("AI 자기소개 추천 실패:", error);
      toast.info(
        "추천할 자기소개 문장이 없습니다. [경력] 담당 업무 내용을 조금 더 구체적으로 작성해 보세요."

     );
      //toast.error("AI 자기소개 추천 중 오류가 발생했습니다.");
    } finally {
      setIsSelfIntroLoading(false);
    }
  };

  const handleCloseSelfIntroSuggest = () => setShowSelfIntroSuggest(false);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 경력 검증 헬퍼
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const buildCareerErrors = (careers: CareerInfo[]): CareerErrors[] => {
    return careers.map((c) => {
      const ce: CareerErrors = {};
      if (!c.company_name.trim()) ce.company_name = "required";
      if (!c.employmentType) ce.employmentType = "required";
      if (!c.startDate.trim()) ce.startDate = "required";
      if (!c.isCurrent && !c.endDate.trim()) ce.endDate = "required";
      if (!c.role.trim()) ce.role = "required";
      if (!c.position.trim()) ce.position = "required";
      return ce;
    });
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 학력 검증 헬퍼
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const buildEducationErrors = (educations: Education[]): EducationErrors[] => {
    return educations.map((e) => {
      const ee: EducationErrors = {};

      if (!e.school_name?.trim()) ee.school_name = "required";
      if (!e.startDate?.trim()) ee.startDate = "required";
      if (!e.endDate?.trim()) ee.endDate = "required";
      if (!e.status?.trim()) ee.status = "required";

      return ee;
    });
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 활동 검증 헬퍼
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const buildActivityErrors = (activities: ActivityItem[]): ActivityErrors[] =>
    activities.map((act) => {
      const ae: ActivityErrors = {};
      if (!act.activityType) ae.activityType = "required";
      if (!act.activityName?.trim()) ae.activityName = "required";
      if (!act.startDate?.trim()) ae.startDate = "required";
      if (!act.endDate?.trim()) ae.endDate = "required";
      return ae;
    });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 수상·자격증 검증 헬퍼
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const buildAwardCertErrors = (
    awardCerts: AwardsCertItem[]
  ): AwardsCertErrors[] =>
    awardCerts.map((item) => {
      const ace: AwardsCertErrors = {};
      if (!item.kind) ace.kind = "required";
      if (!item.title?.trim()) ace.title = "required";
      return ace;
    });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 포트폴리오 검증 헬퍼
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const buildPortfolioErrors = (
    portfolios: PortfolioDocItem[]
  ): PortfolioErrors[] =>
    portfolios.map((item) => {
      const pe: PortfolioErrors = {};
      if (item.source === "file") {
        if (!item.file) pe.file = "required";
      } else {
        if (!item.url?.trim()) pe.url = "required";
      }
      return pe;
    });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Update 함수들
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const updateBasic = (patch: Partial<BasicInfo>) =>
    setForm((prev) => ({ ...prev, basic: { ...prev.basic, ...patch } }));

  const updateLocation = (patch: Partial<LocationValue>) =>
    setForm((prev) => {
      const nextLocation: LocationValue = { ...prev.location, ...patch };

      if (nextLocation.nationwide || nextLocation.selectedCodes.length > 0) {
        setErrors((prevErr) => ({ ...prevErr, location: undefined }));
      }

      return { ...prev, location: nextLocation };
    });

  const updateCareers = (newList: CareerInfo[], isFresh: boolean) => {
    setForm((prev) => ({
      ...prev,
      careers: newList,
      isFreshGraduate: isFresh,
    }));

    setErrors((prev) => {
      if (!prev.careers) return prev;
      const nextCareerErrors = buildCareerErrors(newList);
      return { ...prev, careers: nextCareerErrors };
    });
  };

  const updateEducation = (newList: Education[]) => {
    setForm((prev) => ({ ...prev, education: newList }));

    setErrors((prev) => {
      if (!prev.education || prev.education.length === 0) return prev;
      const nextEduErrors = buildEducationErrors(newList);
      return { ...prev, education: nextEduErrors };
    });
  };

  const updatePhotoFile = (file: File | null) =>
    setForm((prev) => ({ ...prev, photoFile: file }));

  const updateDesiredRoles = (roles: string[]) => {
    setForm((prev) => ({ ...prev, desiredRoles: roles }));
    if (roles.length > 0) {
      setErrors((prev) => ({ ...prev, desiredRoles: undefined }));
    }
  };

  const updateHardSkills = (skills: string[]) =>
    setForm((prev) => ({ ...prev, hardSkills: skills }));

  const updateSoftSkills = (skills: string[]) =>
    setForm((prev) => ({ ...prev, softSkills: skills }));

  const updateActivities = (activities: ActivityItem[]) => {
    setForm((prev) => ({ ...prev, activities }));

    setErrors((prev) => {
      if (!prev.activities || prev.activities.length === 0) return prev;
      const nextActivityErrors = buildActivityErrors(activities);
      return { ...prev, activities: nextActivityErrors };
    });
  };

  const updateAwardCerts = (list: AwardsCertItem[]) => {
    setForm((prev) => ({ ...prev, awardCerts: list }));

    setErrors((prev) => {
      if (!prev.awardCerts || prev.awardCerts.length === 0) return prev;
      const nextAwardCertErrors = buildAwardCertErrors(list);
      return { ...prev, awardCerts: nextAwardCertErrors };
    });
  };

  const updatePortfolios = (list: PortfolioDocItem[]) => {
    setForm((prev) => ({ ...prev, portfolios: list }));

    setErrors((prev) => {
      if (!prev.portfolios || prev.portfolios.length === 0) return prev;
      const nextPortfolioErrors = buildPortfolioErrors(list);
      return { ...prev, portfolios: nextPortfolioErrors };
    });
  };

  const updateSelfIntro = (content: string) =>
    setForm((prev) => ({ ...prev, selfIntro: content }));

  const resetBasicErrors = () =>
    setErrors((prev) => ({ ...prev, basic: {} }));

  const resetEducationErrors = () =>
    setErrors((prev) => ({ ...prev, education: [] }));

  const resetActivityErrors = () =>
    setErrors((prev) => ({ ...prev, activities: [] }));

  const resetAwardCertErrors = () =>
    setErrors((prev) => ({ ...prev, awardCerts: [] }));

  const resetPortfolioErrors = () =>
    setErrors((prev) => ({ ...prev, portfolios: [] }));

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 파일 업로드 함수
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleFileSubmit = async (): Promise<ProfilePhotoFile | null> => {
    try {
      if (!form.photoFile) return null;

      const { s3_key, finalUrl, uniqueFileName, originalFileName } =
        await uploadPhotoFile(form.photoFile, "resume/profile");

      const profilePhotoFile: ProfilePhotoFile = {
        filePath: s3_key,
        originalName: originalFileName,
        storedName: uniqueFileName,
        sizeBytes: form.photoFile.size,
        contentType: form.photoFile.type,
      };

      return profilePhotoFile;
    } catch (error) {
      console.error("❌ 업로드 실패:", error);
      throw error;
    }
  };

  const handlePortfolioFilesSubmit = async (): Promise<
    Array<{
      originalItem: PortfolioDocItem;
      uploadedFile?: {
        filePath: string;
        originalName: string;
        storedName: string;
        sizeBytes: number;
        contentType: string;
      };
    }>
  > => {
    try {
      const fileItems = form.portfolios.filter(
        (p) => p.source === "file" && p.file
      );
      if (fileItems.length === 0) return [];

      const uploadPromises = fileItems.map(async (item) => {
        if (!item.file) return { originalItem: item };

        const { s3_key, finalUrl, uniqueFileName, originalFileName } =
          await uploadPhotoFile(item.file, "resume/portfolio");

        return {
          originalItem: item,
          uploadedFile: {
            filePath: s3_key,
            originalName: originalFileName,
            storedName: uniqueFileName,
            sizeBytes: item.file.size,
            contentType: item.file.type,
          },
        };
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("❌ 포트폴리오 파일 업로드 실패:", error);
      toast.error("포트폴리오 파일 업로드 중 오류가 발생했습니다.");
      throw error;
    }
  };

  const validate = () => {
    const nextErr: typeof errors = {
      basic: {} as BasicErrors,
      education: [],
      activities: [],
      awardCerts: [],
      portfolios: [],
    };

    // 1) 이력서 제목
    if (!form.title.trim()) {
      nextErr.title = "여기 이력서 제목을 입력해 주세요.";
    }

    // 2) 희망 근무 지역
    if (!form.location.nationwide && form.location.selectedCodes.length === 0) {
      nextErr.location = "1개 이상 추가해 주세요.";
    }

    // 3) 기본정보
    const basicErr: BasicErrors = {};
    if (!form.basic.name.trim()) basicErr.name = "이름을 입력해 주세요.";
    if (!form.basic.birth.trim()) basicErr.birth = "생년월일을 입력해 주세요.";
    if (!form.basic.gender) basicErr.gender = "성별을 선택해 주세요.";
    if (!form.basic.email.trim()) {
      basicErr.email = "이메일을 입력해 주세요.";
    } else if (!isValidEmail(form.basic.email.trim())) {
      basicErr.email = "이메일 형식이 올바르지 않습니다.";
      toast.error("이메일 형식이 올바르지 않습니다.");
    }

    if (!form.basic.phone.trim()) basicErr.phone = "연락처를 입력해 주세요.";
    nextErr.basic = basicErr;

    // 4) 경력 (신입이 아닐 때만)
    if (!form.isFreshGraduate) {
      nextErr.careers = buildCareerErrors(form.careers);
    }

    // 5) 학력 (항상 최소 한 줄 기준으로 검증)
    const educationsToValidate =
      form.education.length > 0
        ? form.education
        : [
            {
              school_name: "",
              major_degree: "",
              startDate: "",
              endDate: "",
              status: "",
            },
          ];
    const eduErrs = buildEducationErrors(educationsToValidate);
    nextErr.education = eduErrs;

    // 6) 희망직무
    if (form.desiredRoles.length === 0) {
      nextErr.desiredRoles = "1개 이상 추가해 주세요.";
    }

    // 7) 활동
    if (form.activities.length > 0) {
      nextErr.activities = buildActivityErrors(form.activities);
    }

    // 8) 수상·자격증
    if (form.awardCerts.length > 0) {
      nextErr.awardCerts = buildAwardCertErrors(form.awardCerts);
    }

    // 9) 포트폴리오
    if (form.portfolios.length > 0) {
      nextErr.portfolios = buildPortfolioErrors(form.portfolios);
    }

    setErrors(nextErr);

    const hasBasicError = Object.keys(basicErr).length > 0;
    const hasTitleError = !!nextErr.title;
    const hasLocationError = !!nextErr.location;
    const hasCareerError =
      !form.isFreshGraduate &&
      nextErr.careers &&
      nextErr.careers.some((ce) => Object.keys(ce).length > 0);
    const hasEduError =
      eduErrs && eduErrs.some((ee) => Object.keys(ee).length > 0);
    const hasDesiredRolesError = !!nextErr.desiredRoles;
    const hasActivityError =
      form.activities.length > 0 &&
      nextErr.activities &&
      nextErr.activities.some((ae) => Object.keys(ae).length > 0);
    const hasAwardCertError =
      form.awardCerts.length > 0 &&
      nextErr.awardCerts &&
      nextErr.awardCerts.some((ace) => Object.keys(ace).length > 0);
    const hasPortfolioError =
      form.portfolios.length > 0 &&
      nextErr.portfolios &&
      nextErr.portfolios.some((pe) => Object.keys(pe).length > 0);

    return (
      !hasTitleError &&
      !hasLocationError &&
      !hasBasicError &&
      !hasCareerError &&
      !hasEduError &&
      !hasDesiredRolesError &&
      !hasActivityError &&
      !hasAwardCertError &&
      !hasPortfolioError
    );
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const profilePhotoFile = await handleFileSubmit();
      const portfolioFilesResults = await handlePortfolioFilesSubmit();

      const payload: CreateResumeRequest = {
        userIdx: Storage.getUserIdx(),
        isDefault: isDefaultResume ? 1 : 0,
        temp: "N",
        title: form.title,
        name: form.basic.name,
        email: form.basic.email,
        gender: form.basic.gender === "male" ? "M" : "W",
        phone: form.basic.phone,
        birth: form.basic.birth,

        ...(profilePhotoFile ? { profilePhotoFile } : {}),

        regions: form.location.nationwide ? [] : form.location.selectedCodes,

        ...(form.isFreshGraduate
          ? {}
          : {
              careers: form.careers.map((career) => ({
                employmentType: career.employmentType || "정규직",
                companyName: career.company_name,
                startYm: normalizeYm(career.startDate)!,
                endYm: career.isCurrent ? null : normalizeYm(career.endDate),
                roleName: career.role,
                positionName: career.position,
                workAndResult: career.summary,
                employedYn: career.isCurrent ? "Y" : "N",
              })),
            }),

        educations: form.education.map((edu) => ({
          schoolName: edu.school_name,
          startYm: normalizeYm(edu.startDate)!,
          endYm: edu.endDate,
          majorDegree: edu.major_degree,
          graduatedYn: mapEducationStatusToGraduatedYn(edu.status),
        })),

        jobs: form.desiredRoles,
        hardSkills: form.hardSkills,
        softSkills: form.softSkills,

        ...(form.activities.length > 0
          ? {
              activities: form.activities.map((act) => ({
                category: act.activityType ?? "교내활동",
                activityTitle: act.activityName,
                startYm: act.startDate
                  ? normalizeYm(act.startDate)
                  : "1999-09-09",
                endYm: act.endDate ? normalizeYm(act.endDate) : "1999-09-09",
                description: act.summary,
                linkUrl: "https://github.com/user",
              })),
            }
          : {}),

        ...(form.awardCerts.length > 0
          ? {
              awardCerts: form.awardCerts.map((item) => ({
                category: mapAwardsKindToCategoryLabel(item.kind),
                name: item.title,
                issuer: item.issuer ?? "",
                acquiredYm: item.dateValue
                  ? normalizeYm(item.dateValue)!.replace("-", "")
                  : "",
                licenseNo: item.score ?? "",
                note: "",
              })),
            }
          : {}),

        ...(form.portfolios.length > 0
          ? {
              portfolios: form.portfolios.map((p, idx) => {
                if (p.source === "file") {
                  const uploadedResult = portfolioFilesResults.find(
                    (r) => r.originalItem.id === p.id
                  );

                  if (uploadedResult?.uploadedFile) {
                    const u = uploadedResult.uploadedFile;
                    return {
                      itemType: "FILE",
                      title:
                        p.title ||
                        u.originalName ||
                        `포트폴리오 문서 ${idx + 1}`,
                      docName: u.originalName,
                      url: null,
                      fileRef: u.filePath,
                      description: p.note ?? "",
                      sortOrder: idx + 1,
                      portfolioFile: {
                        filePath: u.filePath,
                        originalName: u.originalName,
                        storedName: u.storedName,
                        sizeBytes: u.sizeBytes,
                        contentType: u.contentType,
                      },
                    };
                  }
                }
                return {
                  itemType: "URL",
                  title: p.title || `포트폴리오 ${idx + 1}`,
                  docName: p.url || "",
                  url: p.url,
                  fileRef: null,
                  description: p.note ?? "",
                  sortOrder: idx + 1,
                  portfolioFile: null,
                };
              }),
            }
          : {}),

        ...(form.selfIntro.trim().length > 0
          ? {
              selfIntros: [
                {
                  title: "소개",
                  content: form.selfIntro,
                  isAi: false,
                },
              ],
            }
          : {}),
      };

      const ok = validate();
      if (!ok) {
        setIsLoading(false);
        toast.error("필수 항목을 먼저 입력해 주세요.");
        return;
      }

      const result = await createResume(payload);
      console.log("✅ 이력서 등록 성공:", result);
      console.log("✅ 이력서 등록 Payload:", payload);
      toast.success("이력서가 등록되었습니다!");
      setIsLoading(false);
    } catch (error) {
      console.error("❌ 이력서 등록 실패:", error);
      toast.error("이력서 등록 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 임시저장
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleTempSave = async () => {
    try {
      setIsLoading(true);
      const nextErr: typeof errors = {
        basic: {} as BasicErrors,
      };
      if (!form.title.trim()) {
        nextErr.title = "여기 이력서 제목을 입력해 주세요.";
        setErrors(nextErr);
        setIsLoading(false);
        toast.error("필수 항목을 먼저 입력해 주세요.");
        return;
      }
      const profilePhotoFile = await handleFileSubmit();
      const portfolioFilesResults = await handlePortfolioFilesSubmit();

      const payload: CreateResumeRequest = {
        userIdx: Storage.getUserIdx(),
        isDefault: isDefaultResume ? 1 : 0,
        temp: "Y",
        title: form.title,
        name: form.basic.name,
        email: form.basic.email,
        gender: form.basic.gender === "male" ? "M" : "W",
        phone: form.basic.phone,
        birth: form.basic.birth,

        ...(profilePhotoFile ? { profilePhotoFile } : {}),

        regions: form.location.nationwide ? [] : form.location.selectedCodes,

        ...(form.isFreshGraduate
          ? {}
          : {
              careers: form.careers.map((career) => ({
                employmentType: career.employmentType || "정규직",
                companyName: career.company_name,
                startYm: normalizeYm(career.startDate)!,
                endYm: career.isCurrent ? null : normalizeYm(career.endDate),
                roleName: career.role,
                positionName: career.position,
                workAndResult: career.summary,
                employedYn: career.isCurrent ? "Y" : "N",
              })),
            }),

        educations: form.education.map((edu) => ({
          schoolName: edu.school_name,
          startYm: normalizeYm(edu.startDate)!,
          endYm: edu.endDate,
          majorDegree: edu.major_degree,
          graduatedYn: mapEducationStatusToGraduatedYn(edu.status),
        })),

        jobs: form.desiredRoles,
        hardSkills: form.hardSkills,
        softSkills: form.softSkills,

        ...(form.activities.length > 0
          ? {
              activities: form.activities.map((act) => ({
                category: act.activityType ?? "교내활동",
                activityTitle: act.activityName,
                startYm: act.startDate
                  ? normalizeYm(act.startDate)
                  : "1999-09-09",
                endYm: act.endDate ? normalizeYm(act.endDate) : "1999-09-09",
                description: act.summary,
                linkUrl: "https://github.com/user",
              })),
            }
          : {}),

        ...(form.awardCerts.length > 0
          ? {
              awardCerts: form.awardCerts.map((item) => ({
                category: mapAwardsKindToCategoryLabel(item.kind),
                name: item.title,
                issuer: item.issuer ?? "",
                acquiredYm: item.dateValue
                  ? normalizeYm(item.dateValue)!.replace("-", "")
                  : "",
                licenseNo: item.score ?? "",
                note: "",
              })),
            }
          : {}),

        ...(form.portfolios.length > 0
          ? {
              portfolios: form.portfolios.map((p, idx) => {
                if (p.source === "file") {
                  const uploadedResult = portfolioFilesResults.find(
                    (r) => r.originalItem.id === p.id
                  );

                  if (uploadedResult?.uploadedFile) {
                    const u = uploadedResult.uploadedFile;
                    return {
                      itemType: "FILE",
                      title:
                        p.title ||
                        u.originalName ||
                        `포트폴리오 문서 ${idx + 1}`,
                      docName: u.originalName,
                      url: null,
                      fileRef: u.filePath,
                      description: p.note ?? "",
                      sortOrder: idx + 1,
                      portfolioFile: {
                        filePath: u.filePath,
                        originalName: u.originalName,
                        storedName: u.storedName,
                        sizeBytes: u.sizeBytes,
                        contentType: u.contentType,
                      },
                    };
                  }
                }
                return {
                  itemType: "URL",
                  title: p.title || `포트폴리오 ${idx + 1}`,
                  docName: p.url || "",
                  url: p.url,
                  fileRef: null,
                  description: p.note ?? "",
                  sortOrder: idx + 1,
                  portfolioFile: null,
                };
              }),
            }
          : {}),

        ...(form.selfIntro.trim().length > 0
          ? {
              selfIntros: [
                {
                  title: "소개",
                  content: form.selfIntro,
                  isAi: false,
                },
              ],
            }
          : {}),
      };

      console.log("✅ 이력서 임시 저장 payload:", payload);
      setIsLoading(false);
      toast.success("임시 저장되었습니다.");
    } catch (error) {
      setIsLoading(false);
      console.error("❌ 이력서 임시 저장 실패:", error);
      toast.error("이력서 등록 중 오류가 발생했습니다.");
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Render
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const isSubmitDisabled = !form.title.trim();

  return (
    console.log(isDefaultResume),
    <div className="resume-create-page">
      <LoadingOverlay
        isLoading={
          isLoading ||
          isRoleLoading ||
          isHardSkillLoading ||
          isSoftSkillLoading ||
          isSelfIntroLoading
        }
      />
      <div className="resume-controls-wrapper">
        <div className="resume-create-page__status">
          <span className="default_btn_white" onClick={handleTempSave}>
            임시저장
          </span>
          <span
            className={`default_btn_black ${
              isSubmitDisabled ? "disabled" : ""
            }`}
            onClick={handleSubmit}
            aria-disabled={isSubmitDisabled}
          >
            작성 완료
          </span>
        </div>
      </div>

      <div className="resume-create-page__container">
        <div className="resume-create-page__main">
          {/* 제목 */}
          <div className="resume-create-page__section resume-create-page__section--title">
            <div className="resume-create-page__field">
              <input
                className={`resume-create-page__label ${
                  errors.title ? "error" : ""
                }`}
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="이력서 제목을 입력해 주세요. *"
                onBlur={() => {
                  if (!form.title.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      title: "여기 이력서 제목을 입력해 주세요.",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, title: undefined }));
                  }
                }}
              />
              {errors.title && (
                <span className="resume-create-page__error">
                  {errors.title}
                </span>
              )}
            </div>
            <AISuggestArea
              show={showTitleSuggest}
              items={titleSuggestions}
              hintText="더 정확한 문장 추천을 위해 (경력과 활동·경험) 항목을 먼저 입력해주세요."
              onClickSuggest={handleClickTitleSuggest}
              onClose={handleCloseAISuggest}
              wrapperClassName="resume-suggest__title"
            />
          </div>

          <BasicInfoSection
            values={form.basic}
            errors={errors.basic}
            onChange={updateBasic}
            onFocusAny={resetBasicErrors}
            onPhotoFileChange={updatePhotoFile}
          />

          <LocationSection
            defaultValue={initial.location}
            onChange={updateLocation}
            error={errors.location}
          />

          <CareerSection
            value={form.careers}
            isFreshGraduate={form.isFreshGraduate}
            onChange={updateCareers}
            errors={errors.careers}
            onClearErrors={() =>
              setErrors((prev) => ({ ...prev, careers: undefined }))
            }
          />

          <EducationSection
            values={form.education}
            errors={errors.education ?? []}
            onChange={updateEducation}
            onFocusAny={resetEducationErrors}
          />

          <DesiredRoleSection
            value={form.desiredRoles}
            onChange={updateDesiredRoles}
            error={errors.desiredRoles}
            aiShow={showRoleSuggest}
            aiTags={roleSuggestions}
            onClickAISuggest={handleClickRoleSuggest}
            onCloseAISuggest={handleCloseRoleSuggest}
          />

          <HardSkillSection
            value={form.hardSkills}
            onChange={updateHardSkills}
            aiShow={showHardSkillSuggest}
            aiTags={hardSkillSuggestions}
            onClickAISuggest={handleClickHardSkillSuggest}
            onCloseAISuggest={handleCloseHardSkillSuggest}
          />

          <SoftSkillsSection
            value={form.softSkills}
            onChange={updateSoftSkills}
            aiShow={showSoftSkillSuggest}
            aiTags={softSkillSuggestions}
            onClickAISuggest={handleClickSoftSkillSuggest}
            onCloseAISuggest={handleCloseSoftSkillSuggest}
          />

          <ActivitiesSection
            value={form.activities}
            onChange={updateActivities}
            errors={errors.activities ?? []}
            onFocusAny={resetActivityErrors}
          />

          <AwardsCertificationsSection
            value={form.awardCerts}
            onChange={updateAwardCerts}
            errors={errors.awardCerts ?? []}
            onFocusAny={resetAwardCertErrors}
          />

          <PortfolioDocumentsSection
            value={form.portfolios}
            onChange={updatePortfolios}
            errors={errors.portfolios ?? []}
            onFocusAny={resetPortfolioErrors}
          />

          <SelfIntroductionSection
            value={form.selfIntro}
            onChange={updateSelfIntro}
            aiShow={showSelfIntroSuggest}
            aiItems={selfIntroSuggestions}
            onClickAISuggest={handleClickSelfIntroSuggest}
            onCloseAISuggest={handleCloseSelfIntroSuggest}
          />

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
