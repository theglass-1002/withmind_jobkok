import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./ResumeList.css";
import UiFilter, {UiFilterOption} from "@/shared/components/ui-filter/UiFilter";
import MenuList from "@/shared/components/menu/MenuList";
import resume_banner1200x218 from "@/assets/icons/resume_banner1200x218.png";
import resume_illustration_bg from "@/assets/illustrations/resume_illustration_bg.png";
import add_btn_white20x20 from "@/assets/icons/add_btn_white20x20.png";
import ic_more_dot_gray24x24 from "@/assets/icons/ic_more_dot_gray24x24.png";
import icon_career from "@/assets/icons/icon_career_gray700_20.png";
import icon_education from "@/assets/icons/icon_education_gray700_20.png";
import icon_role from "@/assets/icons/icon_role_gray700_20.png";
import icon_copy from "@/assets/icons/icon_content_copy_gray900_20.png";
import icon_download from "@/assets/icons/icon_download_gray900_20.png";
import icon_trash from "@/assets/icons/icon_trash_red_20.png";
import icon_btn_black from "@/assets/icons/ic_add_btn_gray900_20.png";
import arrow_left from "@/assets/icons/keyboard_arrow_left.png";
import arrow_right from "@/assets/icons/keyboard_arrow_right.png";
import Pagination from "@/shared/components/Pagination";
import { fetchResumeList, ResumeItem } from "@/api/resume/resume.api";
import { logout } from "@/api/auth.api";
import { formatDate, scrollToTop } from "@/shared/utils/util";


type ResumeTabKey = "all" | "done" | "doing";
export default function ResumeList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<ResumeTabKey>("all");
  const [resumeList, setResumeList] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null); // 열려 있는 메뉴의 resumeIdx

  const filterOptions: UiFilterOption[] = [
    { label: "전체", value: "all" },
    { label: "작성완료", value: "done" },
    { label: "작성 중", value: "doing" },
  ];

  const pageSize = 8;
  const handleToggleMenu = (resumeIdx: number) => {
    setOpenMenuId((prev) => (prev === resumeIdx ? null : resumeIdx));
  };

  const handleMenuSelect = (resumeIdx: number, value: string) => {
    if (value === "copy") console.log("사본 만들기", resumeIdx);
    if (value === "pdf") console.log("PDF 저장", resumeIdx);
    if (value === "delete") console.log("삭제", resumeIdx);
    setOpenMenuId(null);
  };

  // 이력서 리스트 가져오는 함수 (이전 load)
  const loadResumeList = async () => {
    try {
      const list = await fetchResumeList();
      setResumeList(list);
    } catch (e: any) {
      console.log(e);
      if (e.code === 999) {
        console.log("로그인만료");
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // 화면 들어올 때마다(컴포넌트 마운트마다) 리스트 가져오기
  useEffect(() => {
    loadResumeList();
  }, []);

  //  메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (openMenuId === null) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const actionsArea = target.closest(".resume-item__actions");
      // resume-item__actions 밖을 클릭하면 메뉴 닫기
      if (!actionsArea) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenuId]);

  // TODO: activeTab(전체/작성완료/작성중)에 따라 필터링 로직 나중에 추가
  const filteredList = resumeList;

  const totalCount = filteredList.length;
  const doneCount = filteredList.length; // 백엔드에서 상태 내려주면 조건으로 바꾸기

  const totalPage = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (page - 1) * pageSize;
  const pageItems = filteredList.slice(startIndex, startIndex + pageSize);



  return (
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
          <span className="resume-cta-banner__heading-line">합격 가능성을</span>
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
            onChange={(val) => setActiveTab(val as ResumeTabKey)}
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
        {pageItems.length===0?(
          <div className="resume-list-page__empty">
            <div className="resume-list-page__empty-copy">
              <span className="resume-list-page__empty-title">
                아직 작성 중인 이력서가 없습니다.
              </span>
              <span className="resume-list-page__empty-subtext">
                AI 기반의 문장 및 키워드 추천 기능으로 간편하게 작성해 보세요.
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

        ): 
        <div className="resume-list-page__list">
         <ul className="resume-list-page__grid">
          {pageItems.map((item) => (
            <li key={item.resumeIdx} className="resume-list-page__item">
              <div className="resume-item__top">
                <div className="resume-item__meta">
                  <span className="resume-item__id">{item.resumeIdx}</span>
                  {item.isDefault === 1 && (
                    <span className="resume-item__tag on">기본이력서</span>
                  )}
                </div>

                <div className="resume-item__actions">
                  <img
                    className="resume-item__edit-btn"
                    src={ic_more_dot_gray24x24}
                    alt="더보기"
                    onClick={(e) => {
                      e.stopPropagation(); // 혹시 상위로 클릭 전파되는 것 방지
                      handleToggleMenu(item.resumeIdx);
                    }}
                  />
                  {openMenuId === item.resumeIdx && (
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
                          icon: icon_download,
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
                  )}
                </div>
              </div>
            <div className="resume-item__title-row">
                 <span className="resume-item__title">{item.title}</span>
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
                         {item.careerPeriod}
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
           <div className="job-posting__pagination">
        <Pagination
          current={page}
          total={totalPage}
          onChange={setPage}
          pageWindow={5}
          prevIcon={<img src={arrow_left} alt="" aria-hidden="true" />}
          nextIcon={<img src={arrow_right} alt="" aria-hidden="true" />}
        />
      </div>
      </div>
      }

      </div>

 
    </div>
    </div>

  );
}

