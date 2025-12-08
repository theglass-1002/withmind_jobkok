// src/pages/Resume/ResumeDetail.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "@/pages/Resume/Resume.css";
import "./ResumeDetail.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Switch from "react-switch";
import { useStickyTabs, tabItems } from "@/shared/utils/util";
import Tabs from "@/shared/components/tabs/Tabs";
import ResumeSidebar, {
  type SectionId,
  type Status,
} from "@/pages/Resume/ResumeSidebar/ResumeSidebar";
import Modal from "@/shared/components/modal/Modal";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import test_resume_img from "@/assets/testImg/test_resume_img.png";
import ic_link_gray900_20 from "@/assets/icons/size20/ic_link_gray900_20.png";
import ic_folder_gray900_20 from "@/assets/icons/size20/ic_folder_gray900_20.png";

import ResumeActionsBar from "./parts/ResumeActionsBar";
import ResumeHeaderTitle from "./parts/ResumeHeaderTitle";
import ResumeBasicInfo from "./parts/ResumeBasicInfo";
import ResumeFieldSection from "./parts/ResumeFieldSection";
import ResumeLocationList from "./parts/ResumeLocationList";
import ResumeCareerSection from "./parts/ResumeCareerSection";
import ResumeEducationSection from "./parts/ResumeEducationSection";
import ResumeDesiredRoleSection from "./parts/ResumeDesiredRoleSection";
import ResumeHardSkillsSection from "./parts/ResumeHardSkillsSection";
import ResumeSoftSkillsSection from "./parts/ResumeSoftSkillsSection";
import ResumeActivitiesSection from "./parts/ResumeActivitiesSection";
import ResumeAwardsSection from "./parts/ResumeAwardsSection";
import ResumePortfolioSection from "./parts/ResumePortfolioSection";
import ResumeSelfIntroSection from "./parts/ResumeSelfIntroSection";
import ResumeMockInterviewSection from "./parts/ResumeMockInterviewSection";
import { fetchResumeDetail } from "@/api/resume/resume.api";
import {
  calcTotalCareerLabel,
  formatMeta,
  mapCareerListToCareerItems,
  mapGraduatedYnToLabel,
  mapLicenseListToAwardItems,
  mapPortfolioListToPortfolioItems,
  mapRegionListToLocationItems,
  type ResumeDetailResponse,
} from "@/api/resume/resume.types";

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

// ✅ 섹션별 값 유무로 completed / pending 계산
function buildStatusMap(
  data: ResumeDetailResponse
): Partial<Record<SectionId, Status>> {
  const map: Partial<Record<SectionId, Status>> = {};

  const hasText = (v?: string | null) =>
    typeof v === "string" && v.trim().length > 0;
  const hasArray = (arr?: unknown[] | null) => Array.isArray(arr) && arr.length > 0;

  map.title = hasText(data.title) ? "completed" : "pending";

  // 기본정보: 이름/이메일/휴대폰 정도 체크
  const basicFilled =
    hasText(data.name) && hasText(data.email) && hasText(data.phone);
  map.basic = basicFilled ? "completed" : "pending";

  map.location = hasArray(data.regionList) ? "completed" : "pending";
  map.career = hasArray(data.careerList) ? "completed" : "pending";
  map.education = hasArray(data.educationList) ? "completed" : "pending";
  map.desiredRole = hasArray(data.jobList) ? "completed" : "pending";
  map.hardSkills = hasArray(data.hardSkillList) ? "completed" : "pending";
  map.softSkills = hasArray(data.softSkillList) ? "completed" : "pending";
  map.activities = hasArray(data.activityList ?? []) ? "completed" : "pending";
  map.awards = hasArray(data.licenseList) ? "completed" : "pending";
  map.portfolio = hasArray(data.portfolioList) ? "completed" : "pending";
  map.selfIntro = hasArray(data.selfIntroList) ? "completed" : "pending";

  // 모의면접: 아직 BE 필드 없으니 기본 pending
  map.mockInterview = "pending";

  return map;
}

// ----------------------------------------
// 컴포넌트
// ----------------------------------------

export default function ResumeDetail() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeDetailResponse | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("title");
  const resumeRef = useRef<HTMLDivElement | null>(null);
  const [isDefaultResume, setIsDefaultResume] = useState(false);
  const [showDefaultModal, setShowDefaultModal] = useState(false);

  const isTabsSticky = useStickyTabs(
    "sticky-trigger",
    ".default_tabs",
    ".page-header"
  );

  const handleTabClick = (key: string) => {
    setActiveTab(key);

    if (key === "title" || key === "basic") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetId = `resume-field--${key}`;
    const targetElement = document.querySelector(
      `.${targetId}`
    ) as HTMLElement | null;

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleToggleDefault = (checked: boolean) => {
    if (checked) {
      setShowDefaultModal(true);
    } else {
      setIsDefaultResume(false);
      // TODO: 기본 이력서 해제 API 연동
    }
  };

  const handleConfirmDefaultResume = () => {
    setIsDefaultResume(true);
    setShowDefaultModal(false);
    toast.success("기본 이력서로 설정되었습니다.");
    // TODO: 기본 이력서 설정 API 연동
  };

  const handleCancelDefaultResume = () => {
    setShowDefaultModal(false);
  };

  const handleTempSave = () => {
    toast.success("임시 저장되었습니다.");
  };

  const handleSubmit = () => {
    // TODO: 제출 API 연동
    toast.success("이력서가 제출되었습니다.");
  };

  const handleDownloadPdf = async () => {
    if (!resumeRef.current) return;

    const wrapper = resumeRef.current;
    wrapper.classList.add("resume-page--pdf");
    await new Promise((r) => setTimeout(r, 0));

    try {
      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let position = 0;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft * -1;
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("jobkok-resume.pdf");
    } finally {
      wrapper.classList.remove("resume-page--pdf");
    }
  };

  // 상세 조회
  useEffect(() => {
    if (!resumeId) return;

    let cancelled = false;

    const fetchResume = async () => {
      setIsLoading(true);
      try {
        const numericId = Number(resumeId);
        const res = await fetchResumeDetail(numericId);
        if (!cancelled) {
          setResumeData(res);
          setIsDefaultResume(res.isDefault); // 기본 이력서 여부 동기화
        }
      } catch (e) {
        if (!cancelled) {
          console.error("이력서 상세 조회 실패:", e);
          toast.error("이력서 정보를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchResume();

    // 언마운트 / resumeId 변경 시
    return () => {
      cancelled = true;
    };
  }, [resumeId]);

  // 디버그용 로그 (값 바뀔 때만)
  useEffect(() => {
    if (resumeData) {
      console.log("ResumeDetail loaded:", resumeData);
    }
  }, [resumeData]);

  if (!resumeData) {
    return (
      <div className="resume-page resume-page--detail">
        <LoadingOverlay
          isLoading={isLoading}
          text="이력서를 불러오는 중입니다..."
        />
      </div>
    );
  }

  // ✅ 여기서 섹션 상태 자동 계산
  const sidebarStatusMap = buildStatusMap(resumeData);

  return (
    <>
      <div className="resume-page resume-page--detail">
        <LoadingOverlay isLoading={isLoading} />
        <ResumeActionsBar
          onDownloadPdf={handleDownloadPdf}
          onTempSave={handleTempSave}
          onSubmit={handleSubmit}
        />

        <div className="resume-page__container">
          <div className="resume-page__main" ref={resumeRef}>
            <ResumeHeaderTitle text={resumeData.title} />

            <div className="resume-detail__content">
              <ResumeBasicInfo
                name={resumeData.name}
                meta={formatMeta(resumeData.birth, resumeData.gender)}
                email={resumeData.email}
                phone={resumeData.phone}
                imageSrc={
                  resumeData.profilePhotoFile?.filePath ?? test_resume_img
                }
              />

              <ResumeFieldSection
                label="희망 근무 지역"
                className="resume-field--location"
                valueAs="div"
                valueClassName="resume-location-list"
              >
                <ResumeLocationList
                  items={mapRegionListToLocationItems(
                    resumeData.regionList ?? []
                  )}
                />
              </ResumeFieldSection>

              <ResumeCareerSection
                totalLabel={calcTotalCareerLabel(resumeData.careerList)}
                items={mapCareerListToCareerItems(resumeData.careerList)}
              />

              <ResumeEducationSection
                items={(resumeData.educationList ?? []).map((edu) => ({
                  school: edu.schoolName,
                  start: edu.startYm,
                  end: edu.endYm,
                  major: edu.majorDegree,
                  status: mapGraduatedYnToLabel(edu.graduatedYn),
                }))}
              />

              <ResumeDesiredRoleSection
                items={resumeData.jobList ?? ["자바 개발자", "웹 개발자"]}
              />

              <ResumeHardSkillsSection items={resumeData.hardSkillList ?? []} />
              <ResumeSoftSkillsSection items={resumeData.softSkillList ?? []} />

              {/* TODO: activityList 매핑으로 교체 */}
              <ResumeActivitiesSection
                items={[
                  {
                    title: "[교육 이수] 임베디드 소프트웨어 융합 풀스택 과정",
                    start: "2016.06",
                    end: "2017.03",
                    bullets: [
                      "커머스 플랫폼 스타트업 대표와 개발자들의 시장 분석 및 실제 시뮬레이션 적용",
                    ],
                  },
                ]}
              />

              <ResumeAwardsSection
                items={mapLicenseListToAwardItems(resumeData.licenseList)}
              />

              <ResumePortfolioSection
                defaultIcons={{
                  file: ic_folder_gray900_20,
                  link: ic_link_gray900_20,
                }}
                items={mapPortfolioListToPortfolioItems(
                  resumeData.portfolioList
                )}
              />

              <ResumeSelfIntroSection
                text={
                  resumeData.selfIntroList?.[0]?.content ??
                  "자기소개 내용이 없습니다."
                }
              />

              <ResumeMockInterviewSection
                lastItem
                defaultIcon={ic_folder_gray900_20}
                items={[
                  {
                    title:
                      "82점ㆍ프론트엔드 개발자ㆍ25.01.01 [성장하는 개발자, 준비된 홍길동입니다.]",
                  },
                ]}
              />
            </div>
          </div>

          <ResumeSidebar
            statusMap={sidebarStatusMap}
            isDefault={isDefaultResume}
            onToggleDefault={handleToggleDefault}
          />
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="resume-page resume-page--detail mobile">
        <div className="resume-sidebar__default">
          <span className="resume-sidebar__default-text">
            기본 이력서로 설정
          </span>
          <label
            className="resume-sidebar__default-label"
            aria-label="기본 이력서로 설정"
          >
            <Switch
              checked={isDefaultResume}
              onChange={handleToggleDefault}
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
          className={`resume-create-tabs default_tabs ${
            isTabsSticky ? "is-sticky" : ""
          }`}
          itemClassName="resume-create-tabs__item"
          activeClassName="on"
        />

        <div id="sticky-trigger" className="resume-page__main" ref={resumeRef}>
          <ResumeHeaderTitle text={resumeData.title} />

          <div className="resume-detail__content">
            <ResumeBasicInfo
              name={resumeData.name}
              meta={formatMeta(resumeData.birth, resumeData.gender)}
              email={resumeData.email}
              phone={resumeData.phone}
              imageSrc={
                resumeData.profilePhotoFile?.filePath ?? test_resume_img
              }
            />

            <ResumeFieldSection
              label="희망 근무 지역"
              className="resume-field--location"
              valueAs="div"
              valueClassName="resume-location-list"
            >
              <ResumeLocationList
                items={mapRegionListToLocationItems(
                  resumeData.regionList ?? []
                )}
              />
            </ResumeFieldSection>

            <ResumeCareerSection
              totalLabel={calcTotalCareerLabel(resumeData.careerList)}
              items={mapCareerListToCareerItems(resumeData.careerList)}
            />

            <ResumeEducationSection
              items={(resumeData.educationList ?? []).map((edu) => ({
                school: edu.schoolName,
                start: edu.startYm,
                end: edu.endYm,
                major: edu.majorDegree,
                status: mapGraduatedYnToLabel(edu.graduatedYn),
              }))}
            />

            <ResumeDesiredRoleSection items={resumeData.jobList ?? []} />

            <ResumeHardSkillsSection items={resumeData.hardSkillList ?? []} />
            <ResumeSoftSkillsSection items={resumeData.softSkillList ?? []} />

            <ResumeActivitiesSection
              items={[
                {
                  title: "[교육 이수] 임베디드 소프트웨어 융합 풀스택 과정",
                  start: "2016.06",
                  end: "2017.03",
                  bullets: [
                    "커머스 플랫폼 스타트업 대표와 개발자들의 시장 분석 및 실제 시뮬레이션 적용",
                  ],
                },
              ]}
            />

            <ResumeAwardsSection
              items={mapLicenseListToAwardItems(resumeData.licenseList)}
            />

            <ResumePortfolioSection
              defaultIcons={{
                file: ic_folder_gray900_20,
                link: ic_link_gray900_20,
              }}
              items={mapPortfolioListToPortfolioItems(
                resumeData.portfolioList
              )}
            />

            <ResumeSelfIntroSection
              text={
                resumeData.selfIntroList?.[0]?.content ??
                "자기소개 내용이 없습니다."
              }
            />

            <ResumeMockInterviewSection
              lastItem
              defaultIcon={ic_folder_gray900_20}
              items={[
                {
                  title:
                    "82점ㆍ프론트엔드 개발자ㆍ25.01.01 [성장하는 개발자, 준비된 홍길동입니다.]",
                },
              ]}
            />
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
    </>
  );
}
