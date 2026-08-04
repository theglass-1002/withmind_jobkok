// src/pages/Resume/ResumeList.tsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ResumeList.css";

import UiFilter, { UiFilterOption } from "@/shared/components/ui-filter/UiFilter";
import MenuList from "@/shared/components/menu/MenuList";
import resume_banner1200x218 from "@/assets/icons/resume_banner1200x218.png";
import resume_illustration_bg from "@/assets/illustrations/resume_illustration_bg.png";
import add_btn_white20x20 from "@/assets/icons/add_btn_white20x20.png";
import ic_more_dot_gray24x24 from "@/assets/icons/ic_more_dot_gray24x24.png";
import icon_career from "@/assets/icons/icon_career_gray700_20.png";
import icon_education from "@/assets/icons/icon_education_gray700_20.png";
import icon_role from "@/assets/icons/icon_role_gray700_20.png";
import icon_copy from "@/assets/icons/icon_content_copy_gray900_20.png";
import icon_trash from "@/assets/icons/icon_trash_red_20.png";
import icon_btn_black from "@/assets/icons/ic_add_btn_gray900_20.png";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import arrow_left from "@/assets/icons/keyboard_arrow_left.png";
import arrow_right from "@/assets/icons/keyboard_arrow_right.png";
import Pagination from "@/shared/components/Pagination";
import {
  fetchResumeList,
  deleteResume,
  fetchResumeDetail,
  createResume,
} from "@/api/resume/resume.api";
import { logout } from "@/api/auth/auth.api";
import { formatDate } from "@/shared/utils/util";
import { Storage } from "@/shared/utils/StorageManager";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ResumeItem,
  ResumeDetailResponse,
  CreateResumeRequest,
} from "@/api/resume/resume.types";
import { Icons } from "@/assets/icons";

type ResumeTabKey = "all" | "done" | "doing";

const extractS3Path = (url: string): string => {
  if (!url) return "";
  if (url.includes(".cloudfront.net/")) {
    return url.split(".cloudfront.net/")[1] || "";
  }
  return url;
};

const buildCopyTitle = (title?: string) => {
  const base = (title ?? "").trim();
  if (!base) return "이력서 사본";
  if (base.includes("(사본)")) return base;
  return `${base} (사본)`;
};

const guessContentType = (fileNameOrPath: string): string => {
  if (!fileNameOrPath) return "application/octet-stream";

  const extension = fileNameOrPath.split(".").pop()?.toLowerCase() || "";

  const contentTypeMap: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    txt: "text/plain",
  };

  return contentTypeMap[extension] || "application/octet-stream";
};

const mapDetailToCreatePayload = (
  data: ResumeDetailResponse
): CreateResumeRequest => {
  return {
    userIdx: Storage.getUserIdx(),
    isDefault: 0,
    temp: data.temp ?? "N",
    title: buildCopyTitle(data.title),
    name: data.name ?? "",
    email: data.email ?? "",
    gender: data.gender === "W" ? "W" : "M",
    phone: data.phone ?? "",
    birth: data.birth ?? "",

    ...(data.profilePhotoFile
      ? {
          profilePhotoFile: {
            filePath: extractS3Path(data.profilePhotoFile.filePath ?? ""),
            originalName: data.profilePhotoFile.originalName ?? "",
            storedName: data.profilePhotoFile.storedName ?? "",
            sizeBytes: data.profilePhotoFile.sizeBytes ?? 0,
            contentType: data.profilePhotoFile.contentType ?? "",
          },
        }
      : {}),

    regions: data.regionList ?? [],
    jobs: data.jobList ?? [],
    hardSkills: data.hardSkillList ?? [],
    softSkills: data.softSkillList ?? [],

    ...(data.careerList && data.careerList.length > 0
      ? {
          careers: data.careerList.map((career) => {
            const employedYn: "Y" | "N" =
              career.employedYn === "Y" ? "Y" : "N";

            return {
              employmentType: career.employmentType || "정규직",
              companyName: career.companyName ?? "",
              startYm: career.startYm ?? "",
              endYm: employedYn === "Y" ? null : (career.endYm ?? null),
              roleName: career.roleName ?? "",
              positionName: career.positionName ?? "",
              workAndResult: career.workAndResult ?? "",
              employedYn,
            };
          }),
        }
      : {}),

    educations: (data.educationList ?? []).map((edu) => ({
      schoolName: edu.schoolName ?? "",
      startYm: edu.startYm ?? "",
      endYm: edu.endYm ?? "",
      majorDegree: edu.majorDegree ?? "",
      graduatedYn: edu.graduatedYn ?? "",
    })),

    ...(data.activityList && data.activityList.length > 0
      ? {
          activities: data.activityList.map((act) => ({
            category: act.category ?? "교내활동",
            activityTitle: act.activityTitle ?? "",
            startYm: act.startYm ?? "",
            endYm: act.endYm ?? "",
            description: act.description ?? "",
            linkUrl: (act as any).linkUrl ?? "",
          })),
        }
      : {}),

    ...(data.licenseList && data.licenseList.length > 0
      ? {
          awardCerts: data.licenseList.map((item) => ({
            category: item.category ?? "",
            name: item.name ?? "",
            issuer: item.issuer ?? "",
            acquiredYm: item.acquiredYm ?? "",
            licenseNo: item.licenseNo ?? "",
            note: item.note ?? "",
          })),
        }
      : {}),

    ...(data.portfolioList && data.portfolioList.length > 0
      ? {
          portfolios: data.portfolioList.map((p, idx) => {
            if (p.itemType === "FILE") {
              const cleanPath = extractS3Path(p.filePath ?? "");
              const storedName =
                (p as any).storedName || (cleanPath ? cleanPath.split("/").pop() : "") || "";
              const originalName =
                p.title || storedName || `포트폴리오 문서 ${idx + 1}`;
              const sizeBytes = (p as any).sizeBytes || 1048576;
              const contentType =
                (p as any).contentType ||
                guessContentType(storedName || cleanPath);

              return {
                itemType: "FILE" as const,
                title: p.title || `포트폴리오 문서 ${idx + 1}`,
                docName: p.title || "",
                url: null,
                fileRef: cleanPath,
                description: p.description ?? "",
                sortOrder: idx + 1,
                portfolioFile: {
                  filePath: cleanPath,
                  originalName,
                  storedName,
                  sizeBytes,
                  contentType,
                },
              };
            }

            return {
              itemType: "URL" as const,
              title: p.title || `포트폴리오 ${idx + 1}`,
              docName: p.url || "",
              url: p.url ?? "",
              fileRef: null,
              description: p.description ?? "",
              sortOrder: idx + 1,
              portfolioFile: null,
            };
          }),
        }
      : {}),

    ...(data.selfIntroList && data.selfIntroList.length > 0
      ? {
          selfIntros: data.selfIntroList.map((item) => ({
            title: item.title ?? "소개",
            content: item.content ?? "",
            isAi: !!item.isAi,
          })),
        }
      : {}),
  };
};

export default function ResumeList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<ResumeTabKey>("all");
  const [resumeList, setResumeList] = useState<ResumeItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const filterOptions: UiFilterOption[] = [
    { label: "전체", value: "all" },
    { label: "작성완료", value: "done" },
    { label: "작성 중", value: "doing" },
  ];

  const pageSize = 10;

  const handleToggleMenu = (resumeIdx: number) => {
    setOpenMenuId((prev) => (prev === resumeIdx ? null : resumeIdx));
  };

  const handleItemClick = (resumeIdx: number) => {
    navigate(`/resumes/${resumeIdx}`);
  };

  const getStatusParam = (tab: ResumeTabKey): string => {
    if (tab === "doing") return "ING";
    if (tab === "done") return "DONE";
    return "ALL";
  };

  const loadResumeList = async (pageParam: number, tab: ResumeTabKey) => {
    try {
      setLoading(true);
      const status = getStatusParam(tab);
      console.log(`📋 [ResumeList] 이력서 리스트 요청 - 페이지: ${pageParam}, 탭: ${tab}, 상태: ${status}`);

      const { list, totalCount } = await fetchResumeList(
        pageParam,
        pageSize,
        status
      );

      console.log(`✅ [ResumeList] 이력서 리스트 조회 완료:`, {
        totalCount,
        listLength: list.length,
        list
      });

      setResumeList(list);
      setTotalCount(totalCount);
    } catch (e: any) {
      if (e.code === 999) {
        logout();
        navigate("/login");
      } else {
        console.error("❌ 이력서 리스트 조회 실패:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdfFromList = async (resumeIdx: number) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-99999px";
    iframe.style.top = "0";
    iframe.style.width = "1400px";
    iframe.style.height = "2000px";
    iframe.style.border = "0";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    iframe.src = `/resumes/${resumeIdx}`;

    try {
      toast.info("PDF 생성 중...");

      document.body.appendChild(iframe);

      await new Promise<void>((resolve) => {
        iframe.addEventListener("load", () => resolve(), { once: true });
      });

      const iframeDoc = iframe.contentDocument;
      if (!iframeDoc) throw new Error("iframe 문서 접근 실패");

      const waitForDetailPage = async (): Promise<HTMLElement> => {
        const maxWaitMs = 15000;
        const intervalMs = 200;
        const start = Date.now();

        while (Date.now() - start < maxWaitMs) {
          const el = iframeDoc.querySelector(
            "div.resume-page--detail:not(.mobile)"
          ) as HTMLElement | null;

          const basic = el?.querySelector(".resume-basic");
          if (el && basic) {
            return el;
          }

          await new Promise((r) => setTimeout(r, intervalMs));
        }

        throw new Error("이력서 영역 렌더링 대기 시간 초과");
      };

      const sourceDetailPage = await waitForDetailPage();

      const images = Array.from(sourceDetailPage.querySelectorAll("img"));
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

      const clonedDetailPage = sourceDetailPage.cloneNode(true) as HTMLElement;

      const tempRoot = document.createElement("div");
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

      if (clonedTitle) clonedTitle.style.display = "none";

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

      await new Promise((resolve) =>
        requestAnimationFrame(() => resolve(null))
      );
      await new Promise((resolve) =>
        requestAnimationFrame(() => resolve(null))
      );

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

      if (tempRoot.parentNode) tempRoot.parentNode.removeChild(tempRoot);

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

      const resumeItem = resumeList.find((r) => r.resumeIdx === resumeIdx);
      const resumeName = resumeItem?.title ?? "resume";

      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const hh = String(now.getHours()).padStart(2, "0");
      const mi = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const dateTime = `${yyyy}${mm}${dd}_${hh}${mi}${ss}`;

      pdf.save(`jobkok_resume_${resumeName}_${dateTime}.pdf`);
      toast.success("PDF 다운로드 완료!");
    } catch (error) {
      console.error("❌ PDF 생성 실패:", error);
      toast.error("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }
  };

  const handleDeleteResume = async (resumeIdx: number) => {
    try {
      const ok = window.confirm("이력서를 삭제할까요?");
      if (!ok) return;

      const res = await deleteResume(resumeIdx);

      if (res.code === 200) {
        setOpenMenuId(null);

        setResumeList((prev) => prev.filter((x) => x.resumeIdx !== resumeIdx));
        setTotalCount((prev) => Math.max(0, prev - 1));

        if (resumeList.length === 1 && page > 1) {
          const nextPage = page - 1;
          setPage(nextPage);
          await loadResumeList(nextPage, activeTab);
        } else {
          await loadResumeList(page, activeTab);
        }
        return;
      }

      const msg =
        (res as any).msssage ||
        (res as any).message ||
        res.msg ||
        "삭제에 실패했습니다.";
      alert(msg);
    } catch (e: any) {
      console.error("❌ 이력서 삭제 실패:", e);
      if (e?.code === 999 || e?.code === 401) {
        logout();
        navigate("/login");
        return;
      }
      alert(e?.message || "삭제 중 오류가 발생했습니다.");
    }
  };

  const handleCopyResume = async (resumeIdx: number) => {
    try {
      setLoading(true);
      setOpenMenuId(null);

      const detail = await fetchResumeDetail(resumeIdx);
   

      const payload = mapDetailToCreatePayload(detail);
    

      const result = await createResume(payload);
   

      toast.success("이력서 사본이 생성되었습니다.");

      await loadResumeList(page, activeTab);
    } catch (e: any) {
      console.error("❌ 이력서 사본 생성 실패:", e);

      if (e?.code === 999 || e?.code === 401) {
        logout();
        navigate("/login");
        return;
      }

      toast.error(
        e?.response?.data?.message ||
          e?.response?.data?.msg ||
          e?.message ||
          "사본 만들기 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSelect = async (resumeIdx: number, value: string) => {
    if (value === "copy") {
      await handleCopyResume(resumeIdx);
      return;
    }

    if (value === "pdf") {
      console.log("pdf 로 저장클릭");
      setOpenMenuId(null);
      await handleDownloadPdfFromList(resumeIdx);
      return;
    }

    if (value === "delete") {
      await handleDeleteResume(resumeIdx);
      return;
    }

    setOpenMenuId(null);
  };

  useEffect(() => {
    loadResumeList(page, activeTab);
  }, [page, activeTab]);

  useEffect(() => {
    if (openMenuId === null) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const actionsArea = target.closest(".resume-item__actions");
      if (!actionsArea) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenuId]);

  const handleTabChange = (val: string | number) => {
    const tab = val as ResumeTabKey;
    setActiveTab(tab);
    setPage(1);
  };

  const filteredList = resumeList;
  const doneCount = filteredList.filter((item) => item.temp === "N").length;
  const totalPage = Math.max(1, Math.ceil(totalCount / pageSize));
  const pageItems = filteredList;

  if (loading) {
    return <LoadingOverlay isLoading={true} />;
  }

  return (
    <>
      <div className="resume-list-page__container">
        <div className="resume-list-page">
          <div className="resume-list-page__banner">
            <img src={resume_banner1200x218} alt="이력서 배너" />
          </div>
          <div className="resume-list-page__banner mobile">
            <img src={resume_illustration_bg} alt="이력서 배너" />
            <span className="resume-cta-banner__subtitle">
              적합 공고 추천부터 맞춤 예상 질문까지
            </span>
            <div className="resume-cta-banner__content">
              <span className="resume-cta-banner__heading-line">
                지금 바로 이력서를 작성하고,
              </span>
              <span className="resume-cta-banner__heading-line">
                합격 가능성을
              </span>
              <span className="resume-cta-banner__heading-line">
                한층 더 높여보세요!
              </span>
            </div>
          </div>

          <div className="resume-list-page__body">
            <div className="resume-list-page__header">
              <span className="resume-list-page__stat resume-list-page__stat--total">
                총 <em>{totalCount}건</em>
              </span>
              <span className="resume-list-page__stat resume-list-page__stat--done">
                작성 완료 <em>{doneCount}건</em>
              </span>
            </div>

            <div className="resume-list-page__tabs">
              <UiFilter
                options={filterOptions}
                value={activeTab}
                onChange={handleTabChange}
                className="resume-list-page__tabs-group"
                itemClassName="resume-list-page__tab"
              />
              <NavLink
                to="/resumes/create"
                className="create_resumes default_btn_black"
              >
                <img src={add_btn_white20x20} alt="" />
                새 이력서 작성
              </NavLink>

              <NavLink
                to="/resumes/m-create"
                className="create_resumes mobile default_btn_black"
              >
                <img src={add_btn_white20x20} alt="" />
                새 이력서 작성
              </NavLink>
            </div>

            {pageItems.length === 0 ? (
              <div className="resume-list-page__empty">
                <div className="resume-list-page__empty-copy">
                  <span className="resume-list-page__empty-title">
                    아직 작성 중인 이력서가 없습니다.
                  </span>
                  <span className="resume-list-page__empty-subtext">
                    AI 기반의 문장 및 키워드 추천 기능으로 간편하게 작성해
                    보세요.
                  </span>
                </div>
                <NavLink
                  to="/resumes/create"
                  className="create_resumes default_btn_white"
                >
                  <img src={icon_btn_black} alt="" />
                  새 이력서 작성
                </NavLink>
              </div>
            ) : (
              <>
                <div className="resume-list-page__list">
                  <ul className="resume-list-page__grid">
                    {pageItems.map((item) => (
                      <li
                        key={item.resumeIdx}
                        className="resume-list-page__item"
                        onClick={() => handleItemClick(item.resumeIdx)}
                      >
                        <div className="resume-item__top">
                          <div className="resume-item__meta">
                            <span className="resume-item__id">
                              {item.resumeIdx}
                            </span>
                            {item.isDefault === 1 && (
                              <span className="resume-item__tag on">
                                기본이력서
                              </span>
                            )}
                            {item.temp === "Y" && (
                              <span className="resume-item__tag writing">
                                작성 중
                              </span>
                            )}
                          </div>

                          <div className="resume-item__actions">
                            <img
                              className="resume-item__edit-btn"
                              src={ic_more_dot_gray24x24}
                              alt="더보기"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleMenu(item.resumeIdx);
                              }}
                            />

                            {openMenuId === item.resumeIdx && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <MenuList
                                  className="resume-item__menu"
                                  options={[
                                    {
                                      label: "사본 만들기",
                                      value: "copy",
                                      icon: icon_copy,
                                    },
                                    {
                                      label: "PDF로 저장",
                                      value: "pdf",
                                      icon: Icons.ic_download_gray900_20,
                                    },
                                    {
                                      label: "삭제",
                                      value: "delete",
                                      icon: icon_trash,
                                      className: "delete",
                                    },
                                  ]}
                                  onSelect={(value) =>
                                    handleMenuSelect(item.resumeIdx, value)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="resume-item__title-row">
                          <span className="resume-item__title">
                            {item.title}
                          </span>
                          <span className="resume-item__date">
                            {formatDate(item.updatedAt)}
                          </span>
                        </div>

                        <div className="resume-item__attrs">
                          <div className="resume-item__attr resume-item__attr--role">
                            <div className="resume-item__attr-term">
                              <img src={icon_role} alt="" />
                              희망직무
                            </div>
                            <span className="resume-item__attr-value">
                              {item.hopeJobs}
                            </span>
                          </div>

                          <div className="resume-item__attr resume-item__attr--career">
                            <div className="resume-item__attr-term">
                              <img src={icon_career} alt="" />
                              경력
                            </div>
                            <span className="resume-item__attr-value">
                              {item.careerPeriod !== "0년 0개월" ? item.careerPeriod : ""}
                            </span>
                          </div>

                          <div className="resume-item__attr resume-item__attr--education">
                            <div className="resume-item__attr-term">
                              <img src={icon_education} alt="" />
                              학력
                            </div>
                            <span className="resume-item__attr-value">
                              {item.educationSummary}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="job-posting__pagination">
                  <Pagination
                    current={page}
                    total={totalPage}
                    onChange={setPage}
                    pageWindow={5}
                    prevIcon={
                      <img src={arrow_left} alt="" aria-hidden="true" />
                    }
                    nextIcon={
                      <img src={arrow_right} alt="" aria-hidden="true" />
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}