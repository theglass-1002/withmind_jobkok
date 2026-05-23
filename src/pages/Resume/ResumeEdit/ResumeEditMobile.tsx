import { logout } from '@/api/auth/auth.api';
import { createResume, fetchResumeDetail, fetchResumeHardSkillSuggestions, fetchResumePositionSuggestions, fetchResumeSelfIntro, fetchResumeSoftSkillSuggestions, fetchResumeTitleSuggestions, updateResume } from '@/api/resume/resume.api';
import LoadingOverlay from '@/shared/components/loading/LoadingOverlay';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import Switch from "react-switch";
import Tabs from "@/shared/components/tabs/Tabs";
import { Storage } from "@/shared/utils/StorageManager";
import { BasicErrors, BasicInfo, convertBirth, formatPhoneNumber, tabItems, useStickyTabs } from '@/shared/utils/util';
import AISuggestArea from '../ResumeAISuggest';
import M_LocationSection, { LocationValue } from '../ResumeCreate/LocationSection/M_LocationSection';
import M_CareerSection, { CareerInfo } from '../ResumeCreate/CareerSection/M_CareerSection';
import M_EducationSection, { Education } from '../ResumeCreate/EducationSection/M_EducationSection';
import M_ActivitiesSection, { ActivityErrors, ActivityItem } from '../ResumeCreate/ActivitiesSection/M_ActivitiesSection';
import M_AwardsCertificationsSection, { AwardsCertItem } from '../ResumeCreate/AwardsCertificationsSection/M_AwardsCertificationsSection';
import M_PortfolioDocumentsSection, { PortfolioDocItem } from '../ResumeCreate/PortfolioDocumentsSection/M_PortfolioDocumentsSection';
import { CreateResumeRequest, extractS3Path, mapAwardsKindToCategoryLabel, mapEducationStatusToGraduatedYn, mapGraduatedYnToLabel, normalizeYm, ProfilePhotoFile, ResumeDetailResponse, ResumeHardSkillRequest, ResumePositionRequest, ResumeSelfIntroRequest, ResumeTitleRequest } from '@/api/resume/resume.types';
import M_BasicInfoSection from '../ResumeCreate/BasicInfoSection/M_BasicInfoSection';
import M_DesiredRoleSection from '../ResumeCreate/DesiredRoleSection/M_DesiredRoleSection';
import M_HardSkillSection from '../ResumeCreate/HardSkillSection/M_HardSkillSection';
import M_SoftSkillsSection from '../ResumeCreate/SoftSkillsSection/M_SoftSkillsSection';
import M_SelfIntroductionSection from '../ResumeCreate/SelfIntroductionSection/M_SelfIntroductionSection';
import M_MockInterviewAnalysisSection from '../ResumeCreate/MockInterviewAnalysisSection/M_MockInterviewAnalysisSection';
import { AwardsCertErrors, PortfolioErrors } from '../M_ResumeCreate';
import Modal from '@/shared/components/modal/Modal';
import { uploadPhotoFile } from '@/api/fileUpload.api';
import { useLayoutContext } from "@/app/LayoutContext";

type FormState = {
    title: string;
    basic: BasicInfo;
    location: LocationValue;
    careers: CareerInfo[];
    isFreshGraduate: boolean;
    education: Education[];
    photoFile?: File | null;
    profilePhotoFileMeta?: ProfilePhotoFile | null;
    desiredRoles: string[];
    hardSkills: string[];
    softSkills: string[];
    activities: ActivityItem[];
    awardCerts: AwardsCertItem[];
    portfolios: PortfolioDocItem[];
    selfIntro: string;
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
  

export default function ResumeEditMobile() {
    const [activeTab, setActiveTab] = useState("title");
    const { actionType, resetAction } = useLayoutContext();
    const navigate = useNavigate();
    const { resumeId } = useParams<{ resumeId: string }>();
    const isEdit = !!resumeId;
    const [isReady, setIsReady] = useState(!isEdit);
    const [isLoading, setIsLoading] = useState(false);
    const [isDefaultResume, setIsDefaultResume] = useState(false);
    const [selectedQzGroup, setSelectedQzGroup] = useState<number | null>(null);
    const [initialMockInterview, setInitialMockInterview] = useState<{
      qzGroup: number;
      score: number | null;
      job: string | null;
      date: string | null;
      resumeTitle: string;
    } | null>(null);
    const [showDefaultModal, setShowDefaultModal] = useState(false); // 기본 이력서 설정 모달
    const [showExitWithoutSavingModal, setShowExitWithoutSavingModal] = useState(false);
  
    const [form, setForm] = useState<FormState>(initial);
    const [errors, setErrors] = useState<{
        basic: BasicErrors;
        title?: string;
        location?: string;
        careers?: string;
        education?:string;
        desiredRoles?: string;
        hardSkills?:string;
        softSkills?:string;
        activities?: ActivityErrors[];
        awardCerts?: AwardsCertErrors[];
        portfolios?: PortfolioErrors[];
        selfIntro?:string;
      }>({
        basic: {},
        activities: [],
        awardCerts: [],
        portfolios: [],
      });
    const isTabsSticky = useStickyTabs(
        "resume__create-section--title",
        ".default_tabs",
        ".page-header"
      );
      
    //AI추천
    const [showTitleSuggest, setShowTitleSuggest] = useState(false);
    const [showRoleSuggest, setShowRoleSuggest] = useState(false);
    const [showHardSkillSuggest, setShowHardSkillSuggest] = useState(false);
    const [showSoftSkillSuggest, setShowSoftSkillSuggest] = useState(false);
    const [showSelfIntroSuggest, setShowSelfIntroSuggest] = useState(false);
  
    
    const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
    const [roleSuggestions, setRoleSuggestions] = useState<string[]>([]);
    const [hardSkillSuggestions, setHardSkillSuggestions] = useState<string[]>([]);
    const [softSkillSuggestions, setSoftSkillSuggestions] = useState<string[]>([]);
    const [selfIntroSuggestions, setSelfIntroSuggestions] = useState<string[]>([]);
  

   
    useEffect(() => {
      if (actionType === "EXIT_WITHOUT_SAVING") {
        setShowExitWithoutSavingModal(true);

       
        resetAction();
      }
  }, [actionType, resetAction]);


  // 상세 조회
  useEffect(() => {
      if (!isEdit || !resumeId) {
        setIsReady(true);
        return;
      }
  
      const loadDetail = async () => {
        try {
          setIsLoading(true);
          const data = await fetchResumeDetail(Number(resumeId));
          console.log("📌 resume detail", data);
          const mapped = mapDetailToFormState(data);
          console.log("📌 mapped form", mapped);
          setForm(mapped);
          setIsDefaultResume(data.isDefault);

          if (data.qzGroup) {
            setSelectedQzGroup(data.qzGroup);
            setInitialMockInterview({
              qzGroup: data.qzGroup,
              score: data.interviewScore ?? null,
              job: data.interviewJob ?? data.interviewJobGroup ?? null,
              date: data.interviewDate ?? null,
              resumeTitle: data.title,
            });
          }

          setIsReady(true);

          const brokenCount = mapped.portfolios.filter((p) => {
            const anyP = p as any;
            return (
              p.source === "file" &&
              !anyP.file &&
              !anyP.filePath?.toString().trim() &&
              !anyP.fileIdx &&
              !!p.title?.trim()
            );
          }).length;
          if (brokenCount > 0) {
            toast.warning(
              `기존 포트폴리오 ${brokenCount}건의 파일 정보를 불러올 수 없습니다. 새 파일을 업로드하거나 항목을 삭제한 뒤 저장해 주세요.`
            );
          }
        } catch (err: any) {
          if (err.code === 999) {
            console.error("❌ 이력서 상세 조회 실패:", err);
            setIsReady(true);
            console.log("로그인만료");
            logout();
            navigate("/login");
          } else {
            console.error("❌ 이력서 상세 조회 실패:", err);
            toast.error("이력서 정보를 불러오지 못했습니다.");
            setIsReady(true);
          }
        } finally {
          setIsLoading(false);
        }
      };
  
      loadDetail();
    }, [isEdit, resumeId, navigate]);
  

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 상세 응답 → FormState 매핑
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const mapCategoryToKind = (category?: string): AwardsCertItem["kind"] => {
      switch (category) {
        case "Certification":
          return "Certification";
        case "LanguageTest":
          return "LanguageTest";
        case "Award":
          return "Award";
        case "Etc":
          return "Etc";
        default:
          return "Etc";
      }
    };

      const mapDetailToFormState = (data: ResumeDetailResponse): FormState => {
        return {
          title: data.title ?? "",
          basic: {
            name: data.name ?? "",
            birth: data.birth ?? "",
            gender:
              data.gender === "M" ? "male" : data.gender === "W" ? "female" : null,
            email: data.email ?? "",
            phone: data.phone ?? "",
            photoUrl: data.profilePhotoFile?.filePath ?? "",
          },

          // 추가: 서버에서 내려준 프로필 사진 메타 저장 (수정 시 기존 사진 유지용)
          profilePhotoFileMeta: data.profilePhotoFile
            ? {
                ...data.profilePhotoFile,
                filePath: extractS3Path(data.profilePhotoFile.filePath),
              }
            : null,

          location: {
            nationwide: (data.regionList?.length ?? 0) === 0,
            selectedCodes: data.regionList ?? [],
          },
          careers: (data.careerList ?? []).map((c) => ({
            company_name: c.companyName ?? "",
            employmentType: c.employmentType ?? "",
            startDate: c.startYm ?? "",
            endDate: c.endYm ?? "",
            isCurrent: c.employedYn === "Y",
            role: c.roleName ?? "",
            position: c.positionName ?? "",
            summary: c.workAndResult ?? "",
          })),
          isFreshGraduate: (data.careerList ?? []).length === 0,
          education: (data.educationList ?? []).map((e) => ({
            school_name: e.schoolName ?? "",
            major_degree: e.majorDegree ?? "",
            startDate: e.startYm ?? "",
            endDate: e.endYm ?? "",
            status: mapGraduatedYnToLabel(e.graduatedYn),
          })),
          photoFile: null,
          desiredRoles: data.jobList ?? [],
          hardSkills: data.hardSkillList ?? [],
          softSkills: data.softSkillList ?? [],
          activities: (data.activityList ?? []).map((a) => ({
            category: a.category ?? "",
            activityName: a.activityTitle ?? "",
            startDate: a.startYm ?? "",
            endDate: a.endYm ?? "",
            summary: a.description ?? "",
          })),
          awardCerts: (data.licenseList ?? []).map((l) => ({
            kind: mapCategoryToKind(l.category),
            title: l.name ?? "",
            issuer: l.issuer ?? "",
            dateValue: l.acquiredYm ?? "",
            score: l.score ?? "",
          })),
          portfolios: (data.portfolioList ?? []).map((p, idx) => ({
            id: String(p.order ?? idx),
            source: p.itemType === "FILE" ? "file" : "url",
            title: p.title ?? "",
            url: p.url ?? "",
            note: p.description ?? "",
            file: null,
            filePath: p.filePath ? extractS3Path(p.filePath) : null,
            fileIdx: p.fileIdx ?? null,
            sizeBytes: (p as any).sizeBytes ?? 0,
            contentType: (p as any).contentType ?? "",
            storedName: (p as any).storedName ?? "",
          } as any)),
          selfIntro: (data.selfIntroList && data.selfIntroList[0]?.content) || "",
        };
      };

    const handleClickTitleSuggest = async () => {
        try {
          if (isLoading) return;
      
          if (!form.desiredRoles || form.desiredRoles.length === 0) {
            toast.info("희망 직무를 1개 이상 입력해 주세요.");
            return;
          }
      
          setIsLoading(true);
      
          const position = form.desiredRoles.join(",");
      
          const experiences = form.careers
            .map((c) => {
              const base = `${c.company_name ?? ""} / ${c.role ?? ""} (${c.position ?? ""})`;
              const extra = c.summary ? ` / ${c.summary}` : "";
              return base + extra;
            })
            .join("\n");
      
          const activities = form.activities
            .map((a) => {
              const base = `${a.category ?? ""} / ${a.activityName ?? ""}`;
              const extra = a.summary ? ` / ${a.summary}` : "";
              return base + extra;
            })
            .join("\n");
      
          const awards = form.awardCerts
            .map((aw) => `${aw.kind ?? ""} / ${aw.title ?? ""}`)
            .join("\n");
      
          const payload: ResumeTitleRequest = {
            position,
            experiences,
            activities,
            awards,
          };
      
          console.log("AI 제목 추천 payload:", payload);
          
          const titles = await fetchResumeTitleSuggestions(payload);
          console.log("AI 제목 추천 결과:", titles);
      
          if (!titles || titles.length === 0) {
            toast.info(
              "추천할 제목이 없습니다. [희망 직무]와 [경력] 내용을 조금 더 구체적으로 작성해 보세요."
            );
            return;
          }
      
          setTitleSuggestions(titles);
          setShowTitleSuggest(true);
        } catch (error: any) {
          console.error("AI 제목 추천 실패:", error);
          toast.info(
            "추천할 제목이 없습니다. [희망 직무]와 [경력] 내용을 조금 더 구체적으로 작성해 보세요."
          );
        } finally {
          setIsLoading(false);
        }
      };
      const handleCloseAISuggest = () => setShowTitleSuggest(false);
    

    const handleClickRoleSuggest = async () => {
        console.log('ai 희망직무 추천 클릭',form);
     
        try {
          if (isLoading) return;
    
          if (!form.education || form.education.length === 0) {
            toast.info("학력 항목을 1개 이상 입력해 주세요.");
            return;
          }
    
          setIsLoading(true);
    
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
          setIsLoading(false);
        }
      };
    
    const handleCloseRoleSuggest = () => setShowRoleSuggest(false);


    const handleClickHardSkillSuggest = async () => {
        try {
          if (isLoading) return;
    
          if (!form.desiredRoles || form.desiredRoles.length === 0) {
            toast.info("희망 직무를 1개 이상 입력해 주세요.");
            return;
          }
          setIsLoading(true);
    
          const position = form.desiredRoles.join(","); // or ", "
          
          const experiences = form.careers
            .map((c) => {
              const base = `${c.company_name} / ${c.role} (${c.position})`;
              const extra = c.summary ? ` / ${c.summary}` : "";
              return base + extra;
            })
            .join("\n");
    
          const activities = form.activities
            .map((a) => {
              const base = `${a.category ?? ""} / ${a.activityName ?? ""}`;
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
          setIsLoading(false);
        }
      };
    
    const handleCloseHardSkillSuggest = () => setShowHardSkillSuggest(false);
    
    const handleClickSoftSkillSuggest = async () => {
        try {
          if (isLoading) return;
    
          if (!form.desiredRoles || form.desiredRoles.length === 0) {
            toast.info("희망 직무를 1개 이상 입력해 주세요.");
            return;
          }
          setIsLoading(true);
    
          const position = form.desiredRoles.join(","); // or ", "
          
          const experiences = form.careers
            .map((c) => {
              const base = `${c.company_name} / ${c.role} (${c.position})`;
              const extra = c.summary ? ` / ${c.summary}` : "";
              return base + extra;
            })
            .join("\n");
    
          const activities = form.activities
            .map((a) => {
              const base = `${a.category ?? ""} / ${a.activityName ?? ""}`;
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
          setIsLoading(false);
        }
      };
    
    const handleCloseSoftSkillSuggest = () => setShowSoftSkillSuggest(false);
    
    const handleClickSelfIntroSuggest = async () => {
        try {
          if (isLoading) return;
      
          if (!form.desiredRoles || form.desiredRoles.length === 0) {
            toast.info("희망 직무를 1개 이상 입력해 주세요.");
            return;
          }
    
          setIsLoading(true);
      
          const position = form.desiredRoles.join(",");
      
          const experiences = form.careers
            .map((c) => {
              const base = `${c.company_name ?? ""} / ${c.role ?? ""} (${c.position ?? ""})`;
              const extra = c.summary ? ` / ${c.summary}` : "";
              return base + extra;
            })
            .join("\n");
      
          const activities = form.activities
            .map((a) => {
              const base = `${a.category ?? ""} / ${a.activityName ?? ""}`;
              const extra = a.summary ? ` / ${a.summary}` : "";
              return base + extra;
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
      
          console.log("AI 자소서 추천 payload:", payload);
      
          const selfIntro = await fetchResumeSelfIntro(payload);
          console.log("AI 자소서 추천 결과:", selfIntro);
      
          if (!selfIntro.trim()) {
            toast.info(
              "추천할 자기소개 문장이 없습니다. [희망 직무]와 [경력] 내용을 조금 더 구체적으로 작성해 보세요."
            );
            return;
          }
      
          setSelfIntroSuggestions([selfIntro]);
          setShowSelfIntroSuggest(true);
        } catch (error: any) {
          console.error("AI 자기소개 추천 실패:", error);
          toast.info(
            "추천할 문장이 없습니다. [희망 직무]와 [경력] 내용을 조금 더 구체적으로 작성해 보세요."
          );
        } finally {
          setIsLoading(false);
        }
      };
    
    const handleCloseSelfIntroSuggest = () => setShowSelfIntroSuggest(false);
    
    const handleTempSave = async () => {
        try {
          if (!form.title.trim()) {
            setErrors((prev) => ({
              ...prev,
              title: "이력서 제목을 입력해 주세요.",
            }));
            toast.error("필수 항목을 먼저 입력해 주세요.");
            return;
          }

          // 손상 포트폴리오 항목 체크
          const hasBrokenPortfolio = form.portfolios.some((p) => {
            const anyP = p as any;
            return (
              p.source === "file" &&
              !anyP.file &&
              !anyP.filePath?.toString().trim() &&
              !anyP.fileIdx &&
              !!p.title?.trim()
            );
          });
          if (hasBrokenPortfolio) {
            toast.error(
              "기존 포트폴리오 파일 정보를 불러올 수 없습니다. 해당 항목을 삭제하거나 새 파일을 업로드한 뒤 저장해 주세요."
            );
            return;
          }

          setIsLoading(true);

          const profilePhotoFile = await handleFileSubmit();
          const portfolioFilesResults = await handlePortfolioFilesSubmit();

          const payload: CreateResumeRequest = {
            userIdx: Storage.getUserIdx(),
            isDefault: 0,
            temp: "Y",
            ...(selectedQzGroup != null ? { qzGroup: selectedQzGroup } : {}),

            title: form.title,
            name: form.basic.name,
            email: form.basic.email,
            gender: form.basic.gender === "male" ? "M" : "W",
            phone: formatPhoneNumber(form.basic.phone),
            birth: convertBirth(form.basic.birth),

            ...(profilePhotoFile
              ? { profilePhotoFile }
              : form.profilePhotoFileMeta
              ? { profilePhotoFile: form.profilePhotoFileMeta }
              : {}),

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
              endYm: normalizeYm(edu.endDate),
              majorDegree: edu.major_degree,
              graduatedYn: mapEducationStatusToGraduatedYn(edu.status),
            })),

            jobs: form.desiredRoles,
            hardSkills: form.hardSkills,
            softSkills: form.softSkills,

            ...(form.activities.length > 0
              ? {
                  activities: form.activities.map((act) => ({
                    category: act.category ?? "교내활동",
                    activityTitle: act.activityName,
                    startYm: act.startDate ? normalizeYm(act.startDate) : "1999-09",
                    endYm: act.endDate ? normalizeYm(act.endDate) : "1999-09",
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
                      ? normalizeYm(item.dateValue)?.replace("-", "") ?? ""
                      : "",
                    licenseNo: item.score ?? "",
                    note: "",
                  })),
                }
              : {}),

            ...(() => {
              const filtered = form.portfolios.filter((p) => {
                const anyP = p as any;
                if (p.source === "file") {
                  return (
                    !!anyP.file ||
                    !!anyP.filePath?.toString().trim() ||
                    !!anyP.fileIdx
                  );
                }
                return !!p.url?.trim();
              });
              if (filtered.length === 0) return {};
              return {
                portfolios: filtered.map((p, idx) => {
                  if (p.source === "file") {
                    const uploadedResult = portfolioFilesResults.find(
                      (r) => r.originalItem.id === p.id
                    );

                    if (uploadedResult?.uploadedFile) {
                      const u = uploadedResult.uploadedFile;
                      return {
                        itemType: "FILE" as const,
                        title: u.originalName,
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

                    if (p.filePath) {
                      const cleanPath = extractS3Path(p.filePath);
                      const storedName =
                        (p as any).storedName || cleanPath.split("/").pop() || "";
                      const sizeBytes = (p as any).sizeBytes || 1048576;
                      const contentType =
                        (p as any).contentType ||
                        (() => {
                          const extension =
                            storedName.split(".").pop()?.toLowerCase() || "";
                          const contentTypeMap: Record<string, string> = {
                            pdf: "application/pdf",
                            doc: "application/msword",
                            docx:
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            xls: "application/vnd.ms-excel",
                            xlsx:
                              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            ppt: "application/vnd.ms-powerpoint",
                            pptx:
                              "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                            jpg: "image/jpeg",
                            jpeg: "image/jpeg",
                            png: "image/png",
                            gif: "image/gif",
                            txt: "text/plain",
                          };
                          return contentTypeMap[extension] || "application/octet-stream";
                        })();

                      return {
                        itemType: "FILE" as const,
                        title: p.title || `포트폴리오 문서 ${idx + 1}`,
                        docName: p.title || "",
                        url: null,
                        fileRef: cleanPath,
                        fileIdx: (p as any).fileIdx ?? null,
                        description: p.note ?? "",
                        sortOrder: idx + 1,
                        portfolioFile: {
                          fileIdx: (p as any).fileIdx ?? null,
                          filePath: cleanPath,
                          originalName: p.title || storedName,
                          storedName: storedName,
                          sizeBytes: sizeBytes,
                          contentType: contentType,
                        },
                      } as any;
                    }
                  }

                  return {
                    itemType: "URL" as const,
                    title: p.title || `포트폴리오 ${idx + 1}`,
                    docName: p.url || "",
                    url: p.url,
                    fileRef: null,
                    description: p.note ?? "",
                    sortOrder: idx + 1,
                    portfolioFile: null,
                  };
                }),
              };
            })(),

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

          console.log("✅ 모바일 이력서 임시 저장 payload:", payload);
          const result = await updateResume(Number(resumeId), payload);
          console.log("✅ 모바일 이력서 임시저장 성공:", result);

          toast.success("임시 저장되었습니다.");
          navigate("/resumes");
        } catch (error: any) {
          console.error("❌ 모바일 이력서 임시 저장 실패:", error);
          console.error("❌ status:", error?.response?.status);
          console.error("❌ data:", error?.response?.data);
          toast.error(
            error?.response?.data?.msg || "이력서 임시 저장 중 오류가 발생했습니다."
          );
        } finally {
          setIsLoading(false);
        }
      };
    
 
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


    //이동 함수
    const handleConfirmExitWithoutSaving = () => {
      navigate(`/resumes/${resumeId}`);
    };
    
    const handleCancelExitWithoutSaving = () => {
      setShowExitWithoutSavingModal(false);
    };

    //상태업데이트
    const isSubmitDisabled =
    !form.title.trim() ||
    (!form.location.nationwide && form.location.selectedCodes.length === 0);


    const updateBasic = (patch: Partial<BasicInfo>) =>
        setForm((prev) => ({ ...prev, basic: { ...prev.basic, ...patch } }));
   
    const updatePhotoFile = (file: File | null) =>
        setForm((prev) => ({ ...prev, photoFile: file }));
    
    
    const updateLocation = (patch: Partial<LocationValue>) =>
        setForm((prev) => ({ ...prev, location: { ...prev.location, ...patch } }));
    const updateCareer = (newList: CareerInfo[]) =>
        setForm((prev) => ({ ...prev, careers: newList }));
    
    const updateIsFreshGraduate = (checked: boolean) =>
        setForm((prev) => ({ ...prev, isFreshGraduate: checked }));
    
    const updateEducation = (newList: Education[]) =>
        setForm((prev) => ({ ...prev, education: newList }));
    const updateDesiredRoles = (roles: string[]) => {
        setForm((prev) => ({ ...prev, desiredRoles: roles }));
        if (roles.length > 0) {
          setErrors((prev) => ({ ...prev, desiredRoles: undefined }));
        }
      };
      const updateHardSkills = (hardSkills: string[]) => {
        setForm((prev) => ({ ...prev, hardSkills: hardSkills }));
        if (hardSkills.length > 0) {
          setErrors((prev) => ({ ...prev, hardSkills: undefined }));
        }
      };  
      const updateSoftSkills = (softSkills: string[]) => {
        setForm((prev) => ({ ...prev, softSkills: softSkills }));
        if (softSkills.length > 0) {
          setErrors((prev) => ({ ...prev, softSkills: undefined }));
        }
      };
      const updateActivities = (newList: ActivityItem[]) =>
        setForm((prev) => ({ ...prev, activities: newList }));
      
      const updateAwardsCertifications = (newList: AwardsCertItem[]) =>
        setForm((prev) => ({ ...prev, awardCerts: newList }));
  
      const updatePortfolioDocuments = (newList: PortfolioDocItem[]) =>
        setForm((prev) => ({ ...prev, portfolios: newList }));
      
      const updateSelfIntro = (newValue: string) =>
        setForm((prev) => ({ ...prev, selfIntro: newValue }));
    
      const handleConfirmDefaultResume = () => {
        setIsDefaultResume(true);
        setShowDefaultModal(false);
        toast.success("기본 이력서로 설정되었습니다.");
      };

      const handleCancelDefaultResume = () => {
        setShowDefaultModal(false);
        // 스위치 값은 그대로 false 유지
      };
      


    
    //api 전송

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
        let isValid = true;
        console.log("필수입력체크");
      
        const nextErr: typeof errors = {
          basic: {} as BasicErrors,
          location:"",
          careers: "",
          education: "",
          desiredRoles:""
        };
      
        const isTitleEmpty = !form.title?.trim();
      
        const isLocationEmpty =
          !form.location?.nationwide &&
          (!form.location?.selectedCodes || form.location.selectedCodes.length === 0);
      
        const isCareersEmpty =
          !form.isFreshGraduate && (!form.careers || form.careers.length === 0);
      
        const isEducationEmpty = !form.education || form.education.length === 0;
      
        const isDesiredRolesEmpty =
          !form.desiredRoles || form.desiredRoles.length === 0;
      
        console.log("title 공백 여부:", isTitleEmpty);
        console.log("location 공백 여부:", isLocationEmpty);
        console.log("careers 공백 여부:", isCareersEmpty);
        console.log("education 공백 여부:", isEducationEmpty);
        console.log("desiredRoles 공백 여부:", isDesiredRolesEmpty);
      
        // 제목
        if (isTitleEmpty) {
          nextErr.title = "이력서 제목을 입력해 주세요.";
          isValid = false;
        }
      
        // 근무지역
        if (isLocationEmpty) {
          nextErr.location = "희망 근무 지역을 추가해 주세요.";
          isValid = false;
        }
     
      
        // 경력 (신입이 아닐 때만)
        if (isCareersEmpty) {
          nextErr.careers = "경력을 추가해 주세요.";
          isValid = false;
        }
        // 학력
        if (isEducationEmpty) {
          nextErr.education = "학력을 추가해 주세요.";
          isValid = false;
        }
      
        // 희망직무
        if (isDesiredRolesEmpty) {
          nextErr.desiredRoles = "희망 직무를 추가해 주세요.";
          isValid = false;
        }
        // nextErr.title="";
        // nextErr.location="";
        // nextErr.careers ="";
        setErrors(nextErr);
      
        return isValid;
      };
    

      const handleSubmit = async () => {
        const getPortfolioContentType = (item: any) => {
          if (item?.contentType) return item.contentType;
      
          const name = (item?.title || item?.storedName || "").toLowerCase();
      
          if (name.endsWith(".pdf")) return "application/pdf";
          if (name.endsWith(".pptx")) {
            return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
          }
          if (name.endsWith(".docx")) {
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          }
          if (name.endsWith(".xlsx")) {
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          }
      
          return "application/octet-stream";
        };
      
        try {
          console.log("form", form);
      
          const ok = validate();
          if (!ok) {
            toast.error("필수 항목을 먼저 입력해 주세요.");
            return;
          }

          // 손상 포트폴리오 항목 체크
          const hasBrokenPortfolio = form.portfolios.some((p) => {
            const anyP = p as any;
            return (
              p.source === "file" &&
              !anyP.file &&
              !anyP.filePath?.toString().trim() &&
              !anyP.fileIdx &&
              !!p.title?.trim()
            );
          });
          if (hasBrokenPortfolio) {
            toast.error(
              "기존 포트폴리오 파일 정보를 불러올 수 없습니다. 해당 항목을 삭제하거나 새 파일을 업로드한 뒤 저장해 주세요."
            );
            return;
          }

          setIsLoading(true);

          const profilePhotoFile = await handleFileSubmit();
          const portfolioFilesResults = await handlePortfolioFilesSubmit();
      
          const payload: CreateResumeRequest = {
            userIdx: Storage.getUserIdx(),
            isDefault: isDefaultResume ? 1 : 0,
            temp: "N",
            ...(selectedQzGroup != null ? { qzGroup: selectedQzGroup } : {}),

            title: form.title,
            name: form.basic.name,
            email: form.basic.email,
            gender: form.basic.gender === "male" ? "M" : "W",
            phone: formatPhoneNumber(form.basic.phone),
            birth: convertBirth(form.basic.birth),
      
            ...(profilePhotoFile
              ? { profilePhotoFile }
              : form.profilePhotoFileMeta
              ? { profilePhotoFile: form.profilePhotoFileMeta }
              : {}),
      
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
              endYm: normalizeYm(edu.endDate),
              majorDegree: edu.major_degree,
              graduatedYn: mapEducationStatusToGraduatedYn(edu.status),
            })),
      
            jobs: form.desiredRoles,
            hardSkills: form.hardSkills,
            softSkills: form.softSkills,
      
            ...(form.activities.length > 0
              ? {
                  activities: form.activities.map((act) => ({
                    category: act.category ?? "교내활동",
                    activityTitle: act.activityName,
                    startYm: act.startDate ? normalizeYm(act.startDate) : "1999-09",
                    endYm: act.endDate ? normalizeYm(act.endDate) : "1999-09",
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
                      ? normalizeYm(item.dateValue)?.replace("-", "") ?? ""
                      : "",
                    licenseNo: item.score ?? "",
                    note: "",
                  })),
                }
              : {}),
      
              ...(() => {
                const filtered = form.portfolios.filter((p) => {
                  const anyP = p as any;
                  if (p.source === "file") {
                    // 백엔드가 fileRef null을 거부하므로 file/filePath/fileIdx 중 하나는 있어야 페이로드에 포함
                    return (
                      !!anyP.file ||
                      !!anyP.filePath?.toString().trim() ||
                      !!anyP.fileIdx
                    );
                  }
                  return !!p.url?.trim();
                });
                if (filtered.length === 0) return {};
                return {
                  portfolios: filtered.map((p, idx) => {
                    if (p.source === "file") {
                      const uploadedResult = portfolioFilesResults.find(
                        (r) => r.originalItem.id === p.id
                      );

                      if (uploadedResult?.uploadedFile) {
                        const u = uploadedResult.uploadedFile;
                        return {
                          itemType: "FILE" as const,
                          title: u.originalName,
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

                      if (p.filePath) {
                        const cleanPath = extractS3Path(p.filePath);
                        const storedName =
                          (p as any).storedName || cleanPath.split("/").pop() || "";
                        const sizeBytes = (p as any).sizeBytes || 1048576;
                        const contentType =
                          (p as any).contentType ||
                          (() => {
                            const extension =
                              storedName.split(".").pop()?.toLowerCase() || "";
                            const contentTypeMap: Record<string, string> = {
                              pdf: "application/pdf",
                              doc: "application/msword",
                              docx:
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                              xls: "application/vnd.ms-excel",
                              xlsx:
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                              ppt: "application/vnd.ms-powerpoint",
                              pptx:
                                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                              jpg: "image/jpeg",
                              jpeg: "image/jpeg",
                              png: "image/png",
                              gif: "image/gif",
                              txt: "text/plain",
                            };
                            return contentTypeMap[extension] || "application/octet-stream";
                          })();

                        return {
                          itemType: "FILE" as const,
                          title: p.title || `포트폴리오 문서 ${idx + 1}`,
                          docName: p.title || "",
                          url: null,
                          fileRef: cleanPath,
                          fileIdx: (p as any).fileIdx ?? null,
                          description: p.note ?? "",
                          sortOrder: idx + 1,
                          portfolioFile: {
                            fileIdx: (p as any).fileIdx ?? null,
                            filePath: cleanPath,
                            originalName: p.title || storedName,
                            storedName: storedName,
                            sizeBytes: sizeBytes,
                            contentType: contentType,
                          },
                        } as any;
                      }

                    }

                    return {
                      itemType: "URL" as const,
                      title: p.title || `포트폴리오 ${idx + 1}`,
                      docName: p.url || "",
                      url: p.url,
                      fileRef: null,
                      description: p.note ?? "",
                      sortOrder: idx + 1,
                      portfolioFile: null,
                    };
                  }),
                };
              })(),
      
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
      
          console.log("결과", payload);
      
          const res = await updateResume(Number(resumeId), payload);
      
          console.log("이력서 수정", res);
          console.log("✅ 이력서 등록 Payload:", payload);
      
          toast.success("이력서가 수정되었습니다!");
          navigate(`/resumes/${resumeId}`);
        } catch (error) {
          console.error("❌ 이력서 수정 실패:", error);
          console.error("❌ status:", error?.response?.status);
          console.error("❌ data:", error?.response?.data);
          toast.error(error?.response?.data?.msg || "이력서 수정 중 오류가 발생했습니다.");
        } finally {
          setIsLoading(false);
        }
      };
    
      
    return (
        <div className="resume-create-page mobile">
        <LoadingOverlay
         isLoading={
           isLoading 
   
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
               items={titleSuggestions}
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
               onPhotoFileChange={updatePhotoFile}
             />
           <M_LocationSection
             defaultValue={form.location}
             errors={errors.location}
             onChange={updateLocation}
             isEdit={isEdit}
           />
          <M_CareerSection
             values={form.careers}
             errors={errors.careers}
             onChange={updateCareer}
             onNewcomerChange={updateIsFreshGraduate}
             isEdit={isEdit}
           />
           <M_EducationSection
             values={form.education}
             errors={errors.education}
             onChange={updateEducation}
             
    
           />
          <M_DesiredRoleSection
               value={form.desiredRoles}
               onChange={updateDesiredRoles}
               error={errors.desiredRoles}
               aiShow={showRoleSuggest}
               aiTags={roleSuggestions}
               onClickAISuggest={handleClickRoleSuggest}
               onCloseAISuggest={handleCloseRoleSuggest}
               isEdit={isEdit}
          />
          <M_HardSkillSection
           value={form.hardSkills}
           onChange={updateHardSkills}
           error={errors.hardSkills}
           aiShow={showHardSkillSuggest}
           aiTags={hardSkillSuggestions}
           onClickAISuggest={handleClickHardSkillSuggest}
           onCloseAISuggest={handleCloseHardSkillSuggest}
           isEdit={isEdit}
         />
          <M_SoftSkillsSection
             value={form.softSkills}
             onChange={updateSoftSkills}
             error={errors.softSkills}
             aiShow={showSoftSkillSuggest}
             aiTags={softSkillSuggestions}
             onClickAISuggest={handleClickSoftSkillSuggest}
             onCloseAISuggest={handleCloseSoftSkillSuggest}
             isEdit={isEdit}
          
          />
          <M_ActivitiesSection
             value={form.activities}
             errors={errors.activities ?? []}
             onChange={updateActivities}
             isEdit={isEdit}
            
          />
          <M_AwardsCertificationsSection
             value={form.awardCerts}
             errors={errors.awardCerts ?? []}
             onChange={updateAwardsCertifications}
             isEdit={isEdit}
          
          />
          <M_PortfolioDocumentsSection
          value={form.portfolios}
          errors={errors.portfolios??[]}
          onChange={updatePortfolioDocuments}
          isEdit={isEdit}
          />
           <M_SelfIntroductionSection
             value={form.selfIntro}
             onChange={updateSelfIntro}
             error={!!errors.selfIntro}
             aiShow={showSelfIntroSuggest}
             aiSuggestions={selfIntroSuggestions}
             onClickAISuggest={handleClickSelfIntroSuggest}
             onCloseAISuggest={handleCloseSelfIntroSuggest}
             isEdit={isEdit}
           />
          <M_MockInterviewAnalysisSection
            onPickedChange={setSelectedQzGroup}
            initialPicked={initialMockInterview}
          />
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
       <Modal
          open={showExitWithoutSavingModal}
          title={`수정사항을 저장하지 않고\n나가시겠습니까?`}
          confirmText="예"
          confirmClassName="btn_w_full default_btn_black"
          cancelText="계속 작성"
          cancelClassName="btn_w_full default_btn_white"
          onConfirm={handleConfirmExitWithoutSaving}
          onClose={handleCancelExitWithoutSaving}
        />
     </div>
  )
}
