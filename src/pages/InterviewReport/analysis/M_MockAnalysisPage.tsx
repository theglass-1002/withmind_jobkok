import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {useStickyTabs} from '@/shared/utils/util'; 
import test_company_logo from "@/assets/testImg/company_logo/test_company_logo.png";
import ic_saramin_18 from "@/assets/icons/size18/ic_saramin_18.png";
import ic_star_green_18 from "@/assets/icons/size18/ic_star_green_18.png";
import ic_fire_16 from "@/assets/icons/size16/ic_fire_16.png";
import ic_seed_16 from "@/assets/icons/size16/ic_seed_16.png";
import ic_print_gray900_24 from "@/assets/icons/size24/ic_print_gray900_24.png";
import ic_arrow_left_gray900_20 from "@/assets/icons/size20/ic_arrow_left_gray900_20.png";
import ic_star_white_20 from "@/assets/icons/size20/ic_star_white_20.png";
import ic_weakness_circle_24 from "@/assets/icons/size24/ic_weakness_circle_24.png";
import ic_strength_circle_24 from "@/assets/icons/size24/ic_strength_circle_24.png";

import Tabs from "@/shared/components/tabs/Tabs";
import M_MockAnalysisHeader from "./M_MockAnalysisHeader";
import OverviewPage from "./overview/OverviewPage";
import DetailPage from "./detail/DetailPage";
import ResumeInterviewMatchPage from "./match/ResumeInterviewMatchPage";

import KpiRadarChart from "@/pages/InterviewReport/analysis/chart/KpiRadarChart";

import "./mock-analysis.css";

const mockJobs = [
  {
    jobIdx: 101,
    logoSrc: test_company_logo,
    company: "위드마인드",
    sourceLogoSrc: ic_saramin_18,
    role: "프로젝트 기획자",
    isBookmarked: true,
    matchPercent: 70,
    matchIconSrc: ic_star_green_18,
    locationMeta: "서울 마포구ㆍ신입 이상ㆍ대졸 이상",
    employmentMeta: "정규직ㆍ계약직",
    deadline: "~2025.08.31(일)",
    badges: [
      { text: "재택근무ㆍ유연근무제", iconSrc: ic_seed_16 },
      { text: "인기있는ㆍ마감임박", iconSrc: ic_fire_16 },
    ],
  },
  {
    jobIdx: 102,
    logoSrc: test_company_logo,
    company: "에이프로소프트",
    sourceLogoSrc: ic_saramin_18,
    role: "프론트엔드 엔지니어",
    isBookmarked: false,
    matchPercent: 84,
    matchIconSrc: ic_star_green_18,
    locationMeta: "서울 서초구ㆍ1~3년ㆍ학력무관",
    employmentMeta: "정규직",
    deadline: "~2025.09.10(수)",
    badges: [
      { text: "재택 선택 가능", iconSrc: ic_seed_16 },
      { text: "마감임박", iconSrc: ic_fire_16 },
    ],
  },
  {
    jobIdx: 103,
    logoSrc: test_company_logo,
    company: "넥스트랩",
    sourceLogoSrc: ic_saramin_18,
    role: "웹 프론트엔드",
    isBookmarked: false,
    matchPercent: 77,
    matchIconSrc: ic_star_green_18,
    locationMeta: "경기 성남시ㆍ신입~3년ㆍ대졸",
    employmentMeta: "정규직",
    deadline: "~2025.09.25(목)",
    badges: [{ text: "리액트ㆍ타입스크립트", iconSrc: ic_seed_16 }],
  },
  {
    jobIdx: 104,
    logoSrc: test_company_logo,
    company: "브라이트테크",
    sourceLogoSrc: ic_saramin_18,
    role: "UI 개발자",
    isBookmarked: true,
    matchPercent: 81,
    matchIconSrc: ic_star_green_18,
    locationMeta: "서울 강남구ㆍ3~5년ㆍ학력무관",
    employmentMeta: "정규직",
    deadline: "~2025.10.02(목)",
    badges: [{ text: "디자인 협업 우대", iconSrc: ic_seed_16 }],
  },
  {
    jobIdx: 105,
    logoSrc: test_company_logo,
    company: "에버소스",
    sourceLogoSrc: ic_saramin_18,
    role: "프론트엔드(React)",
    isBookmarked: false,
    matchPercent: 73,
    matchIconSrc: ic_star_green_18,
    locationMeta: "부산 해운대구ㆍ신입~2년ㆍ학력무관",
    employmentMeta: "계약직",
    deadline: "~2025.10.15(수)",
    badges: [{ text: "원격 근무 가능", iconSrc: ic_seed_16 }],
  },
];

type TabKey = "overview" | "detail" | "match";

export default function M_MockAnalysisPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [jobs, setJobs] = useState(mockJobs);
  const location = useLocation();
  const score = 40;
  const tabItems: { key: TabKey; label: React.ReactNode }[] = [
    { key: "overview", label: "종합 분석" },
    { key: "detail", label: "상세 분석" },
    { key: "match", label: "이력서−면접 일치도 분석" },
  ];

  const handleTabClick = (key: TabKey) => setActiveTab(key);


   const isTabsSticky = useStickyTabs(
    "sticky-trigger",
    ".default_tabs",
    ".page-header")

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as TabKey;
    
    if (tabParam && ['overview', 'detail', 'match'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);
 
  const handleOpenPrintPage = () => {
    const currentUrl = window.location.href;
    const separator = currentUrl.includes("?") ? "&" : "?";
    const printUrl = `${currentUrl}${separator}printViewr&tab=${activeTab}`;

    const A4_WIDTH = 794;
    const A4_HEIGHT = 1123;

    const left = Math.max(0, Math.round((window.screen.availWidth - A4_WIDTH) / 2));
    const top = Math.max(0, Math.round((window.screen.availHeight - A4_HEIGHT) / 2));

    const features = [
      `width=${A4_WIDTH}`,
      `height=${A4_HEIGHT}`,
      `left=${left}`,
      `top=${top}`,
      "menubar=no",
      "toolbar=no",
      "location=no",
      "status=no",
      "scrollbars=yes",
      "resizable=yes",
    ].join(",");

    const popup = window.open(printUrl, "_blank", features);

    if (popup) {
      const enforceSize = () => {
        try {
          popup.resizeTo(A4_WIDTH, A4_HEIGHT);
          popup.moveTo(left, top);
        } catch {
          /* noop */
        }
      };
      enforceSize();
      popup.addEventListener?.("load", enforceSize);
    }
  };


  const handleToggleFavorite = (id: number | string, nextValue?: boolean) => {
    setJobs(prev =>
      prev.map(j =>
        j.jobIdx === id ? { ...j, isBookmarked: nextValue ?? !j.isBookmarked } : j
      )
    );
  };

  return (
    <>
    <div className="mock-analysis mobile">
      <div className="mock-analysis__inner page-summary">
        <div className="mock-analysis__header_container">
        <M_MockAnalysisHeader
          title="분석결과"
          date="2025.12.10 00:00"
          status="진행 완료"
          activeTab={activeTab} 
          metaRows={[
            [
              { key: "이름", value: "" },
              { key: "아이디", value: "" },
            ],
            [
              { key: "희망직무", value: "" },
              { key: "선택 이력서", value: "" },
            ],
            [
              { key: "신뢰도", value: "" },
              { key: "면접시간", value: "" },
            ],
          ]}
        />
      </div>
       
        <Tabs
            tabs={tabItems}
            active={activeTab}
            onChange={(key) => handleTabClick(key as TabKey)}
            className={`mock-analysis-tabs default_tabs ${isTabsSticky?'is-sticky':''}`}
            itemClassName="mock-analysis-tabs__item "
            activeClassName="on"
          />
      </div>

      <div id="sticky-trigger" className="mock-analysis-panel mock-analysis-report">
        <div className="mock-analysis-report__container">
          <div className="mock-analysis-report__inner">
            <span className="mock-analysis-report__icon-btn" 
            onClick={handleOpenPrintPage}
            role="button" aria-label="리포트 인쇄">
              <img className="mock-analysis-report__icon" src={ic_print_gray900_24} alt="" />
            </span>

            {/* {activeTab === "overview" && (
              <OverviewPage
              
                score={score}
                totalCandidates={171}
                percentile={10}
                fit={80}
                jobs={jobs}
                onToggleFavorite={handleToggleFavorite}
                scoreSection={{
                  labels: [
                    ["0", "~9"],
                    ["10", "~19"],
                    ["20", "~35"],
                    ["36", "~45"],
                    ["46", "~59"],
                    ["60", "~75"],
                    ["76", "~85"],
                    ["86", "~93"],
                    ["94", "~100"],
                  ],
                  max: 100,
                  left: {
                    role: "개발직군",
                    rankText: "응시자 2,851명 중 7위",
                    badgeText: "상위 10%",
                    values: [50, 30, 20, 60, 92, 80, 70, 100, 50],
                    highlightScore: 38,
                  },
                  right: {
                    role: "프론트엔드 직무",
                    rankText: "응시자 267명 중 17위",
                    badgeText: "상위 10%",
                    values: [50, 30, 20, 60, 92, 80, 70, 100, 50],
                    highlightScore: 48,
                  },
                }}
                categorySummary={{
                  left: {
                    scoreTitle: "",
                    scores: { attitude: 92, voice: 80, tension: 10, competence: 30 },
                    RadarChartComponent: KpiRadarChart,
                  },
                  right: {
                    items: [
                      {
                        label: "역량",
                        gradeText: "최우수",
                        gradeTone: "excellent",
                        description:
                          "면접 과정에서 보인 의사소통능력과 문제해결능력은 매우 우수한 것으로 평가됩니다. 잘 이해하고 뛰어난 의사소통 기술을 보였으며, 문제의 핵심을 파악하고 해결책을 제시하는 등 전화 상담원으로서의 역량이 뛰어나다고 판단됩니다.",
                      },
                      {
                        label: "태도",
                        gradeText: "우수",
                        gradeTone: "good",
                        description:
                          "면접 과정에서 보인 의사소통능력과 문제해결능력은 매우 우수한 것으로 평가됩니다. 잘 이해하고 뛰어난 의사소통 기술을 보였으며, 문제의 핵심을 파악하고 해결책을 제시하는 등 전화 상담원으로서의 역량이 뛰어나다고 판단됩니다.",
                      },
                      {
                        label: "목소리",
                        gradeText: "보통",
                        gradeTone: "fair",
                        description:
                          "면접 과정에서 보인 의사소통능력과 문제해결능력은 매우 우수한 것으로 평가됩니다. 잘 이해하고 뛰어난 의사소통 기술을 보였으며, 문제의 핵심을 파악하고 해결책을 제시하는 등 전화 상담원으로서의 역량이 뛰어나다고 판단됩니다.",
                      },
                      {
                        label: "긴장도",
                        gradeText: "보통",
                        gradeTone: "improvement",
                        description:
                          "면접 과정에서 보인 의사소통능력과 문제해결능력은 매우 우수한 것으로 평가됩니다. 잘 이해하고 뛰어난 의사소통 기술을 보였으며, 문제의 핵심을 파악하고 해결책을 제시하는 등 전화 상담원으로서의 역량이 뛰어나다고 판단됩니다.",
                      },
                    ],
                  },
                }}
                aiSummary={{
                  strength: {
                    iconSrc: ic_strength_circle_24,
                    label: "강점",
                    tags: ["효과적 의견 교환", "타인에 대한 신뢰"],
                    description: "",
                  },
                  weakness: {
                    iconSrc: ic_weakness_circle_24,
                    label: "약점",
                    tags: ["의사소통 기술 활용", "타인 이해"],
                    description: "",
                  },
                }}
              />
            )}

            {activeTab === "detail" && (
              <DetailPage
              competence_score={80}
              attitude_score={10}
              voice_score={45}
              tension_score={20}
              />
            )}

            {activeTab === "match" && (
              <ResumeInterviewMatchPage
              onToggleFavorite={handleToggleFavorite}
              jobs={jobs}
              />
            )} */}

            <div className="btn_wrap mock-analysis-report__actions">
              <span className="default_btn_white">
                <img className="mock-analysis-report__btn-icon" src={ic_print_gray900_24} alt="" />
              </span>
              <span className="btn_w_full default_btn_black">
                <img className="mock-analysis-report__btn-icon" src={ic_star_white_20} alt="" />
                모의면접 다시 보기
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}