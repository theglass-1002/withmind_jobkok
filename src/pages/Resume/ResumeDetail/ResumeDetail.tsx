import React, { useState, useRef } from "react"; 
import "@/pages/Resume/Resume.css";
import "./ResumeDetail.css";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from "html2canvas";        
import jsPDF from "jspdf";                       
import Switch from "react-switch";
import {useStickyTabs,tabItems,} from '@/shared/utils/util';
import Tabs from "@/shared/components/tabs/Tabs";
import ResumeSidebar, {
  type SectionId,
  type Status,
} from "@/pages/Resume/ResumeSidebar/ResumeSidebar";
import Modal from "@/shared/components/modal/Modal";
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

// --- 위쪽(파일 상단) 추가: 타입 + 더미 데이터 (API 연동 전에 사용) ---
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

const commonBullets: string[] = [
  "• 면접 분석 서비스 API 설계 및 FastAPI 기반 서버 구축",
  "• RabbitMQ, Redis 기반 비동기 영상 처리 파이프라인 설계",
  "• GCP Cloud Run + Cloud Tasks 전환으로 처리 시간 35% 개선",
  "• 서비스 응답 속도 1.2s → 0.6s 단축",
  "• GPU 서버 병목 제거로 모델 동시 실행 성능 2배 향상",
];

const careerItems: CareerItem[] = [
  {
    company: "위드마인드",
    start: "2020.04",
    end: "재직중",
    isCurrent: true,
    tenure: "(0년 0개월)",
    employment: "정규직",
    role: "프론트엔드 개발자",
    level: "매니저",
    bullets: commonBullets,
  },
  {
    company: "마인드위드",
    start: "2018.01",
    end: "2020.03",
    isCurrent: false,
    tenure: "(2년 3개월)",
    employment: "정규직",
    role: "프론트엔드 개발자",
    level: "시니어",
    bullets: [
      "• React 기반 사내 Admin 대시보드 설계/구축",
      "• Webpack 빌드 최적화 및 번들 크기 30% 감소",
      "• 디자인 시스템(Storybook) 도입 및 컴포넌트 표준화",
      "• 주요 페이지 LCP 45% 개선",
      "• 접근성 가이드 정립 및 자동화 검사 도입",
    ],
  },
];


export default function ResumeDetail() {
  const [activeTab, setActiveTab] = useState("title");
  const resumeRef = useRef<HTMLDivElement | null>(null); 
  const [isDefaultResume, setIsDefaultResume] = useState(false);
  const [showDefaultModal, setShowDefaultModal] = useState(false); // 기본 이력서 설정 모달
  const [sidebarStatus, setSidebarStatus] = useState<
    Partial<Record<SectionId, Status>>
  >({});

  const isTabsSticky = useStickyTabs(
    "sticky-trigger",
    ".default_tabs",
    ".page-header"
  );

  const handleTabClick = (key: string) => {
    setActiveTab(key);
    console.log('선택 된 탭', key);
  
    if (key === 'title'||key==='basic') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const targetId = `resume-field--${key}`;
    console.log(targetId);
    const targetElement = document.querySelector(`.${targetId}`) as HTMLElement | null;
    console.log(targetElement);
  
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  

  const handleToggle = (checked: boolean) => {
    console.log(checked);
    if (checked) {
      setShowDefaultModal(true);
    } else {
      // 끄는 건 그냥 끄기
      setIsDefaultResume(false);
    }
  };
  const handleConfirmDefaultResume = () => {
    setIsDefaultResume(true);
    setShowDefaultModal(false);
    toast.success("기본 이력서로 설정되었습니다.");
  };

  const handleCancelDefaultResume = () => {
    setShowDefaultModal(false);
    // 스위치 값은 그대로 false 유지
  };

  const handleTempSave = () => {
    toast.success("임시 저장되었습니다.");
  };

  const handleSubmit = () => {
    const next: Partial<Record<SectionId, Status>> = {};
    ALL_SECTIONS.forEach((id) => {
      next[id] = "completed";
    });
    setSidebarStatus(next);
  };

  const handleDownloadPdf = async () => {
    console.log('다운');

    if (!resumeRef.current) return;

    const wrapper = resumeRef.current;

    // 1) A4 레이아웃용 클래스 추가
    wrapper.classList.add("resume-page--pdf");

    // 레이아웃 적용될 시간 살짝 주기
    await new Promise((r) => setTimeout(r, 0));

    try {
      // 2) 화면 캡쳐
      const canvas = await html2canvas(wrapper, {
        scale: 2, // 해상도 업
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // 3) jsPDF로 A4 사이즈 PDF 생성
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

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
      // 4) 클래스 제거해서 화면 레이아웃 원복
      wrapper.classList.remove("resume-page--pdf");
    }
  };


  return (
    <>
    <div  
    className="resume-page resume-page--detail">
      <ResumeActionsBar 
      onDownloadPdf={handleDownloadPdf} 
      onTempSave={handleTempSave} onSubmit={handleSubmit} />

      <div className="resume-page__container">
        <div className="resume-page__main"
            ref={resumeRef} 
        >
          <ResumeHeaderTitle text="성장하는 개발자, 준비된 홍길동입니다." />

          <div className="resume-detail__content">
            <ResumeBasicInfo
              name="홍길동"
              meta="2000년생(만 23세), 남성"
              email="hong1234@withmind.net"
              phone="010-1234-5678"
              imageSrc={test_resume_img}
            />

            <ResumeFieldSection
              label="희망 근무 지역"
              className="resume-field--location"
              valueAs="div"
              valueClassName="resume-location-list"
            >
              <ResumeLocationList
                items={[
                  { city: "서울", district: "강남구" },
                  { city: "서울", district: "용산구" },
                ]}
              />
            </ResumeFieldSection>
            <ResumeCareerSection
              totalLabel="(총 0년 0개월)"
              items={careerItems}
            />
          <ResumeEducationSection
                school="위드대학교"
                start="2010.03"
                end="2015.03"
                major="컴퓨터공학과"
                status="졸업"
              />
          <ResumeDesiredRoleSection
              items={["자바 개발자", "웹 개발자", "프론트엔드 개발자"]}
            />
          <ResumeHardSkillsSection items={["자바", "피그마"]} />
          <ResumeSoftSkillsSection items={["팀워크", "공감 능력"]} />
          <ResumeActivitiesSection
            items={[
              {
                title: "[교육 이수] 임베디드 소프트웨어 융합 풀스택 과정",
                start: "2016.06",
                end: "2017.03",
                bullets: ["커머스 플랫폼 스타트업 대표와 개발자들의 시장 분석 및 실제 시뮬레이션 적용"],
              },
            ]}
          />        
        <ResumeAwardsSection
          items={[
            { title: "[자격증] 정보처리기사", start: "2017.09", issuer: "한국산업인력공단" },
            { title: "[수상] SW 공모전 우수상", start: "2022.11", issuer: "OO대학교" },
          ]}
        />
        <ResumePortfolioSection
            defaultIcons={{ file: ic_folder_gray900_20, link: ic_link_gray900_20 }}
            items={[
              { kind: "file", name: "홍길동_포트폴리오.pdf" },
              { kind: "link", url: "https://interview.kr" },
            ]}
          />

          <ResumeSelfIntroSection
            text={
              "5년 8개월차 JAVA 개발자 홍길동입니다. Spring Boot와 JPA를 활용한 백엔드 개발 및 API 설계 경험이 있으며, 성능 최적화와 데이터베이스 설계에 강점을 가지고 있습니다. 최근에는 MSA 및 CI/CD 구축을 통해 서비스 확장성과 자동화를 경험했습니다. 효율적인 시스템 개발과 문제 해결을 통해 성장하는 개발자가 되고 싶습니다."
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
        <ResumeSidebar statusMap={sidebarStatus} />
      </div>

   
    </div>
    <div  
    className="resume-page resume-page--detail mobile">
      {/* <ResumeActionsBar 
      onDownloadPdf={handleDownloadPdf} 
      onTempSave={handleTempSave} onSubmit={handleSubmit} /> */}

     
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
            
        <div id="sticky-trigger" className="resume-page__main"
            ref={resumeRef} 
        >
          <ResumeHeaderTitle 
          text="성장하는 개발자, 준비된 홍길동입니다." />

          <div className="resume-detail__content">
            <ResumeBasicInfo
              name="홍길동"
              meta="2000년생(만 23세), 남성"
              email="hong1234@withmind.net"
              phone="010-1234-5678"
              imageSrc={test_resume_img}
            />

            <ResumeFieldSection
              label="희망 근무 지역"
              className="resume-field--location"
              valueAs="div"
              valueClassName="resume-location-list"
            >
              <ResumeLocationList
                items={[
                  { city: "서울", district: "강남구" },
                  { city: "서울", district: "용산구" },
                ]}
              />
            </ResumeFieldSection>
            <ResumeCareerSection
              totalLabel="(총 0년 0개월)"
              items={careerItems}
            />
          <ResumeEducationSection
                school="위드대학교"
                start="2010.03"
                end="2015.03"
                major="컴퓨터공학과"
                status="졸업"
              />
          <ResumeDesiredRoleSection
              items={["자바 개발자", "웹 개발자", "프론트엔드 개발자"]}
            />
          <ResumeHardSkillsSection items={["자바", "피그마"]} />
          <ResumeSoftSkillsSection items={["팀워크", "공감 능력"]} />
          <ResumeActivitiesSection
            items={[
              {
                title: "[교육 이수] 임베디드 소프트웨어 융합 풀스택 과정",
                start: "2016.06",
                end: "2017.03",
                bullets: ["커머스 플랫폼 스타트업 대표와 개발자들의 시장 분석 및 실제 시뮬레이션 적용"],
              },
            ]}
          />        
        <ResumeAwardsSection
          items={[
            { title: "[자격증] 정보처리기사", start: "2017.09", issuer: "한국산업인력공단" },
            { title: "[수상] SW 공모전 우수상", start: "2022.11", issuer: "OO대학교" },
          ]}
        />
        <ResumePortfolioSection
            defaultIcons={{ file: ic_folder_gray900_20, link: ic_link_gray900_20 }}
            items={[
              { kind: "file", name: "홍길동_포트폴리오.pdf" },
              { kind: "link", url: "https://interview.kr" },
            ]}
          />

          <ResumeSelfIntroSection
            text={
              "5년 8개월차 JAVA 개발자 홍길동입니다. Spring Boot와 JPA를 활용한 백엔드 개발 및 API 설계 경험이 있으며, 성능 최적화와 데이터베이스 설계에 강점을 가지고 있습니다. 최근에는 MSA 및 CI/CD 구축을 통해 서비스 확장성과 자동화를 경험했습니다. 효율적인 시스템 개발과 문제 해결을 통해 성장하는 개발자가 되고 싶습니다."
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
        {/* <ResumeSidebar statusMap={sidebarStatus} /> */}
     
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
