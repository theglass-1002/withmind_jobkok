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
import ic_content_paste_gray900_20 from "@/assets/icons/size20/ic_content_paste_gray900_20.png";

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
import { logout } from "@/api/auth/auth.api";
import { Icons } from "@/assets/icons";
import { useLayoutContext } from "@/app/LayoutContext";
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

// "2026-04-30 16:27:51" -> "2026.04.30"
const formatInterviewDate = (raw?: string | null): string => {
  if (!raw) return "";
  return raw.slice(0, 10).replaceAll("-", ".");
};

// 모의면접 분석 결과 표시용 아이템 빌더
const buildMockInterviewItems = (
  data: ResumeDetailResponse
): { title: string }[] => {
  if (!data.qzGroup) return [];

  const score =
    typeof data.interviewScore === "number" ? `${data.interviewScore}점` : "";
  const job = data.interviewJob || data.interviewJobGroup || "";
  const date = formatInterviewDate(data.interviewDate);

  const title = [score, job, date].filter(Boolean).join("ㆍ");
  if (!title) return [];

  return [{ title }];
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

  // 경력은 배열이 있고, 유효한 경력(startYm이 있는)이 1개 이상 있어야 완료
  const hasValidCareer = hasArray(data.careerList) &&
    data.careerList!.some(c => c.startYm && c.startYm.trim() !== '');
  map.career = hasValidCareer ? "completed" : "pending";

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
  const { actionType, resetAction } = useLayoutContext();
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
      console.log("기본 이력서 변경 응답:", res);
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
    const sourceDetailPage = document.querySelector(
      "div.resume-page--detail:not(.mobile)"
    ) as HTMLElement | null;
  
    let tempRoot: HTMLDivElement | null = null;
  
    try {
      toast.info("PDF 생성 중...");
  
      if (!sourceDetailPage) {
        throw new Error("이력서 영역을 찾을 수 없습니다");
      }
  
      const clonedDetailPage = sourceDetailPage.cloneNode(true) as HTMLElement;
  
      tempRoot = document.createElement("div");
      tempRoot.setAttribute("id", "resume-pdf-temp-root");
      tempRoot.style.position = "absolute";
      tempRoot.style.left = "-99999px";
      tempRoot.style.top = "0";
      tempRoot.style.width = "1200px";
      tempRoot.style.minWidth = "1200px";
      tempRoot.style.background = "#ffffff";
      tempRoot.style.zIndex = "-1";
      tempRoot.style.pointerEvents = "none";
      tempRoot.style.visibility = "visible";
      tempRoot.style.overflow = "visible";
      tempRoot.style.display = "block";
  
      clonedDetailPage.style.display = "block";
      clonedDetailPage.style.width = "1200px";
      clonedDetailPage.style.minWidth = "1200px";
      clonedDetailPage.style.background = "#ffffff";
      clonedDetailPage.style.overflow = "visible";
      clonedDetailPage.style.visibility = "visible";
      clonedDetailPage.style.height = "auto";
      clonedDetailPage.style.maxHeight = "none";
  
      clonedDetailPage
        .querySelectorAll(
          ".resume-sidebar, .resume-actions-bar, .resume-create-page__aside, .resume-controls-wrapper, .default_tabs, .is-sticky"
        )
        .forEach((el) => el.remove());
  
      const clonedContainer = clonedDetailPage.querySelector(
        ".resume-page__container"
      ) as HTMLElement | null;
  
      if (clonedContainer) {
        clonedContainer.style.display = "block";
        clonedContainer.style.width = "100%";
        clonedContainer.style.margin = "0";
        clonedContainer.style.padding = "28px 80px";
        clonedContainer.style.boxSizing = "border-box";
        clonedContainer.style.overflow = "visible";
        clonedContainer.style.height = "auto";
        clonedContainer.style.maxHeight = "none";
      }
  
      const clonedMain = clonedDetailPage.querySelector(
        ".resume-page__main"
      ) as HTMLElement | null;
  
      if (clonedMain) {
        clonedMain.style.width = "100%";
        clonedMain.style.margin = "0";
        clonedMain.style.padding = "0";
        clonedMain.style.background = "#ffffff";
        clonedMain.style.boxSizing = "border-box";
        clonedMain.style.overflow = "visible";
        clonedMain.style.height = "auto";
        clonedMain.style.maxHeight = "none";
      }
  
      const clonedTitle = clonedDetailPage.querySelector(
        ".resume-detail__title"
      ) as HTMLElement | null;
  
      if (clonedTitle) {
        clonedTitle.style.display = "none";
      }
  
      const clonedContent = clonedDetailPage.querySelector(
        ".resume-detail__content"
      ) as HTMLElement | null;
  
      if (clonedContent) {
        clonedContent.style.display = "flex";
        clonedContent.style.flexDirection = "column";
        clonedContent.style.alignItems = "flex-start";
        clonedContent.style.width = "100%";
        clonedContent.style.padding = "0";
        clonedContent.style.margin = "0";
        clonedContent.style.border = "none";
        clonedContent.style.borderRadius = "0";
        clonedContent.style.background = "#ffffff";
        clonedContent.style.gap = "0";
        clonedContent.style.overflow = "visible";
        clonedContent.style.height = "auto";
        clonedContent.style.maxHeight = "none";
      }
  
      const clonedBasic = clonedDetailPage.querySelector(
        ".resume-basic"
      ) as HTMLElement | null;
  
      if (clonedBasic) {
        clonedBasic.style.display = "flex";
        clonedBasic.style.flexDirection = "row";
        clonedBasic.style.alignItems = "flex-start";
        clonedBasic.style.padding = "40px 0";
        clonedBasic.style.background = "#ffffff";
        clonedBasic.style.borderBottom = "1px solid #E0E2E4";
        clonedBasic.style.overflow = "visible";
        clonedBasic.style.height = "auto";
        clonedBasic.style.maxHeight = "none";
      }
  
      tempRoot.appendChild(clonedDetailPage);
      document.body.appendChild(tempRoot);
  
      const images = Array.from(clonedDetailPage.querySelectorAll("img"));
      await Promise.all(
        images.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              })
        )
      );
  
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  
      const target = clonedContainer ?? clonedDetailPage;
      const width = target.scrollWidth || target.offsetWidth;
      const height = target.scrollHeight || target.offsetHeight;
  
      if (!width || !height) {
        throw new Error(`캡처 대상 크기가 0입니다: ${width} x ${height}`);
      }
  
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        width,
        height,
        windowWidth: width,
        windowHeight: height,
        scrollX: 0,
        scrollY: 0,
      });
  
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas 크기가 0입니다");
      }
  
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  
      let position = 0;
      let heightLeft = imgHeight - pdfHeight;
  
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
  
      while (heightLeft > 0) {
        pdf.addPage();
        position -= pdfHeight;
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
  
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const hh = String(now.getHours()).padStart(2, "0");
      const mi = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const dateTime = `${yyyy}${mm}${dd}_${hh}${mi}${ss}`;
  
      pdf.save(`jobkok_resume_${resumeData?.name ?? "resume"}_${dateTime}.pdf`);
      toast.success("PDF 다운로드 완료!");
    } catch (error) {
      console.error("❌ PDF 생성 실패:", error);
      toast.error("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      if (tempRoot && tempRoot.parentNode) {
        tempRoot.parentNode.removeChild(tempRoot);
      }
    }
  };

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

  useEffect(() => {
    if (actionType === "DOWNLOAD_PDF") {
      console.log('actionType',actionType);
      handleDownloadPdf();
      resetAction();
    }
  }, [actionType, resetAction]);

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
      category:act.category,
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

  // 
  const basicMeta =
    resumeData.birth && resumeData.gender
      ? formatMeta(resumeData.birth, resumeData.gender as "M" | "W")
      : "";

  // 
  const defaultModalTitle =
  nextDefaultState === false ? (
    <>기본이력서를 해지 하시겠습니까?</>
  ) : (
    <>
      해당 이력서를 기본 이력서로
      <br />
      변경하시겠습니까?
    </>
  );
  
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
                defaultIcon={ic_content_paste_gray900_20}
                items={buildMockInterviewItems(resumeData)}
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
                resumeData.profilePhotoFile?.filePath ?? ""
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
              defaultIcon={ic_content_paste_gray900_20}
              items={buildMockInterviewItems(resumeData)}
            />
          </div>
        </div>
        <div className="resume-controls-wrapper">
      <div className="resume-create-page__status">
        <span className="default_btn_black btn_w_full"
             onClick={handleEdit}>
          <img 
          src={Icons.ic_edit_white_20} alt="" />
          수정하기
        </span>
 
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
