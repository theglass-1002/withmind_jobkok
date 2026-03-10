
import { useMediaQuery } from "react-responsive";
import ResumeEditDesktop from "./ResumeEditDesktop";
import ResumeEditMobile from "./ResumeEditMobile";

export default function ResumeEdit() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return isMobile ? <ResumeEditMobile /> : <ResumeEditDesktop />;
}
// // src/pages/Resume/ResumeEdit.tsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import BasicInfoSection, {
//   type BasicInfo,
//   type BasicErrors,
// } from "@/pages/Resume/ResumeCreate/BasicInfoSection/BasicInfoSection";

// import LocationSection, {
//   type LocationValue,
// } from "@/pages/Resume/ResumeCreate/LocationSection/LocationSection";
// import CareerSection, {
//   CareerInfo,
//   CareerErrors,
// } from "@/pages/Resume/ResumeCreate/CareerSection/CareerSection";
// import EducationSection, {
//   type Education,
//   type EducationErrors,
// } from "@/pages/Resume/ResumeCreate/EducationSection/EducationSection";
// import DesiredRoleSection from "@/pages/Resume/ResumeCreate/DesiredRoleSection/DesiredRoleSection";
// import HardSkillSection from "@/pages/Resume/ResumeCreate/HardSkillSection/HardSkillSection";
// import SoftSkillsSection from "@/pages/Resume/ResumeCreate/SoftSkillsSection/SoftSkillsSection";
// import ActivitiesSection, {
//   type Activity as ActivityItem,
// } from "@/pages/Resume/ResumeCreate/ActivitiesSection/ActivitiesSection";
// import AwardsCertificationsSection, {
//   type AwardsCertItem,
// } from "@/pages/Resume/ResumeCreate/AwardsCertificationsSection/AwardsCertificationsSection";
// import PortfolioDocumentsSection, {
//   type PortfolioDocItem,
// } from "@/pages/Resume/ResumeCreate/PortfolioDocumentsSection/PortfolioDocumentsSection";
// import SelfIntroductionSection from "@/pages/Resume/ResumeCreate/SelfIntroductionSection/SelfIntroductionSection";
// import MockInterviewAnalysisSection from "@/pages/Resume/ResumeCreate/MockInterviewAnalysisSection/MockInterviewAnalysisSection";
// import ResumeSidebar, {
//   type SectionId,
//   type Status,
// } from "@/pages/Resume/ResumeSidebar/ResumeSidebar";

// import AISuggestArea from "@/pages/Resume/ResumeAISuggest";

// import ic_star_gray700_20 from "@/assets/icons/size20/ic_star_gray700_20.png";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import {
//   createResume,
//   fetchResumeDetail,
//   fetchResumeTitleSuggestions,
//   fetchResumePositionSuggestions,
//   fetchResumeHardSkillSuggestions,
//   fetchResumeSoftSkillSuggestions,
//   fetchResumeSelfIntro,
//   updateResume,
// } from "@/api/resume/resume.api";
// import {
//   CreateResumeRequest,
//   isValidEmail,
//   mapAwardsKindToCategoryLabel,
//   mapEducationStatusToGraduatedYn,
//   mapGraduatedYnToLabel,
//   normalizeYm,
//   ProfilePhotoFile,
//   type ResumeDetailResponse,
//   ResumeTitleRequest,
//   ResumePositionRequest,
//   ResumeHardSkillRequest,
//   ResumeSoftSkillRequest,
//   ResumeSelfIntroRequest,
// } from "@/api/resume/resume.types";

// import { Storage } from "@/shared/utils/StorageManager";
// import { uploadPhotoFile } from "@/api/fileUpload.api";
// import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
// import { Icons } from "@/assets/icons";
// import Modal from "@/shared/components/modal/Modal";
// import { logout } from "@/api/auth/auth.api";

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // 타입 정의
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// type FormState = {
//   title: string;
//   basic: BasicInfo;
//   location: LocationValue;
//   careers: CareerInfo[];
//   isFreshGraduate: boolean;
//   education: Education[];
//   photoFile?: File | null;
//   profilePhotoFileMeta?: ProfilePhotoFile | null;
//   desiredRoles: string[];
//   hardSkills: string[];
//   softSkills: string[];
//   activities: ActivityItem[];
//   awardCerts: AwardsCertItem[];
//   portfolios: PortfolioDocItem[];
//   selfIntro: string;
// };

// export type ActivityErrors = {
//   activityType?: string;
//   activityName?: string;
//   startDate?: string;
//   endDate?: string;
// };

// export type AwardsCertErrors = {
//   kind?: string;
//   title?: string;
// };

// export type PortfolioErrors = {
//   file?: string;
//   url?: string;
// };

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // 유틸리티: CloudFront URL에서 순수 S3 경로 추출
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// const extractS3Path = (url: string): string => {
//   if (!url) return "";
//   // CloudFront URL이면 순수 경로만 추출
//   if (url.includes(".cloudfront.net/")) {
//     return url.split(".cloudfront.net/")[1];
//   }
//   // 이미 순수 경로면 그대로 반환
//   return url;
// };

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // 초기값
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// const initial: FormState = {
//   title: "",
//   basic: {
//     name: "",
//     birth: "",
//     gender: null,
//     email: "",
//     phone: "",
//     photoUrl: "",
//   },
//   location: { nationwide: false, selectedCodes: [] },
//   careers: [],
//   isFreshGraduate: false,
//   education: [],
//   photoFile: null,
//   profilePhotoFileMeta: null,
//   desiredRoles: [],
//   hardSkills: [],
//   softSkills: [],
//   activities: [],
//   awardCerts: [],
//   portfolios: [],
//   selfIntro: "",
// };

// const mapCategoryToKind = (category?: string): AwardsCertItem["kind"] => {
//   switch (category) {
//     case "Certification":
//       return "Certification";
//     case "LanguageTest":
//       return "LanguageTest";
//     case "Award":
//       return "Award";
//     case "Etc":
//       return "Etc";
//     default:
//       return "Etc";
//   }
// };

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // 상세 응답 → FormState 매핑
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// const mapDetailToFormState = (data: ResumeDetailResponse): FormState => {
//   return {
//     title: data.title ?? "",
//     basic: {
//       name: data.name ?? "",
//       birth: data.birth ?? "",
//       gender:
//         data.gender === "M" ? "male" : data.gender === "W" ? "female" : null,
//       email: data.email ?? "",
//       phone: data.phone ?? "",
//       photoUrl: data.profilePhotoFile?.filePath ?? "",
//     },

//     // 추가: 서버에서 내려준 프로필 사진 메타 저장 (수정 시 기존 사진 유지용)
//     profilePhotoFileMeta: data.profilePhotoFile
//       ? {
//           ...data.profilePhotoFile,
//           filePath: extractS3Path(data.profilePhotoFile.filePath),
//         }
//       : null,

//     location: {
//       nationwide: (data.regionList?.length ?? 0) === 0,
//       selectedCodes: data.regionList ?? [],
//     },
//     careers: (data.careerList ?? []).map((c) => ({
//       company_name: c.companyName ?? "",
//       employmentType: c.employmentType ?? "",
//       startDate: c.startYm ?? "",
//       endDate: c.endYm ?? "",
//       isCurrent: c.employedYn === "Y",
//       role: c.roleName ?? "",
//       position: c.positionName ?? "",
//       summary: c.workAndResult ?? "",
//     })),
//     isFreshGraduate: (data.careerList ?? []).length === 0,
//     education: (data.educationList ?? []).map((e) => ({
//       school_name: e.schoolName ?? "",
//       major_degree: e.majorDegree ?? "",
//       startDate: e.startYm ?? "",
//       endDate: e.endYm ?? "",
//       status: mapGraduatedYnToLabel(e.graduatedYn),
//     })),
//     photoFile: null,
//     desiredRoles: data.jobList ?? [],
//     hardSkills: data.hardSkillList ?? [],
//     softSkills: data.softSkillList ?? [],
//     activities: (data.activityList ?? []).map((a) => ({
//       activityType: a.category ?? "",
//       activityName: a.activityTitle ?? "",
//       startDate: a.startYm ?? "",
//       endDate: a.endYm ?? "",
//       summary: a.description ?? "",
//     })),
//     awardCerts: (data.licenseList ?? []).map((l) => ({
//       kind: mapCategoryToKind(l.category),
//       title: l.name ?? "",
//       issuer: l.issuer ?? "",
//       dateValue: l.acquiredYm ?? "",
//       score: l.score ?? "",
//     })),
//     portfolios: (data.portfolioList ?? []).map((p, idx) => ({
//       id: String(p.order ?? idx),
//       source: p.itemType === "FILE" ? "file" : "url",
//       title: p.title ?? "",
//       url: p.url ?? "",
//       note: p.description ?? "",
//       file: null,
//       filePath: p.filePath ? extractS3Path(p.filePath) : null,
//       fileIdx: p.fileIdx ?? null,
//       sizeBytes: (p as any).sizeBytes ?? 0,
//       contentType: (p as any).contentType ?? "",
//       storedName: (p as any).storedName ?? "",
//     } as any)),
//     selfIntro: (data.selfIntroList && data.selfIntroList[0]?.content) || "",
//   };
// };


// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // 섹션 완료 상태 계산 (Sidebar용)
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// const calcSectionStatus = (
//   form: FormState
// ): Partial<Record<SectionId, Status>> => {
//   const status: Partial<Record<SectionId, Status>> = {};

//   status.title = form.title.trim() ? "completed" : "pending";

//   const { name, birth, gender, email, phone } = form.basic;
//   status.basic =
//     name.trim() && birth.trim() && gender && email.trim() && phone.trim()
//       ? "completed"
//       : "pending";

//   status.location =
//     form.location.nationwide || form.location.selectedCodes.length > 0
//       ? "completed"
//       : "pending";

//   if (form.isFreshGraduate) {
//     status.career = "completed";
//   } else {
//     const valid =
//       form.careers.length > 0 &&
//       form.careers.every(
//         (c) =>
//           c.company_name.trim() &&
//           c.employmentType &&
//           c.startDate.trim() &&
//           (c.isCurrent || c.endDate.trim()) &&
//           c.role.trim() &&
//           c.position.trim()
//       );
//     status.career = valid ? "completed" : "pending";
//   }

//   const validEdu =
//     form.education.length > 0 &&
//     form.education.every(
//       (e) =>
//         e.school_name?.trim() &&
//         e.startDate?.trim() &&
//         e.endDate?.trim() &&
//         e.status?.trim()
//     );
//   status.education = validEdu ? "completed" : "pending";

//   status.desiredRole = form.desiredRoles.length > 0 ? "completed" : "pending";
//   status.hardSkills = form.hardSkills.length > 0 ? "completed" : "pending";
//   status.softSkills = form.softSkills.length > 0 ? "completed" : "pending";

//   if (form.activities.length === 0) {
//     status.activities = "pending";
//   } else {
//     const valid =
//       form.activities.length > 0 &&
//       form.activities.every(
//         (a) =>
//           a.activityType &&
//           a.activityName?.trim() &&
//           a.startDate?.trim() &&
//           a.endDate?.trim()
//       );
//     status.activities = valid ? "completed" : "pending";
//   }

//   if (form.awardCerts.length === 0) {
//     status.awards = "pending";
//   } else {
//     const valid = form.awardCerts.every(
//       (a) => a.kind && a.title?.trim()
//     );
//     status.awards = valid ? "completed" : "pending";
//   }

//   if (form.portfolios.length === 0) {
//     status.portfolio = "pending";
//   } else {
//     const valid = form.portfolios.every((p) =>
//       p.source === "file"
//         ? !!(p as any).file || !!(p as any).filePath
//         : !!p.url?.trim()
//     );
//     status.portfolio = valid ? "completed" : "pending";
//   }

//   status.selfIntro = form.selfIntro.trim() ? "completed" : "pending";
//   status.mockInterview = "pending";

//   return status;
// };

// export default function ResumeEdit() {
//   const navigate = useNavigate();
//   const { resumeId } = useParams<{ resumeId: string }>();
//   const isEdit = !!resumeId;

//   const [form, setForm] = useState<FormState>(initial);
//   const [errors, setErrors] = useState<{
//     basic: BasicErrors;
//     title?: string;
//     location?: string;
//     careers?: CareerErrors[];
//     education?: EducationErrors[];
//     desiredRoles?: string;
//     activities?: ActivityErrors[];
//     awardCerts?: AwardsCertErrors[];
//     portfolios?: PortfolioErrors[];
//   }>({
//     basic: {},
//     education: [],
//     activities: [],
//     awardCerts: [],
//     portfolios: [],
//   });

//   // 🔥 AI 제목 추천 상태
//   const [showTitleSuggest, setShowTitleSuggest] = useState(false);
//   const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);

//   // 🔥 희망 직무 AI 추천 상태
//   const [showRoleSuggest, setShowRoleSuggest] = useState(false);
//   const [roleSuggestions, setRoleSuggestions] = useState<string[]>([]);
//   const [isRoleLoading, setIsRoleLoading] = useState(false);

//   // 🔥 하드 스킬 AI 추천 상태
//   const [showHardSkillSuggest, setShowHardSkillSuggest] = useState(false);
//   const [hardSkillSuggestions, setHardSkillSuggestions] = useState<string[]>([]);
//   const [isHardSkillLoading, setIsHardSkillLoading] = useState(false);

//   // 🔥 소프트 스킬 AI 추천 상태
//   const [showSoftSkillSuggest, setShowSoftSkillSuggest] = useState(false);
//   const [softSkillSuggestions, setSoftSkillSuggestions] = useState<string[]>([]);
//   const [isSoftSkillLoading, setIsSoftSkillLoading] = useState(false);

//   // 🔥 자기소개 AI 추천 상태
//   const [showSelfIntroSuggest, setShowSelfIntroSuggest] = useState(false);
//   const [selfIntroSuggestions, setSelfIntroSuggestions] = useState<string[]>([]);
//   const [isSelfIntroLoading, setIsSelfIntroLoading] = useState(false);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isDefaultResume, setIsDefaultResume] = useState(false);
//   const [sidebarStatus, setSidebarStatus] =
//     useState<Partial<Record<SectionId, Status>>>({});
//   const [isReady, setIsReady] = useState(!isEdit);
//   const [showCancelModal, setShowCancelModal] = useState(false);

//   // form 변경 시마다 사이드바 상태 갱신
//   useEffect(() => {
//     setSidebarStatus(calcSectionStatus(form));
//   }, [form]);

//   // 상세 조회
//   useEffect(() => {
//     if (!isEdit || !resumeId) {
//       setIsReady(true);
//       return;
//     }

//     const loadDetail = async () => {
//       try {
//         setIsLoading(true);
//         const data = await fetchResumeDetail(Number(resumeId));
//         console.log("📌 resume detail", data);
//         const mapped = mapDetailToFormState(data);
//         console.log("📌 mapped form", mapped);
//         setForm(mapped);
//         setIsDefaultResume(data.isDefault);
//         setIsReady(true);
//       } catch (err: any) {
//         if (err.code === 999) {
//           console.error("❌ 이력서 상세 조회 실패:", err);
//           setIsReady(true);
//           console.log("로그인만료");
//           logout();
//           navigate("/login");
//         } else {
//           console.error("❌ 이력서 상세 조회 실패:", err);
//           toast.error("이력서 정보를 불러오지 못했습니다.");
//           setIsReady(true);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadDetail();
//   }, [isEdit, resumeId, navigate]);

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // AI 제목 추천 / 희망 직무 / 하드 / 소프트 / 자기소개
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   const handleClickTitleSuggest = async () => {
//     try {
//       if (isLoading) return;
//       if (!form.careers[0] || form.careers.length === 0) {
//         toast.info("경력 항목을 1개 이상 입력해 주세요.");
//         return;
//       }
//       if (form.careers[0].role === "" || form.careers[0].position === "") {
//         toast.info("경력 항목을 1개 이상 입력해 주세요.");
//         return;
//       }
//       if (form.activities.length === 0) {
//         toast.info("활동·경험 항목을 1개 이상 입력해 주세요.");
//         return;
//       }

//       setIsLoading(true);

//       const position = form.desiredRoles.slice(0, 2).join(", ");
//       const experiences = form.careers
//         .map((c) => {
//           const summary = c.summary ? ` / ${c.summary}` : "";
//           return `${c.company_name} / ${c.role} (${c.position})${summary}`;
//         })
//         .join("\n");

//       const activities = form.activities
//         .map((a) => {
//           const period = `${a.startDate} ~ ${a.endDate}`;
//           return `${a.activityType ?? ""} / ${a.activityName} / ${period}`;
//         })
//         .join("\n");

//       const awards = form.awardCerts
//         .map((aw) => `${aw.kind ?? ""} / ${aw.title}`)
//         .join("\n");

//       const payload: ResumeTitleRequest = {
//         position,
//         experiences,
//         activities,
//         awards,
//       };

//       console.log("보내는 페이로드", payload);
//       const titles = await fetchResumeTitleSuggestions(payload);
//       console.log("결과값", titles);
//       if (!titles || titles.length === 0) {
//         toast.info("추천할 제목이 없습니다. 내용을 조금 더 채워보세요.");
//         return;
//       }

//       setTitleSuggestions(titles);
//       setShowTitleSuggest(true);
//     } catch (error) {
//       console.error("AI 제목 추천 실패:", error);
//       toast.error("AI 제목 추천 중 오류가 발생했습니다.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCloseTitleSuggest = () => setShowTitleSuggest(false);

//   const handleClickRoleSuggest = async () => {
//     try {
//       if (isRoleLoading) return;

//       if (!form.careers || form.careers.length === 0) {
//         toast.info("경력 항목을 1개 이상 입력해 주세요.");
//         return;
//       }

//       if (!form.education || form.education.length === 0) {
//         toast.info("학력 항목을 1개 이상 입력해 주세요.");
//         return;
//       }

//       setIsRoleLoading(true);

//       const experiences = form.careers
//         .map((c) => {
//           const period = c.isCurrent
//             ? `${c.startDate} ~ 현재`
//             : `${c.startDate} ~ ${c.endDate || ""}`;
//           return `${c.company_name} / ${c.role} (${c.position}) / ${period}`;
//         })
//         .join("\n");

//       const educations = form.education
//         .map((e) => {
//           const period = `${e.startDate} ~ ${e.endDate}`;
//           return `${e.school_name} / ${e.major_degree ?? ""} / ${period}`;
//         })
//         .join("\n");

//       const activities = form.activities
//         .map((a) => {
//           const period = `${a.startDate} ~ ${a.endDate}`;
//           return `${a.activityType ?? ""} / ${a.activityName} / ${period}`;
//         })
//         .join("\n");

//       const awards = form.awardCerts
//         .map((aw) => `${aw.kind ?? ""} / ${aw.title}`)
//         .join("\n");

//       const payload: ResumePositionRequest = {
//         experiences,
//         educations,
//         activities,
//         awards,
//       };
//       console.log("AI 직무 추천 payload:", payload);
//       const positions = await fetchResumePositionSuggestions(payload);
//       if (!positions || positions.length === 0) {
//         toast.info("추천할 직무가 없습니다. 내용을 조금 더 채워보세요.");
//         return;
//       }

//       console.log("AI 직무 추천 결과:", positions);
//       setRoleSuggestions(positions);
//       setShowRoleSuggest(true);
//     } catch (error) {
//       console.error("AI 직무 추천 실패:", error);
//       toast.error("AI 직무 추천 중 오류가 발생했습니다.");
//     } finally {
//       setIsRoleLoading(false);
//     }
//   };

//   const handleCloseRoleSuggest = () => setShowRoleSuggest(false);

//   const handleClickHardSkillSuggest = async () => {
//     try {
//       if (isHardSkillLoading) return;

//       if (!form.desiredRoles || form.desiredRoles.length === 0) {
//         toast.info("희망 직무를 1개 이상 입력해 주세요.");
//         return;
//       }
//       if (!form.careers[0] || form.careers.length === 0) {
//         toast.info("경력 항목을 1개 이상 입력해 주세요.");
//         return;
//       }
//       if (form.careers[0].role === "" || form.careers[0].position === "") {
//         toast.info("경력 항목을 1개 이상 입력해 주세요.");
//         return;
//       }

//       setIsHardSkillLoading(true);

//       const position = form.desiredRoles[0] ?? "";

//       const experiences = form.careers
//         .map((c) => {
//           const base = `${c.company_name} / ${c.role} (${c.position})`;
//           const extra = c.summary ? ` / ${c.summary}` : "";
//           return base + extra;
//         })
//         .join("\n");

//       const activities = form.activities
//         .map((a) => {
//           const base = `${a.activityType ?? ""} / ${a.activityName ?? ""}`;
//           const extra = a.summary ? ` / ${a.summary}` : "";
//           return base + extra;
//         })
//         .join("\n");

//       const awards = form.awardCerts
//         .map((aw) => `${aw.kind ?? ""} / ${aw.title ?? ""}`)
//         .join("\n");

//       const payload: ResumeHardSkillRequest = {
//         position,
//         experiences,
//         activities,
//         awards,
//       };

//       console.log("AI 하드 스킬 추천 payload:", payload);

//       const skills = await fetchResumeHardSkillSuggestions(payload);
//       console.log("AI 하드 스킬 추천 결과:", skills);

//       if (!skills || skills.length === 0) {
//         toast.info(
//           "추천할 하드 스킬이 없습니다. [경력] 담당 업무 내용을 조금 더 구체적으로 작성해 보세요."
//         );
//         return;
//       }

//       setHardSkillSuggestions(skills);
//       setShowHardSkillSuggest(true);
//     } catch (error: any) {
//       console.error("AI 하드 스킬 추천 실패:", error);
//       toast.info(
//         "추천할 하드 스킬이 없습니다. [경력] 담당 업무 내용을 조금 더 구체적으로 작성해 보세요."
//       );
//     } finally {
//       setIsHardSkillLoading(false);
//     }
//   };

//   const handleCloseHardSkillSuggest = () => setShowHardSkillSuggest(false);

//   const handleClickSoftSkillSuggest = async () => {
//     try {
//       if (isSoftSkillLoading) return;

//       if (!form.desiredRoles || form.desiredRoles.length === 0) {
//         toast.info("희망 직무를 1개 이상 입력해 주세요.");
//         return;
//       }
//       if (!form.careers[0] || form.careers.length === 0) {
//         toast.info("경력 항목을 1개 이상 입력해 주세요.");
//         return;
//       }

//       setIsSoftSkillLoading(true);

//       const position = form.desiredRoles[0] ?? "";

//       const experiences = form.careers
//         .map((c) => {
//           const extra = c.summary ? ` / ${c.summary}` : "";
//           return extra;
//         })
//         .join("\n");

//       const activities = form.activities
//         .map((a) => {
//           const extra = a.summary ? ` / ${a.summary}` : "";
//           return extra;
//         })
//         .join("\n");

//       const awards = form.awardCerts
//         .map((aw) => `${aw.kind ?? ""} / ${aw.title ?? ""}`)
//         .join("\n");

//       const payload: ResumeSoftSkillRequest = {
//         position,
//         experiences,
//         activities,
//         awards,
//       };

//       console.log("AI 소프트 스킬 추천 payload:", payload);

//       const skills = await fetchResumeSoftSkillSuggestions(payload);
//       console.log("AI 소프트 스킬 추천 결과:", skills);

//       if (!skills || skills.length === 0) {
//         toast.info(
//           "추천할 소프트 스킬이 없습니다. [경력] 담당 업무 내용을 조금 더 구체적으로 작성해 보세요."
//         );
//         return;
//       }

//       setSoftSkillSuggestions(skills);
//       setShowSoftSkillSuggest(true);
//     } catch (error: any) {
//       console.error("AI 소프트 스킬 추천 실패:", error);
//       toast.info(
//         "추천할 소프트 스킬이 없습니다. [경력] 담당 업무 내용을 조금 더 구체적으로 작성해 보세요."
//       );
//     } finally {
//       setIsSoftSkillLoading(false);
//     }
//   };

//   const handleCloseSoftSkillSuggest = () => setShowSoftSkillSuggest(false);

//   const handleClickSelfIntroSuggest = async () => {
//     try {
//       if (isSelfIntroLoading) return;

//       if (!form.desiredRoles || form.desiredRoles.length === 0) {
//         toast.info("희망 직무를 1개 이상 입력해 주세요.");
//         return;
//       }
//       if (!form.careers || form.careers.length === 0) {
//         toast.info("경력 항목을 1개 이상 입력해 주세요.");
//         return;
//       }

//       setIsSelfIntroLoading(true);

//       const position = form.desiredRoles[0] ?? "";

//       const experiences = form.careers
//         .map((c) => {
//           const summary = c.summary ? `${c.summary}` : "";
//           return summary;
//         })
//         .join("\n");

//       const activities = form.activities
//         .map((a) => {
//           const period = `${a.startDate} ~ ${a.endDate}`;
//           const summary = a.summary ? ` / ${a.summary}` : "";
//           return `${a.activityType ?? ""} / ${a.activityName ?? ""} / ${period}${summary}`;
//         })
//         .join("\n");

//       const awards = form.awardCerts
//         .map((aw) => `${aw.kind ?? ""} / ${aw.title ?? ""}`)
//         .join("\n");

//       const payload: ResumeSelfIntroRequest = {
//         position,
//         experiences,
//         activities,
//         awards,
//       };

//       console.log("AI 자기소개 추천 payload:", payload);

//       const selfintro = await fetchResumeSelfIntro(payload);
//       console.log("AI 자기소개 추천 결과:", selfintro);

//       if (!selfintro) {
//         toast.info(
//           "추천할 자기소개 문장이 없습니다. [경력] 담당 업무 내용을 조금 더 구체적으로 작성해 보세요."
//         );
//         return;
//       }

//       setSelfIntroSuggestions([selfintro]);
//       setShowSelfIntroSuggest(true);
//     } catch (error) {
//       console.error("AI 자기소개 추천 실패:", error);
//       toast.info(
//         "추천할 자기소개 문장이 없습니다. [경력] 담당 업무 내용을 조금 더 구체적으로 작성해 보세요."
//       );
//     } finally {
//       setIsSelfIntroLoading(false);
//     }
//   };

//   const handleCloseSelfIntroSuggest = () => setShowSelfIntroSuggest(false);

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // 검증/업데이트 헬퍼들
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   const buildCareerErrors = (careers: CareerInfo[]): CareerErrors[] =>
//     careers.map((c) => {
//       const ce: CareerErrors = {};
//       if (!c.company_name.trim()) ce.company_name = "required";
//       if (!c.employmentType) ce.employmentType = "required";
//       if (!c.startDate.trim()) ce.startDate = "required";
//       if (!c.isCurrent && !c.endDate.trim()) ce.endDate = "required";
//       if (!c.role.trim()) ce.role = "required";
//       if (!c.position.trim()) ce.position = "required";
//       return ce;
//     });

//   const buildEducationErrors = (educations: Education[]): EducationErrors[] =>
//     educations.map((e) => {
//       const ee: EducationErrors = {};
//       if (!e.school_name?.trim()) ee.school_name = "required";
//       if (!e.startDate?.trim()) ee.startDate = "required";
//       if (!e.endDate?.trim()) ee.endDate = "required";
//       if (!e.status?.trim()) ee.status = "required";
//       return ee;
//     });

//   const buildActivityErrors = (activities: ActivityItem[]): ActivityErrors[] =>
//     activities.map((act) => {
//       const ae: ActivityErrors = {};
//       if (!act.activityType) ae.activityType = "required";
//       if (!act.activityName?.trim()) ae.activityName = "required";
//       if (!act.startDate?.trim()) ae.startDate = "required";
//       if (!act.endDate?.trim()) ae.endDate = "required";
//       return ae;
//     });

//   const buildAwardCertErrors = (
//     awardCerts: AwardsCertItem[]
//   ): AwardsCertErrors[] =>
//     awardCerts.map((item) => {
//       const ace: AwardsCertErrors = {};
//       if (!item.kind) ace.kind = "required";
//       if (!item.title?.trim()) ace.title = "required";
//       return ace;
//     });

//   const buildPortfolioErrors = (
//     portfolios: PortfolioDocItem[]
//   ): PortfolioErrors[] =>
//     portfolios.map((item) => {
//       const pe: PortfolioErrors = {};
//       if (item.source === "file") {
//         if (!(item as any).file && !(item as any).filePath) pe.file = "required";
//       } else {
//         if (!item.url?.trim()) pe.url = "required";
//       }
//       return pe;
//     });

//   const updateBasic = (patch: Partial<BasicInfo>) =>
//     setForm((prev) => ({ ...prev, basic: { ...prev.basic, ...patch } }));

//   const updateLocation = (patch: Partial<LocationValue>) =>
//     setForm((prev) => {
//       const nextLocation: LocationValue = { ...prev.location, ...patch };

//       if (nextLocation.nationwide || nextLocation.selectedCodes.length > 0) {
//         setErrors((prevErr) => ({ ...prevErr, location: undefined }));
//       }

//       return { ...prev, location: nextLocation };
//     });

//   const updateCareers = (newList: CareerInfo[], isFresh: boolean) => {
//     setForm((prev) => ({
//       ...prev,
//       careers: newList,
//       isFreshGraduate: isFresh,
//     }));

//     setErrors((prev) => {
//       if (!prev.careers) return prev;
//       const nextCareerErrors = buildCareerErrors(newList);
//       return { ...prev, careers: nextCareerErrors };
//     });
//   };

//   const updateEducation = (newList: Education[]) => {
//     setForm((prev) => ({ ...prev, education: newList }));

//     setErrors((prev) => {
//       if (!prev.education || prev.education.length === 0) return prev;
//       const nextEduErrors = buildEducationErrors(newList);
//       return { ...prev, education: nextEduErrors };
//     });
//   };

//   const updatePhotoFile = (file: File | null) =>
//     setForm((prev) => ({ ...prev, photoFile: file }));

//   const updateDesiredRoles = (roles: string[]) => {
//     setForm((prev) => ({ ...prev, desiredRoles: roles }));
//     if (roles.length > 0) {
//       setErrors((prev) => ({ ...prev, desiredRoles: undefined }));
//     }
//   };

//   const updateHardSkills = (skills: string[]) =>
//     setForm((prev) => ({ ...prev, hardSkills: skills }));

//   const updateSoftSkills = (skills: string[]) =>
//     setForm((prev) => ({ ...prev, softSkills: skills }));

//   const updateActivities = (activities: ActivityItem[]) => {
//     setForm((prev) => ({ ...prev, activities }));

//     setErrors((prev) => {
//       if (!prev.activities || prev.activities.length === 0) return prev;
//       const nextActivityErrors = buildActivityErrors(activities);
//       return { ...prev, activities: nextActivityErrors };
//     });
//   };

//   const updateAwardCerts = (list: AwardsCertItem[]) => {
//     setForm((prev) => ({ ...prev, awardCerts: list }));

//     setErrors((prev) => {
//       if (!prev.awardCerts || prev.awardCerts.length === 0) return prev;
//       const nextAwardCertErrors = buildAwardCertErrors(list);
//       return { ...prev, awardCerts: nextAwardCertErrors };
//     });
//   };

//   const updatePortfolios = (list: PortfolioDocItem[]) => {
//     setForm((prev) => ({ ...prev, portfolios: list }));

//     setErrors((prev) => {
//       if (!prev.portfolios || prev.portfolios.length === 0) return prev;
//       const nextPortfolioErrors = buildPortfolioErrors(list);
//       return { ...prev, portfolios: nextPortfolioErrors };
//     });
//   };

//   const updateSelfIntro = (content: string) =>
//     setForm((prev) => ({ ...prev, selfIntro: content }));

//   const resetBasicErrors = () =>
//     setErrors((prev) => ({ ...prev, basic: {} }));

//   const resetEducationErrors = () =>
//     setErrors((prev) => ({ ...prev, education: [] }));

//   const resetActivityErrors = () =>
//     setErrors((prev) => ({ ...prev, activities: [] }));

//   const resetAwardCertErrors = () =>
//     setErrors((prev) => ({ ...prev, awardCerts: [] }));

//   const resetPortfolioErrors = () =>
//     setErrors((prev) => ({ ...prev, portfolios: [] }));

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // 파일 업로드 함수
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   const handleFileSubmit = async (): Promise<ProfilePhotoFile | null> => {
//     try {
//       if (!form.photoFile) return null;

//       const { s3_key, finalUrl, uniqueFileName, originalFileName } =
//         await uploadPhotoFile(form.photoFile, "resume/profile");

//       const profilePhotoFile: ProfilePhotoFile = {
//         filePath: s3_key,
//         originalName: originalFileName,
//         storedName: uniqueFileName,
//         sizeBytes: form.photoFile.size,
//         contentType: form.photoFile.type,
//       };

//       return profilePhotoFile;
//     } catch (error) {
//       console.error("❌ 업로드 실패:", error);
//       throw error;
//     }
//   };

//   const handlePortfolioFilesSubmit = async (): Promise<
//     Array<{
//       originalItem: PortfolioDocItem;
//       uploadedFile?: {
//         filePath: string;
//         originalName: string;
//         storedName: string;
//         sizeBytes: number;
//         contentType: string;
//       };
//     }>
//   > => {
//     try {
//       const fileItems = form.portfolios.filter(
//         (p) => p.source === "file" && p.file
//       );
//       console.log("📤 업로드 대상 fileItems", fileItems);
//       if (fileItems.length === 0) return [];

//       const uploadPromises = fileItems.map(async (item) => {
//         if (!item.file) {
//           return { originalItem: item } as {
//             originalItem: PortfolioDocItem;
//             uploadedFile?: {
//               filePath: string;
//               originalName: string;
//               storedName: string;
//               sizeBytes: number;
//               contentType: string;
//             };
//           };
//         }

//         const { s3_key, finalUrl, uniqueFileName, originalFileName } =
//           await uploadPhotoFile(item.file, "resume/portfolio");

//         const uploaded = {
//           originalItem: item,
//           uploadedFile: {
//             filePath: s3_key,
//             originalName: originalFileName,
//             storedName: uniqueFileName,
//             sizeBytes: item.file.size,
//             contentType: item.file.type,
//           },
//         };
//         console.log("📤 업로드 완료", uploaded);
//         return uploaded;
//       });

//       const results = await Promise.all(uploadPromises);
//       console.log("📤 handlePortfolioFilesSubmit 결과", results);
//       return results;
//     } catch (error) {
//       console.error("❌ 포트폴리오 파일 업로드 실패:", error);
//       toast.error("포트폴리오 파일 업로드 중 오류가 발생했습니다.");
//       throw error;
//     }
//   };

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // 검증 / 제출 / 임시저장
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   const validate = () => {
//     const nextErr: typeof errors = {
//       basic: {} as BasicErrors,
//       education: [],
//       activities: [],
//       awardCerts: [],
//       portfolios: [],
//     };
  
//     if (!form.title.trim()) {
//       nextErr.title = "여기 이력서 제목을 입력해 주세요.";
//     }
  
//     if (!form.location.nationwide && form.location.selectedCodes.length === 0) {
//       nextErr.location = "1개 이상 추가해 주세요.";
//     }
  
//     const basicErr: BasicErrors = {};
//     if (!form.basic.name.trim()) basicErr.name = "이름을 입력해 주세요.";
//     if (!form.basic.birth.trim()) basicErr.birth = "생년월일을 입력해 주세요.";
//     if (!form.basic.gender) basicErr.gender = "성별을 선택해 주세요.";
//     if (!form.basic.email.trim()) {
//       basicErr.email = "이메일을 입력해 주세요.";
//     } else if (!isValidEmail(form.basic.email.trim())) {
//       basicErr.email = "이메일 형식이 올바르지 않습니다.";
//       toast.error("이메일 형식이 올바르지 않습니다.");
//     }
//     if (!form.basic.phone.trim()) basicErr.phone = "연락처를 입력해 주세요.";
//     nextErr.basic = basicErr;
  
//     if (!form.isFreshGraduate) {
//       nextErr.careers = buildCareerErrors(form.careers);
//     }
  
//     const educationsToValidate =
//       form.education.length > 0
//         ? form.education
//         : [
//             {
//               school_name: "",
//               major_degree: "",
//               startDate: "",
//               endDate: "",
//               status: "",
//             },
//           ];
//     const eduErrs = buildEducationErrors(educationsToValidate);
//     nextErr.education = eduErrs;
  
//     if (form.desiredRoles.length === 0) {
//       nextErr.desiredRoles = "1개 이상 추가해 주세요.";
//     }
  
//     if (form.activities.length > 0) {
//       nextErr.activities = buildActivityErrors(form.activities);
//     }
  
//     if (form.awardCerts.length > 0) {
//       nextErr.awardCerts = buildAwardCertErrors(form.awardCerts);
//     }
  
//     if (form.portfolios.length > 0) {
//       nextErr.portfolios = buildPortfolioErrors(form.portfolios);
//     }
  
//     setErrors(nextErr);
  
//     const hasBasicError = Object.keys(basicErr).length > 0;
//     const hasTitleError = !!nextErr.title;
//     const hasLocationError = !!nextErr.location;
//     const hasCareerError =
//       !form.isFreshGraduate &&
//       nextErr.careers &&
//       nextErr.careers.some((ce) => Object.keys(ce).length > 0);
//     const hasEduError = eduErrs && eduErrs.some((ee) => Object.keys(ee).length > 0);
//     const hasDesiredRolesError = !!nextErr.desiredRoles;
//     const hasActivityError =
//       form.activities.length > 0 &&
//       nextErr.activities &&
//       nextErr.activities.some((ae) => Object.keys(ae).length > 0);
//     const hasAwardCertError =
//       form.awardCerts.length > 0 &&
//       nextErr.awardCerts &&
//       nextErr.awardCerts.some((ace) => Object.keys(ace).length > 0);
//     const hasPortfolioError =
//       form.portfolios.length > 0 &&
//       nextErr.portfolios &&
//       nextErr.portfolios.some((pe) => Object.keys(pe).length > 0);
  
//     return (
//       !hasTitleError &&
//       !hasLocationError &&
//       !hasBasicError &&
//       !hasCareerError &&
//       !hasEduError &&
//       !hasDesiredRolesError &&
//       !hasActivityError &&
//       !hasAwardCertError &&
//       !hasPortfolioError
//     );
//   };
  
//   const handleSubmit = async () => {
//     try {
//       const ok = validate();
//       if (!ok) {
//         toast.error("필수 항목을 먼저 입력해 주세요.");
//         return;
//       }
  
//       if (isEdit && !resumeId) {
//         toast.error("잘못된 접근입니다.");
//         return;
//       }
  
//       setIsLoading(true);
  
//       // ✅ 수정: 업로드 없으면 상세조회로 저장해둔 메타 그대로 재전송
//       const uploadedProfilePhotoFile = await handleFileSubmit();
//       const profilePhotoFile =
//         uploadedProfilePhotoFile ?? form.profilePhotoFileMeta ?? null;
  
//       const portfolioFilesResults = await handlePortfolioFilesSubmit();
  
//       console.log("🚀 handleSubmit - 전체 portfolios", form.portfolios);
  
//       const payload: CreateResumeRequest = {
//         userIdx: Storage.getUserIdx(),
//         isDefault: isDefaultResume ? 1 : 0,
//         temp: "N",
//         title: form.title,
//         name: form.basic.name,
//         email: form.basic.email,
//         gender: form.basic.gender === "male" ? "M" : "W",
//         phone: form.basic.phone,
//         birth: form.basic.birth,
  
//         ...(profilePhotoFile ? { profilePhotoFile } : {}),
  
//         regions: form.location.nationwide ? [] : form.location.selectedCodes,
  
//         ...(form.isFreshGraduate
//           ? {}
//           : {
//               careers: form.careers.map((career) => ({
//                 employmentType: career.employmentType || "정규직",
//                 companyName: career.company_name,
//                 startYm: normalizeYm(career.startDate)!,
//                 endYm: career.isCurrent ? null : normalizeYm(career.endDate),
//                 roleName: career.role,
//                 positionName: career.position,
//                 workAndResult: career.summary,
//                 employedYn: career.isCurrent ? "Y" : "N",
//               })),
//             }),
  
//         educations: form.education.map((edu) => ({
//           schoolName: edu.school_name,
//           startYm: normalizeYm(edu.startDate)!,
//           endYm: edu.endDate,
//           majorDegree: edu.major_degree,
//           graduatedYn: mapEducationStatusToGraduatedYn(edu.status),
//         })),
  
//         jobs: form.desiredRoles,
//         hardSkills: form.hardSkills,
//         softSkills: form.softSkills,
  
//         ...(form.activities.length > 0
//           ? {
//               activities: form.activities.map((act) => ({
//                 category: act.activityType ?? "교내활동",
//                 activityTitle: act.activityName,
//                 startYm: act.startDate
//                   ? normalizeYm(act.startDate)
//                   : "1999-09-09",
//                 endYm: act.endDate ? normalizeYm(act.endDate) : "1999-09-09",
//                 description: act.summary,
//                 linkUrl: "https://github.com/user",
//               })),
//             }
//           : {}),
  
//         ...(form.awardCerts.length > 0
//           ? {
//               awardCerts: form.awardCerts.map((item) => ({
//                 category: mapAwardsKindToCategoryLabel(item.kind),
//                 name: item.title,
//                 issuer: item.issuer ?? "",
//                 acquiredYm: item.dateValue
//                   ? normalizeYm(item.dateValue)!.replace("-", "")
//                   : "",
//                 licenseNo: item.score ?? "",
//                 note: "",
//               })),
//             }
//           : {}),
  
//         ...(form.portfolios.length > 0
//           ? {
//               portfolios: form.portfolios.map((p, idx) => {
//                 if (p.source === "file") {
//                   const uploadedResult = portfolioFilesResults.find(
//                     (r) => r.originalItem.id === p.id
//                   );
  
//                   if (uploadedResult?.uploadedFile) {
//                     const u = uploadedResult.uploadedFile;
//                     return {
//                       itemType: "FILE" as const,
//                       title: u.originalName,
//                       docName: u.originalName,
//                       url: null,
//                       fileRef: u.filePath,
//                       description: p.note ?? "",
//                       sortOrder: idx + 1,
//                       portfolioFile: {
//                         filePath: u.filePath,
//                         originalName: u.originalName,
//                         storedName: u.storedName,
//                         sizeBytes: u.sizeBytes,
//                         contentType: u.contentType,
//                       },
//                     };
//                   }
  
//                   if (p.filePath) {
//                     const cleanPath = extractS3Path(p.filePath);
//                     const storedName =
//                       (p as any).storedName || cleanPath.split("/").pop() || "";
//                     const sizeBytes = (p as any).sizeBytes || 1048576;
//                     const contentType =
//                       (p as any).contentType ||
//                       (() => {
//                         const extension =
//                           storedName.split(".").pop()?.toLowerCase() || "";
//                         const contentTypeMap: Record<string, string> = {
//                           pdf: "application/pdf",
//                           doc: "application/msword",
//                           docx:
//                             "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//                           xls: "application/vnd.ms-excel",
//                           xlsx:
//                             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//                           ppt: "application/vnd.ms-powerpoint",
//                           pptx:
//                             "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//                           jpg: "image/jpeg",
//                           jpeg: "image/jpeg",
//                           png: "image/png",
//                           gif: "image/gif",
//                           txt: "text/plain",
//                         };
//                         return contentTypeMap[extension] || "application/octet-stream";
//                       })();
  
//                     return {
//                       itemType: "FILE" as const,
//                       title: p.title || `포트폴리오 문서 ${idx + 1}`,
//                       docName: p.title || "",
//                       url: null,
//                       fileRef: cleanPath,
//                       description: p.note ?? "",
//                       sortOrder: idx + 1,
//                       portfolioFile: {
//                         filePath: cleanPath,
//                         originalName: p.title || storedName,
//                         storedName: storedName,
//                         sizeBytes: sizeBytes,
//                         contentType: contentType,
//                       },
//                     };
//                   }
//                 }
  
//                 return {
//                   itemType: "URL" as const,
//                   title: p.title || `포트폴리오 ${idx + 1}`,
//                   docName: p.url || "",
//                   url: p.url,
//                   fileRef: null,
//                   description: p.note ?? "",
//                   sortOrder: idx + 1,
//                   portfolioFile: null,
//                 };
//               }),
//             }
//           : {}),
  
//         ...(form.selfIntro.trim().length > 0
//           ? {
//               selfIntros: [
//                 {
//                   title: "소개",
//                   content: form.selfIntro,
//                   isAi: false,
//                 },
//               ],
//             }
//           : {}),
//       };
  
//       console.log("📨 최종!!!!! payload(handleSubmit)", payload);
  
//       const res = await updateResume(Number(resumeId), payload);
//       console.log("이력서 수정", res);
//       if (res.code === 200) {
//         setIsLoading(false);
//         toast.success("이력서가 수정되었습니다!");
//         navigate(`/resumes/${resumeId}`);
//       } else {
//         toast.error(res.msg || "이력서 수정에 실패했습니다.");
//       }
//     } catch (error: any) {
//       console.error("❌ 이력서 저장 실패:", error);
//       console.error("❌ status:", error?.response?.status);
//       console.error("❌ data:", error?.response?.data);
//       toast.error(error?.response?.data?.msg || "이력서 저장 중 오류가 발생했습니다.");
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const handleTempSave = async () => {
//     try {
//       setIsLoading(true);
//       const nextErr: typeof errors = {
//         basic: {} as BasicErrors,
//       };
  
//       if (!form.title.trim()) {
//         nextErr.title = "여기 이력서 제목을 입력해 주세요.";
//         setErrors(nextErr);
//         setIsLoading(false);
//         toast.error("필수 항목을 먼저 입력해 주세요.");
//         return;
//       }
  
//       // ✅ 수정: 업로드 없으면 상세조회로 저장해둔 메타 그대로 재전송
//       const uploadedProfilePhotoFile = await handleFileSubmit();
//       const profilePhotoFile =
//         uploadedProfilePhotoFile ?? form.profilePhotoFileMeta ?? null;
  
//       const portfolioFilesResults = await handlePortfolioFilesSubmit();
  
//       console.log("🚀 handleTempSave - 전체 portfolios", form.portfolios);
  
//       const payload: CreateResumeRequest = {
//         userIdx: Storage.getUserIdx(),
//         isDefault: 0,
//         temp: "Y",
//         title: form.title,
//         name: form.basic.name,
//         email: form.basic.email,
//         gender: form.basic.gender === "male" ? "M" : "W",
//         phone: form.basic.phone,
//         birth: form.basic.birth,
  
//         ...(profilePhotoFile ? { profilePhotoFile } : {}),
  
//         regions: form.location.nationwide ? [] : form.location.selectedCodes,
  
//         ...(form.isFreshGraduate
//           ? {}
//           : {
//               careers: form.careers.map((career) => ({
//                 employmentType: career.employmentType || "정규직",
//                 companyName: career.company_name,
//                 startYm: normalizeYm(career.startDate)!,
//                 endYm: career.isCurrent ? null : normalizeYm(career.endDate),
//                 roleName: career.role,
//                 positionName: career.position,
//                 workAndResult: career.summary,
//                 employedYn: career.isCurrent ? "Y" : "N",
//               })),
//             }),
  
//         educations: form.education.map((edu) => ({
//           schoolName: edu.school_name,
//           startYm: normalizeYm(edu.startDate)!,
//           endYm: edu.endDate,
//           majorDegree: edu.major_degree,
//           graduatedYn: mapEducationStatusToGraduatedYn(edu.status),
//         })),
  
//         jobs: form.desiredRoles,
//         hardSkills: form.hardSkills,
//         softSkills: form.softSkills,
  
//         ...(form.activities.length > 0
//           ? {
//               activities: form.activities.map((act) => ({
//                 category: act.activityType ?? "교내활동",
//                 activityTitle: act.activityName,
//                 startYm: act.startDate
//                   ? normalizeYm(act.startDate)
//                   : "1999-09-09",
//                 endYm: act.endDate ? normalizeYm(act.endDate) : "1999-09-09",
//                 description: act.summary,
//                 linkUrl: "https://github.com/user",
//               })),
//             }
//           : {}),
  
//         ...(form.awardCerts.length > 0
//           ? {
//               awardCerts: form.awardCerts.map((item) => ({
//                 category: mapAwardsKindToCategoryLabel(item.kind),
//                 name: item.title,
//                 issuer: item.issuer ?? "",
//                 acquiredYm: item.dateValue
//                   ? normalizeYm(item.dateValue)!.replace("-", "")
//                   : "",
//                 licenseNo: item.score ?? "",
//                 note: "",
//               })),
//             }
//           : {}),
  
//         ...(form.portfolios.length > 0
//           ? {
//               portfolios: form.portfolios.map((p, idx) => {
//                 if (p.source === "file") {
//                   const uploadedResult = portfolioFilesResults.find(
//                     (r) => r.originalItem.id === p.id
//                   );
  
//                   if (uploadedResult?.uploadedFile) {
//                     const u = uploadedResult.uploadedFile;
//                     return {
//                       itemType: "FILE" as const,
//                       title: u.originalName,
//                       docName: u.originalName,
//                       url: null,
//                       fileRef: u.filePath,
//                       description: p.note ?? "",
//                       sortOrder: idx + 1,
//                       portfolioFile: {
//                         filePath: u.filePath,
//                         originalName: u.originalName,
//                         storedName: u.storedName,
//                         sizeBytes: u.sizeBytes,
//                         contentType: u.contentType,
//                       },
//                     };
//                   }
  
//                   if (p.filePath) {
//                     const cleanPath = extractS3Path(p.filePath);
//                     const storedName =
//                       (p as any).storedName || cleanPath.split("/").pop() || "";
//                     const sizeBytes = (p as any).sizeBytes || 1048576;
//                     const contentType =
//                       (p as any).contentType ||
//                       (() => {
//                         const extension =
//                           storedName.split(".").pop()?.toLowerCase() || "";
//                         const contentTypeMap: Record<string, string> = {
//                           pdf: "application/pdf",
//                           doc: "application/msword",
//                           docx:
//                             "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//                           xls: "application/vnd.ms-excel",
//                           xlsx:
//                             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//                           ppt: "application/vnd.ms-powerpoint",
//                           pptx:
//                             "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//                           jpg: "image/jpeg",
//                           jpeg: "image/jpeg",
//                           png: "image/png",
//                           gif: "image/gif",
//                           txt: "text/plain",
//                         };
//                         return contentTypeMap[extension] || "application/octet-stream";
//                       })();
  
//                     return {
//                       itemType: "FILE" as const,
//                       title: p.title || `포트폴리오 문서 ${idx + 1}`,
//                       docName: p.title || "",
//                       url: null,
//                       fileRef: cleanPath,
//                       description: p.note ?? "",
//                       sortOrder: idx + 1,
//                       portfolioFile: {
//                         filePath: cleanPath,
//                         originalName: p.title || storedName,
//                         storedName: storedName,
//                         sizeBytes: sizeBytes,
//                         contentType: contentType,
//                       },
//                     };
//                   }
//                 }
  
//                 return {
//                   itemType: "URL" as const,
//                   title: p.title || `포트폴리오 ${idx + 1}`,
//                   docName: p.url || "",
//                   url: p.url,
//                   fileRef: null,
//                   description: p.note ?? "",
//                   sortOrder: idx + 1,
//                   portfolioFile: null,
//                 };
//               }),
//             }
//           : {}),
  
//         ...(form.selfIntro.trim().length > 0
//           ? {
//               selfIntros: [
//                 {
//                   title: "소개",
//                   content: form.selfIntro,
//                   isAi: false,
//                 },
//               ],
//             }
//           : {}),
//       };
  
//       console.log("✅ 이력서 임시 저장 payload:", payload);
//       const result = await createResume(payload);
//       console.log("✅ 이력서 임시저장 성공:", result);
  
//       setIsLoading(false);
//       toast.success("임시 저장되었습니다.");
//     } catch (error: any) {
//       setIsLoading(false);
//       console.error("❌ 이력서 임시 저장 실패:", error);
//       console.error("❌ status:", error?.response?.status);
//       console.error("❌ data:", error?.response?.data);
//       toast.error(error?.response?.data?.msg || "이력서 등록 중 오류가 발생했습니다.");
//       navigate(`/resumes/`);
//     }
//   };
  

//   const isSubmitDisabled = !form.title.trim();

//   const handleOpenCancelModal = () => {
//     setShowCancelModal(true);
//   };

//   const handleConfirmCancel = () => {
//     setShowCancelModal(false);
//     console.log(resumeId);
//     navigate(`/resumes/${resumeId}`);
//   };

//   const handleCancelEdit = () => {
//     setShowCancelModal(false);
//   };

//   if (!isReady) {
//     return (
//       <div className="resume-create-page">
//         <LoadingOverlay isLoading={true} />
//       </div>
//     );
//   }

//   return (
//     <>
//     <div className="resume-create-page edit">
//       <LoadingOverlay
//         isLoading={
//           isLoading ||
//           isRoleLoading ||
//           isHardSkillLoading ||
//           isSoftSkillLoading ||
//           isSelfIntroLoading
//         }
//       />
//       <div className="resume-controls-wrapper">
//         <div className="resume-create-page__status">
//           <div className="resume-detail__actions-left">
//             <span className="default_btn_white" onClick={handleOpenCancelModal}>
//               <img src={Icons.ic_edit_cancle_gray900_20} alt="" />
//               수정 취소
//             </span>
//           </div>
//           <div className="resume-detail__actions-right">
//             <span className="default_btn_white" onClick={handleTempSave}>
//               임시저장
//             </span>
//             <span
//               className={`default_btn_black ${
//                 isSubmitDisabled ? "disabled" : ""
//               }`}
//               onClick={handleSubmit}
//               aria-disabled={isSubmitDisabled}
//             >
//               {isEdit ? "수정 완료" : "작성 완료"}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="resume-create-page__container">
//         <div className="resume-create-page__main">
//           {/* 제목 */}
//           <div className="resume-create-page__section resume-create-page__section--title">
//             <div className="resume-create-page__field">
//               <input
//                 className={`resume-create-page__label ${
//                   errors.title ? "error" : ""
//                 }`}
//                 type="text"
//                 value={form.title}
//                 onChange={(e) =>
//                   setForm((prev) => ({ ...prev, title: e.target.value }))
//                 }
//                 placeholder="이력서 제목을 입력해 주세요. *"
//                 onBlur={() => {
//                   if (!form.title.trim()) {
//                     setErrors((prev) => ({
//                       ...prev,
//                       title: "여기 이력서 제목을 입력해 주세요.",
//                     }));
//                   } else {
//                     setErrors((prev) => ({ ...prev, title: undefined }));
//                   }
//                 }}
//               />
//               {errors.title && (
//                 <span className="resume-create-page__error">{errors.title}</span>
//               )}
//             </div>
//             <AISuggestArea
//               show={showTitleSuggest}
//               items={titleSuggestions}
//               hintText="더 정확한 문장 추천을 위해 (경력과 활동·경험) 항목을 먼저 입력해주세요."
//               onClickSuggest={handleClickTitleSuggest}
//               onClose={handleCloseTitleSuggest}
//               wrapperClassName="resume-suggest__title"
//             />
//           </div>

//           <BasicInfoSection
//             values={form.basic}
//             errors={errors.basic}
//             onChange={updateBasic}
//             onFocusAny={resetBasicErrors}
//             onPhotoFileChange={updatePhotoFile}
//           />

//           <LocationSection
//             isEdit={isEdit}
//             defaultValue={form.location}
//             onChange={updateLocation}
//             error={errors.location}
//           />

//           <CareerSection
//             isEdit={isEdit}
//             value={form.careers}
//             isFreshGraduate={form.isFreshGraduate}
//             onChange={updateCareers}
//             errors={errors.careers}
//             onClearErrors={() =>
//               setErrors((prev) => ({ ...prev, careers: undefined }))
//             }
//           />

//           <EducationSection
//             isEdit={isEdit}
//             values={form.education}
//             errors={errors.education ?? []}
//             onChange={updateEducation}
//             onFocusAny={resetEducationErrors}
//           />

//           <DesiredRoleSection
//             isEdit={isEdit}
//             value={form.desiredRoles}
//             onChange={updateDesiredRoles}
//             error={errors.desiredRoles}
//             aiShow={showRoleSuggest}
//             aiTags={roleSuggestions}
//             onClickAISuggest={handleClickRoleSuggest}
//             onCloseAISuggest={handleCloseRoleSuggest}
//           />

//           <HardSkillSection
//             isEdit={isEdit}
//             value={form.hardSkills}
//             onChange={updateHardSkills}
//             aiShow={showHardSkillSuggest}
//             aiTags={hardSkillSuggestions}
//             onClickAISuggest={handleClickHardSkillSuggest}
//             onCloseAISuggest={handleCloseHardSkillSuggest}
//           />

//           <SoftSkillsSection
//             isEdit={isEdit}
//             value={form.softSkills}
//             onChange={updateSoftSkills}
//             aiShow={showSoftSkillSuggest}
//             aiTags={softSkillSuggestions}
//             onClickAISuggest={handleClickSoftSkillSuggest}
//             onCloseAISuggest={handleCloseSoftSkillSuggest}
//           />

//           <ActivitiesSection
//             isEdit={isEdit}
//             value={form.activities}
//             onChange={updateActivities}
//             errors={errors.activities ?? []}
//             onFocusAny={resetActivityErrors}
//           />

//           <AwardsCertificationsSection
//             isEdit={isEdit}
//             value={form.awardCerts}
//             onChange={updateAwardCerts}
//             errors={errors.awardCerts ?? []}
//             onFocusAny={resetAwardCertErrors}
//           />

//           <PortfolioDocumentsSection
//             isEdit={isEdit}
//             value={form.portfolios}
//             onChange={updatePortfolios}
//             errors={errors.portfolios ?? []}
//             onFocusAny={resetPortfolioErrors}
//           />

//           <SelfIntroductionSection
//             isEdit={isEdit}
//             value={form.selfIntro}
//             onChange={updateSelfIntro}
//             aiShow={showSelfIntroSuggest}
//             aiItems={selfIntroSuggestions}
//             onClickAISuggest={handleClickSelfIntroSuggest}
//             onCloseAISuggest={handleCloseSelfIntroSuggest}
//           />

//           <MockInterviewAnalysisSection />
//         </div>

//         <ResumeSidebar
//           statusMap={sidebarStatus}
//           isDefault={isDefaultResume}
//           onToggleDefault={setIsDefaultResume}
//         />
//       </div>

//       <Modal
//         open={showCancelModal}
//         title="수정사항을 저장하지 않고 취소하시겠습니까?"
//         confirmText="예"
//         confirmClassName="btn_w_full default_btn_black"
//         cancelText="계속 작성"
//         cancelClassName="btn_w_full default_btn_white"
//         onConfirm={handleConfirmCancel}
//         onClose={handleCancelEdit}
//       />
//     </div>
//   </>
//   );
// }
