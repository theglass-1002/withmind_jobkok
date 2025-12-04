import React, { useState } from "react";
import "./ResumeCreate.css";

import BasicInfoSection, {
  type BasicInfo,
  type BasicErrors,
} from "./ResumeCreate/BasicInfoSection/BasicInfoSection";
import LocationSection, {
  type LocationValue,
} from "./ResumeCreate/LocationSection/LocationSection";
import CareerSection, { CareerInfo } from "./ResumeCreate/CareerSection/CareerSection";
import EducationSection, {
  type Education,
  type EducationErrors
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
import { CreateResumeRequest, mapAwardsKindToCategoryLabel, mapEducationStatusToGraduatedYn, normalizeYm } from "@/api/resume/resume.types";
import { Storage } from "@/shared/utils/StorageManager";
import { getAwsPresignedUrl, getPreSignedUrl, uploadFileToS3 } from "@/api/fileUpload.api";
import { getLocationList } from "@/shared/utils/util";

// 폼 상태 타입 정의
type FormState = {
  title: string;
  basic: BasicInfo;
  location: LocationValue;
  careers: CareerInfo[]; 
  education: Education[];
  photoFile?: File | null; // 업로드할 파일
  desiredRoles: string[];  
  hardSkills: string[];
  softSkills: string[];
  activities: ActivityItem[]; 
  awardCerts: AwardsCertItem[]; 
  portfolios: PortfolioDocItem[];
};

// 초기값
const initial: FormState = {
  title: "",
  basic: { name: "", birth: "", gender: null, email: "", phone: "", photoUrl: "" },
  location: { nationwide: false, selectedKeys: [] },
  careers: [], // 경력 초기값
  education: [],
  photoFile: null,
  desiredRoles: [],     
  hardSkills: [],  
  softSkills:[],
  activities: [],
  awardCerts: [],   
  portfolios: [],             
};

// 전체 섹션 목록
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
  // ===== State =====
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<{
    education?: EducationErrors;
    basic: BasicErrors;
    title?: string;
    location?: string;
  }>({
    basic: {},
    education: {},
  });
  const [isDefaultResume, setIsDefaultResume] = useState(false);
  const [sidebarStatus, setSidebarStatus] = useState<Partial<Record<SectionId, Status>>>({});

  // ===== Update 함수들 =====
  const updateBasic = (patch: Partial<BasicInfo>) =>
    setForm((prev) => ({ ...prev, basic: { ...prev.basic, ...patch } }));

  const updateLocation = (patch: Partial<LocationValue>) =>
    setForm((prev) => ({ ...prev, location: { ...prev.location, ...patch } }));

  const updateCareers = (newList: CareerInfo[]) =>
    setForm((prev) => ({ ...prev, careers: newList }));

  const updateEducation = (newList: Education[]) =>
    setForm((prev) => ({ ...prev, education: newList }));

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

  const resetBasicErrors = () => setErrors((prev) => ({ ...prev, basic: {} }));

  // ===== 핸들러 함수들 =====
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

  const handleSubmit = async () => {
    try {

      console.log("📦 이력서 데이터 준비 중...");
 
      const payload: CreateResumeRequest = {
        userIdx:Storage.getUserIdx(),
        isDefault: 1,
        temp: "N",
        title: form.title,
        name: Storage.getUserName(),
        email: form.basic.email,
        gender: form.basic.gender=="male"?"M":"W",
        phone:form.basic.phone,
        // profilePhotoFile: {
        //   filePath: "jobkok/resume/profile-photo/2025/12/04/profile_photo_v1.jpg",
        //   originalName: "증명사진.pdf",
        //   storedName: "profile_photo_v1.pdf",
        //   sizeBytes: 123456,
        //   contentType: "image/jpeg"
        // },
        birth:form.basic.birth,
        regions: getLocationList(form.location),      
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
        educations: form.education.map((edu) => ({
          schoolName: edu.school_name,
          startYm:normalizeYm(edu.startDate)!,
          endYm: edu.endDate,
          majorDegree: edu.major_degree,
          graduatedYn: mapEducationStatusToGraduatedYn(edu.status),
        })),
        jobs: form.desiredRoles,
        hardSkills: form.hardSkills,
        softSkills: form.softSkills,
        activities: form.activities.map((act) => ({
          category: act.activityType ?? "교내활동",
          activityTitle: act.activityName,
          startYm: act.startDate ? normalizeYm(act.startDate) : "1999-09-09",
          endYm: act.endDate ? normalizeYm(act.endDate) : "1999-09-09",
          description: act.summary,
          linkUrl: "https://github.com/user",
        })),
        awardCerts: form.awardCerts.map((item) => ({
          category: mapAwardsKindToCategoryLabel(item.kind),
          name: item.title,
          issuer: item.issuer ?? "",
          acquiredYm: item.dateValue ? normalizeYm(item.dateValue)!.replace("-", "") : "",
          licenseNo: item.score ?? "",
          note: "",
        })),
        portfolios: form.portfolios.map((p, idx) => ({
          itemType: p.source === "url" ? "URL" : "FILE",
          title: p.title || `포트폴리오 ${idx + 1}`,
          docName: p.file?.name ?? "",
          url: p.source === "url" ? p.url : "",
          fileRef: null, // 실제 업로드 후 S3 키 등 연결할 수 있음
          description: p.note ?? "",
          sortOrder: idx + 1,
        })),
        selfIntros: [
          { title: "소개", content: "안녕하세요.", isAi: false }
        ]
      };
      console.log('전송한 값',payload);
     // const result = await createResume(payload);
     // toast.success("이력서가 등록되었습니다!");
     // console.log(result);

            // let uploadedPhotoUrl = form.basic.photoUrl;
      // let photoS3Key = "";
      // // 1단계: 사진 파일이 있으면 업로드 처리
      // if (form.photoFile) {
      //   console.log("📸 사진 파일 업로드 시작...");
      //   toast.info("사진을 업로드 중입니다...");

      //   // 1-1. AWS에게 파일 업로드할 주소 받기
      //   const preSignedData = await getPreSignedUrl(
      //     form.photoFile.name,
      //     "resume/profile",
      //     "media"
      //   );
      //   console.log("✅ 1단계: Pre-signed URL API 받음:", preSignedData);
      //    // 2) AWS에 직접 GET 해서 presigned_url, s3_key 받음
      //   const awsData = await getAwsPresignedUrl(preSignedData.presignedUrlApi);
      //   console.log("✅ 2단계: AWS presigned_url 받음:", awsData);


      //   // 파일 메타데이터 추출
      //   const fileMetadata = {
      //     fileName: form.photoFile.name,
      //     fileSize: form.photoFile.size,
      //     fileType: form.photoFile.type,
      //     s3_key: awsData.s3_key,
      //   };

      //   console.log("📋 파일 메타데이터:", fileMetadata);

      //   // 3) presigned_url로 PUT 업로드
      //   await uploadFileToS3(awsData.presigned_url, form.photoFile);
      //   console.log("✅ 3단계: S3 파일 업로드 완료");

      //   // 최종 URL 생성
      //   uploadedPhotoUrl = `${preSignedData.awsFrontVideoUrlStr}/${form.photoFile.name}`;
      //   photoS3Key = awsData.s3_key;
              
      //   console.log("🔗 최종 사진 URL:", uploadedPhotoUrl);
      //   console.log("🔑 S3 키:", photoS3Key);

      //   toast.success("사진 업로드 완료!");
      // }

      // 2단계: 이력서 데이터 준비 (업로드된 사진 URL 포함)
      // TODO: 성공 후 이력서 목록 페이지로 이동
      // navigate('/resumes');

    } catch (error) {
      console.error("❌ 이력서 등록 실패:", error);
      toast.error("이력서 등록 중 오류가 발생했습니다.");
    }

    console.log("✅ ===== 이력서 등록 완료 =====");
  };

  // ===== Render =====
  const isSubmitDisabled =
    !form.title.trim() ||
    (!form.location.nationwide && form.location.selectedKeys.length === 0);

  return (
    <div className="resume-create-page">
      <div className="resume-controls-wrapper">
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
            onPhotoFileChange={updatePhotoFile}
          />

          {/* 희망 근무 지역 */}
          <LocationSection
            defaultValue={initial.location}
            onChange={updateLocation}
          />
          {errors.location && (
            <div className="resume-create-page__error" style={{ marginTop: 8 }}>
              {errors.location}
            </div>
          )}

          {/* 경력 */}
          <CareerSection
             onChange={updateCareers}
          />

          {/* 학력 */}
          <EducationSection
            values={form.education}
            errors={errors.education}
            onChange={updateEducation}
            onFocusAny={resetBasicErrors}
          />

          {/* 희망 직무 */}
          <DesiredRoleSection
            value={form.desiredRoles}
            onChange={updateDesiredRoles}
          />

          {/* 기술 스택 */}
          <HardSkillSection onChange={updateHardSkills} />

          {/* 소프트 스킬 */}
          <SoftSkillsSection onChange={updateSoftSkills} />

          {/* 활동 */}
          <ActivitiesSection
            value={form.activities}
            onChange={updateActivities}
          />


          {/* 수상 및 자격증 */}
          <AwardsCertificationsSection
            value={form.awardCerts}
            onChange={updateAwardCerts}
          />

          {/* 포트폴리오 및 문서 */}
          <PortfolioDocumentsSection
            value={form.portfolios}
            onChange={updatePortfolios}
          />
          {/* 자기소개서 */}
          <SelfIntroductionSection />

          {/* 모의면접 분석 */}
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