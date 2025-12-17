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

type EducationItem = {
  school: string;
  start: string;
  end: string;
  major: string;
  status: string;
};

type Props = {
  id?: number;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 ID별 데이터 정의
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const data1 = {
  name: "정유리",
  meta: "1997년생(만 28세), 여성",
  email: "jeongyuri@withmind.net",
  phone: "010-2235-6767",
  imageSrc: test_resume_img,
  summary: "성장하는 기획자 정유리입니다.",
  matchRate: "92%",
  // ✅ AI 분석 요약 추가
  aiAnalysis: {
    items: [
      {
        title: "1. 기술적 적합성",
        desc: "정유리 후보자는 Figma와 Google Analytics를 활용한 사용자 중심 기획 경험이 풍부하며, 데이터 기반 의사결정을 통해 전환율을 15% 향상시킨 구체적인 성과가 있습니다. 이는 우리 팀의 UX/UI 개선 프로젝트에 즉시 기여할 수 있는 핵심 역량입니다.",
      },
      {
        title: "2. 경험과 성과",
        desc: "개발팀과의 긴밀한 협업 경험과 기능 명세서 작성, QA 진행 등 실무 프로세스 전반에 대한 이해도가 높습니다. 다양한 직군과의 원활한 소통 능력은 크로스펑셔널 팀에서 중요한 자산이 될 것입니다.",
      },
      {
        title: "3. 문제 해결 능력",
        desc: "UX/UI 디자인 부트캠프를 수료하고 실무에서 사용자 행동 분석을 통한 개선 작업을 진행한 경험이 있어, 사용자 니즈를 정확히 파악하고 이를 제품에 반영하는 능력이 검증되었습니다.",
      },
      {
        title: "4. 팀워크 및 협업 능력",
        desc: "디지털정보활용능력 자격증 취득과 지속적인 자기계발을 통해 최신 기획 트렌드를 습득하고 있으며, 빠르게 변화하는 디지털 환경에 능동적으로 대응할 수 있는 성장 마인드를 보유하고 있습니다.",
      },
    ],
  },
  locations: [{ city: "서울", district: "강남구" }],
  careers: [
    {
      company: "디지털플랫폼",
      start: "2022.06",
      end: "2025.06",
      isCurrent: false,
      tenure: "(2년)",
      employment: "정규직",
      role: "웹 기획자",
      level: "주니어",
      bullets: [
        "• 커머스 플랫폼 리뉴얼 프로젝트 기획 및 UX/UI 개선",
        "• 사용자 행동 데이터 분석을 통한 전환율 15% 향상",
        "• Figma를 활용한 와이어프레임 및 프로토타입 제작",
        "• 개발팀과 협업하여 기능 명세서 작성 및 QA 진행",
        "• Google Analytics 기반 사용자 경험 개선 제안",
      ],
    },
  ] as CareerItem[],
  educations: [
    {
      school: "경기대학교",
      start: "2016.03",
      end: "2020.02",
      major: "경영학과",
      status: "졸업",
    },
  ] as EducationItem[],
  desiredRoles: ["기술 기획", "서비스 기획", "웹 기획", "UX 디자인"],
  hardSkills: ["Figma", "Google Analytics", "Notion", "Jira"],
  softSkills: ["커뮤니케이션", "문제 해결 능력", "데이터 분석"],
  activities: [
    {
      title: "[교육] UX/UI 디자인 부트캠프",
      start: "2021.09",
      end: "2022.03",
      bullets: ["사용자 중심 디자인 방법론 학습 및 실무 프로젝트 수행"],
    },
  ],
  awards: [
    {
      title: "[자격증] 디지털정보활용능력(DIAT) 고급",
      start: "2020.06",
      issuer: "한국생산성본부",
    },
  ],
  portfolios: [
    { kind: "file" as const, name: "정유리_기획포트폴리오.pdf" },
    { kind: "link" as const, url: "https://portfolio.jeongyuri.com" },
  ],
  selfIntro:
    "2년 8개월차 웹 기획자 정유리입니다. 사용자 중심의 서비스 설계와 데이터 기반 의사결정에 강점이 있습니다. Figma를 활용한 프로토타이핑과 GA를 통한 사용자 행동 분석 경험을 바탕으로, 실질적인 비즈니스 성과를 만들어내는 기획자로 성장하고 있습니다.",
  mockInterview: {
    title: "92점ㆍ웹 기획자ㆍ25.01.15 [성장하는 기획자 정유리입니다.]",
  },
};

// ✅ 2. 이택진 (백엔드 개발자, 경력 5년 8개월, 적합률 60%)
const data2 = {
  name: "이택진",
  meta: "1991년생(만 34세), 남성",
  email: "leetaekjin@devmail.com",
  phone: "010-3556-7890",
  imageSrc: test_resume_img,
  summary: "안정적인 서버를 만드는 백엔드 개발자 이택진입니다.",
  matchRate: "60%",
  // ✅ AI 분석 요약 추가
  aiAnalysis: {
    items: [
      {
        title: "1. 기술적 적합성",
        desc: "이택진 후보자는 Spring Boot, JPA, Kafka 등 우리가 사용하는 핵심 기술 스택에 대한 실무 경험을 보유하고 있습니다. 특히 MSA 아키텍처 설계 경험은 우리 팀의 마이크로서비스 전환 프로젝트에 도움이 될 것으로 예상됩니다.",
      },
      {
        title: "2. 경험과 성과",
        desc: "Redis 캐싱을 통한 API 응답 속도 40% 개선, JPA 쿼리 최적화로 데이터베이스 부하 30% 감소 등 구체적인 성과 지표가 있어, 성능 개선에 대한 경험과 역량을 확인할 수 있습니다.",
      },
      {
        title: "3. 문제 해결 능력",
        desc: "기술적 지식은 충분하나, 면접에서 다소 높은 긴장도를 보였으며 답변의 구조화와 자신감 있는 태도가 필요합니다. 실제 업무에서는 기술 역량을 충분히 발휘할 수 있을 것으로 보이나, 커뮤니케이션 스킬 향상이 권장됩니다.",
      },
      {
        title: "4. 팀워크 및 협업 능력",
        desc: "AWS 자격증 취득과 오픈소스 기여 활동을 통해 지속적인 학습 의지를 확인할 수 있습니다. 다만 현재 역량과 포지션 요구사항 간 일부 갭이 있어, 온보딩 기간 동안 집중적인 지원이 필요할 수 있습니다.",
      },
    ],
  },
  locations: [{ city: "경기도", district: "성남" }],
  careers: [
    {
      company: "테크솔루션",
      start: "2022.03",
      end: "2025.04",
      isCurrent: false,
      tenure: "(3년 1개월)",
      employment: "정규직",
      role: "서버 개발자",
      level: "시니어",
      bullets: [
        "• Spring Boot 기반 MSA 아키텍처 설계 및 구축",
        "• Kafka를 활용한 이벤트 기반 비동기 처리 시스템 개발",
        "• Redis 캐싱 전략 도입으로 API 응답 속도 40% 개선",
        "• JPA 쿼리 최적화를 통한 데이터베이스 부하 30% 감소",
        "• Jenkins + Docker 기반 CI/CD 파이프라인 구축",
      ],
    },
    {
      company: "스타트업코리아",
      start: "2019.05",
      end: "2022.02",
      isCurrent: false,
      tenure: "(2년 9개월)",
      employment: "정규직",
      role: "백엔드 개발자",
      level: "주니어",
      bullets: [
        "• Java/Spring 기반 RESTful API 설계 및 개발",
        "• MySQL 데이터베이스 스키마 설계 및 쿼리 최적화",
        "• AWS EC2, RDS를 활용한 서버 인프라 구축",
        "• Git을 활용한 버전 관리 및 코드 리뷰 문화 정착",
        "• 레거시 코드 리팩토링 및 테스트 커버리지 60% 달성",
      ],
    },
  ] as CareerItem[],
  educations: [
    {
      school: "서울대학교",
      start: "2010.03",
      end: "2017.02",
      major: "컴퓨터공학과",
      status: "졸업",
    },
  ] as EducationItem[],
  desiredRoles: ["서버 개발", "백엔드 개발", "Java 개발"],
  hardSkills: [
    "Java",
    "Spring Boot",
    "JPA",
    "MySQL",
    "Redis",
    "Kafka",
    "Docker",
    "AWS",
  ],
  softSkills: ["문제 해결 능력", "팀워크", "코드 리뷰"],
  activities: [
    {
      title: "[오픈소스] Spring Framework 기여",
      start: "2021.01",
      end: "2023.12",
      bullets: ["Spring Boot 관련 이슈 해결 및 PR 제출 (총 5건 머지)"],
    },
  ],
  awards: [
    {
      title: "[자격증] AWS Certified Solutions Architect",
      start: "2021.11",
      issuer: "Amazon Web Services",
    },
    {
      title: "[자격증] 정보처리기사",
      start: "2018.05",
      issuer: "한국산업인력공단",
    },
  ],
  portfolios: [
    { kind: "file" as const, name: "이택진_기술포트폴리오.pdf" },
    { kind: "link" as const, url: "https://github.com/leetaekjin" },
  ],
  selfIntro:
    "5년 8개월차 백엔드 개발자 이택진입니다. Spring Boot와 JPA를 활용한 서버 개발 및 MSA 아키텍처 설계 경험이 있으며, 성능 최적화와 안정적인 시스템 구축에 강점을 가지고 있습니다. 최근에는 Kafka 기반 이벤트 드리븐 아키텍처를 도입하여 서비스 확장성을 크게 개선했습니다. 효율적이고 안정적인 시스템을 만드는 개발자가 되고 싶습니다.",
  mockInterview: {
    title:
      "60점ㆍ백엔드 개발자ㆍ25.01.10 [안정적인 서버를 만드는 백엔드 개발자 이택진입니다.]",
  },
};

// ✅ 3. 임서하 (프론트엔드 개발자, 경력 3년 1개월, 적합률 80%)
const data3 = {
  name: "임서하",
  meta: "1992년생(만 33세), 여성",
  email: "imseoha@frontend.dev",
  phone: "010-4567-8901",
  imageSrc: test_resume_img,
  summary: "사용자 경험을 최우선으로 하는 프론트엔드 개발자 임서하입니다.",
  matchRate: "80%",
  // ✅ AI 분석 요약 추가
  aiAnalysis: {
    items: [
      {
        title: "1. 기술적 적합성",
        desc: "임서하 후보자는 React와 TypeScript에 대한 깊이 있는 이해를 바탕으로 SPA 개발 경험이 풍부합니다. Redux Toolkit, React Query 등 최신 상태 관리 도구 활용 경험은 우리 프로젝트의 기술 스택과 완벽히 일치합니다.",
      },
      {
        title: "2. 경험과 성과",
        desc: "Webpack에서 Vite로의 전환을 통해 빌드 속도를 70% 단축시키고, Lighthouse 점수를 85점에서 95점으로 개선한 구체적인 성과가 있습니다. 이러한 성능 최적화 경험은 우리 서비스의 사용자 경험 개선에 큰 기여를 할 것입니다.",
      },
      {
        title: "3. 문제 해결 능력",
        desc: "면접에서 보인 적극적이고 열정적인 태도, 그리고 실무 경험을 바탕으로 한 구체적인 답변이 인상적이었습니다. 최신 프론트엔드 트렌드를 빠르게 학습하고 프로젝트에 적용하는 능력이 검증되었습니다.",
      },
      {
        title: "4. 팀워크 및 협업 능력",
        desc: "프론트엔드 스터디 운영 경험과 지속적인 기술 학습 태도를 통해 팀 내에서 긍정적인 영향을 줄 수 있는 인재입니다. 백엔드 이해도를 높이면 풀스택에 가까운 역량을 발휘할 수 있을 것으로 기대됩니다.",
      },
    ],
  },
  locations: [
    { city: "서울", district: "마포구" },
    { city: "서울", district: "용산구" },
  ],
  careers: [
    {
      company: "프론티어웹",
      start: "2021.12",
      end: "재직중",
      isCurrent: true,
      tenure: "(3년 1개월)",
      employment: "정규직",
      role: "프론트엔드 개발자",
      level: "중급",
      bullets: [
        "• React + TypeScript 기반 SPA 웹 애플리케이션 개발",
        "• Redux Toolkit을 활용한 상태 관리 아키텍처 설계",
        "• Webpack → Vite 전환으로 빌드 속도 70% 단축",
        "• React Query 도입으로 서버 상태 관리 효율화",
        "• Lighthouse 점수 85점 → 95점 개선 (성능 최적화)",
      ],
    },
  ] as CareerItem[],
  educations: [
    {
      school: "가천대학교",
      start: "2011.03",
      end: "2018.02",
      major: "컴퓨터공학과",
      status: "졸업",
    },
  ] as EducationItem[],
  desiredRoles: ["웹 개발", "프론트엔드 개발", "React 개발"],
  hardSkills: [
    "React",
    "TypeScript",
    "JavaScript",
    "HTML/CSS",
    "Webpack",
    "Vite",
    "Redux",
    "React Query",
  ],
  softSkills: ["UI/UX 감각", "협업 능력", "문제 해결"],
  activities: [
    {
      title: "[스터디] 프론트엔드 개발자 스터디",
      start: "2020.03",
      end: "2021.11",
      bullets: ["매주 최신 프론트엔드 기술 트렌드 공유 및 토이 프로젝트 진행"],
    },
  ],
  awards: [
    {
      title: "[수상] 해커톤 우수상",
      start: "2022.08",
      issuer: "가천대학교",
    },
  ],
  portfolios: [
    { kind: "file" as const, name: "임서하_프론트엔드포트폴리오.pdf" },
    { kind: "link" as const, url: "https://seoha-portfolio.vercel.app" },
  ],
  selfIntro:
    "3년 1개월차 프론트엔드 개발자 임서하입니다. React와 TypeScript를 활용한 모던 웹 개발에 강점이 있으며, 사용자 경험을 최우선으로 생각하는 개발자입니다. 성능 최적화와 접근성 개선을 통해 더 나은 웹을 만들고자 노력하고 있으며, 최신 프론트엔드 기술 트렌드를 빠르게 습득하여 프로젝트에 적용하는 것을 즐깁니다.",
  mockInterview: {
    title:
      "80점ㆍ프론트엔드 개발자ㆍ25.01.12 [사용자 경험을 최우선으로 하는 프론트엔드 개발자 임서하입니다.]",
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 메인 컴포넌트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ResumeSection({ id = 1 }: Props) {
  console.log("ResumeSection id:", id);

  // ✅ id에 따라 데이터 선택
  const data = id === 1 ? data1 : id === 2 ? data2 : id === 3 ? data3 : data1;

  return (
    <div className="report-content">
      {/* ✅ AI 적합률 분석 */}
      <div className="ai-match">
        <div className="ai-match-score">
          <span className="ai-match-label">AI 적합률</span>
          <span className="ai-match-value">{data.matchRate}</span>
        </div>

        <div className="ai-match-summary">
          <span className="ai-match-summary-title">분석 요약</span>

          {data.aiAnalysis.items.map((item, index) => (
            <div key={index} className="ai-match-item">
              <span className="ai-match-item-title">{item.title}</span>
              <span className="ai-match-item-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 이력서 내용 */}
      <div className="resume-page__main">
        <div className="resume-detail__content">
          <ResumeBasicInfo
            name={data.name}
            meta={data.meta}
            email={data.email}
            phone={data.phone}
          />

          <ResumeFieldSection
            label="희망 근무 지역"
            className="resume-field--location"
            valueAs="div"
            valueClassName="resume-location-list"
          >
            <ResumeLocationList items={data.locations} />
          </ResumeFieldSection>

          <ResumeCareerSection
            totalLabel={`(총 ${data.careers[0].tenure})`}
            items={data.careers}
          />

          <ResumeEducationSection items={data.educations} />

          <ResumeDesiredRoleSection items={data.desiredRoles} />

          <ResumeHardSkillsSection items={data.hardSkills} />

          <ResumeSoftSkillsSection items={data.softSkills} />

          <ResumeActivitiesSection items={data.activities} />

          <ResumeAwardsSection items={data.awards} />

          <ResumePortfolioSection
            defaultIcons={{
              file: ic_folder_gray900_20,
              link: ic_link_gray900_20,
            }}
            items={data.portfolios}
          />

          <ResumeSelfIntroSection text={data.selfIntro} />

          <ResumeMockInterviewSection
            lastItem
            defaultIcon={ic_folder_gray900_20}
            items={[{ title: data.mockInterview.title }]}
          />
        </div>
      </div>
    </div>
  );
}