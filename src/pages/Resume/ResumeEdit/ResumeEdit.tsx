// src/pages/Resume/ResumeEdit.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@/pages/Resume/ResumeCreate.css";

import BasicInfoSection, {
  type BasicInfo,
  type BasicErrors,
} from "@/pages/Resume/ResumeCreate/BasicInfoSection/BasicInfoSection";
import LocationSection from "@/pages/Resume/ResumeCreate/LocationSection/LocationSection";
import CareerSection from "@/pages/Resume/ResumeCreate/CareerSection/CareerSection";
import EducationSection from "@/pages/Resume/ResumeCreate/EducationSection/EducationSection";
import DesiredRoleSection from "@/pages/Resume/ResumeCreate/DesiredRoleSection/DesiredRoleSection";
import HardSkillSection from "@/pages/Resume/ResumeCreate/HardSkillSection/HardSkillSection";
import SoftSkillsSection from "@/pages/Resume/ResumeCreate/SoftSkillsSection/SoftSkillsSection";
import ActivitiesSection from "@/pages/Resume/ResumeCreate/ActivitiesSection/ActivitiesSection";
import AwardsCertificationsSection from "@/pages/Resume/ResumeCreate/AwardsCertificationsSection/AwardsCertificationsSection";
import PortfolioDocumentsSection from "@/pages/Resume/ResumeCreate/PortfolioDocumentsSection/PortfolioDocumentsSection";
import SelfIntroductionSection from "@/pages/Resume/ResumeCreate/SelfIntroductionSection/SelfIntroductionSection";
import MockInterviewAnalysisSection from "@/pages/Resume/ResumeCreate/MockInterviewAnalysisSection/MockInterviewAnalysisSection";



import AISuggestArea from "@/pages/Resume/ResumeAISuggest";
import Modal from "@/shared/components/modal/Modal";

import ResumeSidebar, {
  type SectionId,
  type Status,
} from "@/pages/Resume/ResumeSidebar/ResumeSidebar";

import ic_star_gray700_20 from "@/assets/icons/size20/ic_star_gray700_20.png";
import ic_star_green_20 from "@/assets/icons/size20/ic_star_green_20.png";
import ic_download_gray900_20 from "@/assets/icons/size20/ic_download_gray900_20.png";
import ic_edit_cancle_gray900_20 from "@/assets/icons/size20/ic_edit_cancle_gray900_20.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MOCK: {
  id: string;
  basic: BasicInfo;
  location: { city: string; district?: string }[];
  career: Array<{
    company: string;
    start: string;
    end: string;
    isCurrent?: boolean;
    tenure: string;
    employment?: string;
    role?: string;
    level?: string;
    bullets: string[];
  }>;
  education: Array<{
    school: string;
    start: string;
    end: string;
    major: string;
    status: string;
  }>;
  desiredRole: string[];
  hardSkills: string[];
  softSkills: string[];
  activities: Array<{ title: string; start: string; end?: string; bullets?: string[] }>;
  awards: Array<{ title: string; start: string; end?: string; issuer?: string }>;
  portfolio: Array<{ kind: "file" | "link"; name?: string; url?: string }>;
  selfIntro: string;
  mockInterview: Array<{ title: string }>;
} = {
  id: "13",
  basic: {
    name: "홍길동",
    birth: "2000-01-01",
    gender: "male" as any,
    email: "hong1234@withmind.net",
    phone: "010-1234-5678",
    photoUrl: "",
  },
  location: [
    { city: "서울", district: "강남구" },
    { city: "서울", district: "용산구" },
  ],
  career: [
    {
      company: "위드마인드",
      start: "2020.04",
      end: "재직중",
      isCurrent: true,
      tenure: "(0년 0개월)",
      employment: "정규직",
      role: "프론트엔드 개발자",
      level: "매니저",
      bullets: [
        "• 면접 분석 서비스 API 설계 및 FastAPI 기반 서버 구축",
        "• RabbitMQ, Redis 기반 비동기 영상 처리 파이프라인 설계",
        "• GCP Cloud Run + Cloud Tasks 전환으로 처리 시간 35% 개선",
        "• 서비스 응답 속도 1.2s → 0.6s 단축",
        "• GPU 서버 병목 제거로 모델 동시 실행 성능 2배 향상",
      ],
    },
    {
      company: "마인드위드",
      start: "2018.01",
      end: "2020.03",
      tenure: "(2년 3개월)",
      employment: "정규직",
      role: "프론트엔드 개발자",
      level: "시니어",
      bullets: [
        "• React 기반 사내 Admin 대시보드 설계/구축",
        "• Webpack 최적화로 번들 30% 감소",
        "• Storybook 디자인 시스템 도입",
        "• LCP 45% 개선",
        "• 접근성 자동화 검사 도입",
      ],
    },
  ],
  education: [
    { school: "위드대학교", start: "2010.03", end: "2015.03", major: "컴퓨터공학과", status: "졸업" },
  ],
  desiredRole: ["자바 개발자", "웹 개발자", "프론트엔드 개발자"],
  hardSkills: ["자바", "피그마", "React", "TypeScript"],
  softSkills: ["팀워크", "공감 능력", "문제 해결", "커뮤니케이션"],
  activities: [
    {
      title: "[교육 이수] 임베디드 소프트웨어 융합 풀스택 과정",
      start: "2016.06",
      end: "2017.03",
      bullets: ["커머스 플랫폼 스타트업과 시장 분석 및 시뮬레이션 적용"],
    },
  ],
  awards: [
    { title: "[자격증] 정보처리기사", start: "2017.09", issuer: "한국산업인력공단" },
    { title: "[수상] SW 공모전 우수상", start: "2022.11", issuer: "OO대학교" },
  ],
  portfolio: [
    { kind: "file", name: "홍길동_포트폴리오.pdf" },
    { kind: "link", url: "https://interview.kr" },
  ],
  selfIntro:
    "5년 8개월차 JAVA 개발자 홍길동입니다. Spring Boot와 JPA를 활용한 백엔드 개발 및 API 설계 경험이 있으며, 성능 최적화와 데이터베이스 설계에 강점을 가지고 있습니다. 최근에는 MSA 및 CI/CD 구축을 통해 서비스 확장성과 자동화를 경험했습니다. 효율적인 시스템 개발과 문제 해결을 통해 성장하는 개발자가 되고 싶습니다.",
  mockInterview: [
    { title: "82점ㆍ프론트엔드 개발자ㆍ25.01.01 [성장하는 개발자, 준비된 홍길동입니다.]" },
  ],
};

type FormState = { basic: BasicInfo };
const initial: FormState = {
  basic: { name: "", birth: "", gender: null, email: "", phone: "", photoUrl: "" },
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

export default function ResumeEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const resumeId = params.resumeId ?? MOCK.id;

  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<{ basic: BasicErrors }>({ basic: {} });
  const [isDefaultResume, setIsDefaultResume] = useState(false);
  const [sidebarStatus, setSidebarStatus] =
    useState<Partial<Record<SectionId, Status>>>({});

  const [title, setTitle] = useState<string>("");
  const [showAISuggest, setShowAISuggest] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setForm({ basic: MOCK.basic });
    setTitle(MOCK.basic.name);
  }, []);

  const updateBasic = (patch: Partial<BasicInfo>) =>
    setForm((prev) => ({ ...prev, basic: { ...prev.basic, ...patch } }));

  const resetBasicErrors = () => setErrors((prev) => ({ ...prev, basic: {} }));

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

  const handleClickAISuggest = () => {
    setAISuggestions([
      " • 성장하는 개발자, 준비된 홍길동입니다.",
      " • 안녕하세요. 프론트엔드 개발자 홍길동입니다.",
      " • 위드마인드 지원자 홍길동입니다.",
    ]);
    setShowAISuggest(true);
  };

  const handlePickSuggestion = (text: string) => {
    setTitle(text);
  };

  const handleCloseAISuggest = () => setShowAISuggest(false);

  // 수정 취소 모달 관련
  const openCancelConfirm = () => setShowConfirm(true);
  const handleConfirmCancel = () => {
    setShowConfirm(false);
    navigate(`/resumes/${resumeId}`);
  };
  const handleCloseConfirm = () => setShowConfirm(false);

  return (
    <div className="resume-edit-page resume-create-page">
      <div className="resume-page__status">
        <div className="resume-detail__actions-left">
          <span className="default_btn_white">
            <img src={ic_download_gray900_20} alt="" />
            PDF로 저장
          </span>
          <span
            className="default_btn_white"
            role="button"
            onClick={openCancelConfirm}
            aria-label="수정 취소 확인"
          >
            <img src={ic_edit_cancle_gray900_20} alt="" />
            수정 취소
          </span>
        </div>
        <div className="resume-detail__actions-right">
          <span className="default_btn_white" onClick={handleTempSave}>
            임시저장
          </span>
          <span className="default_btn_black" onClick={handleSubmit}>
            작성 완료
          </span>
        </div>
      </div>

      <div className="resume-edit-page__container resume-create-page__container">
        <div className="resume-edit-page__main resume-create-page__main">
          <div className="resume-edit-page__section resume-create-page__section resume-edit-page__section--title resume-create-page__section--title">
            <div className="resume-edit-page__field resume-create-page__field">
              <input
                className="resume-edit-page__label resume-create-page__label"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="이력서 제목을 입력해 주세요. *"
              />
            </div>

            <AISuggestArea
              show={showAISuggest}
              items={aiSuggestions}
              onOpen={handleClickAISuggest}
              onClose={handleCloseAISuggest}
              onPick={handlePickSuggestion}
              starIconGray={ic_star_gray700_20}
              starIconGreen={ic_star_green_20}
              closeIcon={ic_close_gray500_20}
            />
          </div>

          <BasicInfoSection
            values={form.basic}
            errors={errors.basic}
            onChange={updateBasic}
            onFocusAny={resetBasicErrors}
          />

          <LocationSection {...({ initialItems: MOCK.location } as any)} />
          <CareerSection {...({ initialItems: MOCK.career } as any)} />
          <EducationSection {...({ initialItems: MOCK.education } as any)} />
          <DesiredRoleSection {...({ initialItems: MOCK.desiredRole } as any)} />
          <HardSkillSection {...({ initialItems: MOCK.hardSkills } as any)} />
          <SoftSkillsSection {...({ initialItems: MOCK.softSkills } as any)} />
          <ActivitiesSection {...({ initialItems: MOCK.activities } as any)} />
          <AwardsCertificationsSection {...({ initialItems: MOCK.awards } as any)} />
          <PortfolioDocumentsSection {...({ initialItems: MOCK.portfolio } as any)} />
          <SelfIntroductionSection {...({ initialText: MOCK.selfIntro } as any)} />
          <MockInterviewAnalysisSection {...({ initialItems: MOCK.mockInterview } as any)} />
        </div>

        <ResumeSidebar
          statusMap={sidebarStatus}
          isDefault={isDefaultResume}
          onToggleDefault={setIsDefaultResume}
        />
      </div>

      <Modal
        open={showConfirm}
        title="수정사항을 저장하지 않고 취소하시겠습니까?"
        confirmText="예"
        confirmClassName="btn_w_full default_btn_black"
        cancelText="계속 작성"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleConfirmCancel}
        onClose={handleCloseConfirm}
      />
    </div>
  );
}
