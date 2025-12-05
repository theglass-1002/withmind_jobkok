import React, { useState } from "react";
import "./ResumeCreate.css";

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

import ic_star_gray700_20 from "@/assets/icons/size20/ic_star_gray700_20.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createResume } from "@/api/resume/resume.api";
import {
  CreateResumeRequest,
  mapAwardsKindToCategoryLabel,
  mapEducationStatusToGraduatedYn,
  normalizeYm,
  ProfilePhotoFile,
} from "@/api/resume/resume.types";
import { Storage } from "@/shared/utils/StorageManager";
import { uploadPhotoFile } from "@/api/fileUpload.api";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 타입 정의
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type FormState = {
  title: string;
  basic: BasicInfo;
  location: LocationValue;
  careers: CareerInfo[];
  isFreshGraduate: boolean; // ✅ 신입 상태 추가
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
  isFreshGraduate: false, // ✅ 신입 초기값
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
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // State
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<{
    basic: BasicErrors;
    title?: string;
    location?: string;
    careers?: CareerErrors[];
    education?: EducationErrors[]; 
  }>({
    basic: {},
    education: [],
  });
  const [isDefaultResume, setIsDefaultResume] = useState(false);
  const [sidebarStatus, setSidebarStatus] =
    useState<Partial<Record<SectionId, Status>>>({});
  const [isTempSaved, setIsTempSaved] = useState(false);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 경력 검증 헬퍼
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const buildCareerErrors = (careers: CareerInfo[]): CareerErrors[] => {
    return careers.map((c) => {
      const ce: CareerErrors = {};
      if (!c.company_name.trim()) {
        ce.company_name = "required";
      }
      if (!c.employmentType) {
        ce.employmentType = "required";
      }
      if (!c.startDate.trim()) {
        ce.startDate = "required";
      }
      if (!c.isCurrent && !c.endDate.trim()) {
        ce.endDate = "required";
      }
      if (!c.role.trim()) {
        ce.role = "required";
      }
      if (!c.position.trim()) {
        ce.position = "required";
      }
      return ce;
    });
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 학력 검증 헬퍼
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const buildEducationErrors = (educations: Education[]): EducationErrors[] => {
    return educations.map((e) => {
      const ee: EducationErrors = {};

      const isEmptyRow =
        !e.school_name &&
        !e.major_degree &&
        !e.startDate &&
        !e.endDate &&
        !e.status;

      // 완전 빈 행은 에러 없이 통과
      if (isEmptyRow) return ee;

      if (!e.school_name?.trim()) {
        ee.school_name = "required";
      }
      if (!e.startDate?.trim()) {
        ee.startDate = "required";
      }
      if (!e.endDate?.trim()) {
        ee.endDate = "required";
      }
      if (!e.status?.trim()) {
        ee.status = "required";
      }

      return ee;
    });
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Update 함수들
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const updateBasic = (patch: Partial<BasicInfo>) =>
    setForm((prev) => ({ ...prev, basic: { ...prev.basic, ...patch } }));

  const updateLocation = (patch: Partial<LocationValue>) =>
    setForm((prev) => {
      const nextLocation: LocationValue = {
        ...prev.location,
        ...patch,
      };

      // 위치가 유효하게 선택되면 location 에러 제거
      if (nextLocation.nationwide || nextLocation.selectedCodes.length > 0) {
        setErrors((prevErr) => ({
          ...prevErr,
          location: undefined,
        }));
      }

      return { ...prev, location: nextLocation };
    });

  // ✅ 경력과 신입 상태를 함께 업데이트
  const updateCareers = (newList: CareerInfo[], isFresh: boolean) => {
    setForm((prev) => ({
      ...prev,
      careers: newList,
      isFreshGraduate: isFresh, // ✅ 신입 상태 업데이트
    }));

    // 기존에 경력 에러가 있었다면, 입력 변화에 맞춰 다시 계산
    setErrors((prev) => {
      if (!prev.careers) return prev;
      const nextCareerErrors = buildCareerErrors(newList);
      return {
        ...prev,
        careers: nextCareerErrors,
      };
    });
  };

  // ✅ 학력 변경 시 에러 다시 계산 (빨간 테두리 해제용)
  const updateEducation = (newList: Education[]) => {
    setForm((prev) => ({ ...prev, education: newList }));

    setErrors((prev) => {
      if (!prev.education) return prev; // 아직 검증 전이면 패스
      const nextEduErrors = buildEducationErrors(newList);
      return {
        ...prev,
        education: nextEduErrors,
      };
    });
  };

  const updatePhotoFile = (file: File | null) =>
    setForm((prev) => ({ ...prev, photoFile: file }));

  const updateDesiredRoles = (roles: string[]) =>
    setForm((prev) => ({ ...prev, desiredRoles: roles }));

  const updateHardSkills = (skills: string[]) =>
    setForm((prev) => ({ ...prev, hardSkills: skills }));

  const updateSoftSkills = (skills: string[]) =>
    setForm((prev) => ({ ...prev, softSkills: skills }));

  const updateActivities = (activities: ActivityItem[]) =>
    setForm((prev) => ({ ...prev, activities }));

  const updateAwardCerts = (list: AwardsCertItem[]) =>
    setForm((prev) => ({ ...prev, awardCerts: list }));

  const updatePortfolios = (list: PortfolioDocItem[]) =>
    setForm((prev) => ({ ...prev, portfolios: list }));

  const updateSelfIntro = (content: string) =>
    setForm((prev) => ({ ...prev, selfIntro: content }));

  const resetBasicErrors = () => setErrors((prev) => ({ ...prev, basic: {} }));

  const resetEducationErrors = () =>
    setErrors((prev) => ({ ...prev, education: [] }));
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

      console.log("📋 프로필 사진 메타데이터:", profilePhotoFile);
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
      if (fileItems.length === 0) {
        return [];
      }

      const uploadPromises = fileItems.map(async (item) => {
        if (!item.file) return { originalItem: item };

        try {
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
        } catch (error) {
          console.error(
            `❌ 포트폴리오 파일 업로드 실패: ${item.file.name}`,
            error
          );
          throw error;
        }
      });

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error("❌ 포트폴리오 파일 업로드 실패:", error);
      toast.error("포트폴리오 파일 업로드 중 오류가 발생했습니다.");
      throw error;
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 핸들러 함수들
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleTempSave = () => {
    setIsTempSaved(true);
    toast.success("임시 저장되었습니다.");
  };

  const validate = () => {
    const nextErr: typeof errors = {
      basic: {} as BasicErrors,
      education: [],
    };

    // 1) 이력서 제목
    if (!form.title.trim()) {
      nextErr.title = "여기 이력서 제목을 입력해 주세요.";
    }

    // 2) 희망 근무 지역 (최소 1개 이상 필수)
    if (!form.location.nationwide && form.location.selectedCodes.length === 0) {
      nextErr.location = "1개 이상 추가해 주세요.";
    }

    // 3) 기본정보 필수값 검증
    const basicErr: BasicErrors = {};
    if (!form.basic.name.trim()) {
      basicErr.name = "이름을 입력해 주세요.";
    }
    if (!form.basic.birth.trim()) {
      basicErr.birth = "생년월일을 입력해 주세요.";
    }
    if (!form.basic.gender) {
      basicErr.gender = "성별을 선택해 주세요.";
    }
    if (!form.basic.email.trim()) {
      basicErr.email = "이메일을 입력해 주세요.";
    }
    if (!form.basic.phone.trim()) {
      basicErr.phone = "연락처를 입력해 주세요.";
    }
    nextErr.basic = basicErr;

    // 4) 경력 필수값 검증 (신입이 아닐 때만)
    if (!form.isFreshGraduate) {
      const careerErrs = buildCareerErrors(form.careers);
      nextErr.careers = careerErrs;
    }

    // 5) 학력 필수값 검증
    const eduErrs = buildEducationErrors(form.education);
    nextErr.education = eduErrs;

    setErrors(nextErr);

    const hasBasicError = Object.keys(basicErr).length > 0;
    const hasTitleError = !!nextErr.title;
    const hasLocationError = !!nextErr.location;
    const hasCareerError =
      !form.isFreshGraduate &&
      nextErr.careers &&
      nextErr.careers.some((ce) => Object.keys(ce).length > 0);
    const hasEduError =
      nextErr.education &&
      nextErr.education.some((ee) => Object.keys(ee).length > 0);

    return !hasTitleError && !hasLocationError && !hasBasicError && !hasCareerError && !hasEduError;
  };

  const handleSubmit = async () => {
    try {
      // ✅ 검증 먼저 수행
      const ok = validate();
      if (!ok) {
        toast.error("필수 항목을 먼저 입력해 주세요.");
        return;
      }

      console.log("📦 이력서 데이터 준비 중...");
      console.log("✏️ 자기소개:", form.selfIntro);
      console.log("👔 신입 여부:", form.isFreshGraduate);

      // 1) 프로필 사진 업로드
      const profilePhotoFile = await handleFileSubmit();

      // 2) 포트폴리오 파일 업로드
      const portfolioFilesResults = await handlePortfolioFilesSubmit();
      console.log("📁 업로드된 포트폴리오 파일들:", portfolioFilesResults);

      // 3) payload 생성
      const payload: CreateResumeRequest = {
        userIdx: Storage.getUserIdx(),
        isDefault: isDefaultResume ? 1 : 0,
        temp: isTempSaved ? "Y" : "N",
        title: form.title,
        name: form.basic.name,
        email: form.basic.email,
        gender: form.basic.gender === "male" ? "M" : "W",
        phone: form.basic.phone,
        birth: form.basic.birth,

        ...(profilePhotoFile ? { profilePhotoFile } : {}),

        regions: form.location.nationwide ? [] : form.location.selectedCodes,

        // ✅ 신입이 아닐 때만 careers 키 추가
        ...(form.isFreshGraduate
          ? {} // 신입이면 careers 키 자체를 제외
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

        // 필수 값들은 항상 포함
        jobs: form.desiredRoles,
        hardSkills: form.hardSkills,
        softSkills: form.softSkills,

        // 활동: 값이 있을 때만 key 추가
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

        // 수상·자격증: 값이 있을 때만 key 추가
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

        // 포트폴리오: 값이 있을 때만 key 추가
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

        // 자기소개: 내용이 있을 때만 key 추가
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

      console.log("📤 전송할 데이터:", payload);
      console.log("📍 regions:", payload.regions);
      console.log("👔 careers:", payload.careers); // ✅ 신입이면 undefined

      // const result = await createResume(payload);
      // console.log("✅ 이력서 등록 성공:", result);
      toast.success("이력서가 등록되었습니다!");
    } catch (error) {
      console.error("❌ 이력서 등록 실패:", error);
      toast.error("이력서 등록 중 오류가 발생했습니다.");
    }

    console.log("✅ ===== 이력서 등록 완료 =====");
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Render
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const isSubmitDisabled = !form.title.trim();

  return (
    <div className="resume-create-page">
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

          {/*  신입 상태도 함께 전달 */}
          <CareerSection
            value={form.careers}
            isFreshGraduate={form.isFreshGraduate}
            onChange={updateCareers} // (careers, isFresh) => void
            errors={errors.careers}
            onClearErrors={() =>
              setErrors((prev) => ({ ...prev, careers: undefined }))
            }
          />

          <EducationSection
              values={form.education}
              errors={errors.education ?? []}   // 🔥 에러 배열 전달
              onChange={updateEducation}
              onFocusAny={resetEducationErrors} // 🔥 학력 에러만 리셋
   
          />

          <DesiredRoleSection
            value={form.desiredRoles}
            onChange={updateDesiredRoles}
          />

          <HardSkillSection onChange={updateHardSkills} />

          <SoftSkillsSection onChange={updateSoftSkills} />

          <ActivitiesSection
            value={form.activities}
            onChange={updateActivities}
          />

          <AwardsCertificationsSection
            value={form.awardCerts}
            onChange={updateAwardCerts}
          />

          <PortfolioDocumentsSection
            value={form.portfolios}
            onChange={updatePortfolios}
          />

          <SelfIntroductionSection
            value={form.selfIntro}
            onChange={updateSelfIntro}
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
