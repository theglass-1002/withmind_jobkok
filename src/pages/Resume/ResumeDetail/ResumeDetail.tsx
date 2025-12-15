// src/pages/Resume/ResumeDetail.tsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  fetchResumeDetail,
  updateDefaultResume,
} from "@/api/resume/resume.api";
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
import { logout } from "@/api/auth.api";

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

// YYYY-MM -> YYYY.MM
const formatYmToDot = (ym?: string | null): string => {
  if (!ym) return "";
  return ym.replace("-", ".");
};

// ✅ 섹션별 값 유무로 completed / pending 계산
function buildStatusMap(
  data: ResumeDetailResponse
): Partial<Record<SectionId, Status>> {
  const map: Partial<Record<SectionId, Status>> = {};

  const hasText = (v?: string | null) =>
    typeof v === "string" && v.trim().length > 0;
  const hasArray = (arr?: unknown[] | null) =>
    Array.isArray(arr) && arr.length > 0;

  map.title = hasText(data.title) ? "completed" : "pending";

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

  map.mockInterview = "pending";

  return map;
}

// ----------------------------------------
// 컴포넌트
// ----------------------------------------

export default function ResumeDetail() {
  const navigate = useNavigate();
  const { resumeId } = useParams<{ resumeId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeDetailResponse | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("title");
  const resumeRef = useRef<HTMLDivElement | null>(null);

  const [isDefaultResume, setIsDefaultResume] = useState(false);
  const [showDefaultModal, setShowDefaultModal] = useState(false);
  const [nextDefaultState, setNextDefaultState] = useState<boolean | null>(
    null
  ); // true: 기본 설정, false: 해제

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
    if (!resumeId) return;
    setNextDefaultState(checked);
    setShowDefaultModal(true);
  };

  const handleChangeDefaultResume = async () => {
    if (!resumeId || nextDefaultState === null) return;
    const numericId = Number(resumeId);

    try {
      setIsLoading(true);
      const newValue: 0 | 1 = nextDefaultState ? 1 : 0;

      const res = await updateDefaultResume(numericId, newValue);
      console.log("✅ 기본 이력서 변경 응답:", res);
      if (res.code !== 200) {
        throw new Error(res.msg || "기본 이력서 변경 실패");
      }
      setIsDefaultResume(nextDefaultState);

      if (nextDefaultState) {
        toast.success("기본 이력서로 설정되었습니다.");
      } else {
        toast.success("기본 이력서 설정이 해제되었습니다.");
      }
    } catch (e) {
      console.error("❌ 기본 이력서 변경 실패:", e);
      toast.error("기본 이력서 변경 중 오류가 발생했습니다.");
    } finally {
      setShowDefaultModal(false);
      setNextDefaultState(null);
      setIsLoading(false);
    }
  };

  const handleCancelDefaultResume = () => {
    setShowDefaultModal(false);
    setNextDefaultState(null);
  };

  const handleEdit = () => {
    if (!resumeId) return;
    navigate(`/resumes/${resumeId}/edit`);
  };

  const handleDownloadPdf = async () => {
    try {
      toast.info("PDF 생성 중...");

      const desktopWrapper = document.querySelector(
        ".resume-page--detail:not(.mobile) .resume-page__main"
      ) as HTMLElement;

      const mobileWrapper = document.querySelector(
        ".resume-page--detail.mobile .resume-page__main"
      ) as HTMLElement;

      const wrapper =
        desktopWrapper && desktopWrapper.offsetHeight > 0
          ? desktopWrapper
          : mobileWrapper;

      if (!wrapper) {
        throw new Error("이력서 영역을 찾을 수 없습니다");
      }

      const shouldAddPdfClass = true;
      if (shouldAddPdfClass) {
        wrapper.classList.add("resume-page--pdf");
        await new Promise((r) => setTimeout(r, 100));
      }

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: wrapper.scrollWidth || wrapper.offsetWidth,
        height: wrapper.scrollHeight || wrapper.offsetHeight,
      });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error(
          `Canvas 크기가 0입니다: ${canvas.width} x ${canvas.height}`
        );
      }

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      if (!isFinite(imgWidth) || !isFinite(imgHeight) || imgWidth <= 0 || imgHeight <= 0) {
        throw new Error(`잘못된 이미지 크기: ${imgWidth} x ${imgHeight}`);
      }

      let position = 0;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft * -1;
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = `jobkok-resume-${resumeData?.name || "resume"}.pdf`;
      pdf.save(fileName);

      toast.success("PDF 다운로드가 완료되었습니다!");

      if (shouldAddPdfClass) {
        wrapper.classList.remove("resume-page--pdf");
      }
    } catch (error) {
      console.error("❌ PDF 생성 실패:", error);
      toast.error("PDF 생성 중 오류가 발생했습니다.");
      const allWrappers = document.querySelectorAll(".resume-page__main");
      allWrappers.forEach((w) => w.classList.remove("resume-page--pdf"));
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
          setIsDefaultResume(res.isDefault);
        }
      } catch (e: any) {
        if (!cancelled) {
          if (e.code === 999) {
            console.log("로그인만료");
            logout();
            navigate("/login");
          } else {
            console.error("❌ 이력서 상세 조회 실패:", e);
            toast.error("이력서 정보를 불러오지 못했습니다.");
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchResume();

    return () => {
      cancelled = true;
    };
  }, [resumeId, navigate]);

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

  const sidebarStatusMap = buildStatusMap(resumeData);

  const activityItems =
    (resumeData.activityList ?? []).map((act) => ({
      title: act.activityTitle,
      start: formatYmToDot(act.startYm),
      end: formatYmToDot(act.endYm),
      bullets: act.description
        ? act.description
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
        : undefined,
    })) ?? [];

  // 🔥 birth, gender nullable 방어
  const basicMeta =
    resumeData.birth && resumeData.gender
      ? formatMeta(resumeData.birth, resumeData.gender as "M" | "W")
      : "";

  // 🔥 모달 타이틀 - 토글 방향에 따라 다르게
  const defaultModalTitle =
    nextDefaultState === false
      ? "기본이력서를 해지 하시겠습니까?"
      : `해당 이력서를 기본 이력서로\n변경하시겠습니까?`;

  return (
    <>
      <div className="resume-page resume-page--detail">
        <LoadingOverlay isLoading={isLoading} />
        <ResumeActionsBar
          onDownloadPdf={handleDownloadPdf}
          onEdit={handleEdit}
          showRightActions={false}
        />

        <div className="resume-page__container">
          <div className="resume-page__main" ref={resumeRef}>
            <ResumeHeaderTitle text={resumeData.title} />

            <div className="resume-detail__content">
              <ResumeBasicInfo
                name={resumeData.name}
                meta={basicMeta}
                email={resumeData.email}
                phone={resumeData.phone}
                imageSrc={resumeData.profilePhotoFile?.filePath ?? ""}
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

              <ResumeActivitiesSection items={activityItems} />

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
                      "82점ㆍ프로젝트 기획자ㆍ25.01.01 [성장하는 기획자 정유리입니다.]",
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

        <div id="sticky-trigger" className="resume-page__main">
          <ResumeHeaderTitle text={resumeData.title} />

          <div className="resume-detail__content">
            <ResumeBasicInfo
              name={resumeData.name}
              meta={basicMeta}
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

            <ResumeActivitiesSection items={activityItems} />

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
                    "82점ㆍ프로젝트 기획자ㆍ25.01.01 [성장하는 기획자 정유리입니다.]",
                },
              ]}
            />
          </div>
        </div>

        <Modal
          open={showDefaultModal}
          title={defaultModalTitle}
          confirmText="확인"
          confirmClassName="btn_w_full default_btn_black"
          cancelText="취소"
          cancelClassName="btn_w_full default_btn_white"
          onConfirm={handleChangeDefaultResume}
          onClose={handleCancelDefaultResume}
        />
      </div>
    </>
  );
}
