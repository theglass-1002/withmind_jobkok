import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ic_link_gray900_20 from "@/assets/icons/size20/ic_link_gray900_20.png";
import ic_folder_gray900_20 from "@/assets/icons/size20/ic_folder_gray900_20.png";

import ResumeBasicInfo from "@/pages/Resume/ResumeDetail/parts/ResumeBasicInfo";
import ResumeFieldSection from "@/pages/Resume/ResumeDetail/parts/ResumeFieldSection";
import ResumeLocationList from "@/pages/Resume/ResumeDetail/parts/ResumeLocationList";
import ResumeCareerSection from "@/pages/Resume/ResumeDetail/parts/ResumeCareerSection";
import ResumeEducationSection from "@/pages/Resume/ResumeDetail/parts/ResumeEducationSection";
import ResumeDesiredRoleSection from "@/pages/Resume/ResumeDetail/parts/ResumeDesiredRoleSection";
import ResumeHardSkillsSection from "@/pages/Resume/ResumeDetail/parts/ResumeHardSkillsSection";
import ResumeSoftSkillsSection from "@/pages/Resume/ResumeDetail/parts/ResumeSoftSkillsSection";
import ResumeActivitiesSection from "@/pages/Resume/ResumeDetail/parts/ResumeActivitiesSection";
import ResumeAwardsSection from "@/pages/Resume/ResumeDetail/parts/ResumeAwardsSection";
import ResumePortfolioSection from "@/pages/Resume/ResumeDetail/parts/ResumePortfolioSection";
import ResumeSelfIntroSection from "@/pages/Resume/ResumeDetail/parts/ResumeSelfIntroSection";
import ResumeMockInterviewSection from "@/pages/Resume/ResumeDetail/parts/ResumeMockInterviewSection";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import { getCompanyResumeDetail } from "@/api/company/job/companyJob.api";
import { mapRegionListToLocationItems } from "@/api/resume/resume.types";

type ResumeSectionProps = {
  recommendationDetail?: RecommendationDetailData | null;
};

type CareerItem = {
  company: string;
  start: string;
  end: string;
  isCurrent?: boolean;
  tenure: string;
  employment?: string;
  role?: string;
  level?: string;
  bullets: string[];
};

type EducationItem = {
  school: string;
  start: string;
  end: string;
  major: string;
  status: string;
};

type RecommendationItem = {
  idx?: number;
  name?: string;
  age?: string;
  career?: string;
  education?: string;
  desiredJobs?: string[];
  aiInterview?: string;
  aiMatchPercent?: number;
  resumeUpdatedAt?: string;
  resumeIdx?: number;
  displayOrder?: number;
};

type LocationState = {
  recommendationItem?: RecommendationItem;
  analysisResult?: unknown;
};

type RecommendationDetailData = {
  recommendationIdx?: number;
  resumeIdx?: number;
  reportIdx?: number;
  aiMatchPercent?: number;
  technicalFitReason?: string;
  experienceAchievementReason?: string;
  problemSolvingReason?: string;
  teamworkCollaborationReason?: string;
};

type ResumeDetailData = {
  resumeIdx?: number | null;
  userIdx?: number | null;
  profilePhotoFileIdx?: number | null;
  isDefault?: boolean | null;
  title?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  gender?: string | null;
  birth?: string | null;
  temp?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  regionList?: string[];
  jobList?: string[];
  hardSkillList?: string[];
  softSkillList?: string[];
  careerList?: Array<{
    companyName?: string | null;
    startYm?: string | null;
    endYm?: string | null;
    roleName?: string | null;
    positionName?: string | null;
    workAndResult?: string | null;
    employmentType?: string | null;
    employedYn?: string | null;
  }>;
  educationList?: Array<{
    schoolName?: string | null;
    startYm?: string | null;
    endYm?: string | null;
    majorDegree?: string | null;
    graduatedYn?: string | null;
  }>;
  activityList?: Array<{
    activityName?: string | null;
    startYm?: string | null;
    endYm?: string | null;
    description?: string | null;
  }>;
  licenseList?: Array<{
    category?: string | null;
    name?: string | null;
    acquiredYm?: string | null;
    issuer?: string | null;
    licenseNo?: string | null;
    note?: string | null;
  }>;
  portfolioList?: Array<{
    itemType?: string | null;
    title?: string | null;
    description?: string | null;
    filePath?: string | null;
    fileIdx?: number | null;
  }>;
  selfIntroList?: Array<{
    title?: string | null;
    content?: string | null;
  }>;
  profilePhotoFile?: {
    fileIdx?: number | null;
    category?: string | null;
    originalName?: string | null;
    storedName?: string | null;
    filePath?: string | null;
    sizeBytes?: number | null;
    contentType?: string | null;
    status?: string | null;
  } | null;
};

export default function ResumeSection({
  recommendationDetail,
}: ResumeSectionProps) {
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;

  console.log("ResumeSection recommendationDetail:", recommendationDetail);

  const recommendationItem = state?.recommendationItem;
  const analysisResult = state?.analysisResult;

  const [isLoading, setIsLoading] = useState(false);
  const [resumeDetail, setResumeDetail] = useState<ResumeDetailData | null>(null);

  useEffect(() => {
    console.log("ResumeSection recommendationItem:", recommendationItem);
    console.log("ResumeSection analysisResult:", analysisResult);

    const fetchResumeDetail = async () => {
      const resumeIdx = recommendationDetail?.resumeIdx;

      if (!resumeIdx) {
        console.log("이력서 상세조회 스킵: recommendationDetail.resumeIdx 값이 없습니다.");
        setResumeDetail(null);
        return;
      }

      setIsLoading(true);

      try {
        console.log("이력서 상세조회 요청 resumeIdx:", resumeIdx);

        const resumeRes = await getCompanyResumeDetail(resumeIdx);

        console.log("이력서 상세조회 응답:", resumeRes);
        console.log("이력서 상세조회 resume:", resumeRes?.resume);

        if (resumeRes?.code === 200 && resumeRes?.resume) {
          setResumeDetail(resumeRes.resume);
        } else {
          console.log("이력서 상세조회 실패 메시지:", resumeRes?.msg);
          setResumeDetail(null);
        }
      } catch (error) {
        console.error("이력서 상세조회 실패:", error);
        setResumeDetail(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchResumeDetail();
  }, [recommendationDetail, recommendationItem, analysisResult]);

  const aiAnalysisItems = useMemo(
    () => [
      {
        title: "1. 기술적 적합성",
        desc:
          recommendationDetail?.technicalFitReason?.trim() ||
          "기술적 적합성 분석 정보가 없습니다.",
      },
      {
        title: "2. 경험과 성과",
        desc:
          recommendationDetail?.experienceAchievementReason?.trim() ||
          "경험 및 성과 분석 정보가 없습니다.",
      },
      {
        title: "3. 문제 해결 능력",
        desc:
          recommendationDetail?.problemSolvingReason?.trim() ||
          "문제 해결 능력 분석 정보가 없습니다.",
      },
      {
        title: "4. 팀워크 및 협업 능력",
        desc:
          recommendationDetail?.teamworkCollaborationReason?.trim() ||
          "팀워크 및 협업 능력 분석 정보가 없습니다.",
      },
    ],
    [recommendationDetail]
  );

  const name =
    resumeDetail?.name?.trim() || recommendationItem?.name?.trim() || "-";

  const meta =
    [recommendationItem?.age?.trim(), recommendationItem?.career?.trim()]
      .filter(Boolean)
      .join("ㆍ") || "-";

  const email = resumeDetail?.email?.trim() || "-";
  const phone = resumeDetail?.phone?.trim() || "-";
  const profileImageSrc = resumeDetail?.profilePhotoFile?.filePath?.trim() || "";

  const matchRate =
    typeof recommendationDetail?.aiMatchPercent === "number"
      ? `${recommendationDetail.aiMatchPercent}%`
      : typeof recommendationItem?.aiMatchPercent === "number"
      ? `${recommendationItem.aiMatchPercent}%`
      : "-";

  const careers: CareerItem[] =
    resumeDetail?.careerList && resumeDetail.careerList.length > 0
      ? resumeDetail.careerList.map((item) => ({
          company: item.companyName?.trim() || "-",
          start: item.startYm?.trim() || "-",
          end: item.employedYn === "Y" ? "재직중" : item.endYm?.trim() || "-",
          isCurrent: item.employedYn === "Y",
          tenure: recommendationItem?.career?.trim() || "-",
          employment: item.employmentType?.trim() || "-",
          role: item.roleName?.trim() || "-",
          level: item.positionName?.trim() || "-",
          bullets: [item.workAndResult?.trim() || "상세 경력 정보가 없습니다."],
        }))
      : [
          {
            company: "-",
            start: "-",
            end: "-",
            tenure: recommendationItem?.career?.trim() || "-",
            employment: "-",
            role:
              Array.isArray(recommendationItem?.desiredJobs) &&
              recommendationItem.desiredJobs.length > 0
                ? recommendationItem.desiredJobs.filter(Boolean).join(", ")
                : "-",
            level: "-",
            bullets: ["상세 경력 정보가 없습니다."],
          },
        ];

  const educations: EducationItem[] =
    resumeDetail?.educationList && resumeDetail.educationList.length > 0
      ? resumeDetail.educationList.map((item) => ({
          school: item.schoolName?.trim() || "-",
          start: item.startYm?.trim() || "-",
          end: item.endYm?.trim() || "-",
          major: item.majorDegree?.trim() || "-",
          status: item.graduatedYn?.trim() || "-",
        }))
      : [
          {
            school: recommendationItem?.education?.trim() || "-",
            start: "-",
            end: "-",
            major: "-",
            status: "-",
          },
        ];

  const desiredRoles =
    Array.isArray(resumeDetail?.jobList) && resumeDetail.jobList.length > 0
      ? resumeDetail.jobList.filter(Boolean)
      : Array.isArray(recommendationItem?.desiredJobs) &&
        recommendationItem.desiredJobs.length > 0
      ? recommendationItem.desiredJobs.filter(Boolean)
      : ["-"];

  const hardSkills: string[] =
    Array.isArray(resumeDetail?.hardSkillList) && resumeDetail.hardSkillList.length > 0
      ? resumeDetail.hardSkillList.filter(Boolean)
      : [];

  const softSkills: string[] =
    Array.isArray(resumeDetail?.softSkillList) && resumeDetail.softSkillList.length > 0
      ? resumeDetail.softSkillList.filter(Boolean)
      : [];

  const activities: Array<{
    category: string;
    title: string;
    start: string;
    end: string;
    bullets: string[];
  }> =
    Array.isArray(resumeDetail?.activityList) && resumeDetail.activityList.length > 0
      ? resumeDetail.activityList.map((item) => ({
          category: "활동",
          title: item.activityName?.trim() || "-",
          start: item.startYm?.trim() || "-",
          end: item.endYm?.trim() || "-",
          bullets: [item.description?.trim() || "-"],
        }))
      : [];

  const awards: Array<{
    title: string;
    start: string;
    issuer?: string;
  }> =
    Array.isArray(resumeDetail?.licenseList) && resumeDetail.licenseList.length > 0
      ? resumeDetail.licenseList.map((item) => ({
          title: item.name?.trim() || "-",
          start: item.acquiredYm?.trim() || "-",
          issuer: item.issuer?.trim() || "-",
        }))
      : [];

  const portfolios = Array.isArray(resumeDetail?.portfolioList)
    ? resumeDetail.portfolioList
    : [];

  const selfIntro =
    Array.isArray(resumeDetail?.selfIntroList) && resumeDetail.selfIntroList.length > 0
      ? resumeDetail.selfIntroList
          .map((item) => {
            const title = item.title?.trim();
            const content = item.content?.trim();

            if (title && content) return `${title}\n${content}`;
            return content || title || "";
          })
          .filter(Boolean)
          .join("\n\n") || `${name}님의 상세 자기소개 데이터가 없습니다.`
      : `${name}님의 상세 자기소개 데이터가 없습니다.`;

  const mockInterviewTitle = recommendationItem?.aiInterview?.trim()
    ? `${recommendationItem.aiInterview}ㆍ${name}`
    : "-";

  return (
    <div className="report-content">
      <LoadingOverlay isLoading={isLoading} isLogo />

      <div className="ai-match">
        <div className="ai-match-score">
          <span className="ai-match-label">AI 적합률</span>
          <span className="ai-match-value">{matchRate}</span>
        </div>

        <div className="ai-match-summary">
          <span className="ai-match-summary-title">분석 요약</span>

          {aiAnalysisItems.map((item, index) => (
            <div key={index} className="ai-match-item">
              <span className="ai-match-item-title">{item.title}</span>
              <span className="ai-match-item-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="resume-page__main">
        <div className="resume-detail__content">
          <ResumeBasicInfo
            name={name}
            meta={meta}
            email={email}
            phone={phone}
            imageSrc={profileImageSrc}
          />

          <ResumeFieldSection
            label="희망 근무 지역"
            className="resume-field--location"
            valueAs="div"
            valueClassName="resume-location-list"
          >
            <ResumeLocationList
              items={mapRegionListToLocationItems(resumeDetail?.regionList ?? [])}
            />
          </ResumeFieldSection>

          <ResumeCareerSection
            totalLabel={`(총 ${careers?.[0]?.tenure ?? "-"})`}
            items={careers}
          />

          <ResumeEducationSection items={educations} />

          <ResumeDesiredRoleSection items={desiredRoles} />

          <ResumeHardSkillsSection items={hardSkills} />

          <ResumeSoftSkillsSection items={softSkills} />

          <ResumeActivitiesSection items={activities} />

          <ResumeAwardsSection items={awards} />

          <ResumePortfolioSection
            defaultIcons={{
              file: ic_folder_gray900_20,
              link: ic_link_gray900_20,
            }}
            items={portfolios}
          />

          <ResumeSelfIntroSection text={selfIntro} />

          <ResumeMockInterviewSection
            lastItem
            defaultIcon={ic_folder_gray900_20}
            items={[{ title: mockInterviewTitle }]}
          />
        </div>
      </div>
    </div>
  );
}