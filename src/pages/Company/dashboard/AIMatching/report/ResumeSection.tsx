import React from "react";
import test_resume_img from "@/assets/testImg/test_resume_img.png";
import ic_link_gray900_20 from "@/assets/icons/size20/ic_link_gray900_20.png";
import ic_folder_gray900_20 from "@/assets/icons/size20/ic_folder_gray900_20.png";

import ResumeHeaderTitle from "@/pages/Resume/ResumeDetail/parts/ResumeHeaderTitle";
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

const educationItems = [
  {
    school: "위드대학교",
    start: "2010.03",
    end: "2015.03",
    major: "컴퓨터공학과",
    status: "졸업",
  },
];

export default function ResumeSection() {
  return (
    <div className="report-content">
      <span className="report-content__main-summary">
        성장하는 개발자, 준비된 홍길동입니다.
      </span>

      {/* ... AI 요약 박스 생략 ... */}

      <div className="resume-page__main">
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

          <ResumeCareerSection totalLabel="(총 0년 0개월)" items={careerItems} />

          {/* ✅ 여기: items 배열로 넘기기 */}
          <ResumeEducationSection items={educationItems} />

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
                bullets: [
                  "커머스 플랫폼 스타트업 대표와 개발자들의 시장 분석 및 실제 시뮬레이션 적용",
                ],
              },
            ]}
          />

          <ResumeAwardsSection
            items={[
              {
                title: "[자격증] 정보처리기사",
                start: "2017.09",
                issuer: "한국산업인력공단",
              },
              {
                title: "[수상] SW 공모전 우수상",
                start: "2022.11",
                issuer: "OO대학교",
              },
            ]}
          />

          <ResumePortfolioSection
            defaultIcons={{
              file: ic_folder_gray900_20,
              link: ic_link_gray900_20,
            }}
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
    </div>
  );
}
